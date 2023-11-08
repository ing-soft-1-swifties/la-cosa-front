import { Socket, io } from "socket.io-client";
import { store } from "@/store/store";
import { setupGameSocketListeners } from "./listener";
import { SERVER_API_URL } from "../../../config";

type GameSocketAuth = {
  token: string;
};

export let gameSocket: Socket;

export function buildSocket(connection: string) {
  const socket = io(connection, {
    autoConnect: false,
    auth: {
      token: "",
    },
    transports: ["websocket"],
  });
  setupGameSocketListeners(socket);
  return socket;
}
gameSocket = buildSocket(`${SERVER_API_URL}`);

export function initGameSocket(connSocket: Socket | undefined) {
  const socket = connSocket ?? gameSocket;
  const connectionToken = store.getState().user.gameConnToken;
  if (connectionToken == null) return;
  if (!socket.disconnected) socket.disconnect();
  socket.auth = {
    token: connectionToken,
  };
  socket.connect();
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
