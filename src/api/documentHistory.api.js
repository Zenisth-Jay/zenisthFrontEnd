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
      providesTags: (result, error, { batch_id }) =>
        batch_id ? [{ type: "DocumentHistory", id: `files-${batch_id}` }] : [],
    }),

    // GET DOCUMENT HISTORY FILES - ALL FILES
    getDocumentHistoryAllFiles: builder.query({
      query: ({ batch_id }) => ({
        url: `${import.meta.env.VITE_GET_DOCUMENT_HISTORY_FILES}documents/batches/${batch_id}`,
      }),
    }),

    // DELETE DOCUMENT
    deleteDocument: builder.mutation({
      query: ({ doc_id }) => ({
        url: `${import.meta.env.VITE_DELETE_DOCUMENT_URL}documents/${doc_id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, err, { batch_id }) =>
        batch_id
          ? [
              { type: "DocumentHistory", id: `files-${batch_id}` },
              "DocumentHistory",
            ]
          : [],
    }),
  }),
});

export const {
  useGetDocumentHistoryBatchesQuery,
  useGetDocumentHistoryFilesQuery,
  useGetDocumentHistoryAllFilesQuery,
  useDeleteDocumentMutation,
} = documentHistoryApi;
