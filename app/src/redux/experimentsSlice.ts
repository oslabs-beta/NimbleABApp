import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  experimentId: null,
  experimentName: '',
  repoPath: '/',
  fullFilePath: '',
};
const experimentSlice = createSlice({
  name: 'experiment',
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
    updateFullFilePath: (state, action) => {
      console.log(action.payload);
      state.fullFilePath = action.payload;
    },
  },
});

// // Export actions
export const {
  updateExperimentId,
  updateExperimentName,
  updateRepoPath,
  updateFullFilePath,
} = experimentSlice.actions;

// // Export reducer
export default experimentSlice.reducer;
