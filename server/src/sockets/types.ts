export interface User {
  username: string;
  currentRoom: string;
  socketId: string;
}

export interface MessageData {
  username: string;
  message: string;
  room: string;
  timestamp: string;
  type: "user" | "system";
}

export interface RoomData {
  username: string;
  room: string;
}
