import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const documentHistoryApi = createApi({
  reducerPath: "documentHistoryApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["DocumentHistory"],

  endpoints: (builder) => ({
    // GET DOCUMENT HISTORY BATCHES
    getDocumentHistoryBatches: builder.query({
      query: ({ page = 1, limit = 7 }) => ({
        url: `${import.meta.env.VITE_GET_DOCUMENT_HISTORY_BATCHES}/documents?page=${page}&limit=${limit}`,
      }),
      providesTags: ["DocumentHistory"],
    }),

    // GET DOCUMENT HISTORY FILES - IN PAGINATION
    getDocumentHistoryFiles: builder.query({
      query: ({ batch_id, page = 1, limit = 7 }) => ({
        url: `${import.meta.env.VITE_GET_DOCUMENT_HISTORY_FILES}documents/batches/${batch_id}?page=${page}&limit=${limit}`,
      }),
    }),

    // GET DOCUMENT HISTORY FILES - ALL FILES
    getDocumentHistoryAllFiles: builder.query({
      query: ({ batch_id }) => ({
        url: `${import.meta.env.VITE_GET_DOCUMENT_HISTORY_FILES}documents/batches/${batch_id}`,
      }),
    }),
  }),
});

export const {
  useGetDocumentHistoryBatchesQuery,
  useGetDocumentHistoryFilesQuery,
  useGetDocumentHistoryAllFilesQuery,
} = documentHistoryApi;
