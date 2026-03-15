import InputElement from "../../components/Authentication/InputElement";
import MainNavbar from "../../components/dashboard/MainNavbar";
import { useForm } from "react-hook-form";
import {
  FileText,
  Tag,
  Languages,
  AlignLeft,
  ChevronDown,
  Landmark,
  Edit,
  Save,
  Trash2,
  Download,
} from "lucide-react";
import SelectElement from "../../components/ui/SelectElement";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { useGetTagByIdQuery, useUpdateTagMutation } from "../../api/tags.api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { LANGUAGES } from "../../data/translateLanguage";
import Spinner from "../../components/ui/Spinner";

// const LANGUAGES = [
//   { code: "en", label: "English" },
//   { code: "hi", label: "Hindi" },
//   { code: "fr", label: "French" },
//   { code: "es", label: "Spanish" },
//   { code: "de", label: "German" },
// ];

const OUTPUT_FORMAT = [
  { code: "CSV", label: "CSV" },
  { code: "XML", label: "XML" },
  { code: "JSON", label: "JSON" },
];

const buildTagVM = (apiTag) => {
  if (!apiTag) return null;

  return {
    id: apiTag.id,
    name: apiTag.name || "",
    description: apiTag.description || "",
    industry: apiTag.industry || "",
    type: apiTag.type || "IDP",

    outputFormat: apiTag.outputFormat || "CSV",
    originalFormat: apiTag.originalFormat || "CSV",

    // fieldCount: apiTag.fieldCount || 0,

    user_prompt: apiTag.user_prompt || "",
    rawSchema: apiTag.rawSchemaContent || "",
    sampleOutput: apiTag.sample_output || "",

    // ✅ TRANSLATION fields
    sourceLanguage: apiTag.sourceLanguage || "",
    targetLanguage: apiTag.targetLanguage || "",
    glossaryContent: apiTag.glossaryContent || {},

    isFavorite: apiTag.isFavorite || false,
    isActive: apiTag.isActive ?? true,

    createdAt: apiTag.createdAt,
    updatedAt: apiTag.updatedAt,
  };
};

const prettyJson = (text) => {
  try {
    const obj = typeof text === "string" ? JSON.parse(text) : text;
    return JSON.stringify(obj, null, 2);
  } catch {
    return text; // fallback if invalid JSON
  }
};

const prettyXml = (xml) => {
  try {
    const PADDING = "  ";
    let formatted = "";
    let pad = 0;

    xml
      .replace(/>\s*</g, "><")
      .split(/(?=<)|(?<=>)/g)
      .filter(Boolean)
      .forEach((node) => {
        if (node.match(/^<\/\w/)) pad -= 1;
        formatted += PADDING.repeat(pad) + node + "\n";
        if (node.match(/^<\w[^>]*[^/]>/)) pad += 1;
      });

    return formatted.trim();
  } catch {
    return xml;
  }
};

const isValidJson = (text) => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

const isValidXml = (text) => {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const parserError = xml.getElementsByTagName("parsererror");
    return parserError.length === 0;
  } catch {
    return false;
  }
};

const isValidCsv = (text) => {
  // Very basic CSV validation: at least one row and consistent columns
  try {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return false;

    const colCount = lines[0].split(",").length;
    if (colCount < 1) return false;

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].split(",").length !== colCount) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
};

const ViewTag = () => {
  const navigate = useNavigate();

  const { toolType, tagAction, tagId } = useParams();
  const isIdp = toolType === "idp";
  const isViewMode = tagAction === "view";
  const isEditMode = tagAction === "edit";

  // FETCH TAGS DATA FROM API
  const stableTagId = useMemo(() => tagId, [tagId]);

  const {
    data: tagData,
    isLoading,
    isError,
  } = useGetTagByIdQuery(stableTagId, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  console.log(tagData);

  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();

  const [previewFormat, setPreviewFormat] = useState("JSON");
  const applicationId = isIdp ? "IDP" : "TRANSLATION";
  const organizationId = "temporary It's fetching from auth";

  const [glossaryMode, setGlossaryMode] = useState("manual"); // or "upload" if you want
  const [glossaryRows, setGlossaryRows] = useState([]);
  const [idpPreviewTab, setIdpPreviewTab] = useState("output"); // "output" | "schema"

  const [schemaText, setSchemaText] = useState(""); // rawSchemaContent from API
  const [apiOutputFormat, setApiOutputFormat] = useState("CSV"); // from API

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      tagName: "",
      description: "",
      prompt: "",
      tagIndustry: "",
      tagCategory: "",
      outputFormat: "",
      sourceLanguage: "",
      targetLanguage: "",
    },
  });
  const sourceLanguage = watch("sourceLanguage");

  const fileInputRef = useRef(null);

  const tagVM = useMemo(() => buildTagVM(tagData), [tagData]);

  const originalRef = useRef(null);
  const lastSyncedTagIdRef = useRef(null);

  // Only sync schema from API when we load a different tag (tagId change), not on every tagVM update (e.g. refetch)
  // so typing in the textarea doesn't get overwritten and doesn't trigger extra API rounds
  const syncSchemaFromTagVM = useCallback(() => {
    if (!tagVM) return;
    // setValue("tagName", tagVM.name);
    // setValue("description", tagVM.description);
    // setValue(isIdp ? "tagIndustry" : "tagCategory", tagVM.industry);
    // setValue("outputFormat", tagVM.outputFormat);
    // // ✅ Translation fields
    // setValue("sourceLanguage", tagVM.sourceLanguage || "");
    // setValue("targetLanguage", tagVM.targetLanguage || "");

    reset({
      tagName: tagVM.name || "",
      description: tagVM.description || "",
      prompt: tagVM.user_prompt || "",
      tagIndustry: isIdp ? tagVM.industry || "" : "",
      tagCategory: !isIdp ? tagVM.industry || "" : "",
      outputFormat: tagVM.outputFormat || "",
      sourceLanguage: tagVM.sourceLanguage || "",
      targetLanguage: tagVM.targetLanguage || "",
    });

    // ✅ Glossary from API -> rows
    setGlossaryRows(glossaryObjectToRows(tagVM.glossaryContent));

    // setSchemaText(tagVM.rawSchema);
    setSchemaText(tagVM.sampleOutput);
    setApiOutputFormat(tagVM.outputFormat);
    setPreviewFormat(tagVM.outputFormat);
    originalRef.current = {
      name: tagVM.name,
      description: tagVM.description,
      industry: tagVM.industry,
      outputFormat: tagVM.outputFormat,
      rawSchemaContent: tagVM.rawSchema,
      prompt: tagVM.user_prompt,

      // ✅ Translation originals
      source_lang: tagVM.sourceLanguage || "",
      target_lang: tagVM.targetLanguage || "",
      glossary_content: tagVM.glossaryContent || {},
      // field_count: tagVM.fieldCount || 0,
    };
    lastSyncedTagIdRef.current = stableTagId;
  }, [tagVM, setValue, isIdp, stableTagId]);

  useEffect(() => {
    if (!tagVM) return;
    // Only run sync when we're loading this tag for the first time (or switched to another tag)
    if (lastSyncedTagIdRef.current !== stableTagId) {
      syncSchemaFromTagVM();
    }
  }, [tagVM, stableTagId, syncSchemaFromTagVM]);

  const addRow = () => {
    setGlossaryRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), term: "", keepAs: "" },
    ]);
  };

  const updateRow = (id, field, value) => {
    setGlossaryRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const breadcrumbs = [
    { label: "Tag library", href: `/operations/${toolType}/tags-library` },
    {
      label: "Tag",
      href: `/operations/${toolType}/tag/view/${tagId}`,
    },
    ...(isEditMode
      ? [
          {
            label: "Edit tag",
            href: `/operations/${toolType}/tag/edit/${tagId}`,
          },
        ]
      : []),
  ];

  const rowsToGlossaryObject = (rows) => {
    const obj = {};
    rows.forEach(({ term, keepAs }) => {
      if (term && keepAs) {
        obj[term] = keepAs;
      }
    });
    return obj;
  };

  const glossaryObjectToRows = (glossaryObj) => {
    return Object.entries(glossaryObj || {}).map(([term, keepAs]) => ({
      id: crypto.randomUUID(),
      term,
      keepAs,
    }));
  };

  const onSubmit = async (formData) => {
    try {
      const original = originalRef.current;

      // ✅ Validate schema for IDP before saving
      // if (isIdp) {
      //   const text = schemaText?.trim();

      //   if (!text) {
      //     toast.error("Schema cannot be empty");
      //     return;
      //   }

      //   if (apiOutputFormat === "JSON" && !isValidJson(text)) {
      //     toast.error("Invalid JSON schema. Please fix it before saving.");
      //     return;
      //   }

      //   if (apiOutputFormat === "XML" && !isValidXml(text)) {
      //     toast.error("Invalid XML schema. Please fix it before saving.");
      //     return;
      //   }

      //   if (apiOutputFormat === "CSV" && !isValidCsv(text)) {
      //     toast.error("Invalid CSV format. Please fix it before saving.");
      //     return;
      //   }
      // }

      if (!original) {
        toast.error("Original data not loaded yet");
        return;
      }

      const normalize = (v) => (typeof v === "string" ? v.trim() : v);

      const glossaryObj = rowsToGlossaryObject(glossaryRows);
      // const fieldCount = glossaryRows.filter((r) => r.term && r.keepAs).length;

      const current = {
        name: formData.tagName,
        description: formData.description,
        industry: isIdp ? formData.tagIndustry : formData.tagCategory,

        // IDP
        output_format: isIdp ? formData.outputFormat : undefined,
        // raw_schema_content: isIdp ? schemaText : undefined,
        prompt: isIdp ? formData.prompt : undefined,

        // TRANSLATION
        source_lang: !isIdp ? formData.sourceLanguage : undefined,
        target_lang: !isIdp ? formData.targetLanguage : undefined,
        glossary_content: !isIdp ? glossaryObj : undefined,
        // field_count: !isIdp ? fieldCount : undefined,
      };

      // Build diff-only payload
      const patchBody = {};
      Object.keys(current).forEach((key) => {
        if (current[key] === undefined) return;

        const currVal =
          key === "glossary_content"
            ? JSON.stringify(current[key] || {})
            : normalize(current[key]);

        const origVal =
          key === "output_format"
            ? normalize(original.outputFormat)
            : // : key === "raw_schema_content"
              //   ? normalize(original.rawSchemaContent)
              key === "prompt"
              ? normalize(original.prompt)
              : key === "source_lang"
                ? normalize(original.source_lang)
                : key === "target_lang"
                  ? normalize(original.target_lang)
                  : key === "glossary_content"
                    ? JSON.stringify(original.glossary_content || {})
                    : normalize(original[key]);

        if (currVal !== origVal) {
          patchBody[key] = current[key];
        }
      });

      // ✅ If glossary changed, also send field_count
      // if (!isIdp && patchBody.glossary_content !== undefined) {
      //   patchBody.field_count = fieldCount;
      // }

      // If nothing changed, don't call API
      if (Object.keys(patchBody).length === 0) {
        toast.info("No changes to save");
        return;
      }

      patchBody.status = "UPLOADED";

      // ✅ Call API
      await updateTag({ id: tagId, body: patchBody }).unwrap();

      toast.success("Tag updated successfully!");
      navigate(`/operations/${toolType}/tag/view/${tagId}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update tag");
    }
  };

  const prettySchema = useMemo(() => {
    if (!schemaText) return "";

    if (apiOutputFormat === "JSON") return prettyJson(schemaText);
    if (apiOutputFormat === "XML") return prettyXml(schemaText);

    return schemaText; // CSV or unknown → show as-is
  }, [schemaText, apiOutputFormat]);

  const prettyRawSchema = useMemo(() => {
    const raw = tagVM?.rawSchema?.trim();
    if (!raw) return "";
    return prettyJson(raw);
  }, [tagVM?.rawSchema]);

  const handleDownloadOutput = useCallback(() => {
    const content = schemaText?.trim() || "";
    if (!content) {
      toast.info("No output content to download");
      return;
    }
    const baseName = (tagVM?.name || "output").replace(/[^a-zA-Z0-9-_]/g, "_");
    const ext = apiOutputFormat?.toLowerCase() || "csv";
    const filename = `${baseName}-preview.${ext}`;
    let blobContent = content;
    let mimeType = "text/plain";
    if (apiOutputFormat === "JSON") {
      blobContent = prettyJson(content);
      mimeType = "application/json";
    } else if (apiOutputFormat === "XML") {
      blobContent = prettyXml(content);
      mimeType = "application/xml";
    } else {
      mimeType = "text/csv";
    }
    const blob = new Blob([blobContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // toast.success(`Downloaded ${filename}`);
  }, [schemaText, apiOutputFormat, tagVM?.name]);

  const handleDownloadSchema = useCallback(() => {
    const content = prettyRawSchema?.trim() || tagVM?.rawSchema?.trim() || "";
    if (!content) {
      toast.info("No schema content to download");
      return;
    }
    const baseName = (tagVM?.name || "schema").replace(/[^a-zA-Z0-9-_]/g, "_");
    const filename = `${baseName}-schema.json`;
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [tagVM?.name, tagVM?.rawSchema, prettyRawSchema]);

  if (isLoading) {
    return (
      <>
        <MainNavbar />
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <Spinner size={56} />
            <span>Loading tag...</span>
          </div>
        </div>
      </>
    );
  }

  if (isError || !tagVM) {
    return (
      <>
        <MainNavbar />
        <div className="p-10 text-red-600">
          Failed to load tag. Please try again.
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavbar />

      <main className="w-full bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 flex flex-col gap-6">
        <Breadcrumbs items={breadcrumbs} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={isIdp ? ".csv,.json,.xml" : ".csv"}
            hidden
            onChange={(e) => {
              handleGlossaryFiles(e.target.files);
              e.target.value = "";
            }}
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-md px-4 py-3 bg-white w-fit border-b border-indigo-600 font-medium">
              <Tag size={16} />
              <span className="">
                {isViewMode ? "Tag Overview" : "Edit Tag"}
              </span>
            </div>

            {isViewMode ? (
              <Button
                type="button"
                leftIcon={<Edit size={18} />}
                onClick={() => {
                  navigate(`/operations/${toolType}/tag/edit/${tagId}`);
                }}
              >
                Edit
              </Button>
            ) : (
              <Button
                type="submit"
                leftIcon={<Save size={18} />}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>

          {/* Main Container */}
          <div className="w-full bg-gray-50 flex flex-col gap-6">
            {/* First Container */}
            <div className=" flex flex-col gap-6 bg-white border border-gray-300 p-10 rounded-2xl">
              {/* Row-1 */}
              <div className="flex gap-6 items-center">
                <InputElement
                  label="Tag Name"
                  name="tagName"
                  type="text"
                  placeholder="e.g. Legal Document - Formal"
                  icon={Tag}
                  register={register}
                  rules={{ required: "Tag name is required" }}
                  className="w-full"
                  disabled={isViewMode}
                  showRequired={false}
                />

                <InputElement
                  label={isIdp ? "Industry" : "Tag Category"}
                  name={isIdp ? "tagIndustry" : "tagCategory"}
                  type="text"
                  placeholder={
                    isIdp
                      ? "Select Industry..."
                      : "e.g. Finance, Marketing etc..."
                  }
                  icon={isIdp ? Landmark : FileText}
                  register={register}
                  rules={{
                    required: `Tag ${isIdp ? "industry" : "category"} is required`,
                  }}
                  className="w-full"
                  disabled={isViewMode}
                  showRequired={false}
                />
              </div>

              {/* Descreption */}
              <div className="flex gap-6 justify-between w-full">
                <div className="w-full">
                  <label className="text-[#424242] text-[18px] font-medium">
                    Description
                  </label>

                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <AlignLeft size={22} strokeWidth={2} />
                    </div>

                    <textarea
                      {...register("description", {
                        required: "Description is required",
                      })}
                      placeholder="Describe the context, tone, and when to use this label..."
                      rows={4}
                      className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-gray-400"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                {isIdp && (
                  <div className="w-full">
                    <label className="text-[#424242] text-[18px] font-medium">
                      Extraction Prompt
                    </label>

                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <AlignLeft size={22} strokeWidth={2} />
                      </div>

                      <textarea
                        {...register("prompt")}
                        placeholder="Rules and instruction for the extraction..."
                        rows={4}
                        className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-gray-400"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                )}
              </div>

              {isIdp ? (
                <div>
                  <SelectElement
                    label="Select output format"
                    name="outputFormat"
                    register={register}
                    rules={{ required: "Output format is required" }}
                    options={OUTPUT_FORMAT}
                    placeholder="Select output format"
                    disabled={isViewMode}
                    showRequired={false}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <SelectElement
                    label="Source Language"
                    name="sourceLanguage"
                    register={register}
                    rules={{ required: "Source language is required" }}
                    options={LANGUAGES}
                    placeholder="Select language"
                    disabled={isViewMode}
                    showRequired={false}
                  />

                  <SelectElement
                    label="Target Language"
                    name="targetLanguage"
                    register={register}
                    rules={{ required: "Target language is required" }}
                    options={LANGUAGES.map((lang) => ({
                      ...lang,
                      disabled: lang.code === sourceLanguage,
                    }))}
                    placeholder="Select language"
                    disabled={isViewMode}
                    showRequired={false}
                  />
                </div>
              )}
            </div>

            {/* Glossary Card */}
            <div className="px-10 py-8 bg-white border border-gray-300 rounded-2xl flex flex-col gap-6">
              {/* Gloassary Header */}
              {!isIdp && (
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Glossary
                  </h2>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={addRow}
                      className="px-4 py-2 rounded-lg text-indigo-500 font-medium hover:text-indigo-900 cursor-pointer"
                    >
                      + Add Term
                    </button>
                  )}
                </div>
              )}

              {/* MANUAL MODE */}
              {!isIdp && (
                <>
                  {/* VIEW MODE: show message if empty */}
                  {isViewMode && glossaryRows.length === 0 && (
                    <div className="text-gray-500 italic">
                      No glossary terms added for this tag.
                    </div>
                  )}

                  {/* MANUAL MODE (view or edit) */}
                  {glossaryMode === "manual" && glossaryRows.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {/* Table Header */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            New Term
                          </label>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Keep As
                          </label>
                        </div>
                      </div>

                      {/* Rows */}
                      <div className="max-h-64 overflow-y-auto flex flex-col gap-3 pr-2">
                        {glossaryRows.map((row) => (
                          <div
                            key={row.id}
                            className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center"
                          >
                            <input
                              type="text"
                              value={row.term}
                              disabled={isViewMode}
                              onChange={(e) =>
                                updateRow(row.id, "term", e.target.value)
                              }
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 disabled:bg-gray-100"
                            />

                            <input
                              type="text"
                              value={row.keepAs}
                              disabled={isViewMode}
                              onChange={(e) =>
                                updateRow(row.id, "keepAs", e.target.value)
                              }
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 disabled:bg-gray-100"
                            />

                            {isEditMode && (
                              <button
                                type="button"
                                onClick={() =>
                                  setGlossaryRows((prev) =>
                                    prev.filter((r) => r.id !== row.id),
                                  )
                                }
                                className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                                title="Delete row"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add Row (only edit) */}
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={addRow}
                          className="flex items-center gap-2 text-indigo-600 font-medium mt-2"
                        >
                          + Add Row
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

              {isIdp && (
                <>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex rounded-lg border border-gray-300 bg-gray-100/80 p-1">
                        <button
                          type="button"
                          onClick={() => setIdpPreviewTab("output")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            idpPreviewTab === "output"
                              ? "bg-white text-indigo-600 shadow-sm border border-gray-200"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          Output Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => setIdpPreviewTab("schema")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            idpPreviewTab === "schema"
                              ? "bg-white text-indigo-600 shadow-sm border border-gray-200"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          Schema
                        </button>
                      </div>
                      {isViewMode && (
                        <button
                          type="button"
                          onClick={
                            idpPreviewTab === "output"
                              ? handleDownloadOutput
                              : handleDownloadSchema
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-sm"
                          title={
                            idpPreviewTab === "output"
                              ? `Download as ${apiOutputFormat}`
                              : "Download schema as JSON"
                          }
                        >
                          <Download size={18} />
                          {idpPreviewTab === "output"
                            ? `Download ${apiOutputFormat}`
                            : "Download JSON"}
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <pre className="w-full h-105 overflow-auto rounded-xl bg-[#0f0f0f] text-green-400 p-4 text-sm font-mono border border-gray-800">
                        {idpPreviewTab === "output"
                          ? prettySchema || "No output available"
                          : prettyRawSchema || "No schema available"}
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Min div over */}
          </div>
        </form>
      </main>
    </>
  );
};

export default ViewTag;

// it's for enable editing in output preview
// {isIdp && (
//   <>
//     <h2 className="text-2xl font-semibold text-gray-900">
//       Output Preview
//     </h2>

//     <div className="relative">
//       <pre className="w-full h-105 overflow-auto rounded-xl bg-[#0f0f0f] text-green-400 p-4 text-sm font-mono border border-gray-800">
//         {prettySchema || "No schema available"}
//       </pre>
//     </div>
//   </>
// )}
