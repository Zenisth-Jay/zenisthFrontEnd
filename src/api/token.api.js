import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const tokenApi = createApi({
  reducerPath: "tokenApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Tokens"],

  endpoints: (builder) => ({
    getTokens: builder.query({
      query: () => `${import.meta.env.VITE_GET_CREDIT_BALANCE}/credits`,
      providesTags: ["Tokens"],
    }),
  }),
});

export const { useGetTokensQuery } = tokenApi;
