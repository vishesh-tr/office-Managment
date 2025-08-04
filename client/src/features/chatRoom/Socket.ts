import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  message: (data: any) => void;
  roomsList: (rooms: string[]) => void;
  userJoined: (data: { username: string; room: string }) => void;
  userLeft: (data: { username: string; room: string }) => void;
  onlineUsers: (users: string[]) => void;
  connect: () => void;
  disconnect: () => void;
  reconnect: (attemptNumber: number) => void;
  reconnect_error: (error: Error) => void;
}

interface ClientToServerEvents {
  message: (data: any) => void;
  getRooms: () => void;
  joinRoom: (data: { username: string; room: string }) => void;
  leaveRoom: (data: { username: string; room: string }) => void;
  createRoom: (data: { roomName: string; username: string }) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_REACT_APP_SERVER_URL || "http://localhost:4009",
  {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 20000,
    forceNew: false,
  }
);

socket.on("connect", () => {
  console.log("✅ Connected to server");
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

socket.on("reconnect", (attemptNumber: number) => {
  console.log(`🔁 Reconnected after ${attemptNumber} attempts`);
});

socket.on("reconnect_error", (error: Error) => {
  console.error("⚠️ Reconnection error:", error.message);
});

export default socket;
