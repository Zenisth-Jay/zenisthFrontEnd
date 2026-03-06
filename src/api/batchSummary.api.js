import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //
import { baseQueryWithAuth } from "./baseQueryWithAuth";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const batchSummaryApi = createApi({
  reducerPath: "batchSummaryApi",
  baseQuery: baseQueryWithAuth,

  // FOR COMPUTING CREDITS OF DOCUMENTS
  endpoints: (builder) => ({
    getBatchSummary: builder.query({
      async queryFn({ application }, _queryApi, _extraOptions, baseQuery) {
        await sleep(2000);
        const result = await baseQuery({
          url: `${import.meta.env.VITE_CREDIT_CALCULATION_URL}/credits/quote?application=${application}`,
        });
        return result;
      },
    }),
  }),
});

export const { useGetBatchSummaryQuery } = batchSummaryApi;
