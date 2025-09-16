import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ConnectDB } from './config/db.js';

dotenv.config();
ConnectDB();

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
