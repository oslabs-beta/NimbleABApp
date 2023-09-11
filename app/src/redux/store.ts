import { configureStore } from '@reduxjs/toolkit';
import experimentsReducer from './experimentsSlice';

const store = configureStore({
  reducer: {
    experiments: experimentsReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
