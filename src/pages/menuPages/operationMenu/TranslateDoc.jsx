import { useEffect, useRef, useState } from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import Button from "../../../components/ui/Button";
import {
  History,
  Upload,
  FileText,
  Plus,
  ArrowRight,
  X,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { createDocumentAPI, uploadToS3 } from "../../../api/documents.api";
import {
  openOverlay,
  addUpload,
  updateProgress,
  markSuccess,
  markError,
} from "../../../redux/features/uploadSlice";
import { useDispatch } from "react-redux";
import MainFileUpload from "../../../components/general/MainFileUpload";
import UploadedFilesGrid from "../../../components/general/UploadedFileGrid";

const InfoBox = ({ title, description }) => {
  return (
    <div className="border border-gray-300 w-[50%] rounded-lg p-5 bg-white shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const TranslateDoc = () => {
  // const batchEpoch = Date.now();
  // console.log("Batch Epoch:", batchEpoch);
  // console.log("Epoch:", batchEpoch);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check Tool Type
  const { toolType } = useParams();
  const isIdp = toolType == "idp";

  // Allowed FIles
  const ALLOWED_TYPES = isIdp
    ? ["application/pdf", "image/png", "image/jpeg"]
    : [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
      ];

  // initialize files array
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  // initialize overlay status
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});

  // Overlay showing
  useEffect(() => {
    if (!showUploadOverlay) return;

    const statuses = Object.values(uploadStatus);
    if (statuses.length > 0 && statuses.every((s) => s === "success")) {
      toast.success("All files uploaded successfully!");
      setShowUploadOverlay(false);
    }
  }, [uploadStatus, showUploadOverlay]);

  // *** First Upload all files
  const uploadAllFiles = async (batchId, totalBatchSize) => {
    // 1️⃣ Open overlay
    dispatch(openOverlay());

    // 2️⃣ Add ALL files to redux first
    files.forEach((fileObj) => {
      dispatch(
        addUpload({
          id: fileObj.id,
          name: fileObj.file.name,
          progress: 0,
          status: "uploading",
          batchId,
        }),
      );
    });

    let isFirst = true;

    // 3️⃣ Then start uploading them one by one
    for (const fileObj of files) {
      await startUpload(fileObj, batchId, isFirst, totalBatchSize);
      isFirst = false;
    }
  };

  // *** Function to Start Uploading
  const startUpload = async (fileObj, batchId, isFirst, totalBatchSize) => {
    const id = fileObj.id;

    try {
      const payload = {
        fileName: fileObj.file.name,
        fileSize: fileObj.file.size,
        application: isIdp ? "IDP" : "TRANSLATE",
        batchId,
      };

      // 👇 ONLY for first file
      if (isFirst) {
        payload.isFirstDocument = true;
        payload.totalBatchSize = totalBatchSize;
      }

      const res = await createDocumentAPI(payload);

      const { uploadUrl } = res.data;

      await uploadToS3(
        uploadUrl,
        {
          file: fileObj.file,
          batchId,
          isFirstDocument: isFirst,
          totalBatchSize,
        },
        (percent) => {
          dispatch(updateProgress({ id, progress: percent }));
        },
      );

      dispatch(markSuccess({ id }));
    } catch (err) {
      console.error(err);
      dispatch(markError({ id }));
    }
  };

  // *** To remove all files Func
  const handleCancelAll = () => {
    setFiles([]);
    setShowUploadOverlay(false);
    setUploadStatus({});

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  // *** Function to Preview File
  const handlePreview = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const MAX_SINGLE_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
  const MAX_TOTAL_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB

  // *** Handle Duplicate + File Type Validation
  const handleFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles);

    // Invalid files - only PDF and Word allowed
    const invalidFiles = incoming.filter(
      (file) => !ALLOWED_TYPES.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      toast.error(
        isIdp
          ? "Only PDF, PNG, and JPG files are allowed"
          : "Only DOCX and PDF files are allowed",
        { autoClose: 3000 },
      );
    }

    // Size validation (single file > 20MB)
    const tooLargeSingleFiles = incoming.filter(
      (file) => file.size > MAX_SINGLE_FILE_SIZE,
    );

    if (tooLargeSingleFiles.length > 0) {
      toast.error("Each file must be smaller than 20 MB", { autoClose: 3000 });
    }

    // Keep only files that pass type + single size check
    const validCandidates = incoming.filter(
      (file) =>
        ALLOWED_TYPES.includes(file.type) && file.size <= MAX_SINGLE_FILE_SIZE,
    );

    if (validCandidates.length === 0) return;

    // 4️⃣ Check total size (existing + new)
    const existingTotalSize = files.reduce((sum, f) => sum + f.file.size, 0);
    const newTotalSize = validCandidates.reduce((sum, f) => sum + f.size, 0);

    if (existingTotalSize + newTotalSize > MAX_TOTAL_SIZE) {
      toast.error("Total upload size cannot exceed 5 GB", { autoClose: 3000 });
      return;
    }

    // Deduplicate + add
    setFiles((prev) => {
      const existingKeys = new Set(
        prev.map((f) => `${f.file.name}-${f.file.size}`),
      );

      const newFiles = validCandidates
        .filter((file) => !existingKeys.has(`${file.name}-${file.size}`))
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          progress: 0,
          status: "pending",
          documentId: null,
        }));

      if (newFiles.length === 0) {
        toast.info("These files are already added");
        return prev;
      }

      return [...prev, ...newFiles];
    });
  };

  // *** Delete File using delete btn
  const removeFile = (item) => {
    setFiles((prev) => prev.filter((f) => f.id !== item.id));
  };

  const totalUploadedSizeMB = (
    files.reduce((sum, f) => sum + f.file.size, 0) /
    (1024 * 1024)
  ).toFixed(2);

  return (
    <>
      <MainNavbar />

      <section className="w-full min-h-[calc(100vh-64px)] bg-gray-50 flex items-start justify-center">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 flex flex-col gap-6 sm:gap-8 md:gap-10">
          {/* Hidden Input - Important */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={isIdp ? ".pdf,.png,.jpg,.jpeg" : ".docx,.pdf"}
            hidden
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
                {files.length == 0
                  ? "Upload your document"
                  : "Preview your documents"}
              </h2>
              <p className="text-base sm:text-lg font-medium text-gray-800 mt-1">
                {files.length == 0
                  ? isIdp
                    ? "Just upload your scanned file we'll automatically detect and separate the documents inside."
                    : "Upload the documents you want to translate. We’ll prepare it for the next step."
                  : "Verify your uploads and make any changes before processing."}
              </p>
            </div>

            {files.length == 0 && (
              <div className="shrink-0 flex gap-4">
                <Button
                  onClick={() =>
                    navigate(
                      `/operations/${isIdp ? "idp" : "translate"}/history`,
                    )
                  }
                  variant="outline"
                  leftIcon={
                    <History
                      size={22}
                      strokeWidth={2}
                      className="text-gray-800"
                    />
                  }
                >
                  View History
                </Button>

                {/* <Button
                  leftIcon={<Plus size={22} className=" text-white" />}
                  onClick={() =>
                    navigate(
                      `/operations/${isIdp ? "idp" : "translate"}/create-tag`,
                    )
                  }
                >
                  Create new Tag
                </Button> */}
              </div>
            )}
          </div>

          {files.length == 0 && (
            <div className="w-full rounded-2xl border border-purple-200 bg-purple-50 p-6 flex gap-4 items-start">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
                <Tag className="text-purple-500" size={20} />
              </div>

              {/* Content */}
              <div className="w-full flex justify-between items-center">
                <div className="w-[75%]">
                  <p className="text-purple-700 font-semibold">
                    Create a tag before you upload
                  </p>
                  <p className="w-full text-purple-600 text-sm mt-1">
                    Tags help us organize and route your documents correctly.
                    Since tag creation runs in the background and can take a
                    moment, start here first your upload will be ready to go
                    once it's set up.
                  </p>
                </div>

                {/* Button */}
                <Button
                  leftIcon={<Plus size={22} className=" text-white" />}
                  onClick={() =>
                    navigate(
                      `/operations/${isIdp ? "idp" : "translate"}/create-tag?back=upload`,
                    )
                  }
                  className="w-fit h-fit"
                >
                  Create new Tag
                </Button>
              </div>
            </div>
          )}

          {/* When User doesn't uploaded any document, this section will appear to upload file */}
          {files.length === 0 && (
            <MainFileUpload
              onFilesSelected={handleFiles}
              onBrowseClick={() => fileInputRef.current?.click()}
              title="Drag and drop your documents here, or click to browse"
              supportedText={`Supported formats: ${isIdp ? "PDF , PNG, JPG, JPEG" : "DOCX, PDF"}`}
              helperText="Max file size: 20 MB, Max Total File Size: 5GB"
            />
          )}

          {files.length === 0 && (
            <div className="flex gap-5">
              <InfoBox
                title="Why do I need a tag?"
                description="Tags act as folders for your translation jobs. They let you track, filter, and re-run batches without losing context especially useful when managing multiple projects at once."
              />

              <InfoBox
                title="How long does tag creation take?"
                description="Usually under a minute. While it's being set up, you can prep your files so you're ready to upload the moment the tag is confirmed."
              />
            </div>
          )}

          {/* When user Upload any file, this section will apper */}
          {files.length !== 0 && (
            <>
              <UploadedFilesGrid
                files={files}
                onFilesSelected={() => fileInputRef.current?.click()}
                onRemoveFile={(item) => removeFile(item)}
                onPreviewFile={(item) => handlePreview(item.file)}
                totalSize={totalUploadedSizeMB}
              />

              {/* Uploaded Processing Cost Section */}
              <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 bg-white border border-gray-300 shadow-sm rounded-xl sm:rounded-2xl animate-fade-in-up">
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl sm:text-2xl md:text-[28px] font-semibold text-gray-900">
                    Upload processing cost
                  </h3>
                  <hr className="text-gray-300" />

                  {/* 1 */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm sm:text-lg  text-gray-500">
                      Total Uploaded Size :
                    </span>
                    <span className="text-md sm:text-lg md:text-[20px]  font-bold text-gray-800">
                      {totalUploadedSizeMB}{" "}
                      <span className="text-sm sm:text-lg font-medium  text-gray-500">
                        MB
                      </span>
                    </span>
                  </div>
                  <hr className="text-gray-300" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm sm:text-lg  text-gray-500">
                      Rate :
                    </span>
                    <span className="text-md sm:text-lg md:text-[20px]  font-bold text-gray-800">
                      0.5{" "}
                      <span className="text-sm sm:text-lg font-medium text-gray-500">
                        credits per MB
                      </span>
                    </span>
                  </div>
                  <hr className="text-gray-300" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm sm:text-2xl  text-gray-500">
                      Total Cost :
                    </span>
                    <span className="text-md sm:text-2xl md:text-[24px] font-bold text-gray-800">
                      {totalUploadedSizeMB * 0.5}{" "}
                      <span className="text-sm sm:text-lg font-medium text-gray-500">
                        credits
                      </span>
                    </span>
                  </div>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 text-gray-600 rounded-lg p-3 sm:p-4 text-base sm:text-lg md:text-xl shadow-sm">
                  💡 Credits are only deducted once you confirm below and
                  processing begins. Removing a file updates this estimate
                  instantly.
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 md:gap-10 justify-end">
                <Button
                  variant="outline"
                  className="w-full sm:w-40 md:w-67"
                  onClick={handleCancelAll}
                >
                  Go Back
                </Button>

                <Button
                  rightIcon={<ArrowRight size={18} />}
                  disabled={files.length === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    const batchId = Date.now();

                    const totalBatchSize = files.reduce(
                      (sum, f) => sum + f.file.size,
                      0,
                    );

                    uploadAllFiles(batchId, totalBatchSize);
                    isIdp
                      ? navigate(
                          `/operations/idp/select-tag?batchId=${batchId}`,
                        )
                      : navigate(
                          `/operations/translate/select-tag?batchId=${batchId}`,
                        );
                  }}
                  className="w-full sm:w-40 md:w-67"
                >
                  Confirm & start processing
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default TranslateDoc;
