import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => `/userProfile`,
    }),

    // UPDATE USER PROFILE - CURRENTLY NOT ACTIVE
    updateUserName: builder.mutation({
      query: ({ user_id, role, name }) => ({
        url: `/users`,
        method: "PUT",
        body: {
          user_id,
          role,
          name,
        },
      }),
    }),
  }),
});

// Export hooks
export const { useGetUserProfileQuery, useUpdateUserNameMutation } =
  userProfileApi;
