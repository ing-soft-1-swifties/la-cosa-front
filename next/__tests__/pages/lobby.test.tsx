import { screen } from "@testing-library/react";
import Lobby from "@/src/pages/lobby";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState, setupStore, store } from "@/store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import { GameStatus, PlayerRole, initialState, setGameState } from "@/store/gameSlice";
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
        id: 1,
        name: "Pepito",
        position: 1,
      },
    ],
    playerData: {
      cards: [],
      cardSelected: undefined,
      playerID: 1,
      playerSelected: 1,
      role: PlayerRole.INFECTED,
    },
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
        id: 1,
        name: "Pepito",
        position: 1,
      },
      {
        id: 2,
        name: "Pepito2",
        position: 2,
      },
      {
        id: 3,
        name: "Pepito3",
        position: 3,
      },
      {
        id: 4,
        name: "Pepito4",
        position: 4,
      },
    ],
    playerData: {
      cards: [],
      cardSelected: undefined,
      playerID: 1,
      playerSelected: 1,
      role: PlayerRole.INFECTED,
    },
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
        id: 1,
        name: "Pepito",
        position: 1,
      },
      {
        id: 2,
        name: "NotPepito",
        position: 2,
      },
    ],
    playerData: {
      cards: [],
      cardSelected: undefined,
      playerID: 1,
      playerSelected: 1,
      role: PlayerRole.INFECTED,
    },
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
    store.dispatch(setGameState(initialState));
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

  it("begin game button starts game", async () => {
    act(() => {
      renderWithProviders(<Lobby />, {
        preloadedState: HostAppStateGameReady,
      });
    });
    const startButton = screen.getByTestId("lobby_start_button");

    // Mockeamos la respuesta del server socket
    serverSocket.once(MessageType.ROOM_START_GAME, (callback) => {
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
          playerData: {
            cards: [],
            cardSelected: undefined,
            playerID: 1,
            playerSelected: 1,
            role: PlayerRole.INFECTED,
          },
        },
      };
      serverSocket.emit(EventType.ON_ROOM_START_GAME, newState);
      callback();
    });

    await act(async () => {
      startButton.click();
      // Damos un margen de 1000ms para que se hayan procesado los asyncs
      // Es importante que se haga aca para que no salte error por actualizacion de estado fuera de act
      await new Promise((res) => setTimeout(res, 1000));
    });

    // Veamos que se haya actualizado el estado a partir de la respuesta mockeada
    expect(store.getState().game.config.id).toBe(1234);
    expect(store.getState().game.config.name).toBe("1234");
    expect(store.getState().game.config.host).toBe("1234");
    expect(store.getState().game.config.minPlayers).toBe(5);
    expect(store.getState().game.config.maxPlayers).toBe(11);
    expect(store.getState().game.players).toEqual([]);
    expect(store.getState().game.status).toBe(GameStatus.PLAYING);

    // Veamos que se haya enrutado a la pagina del juego
    expect(mockRouter.pathname).toBe("/game");
  });

  it("begin game button is not present because user is not host", () => {
    renderWithProviders(<Lobby />, {
      preloadedState: NotHostAppState,
    });
    const startButton = screen.queryByTestId("lobby_start_button");
    expect(startButton).not.toBeInTheDocument();
  });

  it("renders leave game button", () => {
    renderWithProviders(<Lobby />, {
      preloadedState: HostAppState,
    });
    const leaveButton = screen.getByTestId("lobby_leave_button");
    expect(leaveButton).toHaveTextContent("Salir del Lobby");
  });

  it("leave game button leaves game", () => {
    renderWithProviders(<Lobby />, {
      preloadedState: HostAppState,
    });

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

  it("updates state on player join", async () => {
    act(() => {
      renderWithProviders(<Lobby />, {
        preloadedState: HostAppState,
        store,
      });
    });

    const newState: GameStateData = {
      gameState: HostAppState.game!,
    };

    newState.gameState.players = newState.gameState.players.concat([
      {
        id: 1,
        name: "TheAmazingNewPlayer",
        position: 1,
      },
    ]);

    expect(screen.queryByText("TheAmazingNewPlayer")).not.toBeInTheDocument();
    await act(async () => {
      serverSocket.emit(EventType.ON_ROOM_NEW_PLAYER, newState);
    });
    // Damos un margen de 1000ms para que se hayan procesado los asyncs
    await new Promise((res) => setTimeout(res, 1000));
    screen.getByText("TheAmazingNewPlayer");
  });

  it("updates state on player leave", async () => {
    // Reseteamos el store de la apps
    store.dispatch(setGameState(HostAppStateGameReady.game!));

    // Renderizamos con el store de la App.
    act(() => {
      renderWithProviders(<Lobby />, {
        store,
      });
    });

    // Construimos un nuevo estado
    const newState: GameStateData = {
      gameState: HostAppStateGameReady.game!,
    };
    newState.gameState.players = newState.gameState.players.filter((player) => {
      return player.name != "Pepito2";
    });

    // Veamos que el jugador inicialmente este en la partida
    screen.getByText("Pepito2");

    // Emitimos el evento de que un jugador abandono la partida
    await act(async () => {
      serverSocket.emit(EventType.ON_ROOM_LEFT_PLAYER, newState);
    });

    // Damos un margen de 1000ms para que se hayan procesado los asyncs
    await new Promise((res) => setTimeout(res, 1000));
    expect(screen.queryByText("Pepito2")).not.toBeInTheDocument();
  });
});
