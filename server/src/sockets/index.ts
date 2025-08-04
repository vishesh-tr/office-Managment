import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { handleSocketConnection } from "./roomHandlers";

export const initSocket = (httpServer: HTTPServer, origin: string): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    handleSocketConnection(io, socket);
  });

  return io;
};
