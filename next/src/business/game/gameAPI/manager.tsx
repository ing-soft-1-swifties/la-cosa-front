import { gameSocket } from "@/src/business/game/gameAPI/index";
import type { NextRouter } from "next/router";
import { store } from "@/store/store";
import { setGameConnectionToken, setUserName } from "@/store/userSlice";

export enum MessageType {
  ROOM_START_GAME = "start_game",
  ROOM_EXIT = "room/exit",
}

export function joinPlayerToGame(
  playerName: string,
  connectionToken: string,
  router: NextRouter
) {
  store.dispatch(setUserName(playerName));
  store.dispatch(setGameConnectionToken(connectionToken));
  router.push("/lobby");
}

export const startGame = () => {
  return gameSocket.emitWithAck(MessageType.ROOM_START_GAME);
};

export const leaveLobby = () => {
  gameSocket.emit(MessageType.ROOM_EXIT);
  gameSocket.disconnect();
};
