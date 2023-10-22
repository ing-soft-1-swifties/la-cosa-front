import { Socket, io } from "socket.io-client";
import { store } from "@/store/store";
import { setupGameSocketListeners } from "./listener";

type GameSocketAuth = { 
  token: string;
};

export let gameSocket: Socket;

export function buildSocket(connection: string) {   // Crea un socket con la conexion especificada
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
gameSocket = buildSocket("http://localhost:8000"); //le pasamos la url del servidor

export function initGameSocket(connSocket: Socket | undefined) {  // Inicializa el socket de la partida
  const socket = connSocket ?? gameSocket;  // Si el socket de conexion es undefined, usa el socket de la partida
  const connectionToken = store.getState().user.gameConnToken;  
  if (connectionToken == null) return;
  if (!socket.disconnected) socket.disconnect(); 
  socket.auth = {
    token: connectionToken, 
  };
  socket.connect();
}

export const isConnected = () => { // Si el socket esta conectado, retorna true
  if (!gameSocket.active) return false;
  if (!gameSocket.disconnected) return false;
  return true;
};

export const isSocketUpToDate = () => { // Si el token de conexion del socket es igual al token de conexion del usuario, retorna true
  const auth: GameSocketAuth = gameSocket.auth as any;
  return auth.token == store.getState().user.gameConnToken;
};
