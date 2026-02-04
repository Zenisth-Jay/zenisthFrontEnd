import { configureStore } from "@reduxjs/toolkit";
import { tokenApi } from "../api/token.api";
import { cardsApi } from "../api/cards.api";
import { notificationApi } from "../api/notificationApi";

export const store = configureStore({
  reducer: {
    [tokenApi.reducerPath]: tokenApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tokenApi.middleware,
      cardsApi.middleware,
      notificationApi.middleware,
    ),
});
