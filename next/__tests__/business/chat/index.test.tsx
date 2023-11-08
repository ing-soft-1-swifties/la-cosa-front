import "@testing-library/jest-dom";
import { store } from "@/store/store";
import { setGameState } from "@/store/gameSlice";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { AddressInfo } from "node:net";
import { setGameConnectionToken } from "@/store/userSlice";
import { Socket } from "socket.io-client";
import { io as ioc } from "socket.io-client";
import { setupGameSocketListeners } from "@/src/business/game/gameAPI/listener";
import {
  PLAYER_IN_GAME_STATE_MOCK_1,
  TEST_CONNECTION_TOKEN,
} from "../../constants";

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
    store.dispatch(setGameState(PLAYER_IN_GAME_STATE_MOCK_1.game!));
  });

  afterAll(() => {
    // Close connections
    ioserver.close();
    clientSocket.disconnect();
  });

  it("WIP", () => {
    // WIP
  });
});
