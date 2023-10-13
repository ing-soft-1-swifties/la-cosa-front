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
  PlayerRole,
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
      playerID: 1,
      role: PlayerRole.INFECTED,
    },
  },
  user: {
    gameConnToken: TEST_CONNECTION_TOKEN,
    name: "Pepito",
  },
};

<<<<<<< HEAD

describe("Page Game", () => {
  
  beforeEach(async () => {
=======
const mockGameSocket = jest.fn();
jest.mock("../../src/business/game/gameAPI/index", () => ({
  get gameSocket() {
    return mockGameSocket();
  },
}));

describe("Page Lobby", () => {
  let ioserver: any;
  let serverSocket: Socket;
  let clientSocket: Socket;

  beforeAll((done) => {
    mockRouter.replace("/lobby");

    // Setup Game Socket
    store.dispatch(setGameConnectionToken(TEST_CONNECTION_TOKEN));
    const httpServer = createServer();
    ioserver = new Server(httpServer);
    httpServer.listen(() => {
      const addr = httpServer.address() as AddressInfo;
      const port = addr.port;
      ioserver.on("connection", (socket: Socket) => {
        serverSocket = socket;
      });

      clientSocket = ioc(`http://localhost:${port}`, {
        transports: ["websocket"],
      });
      setupGameSocketListeners(clientSocket);
      mockGameSocket.mockReturnValue(clientSocket);
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    ioserver.close();
    clientSocket.disconnect();
  });

  beforeEach(async () => {
    if (clientSocket.disconnected) {
      clientSocket.connect();
      // Wait for reconnection
      await new Promise((res) => setTimeout(res, 200));
    }
>>>>>>> hand y carta terminado con sus estados y redux falta test
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
<<<<<<< HEAD
    screen.getByTestId(`HAND`);
    // Cards
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[0].id}`);
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[1].id}`);
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[2].id}`);
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[3].id}`);
    screen.getByTestId(`GAME_CARD_${game.playerData.cards[4].id}`);
=======
    // Cards
    screen.getByTestId(`Hand_card_${game.playerData.cards[0].id}`);
    screen.getByTestId(`Hand_card_${game.playerData.cards[1].id}`);
    screen.getByTestId(`Hand_card_${game.playerData.cards[2].id}`);
    screen.getByTestId(`Hand_card_${game.playerData.cards[3].id}`);
    screen.getByTestId(`Hand_card_${game.playerData.cards[4].id}`);
    screen.getByTestId(`Hand_card_${game.playerData.cards[5].id}`);
>>>>>>> hand y carta terminado con sus estados y redux falta test
  });
});
