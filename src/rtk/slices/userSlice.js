import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  initialState: {},
  name: "userSlice",
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      return { ...user };
    },
  },
});

export default userSlice.reducer;
export const { setUser } = userSlice.actions;
