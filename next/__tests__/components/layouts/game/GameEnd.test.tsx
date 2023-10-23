import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState, store } from "@/store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import {
  CardSubTypes,
  CardTypes,
  GameStatus,
  PlayerRole,
  PlayerStatus,
  initialState,
  setGameState,
} from "@/store/gameSlice";
import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { AddressInfo } from "node:net";
import { setGameConnectionToken } from "@/store/userSlice";
import { Socket } from "socket.io-client";
import { io as ioc } from "socket.io-client";
import {
  EventType,
  setupGameSocketListeners,
} from "@/src/business/game/gameAPI/listener";
import GameEnd, { GameEndData } from "@/components/layouts/game/GameEnd";

// Mock Next Router for all tests.
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const TEST_CONNECTION_TOKEN = "SuperSecretToken";

const InGameAppState: PreloadedState<RootState> = {
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
        id: 1,
        name: "Pepito",
        position: 1,
        in_quarantine: false,
        status: PlayerStatus.ALIVE,
      },
      {
        id: 2,
        name: "Juanito",
        position: 2,
        in_quarantine: false,
        status: PlayerStatus.ALIVE,
      },
    ],
    playerData: {
      cards: [
        {
          id: 1,
          name: "Lanzallamas",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
        },
      ],
      cardSelected: 1,
      playerID: 1,
      playerSelected: 2,
      role: PlayerRole.INFECTED,
    },
  },
  user: {
    gameConnToken: TEST_CONNECTION_TOKEN,
    name: "Pepito",
  },
};

const mockGameSocket = jest.fn();
jest.mock("../../../../src/business/game/gameAPI/index", () => ({
  get gameSocket() {
    return mockGameSocket();
  },
}));

describe("Component Game End", () => {
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
    store.dispatch(setGameState(initialState));
  });

  it("renders", () => {
    renderWithProviders(<GameEnd />);
  });

  it("has text on game end event", async () => {
    renderWithProviders(<GameEnd />, {
      preloadedState: InGameAppState,
    });

    const data: GameEndData = {
      winner_team: "LA_COSA",
      roles: [
        ["Pepito", "LA_COSA"],
        ["Tomasulo", "INFECTADO"],
        ["DADA", "HUMANO"],
      ],
    };
    serverSocket.emit(EventType.ON_GAME_END, data);
    await new Promise((res) => setTimeout(res, 500));

    // Renderizo los resultados de la partida
    screen.getByText("Pepito:");
    const query = screen.getAllByText("LA COSA");
    expect(query).toHaveLength(2);
    screen.getByText("Tomasulo:");
    expect(screen.getAllByText("INFECTADO")).toHaveLength(1);
    screen.getByText("DADA:");
    expect(screen.getAllByText("HUMANO")).toHaveLength(1);

    screen.getByText("Volver al Menu Principal");
  });

  it("click on go to main menu", async () => {
    act(() => {
      renderWithProviders(<GameEnd />, {
        preloadedState: InGameAppState,
      });
    });

    const data: GameEndData = {
      winner_team: "LA_COSA",
      roles: [
        ["Pepito", "LA_COSA"],
        ["Tomasulo", "INFECTADO"],
        ["DADA", "HUMANO"],
      ],
    };
    serverSocket.emit(EventType.ON_GAME_END, data);
    await new Promise((res) => setTimeout(res, 500));

    const button = screen.getByText("Volver al Menu Principal");
    act(() => {
      button.click();
    });

    expect(mockRouter.pathname).toBe("/");
  });
});
