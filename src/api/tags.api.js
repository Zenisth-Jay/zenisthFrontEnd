import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

export const tagsApi = createApi({
  reducerPath: "tagsApi",
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
  tagTypes: ["Tags"],
  endpoints: (builder) => ({
    getTags: builder.query({
      // Notice: We can eventually remove organizationId from query params 
      // because the backend will extract it from the JWT metadata.
      query: ({ organizationId, applicationId }) =>
        `/tags?organizationId=${organizationId}&applicationId=${applicationId}`,
      providesTags: ["Tags"],
    }),

    toggleFavoriteTag: builder.mutation({
      query: ({ id, isFavorite }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body: { isFavorite },
      }),
      invalidatesTags: ["Tags"],
    }),

    createTag: builder.mutation({
      query: ({ organizationId, applicationId, tab, body }) => ({
        url: `/tags?organizationId=${organizationId}&applicationId=${applicationId}&tab=${tab}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tags"],
    }),

    uploadIdpFile: builder.mutation({
      query: (formData) => ({
        url: "/idp/upload", 
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetTagsQuery,
  useToggleFavoriteTagMutation,
  useCreateTagMutation,
} = tagsApi;