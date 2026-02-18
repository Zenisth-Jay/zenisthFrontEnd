import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    // --- ADD THE JWT INJECTOR ---
    prepareHeaders: async (headers) => {
      const { data: { session } } = await supabase.auth.getSession(); //
      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`); //
      }
      return headers;
    },
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"], 
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } =
  notificationApi;
