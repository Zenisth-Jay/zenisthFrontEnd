import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  tagTypes: ["toolCards"],
  endpoints: (builder) => ({
    getCards: builder.query({
      query: () => "/applications/",
      providesTags: ["toolCards"],
    }),
  }),
});

export const { useGetCardsQuery } = cardsApi;
