import { Socket } from "socket.io-client";
import { GameState, setGameState } from "@/store/gameSlice";
import { store } from "@/store/store";
import { beginGame, cancelGame, CancelGameReason } from "./manager";
import { StandaloneToast } from "@/src/pages/_app";
import { buildErrorToastOptions } from "@/src/utils/toasts";

export enum EventType {
  ON_ROOM_NEW_PLAYER = "on_room_new_player",
  ON_ROOM_LEFT_PLAYER = "on_room_left_player",
  ON_ROOM_START_GAME = "on_room_start_game",
  ON_ROOM_CANCELLED_GAME = "on_room_cancelled_game",

  // Eventos de la partida:
  ON_GAME_PLAYER_TURN = "on_game_player_turn",
  ON_GAME_PLAYER_STEAL_CARD = "on_game_player_steal_card",
  ON_GAME_PLAYER_PLAY_CARD = "on_game_player_play_card",
  ON_GAME_PLAYER_PLAY_DEFENSE_CARD = "on_game_player_play_defense_card",
  ON_GAME_PLAYER_DISCARD_CARD = "on_game_player_discard_card",
  ON_GAME_BEGIN_EXCHANGE = "on_game_begin_exchange",
  ON_GAME_FINISH_EXCHANGE = "on_game_finish_exchange",
  ON_GAME_PLAYER_DEATH = "on_game_player_death",
  ON_GAME_END = "on_game_end",

  ON_GAME_INVALID_ACTION = "on_game_invalid_action",
}

export const setupGameSocketListeners = (gameSocket: Socket) => { // Crea los listeners del socket
  gameSocket.onAny((ev, ...args) => { // Crea un listener para cualquier evento
    console.log(`${ev}`) // Imprime el evento
    console.log(args) // Imprime los argumentos
  })
  //se crean los listeners para cada evento
  gameSocket.on(EventType.ON_ROOM_NEW_PLAYER, updateGameState); 
  gameSocket.on(EventType.ON_ROOM_LEFT_PLAYER, updateGameState);
  gameSocket.on(EventType.ON_ROOM_START_GAME, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_TURN, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_STEAL_CARD, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_CARD, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_PLAY_DEFENSE_CARD, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_DISCARD_CARD, updateGameState);
  gameSocket.on(EventType.ON_GAME_BEGIN_EXCHANGE, updateGameState);
  gameSocket.on(EventType.ON_GAME_FINISH_EXCHANGE, updateGameState);
  gameSocket.on(EventType.ON_GAME_PLAYER_DEATH, updateGameState);
  gameSocket.on(EventType.ON_GAME_END, updateGameState);

  gameSocket.on(EventType.ON_ROOM_CANCELLED_GAME, onRoomCancelledGame);
  gameSocket.on(EventType.ON_ROOM_START_GAME, onRoomStartGame);

  // TODO! Hay que ver si esto lo dejamos o es temporal
  gameSocket.on(EventType.ON_GAME_INVALID_ACTION, onGameInvalidAction);
  // Crea un listener para cuando se desconecta el socket
  gameSocket.on("disconnect", onGameSocketDisconnect); 
};

export type GameStateData = { // Datos de la partida
  gameState: GameState; // Estado de la partida
};

function calculateNewGameState(data: GameStateData) { 
  const newState: any = {
    config: data.gameState.config, // Configuracion de la partida
    // Crea un nuevo arreglo de jugadores con los datos de los jugadores de la partida
    players: data.gameState.players.map((player) => ({ 
      id: player.id,
      name: player.name,
      position: player.position,
      status: player.status
    })),
    // Estado de la partida
    status: data.gameState.status, 
  };
  // Si el jugador no es null, crea un nuevo arreglo de cartas con las cartas del jugador
  if (data.gameState.playerData != null) {  
    newState.playerData = { 
      cards: data.gameState.playerData.cards,
      playerID: data.gameState.playerData.playerID, 
      role: data.gameState.playerData.role, 
    };
  }
  return newState;
}

const updateGameState = (data: GameStateData) => { 
   //guarda el nuevo estado de la partida
  store.dispatch(setGameState(calculateNewGameState(data))); 
};

function onRoomStartGame() { 
  // Comienza la partida
  beginGame(); 
}

const onRoomCancelledGame = () => { 
  // Cancela la partida por el host
  cancelGame(CancelGameReason.CANCELED_BY_HOST); 
};

type InvalidActionData = { 
  // Datos de la accion invalida
  title: string;
  message: string;
};

//// Si la accion es invalida, muestra un mensaje de error
const onGameInvalidAction = (data: InvalidActionData) => { 
  StandaloneToast(
    buildErrorToastOptions({
      title: data.title,
      description: data.message,
    })
  );
};

enum SocketDisconnectReason { // Motivos por los que se desconecta el socket
  SERVER_IO_DISCONNECT = "io server disconnect",
  CLIENT_IO_DISCONNECT = "io client disconnect",
  SERVER_SHUTTING_DOWN = "server shutting down",
  PING_TIMEOUT = "ping timeout",
  TRANSPORT_CLOSE = "transport close",
  TRANSPORT_ERROR = "transport error",
  PARSE_ERROR = "parse error",
  FORCED_CLOSE = "forced close",
  FORCED_SERVER_CLOSE = "forced server close",
}

const onGameSocketDisconnect = (reason: SocketDisconnectReason) => { // Si el socket se desconecta, cancela la partida
  if (
    reason == SocketDisconnectReason.CLIENT_IO_DISCONNECT || 
    reason == SocketDisconnectReason.SERVER_IO_DISCONNECT
  )
    return;
  else {
    cancelGame(CancelGameReason.DISCONNECTION); 
  }
};
