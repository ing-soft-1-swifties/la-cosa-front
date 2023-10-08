import { Socket, io } from "socket.io-client";
import { store } from "@/store/store";
import { setupGameSocketListeners } from "./listener";

type GameSocketAuth = {
  token: string;
};

export let gameSocket: Socket;

export function buildSocket(connection: string) {
  gameSocket = io(connection, {
    autoConnect: false,
    auth: {
      token: "",
    },
    transports: ["websocket"],
  });
  setupGameSocketListeners(gameSocket);
}
buildSocket("http://localhost:8000");

export function initGameSocket() {
  const connectionToken = store.getState().user.gameConnToken;
  if (connectionToken == null) return;
  if (!gameSocket.disconnected) gameSocket.disconnect();
  gameSocket.auth = {
    token: connectionToken,
  };
  gameSocket.connect();
}

export const isConnected = () => {
  if (!gameSocket.active) return false;
  if (!gameSocket.disconnected) return false;
  return true;
};

export const isSocketUpToDate = () => {
  const auth: GameSocketAuth = gameSocket.auth as any;
  return auth.token == store.getState().user.gameConnToken;
};
