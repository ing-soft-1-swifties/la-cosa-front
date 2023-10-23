import { gameSocket } from "@/src/business/game/gameAPI";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type GameSocketState = { // Estado del socket del juego
  isConnected: boolean;
  gameSocket: Socket;
};

const useGameSocket: () => GameSocketState = () => { // Hook del socket del juego
  // Obtiene el estado de conexion del socket
  const [connected, setConnected] = useState(true); 

  function handleConnChange() { // Cambia el estado de conexion del socket
    setConnected(gameSocket.connected)
  }

  // Sincroniza estado de socket con estado local
  useEffect(() => {
    gameSocket.on("connect", handleConnChange);
    gameSocket.on("disconnect", handleConnChange);

    return () => { // Elimina los listeners
      gameSocket.removeListener("connect", handleConnChange);
      gameSocket.removeListener("disconnect", handleConnChange);
    }
  })



  return { // Retorna el estado del socket del juego
    isConnected: connected, 
    gameSocket: gameSocket,
  };
};

export default useGameSocket;
