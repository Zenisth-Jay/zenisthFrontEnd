import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const createDocumentAPI = (payload) => {
  return api.post("/documents", payload);
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
