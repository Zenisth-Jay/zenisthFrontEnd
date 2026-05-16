import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,

  //   SIGN UP
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (body) => ({
        url: "auth/signup",
        method: "POST",
        body,
      }),
    }),

    // VALIDATE TOKEN ON SIGNUP PAGE
    validateInvitation: builder.mutation({
      query: ({ token }) => ({
        url: "auth/validate-token",
        method: "POST",
        body: {
          p_token: token,
        },
      }),
    }),

    // LOGIN
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "auth/login",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),

    forgotPassword: builder.mutation({
      query: ({ email, redirectTo }) => ({
        url: "auth/forgot-password",
        method: "POST",

        body: {
          email,
          redirect_to: redirectTo,
        },
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useValidateInvitationMutation,
  useLoginMutation,
  useForgotPasswordMutation,
} = authApi;
