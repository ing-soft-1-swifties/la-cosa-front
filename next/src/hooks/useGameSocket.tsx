import { gameSocket } from "@/src/business/game/gameAPI";
import { useState } from "react";
import { Socket } from "socket.io-client";

type GameSocketState = {
  isConnected: boolean;
  gameSocket: Socket;
};

const useGameSocket: () => GameSocketState = () => {
  const [ignore, setIgnore] = useState(true);

  // TODO! Move Websocket to useEffect
  setTimeout(() => {
    setIgnore(!ignore)
  }, 1000);

  return {
    isConnected: !gameSocket.disconnected,
    gameSocket: gameSocket,
  };
};

export default useGameSocket;
