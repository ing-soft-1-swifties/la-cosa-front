import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState, setupStore, store } from "@/store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import { GameStatus, initialState, setGameState } from "@/store/gameSlice";
import mockRouter from "next-router-mock";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { AddressInfo } from "node:net";
import { setGameConnectionToken } from "@/store/userSlice";
import { Socket } from "socket.io-client";
import { io as ioc } from "socket.io-client";
import {
  EventType,
  GameStateData,
  setupGameSocketListeners,
} from "@/src/business/game/gameAPI/listener";
import Game from "@/src/pages/game";
import { act } from "react-dom/test-utils";

// Mock Next Router for all tests.
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const TEST_CONNECTION_TOKEN = "SuperSecretToken";

// Caracteristicas:
// -> No es posible iniciar la partida por falta de jugadores
// -> El Usuario actual es el Host
const HostAppState: PreloadedState<RootState> = {
  game: {
    config: {
      id: 1,
      name: "La partida",
      host: "Pepito",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.WAITING,
    players: [
      {
        name: "Pepito",
      },
    ],
  },
  user: {
    gameConnToken: TEST_CONNECTION_TOKEN,
    name: "Pepito",
  },
};

const HostAppStateGameReady: PreloadedState<RootState> = {
  game: {
    config: {
      id: 1,
      name: "La partida",
      host: "Pepito",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.WAITING,
    players: [
      {
        name: "Pepito",
      },
      {
        name: "Pepito_2",
      },
      {
        name: "Pepito_3",
      },
      {
        name: "Pepito_4",
      },
    ],
  },
  user: {
    gameConnToken: TEST_CONNECTION_TOKEN,
    name: "Pepito",
  },
};

// Caracteristicas:
// -> No es posible iniciar la partida por falta de jugadores
// -> El Usuario actual NO es el Host
const NotHostAppState: PreloadedState<RootState> = {
  game: {
    config: {
      id: 1,
      name: "La partida",
      host: "Pepito",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.WAITING,
    players: [
      {
        name: "Pepito",
      },
      {
        name: "NotPepito",
      },
    ],
  },
  user: {
    gameConnToken: TEST_CONNECTION_TOKEN,
    name: "NotPepito",
  },
};

const mockGameSocket = jest.fn();
jest.mock("../../src/business/game/gameAPI/index", () => ({
  get gameSocket() {
    return mockGameSocket();
  },
}));

const mockedToast = jest.fn(() => {})

jest.mock("@chakra-ui/react", () => {
  const originalModule = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...originalModule,

    // funcion que no hace nada, solo queremos ver sus llamadas luego
    useToast: () => mockedToast
  }
})

describe("Page Game", () => {
  let ioserver: any;
  let serverSocket: Socket;
  let clientSocket: Socket;

  beforeAll((done) => {
    mockRouter.replace("/game");

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
    store.dispatch(setGameState(initialState));
  });

  it("renders", () => {
    renderWithProviders(<Game />);
  });

  it("calls toast for each event", async () => {

    const newState: GameStateData = {
      gameState: {
        config: {
          id: 1234,
          name: "1234",
          host: "1234",
          minPlayers: 5,
          maxPlayers: 11,
        },
        players: [],
        status: GameStatus.PLAYING,
      },
    };

    await act(async () => {
      renderWithProviders(<Game />);
      serverSocket.emit(EventType.ON_ROOM_START_GAME, newState);
      await new Promise((res) => setTimeout(res, 1000));
    })
    expect(mockedToast.mock.calls.length).toBe(0)

  })
});
