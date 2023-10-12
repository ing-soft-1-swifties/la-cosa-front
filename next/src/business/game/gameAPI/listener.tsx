import { Socket } from "socket.io-client";
import { GameState, setGameState } from "@/store/gameSlice";
import { store } from "@/store/store";
import { cancelGame, CancelGameReason, startGame } from "./manager";

export enum EventType {
  ON_ROOM_NEW_PLAYER = "on_room_new_player",
  ON_ROOM_LEFT_PLAYER = "on_room_left_player",
  ON_ROOM_START_GAME = "on_room_start_game",
  ON_ROOM_CANCELLED_GAME = "on_room_cancelled_game",
}

export const setupGameSocketListeners = (gameSocket: Socket) => {
  gameSocket.on(EventType.ON_ROOM_NEW_PLAYER, onRoomNewPlayer);
  gameSocket.on(EventType.ON_ROOM_LEFT_PLAYER, onRoomLeftPlayer);
  gameSocket.on(EventType.ON_ROOM_START_GAME, onRoomStartGame);
  gameSocket.on(EventType.ON_ROOM_CANCELLED_GAME, onRoomCancelledGame);
  gameSocket.on("disconnect", onGameSocketDisconnect as any);
};

export type GameStateData = {
  gameState: GameState;
};

function calculateNewGameState(data: GameStateData) {
  return {
    config: data.gameState.config,
    players: data.gameState.players.map((player) => ({
      name: player.name,
    })),
    status: data.gameState.status,
  };
}

type NewGameStateData = GameStateData & {};
const onNewGameState = (data: NewGameStateData) => {
  store.dispatch(setGameState(calculateNewGameState(data)));
};

type RoomNewPlayerData = GameStateData & {};
const onRoomNewPlayer = (data: RoomNewPlayerData) => {
  store.dispatch(setGameState(calculateNewGameState(data)));
};

type RoomLeftPlayerData = GameStateData & {};
const onRoomLeftPlayer = (data: RoomLeftPlayerData) => {
  store.dispatch(setGameState(calculateNewGameState(data)));
};

type RoomStartGameData = GameStateData & {};
const onRoomStartGame = (data: RoomStartGameData) => {
  store.dispatch(setGameState(calculateNewGameState(data)));
startGame();
};

const onRoomCancelledGame = () => {
  cancelGame(CancelGameReason.CANCELED_BY_HOST);
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
