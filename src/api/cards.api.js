import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["toolCards"],

  endpoints: (builder) => ({
    // GET TOOL CARDS - DASHBOARD
    getCards: builder.query({
      query: () => ({
        url: `/applications`,
      }),
      providesTags: ["toolCards"],
    }),
  }),
});

export const { useGetCardsQuery } = cardsApi;
