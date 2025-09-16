import dotenv from "dotenv";
import express, { json } from "express";
import {run} from "./config/db.js";
import cors from 'cors'
import router from './routes/ProfessionalRoutes.js'
import bodyParser from "body-parser";
dotenv.config()
run();
const app = express();
app.use(json());
app.use(cors());
app.use(bodyParser.json());
app.use("/professionals", router);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
