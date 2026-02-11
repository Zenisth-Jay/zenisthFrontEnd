import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const batchSummaryApi = createApi({
  reducerPath: "batchSummaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getBatchSummary: builder.query({
      query: ({ application, userId }) =>
        `/credits/quote?application=${application}&user_id=${userId}`,
    }),
  }),
});

export const { useGetBatchSummaryQuery } = batchSummaryApi;
