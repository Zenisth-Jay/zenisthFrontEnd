import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const accessApi = createApi({
  reducerPath: "accessApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // 1. GET ALL USER FOR ONE ORGANIZATION IN ACCESS CONTROL PAGE
    getUsers: builder.query({
      query: () => ({
        url: `/users`,
      }),
      providesTags: ["Users"],
    }),

    // 2. INVITE USER - ACCESS CONTROL PAGE - USING SUPABSE EDGE FUNCTION
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

    // 3. UPDATE USER ROLE - ACCESS CONTROL PAGE
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
