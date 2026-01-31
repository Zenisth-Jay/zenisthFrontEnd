import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tokenApi = createApi({
  reducerPath: "tokenApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),

  tagTypes: ["Tokens"],

  endpoints: (builder) => ({
    getTokens: builder.query({
      query: () => "/credits?organizationId=org_002",
      providesTags: ["Tokens"],
    }),
  }),
});

export const { useGetTokensQuery } = tokenApi;
