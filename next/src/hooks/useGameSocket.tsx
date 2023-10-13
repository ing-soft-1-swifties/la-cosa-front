import { gameSocket } from "@/src/business/game/gameAPI";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type GameSocketState = {
  isConnected: boolean;
  gameSocket: Socket;
};

const useGameSocket: () => GameSocketState = () => {

  const [connected, setConnected] = useState(true);

  function handleConnChange() {
    setConnected(gameSocket.connected)
  }

  // Sincronizar estado de socket con estado local
  useEffect(() => {
    gameSocket.on("connect", handleConnChange);
    gameSocket.on("disconnect", handleConnChange);

    return () => {
      gameSocket.removeListener("connect", handleConnChange);
      gameSocket.removeListener("disconnect", handleConnChange);
    }
  })



  return {
    isConnected: connected,
    gameSocket: gameSocket,
  };
};

export default useGameSocket;
