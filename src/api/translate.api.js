import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

export const translateApi = createApi({
  reducerPath: "translateApi",
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
  endpoints: (builder) => ({
    startTranslation: builder.mutation({
      query: ({ tagId }) => ({
        url: "/translate",
        method: "POST",
        body: {
          tag_id: tagId,
        },
      }),
    }),
  }),
});

export const { useStartTranslationMutation } = translateApi;
