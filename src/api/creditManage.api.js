import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const creditManageApi = createApi({
  reducerPath: "creditManageApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["CreditManagement"],

  endpoints: (builder) => ({
    // CREDIT MANAGEMENT PAGE - GET CREDIT HISTORY AND SOME DATA FOR CARDS
    getCreditManagement: builder.query({
      query: ({ page = 1, limit = 7 }) => ({
        url: `/credits/history?page=${page}&limit=${limit}`,
      }),
      providesTags: ["CreditManagement"],
    }),
  }),
});

export const { useGetCreditManagementQuery } = creditManageApi;
