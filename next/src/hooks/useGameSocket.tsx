// import { gameSocket } from "@/src/business/game/gameAPI";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type GameSocketState = {
  isConnected: boolean;
  gameSocket: Socket;
};

const useGameSocket: (socket: Socket) => GameSocketState = (socket) => {

  const [connected, setConnected] = useState(true);

  function handleConnChange() {
    setConnected(socket.connected)
  }

  // Sincronizar estado de socket con estado local
  useEffect(() => {
    socket.on("connect", handleConnChange);
    socket.on("disconnect", handleConnChange);

    return () => {
      socket.removeListener("connect", handleConnChange);
      socket.removeListener("disconnect", handleConnChange);
    }
  })



  return {
    isConnected: connected,
    gameSocket: socket,
  };
};

export default useGameSocket;
