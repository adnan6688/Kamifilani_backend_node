import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

import { router } from "./routes/route";
import { limiter } from "./utils/rateLimiting";
import { globalErrorHandler } from "./Middleware/global.error.handler";
import cookieParser from "cookie-parser";

export const app = express();

const corsOptions = {
  origin: ["https://admin.kemifilani.ng", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Access-Control-Allow-Origin"],
  credentials: true,
};

// 1. Enable CORS for all routes (Must be first)
app.use(cors(corsOptions));

// 2. Explicitly handle Preflight OPTIONS requests for all routes without wildcard route path
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Origin",
      req.headers.origin || "https://admin.kemifilani.ng",
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With",
    );
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

// 3. Parsers
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "News server is running!",
  });
});

// Rate limiter
app.use(limiter);

// Routes
app.use("/api/v1", router);

// Global error handler
app.use(globalErrorHandler);

// Fallback error handler (Ensure CORS headers are attached even on error!)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && corsOptions.origin.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.status(500).json({
    success: false,
    message: err.message,
  });
});
