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

    inviteUser: builder.mutation({
      async queryFn({ email, role }) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          const response = await fetch(
            "https://edbcaulyfozpczksuwqg.supabase.co/functions/v1/invite_user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                email,
                role,
              }),
            },
          );

          const data = await response.json();

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data,
              },
            };
          }

          return { data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              data: error.message,
            },
          };
        }
      },

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
