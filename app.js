import dotenv from "dotenv";
import express, { json } from "express";
import { errors } from 'celebrate';
import rateLimit from 'express-rate-limit';

import cors from "cors";
import {run} from "./config/db.js";

import professionalRoutes from './routes/ProfessionalRoutes.js';
import locationRoutes from './routes/LocationRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config()
// Connect DB
run();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Recommended: Rate Limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});
app.use('/api/', apiLimiter);
app.use('/api/v1/professionals', professionalRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/uploads', express.static('uploads'));

app.use(errors());
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (err.joi) {
    return res.status(400).json({
      status: 400,
      error: err.joi.message || 'Validation error',
    });
  }
  res.status(status).json({
    status,
    error: err.message || 'Internal Server Error',
  });
});

// Swagger/OpenAPI setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Servicyee API',
      version: '1.0.0',
      description: 'API documentation for Servicyee microservices',
    },
    servers: [
      { url: 'http://localhost:5000/api/v1' }
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
