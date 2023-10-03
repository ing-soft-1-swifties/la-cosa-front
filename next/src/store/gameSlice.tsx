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

const initialState: GameState = {
  config: {
    id: 4,
    name: "La partida",
    host: "Tomas",
    minPlayers: 1,
    maxPlayers: 12,
  },
  status: GameStatus.WAITING,
  players: [
    {
      name: "Tomas",
    },
    {
      name: "Franco Molina",
    },
    {
      name: "Victoria Lopez",
    },
    {
      name: "Lautaro Ebner",
    },
    {
      name: "El Profe",
    },
    {
      name: "Alejito",
    },
    {
      name: "Pepito",
    },
  ],
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameState(state, action: PayloadAction<GameState>) {
      state.config = action.payload.config
      state.players = action.payload.players
      state.status = action.payload.status
    },
  },
});

export const { setGameState } = gameSlice.actions;

export default gameSlice.reducer;
