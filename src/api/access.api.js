import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient";

export const accessApi = createApi({
  reducerPath: "accessApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // 1. GET all users
    getUsers: builder.query({
      query: () => `/users`,
      providesTags: ["Users"],
    }),

    // 2. Invite / Create user
    // inviteUser: builder.mutation({
    //   query: (body) => ({
    //     url: `/users`,
    //     method: "POST",
    //     body, // { email, role }
    //   }),
    //   invalidatesTags: ["Users"],
    // }),

    // 3. Update user (edit role, etc.)
    updateUser: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users`,
        method: "PUT",
        body: {
          user_id: userId,
          role: role,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    // // 4. Delete user
    // deleteUser: builder.mutation({
    //   query: (id) => ({
    //     url: `/users/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Users"],
    // }),
  }),
});

export const {
  useGetUsersQuery,
  //   useInviteUserMutation,
  useUpdateUserMutation,
  //   useDeleteUserMutation,
} = accessApi;
