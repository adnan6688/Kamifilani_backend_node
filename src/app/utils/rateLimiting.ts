
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 200, // max 100 requests per IP
    message: "Too many requests. Please try again after 5 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});