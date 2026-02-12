import { configureStore } from "@reduxjs/toolkit";
import { tokenApi } from "../api/token.api";
import { cardsApi } from "../api/cards.api";
import { notificationApi } from "../api/notificationApi";
import uploadReducer from "./features/uploadSlice";
import { tagsApi } from "../api/tags.api";
import { translateApi } from "../api/translate.api";
import { batchSummaryApi } from "../api/batchSummary.api";
import { historyBatchApi } from "../api/HistoryBatch.api";

export const store = configureStore({
  reducer: {
    upload: uploadReducer,
    [tokenApi.reducerPath]: tokenApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [translateApi.reducerPath]: translateApi.reducer,
    [batchSummaryApi.reducerPath]: batchSummaryApi.reducer,
    [historyBatchApi.reducerPath]: historyBatchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tokenApi.middleware,
      cardsApi.middleware,
      notificationApi.middleware,
      tagsApi.middleware,
      translateApi.middleware,
      batchSummaryApi.middleware,
      historyBatchApi.middleware,
    ),
});
