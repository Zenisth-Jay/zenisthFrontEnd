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
        url: `${import.meta.env.VITE_GET_NOTIFICATIONS_URL}/notifications`,
      }),
      providesTags: ["Notifications"],
    }),

    // READ NOTIFICATION
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `${import.meta.env.VITE_READ_NOTIFICATION_URL}/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } =
  notificationApi;
