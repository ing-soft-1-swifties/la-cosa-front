import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  GameStatus,
  PlayerStatus,
  CardTypes,
  CardSubTypes,
  PlayerRole,
  GamePlayer,
} from "@/store/gameSlice";

export const TEST_CONNECTION_TOKEN = "SuperSecretToken";

// Propiedades: Es host y esta en turno
export const HOST_PLAYER_NAME = "Pepito";
export const PLAYER_IN_GAME_NAME_MOCK_1 = HOST_PLAYER_NAME;
export const PLAYER_IN_GAME_DATA_MOCK_1: GamePlayer = {
  id: 1,
  name: HOST_PLAYER_NAME,
  status: PlayerStatus.ALIVE,
  position: 0,
  on_turn: true,
  on_exchange: false,
  quarantine: 0,
};

// Propiedades: No es host y no esta en turno
export const PLAYER_IN_GAME_NAME_MOCK_2 = "Algoritmo de Tomasulo";
export const PLAYER_IN_GAME_DATA_MOCK_2: GamePlayer = {
  id: 2,
  name: PLAYER_IN_GAME_NAME_MOCK_2,
  status: PlayerStatus.ALIVE,
  position: 1,
  on_turn: false,
  on_exchange: false,
  quarantine: 0,
};

// Propiedades: No es host y no esta en turno
export const PLAYER_IN_GAME_NAME_MOCK_3 = "Player 3";
export const PLAYER_IN_GAME_DATA_MOCK_3: GamePlayer = {
  id: 3,
  name: PLAYER_IN_GAME_NAME_MOCK_3,
  status: PlayerStatus.ALIVE,
  position: 2,
  on_turn: false,
  on_exchange: false,
  quarantine: 0,
};

// Propiedades: No es host y no esta en turno
export const PLAYER_IN_GAME_NAME_MOCK_4 = "Player 4";
export const PLAYER_IN_GAME_DATA_MOCK_4: GamePlayer = {
  id: 4,
  name: PLAYER_IN_GAME_NAME_MOCK_4,
  status: PlayerStatus.ALIVE,
  position: 3,
  on_turn: false,
  on_exchange: false,
  quarantine: 0,
};

export const PLAYER_IN_GAME_STATE_MOCK_1: PreloadedState<RootState> = {
  game: {
    config: {
      id: 10,
      name: "Game Test",
      host: PLAYER_IN_GAME_DATA_MOCK_1.name,
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.PLAYING,
    player_in_turn: HOST_PLAYER_NAME,
    direction: true,
    players: [
      PLAYER_IN_GAME_DATA_MOCK_1,
      PLAYER_IN_GAME_DATA_MOCK_2,
      PLAYER_IN_GAME_DATA_MOCK_3,
      PLAYER_IN_GAME_DATA_MOCK_4,
    ],
    playerData: {
      playerID: PLAYER_IN_GAME_DATA_MOCK_1.id,
      role: PlayerRole.INFECTED,
      playerSelected: 1,
      cardSelected: 1,
      cards: [
        {
          id: 0,
          name: "La cosa",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false,
        },
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
          targetAdjacentOnly: true,
        },
        {
          id: 4,
          name: "¡No, gracias!",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false,
        },
      ],
    },
    discardDeckDimensions: null,
    inspectingCard: undefined,
    chat: {
      messages: [],
    },
    lastPlayedCard: undefined,
  },
  user: {
    gameConnToken: TEST_CONNECTION_TOKEN,
    name: PLAYER_IN_GAME_DATA_MOCK_1.name,
    lobbyFormFieldSetter: undefined,
  },
};
