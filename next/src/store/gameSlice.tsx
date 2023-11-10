import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoxModel } from "@chakra-ui/utils";
import { G } from "msw/lib/glossary-de6278a9";
import GameCard from "components/layouts/game/GameCard";
import { GameStateData } from "business/game/gameAPI/listener";

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
  on_defense: boolean;
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
  direction: boolean;
  discardDeckDimensions: BoxModel | null;
  chat: {
    messages: ChatMessage[];
  };
  lastPlayedCard:
    | {
        player_name: string;
        card_id: number;
        card_name: string;
      }
    | undefined;
  dataCardPlayed: DataCardPlayed;
};

export type DataCardPlayed = {
  cardsToShow: Card[] | undefined;
  player: string | undefined;
  title: string | undefined
};

export enum ChatMessageType {
  PLAYER_MESSAGE = "player_message",
  GAME_MESSAGE = "game_message",
}

export type ChatMessage = {
  type: ChatMessageType;
  player_name?: string;
  message: string;
};

export type OnPlayedCardData = {
  gameState: GameStateData;
  card_id: number;
  card_name: string;
  card_options: any;
  player_name: string;
  effects: {
    player: string;
    cardsToShow: Card[];
  };
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
  direction: true,
  players: [
    {
      name: "Yo",
      id: 124,
      position: 0,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
      on_defense: true,
    },
    {
      name: "otro1",
      id: 123,
      position: 1,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: true,
      on_exchange: false,
      on_defense: true,
    },
    {
      name: "otro2",
      id: 125,
      position: 2,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
      on_defense: true,
    },
    {
      name: "otro3",
      id: 126,
      position: 3,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
      on_defense: true,
    },
    {
      name: "otro4",
      id: 127,
      position: 4,
      in_quarantine: false,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
      on_defense: true,
    },
    {
      name: "otro5",
      id: 128,
      position: 5,
      in_quarantine: false,
      status: PlayerStatus.DEATH,
      on_turn: false,
      on_exchange: false,
      on_defense: true,
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
  lastPlayedCard: undefined,
  dataCardPlayed: {
    title: undefined,
    player: undefined,
    cardsToShow: undefined,
  },
};

export type BackendGameState = {
  config: GameConfig;
  status: GameStatus;
  players: GamePlayer[];
  playerData?: PlayerData;
  player_in_turn: string | undefined;
  direction: boolean;
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
      state.direction = action.payload.direction;
    },
    setSelectedCard(state, action: PayloadAction<number | undefined>) {
      state.playerData!.cardSelected = action.payload;
      state.playerData!.playerSelected = undefined;
    },
    resetGameState(state) {
      state.config = initialState.config;
      state.status = initialState.status;
      state.players = initialState.players;
      state.chat = initialState.chat;
    },
    setDiscardDeckDimensions(state, action: PayloadAction<BoxModel>) {
      state.discardDeckDimensions = action.payload;
    },
    addChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.chat.messages = state.chat.messages.concat(action.payload);
    },
    setLastPlayedCard(
      state,
      action: PayloadAction<
        { player_name: string; card_id: number; card_name: string } | undefined
      >
    ) {
      state.lastPlayedCard = action.payload;
    },
    setCardsToShow(state, action: PayloadAction<DataCardPlayed>) {
      state.dataCardPlayed.cardsToShow = action.payload.cardsToShow;
      state.dataCardPlayed.player = action.payload.player;
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
  resetGameState,
  setLastPlayedCard,
  setCardsToShow,
} = gameSlice.actions;

export default gameSlice.reducer;
