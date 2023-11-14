import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoxModel } from "@chakra-ui/utils";
import { G } from "msw/lib/glossary-de6278a9";
import GameCard from "components/layouts/game/GameCard";
import { GameStateData } from "business/game/gameAPI/listener";
import {CardTypes as CardNames} from "@/components/layouts/game/GameCard"

export enum PlayerTurnState {
  PLAYING = "PLAYING",
  WAITING = "WAITING",
  DEFENDING = "DEFENDING",
  RECEIVING_EXCHANGE = "RECEIVING_EXCHANGE",
  OFFERING_EXCHANGE = "OFFERING_EXCHANGE",
  PANICKING = "PANICKING",
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
  quarantine: number;
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
  doorSelected: number | undefined;
  playerSelected: number | undefined;
  state: PlayerTurnState;
  card_picking_amount: number;
  selectable_players: string[];
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
        //objetivo de la ultima carta jugada
        player_target?: string;
      }
    | undefined;
  
  dataCardPlayed: DataCardPlayed;
  doors_positions: number[];
  isExchanging: boolean;
  multiSelect: MultiSelectType;
};

export type MultiSelectType = {
  away_selected: number[];
};

export type DataCardPlayed = {
  title: string | undefined;
  cardsToShow: Card[] | undefined;
  player: string | undefined;
};

export enum ChatMessageType {
  PLAYER_MESSAGE = "player_message",
  GAME_MESSAGE = "game_message",
}

export enum ChatMessageSeverity {
  NORMAL = "normal",
  INFO = "info",
  WARNING = "warning",
  CRITICAL = "critical",
}

export type ChatMessage = {
  type: ChatMessageType;
  severity?: ChatMessageSeverity;
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
  player_in_turn: "Yo",
  direction: true,
  doors_positions: [1,2,3,4,5],
  players: [
    {
      name: "Otro 1",
      id: 124,
      position: 0,
      quarantine: 3,
      status: PlayerStatus.ALIVE,
      on_turn: true,
      on_exchange: false,
    },
    {
      name: "yo",
      id: 123,
      position: 1,
      quarantine: 3,
      status: PlayerStatus.ALIVE,
      on_turn: true,
      on_exchange: false,
    },
    {
      name: "ot",
      id: 125,
      position: 2,
      quarantine: 0,
      status: PlayerStatus.ALIVE,
      on_turn: true,
      on_exchange: false,
    },
    {
      name: "otro3",
      id: 126,
      position: 3,
      quarantine: 0,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
    },
    {
      name: "otro4",
      id: 127,
      position: 4,
      quarantine: 0,
      status: PlayerStatus.ALIVE,
      on_turn: false,
      on_exchange: false,
    },
    {
      name: "otro5",
      id: 128,
      position: 5,
      quarantine: 0,
      status: PlayerStatus.DEATH,
      on_turn: false,
      on_exchange: false,
    },
  ],
  playerData: {
    playerID: 124 ,
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
        name: "Hacha",
        type: CardTypes.AWAY,
        subType: CardSubTypes.ACTION,
        needTarget: true,
        targetAdjacentOnly: true,
      },
      {
        id: 5,
        name: "ROTTEN_ROPES",
        type: CardTypes.PANIC,
        subType: undefined,
        needTarget: false,
        targetAdjacentOnly: false,
      },
    ],
    card_picking_amount: 0,
    cardSelected: undefined,
    doorSelected: 3,
    selectable_players: [],
    playerSelected: undefined,
    role: PlayerRole.INFECTED,
    state: PlayerTurnState.PANICKING,
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
  multiSelect: {
    away_selected: [],
  },
  isExchanging: false
};

export type BackendGameState = {
  config: GameConfig;
  status: GameStatus;
  players: GamePlayer[];
  playerData?: PlayerData;
  player_in_turn: string | undefined;
  direction: boolean;
  doors_positions: number[];
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
      state.doors_positions = action.payload.doors_positions;
    },
    setSelectedCard(state, action: PayloadAction<number | undefined>) {
      state.playerData!.cardSelected = action.payload;
      state.playerData!.playerSelected = undefined;
      state.playerData!.doorSelected = undefined;
    },
    setSelectedDoor(state, action: PayloadAction<number | undefined>) {
      state.playerData!.doorSelected = action.payload;
    },
    unselectDoor(state) {
      state.playerData!.doorSelected = undefined;
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
      state.dataCardPlayed.title = action.payload.title;
    },
    setMultiSelect(state, action: PayloadAction<MultiSelectType>) {
      state.multiSelect = action.payload;
    },
  },
});

export const {
  setGameState,
  setSelectedCard,
  selectPlayer,
  unselectPlayer,
  setDiscardDeckDimensions,
  unselectDoor,
  setSelectedDoor,
  addChatMessage,
  resetGameState,
  setLastPlayedCard,
  setCardsToShow,
  setMultiSelect,
} = gameSlice.actions;

export default gameSlice.reducer;
