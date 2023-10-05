import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserState = {
  name: string;
  gameConnToken: string | undefined;
};

const initialState: UserState = {
  name: "Tomas",
  gameConnToken: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGameConnectionToken(state, action: PayloadAction<string>) {
      state.gameConnToken = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
  },
});

export const { setGameConnectionToken, setUserName } = userSlice.actions;

export default userSlice.reducer;
