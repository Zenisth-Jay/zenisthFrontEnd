import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const creditManageApi = createApi({
  reducerPath: "creditManageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
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
        `/credits/history?page=${page}&limit=${limit}`,
      providesTags: ["CreditManagement"],
    }),
  }),
});

export const { useGetCreditManagementQuery } = creditManageApi;
