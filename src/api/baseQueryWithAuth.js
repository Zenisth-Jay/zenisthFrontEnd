import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient";

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "", // we will pass full URLs in endpoints

  prepareHeaders: async (headers) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`);
      }

      headers.set("Content-Type", "application/json");

      return headers;
    } catch (error) {
      console.error("Auth header error:", error);
      return headers;
    }
  },
});
