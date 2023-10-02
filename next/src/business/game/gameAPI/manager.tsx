import { gameSocket } from "@/src/business/game/gameAPI/index";

export enum MessageType {
  ROOM_START = "room/start",
  ROOM_EXIT = "room/exit",
}

export const startGame = () => {
  return gameSocket.emitWithAck(MessageType.ROOM_START);
};

export const leaveLobby = () => {
  gameSocket.emit(MessageType.ROOM_EXIT);
  gameSocket.disconnect();
};
