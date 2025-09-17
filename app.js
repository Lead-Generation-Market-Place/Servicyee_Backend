import dotenv from "dotenv";
import express, { json } from "express";
import cors from 'cors'
import {run} from "./config/db.js";
import professionalRoutes from './routes/ProfessionalRoutes.js';
dotenv.config()
// Connect DB
run();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* app.use('/api/professionals', professionalRoutes);
// Test Redis cache route
app.get("/ping", async (req, res) => {
  const cached = await get("ping");
  if (cached) return res.json({ source: "cache", value: cached });

  const value = "pong " + new Date().toISOString();
  await setEx("ping", 30, value);
  res.json({ source: "api", value });
}); */

app.use('/api/professionals', professionalRoutes);
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
