import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const translateApi = createApi({
  reducerPath: "translateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    startTranslation: builder.mutation({
      query: ({ tagId }) => ({
        url: "/translate",
        method: "POST",
        body: {
          tag_id: tagId,
        },
      }),
    }),
  }),
});

export const { useStartTranslationMutation } = translateApi;
