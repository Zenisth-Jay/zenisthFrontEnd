import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../supabase/supabaseClient"; //
import { baseQueryWithAuth } from "./baseQueryWithAuth";

const JOB_DISPATCHER_URL = {
  TRANSLATE: import.meta.env.VITE_TRANSLATE_JOB_DISPATCHER,
  IDP: import.meta.env.VITE_IDP_JOB_DISPATCHER,
};

export const translateApi = createApi({
  reducerPath: "translateApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Tokens"],

  endpoints: (builder) => ({
    // START TRANSLATE OR IDP JOB
    startJob: builder.mutation({
      query: ({ tagId, application, cost }) => ({
        url: `${JOB_DISPATCHER_URL[application]}${application == "IDP" ? "/idp" : "/translate"}`,
        method: "POST",
        body: {
          tag_id: tagId,
          cost: cost,
        },
      }),
      invalidatesTags: ["Tokens"],
    }),
  }),
});

export const { useStartJobMutation } = translateApi;
