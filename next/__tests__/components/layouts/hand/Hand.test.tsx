import { screen } from "@testing-library/react";
import Lobby from "@/src/pages/lobby";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState, setupStore, store } from "@/store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import {
  CardSubTypes,
  CardTypes,
  GameStatus,
  initialState,
  setGameState,
} from "@/store/gameSlice";
import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";
// import {
//   buildSocket,
//   initGameSocket,
// } from "@/src/business/game/gameAPI";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { AddressInfo } from "node:net";
import { setGameConnectionToken } from "@/store/userSlice";
import { MessageType } from "@/src/business/game/gameAPI/manager";
import { Socket } from "socket.io-client";
import { io as ioc } from "socket.io-client";
import {
  EventType,
  GameStateData,
  setupGameSocketListeners,
} from "@/src/business/game/gameAPI/listener";
import { gameSocket } from "@/src/business/game/gameAPI";
import Hand from "@/components/layouts/game/Hand";

// Mock Next Router for all tests.
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const TEST_CONNECTION_TOKEN = "SuperSecretToken";

// Caracteristicas:
// -> El Usuario actual es el Host dentro de una partdia con jugadores
const PlayerInGameState: PreloadedState<RootState> = {
  game: {
    config: {
      id: -1,
      name: "",
      host: "",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.WAITING,
    players: [],
    playerData: {
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
        {
          id: 5,
          name: "La cosa",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
        },
      ],
      cardSelected: 1,
    },
  },
  user: {
    gameConnToken: TEST_CONNECTION_TOKEN,
    name: "Pepito",
  },
};


describe("Page Game", () => {
  
  beforeEach(async () => {
    store.dispatch(setGameState(initialState));
  });

  it("renders", () => {
    renderWithProviders(<Hand />);
  });

  it("has cards based on state", () => {
    renderWithProviders(<Hand />, {
      preloadedState: PlayerInGameState,
    });
    const game = PlayerInGameState.game!;
    screen.getByTestId(`HAND`);
    // Cards
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[0].id}`);
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[1].id}`);
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[2].id}`);
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[3].id}`);
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[4].id}`);
  });
});
