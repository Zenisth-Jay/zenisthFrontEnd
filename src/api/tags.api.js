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
      query: ({ organizationId, applicationId }) =>
        `/tags?organizationId=${organizationId}&applicationId=${applicationId}`,
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

    createTag: builder.mutation({
      query: ({ organizationId, applicationId, tab, body }) => ({
        url: `/tags?organizationId=${organizationId}&applicationId=${applicationId}&tab=${tab}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tags"],
    }),

    // end of endpoints
  }),
});

export const {
  useGetTagsQuery,
  useToggleFavoriteTagMutation,
  useCreateTagMutation,
} = tagsApi;
