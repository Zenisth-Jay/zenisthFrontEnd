import { useEffect, useMemo, useRef, useState } from "react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import Button from "../../../components/ui/Button";
import { History, Upload, FileText, Plus, ArrowRight, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { createDocumentAPI, uploadToS3 } from "../../../api/documents.api";
import {
  openOverlay,
  addUpload,
  updateProgress,
  markSuccess,
  markError,
  markBatchComplete,
  clearUploads,
} from "../../../redux/features/uploadSlice";
import { useDispatch } from "react-redux";
import MainFileUpload from "../../../components/general/MainFileUpload";
import UploadedFilesGrid from "../../../components/general/UploadedFileGrid";
import {
  useGetDocumentHistoryAllFilesQuery,
  useDeleteDocumentMutation,
} from "../../../api/documentHistory.api";

const isDeletedStatus = (status) =>
  String(status ?? "")
    .trim()
    .toUpperCase() === "DELETED";

const DocumentPreview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // batch_id: URL ?batch_id=xxx, or location state from Document History, or fallback for dev
  const batch_id =
    searchParams.get("batchId") || location.state?.batchId || 1772716498466;

  const {
    data: filesData,
    isLoading: filesLoading,
    isError: filesError,
  } = useGetDocumentHistoryAllFilesQuery({ batch_id }, { skip: !batch_id });

  useEffect(() => {
    // Support both { data: [...] } and { data: { files: [...] } } or raw array
    const rawList = Array.isArray(filesData?.data)
      ? filesData.data
      : Array.isArray(filesData?.data?.files)
        ? filesData.data.files
        : Array.isArray(filesData?.files)
          ? filesData.files
          : Array.isArray(filesData)
            ? filesData
            : [];

    // Hide deleted documents from the preview UI.
    const visibleList = rawList.filter(
      (file) => !isDeletedStatus(file?.status),
    );

    if (visibleList.length === 0) {
      setExistingFiles([]);
      return;
    }

    const mapped = visibleList.map((file) => {
      const fileName = file.filename ?? file.name ?? "file";
      const ext = String(fileName).split(".").pop()?.toLowerCase() ?? "";

      const typeMap = {
        pdf: "application/pdf",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
      };

      const type = typeMap[ext] || "application/octet-stream";

      let sizeBytes = 0;
      const rawSize = file.size;
      if (typeof rawSize === "number" && !Number.isNaN(rawSize)) {
        sizeBytes = rawSize;
      } else if (typeof rawSize === "string") {
        const sizeMatch = rawSize.match(/([\d.]+)\s*(KB|MB|GB)/i);
        if (sizeMatch) {
          const value = parseFloat(sizeMatch[1]);
          const unit = sizeMatch[2].toUpperCase();
          if (unit === "KB") sizeBytes = value * 1024;
          if (unit === "MB") sizeBytes = value * 1024 * 1024;
          if (unit === "GB") sizeBytes = value * 1024 * 1024 * 1024;
        }
      }

      return {
        id: file.id,
        name: fileName,
        size: Math.round(sizeBytes),
        type,
        source: "db",
      };
    });

    setExistingFiles(mapped);
  }, [filesData]);

  // Check Tool Type
  const { toolType } = useParams();
  const isIdp = toolType == "idp";

  // Allowed FIles
  const ALLOWED_TYPES = isIdp
    ? ["application/pdf", "image/png", "image/jpeg"]
    : [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

  // initialize files array
  const fileInputRef = useRef(null);

  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const files = useMemo(() => {
    const localFilesNormalized = newFiles.map((f) => ({
      id: f.id,
      name: f.file?.name || "file",
      size: f.file?.size || 0,
      type: f.file?.type || "application/octet-stream",
      source: "local",
    }));

    return [...existingFiles, ...localFilesNormalized].filter(Boolean);
  }, [existingFiles, newFiles]);

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

  // Same batch (epoch) for all uploads on this page – new files are added to existing batch
  const currentBatchId = batch_id;

  const [deleteDocument] = useDeleteDocumentMutation();

  // Upload only new (local) files into the same batch; runs after navigate so overlay shows on next page
  const uploadNewFilesOnly = () => {
    if (newFiles.length === 0) return;

    dispatch(clearUploads());
    dispatch(openOverlay());

    newFiles.forEach((fileObj) => {
      dispatch(
        addUpload({
          id: fileObj.id,
          name: fileObj.file.name,
          progress: 0,
          status: "uploading",
          batchId: currentBatchId,
        }),
      );
    });

    // (async () => {
    //   for (const fileObj of newFiles) {
    //     await startUpload(fileObj, currentBatchId);
    //   }
    // })();

    (async () => {
      let isFirst = true;

      const totalBatchSize = newFiles.reduce((sum, f) => sum + f.file.size, 0);

      for (const fileObj of newFiles) {
        await startUpload(fileObj, currentBatchId, isFirst, totalBatchSize);
        isFirst = false;
      }
    })();
  };

  const getSelectTagPath = () =>
    `/operations/${isIdp ? "idp" : "translate"}/select-tag?batchId=${currentBatchId}`;

  const handleNextStep = (e) => {
    e.stopPropagation();
    if (files.length === 0) return;

    const hasNewFiles = newFiles.length > 0;

    if (!hasNewFiles) {
      // Only existing (API) files – open overlay in "uploaded" state so next page batch calculation works
      dispatch(clearUploads());
      dispatch(openOverlay());
      existingFiles.forEach((f) => {
        dispatch(
          addUpload({
            id: f.id,
            name: f.name,
            progress: 100,
            status: "success",
            batchId: currentBatchId,
          }),
        );
      });
      dispatch(markBatchComplete());
      navigate(getSelectTagPath());
      return;
    }

    // Has new files – navigate first, then upload runs in background (overlay on next page)
    navigate(getSelectTagPath());
    uploadNewFilesOnly();
  };

  // Upload one file into the given batch (same epoch – adds to existing batch)
  // const startUpload = async (fileObj, batchId) => {
  //   const id = fileObj.id;

  //   try {
  //     const res = await createDocumentAPI({
  //       fileName: fileObj.file.name,
  //       fileSize: fileObj.file.size,
  //       application: isIdp ? "IDP" : "TRANSLATE",
  //       batchId, // same batch_id so file is added to existing batch, not new epoch
  //     });

  //     const { uploadUrl } = res.data;
  //     console.log(res);

  //     // 2. REAL upload to S3
  //     await uploadToS3(uploadUrl, fileObj.file, (percent) => {
  //       dispatch(updateProgress({ id, progress: percent }));
  //     });

  //     // 3. Mark success
  //     dispatch(markSuccess({ id }));
  //   } catch (err) {
  //     console.error(err);
  //     dispatch(markError({ id }));
  //   }
  // };

  const startUpload = async (fileObj, batchId, isFirst, totalBatchSize) => {
    const id = fileObj.id;

    try {
      const payload = {
        fileName: fileObj.file.name,
        fileSize: fileObj.file.size,
        application: isIdp ? "IDP" : "TRANSLATE",
        batchId,
      };

      // ✅ IMPORTANT (same as TranslateDoc)
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
    setExistingFiles([]);
    setNewFiles([]);
    setShowUploadOverlay(false);
    setUploadStatus({});

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
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
          : "Only DOCX files are allowed",
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
    const existingTotalSize = newFiles.reduce((sum, f) => sum + f.file.size, 0);
    const newTotalSize = validCandidates.reduce((sum, f) => sum + f.size, 0);

    if (existingTotalSize + newTotalSize > MAX_TOTAL_SIZE) {
      toast.error("Total upload size cannot exceed 5 GB", { autoClose: 3000 });
      return;
    }

    // Deduplicate + add
    setNewFiles((prev) => {
      const existingKeys = new Set(
        prev.map((f) => `${f.file.name}-${f.file.size}`),
      );

      const newItems = validCandidates
        .filter((file) => !existingKeys.has(`${file.name}-${file.size}`))
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          progress: 0,
          status: "pending",
          source: "local", // important flag
        }));

      if (newItems.length === 0) {
        toast.info("These files are already added");
        return prev;
      }

      return [...prev, ...newItems];
    });
  };

  // *** Delete File using delete btn
  const removeFile = (item) => {
    if (item.source === "local") {
      setNewFiles((prev) => prev.filter((f) => f.id !== item.id));
      return;
    }
    if (item.source === "db") {
      const deletedItem = {
        id: item.id,
        name: item.name,
        size: item.size,
        type: item.type,
        source: "db",
      };
      setExistingFiles((prev) => prev.filter((f) => f.id !== item.id));
      deleteDocument({
        doc_id: item.id,
        batch_id: currentBatchId,
      })
        .unwrap()
        .catch((err) => {
          setExistingFiles((prev) => [...prev, deletedItem]);
          const message =
            err?.status === 409
              ? "Cannot delete the last document in the batch."
              : err?.data?.message || "Failed to delete document.";
          toast.error(message);
        });
    }
  };

  if (filesLoading) {
    return (
      <>
        <MainNavbar />
        <div className="p-10 text-center text-gray-600">
          Loading documents...
        </div>
      </>
    );
  }

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
            accept={isIdp ? ".pdf,.png,.jpg,.jpeg" : ".docx"}
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
              <div className="shrink-0">
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
              </div>
            )}
          </div>

          {/* When User doesn't uploaded any document, this section will appear to upload file */}
          {files.length === 0 && (
            <MainFileUpload
              onFilesSelected={handleFiles}
              onBrowseClick={() => fileInputRef.current?.click()}
              title="Drag and drop your documents here, or click to browse"
              supportedText={`Supported formats: ${isIdp ? "PDF , PNG, JPG, JPEG" : "DOCX"}`}
              helperText="Max file size: 20 MB, Max Total File Size: 5GB"
            />
          )}

          {/* When user has files, show the grid and actions */}
          {files.length !== 0 && (
            <>
              <UploadedFilesGrid
                files={files || []}
                onFilesSelected={() => fileInputRef.current?.click()}
                onRemoveFile={(item) => removeFile(item)}
              />

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 md:gap-10 justify-end">
                <Button
                  variant="outline"
                  className="w-full sm:w-40 md:w-67"
                  onClick={handleCancelAll}
                >
                  Cancel
                </Button>

                <Button
                  rightIcon={<ArrowRight size={18} />}
                  onClick={handleNextStep}
                  className="w-full sm:w-40 md:w-67"
                >
                  Next Step
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default DocumentPreview;
