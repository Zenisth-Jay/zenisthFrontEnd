import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const tokenApi = createApi({
  reducerPath: "tokenApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Tokens"],

  endpoints: (builder) => ({
    getTokens: builder.query({
      query: () => `/credits`,
      providesTags: ["Tokens"],
    }),
  }),
});

export const { useGetTokensQuery } = tokenApi;
