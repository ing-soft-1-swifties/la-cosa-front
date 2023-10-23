import { gameSocket } from "@/src/business/game/gameAPI/index";
import type { NextRouter } from "next/router";
import { store } from "@/store/store";
import { setGameConnectionToken, setUserName } from "@/store/userSlice";
import Router from "next/router";
import { StandaloneToast } from "@/src/pages/_app";
import {
  buildErrorToastOptions,
  buildSucessToastOptions,
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

export function isGameHost() { // Si el host de la partida es el usuario, retorna true
  return store.getState().game.config.host == store.getState().user.name;  
}

export type CardOptions = {  
  target?: number; 
};
export type PlayCardPayload = { // 
  card: number;
  card_options: CardOptions;
};
export async function sendPlayerPlayCard( // Envia al servidor el evento de que el jugador jugo una carta
  card: number,
  card_options: CardOptions
) {
  const playCardPayload: PlayCardPayload = {  // Crea un payload con los datos de la carta
    card: card,
    card_options: card_options,
  };
  await gameSocket.emitWithAck(MessageType.GAME_PLAY_CARD, playCardPayload); // Emite el evento al servidor
}

type PlayDefenseCardPayload = PlayCardPayload; // Envia al servidor el evento de que el jugador jugo una carta de defensa 
export async function sendPlayerPlayDefenseCard(  
  target_player: number,
  card: number
) {
  const playDefenseCardPayload: PlayDefenseCardPayload = {  // Crea un payload con los datos de la carta
    card: card,
    card_options: {
      target: target_player,
    },
  };
  await gameSocket.emitWithAck(  // Emite el evento al servidor con el payload creado anteriormente
    MessageType.GAME_PLAY_DEFENSE_CARD, 
    playDefenseCardPayload 
  );
}

export type DiscardCardPayload = {  // Envia al servidor el evento de que el jugador descarto una carta
  card: number;
};
export async function sendPlayerDiscardCard(card: number) { //  
  const discardCardPayload: DiscardCardPayload = {
    card: card,
  };
  await gameSocket.emitWithAck( 
    MessageType.GAME_DISCARD_CARD,
    discardCardPayload
  );
}

export type SelectExchangeCardPayload = { // Envia al servidor el evento de que el jugador selecciono una carta para intercambiar
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

export function joinPlayerToGame( // Envia al servidor el evento de que el jugador se unio a la partida
  playerName: string,
  connectionToken: string,
  router: NextRouter
) {
  store.dispatch(setUserName(playerName));  // Guarda el nombre del jugador en el store
  store.dispatch(setGameConnectionToken(connectionToken)); // Guarda el token de conexion en el store
  router.push("/lobby"); // Redirige al jugador al lobby
}

export function finishGame() {
  store.dispatch(setUserName(undefined));
  store.dispatch(setGameConnectionToken(undefined));
  Router.push("/"); // Redirige al jugador al inicio
}

export enum CancelGameReason { // Motivos por los que se cancela la partida
  CANCELED_BY_HOST = "canceled_by_host",
  DISCONNECTION = "disconnection",
}

export function cancelGame(reason: CancelGameReason) { 
  Router.push("/"); // Redirige al jugador al inicio
  if (reason == CancelGameReason.CANCELED_BY_HOST) { // Si la partida fue cancelada por el host, muestra un mensaje de aviso
    StandaloneToast(
      buildWarningToastOptions({
        title: "Aviso!",
        description: "La partida a sido cancelada por el Host",
      })
    );
  }
  // Si la partida fue cancelada por una desconexion, muestra un mensaje de error
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

// Inicia la partida
export function beginGame() { 
  StandaloneToast(
    buildSucessToastOptions({
      title: "La partida comenzo!",
      description: "",
    })
  );
  Router.push("/game"); // Redirige al jugador a la partida
}

export const sendStartGame = () => {
  return gameSocket.emitWithAck(MessageType.ROOM_START_GAME); // Emite al servidor el evento de que la partida comenzo
};

export const leaveLobby = async () => { // Abandona el lobby
  Router.push("/"); // Redirige al jugador al inicio
  await gameSocket.emitWithAck(MessageType.ROOM_QUIT_GAME);
  // Damos un margen de tiempo para desconectarnos del socket.
  gameSocket.disconnect();
  store.dispatch(setUserName(undefined));
  store.dispatch(setGameConnectionToken(undefined));
};
