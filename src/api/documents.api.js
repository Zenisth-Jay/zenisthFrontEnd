import api from "./axios"; // Use our custom instance with the interceptor
import axios from "axios";

export const createDocumentAPI = (payload) => {
  return api.post(
    `${import.meta.env.VITE_INITIAL_DOCUMENT_UPLOAD}/documents`,
    payload,
  );
};

export const uploadToS3 = async (uploadUrl, file, onProgress) => {
  const res = await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
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
