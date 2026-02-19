// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const creditManageApi = createApi({
//   reducerPath: "creditManageApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_BASE_URL,
//     prepareHeaders: (headers) => {
//       const token = import.meta.env.VITE_BEARER_AUTHENTICATION_URL;

//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }

//       return headers;
//     },
//   }),
//   tagTypes: ["CreditManagement"],
//   endpoints: (builder) => ({
//     getCreditManagement: builder.query({
//       query: ({ page = 1, limit = 7 }) =>
//         `/credits/history?page=${page}&limit=${limit}`,
//       providesTags: ["CreditManagement"],
//     }),
//   }),
// });

// export const { useGetCreditManagementQuery } = creditManageApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

export const creditManageApi = createApi({
  reducerPath: "creditManageApi",
  baseQuery: fetchBaseQuery({
    // Ensure this uses your VITE_API_BASE_URL for the secure pipeline
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: async (headers) => {
      // Get the fresh user session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        // Use the dynamic JWT instead of a static .env token
        headers.set("Authorization", `Bearer ${session.access_token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["CreditManagement"],
  endpoints: (builder) => ({
    getCreditManagement: builder.query({
      // The Lambda will now extract the user_id/org_id from the token
      query: ({ page = 1, limit = 7 }) =>
        `/credits/history?page=${page}&limit=${limit}`,
      providesTags: ["CreditManagement"],
    }),
  }),
});

export const { useGetCreditManagementQuery } = creditManageApi;
