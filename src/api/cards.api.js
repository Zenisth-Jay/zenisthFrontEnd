import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    // --- ADD THE JWT INJECTOR ---
    prepareHeaders: async (headers) => {
      const { data: { session } } = await supabase.auth.getSession(); //
      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`); //
      }
      return headers;
    },
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
