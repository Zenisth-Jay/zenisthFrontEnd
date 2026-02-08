import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  tagTypes: ["Tags"],
  endpoints: (builder) => ({
    // GET all translation tags
    getTags: builder.query({
      query: () =>
        "/tags?organizationId=7b2f5a9c-3c3e-4e9c-8d4b-1c7f9b123456&applicationId=TRANSLATION",
      providesTags: ["Tags"],
    }),

    // Toggle favorite (or mark favorite)
    toggleFavoriteTag: builder.mutation({
      query: ({ id, isFavorite }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body: { isFavorite },
      }),
      invalidatesTags: ["Tags"], // refetch tags after update
    }),
  }),
});

export const { useGetTagsQuery, useToggleFavoriteTagMutation } = tagsApi;
