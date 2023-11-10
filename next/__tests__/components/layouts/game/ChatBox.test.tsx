import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { store } from "@/store/store";
import {
  addChatMessage,
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
} from "../../../constants";
import {
  ChatAPIEventType,
  ChatAPIMessageType,
  OnPlayerNewMessagePayload,
  SendPlayerMessagePayload,
  sendPlayerMessage,
} from "@/src/business/game/chat";
import { renderWithProviders } from "@/src/utils/test-utils";
import ChatBox from "@/components/layouts/game/ChatBox";
import { act } from "react-dom/test-utils";

// Mock Game Socket
const mockGameSocket = jest.fn();
jest.mock("../../../../src/business/game/gameAPI/index", () => ({
  get gameSocket() {
    return mockGameSocket();
  },
}));

describe("Component ChatBox", () => {
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

  it("renders", () => {
    renderWithProviders(<ChatBox />, {
      store: store,
    });
  });

  it("closes and open chat", () => {
    renderWithProviders(<ChatBox />, {
      store: store,
    });

    // Vemos que este abierto al iniciar
    screen.getByText("Enviar");
    screen.getByText("Logs");
    screen.getByText("Chat");
    expect(screen.queryByText("Abrir Chat")).not.toBeInTheDocument();
    const closeButton = screen.getByText("Cerrar Chat");
    act(() => {
      closeButton.click();
    });

    // Vemos que este cerrado el chat
    expect(screen.queryByText("Enviar")).not.toBeInTheDocument();
    expect(screen.queryByText("Logs")).not.toBeInTheDocument();
    expect(screen.queryByText("Chat")).not.toBeInTheDocument();
    expect(screen.queryByText("Cerrar Chat")).not.toBeInTheDocument();
    const openButton = screen.getByText("Abrir Chat");
    act(() => {
      openButton.click();
    });

    // Veamos que se abrio el chat
    screen.getByText("Enviar");
    screen.getByText("Logs");
    screen.getByText("Chat");
    expect(screen.queryByText("Abrir Chat")).not.toBeInTheDocument();
    screen.getByText("Cerrar Chat");
  });

  it("shows chat and logs messages", () => {
    renderWithProviders(<ChatBox />, {
      store: store,
    });
    const messages: ChatMessage[] = [
      {
        type: ChatMessageType.GAME_MESSAGE,
        message: "Some log message",
      },
      {
        type: ChatMessageType.PLAYER_MESSAGE,
        player_name: PLAYER_IN_GAME_DATA_MOCK_1.name,
        message: "Some player message",
      },
    ];

    // Añadimos los mensajes
    act(() => {
      for (const message of messages) store.dispatch(addChatMessage(message));
    });

    // Cambiamos al tab del chat
    act(() => {
      screen.getByTestId("chatbox_tab_chat").click();
    });

    // Veamos que el chat muestre los mensajes de jugador
    screen.getByText("Some player message");
    expect(screen.queryByText("Some log message")).not.toBeInTheDocument();

    // Cambiamos al tab de los logs
    act(() => {
      screen.getByTestId("chatbox_tab_logs").click();
    });

    // Veamos que el chat muestre los mensajes de log
    screen.getByText("Some log message");
    expect(screen.queryByText("Some player message")).not.toBeInTheDocument();
  });

  it("sends chat message", (done) => {
    renderWithProviders(<ChatBox />, {
      store: store,
    });
    const MESSAGE = "MMM SI";

    serverSocket.once(
      ChatAPIMessageType.SEND_PLAYER_MESSAGE,
      (payload: SendPlayerMessagePayload) => {
        expect(payload.message).toEqual(MESSAGE);
        done();
      }
    );

    // Insertamos el mensaje y lo enviamos
    act(() => {
      const input: HTMLInputElement = screen.getByTestId("chatbox_input");
      input.value = MESSAGE;
      const sendButton = screen.getByTestId("chatbox_send_message_button");
      sendButton.click();
    });
  });
});
