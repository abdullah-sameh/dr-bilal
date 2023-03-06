// eslint-disable-next-line no-unused-vars
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import allPatientsSlice from "./slices/allPatientsSlice";
import patientSlice from "./slices/patientSlice";
import statistcsSlice from "./slices/statistcsSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    statistics: statistcsSlice,
    allPatients: allPatientsSlice,
    patientById: patientSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
