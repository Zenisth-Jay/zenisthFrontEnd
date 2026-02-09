import { useEffect, useRef, useState } from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import Button from "../../../components/ui/Button";
import { History, Upload, FileText, Plus, ArrowRight, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createDocumentAPI, uploadToS3 } from "../../../api/documents.api";
import {
  openOverlay,
  addUpload,
  updateProgress,
  markSuccess,
  markError,
} from "../../../redux/features/uploadSlice";
import { useDispatch } from "react-redux";
import Document from "../../../components/ui/Document";
import MainFileUpload from "../../../components/general/MainFileUpload";
import UploadedFilesGrid from "../../../components/general/UploadedFileGrid";

// ✅ Allowed file types
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // "text/plain",
];

const TranslateDoc = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});

  useEffect(() => {
    if (!showUploadOverlay) return;

    const statuses = Object.values(uploadStatus);
    if (statuses.length > 0 && statuses.every((s) => s === "success")) {
      toast.success("All files uploaded successfully!");
      setShowUploadOverlay(false);
    }
  }, [uploadStatus, showUploadOverlay]);

  const uploadAllFiles = async () => {
    // Open overlay
    dispatch(openOverlay());
    setShowUploadOverlay(true);

    // Upload each file
    for (const fileObj of files) {
      await startUpload(fileObj);
    }
  };

  const startUpload = async (fileObj) => {
    const id = fileObj.id;

    try {
      // 1. Ask backend for presigned URL (NO TOAST)
      const res = await createDocumentAPI({
        fileName: fileObj.file.name,
        fileSize: fileObj.file.size,
        application: "TRANSLATE",
      });

      const { documentId, uploadUrl } = res.data;

      // 2. Add to overlay & open it
      dispatch(openOverlay());
      dispatch(
        addUpload({
          id,
          name: fileObj.file.name,
          progress: 0,
          status: "uploading",
        }),
      );

      // 3. REAL upload to S3
      await uploadToS3(uploadUrl, fileObj.file, (percent) => {
        dispatch(updateProgress({ id, progress: percent }));
      });

      // 4. Mark success ONLY after S3 succeeds
      dispatch(markSuccess({ id }));
      // toast.success(`Uploaded: ${fileObj.file.name}`);
    } catch (err) {
      console.error(err);

      // 5. Mark error if ANYTHING fails (especially S3)
      dispatch(markError({ id }));
      // toast.error(`Upload failed: ${fileObj.file.name}`);
    }
  };

  const handleCancelAll = () => {
    setFiles([]);
    setShowUploadOverlay(false);
    setUploadStatus({});

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handlePreview = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const MAX_SINGLE_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
  const MAX_TOTAL_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB

  // Handle Duplicate + File Type Validation
  const handleFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles);

    // Invalid files - only PDF and Word allowed
    const invalidFiles = incoming.filter(
      (file) => !ALLOWED_TYPES.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      toast.error("Only PDF and DOCX files are allowed", {
        autoClose: 3000,
      });
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

  // Remove Files
  const removeFile = (item) => {
    setFiles((prev) => prev.filter((f) => f.id !== item.id));
  };

  return (
    <>
      <MainNavbar />

      {/* Row 1 - Upload your Document Heading Section */}
      <section className=" w-full min-h-[calc(100vh-64px)] bg-gray-50 flex items-start justify-center">
        <div className=" w-full mx-auto px-16 py-10 flex flex-col gap-10">
          {/* Hidden Input - Important */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx"
            hidden
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />

          {/* Top Heading */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className=" text-4xl font-semibold">
                {files.length == 0
                  ? "Upload your document"
                  : "Preview your documents"}
              </h2>
              <p className=" text-lg font-medium text-gray-800">
                {files.length == 0
                  ? "Upload the documents you want to translate. We’ll prepare it for the next step."
                  : "Verify your uploads and make any changes before processing."}
              </p>
            </div>

            {files.length == 0 && (
              <div>
                <Button
                  variant="outline"
                  leftIcon={
                    <History
                      size={22}
                      strokeWidth={2}
                      className=" text-gray-800"
                    />
                  }
                >
                  View History
                </Button>
              </div>
            )}
          </div>

          {/* When User doesn't uploaded any document, this section will appear to upload file */}
          {files.length === 0 && (
            <MainFileUpload
              onFilesSelected={handleFiles}
              onBrowseClick={() => fileInputRef.current?.click()}
              title="Drag and drop your documents here, or click to browse"
              supportedText="Supported formats: PDF, DOCX, TXT"
              helperText="Max file size: 2 GB, Max pages: 2500"
            />
          )}

          {/* When user Upload any file, this section will apper */}
          {files.length !== 0 && (
            <>
              <UploadedFilesGrid
                files={files}
                onFilesSelected={() => fileInputRef.current?.click()}
                onRemoveFile={(item) => removeFile(item)}
                onPreviewFile={(item) => handlePreview(item.file)}
              />

              <div className="flex gap-10 justify-end">
                <Button
                  variant="outline"
                  className="w-67"
                  onClick={handleCancelAll}
                >
                  Cancel
                </Button>

                <Button
                  rightIcon={<ArrowRight size={18} />}
                  disabled={files.length === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    uploadAllFiles();
                    navigate("/operations/translate/select-tag");
                  }}
                  className="w-67"
                >
                  Next Step
                </Button>
              </div>
            </>
          )}

          {/* <div
            className=" bg-indigo-50 border-indigo-200 rounded-lg text-black p-4 text-xl 
        shadow-[0_1px_2px_0_rgba(0,0,0,0.30),0_2px_6px_2px_rgba(0,0,0,0.15)]
        "
          >
            💡 No tokens are used during upload. Token estimation will be shown
            before translation starts.
          </div> */}
        </div>
      </section>
    </>
  );
};

export default TranslateDoc;
