import { createSlice } from "@reduxjs/toolkit";

const persisted = JSON.parse(localStorage.getItem("uploadBatch") || "null");

const initialState = {
  isOpen: false,
  files: [],
  hasCompletedBatch: persisted?.hasCompletedBatch || false,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    openOverlay(state) {
      state.isOpen = true;
    },
    closeOverlay(state) {
      state.isOpen = false;
    },
    addUpload(state, action) {
      state.files.push(action.payload);
      state.hasCompletedBatch = false;
    },
    updateProgress(state, action) {
      const { id, progress } = action.payload;
      const file = state.files.find((f) => f.id === id);
      if (file) file.progress = progress;
    },
    markSuccess(state, action) {
      const { id } = action.payload;
      const file = state.files.find((f) => f.id === id);
      if (file) file.status = "success";

      const allDone =
        state.files.length > 0 &&
        state.files.every(
          (f) => f.status === "success" || f.status === "error",
        );

      if (allDone) {
        state.hasCompletedBatch = true;

        // ✅ persist batch completion
        localStorage.setItem(
          "uploadBatch",
          JSON.stringify({ hasCompletedBatch: true }),
        );
      }
    },

    markError(state, action) {
      const { id } = action.payload;
      const file = state.files.find((f) => f.id === id);
      if (file) file.status = "error";

      const allDone =
        state.files.length > 0 &&
        state.files.every(
          (f) => f.status === "success" || f.status === "error",
        );

      if (allDone) {
        state.hasCompletedBatch = true;

        // ✅ persist batch completion
        localStorage.setItem(
          "uploadBatch",
          JSON.stringify({ hasCompletedBatch: true }),
        );
      }
    },

    clearUploads(state) {
      state.files = [];
      state.isOpen = false;
      state.hasCompletedBatch = false;

      // ✅ clear persisted batch
      localStorage.removeItem("uploadBatch");
    },
  },
});

export const {
  openOverlay,
  closeOverlay,
  addUpload,
  updateProgress,
  markSuccess,
  markError,
  clearUploads,
} = uploadSlice.actions;

export default uploadSlice.reducer;
