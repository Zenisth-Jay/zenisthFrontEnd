import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Notifications"],

  endpoints: (builder) => ({
    // GET NOTIFICATIONS
    getNotifications: builder.query({
      query: () => ({
        url: `/notifications`,
      }),
      providesTags: ["Notifications"],
    }),

    // READ NOTIFICATION
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } =
  notificationApi;
