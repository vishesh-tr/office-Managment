import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import userRoute from "./src/routes/user.routes";
import projectRoute from "./src/routes/project.routes";
import teamRoute from "./src/routes/team.routes"; 
import cookieParser from "cookie-parser";
import passwordRoutes from "./src/routes/password.routes";

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 4002;
const DB_URI: string = process.env.MONGODB_URI || "";

const frontendUrl = process.env.FRONTEND_URL?.trim();
console.log("CORS Origin set to:", frontendUrl);

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
  res.send("API is running 🚀");
});

// Connect to the database and start the server
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();
