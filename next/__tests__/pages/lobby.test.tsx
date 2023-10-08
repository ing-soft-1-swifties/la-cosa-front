import { screen } from "@testing-library/react";
import Lobby from "@/src/pages/lobby";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState, store } from "@/store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import { GameStatus } from "@/store/gameSlice";
import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";
import {
  buildSocket,
  gameSocket,
  initGameSocket,
} from "@/src/business/game/gameAPI";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { AddressInfo } from "node:net";
import { setGameConnectionToken } from "@/store/userSlice";
import { MessageType, leaveLobby } from "@/src/business/game/gameAPI/manager";
import { Socket } from "socket.io-client";

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

describe("Page Lobby", () => {
  let ioserver: any;
  let serverSocket: Socket;
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
      buildSocket(`http://localhost:${port}`);
      initGameSocket();
      gameSocket.on("connect", done);
      gameSocket.on(MessageType.ROOM_QUIT_GAME, () => {
        console.log("IPNFGAPMFDW{APWMDP{W")
      })
      serverSocket.emit(MessageType.ROOM_QUIT_GAME)
    });
  });

  afterAll(() => {
    ioserver.close();
    gameSocket.disconnect();
  });

  it("renders", () => {
    renderWithProviders(<Lobby />);
  });

  it("has text based on state", () => {
    renderWithProviders(<Lobby />, {
      preloadedState: HostAppState,
    });
    const game = HostAppState.game!;
    // UUID del Lobby
    screen.getByText(`Lobby ${game.config.id}`);
    // Nombre de la partida
    screen.getByText(`${game.config.name}`);
    // Titulo de la lista de Jugadores
    screen.getByText("Jugadores");
    // Host de la partida
    screen.getByText(`Host: ${game.config.host}`);
    // Minimo de Jugadores de la partida
    screen.getByText(`Minimo de Jugadores: ${game.config.minPlayers}`);
    // Maximo de Jugadores de la partida
    screen.getByText(`Maximo de Jugadores: ${game.config.maxPlayers}`);
    // Jugadores conectados en la partida
    screen.getByText(`Jugadores: ${game.players.length}`);
  });

  it("renders begin game button when user is host", () => {
    renderWithProviders(<Lobby />, {
      preloadedState: HostAppState,
    });
    const startButton = screen.getByTestId("lobby_start_button");
    expect(startButton).toHaveTextContent("Iniciar Partida");
  });

  it("begin game button is disabled because game can't start", () => {
    renderWithProviders(<Lobby />, {
      preloadedState: HostAppState,
    });
    const startButton = screen.getByTestId("lobby_start_button");
    expect(startButton).toBeDisabled();
  });

  it("renders leave game button", () => {
    renderWithProviders(<Lobby />, {
      preloadedState: HostAppState,
    });
    const leaveButton = screen.getByTestId("lobby_leave_button");
    expect(leaveButton).toHaveTextContent("Salir del Lobby");
  });

  it("leave game button leaves game", (done) => {
    renderWithProviders(<Lobby />, {
      preloadedState: HostAppState,
    });
    serverSocket.on(MessageType.ROOM_QUIT_GAME, () => {
      done();
    });
    console.log(serverSocket.listeners(MessageType.ROOM_QUIT_GAME))
    gameSocket.emit(MessageType.ROOM_QUIT_GAME);
    console.log(gameSocket)
    gameSocket.emit(MessageType.ROOM_QUIT_GAME, () => {
      done()
    })
    const leaveButton = screen.getByTestId("lobby_leave_button");
    act(() => {
      leaveButton.click();
    });
    expect(mockRouter.pathname).toBe("/");
  });

  it("shows players cards", () => {
    const appState = HostAppState;
    renderWithProviders(<Lobby />, {
      preloadedState: appState,
    });

    const game = appState.game!;
    game.players.forEach((player) => {
      screen.getByText(player.name);
    });
  });
});
