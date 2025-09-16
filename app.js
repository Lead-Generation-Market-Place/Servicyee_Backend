import dotenv from "dotenv";
import express, { json } from "express";
import {run} from "./config/db.js";
import { get, setEx } from "./services/redis.js";
import getPro from './routes/userRoutes.js'
dotenv.config()

const app = express();

// Middleware
app.use(json());

// Connect DB
run();

// Routes
app.use("/users",getPro);

// Test Redis cache route
app.get("/ping", async (req, res) => {
  const cached = await get("ping");
  if (cached) return res.json({ source: "cache", value: cached });

  const value = "pong " + new Date().toISOString();
  await setEx("ping", 30, value);
  res.json({ source: "api", value });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
