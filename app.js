import dotenv from "dotenv";
import express, { json } from "express";
import { errors } from "celebrate";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";


import cors from "cors";
import { run } from "./config/db.js";

import professionalRoutes from "./routes/ProfessionalRoutes.js";
import locationRoutes from "./routes/LocationRoutes.js";

import userRoute from "./routes/userRoute.js";

import wishlistsRoutes from "./routes/wishlistsRoute.js";


import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import serviceRoute from './routes/serviceRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import subCategoriesRoute from './routes/subCategoryRoute.js';
import questionRoute from './routes/questionRoute.js'
import answerRoute from './routes/answerRoute.js'
import searchRoute from './routes/searchRoute.js'
dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-servicyee.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("combined"));

// Recommended: Rate Limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

app.use("/api/", apiLimiter);
app.use("/api/v1/professionals", professionalRoutes);
app.use("/api/v1/location", locationRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/api/v1/services', serviceRoute);
app.use('/api/v1/categories',categoryRoute)
app.use('/api/v1/subcategories',subCategoriesRoute)
app.use('/api/v1/questions',questionRoute)
app.use('/api/v1/answers',answerRoute)
app.use('/api/v1/search',searchRoute)


app.use("/api/v1/user", userRoute);
app.use('/api/v1/wishlists',wishlistsRoutes);
// Routes

app.use(errors());
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (err.joi) {
    return res.status(400).json({
      status: 400,
      error: err.joi.message || "Validation error",
    });
  }
  res.status(status).json({
    status,
    error: err.message || "Internal Server Error",
  });
});

// Swagger/OpenAPI setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Servicyee API",
      version: "1.0.0",
      description: "API documentation for Servicyee microservices",
    },
    servers: [{ url: "http://localhost:4000/api/v1" }],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
run()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
