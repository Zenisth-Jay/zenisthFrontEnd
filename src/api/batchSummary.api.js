import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const batchSummaryApi = createApi({
  reducerPath: "batchSummaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    // --- ADD THIS SECTION ---
    prepareHeaders: async (headers) => {
      const { data: { session } } = await supabase.auth.getSession(); //
      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`); //
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBatchSummary: builder.query({
      async queryFn(args, _queryApi, _extraOptions, baseQuery) {
        // We can now remove 'userId' from args because the backend will get it from the JWT
        const { application } = args;

        await sleep(2000);

        // API call no longer needs user_id in the URL
        const result = await baseQuery(`/credits/quote?application=${application}`);

        return result;
      },
    }),
  }),
});

export const { useGetBatchSummaryQuery } = batchSummaryApi;
