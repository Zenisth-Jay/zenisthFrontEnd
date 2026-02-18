import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

export const historyBatchApi = createApi({
  reducerPath: "historyBatchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    // --- ADD THE JWT INJECTOR ---
    prepareHeaders: async (headers) => {
      const { data: { session } } = await supabase.auth.getSession(); //
      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`); //
      }
      return headers;
    },
  }),
  tagTypes: ["HistoryBatches"],
  endpoints: (builder) => ({
    // GET translation history batches (paginated)
    getHistoryBatches: builder.query({
      query: ({ page = 1, limit = 10, appType = "translate" }) =>
        `/${appType}/?page=${page}&limit=${limit}`,
      providesTags: ["HistoryBatches"],
    }),

    // GET files for a batch (paginated)
    getBatchFiles: builder.query({
      query: ({ jobId, page = 1, limit = 10, appType = "translate" }) =>
        `/${appType}/${jobId}?page=${page}&limit=${limit}`,
    }),

    // Status of a job
    getJobStatus: builder.query({
      query: ({ jobId, appType = "translate" }) => `/${appType}/${jobId}`,
    }),
  }),
});

export const {
  useGetHistoryBatchesQuery,
  useGetBatchFilesQuery,
  useGetJobStatusQuery,
} = historyBatchApi;
