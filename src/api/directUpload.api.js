import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const directUploadApi = createApi({
  reducerPath: "directUploadApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Documents"],

  endpoints: (builder) => ({
    // DIRECT DOCUMENT UPLOAD
    directUploadDocument: builder.mutation({
      query: (payload) => ({
        url: `/documents`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Documents"],
    }),
  }),
});

export const { useDirectUploadDocumentMutation } = directUploadApi;
