import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum GameStatus {
  WAITING = 0,
  PLAYING = 1,
  FINISHED = 2,
}

type GamePlayer = {
  name: string;
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
  players: [],
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
    resetGameState(state) {
      state.config = initialState.config
      state.status = initialState.status
      state.players = initialState.players
    }
  },
});

export const { setGameState } = gameSlice.actions;

export default gameSlice.reducer;
