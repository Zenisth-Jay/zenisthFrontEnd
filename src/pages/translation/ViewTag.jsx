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
} from "lucide-react";
import SelectElement from "../../components/ui/SelectElement";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { useGetTagByIdQuery } from "../../api/tags.api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
];

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

    fieldCount: apiTag.fieldCount || 0,

    // This is what backend gives you (CSV header string for now)
    rawSchema: apiTag.rawSchemaContent || "",

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

  const [previewFormat, setPreviewFormat] = useState("JSON");
  const applicationId = isIdp ? "IDP" : "TRANSLATION";
  const organizationId = "temporary It's fetching from auth";

  const [schemaText, setSchemaText] = useState(""); // rawSchemaContent from API
  const [apiOutputFormat, setApiOutputFormat] = useState("CSV"); // from API

  const { register, handleSubmit, watch, setValue } = useForm();

  const fileInputRef = useRef(null);

  const tagVM = useMemo(() => buildTagVM(tagData), [tagData]);

  const originalRef = useRef(null);

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

  const onSubmit = async (formData) => {
    try {
      const original = originalRef.current;
      if (!original) {
        toast.error("Original data not loaded yet");
        return;
      }

      const normalize = (v) => (typeof v === "string" ? v.trim() : v);

      const current = {
        name: formData.tagName,
        description: formData.description,
        industry: isIdp ? formData.tagIndustry : formData.tagCategory,
        outputFormat: isIdp ? formData.outputFormat : undefined,
        rawSchemaContent: schemaText,
      };

      // ✅ Build diff-only payload
      const patchBody = {};
      Object.keys(current).forEach((key) => {
        if (current[key] === undefined) return;

        const currVal = normalize(current[key]);
        const origVal = normalize(original[key]);

        if (currVal !== origVal) {
          patchBody[key] = current[key];
        }
      });

      // 🚫 If nothing changed, don't call API
      if (Object.keys(patchBody).length === 0) {
        toast.info("No changes to save");
        return;
      }

      console.log("PATCH BODY (only changed):", patchBody);

      // ✅ Call your update API here
      // await updateTag({ id: tagId, body: patchBody }).unwrap();

      toast.success("Tag updated successfully!");
      // navigate(`/operations/${toolType}/tag/view/${tagId}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update tag");
    }
  };

  useEffect(() => {
    if (!tagVM) return;

    setValue("tagName", tagVM.name);
    setValue("description", tagVM.description);
    setValue(isIdp ? "tagIndustry" : "tagCategory", tagVM.industry);
    setValue("outputFormat", tagVM.outputFormat);

    // Set editor text EXACTLY as API gives
    setSchemaText(tagVM.rawSchema);
    setApiOutputFormat(tagVM.outputFormat);
    setPreviewFormat(tagVM.outputFormat);

    // ✅ Store original snapshot for diff (raw, untouched)
    originalRef.current = {
      name: tagVM.name,
      description: tagVM.description,
      industry: tagVM.industry,
      outputFormat: tagVM.outputFormat,
      rawSchemaContent: tagVM.rawSchema, // <-- raw from API
    };
  }, [tagVM, setValue, isIdp]);

  console.log(tagData);

  if (isLoading) {
    return (
      <>
        <MainNavbar />
        <div className="p-10 text-gray-600">Loading tag...</div>
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
                // disabled={isUpdating}
              >
                {/* {isUpdating ? "Saving..." : "Save Changes"} */}
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
              <div className="flex flex-col gap-1.5 w-full">
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
                      onClick={() => setGlossaryMode("manual")}
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
                  {glossaryMode === "manual" && (
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
                            className="grid grid-cols-2 gap-6 items-center"
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
                          </div>
                        ))}
                      </div>

                      {/* Add Row */}
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
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Output Preview
                  </h2>

                  {/* Preview Panel */}
                  <div className="relative">
                    {/* <pre className="w-full h-105 overflow-auto rounded-xl bg-[#0f0f0f] text-green-400 p-4 text-sm font-mono border border-gray-800">
                      {schemaText || "No schema available"}
                    </pre> */}
                    {isEditMode ? (
                      <textarea
                        value={schemaText}
                        onChange={(e) => setSchemaText(e.target.value)}
                        className="w-full h-105 rounded-xl bg-[#0f0f0f] text-green-400 p-4 text-sm font-mono border border-gray-800 focus:outline-none"
                      />
                    ) : (
                      <pre className="w-full h-105 overflow-auto rounded-xl bg-[#0f0f0f] text-green-400 p-4 text-sm font-mono border border-gray-800">
                        {prettySchema || "No schema available"}
                      </pre>
                    )}
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
