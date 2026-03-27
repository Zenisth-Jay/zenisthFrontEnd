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
  Sparkles,
} from "lucide-react";
import SelectElement from "../../components/ui/SelectElement";
import { useRef, useState } from "react";
import MainFileUpload from "../../components/general/MainFileUpload";
import UploadedFilesGrid from "../../components/general/UploadedFileGrid";
import Button from "../../components/ui/Button";
import { useCreateTagMutation } from "../../api/tags.api";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createDocumentAPI, uploadToS3 } from "../../api/documents.api";
import { LANGUAGES } from "../../data/translateLanguage";

const OUTPUT_FORMAT = [
  { code: "CSV", label: "CSV" },
  { code: "XML", label: "XML" },
  { code: "JSON", label: "JSON" },
];

const renderFormats = (formats = [], bgColor, borderColor) => {
  return formats.map((format, index) => (
    <span
      key={index}
      className={`px-2 py-1 text-sm font-semibold rounded-md border text-gray-700 ${bgColor} ${borderColor}`}
    >
      {format}
    </span>
  ));
};

const FormatCard = ({
  title,
  badgeText,
  description,
  formats = [],
  borderColor = "border-gray-300",
  bgColor = "bg-gray-50",
  badgeBg = "bg-gray-200",
  badgeTextColor = "text-gray-800",
}) => {
  return (
    <div
      className={` w-1/2 flex flex-col gap-3 p-4 rounded-lg border ${borderColor} ${bgColor}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className=" text-lg font-semibold text-gray-800">{title}</h3>

        <span
          className={`text-md font-bold px-5 py-1 rounded-full ${badgeBg} ${badgeTextColor}`}
        >
          {badgeText}
        </span>
      </div>

      {/* Format tags */}
      <div className={`flex gap-2 flex-wrap`}>
        {renderFormats(
          formats,
          (bgColor = badgeBg),
          (borderColor = borderColor),
        )}
      </div>

      {/* Description */}
      <p className="text-md text-gray-600">{description}</p>
    </div>
  );
};

const CreateTag = () => {
  const navigate = useNavigate();

  const { toolType } = useParams();
  const isIdp = toolType == "idp";

  const [uploadedS3Key, setUploadedS3Key] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, watch } = useForm();
  const sourceLanguage = watch("sourceLanguage");

  const [glossaryMode, setGlossaryMode] = useState("upload");
  const [glossaryRows, setGlossaryRows] = useState([]);

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

  const getOriginalFormat = (file) => {
    const name = file.name.toLowerCase();

    if (name.endsWith(".csv")) return "CSV";
    if (name.endsWith(".json")) return "JSON";
    if (name.endsWith(".xml")) return "XML";

    if (name.endsWith(".jpg")) return "JPG";
    if (name.endsWith(".jpeg")) return "JPEG";
    if (name.endsWith(".png")) return "PNG";
    if (name.endsWith(".pdf")) return "PDF";

    return null;
  };

  const onSubmit = async (data) => {
    try {
      const ORGANIZATION_ID = "7b2f5a9c-3c3e-4e9c-8d4b-1c7f9b123456";
      const APPLICATION_ID = isIdp ? "IDP" : "TRANSLATION";
      const TAB = "DEFAULT";

      // -------------------------
      // ✅ IDP FLOW: just send file as-is
      // -------------------------
      if (isIdp) {
        if (glossaryFiles.length !== 1) {
          toast.error("Please upload a file first.");
          return;
        }

        const file = glossaryFiles[0].file;

        setIsUploading(true);

        const batchId = Date.now();

        // 1️⃣ Ask backend for presigned URL
        const res = await createDocumentAPI({
          fileName: file.name,
          fileSize: file.size,
          application: "TAG_CREATION",
          batchId,
          isFirstDocument: true,
          totalBatchSize: file.size,
        });

        const { uploadUrl, key } = res.data;

        // 2️⃣ Upload to S3
        // await uploadToS3(uploadUrl, file);
        await uploadToS3(uploadUrl, {
          file: file,
          batchId: batchId,
          isFirstDocument: true,
          totalBatchSize: file.size,
        });

        // 3️⃣ Create tag with S3 KEY (not URL)
        const body = {
          name: data.tagName,
          tag_type: "IDP",
          orgId: ORGANIZATION_ID,
          industry: data.tagIndustry,
          description: data.description,
          prompt: data.prompt || null,
          outputFormat: data.outputFormat, // "CSV" | "JSON" | "XML"
          originalFormat: getOriginalFormat(file), // "CSV" | "JSON" | "XML"
          s3Key: key, // ✅ correct
        };

        // console.log("IDP CREATE TAG BODY 👉", body);

        await createTag({
          organizationId: ORGANIZATION_ID,
          applicationId: "IDP",
          tab: TAB,
          body,
        }).unwrap();

        // toast.success("IDP Tag created successfully!");
        // navigate("/operations/idp/select-tag");
        navigate(-1);
        return;
      }

      // -------------------------
      // ✅ TRANSLATION FLOW (unchanged)
      // -------------------------
      const glossaryOutput = await buildGlossaryOutput();

      const body = {
        name: data.tagName,
        tag_type: "TRANSLATION",
        orgId: ORGANIZATION_ID,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
        applicationId: "app_translation_007",
        glossaryContent: glossaryOutput.records,
        industry: data.tagCategory,
        description: data.description,
        field_count: glossaryOutput.length,
      };

      await createTag({
        organizationId: ORGANIZATION_ID,
        applicationId: APPLICATION_ID,
        tab: TAB,
        body,
      }).unwrap();

      if (!isIdp) {
        toast.success("Tag created successfully!");
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create tag");
    }
  };

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

  const handleGlossaryFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles);
    if (incoming.length === 0) return;

    if (incoming.length > 1) {
      toast.error("You can upload only one file.");
      return;
    }

    const file = incoming[0];

    // Size check
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 20 MB.");
      return;
    }

    // Type check
    const ALLOWED_TYPES = isIdp
      ? [
          "text/csv",
          "application/json",
          "application/xml",
          "text/xml",
          "image/jpeg",
          "image/png",
          "application/pdf",
        ]
      : ["text/csv"];

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(
        isIdp
          ? "Only CSV, JSON, XML, jpg, jpeg and png files are allowed"
          : "Only CSV files are allowed",
      );
      return;
    }

    // Just store file in state (NO UPLOAD HERE)
    const fileObj = { id: crypto.randomUUID(), file };
    setGlossaryFiles([fileObj]);
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
          accept={isIdp ? ".csv,.json,.xml,.jpg,.jpeg,.png,.pdf" : ".csv"}
          hidden
          onChange={(e) => {
            handleGlossaryFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Main Container */}
        <div className="w-full bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 flex flex-col gap-6">
          {/* Create a new atg label ROW */}
          <div className="flex flex-col">
            <h1 className=" text-[40px] font-bold text-gray-900">
              Create New Tag
            </h1>
            <span className=" text-lg font-normal text-gray-700">
              {isIdp
                ? "Define how data should be extracted from documents of this type."
                : "Define rules for consistent translations"}
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
              />
            </div>

            {/* Descreption */}
            <div className="flex gap-6 justify-between w-full">
              <div className="w-full">
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
            )}
          </div>

          {isIdp && (
            <div className="w-full flex gap-3">
              <FormatCard
                title="Image formats"
                badgeText="10 credits / page"
                formats={["JPG", "JPEG", "PNG", "PDF"]}
                description="Scanned documents, invoices, and photos. It uses OCR to extract content, credit covers the processing cost."
                borderColor="border-orange-300"
                bgColor="bg-orange-50"
                badgeBg="bg-orange-200"
                badgeTextColor="text-orange-900"
              />

              <FormatCard
                title="Structured formats"
                badgeText="No credits used"
                formats={["CSV", "JSON", "XML"]}
                description="Already structured data. IDP reads and maps fields directly, no OCR needed, so no credit charge."
                borderColor="border-green-300"
                bgColor="bg-green-50"
                badgeBg="bg-green-200"
                badgeTextColor="text-green-900"
              />
            </div>
          )}

          {/* Glossary Card */}
          <div className="px-10 py-8 bg-white border border-gray-300 rounded-2xl flex flex-col gap-6">
            {/* Gloassary Header */}
            {!isIdp && (
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Glossary
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setGlossaryMode("manual");
                    if (glossaryRows.length === 0) {
                      addRow(); // ensure at least one row appears
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-indigo-500 font-medium hover:text-indigo-900 cursor-pointer"
                >
                  + Add Term
                </button>
              </div>
            )}
            {/* Sub header */}
            {!isIdp && glossaryRows.length === 0 && (
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
            )}

            {glossaryMode === "upload" && glossaryRows.length === 0 && (
              <div className="flex flex-col">
                <h3 className=" text-2xl font-semibold text-[#171717]">
                  Upload Sample Document
                </h3>
                <p className=" text-lg font-normal text-[#525252]">
                  AI will analyze your document and suggest a schema
                  automatically. This helps build the perfect structure faster.
                </p>
              </div>
            )}

            {/* If no files yet → show uploader */}
            {/* UPLOAD MODE */}
            {glossaryMode === "upload" && (
              <>
                {glossaryFiles.length === 0 && (
                  <MainFileUpload
                    onFilesSelected={handleGlossaryFiles}
                    onBrowseClick={() => fileInputRef.current?.click()}
                    title={`Drag and drop your ${isIdp ? "documents" : "glossaries"} here, or click to browse`}
                    supportedText={
                      isIdp
                        ? "Supported formats: JPG, JPEG, PNG, PDF CSV, JSON, XML"
                        : "Supported formats: CSV"
                    }
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
                  onClick={() => {
                    setGlossaryMode("upload");
                    setGlossaryRows([]); // ✅ clear manual rows
                  }}
                  className="text-sm text-gray-500 underline mt-2 w-fit"
                >
                  Or upload a CSV instead
                </button>
              </div>
            )}
          </div>

          {isIdp && (
            <div className="flex items-start gap-4 p-4 rounded-xl border border-indigo-200 bg-indigo-50">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500 text-white">
                <Sparkles size={18} />
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <h3 className=" text-xl font-semibold text-indigo-900">
                  Auto schema detection
                </h3>

                <p className="text-md text-indigo-700 mt-1">
                  After upload, IDP will identify fields like invoice number,
                  dates, line items, and totals and create an extraction schema.
                </p>
              </div>
            </div>
          )}

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

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isUploading}
            >
              {isUploading
                ? "Uploading..."
                : isLoading
                  ? "Creating..."
                  : "Create Tag"}
            </Button>
          </div>

          {/* Min div over */}
        </div>
      </form>
    </>
  );
};

export default CreateTag;
