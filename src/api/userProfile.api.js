import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
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
