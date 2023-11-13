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
  PlayerStatus,
  PlayerTurnState,
  initialState,
  setGameState,
  setSelectedCard,
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
import {
  DiscardCardPayload,
  MessageType,
  PlayCardPayload,
  PlayDefenseCardPayload,
  SelectExchangeCardPayload,
} from "@/src/business/game/gameAPI/manager";
import { Socket } from "socket.io-client";
import { io as ioc } from "socket.io-client";
import {
  EventType,
  GameStateData,
  setupGameSocketListeners,
} from "@/src/business/game/gameAPI/listener";
import { gameSocket } from "@/src/business/game/gameAPI";
import ActionBox from "@/components/layouts/game/ActionBox";
import { useDispatch } from "react-redux";

// Mock Next Router for all tests.
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const TEST_CONNECTION_TOKEN = "SuperSecretToken";

const notTurnExchangeState: PreloadedState<RootState> = {
  game: {
    config: {
      id: 1,
      name: "La partida",
      host: "Pepito",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.PLAYING,
    players: [
      {
        id: 1,
        name: "Pepito",
        position: 1,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: false,
        on_exchange: true,
      },
      {
        id: 2,
        name: "Juanito",
        position: 2,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: false,
        on_exchange: false,
      },
    ],
    playerData: {
      state: PlayerTurnState.DEFENDING,
      cards: [
        {
          id: 1,
          name: "Lanzallamas",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: true,
          targetAdjacentOnly: true,
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

const onTurnExchangeState: PreloadedState<RootState> = {
  game: {
    config: {
      id: 1,
      name: "La partida",
      host: "Pepito",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.PLAYING,
    players: [
      {
        id: 1,
        name: "Pepito",
        position: 1,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: true,
        on_exchange: true,
      },
      {
        id: 2,
        name: "Juanito",
        position: 2,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: false,
        on_exchange: false,
      },
    ],
    playerData: {
      state: PlayerTurnState.DEFENDING,
      cards: [
        {
          id: 1,
          name: "Lanzallamas",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: true,
          targetAdjacentOnly: true,
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

const onTurnState: PreloadedState<RootState> = {
  game: {
    config: {
      id: 1,
      name: "La partida",
      host: "Pepito",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.PLAYING,
    players: [
      {
        id: 1,
        name: "Pepito",
        position: 1,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: true,
        on_exchange: false,
      },
      {
        id: 2,
        name: "Juanito",
        position: 2,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: false,
        on_exchange: false,
      },
    ],
    playerData: {
      state: PlayerTurnState.DEFENDING,
      cards: [
        {
          id: 1,
          name: "Lanzallamas",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: true,
          targetAdjacentOnly: true,
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

const InGameAppState: PreloadedState<RootState> = {
  game: {
    config: {
      id: 1,
      name: "La partida",
      host: "Pepito",
      minPlayers: 4,
      maxPlayers: 12,
    },
    status: GameStatus.PLAYING,
    players: [
      {
        name: "Yo",
        id: 123,
        position: 0,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: false,
        on_exchange: false,
      },
      {
        name: "otro1",
        id: 124,
        position: 1,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: true,
        on_exchange: false,
      },
      {
        name: "otro2",
        id: 125,
        position: 2,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: false,
        on_exchange: false,
      },
      {
        name: "otro3",
        id: 126,
        position: 3,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: false,
        on_exchange: false,
      },
      {
        name: "otro4",
        id: 127,
        position: 4,
        quarantine: false,
        status: PlayerStatus.ALIVE,
        on_turn: false,
        on_exchange: false,
      },
      {
        name: "otro5",
        id: 128,
        position: 5,
        quarantine: false,
        status: PlayerStatus.DEATH,
        on_turn: false,
        on_exchange: false,
      },
    ],
    playerData: {
      state: PlayerTurnState.DEFENDING,
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
        {
          id: 5,
          name: "La cosa",
          type: CardTypes.AWAY,
          subType: CardSubTypes.ACTION,
          needTarget: false,
          targetAdjacentOnly: false,
        },
      ],
      cardSelected: 1,
      playerID: 1,
      playerSelected: undefined,
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
    renderWithProviders(<ActionBox />);
  });

  it("renders play and discard buttons when on turn", () => {
    renderWithProviders(<ActionBox />, {
      preloadedState: onTurnState,
    });
    const playBTN = screen.getByTestId("ACTION_BOX_PLAY_BTN");
    expect(playBTN).toHaveTextContent("Jugar");

    const discardBTN = screen.getByTestId("ACTION_BOX_DSC_BTN");
    expect(discardBTN).toHaveTextContent("Descartar");
  });

  it("renders exchange and defend buttons when offered an exchange", () => {
    renderWithProviders(<ActionBox />, {
      preloadedState: notTurnExchangeState,
    });

    const swapdBTN = screen.getByTestId("ACTION_BOX_SWAP_BTN");
    expect(swapdBTN).toHaveTextContent("Intercambiar");

    const defenseBTN = screen.getByTestId("ACTION_BOX_DEFENSE_BTN");
    expect(defenseBTN).toHaveTextContent("Defenderse");
  });

  it("renders exchange button when offering an exchange", () => {
    renderWithProviders(<ActionBox />, {
      preloadedState: onTurnExchangeState,
    });

    const swapdBTN = screen.getByTestId("ACTION_BOX_SWAP_BTN");
    expect(swapdBTN).toHaveTextContent("Intercambiar");
  });

  it("click on play", (done) => {
    act(() => {
      renderWithProviders(<ActionBox />, {
        preloadedState: onTurnState,
      });
    });

    // Mockeamos el servidor para revisar que llegue el mensaje
    serverSocket.once(MessageType.GAME_PLAY_CARD, (data) => {
      expect(data);
      const playCardPayload: PlayCardPayload = {
        card: 1,
        card_options: { target: 2 },
      };
      expect(data).toStrictEqual(playCardPayload);
      done();
    });

    const playbtn = screen.getByTestId("ACTION_BOX_PLAY_BTN");
    act(() => {
      playbtn.click();
    });
  });

  it("click on discard", (done) => {
    act(() => {
      renderWithProviders(<ActionBox />, {
        preloadedState: onTurnState,
      });
    });

    // Mockeamos el servidor para revisar que llegue el mensaje
    serverSocket.once(MessageType.GAME_DISCARD_CARD, (data) => {
      expect(data);
      const discardCardPayload: DiscardCardPayload = {
        card: 1,
      };
      expect(data).toStrictEqual(discardCardPayload);
      done();
    });

    const discardbtn = screen.getByTestId("ACTION_BOX_DSC_BTN");
    act(() => {
      discardbtn.click();
    });
  });

  it("click on swap", (done) => {
    act(() => {
      renderWithProviders(<ActionBox />, {
        preloadedState: onTurnExchangeState,
      });
    });

    // Mockeamos el servidor para revisar que llegue el mensaje
    serverSocket.once(MessageType.GAME_SELECT_EXCHANGE_CARD, (data) => {
      expect(data);
      const selectExchangeCardPayload: SelectExchangeCardPayload = {
        on_defense: false,
        card: 1,
      };
      expect(data).toStrictEqual(selectExchangeCardPayload);
      done();
    });

    const discardbtn = screen.getByTestId("ACTION_BOX_SWAP_BTN");
    act(() => {
      discardbtn.click();
    });
  });

  it("click on defense", (done) => {
    act(() => {
      renderWithProviders(<ActionBox />, {
        preloadedState: notTurnExchangeState,
      });
    });

    // Mockeamos el servidor para revisar que llegue el mensaje
    serverSocket.once(MessageType.GAME_PLAY_DEFENSE_CARD, (data) => {
      expect(data);
      const playDefenseCardPayload: PlayDefenseCardPayload = {
        card: 1,
        on_defense: true,
      };
      expect(data).toStrictEqual(playDefenseCardPayload);
      done();
    });

    const discardbtn = screen.getByTestId("ACTION_BOX_DEFENSE_BTN");
    act(() => {
      discardbtn.click();
    });
  });

  it("click on no defense", (done) => {
    act(() => {
      renderWithProviders(<ActionBox />, {
        preloadedState: notTurnExchangeState,
      });
    });

    // Mockeamos el servidor para revisar que llegue el mensaje
    serverSocket.once(MessageType.GAME_PLAY_DEFENSE_CARD, (data) => {
      expect(data);
      const playDefenseCardPayload: PlayDefenseCardPayload = {
        card: undefined,
        on_defense: false,
      };
      expect(data).toStrictEqual(playDefenseCardPayload);
      done();
    });

    const discardbtn = screen.getByTestId("ACTION_BOX_NO_DEFENSE_BTN");
    act(() => {
      discardbtn.click();
    });
  });

  it("check diferents test", () => {
    renderWithProviders(<ActionBox />, {
      store,
    });

    act(() => {
      store.dispatch(setSelectedCard(undefined));
    });
    screen.getByText("Seleccione una carta para jugar o descartar");

    act(() => {
      store.dispatch(setSelectedCard(3));
    });
    screen.getByText("La carta seleccionada necesita un objetivo");

    act(() => {
      store.dispatch(setSelectedCard(1));
    });
    screen.getByText("La carta seleccionada necesita un objetivo adyacente");

    act(() => {
      store.dispatch(setSelectedCard(4));
    });
    screen.getByText("Las cartas de defensa solo se pueden descartar");

    act(() => {
      store.dispatch(setSelectedCard(2));
    });
    screen.getByText("Seleccione la acción a realizar");
  });
});
