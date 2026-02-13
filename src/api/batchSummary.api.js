import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// helper delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const batchSummaryApi = createApi({
  reducerPath: "batchSummaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getBatchSummary: builder.query({
      // Use queryFn instead of query
      async queryFn(args, _queryApi, _extraOptions, baseQuery) {
        const { application, userId } = args;

        // ⏱ Wait 1 second before calling API
        await sleep(2000);

        // Then call the real API
        const result = await baseQuery(
          `/credits/quote?application=${application}&user_id=${userId}`,
        );

        return result;
      },
    }),
  }),
});

export const { useGetBatchSummaryQuery } = batchSummaryApi;
