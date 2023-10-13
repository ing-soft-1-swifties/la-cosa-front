import { Socket } from "socket.io-client";
import { GameState, setGameState } from "@/store/gameSlice";
import { store } from "@/store/store";
import { cancelGame, CancelGameReason } from "./manager";
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

export const setupGameSocketListeners = (gameSocket: Socket) => {
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

  // TODO! Hay que ver si esto lo dejamos o es temporal
  gameSocket.on(EventType.ON_GAME_INVALID_ACTION, onGameInvalidAction);

  gameSocket.on("disconnect", onGameSocketDisconnect);
};

export type GameStateData = {
  gameState: GameState;
};

function calculateNewGameState(data: GameStateData) {
  return {
    config: data.gameState.config,
    players: data.gameState.players.map((player) => ({
      id: player.id,
      name: player.name,
      position: player.position,
    })),
    status: data.gameState.status,
    playerData: {
      cards: data.gameState.playerData.cards,
      playerID: data.gameState.playerData.playerID,
      cardSelected: undefined,
    },
  };
}

const updateGameState = (data: GameStateData) => {
  store.dispatch(setGameState(calculateNewGameState(data)));
};

const onRoomCancelledGame = () => {
  cancelGame(CancelGameReason.CANCELED_BY_HOST);
};

type InvalidActionData = {
  title: string;
  message: string;
};
const onGameInvalidAction = (data: InvalidActionData) => {
  StandaloneToast(
    buildErrorToastOptions({
      title: data.title,
      description: data.message,
    })
  );
};

enum SocketDisconnectReason {
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

const onGameSocketDisconnect = (reason: SocketDisconnectReason) => {
  if (
    reason == SocketDisconnectReason.CLIENT_IO_DISCONNECT ||
    reason == SocketDisconnectReason.SERVER_IO_DISCONNECT
  )
    return;
  else {
    cancelGame(CancelGameReason.DISCONNECTION);
  }
};
