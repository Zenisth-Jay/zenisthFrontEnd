import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  files: [], // { id, name, progress, status }
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
    },
    markError(state, action) {
      const { id } = action.payload;
      const file = state.files.find((f) => f.id === id);
      if (file) file.status = "error";
    },
    clearUploads(state) {
      state.files = [];
      state.isOpen = false;
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
