// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const userProfileApi = createApi({
//   reducerPath: "userProfileApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_BASE_URL,
//     prepareHeaders: (headers) => {
//       const token = import.meta.env.VITE_BEARER_AUTHENTICATION_URL;

//       console.log(token);

//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }

//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getUserProfile: builder.query({
//       async queryFn(_args, _queryApi, _extraOptions, baseQuery) {
//         const result = await baseQuery("/userProfile");
//         return result;
//       },
//     }),

//     updateUserName: builder.mutation({
//       async queryFn(name, _queryApi, _extraOptions, baseQuery) {
//         const result = await baseQuery({
//           url: "/users/",
//           method: "PUT",
//           body: { name },
//         });
//         return result;
//       },
//     }),
//   }),
// });

// export const { useGetUserProfileQuery, useUpdateUserNameMutation } =
//   userProfileApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { supabase } from "../supabase/supabaseClient"; //

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,

    // --- ADD THE JWT INJECTOR ---

    prepareHeaders: async (headers) => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); //

      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`); //
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getUserProfile: builder.query({
      // We use a simple query now since the JWT identifies the requester

      query: () => "/userProfile",
    }),

    updateUserName: builder.mutation({
      query: ({ user_id, role, name }) => ({
        url: "/users/",
        method: "PUT",
        body: {
          user_id,
          role,
          name,
        },
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserNameMutation } =
  userProfileApi;
