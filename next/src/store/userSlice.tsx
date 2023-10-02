import { createSlice } from "@reduxjs/toolkit";

type UserState = {
  name: string;
  gameConnToken: string | undefined;
};

const initialState: UserState = {
  name: "Tomas",
  gameConnToken: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export const {} = userSlice.actions;

export default userSlice.reducer;
