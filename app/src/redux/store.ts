import { configureStore } from "@reduxjs/toolkit";
import experimentsReducer from "./experimentsSlice";

export const store = configureStore({
  reducer: {
    experiments: experimentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
