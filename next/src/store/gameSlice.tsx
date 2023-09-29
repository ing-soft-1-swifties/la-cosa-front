import { createSlice } from "@reduxjs/toolkit";

type GameState = {
  game_id: "";
  host: "";
  maxPlayers: number;
  minPlayers: number;
  players: number;
};

const initialState: GameState = {
  game_id: "",
  host: "",
  maxPlayers: 0,
  minPlayers: 0,
  players: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
});

export const {} = gameSlice.actions;

export default gameSlice.reducer;
