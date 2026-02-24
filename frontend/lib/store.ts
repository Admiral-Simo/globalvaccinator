import { configureStore } from "@reduxjs/toolkit";
import { globalVaccinatorApi } from "@/lib/features/apiSlice";

export const store = configureStore({
  reducer: {
    [globalVaccinatorApi.reducerPath]: globalVaccinatorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(globalVaccinatorApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
