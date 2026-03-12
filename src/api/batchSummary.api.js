import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const batchSummaryApi = createApi({
  reducerPath: "batchSummaryApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    getBatchSummary: builder.query({
      async queryFn(
        { application, batch_id },
        _queryApi,
        _extraOptions,
        baseQuery,
      ) {
        await sleep(2000);

        let url = `${import.meta.env.VITE_CREDIT_CALCULATION_URL}/credits/quote?application=${encodeURIComponent(application)}`;

        if (batch_id) {
          url += `&batch_id=${encodeURIComponent(batch_id)}`;
        }

        console.log("Batch ID:", batch_id);
        console.log("Request URL:", url);

        const result = await baseQuery({
          url,
          method: "GET",
        });

        return result;
      },
    }),
  }),
});

export const { useGetBatchSummaryQuery } = batchSummaryApi;
