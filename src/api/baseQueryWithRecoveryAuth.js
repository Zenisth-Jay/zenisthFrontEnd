import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient";

export const baseQueryWithRecoveryAuth = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,

  prepareHeaders: async (headers) => {
    headers.set("Content-Type", "application/json");

    // Required by Supabase Auth API
    headers.set("apikey", import.meta.env.VITE_SUPABASE_ANON_KEY);

    // Recovery/User JWT
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
    }

    return headers;
  },
});
