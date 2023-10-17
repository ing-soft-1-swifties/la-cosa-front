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
import {
  DiscardCardPayload,
  MessageType,
  PlayCardPayload,
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

  it("has text based on state", () => {
    renderWithProviders(<ActionBox />, {
      preloadedState: InGameAppState,
    });
    const playBTN = screen.getByTestId("ACTION_BOX_PLAY_BTN");
    expect(playBTN).toHaveTextContent("Jugar");

    const discardBTN = screen.getByTestId("ACTION_BOX_DSC_BTN");
    expect(discardBTN).toHaveTextContent("Descartar");

    const swapdBTN = screen.getByTestId("ACTION_BOX_SWAP_BTN");
    expect(swapdBTN).toHaveTextContent("Intercambiar");
  });

  it("click on play", (done) => {
    act(() => {
      renderWithProviders(<ActionBox />, {
        preloadedState: InGameAppState,
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
        preloadedState: InGameAppState,
      });
    });

    // Mockeamos el servidor para revisar que llegue el mensaje
    serverSocket.once(MessageType.GAME_DISCARD_CARD, (data) => {
      expect(data);
      const discardCardPayload: DiscardCardPayload = {
        card: 1
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
      preloadedState: InGameAppState,
    });
  });

  // Mockeamos el servidor para revisar que llegue el mensaje
  serverSocket.once(MessageType.GAME_SELECT_EXCHANGE_CARD, (data) => {
    expect(data);
    const selectExchangeCardPayload: SelectExchangeCardPayload = {
      card: 1
    };
    expect(data).toStrictEqual(selectExchangeCardPayload);
    done();
  });

  const discardbtn = screen.getByTestId("ACTION_BOX_SWAP_BTN");
  act(() => {
    discardbtn.click();
  });
});
});