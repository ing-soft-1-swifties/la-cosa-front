import { createSlice } from "@reduxjs/toolkit";

type UserState = {
  name: string;
};

const initialState: UserState = {
  name: "Tomas",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export const {} = userSlice.actions;

export default userSlice.reducer;
