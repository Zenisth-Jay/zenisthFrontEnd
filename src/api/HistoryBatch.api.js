import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //
import { baseQueryWithAuth } from "./baseQueryWithAuth";

// URLs
const HISTORY_BATCH_URLS = {
  translate: import.meta.env.VITE_GET_TRANSLATE_HISTORY_BATCH_URL,
  idp: import.meta.env.VITE_GET_IDP_HISTORY_BATCH_URL,
};

const HISTORY_FILES_URLS = {
  translate: import.meta.env.VITE_GET_TRANSLATE_HISTORY_FILES_URL,
  idp: import.meta.env.VITE_GET_IDP_HISTORY_FILES_URL,
};

// MAIN Endpoints
export const historyBatchApi = createApi({
  reducerPath: "historyBatchApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["HistoryBatches"],

  endpoints: (builder) => ({
    // GET HISTORY BATCHES (paginated)
    getHistoryBatches: builder.query({
      query: ({ page = 1, limit = 10, appType = "translate" }) => ({
        url: `${HISTORY_BATCH_URLS[appType]}/${appType}/?page=${page}&limit=${limit}`,
      }),
      providesTags: ["HistoryBatches"],
    }),

    // GET HISTORY FILES OF A BATCH (paginated)
    getBatchFiles: builder.query({
      query: ({ jobId, page = 1, limit = 10, appType = "translate" }) => ({
        url: `${HISTORY_FILES_URLS[appType]}/${appType}/${jobId}?page=${page}&limit=${limit}`,
      }),
    }),

    //  STATUS OF A JOB - FOR STATUS PAGE
    getJobStatus: builder.query({
      query: ({ jobId, appType = "translate" }) => ({
        url: `${HISTORY_FILES_URLS[appType]}/${appType}/${jobId}`,
      }),
    }),
  }),
});

export const {
  useGetHistoryBatchesQuery,
  useGetBatchFilesQuery,
  useGetJobStatusQuery,
} = historyBatchApi;
