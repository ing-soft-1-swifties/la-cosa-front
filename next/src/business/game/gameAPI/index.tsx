import { io } from "socket.io-client";
import { store } from "store/store";
import { setupGameSocketListeners } from "./listener";

export let gameSocket = io({
  autoConnect: false,
  auth: {
    token: "",
  },
});

export function initGameSocket() {
  const connectionToken = store.getState().user.gameConnToken;
  if (connectionToken == null) return;
  if (!gameSocket.disconnected) gameSocket.disconnect();
  gameSocket.auth = {
    token: connectionToken,
  };
  gameSocket.connect();
  setupGameSocketListeners(gameSocket);
}




