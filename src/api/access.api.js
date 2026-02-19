import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient";

export const accessApi = createApi({
  reducerPath: "accessApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL, // AWS API for /users
    prepareHeaders: async (headers) => {
      // For AWS API (and also fine for Supabase)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // 1. GET all users (AWS)
    getUsers: builder.query({
      query: () => `/users`,
      providesTags: ["Users"],
    }),

    // 2. Invite user (Supabase Edge Function)
    inviteUser: builder.mutation({
      query: ({ email, role }) => ({
        // IMPORTANT: full URL to edge function
        url: `${import.meta.env.VITE_SUPABASE_API}/invite_user`,
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: {
          email,
          role,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    // 3. Update user role (AWS)
    updateUser: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users`,
        method: "PUT",
        body: {
          user_id: userId, // backend expects this
          role: role,
        },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useInviteUserMutation,
  useUpdateUserMutation,
} = accessApi;
