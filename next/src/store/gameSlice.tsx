import { createSlice } from "@reduxjs/toolkit";

export enum GameStatus {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

type GamePlayer = {
  name: string;
};

type GameState = {
  id: string;
  status: GameStatus;
  host: string;
  maxPlayers: number;
  minPlayers: number;
  players: GamePlayer[];
};

const initialState: GameState = {
  id: "#04",
  status: GameStatus.WAITING,
  host: "Tomas",
  maxPlayers: 0,
  minPlayers: 0,
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
  reducers: {},
});

export const {} = gameSlice.actions;

export default gameSlice.reducer;
