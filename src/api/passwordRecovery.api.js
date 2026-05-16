import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRecoveryAuth } from "./baseQueryWithRecoveryAuth";

export const passwordRecoveryApi = createApi({
  reducerPath: "passwordRecoveryApi",

  baseQuery: baseQueryWithRecoveryAuth,

  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: ({ password }) => ({
        url: "auth/change-password",
        method: "PUT",

        body: {
          password,
        },
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = passwordRecoveryApi;
