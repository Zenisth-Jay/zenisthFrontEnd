import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

export const tokenApi = createApi({
  reducerPath: "tokenApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    // --- ADD THE JWT INJECTOR ---
    prepareHeaders: async (headers) => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); //
      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`); //
      }
      return headers;
    },
  }),
  tagTypes: ["Tokens"],
  endpoints: (builder) => ({
    getTokens: builder.query({
      // Removed the hardcoded organizationId.
      // The Lambda will now extract this from the token metadata.
      query: () => "/credits",
      providesTags: ["Tokens"],
    }),
  }),
});

export const { useGetTokensQuery } = tokenApi;
