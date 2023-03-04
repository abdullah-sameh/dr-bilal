import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const getStatistics = createAsyncThunk(
  "statisticsSlice/getStatistics",
  async () => {
    let dt = new Date();
    const ref = doc(db, "statistics", `${dt.getFullYear()}`);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data();
    } else {
      //if the current year doesn't exist init it
      let initialData = {
        illnesses: [
          { name: "أشعة عادية", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "حشو بلاتين", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "حشو كمبوزت", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "حشو عصب", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          {
            name: "حشو عادي أطفال",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            name: "حشو عصب أطفال",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            name: "تركيبة متحركة",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          { name: "طاقم متحرك", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "زراعة", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "خلع عادي", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "خلع ضرس عقل", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          {
            name: "خلع ضرس عقل مدفون",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          { name: "طربوش", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "دعامة معدن", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "دعامة فايبر", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "كوبري", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "جهاز أطفال", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "لصق طربوش", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "تنظيف جير", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "تلميع", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "تبييض", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "علاج", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        ],
        year: `${dt.getFullYear()}`,
      };
      let modelRef = collection(db, "statistics");
      await setDoc(doc(modelRef, `${dt.getFullYear()}`), initialData);
    }
  }
);

const statisticsSlice = createSlice({
  initialState: {},
  name: "statisticsSlice",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatistics.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default statisticsSlice.reducer;
