import { gameSocket } from "@/src/business/game/gameAPI/index";
import type { NextRouter } from "next/router";
import { store } from "@/store/store";
import { setGameConnectionToken, setUserName } from "@/store/userSlice";
import Router from "next/router";
import { StandaloneToast } from "pages/_app";
import {
  buildErrorToastOptions,
  buildSucessToastOptions,
  buildWarningToastOptions,
} from "utils/toasts";

export enum MessageType {
  GET_GAME_STATE = "get_game_state",
  ROOM_START_GAME = "room_start_game",
  ROOM_QUIT_GAME = "room_quit_game",
}

export function isGameHost() {
  console.log(store.getState().game.config.host);
  console.log(store.getState().user.name);
  return store.getState().game.config.host == store.getState().user.name;
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

export enum CancelGameReason {
  CANCELED_BY_HOST = "canceled_by_host",
  DISCONNECTION = "disconnection",
}

export function cancelGame(reason: CancelGameReason) {
  Router.push("/");
  if (reason == CancelGameReason.CANCELED_BY_HOST) {
    StandaloneToast(
      buildWarningToastOptions({
        title: "Aviso!",
        description: "La partida a sido cancelada por el Host",
      })
    );
  }
  if (reason == CancelGameReason.DISCONNECTION) {
    StandaloneToast(
      buildErrorToastOptions({
        title: "Error de conexion",
        description: "Ocurrio un error de conexion con el servidor",
      })
    );
  }
  store.dispatch(setUserName(undefined));
  store.dispatch(setGameConnectionToken(undefined));
}

export const requestStartGame = () => {
  return gameSocket.emitWithAck(MessageType.ROOM_START_GAME);
};

export function startGame() {
  StandaloneToast(
    buildSucessToastOptions({
      title: "La partida comenzo!",
      description: "",
    })
  );
  Router.push("/game");
}

export const leaveLobby = () => {
  Router.push("/");
  gameSocket.emit(MessageType.ROOM_QUIT_GAME);
  // Damos un margen de tiempo para desconectarnos del socket.
  gameSocket.disconnect();
  store.dispatch(setUserName(undefined));
  store.dispatch(setGameConnectionToken(undefined));
};
