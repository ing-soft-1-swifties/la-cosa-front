import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserState = { 
  name: string | undefined; 
  gameConnToken: string | undefined;// Token de conexion del usuario
};

const initialState: UserState = {
  name: undefined,
  gameConnToken: undefined, 
};

export const userSlice = createSlice({ 
  name: "user",
  initialState,
  reducers: {
    setGameConnectionToken(state, action: PayloadAction<string | undefined>) { // Establece el token de conexion del usuario
      state.gameConnToken = action.payload;  // Establece el token de conexion del usuario
    },
    setUserName(state, action: PayloadAction<string | undefined>) { // Establece el nombre del usuario
      state.name = action.payload;
    },
  },
});

export const { setGameConnectionToken, setUserName } = userSlice.actions; // Exporta las acciones

export default userSlice.reducer;
