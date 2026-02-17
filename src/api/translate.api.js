import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const translateApi = createApi({
  reducerPath: "translateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    startJob: builder.mutation({
      query: ({ tagId, application }) => ({
        url: application === "IDP" ? "/idp" : "/translate",
        method: "POST",
        body: {
          tag_id: tagId,
        },
      }),
    }),
  }),
});

export const { useStartJobMutation } = translateApi;
