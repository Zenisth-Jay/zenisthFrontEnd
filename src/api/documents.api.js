import api from "./axios"; // Use our custom instance with the interceptor
import axios from "axios";

export const createDocumentAPI = (payload) => {
  return api.post(
    `${import.meta.env.VITE_INITIAL_DOCUMENT_UPLOAD}/documents`,
    payload,
  );
};

export const uploadToS3 = async (uploadUrl, fileObj, onProgress) => {
  const headers = {
    "Content-Type": fileObj.file.type,
    "x-amz-meta-batchid": fileObj.batchId.toString(),
  };

  // 👇 only for first file
  if (fileObj.isFirstDocument) {
    headers["x-amz-meta-isfirstdocument"] = "true";
    headers["x-amz-meta-totalbatchsize"] = fileObj.totalBatchSize.toString();
  }

  const res = await axios.put(uploadUrl, fileObj.file, {
    headers,
    onUploadProgress: (e) => {
      if (e.total && onProgress) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    },
  });

  if (res.status !== 200 && res.status !== 204) {
    throw new Error("Upload to S3 failed");
  }

  return true;
};
