import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tokenApi = createApi({
  reducerPath: "tokenApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),

  tagTypes: ["Tokens"],

  endpoints: (builder) => ({
    getTokens: builder.query({
      query: () =>
        "/credits?organizationId=7b2f5a9c-3c3e-4e9c-8d4b-1c7f9b123456",
      providesTags: ["Tokens"],
    }),
  }),
});

export const { useGetTokensQuery } = tokenApi;
