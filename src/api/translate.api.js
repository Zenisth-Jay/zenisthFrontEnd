import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

export const translateApi = createApi({
  reducerPath: "translateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    // --- ADD THE JWT INJECTOR ---
    prepareHeaders: async (headers) => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); //
      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`); //
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    startJob: builder.mutation({
      query: ({ tagId, application, cost }) => ({
        url: application === "IDP" ? "/idp" : "/translate",
        method: "POST",
        body: {
          tag_id: tagId,
          cost: 45,
        },
      }),
    }),
  }),
});

export const { useStartJobMutation } = translateApi;
