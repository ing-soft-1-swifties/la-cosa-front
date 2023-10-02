import { gameSocket } from "@/src/business/game/gameAPI";
import { Socket } from "socket.io-client";

type GameSocketState = {
  isConnected: boolean;
  gameSocket: Socket;
};

const useGameSocket: () => GameSocketState = () => {
  return {
    isConnected: !gameSocket.disconnected,
    gameSocket: gameSocket,
  };
};

export default useGameSocket;
