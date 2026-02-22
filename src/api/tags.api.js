import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); //
      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`); //
      }
      return headers;
    },
  }),
  tagTypes: ["Tags"],
  endpoints: (builder) => ({
    // 1. GET all translation tags (organizationId removed)
    getTags: builder.query({
      query: ({ applicationId }) => `/tags?applicationId=${applicationId}`, //
      providesTags: ["Tags"],
    }),

    getTagById: builder.query({
      query: (tagId) => `/tags/${tagId}`,
    }),

    updateTag: builder.mutation({
      query: ({ id, body }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Tag", id }],
    }),

    // 2. Toggle favorite
    toggleFavoriteTag: builder.mutation({
      query: ({ id, isFavorite }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body: { isFavorite },
      }),
      invalidatesTags: ["Tags"],
    }),

    // 3. Create Tag (organizationId removed)
    createTag: builder.mutation({
      query: ({ applicationId, tab, body }) => ({
        url: `/tags?applicationId=${applicationId}&tab=${tab}`, //
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tags"],
    }),

    // 4. File upload for IDP
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
  useGetTagByIdQuery,
  useToggleFavoriteTagMutation,
  useCreateTagMutation,
  useUpdateTagMutation,
} = tagsApi;
