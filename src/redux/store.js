import { configureStore } from "@reduxjs/toolkit";
import { tokenApi } from "../api/token.api";
import { cardsApi } from "../api/cards.api";
import { notificationApi } from "../api/notificationApi";
import uploadReducer from "./features/uploadSlice";
import { tagsApi } from "../api/tags.api";

export const store = configureStore({
  reducer: {
    upload: uploadReducer,
    [tokenApi.reducerPath]: tokenApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tokenApi.middleware,
      cardsApi.middleware,
      notificationApi.middleware,
      tagsApi.middleware,
    ),
});
