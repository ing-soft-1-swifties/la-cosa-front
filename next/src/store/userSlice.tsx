import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserState = {
  name: string | undefined;
  gameConnToken: string | undefined;
  lobbyFormFieldSetter: ((arg1: string, arg2: any) => void) | undefined;
};

const initialState: UserState = {
  name: undefined,
  gameConnToken: undefined,
  lobbyFormFieldSetter: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGameConnectionToken(state, action: PayloadAction<string | undefined>) {
      state.gameConnToken = action.payload;
    },
    setUserName(state, action: PayloadAction<string | undefined>) {
      state.name = action.payload;
    },
    setLobbyFormFieldSetter(
      state,
      action: PayloadAction<((arg1: string, arg2: any) => void) | undefined>
    ) {
      state.lobbyFormFieldSetter = action.payload;
    },
  },
});

export const { setGameConnectionToken, setUserName, setLobbyFormFieldSetter } =
  userSlice.actions;

export default userSlice.reducer;
