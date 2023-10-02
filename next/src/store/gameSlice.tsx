import { createSlice } from "@reduxjs/toolkit";

export enum GameStatus {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

type GamePlayer = {
  uuid: string;
  name: string;
};

type GameConfig = {
  name: string;
  host: string;
  minPlayers: number;
  maxPlayers: number;
};

export type GameState = {
  uuid: string;
  config: GameConfig;
  status: GameStatus;
  players: GamePlayer[];
};

const initialState: GameState = {
  uuid: "#04",
  config: {
    name: "La partida",
    host: "Tomas",
    maxPlayers: 0,
    minPlayers: 0,
  },
  status: GameStatus.WAITING,
  players: [
    {
      uuid: "1",
      name: "Tomas",
    },
    {
      uuid: "2",
      name: "Franco Molina",
    },
    {
      uuid: "3",
      name: "Victoria Lopez",
    },
    {
      uuid: "4",
      name: "Lautaro Ebner",
    },
    {
      uuid: "5",
      name: "El Profe",
    },
    {
      uuid: "6",
      name: "Alejito",
    },
    {
      uuid: "7",
      name: "Pepito",
    },
  ],
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    
  },
});

export const {} = gameSlice.actions;

export default gameSlice.reducer;
