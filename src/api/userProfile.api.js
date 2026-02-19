import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = import.meta.env.VITE_BEARER_AUTHENTICATION_URL;

      console.log(token);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      async queryFn(_args, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("/userProfile");
        return result;
      },
    }),

    updateUserName: builder.mutation({
      async queryFn(name, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: "/users/",
          method: "PUT",
          body: { name },
        });
        return result;
      },
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserNameMutation } =
  userProfileApi;
