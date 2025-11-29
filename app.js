import dotenv from "dotenv";
import express from "express";
import { errors } from "celebrate";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { run } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import professionalScheduler from "./utils/scheduler.js";

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.set("trust proxy", 1);

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-servicyee.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later."
  },
});
app.use("/api/", apiLimiter);

// Static Files
app.use("/uploads", express.static("uploads"));

// API Routes
apiRoutes.forEach((route) => {
  app.use(`/api/v1${route.path}`, route.router);
});

// Scheduler Routes with proper error handling
app.get("/api/v1/admin/scheduler/status", (req, res) => {
  try {
    res.json({
      success: true,
      data: professionalScheduler.getStatus()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get scheduler status"
    });
  }
});

app.post("/api/v1/admin/scheduler/start", (req, res) => {
  try {
    professionalScheduler.start();
    res.json({
      success: true,
      message: "Scheduler started successfully",
      data: professionalScheduler.getStatus()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/api/v1/admin/scheduler/stop", (req, res) => {
  try {
    professionalScheduler.stop();
    res.json({
      success: true,
      message: "Scheduler stopped successfully",
      data: professionalScheduler.getStatus()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/api/v1/admin/scheduler/trigger", async (req, res) => {
  try {
    await professionalScheduler.manualTrigger();
    res.json({
      success: true,
      message: "Manual reactivation triggered successfully",
      data: professionalScheduler.getStatus()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Swagger Documentation
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Servicyee API",
      version: "1.0.0",
      description: "Professional Services Platform API",
    },
    servers: [{ url: `http://localhost:${PORT}/api/v1` }],
  },
  apis: ["./routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    services: {
      database: "Connected",
      scheduler: professionalScheduler.isRunning ? "Active" : "Inactive"
    }
  });
});

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Servicyee API",
    version: "1.0.0",
    documentation: "/api-docs",
    health: "/health"
  });
});

// Error Handling Middleware
app.use(errors());

// Joi Validation Errors
app.use((err, req, res, next) => {
  if (err.joi) {
    return res.status(400).json({
      success: false,
      error: err.joi.message || "Validation error"
    });
  }
  next(err);
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl
  });
});

// Server Startup
run()
  .then(() => {
    // Start scheduler in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      professionalScheduler.start();
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Documentation: http://localhost:${PORT}/api-docs`);
      console.log(` Health Check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

// Graceful Shutdown
const shutdown = (signal) => {
  professionalScheduler.stop();
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default app;