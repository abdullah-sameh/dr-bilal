import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const getPatientById = createAsyncThunk(
  "patientSlice/getPatientById",
  async (patientId) => {
    const patientInfo = await getDoc(doc(db, "patients", patientId));
    return { id: patientInfo.id, data: patientInfo.data() };
  }
);

const patientSlice = createSlice({
  initialState: {},
  name: "patientSlice",
  reducers: {},
  extraReducers: (builder) => [
    builder.addCase(getPatientById.fulfilled, (state, action) => {
      return action.payload;
    }),
  ],
});

export default patientSlice.reducer;
