import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";

export const getAllPatients = createAsyncThunk(
  "allPatientsSlice/getAllPatients",
  async () => {
    const q = query(collection(db, "patients"), orderBy("code", "asc"));
    let allPatients = [];
    const allDocs = await getDocs(q);
    allDocs.forEach((doc) => {
      allPatients.push({ id: doc.id, data: doc.data() });
    });
    return allPatients;
  }
);

const patientsSlice = createSlice({
  initialState: [],
  name: "allPatientsSlice",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPatients.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default patientsSlice.reducer;
