import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const historyBatchApi = createApi({
  reducerPath: "historyBatchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  tagTypes: ["HistoryBatches"],
  endpoints: (builder) => ({
    // GET translation history batches (paginated)
    getHistoryBatches: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/translate/?page=${page}&limit=${limit}`,
      providesTags: ["HistoryBatches"],
    }),

    // GET files for a batch (paginated)
    getBatchFiles: builder.query({
      query: ({ jobId, page = 1, limit = 10 }) =>
        `/translate/${jobId}?page=${page}&limit=${limit}`,
    }),

    // Status of a job
    getJobStatus: builder.query({
      query: (jobId) => `/translate/${jobId}`,
    }),
  }),
});

export const {
  useGetHistoryBatchesQuery,
  useGetBatchFilesQuery,
  useGetJobStatusQuery,
} = historyBatchApi;
