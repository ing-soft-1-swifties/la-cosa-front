import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum GameStatus {
  WAITING = 0,
  PLAYING = 1,
  FINISHED = 2,
}

export type GamePlayer = {
  name: string;
  id: number;
  position: number;
};

type GameConfig = {
  id: number;
  name: string;
  host: string;
  minPlayers: number;
  maxPlayers: number;
};

export type GameState = {
  config: GameConfig;
  status: GameStatus;
  players: GamePlayer[];
  playerID: number;
};

export const initialState: GameState = {
  config: {
    id: -1,
    name: "",
    host: "",
    minPlayers: 4,
    maxPlayers: 12,
  },
  status: GameStatus.WAITING,
  players: [
    { name: "Yo", id: 123, position: 0 },
    { name: "otro1", id: 124, position: 1 },
    { name: "otro2", id: 125, position: 2 },
    { name: "otro3", id: 126, position: 3 },
    { name: "otro4", id: 126, position: 4 },
    { name: "otro5", id: 126, position: 5 },
  ],
  playerID: 123,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameState(state, action: PayloadAction<GameState>) {
      state.config = action.payload.config;
      state.players = action.payload.players;
      state.status = action.payload.status;
    },
  },
});

export const { setGameState } = gameSlice.actions;

export default gameSlice.reducer;
