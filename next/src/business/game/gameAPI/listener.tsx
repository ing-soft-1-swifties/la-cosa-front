import { Socket } from "socket.io-client";
import { GameState, setGameState } from "@/store/gameSlice";
import { store } from "store/store";

export enum EventType {
  NEW_GAME_STATE = "newGameState",
  ROOM_NEW_PLAYER = "room/newPlayer",

  ROOM_KICKED = "room/kicked",
  ROOM_START = "room/start",
}

export const setupGameSocketListeners = (gameSocket: Socket) => {
  gameSocket.on(EventType.NEW_GAME_STATE, onNewGameState);
  gameSocket.on(EventType.ROOM_NEW_PLAYER, onRoomNewPlayer);
  gameSocket.on(EventType.ROOM_KICKED, onRoomKicked);
  gameSocket.on(EventType.ROOM_START, onRoomStart);
};

type GameStateData = {
  gameState: GameState;
};

type NewGameStateData = GameStateData & {};

const onNewGameState = (data: NewGameStateData) => {
  console.log("NEW GAME STATE");
  console.log(data);
  const state = {
    config: data.gameState.config,
    players: data.gameState.players.map((player) => ({
      name: player.name,
    })),
    status: data.gameState.status,
  };
  store.dispatch(setGameState(state));
  console.log("AFTER");
};

type RoomNewPlayerData = GameStateData & {};

const onRoomNewPlayer = (data: NewGameStateData) => {};

type RoomKickedData = {
  reason: string;
};

const onRoomKicked = (data: RoomKickedData) => {
  console.log(`Kicked because: ${data.reason}`);
};

type RoomStartData = GameStateData & {};

const onRoomStart = (data: RoomKickedData) => {};
