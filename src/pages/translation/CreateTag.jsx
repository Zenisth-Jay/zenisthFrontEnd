import InputElement from "../../components/Authentication/InputElement";
import MainNavbar from "../../components/dashboard/MainNavbar";
import { useForm } from "react-hook-form";
import { FileText, Tag, Languages, AlignLeft, ChevronDown } from "lucide-react";
import SelectElement from "../../components/ui/SelectElement";
import { useRef, useState } from "react";
import MainFileUpload from "../../components/general/MainFileUpload";
import UploadedFilesGrid from "../../components/general/UploadedFileGrid";
import Button from "../../components/ui/Button";
import { useCreateTagMutation } from "../../api/tags.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
];

const CreateTag = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm();
  const sourceLanguage = watch("sourceLanguage");

  const [glossaryMode, setGlossaryMode] = useState("upload"); // "upload" | "manual"
  const [glossaryRows, setGlossaryRows] = useState([
    { id: crypto.randomUUID(), term: "", keepAs: "" },
  ]);

  const fileInputRef = useRef(null);
  const [glossaryFiles, setGlossaryFiles] = useState([]);

  // API
  const [createTag, { isLoading }] = useCreateTagMutation();

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

  const parseCSVToGlossaryObject = async (file) => {
    const text = await file.text();

    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const records = {};

    lines.forEach((line, index) => {
      const [term, keepAs] = line.split(",");

      if (!term || !keepAs) {
        throw new Error(`Invalid CSV format at line ${index + 1}`);
      }

      records[term.trim()] = keepAs.trim();
    });

    return records;
  };

  const buildGlossaryOutput = async () => {
    // MANUAL MODE
    if (glossaryMode === "manual") {
      const obj = {};

      glossaryRows.forEach((row) => {
        const term = row.term.trim();
        const keepAs = row.keepAs.trim();
        if (term && keepAs) {
          obj[term] = keepAs;
        }
      });

      return {
        source: "manual",
        length: Object.keys(obj).length,
        records: obj,
      };
    }

    // CSV MODE
    if (glossaryMode === "upload" && glossaryFiles.length === 1) {
      const file = glossaryFiles[0].file;
      const records = await parseCSVToGlossaryObject(file);

      return {
        source: "csv",
        fileName: file.name,
        length: Object.keys(records).length,
        records,
      };
    }

    // No glossary
    return {
      source: "none",
      length: 0,
      records: {},
    };
  };

  const onSubmit = async (data) => {
    try {
      const glossaryOutput = await buildGlossaryOutput();

      const ORGANIZATION_ID = "7b2f5a9c-3c3e-4e9c-8d4b-1c7f9b123456";
      const APPLICATION_ID = "TRANSLATION"; // for query param
      const TAB = "DEFAULT";

      const body = {
        name: data.tagName, // from form
        tag_type: "TRANSLATION",
        orgId: ORGANIZATION_ID,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
        applicationId: "app_translation_007", // as per your backend
        glossaryContent: glossaryOutput.records, // 👈 object {a:1,b:2}
        industry: data.tagCategory, // mapping Tag Category -> industry
        description: data.description,
        field_count: glossaryOutput.length, // 👈 number of glossary entries
      };

      console.log("CREATE TAG BODY 👉", body);

      await createTag({
        organizationId: ORGANIZATION_ID,
        applicationId: APPLICATION_ID,
        tab: TAB,
        body,
      }).unwrap();

      toast.success("Tag created successfully!");

      // redirect
      navigate("/operations/translate/select-tag");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create tag");
    }
  };

  const handleGlossaryFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles);

    if (incoming.length === 0) return;

    // ✅ Only allow ONE file
    if (incoming.length > 1) {
      toast.error("You can upload only one glossary file.");
      return;
    }

    const file = incoming[0];

    // Optional: if already exists, block replace
    if (glossaryFiles.length >= 1) {
      toast.error(
        "Only one glossary file is allowed. Remove the existing one first.",
      );
      return;
    }

    const newFile = {
      id: crypto.randomUUID(),
      file,
    };

    setGlossaryFiles([newFile]); // always replace / set single file
  };

  const handleRemoveGlossaryFile = (item) => {
    setGlossaryFiles((prev) => prev.filter((f) => f.id !== item.id));
  };

  const handlePreviewGlossaryFile = (item) => {
    const url = URL.createObjectURL(item.file);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  return (
    <>
      <MainNavbar />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => {
            handleGlossaryFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Main Container */}
        <div className="w-full bg-gray-50 px-16 py-10 flex flex-col gap-6">
          {/* Create a new atg label ROW */}
          <div className="flex flex-col">
            <h1 className=" text-[40px] font-bold text-gray-900">
              Create New Tag
            </h1>
            <span className=" text-lg font-normal text-gray-700">
              Define rules for consistent translations
            </span>
          </div>

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
              />

              <InputElement
                label="Tag Category"
                name="tagCategory"
                type="text"
                placeholder="e.g. Finance, Marketing etc..."
                icon={FileText}
                register={register}
                rules={{ required: "Tag category is required" }}
                className="w-full"
              />
            </div>

            {/* Descreption */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[#424242] text-[18px] font-medium">
                Description <span className="text-red-500">*</span>
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
                />
              </div>
            </div>

            {/* Languages */}
            <div className="grid grid-cols-2 gap-6">
              <SelectElement
                label="Source Language"
                name="sourceLanguage"
                register={register}
                rules={{ required: "Source language is required" }}
                options={LANGUAGES}
                placeholder="Select language"
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
              />
            </div>
          </div>

          {/* Glossary Card */}
          <div className="px-10 py-8 bg-white border border-gray-300 rounded-2xl flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Glossary</h2>
              <button
                type="button"
                onClick={() => setGlossaryMode("manual")}
                className="px-4 py-2 rounded-lg text-indigo-500 font-medium hover:text-indigo-900 cursor-pointer"
              >
                + Add Term
              </button>
            </div>

            {/* Sub header */}
            <div className="flex items-center justify-between">
              <p className="text-gray-700 text-lg">
                No glossary terms added yet. Click ‘Add Term’ to get started.
              </p>

              <button
                type="button"
                className="px-4 py-2 rounded-lg text-indigo-500 font-medium hover:text-indigo-900 cursor-pointer flex items-center gap-1"
              >
                <span className="w-4 h-4 rounded-full border border-indigo-500 flex items-center justify-center text-sm">
                  ?
                </span>
                <span>Sample Document</span>
              </button>
            </div>

            {/* If no files yet → show uploader */}
            {/* UPLOAD MODE */}
            {glossaryMode === "upload" && (
              <>
                {glossaryFiles.length === 0 && (
                  <MainFileUpload
                    onFilesSelected={handleGlossaryFiles}
                    onBrowseClick={() => fileInputRef.current?.click()}
                    title="Drag and drop your glossaries here, or click to browse"
                    supportedText="Supported formats: CSV"
                    helperText="Max file size: 2 GB, Max glossaries: 250"
                  />
                )}

                {glossaryFiles.length > 0 && (
                  <UploadedFilesGrid
                    files={glossaryFiles}
                    onFilesSelected={() => fileInputRef.current?.click()}
                    onRemoveFile={handleRemoveGlossaryFile}
                    onPreviewFile={handlePreviewGlossaryFile}
                    showHeader={false}
                    emptyText="You can remove and upload a different glossary file if needed."
                  />
                )}
              </>
            )}

            {/* MANUAL MODE */}
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
                {glossaryRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-2 gap-6 items-center"
                  >
                    <input
                      type="text"
                      placeholder="Enter New Term"
                      value={row.term}
                      onChange={(e) =>
                        updateRow(row.id, "term", e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />

                    <input
                      type="text"
                      placeholder="Enter Keep As"
                      value={row.keepAs}
                      onChange={(e) =>
                        updateRow(row.id, "keepAs", e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                ))}

                {/* Add Row */}
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-2 text-indigo-600 font-medium mt-2"
                >
                  + Add Row
                </button>

                {/* Switch back to upload */}
                <button
                  type="button"
                  onClick={() => setGlossaryMode("upload")}
                  className="text-sm text-gray-500 underline mt-2 w-fit"
                >
                  Or upload a CSV instead
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-6 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                // Reset form or navigate back
                window.history.back();
              }}
              className="w-full"
            >
              Cancel
            </Button>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Tag"}
            </Button>
          </div>

          {/* Min div over */}
        </div>
      </form>
    </>
  );
};

export default CreateTag;
