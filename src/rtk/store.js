// eslint-disable-next-line no-unused-vars
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
