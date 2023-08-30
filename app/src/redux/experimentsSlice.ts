import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  experimentId: null,
  experimentName: "",
  repoPath: "/",
};
const experimentSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    updateExperimentId: (state, action) => {
      state.experimentId = action.payload;
    },
    updateExperimentName: (state, action) => {
      state.experimentName = action.payload;
    },
    updateRepoPath: (state, action) => {
      state.repoPath = action.payload;
    },
  },
});

// // Export actions
export const { updateExperimentId, updateExperimentName, updateRepoPath } =
  experimentSlice.actions;

// // Export reducer
export default experimentSlice.reducer;
