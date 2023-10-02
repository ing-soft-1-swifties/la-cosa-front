import { Socket } from "socket.io-client";

export enum EventType {
  ROOM_KICKED = "room/kicked",
}

export const setupGameSocketListeners = (gameSocket: Socket) => {
  gameSocket.on(EventType.ROOM_KICKED, onRoomKicked);
};

type RoomKickedData = {
  reason: string;
};
const onRoomKicked = (data: RoomKickedData) => {
  console.log(`Kicked because: ${data.reason}`);
};
