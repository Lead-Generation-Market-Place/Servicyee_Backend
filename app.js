import dotenv from "dotenv";
import express, { json } from "express";

import cors from "cors";
import {run} from "./config/db.js";

import professionalRoutes from './routes/ProfessionalRoutes.js';
import locationRoutes from './routes/LocationRoutes.js';
dotenv.config()
// Connect DB
run();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/professionals', professionalRoutes);
app.use('/api/location', locationRoutes)



app.use('/api/professionals', professionalRoutes);
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
