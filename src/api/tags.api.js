import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Tags"],

  endpoints: (builder) => ({
    // 1. GET ALL TAGS
    getTags: builder.query({
      query: ({ applicationId }) => ({
        url: `${import.meta.env.VITE_GET_TAGS_URL}/tags?applicationId=${applicationId}`,
      }),
      providesTags: ["Tags"],
    }),

    // GET SPECIFIC TAG BY TAG-ID
    getTagById: builder.query({
      query: (tagId) => ({
        url: `${import.meta.env.VITE_GET_SPECIFIC_TAG_URL}/tags/${tagId}`,
      }),
    }),

    // UPDATE SPECIFIC TAG
    updateTag: builder.mutation({
      query: ({ id, body }) => ({
        url: `${import.meta.env.VITE_UPDATE_SPECIFIC_TAG}/tags/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Tag", id }],
    }),

    // TOGGLE FAVOURITE - STAR
    toggleFavoriteTag: builder.mutation({
      query: ({ id, isFavorite }) => ({
        url: `${import.meta.env.VITE_UPDATE_SPECIFIC_TAG}/tags/${id}`,
        method: "PUT",
        body: { isFavorite },
      }),
      invalidatesTags: ["Tags"],
    }),

    // CREATE TAG
    createTag: builder.mutation({
      query: ({ applicationId, tab, body }) => ({
        url: `${import.meta.env.VITE_CREATE_TAG_URL}/tags?applicationId=${applicationId}&tab=${tab}`, //
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tags"],
    }),

    // 4. File upload for IDP
    uploadIdpFile: builder.mutation({
      query: (formData) => ({
        url: `${import.meta.env.VITE_INITIAL_DOCUMENT_UPLOAD}/idp/upload`,
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
