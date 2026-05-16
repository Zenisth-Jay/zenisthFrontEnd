import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,

  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");

    // Required for Supabase Edge Functions
    headers.set(
      "Authorization",
      `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    );

    // Supabase API key header
    headers.set("apikey", import.meta.env.VITE_SUPABASE_ANON_KEY);

    return headers;
  },
});
