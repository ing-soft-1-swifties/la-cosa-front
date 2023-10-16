import { gameSocket } from "@/src/business/game/gameAPI/index";
import type { NextRouter } from "next/router";
import { store } from "@/store/store";
import { setGameConnectionToken, setUserName } from "@/store/userSlice";
import Router from "next/router";
import { StandaloneToast } from "@/src/pages/_app";
import {
  buildErrorToastOptions,
  buildWarningToastOptions,
} from "@/src/utils/toasts";

export enum MessageType {
  GET_GAME_STATE = "get_game_state",
  ROOM_START_GAME = "room_start_game",
  ROOM_QUIT_GAME = "room_quit_game",

  GAME_PLAY_CARD = "game_play_card",
  GAME_PLAY_DEFENSE_CARD = "game_play_defense_card",
  GAME_DISCARD_CARD = "game_discard_card",
  GAME_SELECT_EXCHANGE_CARD = "game_select_exchange_card",
}

export function isGameHost() {
  return store.getState().game.config.host == store.getState().user.name;
}

export type CardOptions = {
  target?: number;
};
export type PlayCardPayload = {
  card: number;
  card_options: CardOptions;
};
export async function sendPlayerPlayCard(card: number, card_options: CardOptions) {
  const playCardPayload: PlayCardPayload = {
    card: card,
    card_options: card_options,
  };
  await gameSocket.emitWithAck(MessageType.GAME_PLAY_CARD, playCardPayload);
}

type PlayDefenseCardPayload = PlayCardPayload;
export async function sendPlayerPlayDefenseCard(
  target_player: number,
  card: number
) {
  const playDefenseCardPayload: PlayDefenseCardPayload = {
    card: card,
    card_options: {
      target: target_player,
    },
  };
  await gameSocket.emitWithAck(
    MessageType.GAME_PLAY_DEFENSE_CARD,
    playDefenseCardPayload
  );
}

export type DiscardCardPayload = {
  card: number;
};
export async function sendPlayerDiscardCard(card: number) {
  const discardCardPayload: DiscardCardPayload = {
    card: card,
  };
  await gameSocket.emitWithAck(
    MessageType.GAME_DISCARD_CARD,
    discardCardPayload
  );
}

export type SelectExchangeCardPayload = {
  card: number;
};
export async function sendPlayerSelectExchangeCard(card: number) {
  const selectExchangeCardPayload: SelectExchangeCardPayload = {
    card: card,
  };
  await gameSocket.emitWithAck(
    MessageType.GAME_SELECT_EXCHANGE_CARD,
    selectExchangeCardPayload
  );
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

export const startGame = () => {
  return gameSocket.emitWithAck(MessageType.ROOM_START_GAME);
};

export const leaveLobby = async () => {
  Router.push("/");
  await gameSocket.emitWithAck(MessageType.ROOM_QUIT_GAME);
  // Damos un margen de tiempo para desconectarnos del socket.
  gameSocket.disconnect();
  store.dispatch(setUserName(undefined));
  store.dispatch(setGameConnectionToken(undefined));
};
