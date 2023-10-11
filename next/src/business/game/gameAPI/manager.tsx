import { gameSocket } from "@/src/business/game/gameAPI/index";
import type { NextRouter } from "next/router";
import { store } from "@/store/store";
import { setGameConnectionToken, setUserName } from "@/store/userSlice";

export enum MessageType {
  GET_GAME_STATE = "get_game_state",
  ROOM_START_GAME = "room_start_game",
  ROOM_QUIT_GAME = "room_quit_game",
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

export const leaveLobby = (router: NextRouter) => {
  store.dispatch(setUserName(""));
  store.dispatch(setGameConnectionToken(undefined));
  gameSocket.emit(MessageType.ROOM_QUIT_GAME);
  // Damos un margen de tiempo para desconectarnos del socket.
  setTimeout(() => {
    gameSocket.disconnect();
  }, 400);
  router.replace("/");
};
