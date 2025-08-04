import { Server, Socket } from "socket.io";
import { RoomData, MessageData, User } from "./types";

const rooms = new Map<string, Set<string>>();
const users = new Map<string, User>();
const defaultRooms = ["General", "Random", "Tech Discussion"];

// Initialize default rooms
defaultRooms.forEach((room) => rooms.set(room, new Set()));

export function handleSocketConnection(io: Server, socket: Socket) {
  console.log("User connected:", socket.id);
  socket.emit("roomsList", Array.from(rooms.keys()));

  socket.on("joinRoom", ({ username, room }: RoomData) => {
    const user = users.get(socket.id);

    if (user && user.currentRoom) {
      socket.leave(user.currentRoom);
      const prevRoom = rooms.get(user.currentRoom);
      if (prevRoom) {
        prevRoom.delete(socket.id);
        socket.to(user.currentRoom).emit("userLeft", {
          username: user.username,
          room: user.currentRoom,
        });
        updateOnlineUsers(io, user.currentRoom);
      }
    }

    socket.join(room);
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
      io.emit("roomsList", Array.from(rooms.keys()));
    }

    rooms.get(room)?.add(socket.id);
    users.set(socket.id, { username, currentRoom: room, socketId: socket.id });

    socket.to(room).emit("userJoined", { username, room });
    updateOnlineUsers(io, room);
  });

  socket.on("leaveRoom", ({ username, room }: RoomData) => {
    socket.leave(room);
    const roomUsers = rooms.get(room);
    if (roomUsers) {
      roomUsers.delete(socket.id);
      socket.to(room).emit("userLeft", { username, room });
      updateOnlineUsers(io, room);
    }
  });

  socket.on("createRoom", ({ roomName, username }) => {
    if (!rooms.has(roomName)) {
      rooms.set(roomName, new Set());
      io.emit("roomsList", Array.from(rooms.keys()));
    }
  });

  socket.on("message", (messageData: MessageData) => {
    const user = users.get(socket.id);
    if (user && user.currentRoom) {
      socket.to(user.currentRoom).emit("message", {
        ...messageData,
        room: user.currentRoom,
      });
    }
  });

  socket.on("getRooms", () => {
    socket.emit("roomsList", Array.from(rooms.keys()));
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      const { username, currentRoom } = user;
      const roomUsers = rooms.get(currentRoom);
      if (roomUsers) {
        roomUsers.delete(socket.id);
        socket.to(currentRoom).emit("userLeft", { username, room: currentRoom });
        updateOnlineUsers(io, currentRoom);
      }
      users.delete(socket.id);
    }
  });
}

function updateOnlineUsers(io: Server, room: string): void {
  const roomUsers = rooms.get(room);
  if (roomUsers) {
    const onlineUsers: string[] = [];
    roomUsers.forEach((socketId) => {
      const user = users.get(socketId);
      if (user) onlineUsers.push(user.username);
    });
    io.to(room).emit("onlineUsers", onlineUsers);
  }
}

// Export for health-check usage
export function getSocketInfo() {
  return {
    totalConnections: users.size,
    activeRooms: Array.from(rooms.keys()),
    roomCounts: Object.fromEntries(
      Array.from(rooms.entries()).map(([room, users]) => [room, users.size])
    ),
    roomDetails: Object.fromEntries(
      Array.from(rooms.entries()).map(([room, socketIds]) => {
        const roomUsers = Array.from(socketIds).map((socketId) => {
          const user = users.get(socketId);
          return user ? user.username : "Unknown";
        });
        return [room, { count: socketIds.size, users: roomUsers }];
      })
    ),
  };
}
