import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const createDocumentAPI = (payload) => {
  api.post("/documents", payload);
};

export const uploadToS3 = (uploadUrl, file, onProgress) => {
  axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
    onUploadProgress: (evt) => {
      if (!evt.total) return;
      const percent = Math.round((evt.loaded * 100) / evt.total);
      onProgress(percent);
    },
  });
};
