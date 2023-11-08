import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoxModel } from "@chakra-ui/utils";

export enum PlayerTurnState {
  PLAY_OR_DISCARD = "play_or_discard",
  SELECT_EXCHANGE_CARD = "select_exchange_Card",
}

export enum GameStatus {
  WAITING = "LOBBY",
  PLAYING = "IN_GAME",
  FINISHED = "FINISHED",
}

export enum PlayerRole {
  HUMAN = "HUMANO",
  INFECTED = "INFECTADO",
  THETHING = "LA_COSA",
}

export enum PlayerStatus {
  ALIVE = "VIVO",
  DEATH = "MUERTO",
}

export type GamePlayer = {
  name: string;
  id: number;
  status: PlayerStatus;
  in_quarantine: boolean;
  position: number;
  on_turn: boolean;
  on_exchange: boolean;
};

type GameConfig = {
  id: number;
  name: string;
  host: string;
  minPlayers: number;
  maxPlayers: number;
};

type PlayerData = {
  playerID: number;
  cards: Card[];
  role: PlayerRole;
  cardSelected: number | undefined;
  playerSelected: number | undefined;
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

export type Card = {
  id: number;
  name: string;
  type: CardTypes;
  subType: CardSubTypes | undefined;
  needTarget: boolean;
  targetAdjacentOnly: boolean;
};

export type GameState = {
  config: GameConfig;
  status: GameStatus;
  players: GamePlayer[];
  playerData?: PlayerData;
  player_in_turn: string | undefined;
  discardDeckDimensions: BoxModel | null;
  chat: {
    messages: ChatMessage[];
  };
};

export enum ChatMessageType {
  PLAYER_MESSAGE = "player_message",
  GAME_MESSAGE = "game_message",
}

export type ChatMessage = {
  type: ChatMessageType;
  player_id?: number;
  message: string;
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
  player_in_turn: "otro2",
  players: [
    {
      name: "Yo",
      id: 123,
      position: 0,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
    },
    {
      name: "otro1",
      id: 124,
      position: 1,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: true,
      on_exchange: false,
    },
    {
      name: "otro2",
      id: 125,
      position: 2,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
    },
    {
      name: "otro3",
      id: 126,
      position: 3,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
    },
    {
      name: "otro4",
      id: 127,
      position: 4,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
    },
    {
      name: "otro5",
      id: 128,
      position: 5,
      in_quarantine: false,
      status: PlayerStatus.DEATH,
      on_turn: false,
      on_exchange: false,
    },
  ],
  playerData: {
    playerID: 123,
    cards: [
      {
        id: 1,
        name: "Lanzallamas",
        type: CardTypes.AWAY,
        subType: CardSubTypes.ACTION,
        needTarget: true,
        targetAdjacentOnly: true,
      },
      {
        id: 2,
        name: "Infectado",
        type: CardTypes.AWAY,
        subType: CardSubTypes.ACTION,
        needTarget: false,
        targetAdjacentOnly: false,
      },
      {
        id: 3,
        name: "¡Nada de barbacoas!",
        type: CardTypes.AWAY,
        subType: CardSubTypes.ACTION,
        needTarget: true,
        targetAdjacentOnly: false,
      },
      {
        id: 4,
        name: "¡No, gracias!",
        type: CardTypes.AWAY,
        subType: CardSubTypes.DEFENSE,
        needTarget: false,
        targetAdjacentOnly: false,
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
    role: PlayerRole.INFECTED,
  },
  discardDeckDimensions: null,
  chat: {
    messages: [],
  },
};

export type BackendGameState = {
  config: GameConfig;
  status: GameStatus;
  players: GamePlayer[];
  playerData: PlayerData;
  player_in_turn: string | undefined;
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    selectPlayer(state, action: PayloadAction<number>) {
      state.playerData!.playerSelected = action.payload;
    },
    unselectPlayer(state) {
      state.playerData!.playerSelected = undefined;
    },
    setGameState(state, action: PayloadAction<BackendGameState>) {
      state.config = action.payload.config;
      state.players = action.payload.players;
      state.status = action.payload.status;
      state.playerData = action.payload.playerData;
      state.player_in_turn = action.payload.player_in_turn;
    },
    setSelectedCard(state, action: PayloadAction<number | undefined>) {
      state.playerData!.cardSelected = action.payload;
      state.playerData!.playerSelected = undefined;
    },
    resetGameState(state) {
      state.config = initialState.config;
      state.status = initialState.status;
      state.players = initialState.players;
    },
    setDiscardDeckDimensions(state, action: PayloadAction<BoxModel>) {
      state.discardDeckDimensions = action.payload;
    },
    addChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.chat.messages = state.chat.messages.concat(action.payload);
    },
  },
});

export const {
  setGameState,
  setSelectedCard,
  selectPlayer,
  unselectPlayer,
  setDiscardDeckDimensions,
  addChatMessage,
} = gameSlice.actions;

export default gameSlice.reducer;
