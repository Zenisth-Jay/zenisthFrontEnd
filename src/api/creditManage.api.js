import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const creditManageApi = createApi({
  reducerPath: "creditManageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SUPABASE_API,
    prepareHeaders: (headers) => {
      const token = import.meta.env.VITE_BEARER_AUTHENTICATION_URL;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["CreditManagement"],
  endpoints: (builder) => ({
    getCreditManagement: builder.query({
      query: ({ page = 1, limit = 7 }) =>
        `/credit_management?page=${page}&limit=${limit}`,
      providesTags: ["CreditManagement"],
    }),
  }),
});

export const { useGetCreditManagementQuery } = creditManageApi;
