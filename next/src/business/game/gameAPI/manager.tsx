import { gameSocket } from "@/src/business/game/gameAPI/index";

export enum MessageType {
  ROOM_START_GAME = "start_game",
  ROOM_EXIT = "room/exit",
}

export const startGame = () => {
  return gameSocket.emitWithAck(MessageType.ROOM_START_GAME);
};

export const leaveLobby = () => {
  gameSocket.emit(MessageType.ROOM_EXIT);
  gameSocket.disconnect();
};
