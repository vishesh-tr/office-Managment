import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import passwordRoutes from "./src/routes/password.routes";
import projectRoute from "./src/routes/project.routes";
import teamRoute from "./src/routes/team.routes";
import userRoute from "./src/routes/user.routes";
import { initSocket } from "./src/sockets/index";
import { getSocketInfo } from "./src/sockets/roomHandlers";

dotenv.config();

const app: Express = express();
const server = createServer(app);
const PORT: number = Number(process.env.PORT) || 4002;
const DB_URI: string = process.env.MONGODB_URI || "";

const frontendUrl = process.env.FRONTEND_URL?.trim();
console.log("CORS Origin set to:", frontendUrl);

// Initialize Socket.IO
const io = initSocket(server, frontendUrl || "http://localhost:3000");

// Middlewares
app.use(express.json());
app.use(cookieParser());

const corsOptions: CorsOptions = {
  origin: frontendUrl,
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Mount routes
app.use("/user", userRoute);
app.use("/project", projectRoute);
app.use("/team", teamRoute);
app.use("/password", passwordRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "API is running 🚀",
    socketInfo: {
      ...getSocketInfo(),
    },
  });
});

// Socket health endpoint
app.get("/socket-status", (_req, res) => {
  res.json({
    status: "OK",
    ...getSocketInfo(),
  });
});

// Connect to the database and start the server
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO is ready for connections`);
      console.log(`📡 CORS configured for: ${frontendUrl}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
