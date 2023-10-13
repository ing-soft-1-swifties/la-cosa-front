import { StatHelpText } from "@chakra-ui/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum GameStatus {
  WAITING = 0,
  PLAYING = 1,
  FINISHED = 2,
}

export enum PlayerRole {
  HUMAN = 'HUMANO',
  INFECTED = 'INFECTADO',
  THETHING = 'LA_COSA',
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

type PlayerData = {
  cards: card[];
  cardSelected: number | undefined;
  playerID: number;
  playerSelected: number | undefined;
  role: PlayerRole;
};

// no se si poner en ingles estos nombres pero por ahora nos manejamos asi
export enum CardTypes {
  AWAY = "ALEJATE",
  PANIC = "PANICO",
}
export enum CardSubTypes {
  CONTAGION = "CONTAGIO",
  ACTION = "ACCION",
  DEFENSE = "DEFENSA",
  OBSTACLE = "OBSTACULO",
}

type card = {
  id: number;
  name: string;
  type: CardTypes;
  subType: CardSubTypes | undefined;
};

export type GameState = {
  config: GameConfig;
  status: GameStatus;
  players: GamePlayer[];
  playerData: PlayerData;
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
    { name: "otro4", id: 127, position: 4 },
    { name: "otro5", id: 128, position: 5 },
  ],
  playerData: {
    playerID: 123,
    cards: [
      {
        id: 1,
        name: "Lanzallamas",
        type: CardTypes.AWAY,
        subType: CardSubTypes.ACTION,
      },
      {
        id: 2,
        name: "Infectado",
        type: CardTypes.AWAY,
        subType: CardSubTypes.ACTION,
      },
      {
        id: 3,
        name: "¡Nada de barbacoas!",
        type: CardTypes.AWAY,
        subType: CardSubTypes.ACTION,
      },
      {
        id: 4,
        name: "¡No, gracias!",
        type: CardTypes.AWAY,
        subType: CardSubTypes.ACTION,
      },
      // {
      //   id: 5,
      //   name: "La cosa",
      //   type: CardTypes.AWAY,
      //   subType: CardSubTypes.ACTION,
      // },
    ],
    cardSelected: 1,
    playerSelected: undefined,
    role: PlayerRole.HUMAN,
  },
};

export type BackendGameState = {
  config: GameConfig;
  status: GameStatus;
  players: GamePlayer[];
  playerData: PlayerData;
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    selectPlayer(state, action: PayloadAction<number>) {
      state.playerData.playerSelected = action.payload;
    },
    unselectPlayer(state) {
      state.playerData.playerSelected = undefined;
    },
    setGameState(state, action: PayloadAction<BackendGameState>) {
      state.config = action.payload.config;
      state.players = action.payload.players;
      state.status = action.payload.status;
      state.playerData = action.payload.playerData;
    },
    setSelectedCard(state, action: PayloadAction<number | undefined>) {
      state.playerData.cardSelected = action.payload;
    },
    resetGameState(state) {
      state.config = initialState.config
      state.status = initialState.status
      state.players = initialState.players
    }
  },
});

export const { setGameState, setSelectedCard, selectPlayer, unselectPlayer } = gameSlice.actions;

export default gameSlice.reducer;
