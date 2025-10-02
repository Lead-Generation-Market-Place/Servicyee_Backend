import dotenv from "dotenv";
import express from "express";
import { errors } from "celebrate";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { run } from "./config/db.js";
import apiRoutes from "./routes/index.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-servicyee.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("combined"));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

app.use("/api/", apiLimiter);
app.use("/uploads", express.static("uploads"));

// Routes
apiRoutes.forEach(route => {
  app.use(`/api/v1${route.path}`, route.router);
});

// Swagger
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
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Servicyee API', version: '1.0.0' });
});

// Error handling
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

// 404 handler - SIMPLIFIED VERSION
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Server start
run()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

export default app;