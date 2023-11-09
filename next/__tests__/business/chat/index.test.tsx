import "@testing-library/jest-dom";
import { store } from "@/store/store";
import {
  ChatMessage,
  ChatMessageType,
  resetGameState,
  setGameState,
} from "@/store/gameSlice";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { AddressInfo } from "node:net";
import { setGameConnectionToken } from "@/store/userSlice";
import { Socket } from "socket.io-client";
import { io as ioc } from "socket.io-client";
import { setupGameSocketListeners } from "@/src/business/game/gameAPI/listener";
import {
  PLAYER_IN_GAME_DATA_MOCK_1,
  PLAYER_IN_GAME_DATA_MOCK_2,
  PLAYER_IN_GAME_STATE_MOCK_1,
  TEST_CONNECTION_TOKEN,
} from "../../constants";
import {
  ChatAPIEventType,
  ChatAPIMessageType,
  OnPlayerNewMessagePayload,
  SendPlayerMessagePayload,
  sendPlayerMessage,
} from "@/src/business/game/chat";

// Mock Game Socket
const mockGameSocket = jest.fn();
jest.mock("../../../src/business/game/gameAPI/index", () => ({
  get gameSocket() {
    return mockGameSocket();
  },
}));

describe("Business Game Chat", () => {
  let ioserver: any;
  let serverSocket: Socket;
  let clientSocket: Socket;

  beforeAll((done) => {
    // Setup Game Socket Mock
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

  beforeEach(async () => {
    // Reconectamos el socket si es necesario
    if (clientSocket.disconnected) {
      clientSocket.connect();
      // Wait for reconnection
      await new Promise((res) => setTimeout(res, 200));
    }

    // Reseteamos el estado inicial
    store.dispatch(resetGameState());
    store.dispatch(setGameState(PLAYER_IN_GAME_STATE_MOCK_1.game!));
  });

  afterAll(() => {
    // Close connections
    ioserver.close();
    clientSocket.disconnect();
  });

  it("recieves messages", (done) => {
    const MESSAGE = "Some hardcoded message";

    const payload: OnPlayerNewMessagePayload = {
      player_name: PLAYER_IN_GAME_DATA_MOCK_2.name,
      message: MESSAGE,
    };
    serverSocket.emit(ChatAPIEventType.ON_PLAYER_NEW_MESSAGE, payload);

    const EXPECTED_MESSAGE: ChatMessage = {
      type: ChatMessageType.PLAYER_MESSAGE,
      player_name: payload.player_name,
      message: payload.message,
    };
    clientSocket.once(ChatAPIEventType.ON_PLAYER_NEW_MESSAGE, () => {
      expect(store.getState().game.chat.messages).toEqual([EXPECTED_MESSAGE]);
      done();
    });
  });

  it("send and recieve message back", (done) => {
    const MESSAGE = "Some hardcoded message to send";
    const PLAYER_NAME = PLAYER_IN_GAME_DATA_MOCK_1.name;

    // Recibimos el mensaje del cliente y lo reenviamos
    serverSocket.once(
      ChatAPIMessageType.SEND_PLAYER_MESSAGE,
      (payload: SendPlayerMessagePayload) => {
        // Enviamos el mensaje al jugador de vuelta (de acuerdo a la especificacion)
        const messagePayload = {
          player_name: PLAYER_NAME,
          message: payload.message,
        };
        serverSocket.emit(
          ChatAPIEventType.ON_PLAYER_NEW_MESSAGE,
          messagePayload
        );
      }
    );

    // Send player message to server
    sendPlayerMessage(MESSAGE);

    const EXPECTED_MESSAGE: ChatMessage = {
      type: ChatMessageType.PLAYER_MESSAGE,
      player_name: PLAYER_IN_GAME_DATA_MOCK_1.name,
      message: MESSAGE,
    };
    clientSocket.once(ChatAPIEventType.ON_PLAYER_NEW_MESSAGE, () => {
      expect(store.getState().game.chat.messages).toEqual([EXPECTED_MESSAGE]);
      done();
    });
  });
});
