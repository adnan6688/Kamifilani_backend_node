import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

import { router } from "./routes/route";
import { limiter } from "./utils/rateLimiting";
import { globalErrorHandler } from "./Middleware/global.error.handler";
import cookieParser from 'cookie-parser'
export const app = express();

app.use(
  cors({
    origin: ["https://admin.kemifilani.ng", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());


app.use(cookieParser());
app.set("trust proxy", 1);

// health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "News server is running!",
  });
});

// rate limiter
app.use(limiter);

// routes
app.use("/api/v1", router);

// global error handler
app.use(globalErrorHandler);

// fallback error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message,
  });
});