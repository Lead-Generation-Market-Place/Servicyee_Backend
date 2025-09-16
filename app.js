import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import professionalRoutes from './routes/ProfessionalRoutes.js';
import {run} from './config/db.js';
run();

config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/professionals', professionalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
