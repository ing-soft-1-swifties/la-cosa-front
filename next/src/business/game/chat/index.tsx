import { Socket } from "socket.io-client";
import { gameSocket } from "../gameAPI";
import { store } from "@/store/store";
import {
  ChatMessage,
  ChatMessageType,
  addChatMessage,
} from "@/store/gameSlice";

export enum ChatAPIEventType {
  ON_PLAYER_NEW_MESSAGE = "on_player_new_message",
  // Talvez se use:
  //   ON_GAME_SYSTEM_NEW_MESSAGE = "on_game_system_new_message",
}

export enum ChatAPIMessageType {
  SEND_PLAYER_MESSAGE = "send_player_message",
}

export type SendPlayerMessagePayload = {
  message: string;
};
export function sendPlayerMessage(message: string) {
  const payload: SendPlayerMessagePayload = {
    message: message,
  };
  gameSocket.emit(ChatAPIMessageType.SEND_PLAYER_MESSAGE, payload);
}

export function setupChatListeners(gameSocket: Socket) {
  gameSocket.on(ChatAPIEventType.ON_PLAYER_NEW_MESSAGE, onPlayerNewMessage);

  //   gameSocket.on(ChatAPIEventType.ON_GAME_SYSTEM_NEW_MESSAGE, onGameSystemNewMessage);
}

export type OnPlayerNewMessagePayload = {
  player_id: number;
  message: string;
};
function onPlayerNewMessage(payload: OnPlayerNewMessagePayload) {
  const chatMessage: ChatMessage = {
    type: ChatMessageType.PLAYER_MESSAGE,
    player_id: payload.player_id,
    message: payload.message,
  };
  store.dispatch(addChatMessage(chatMessage));
}

// function onGameSystemNewMessage() {
//
// }
