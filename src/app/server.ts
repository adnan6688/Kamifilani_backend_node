/* eslint-disable no-console */
import mongoose from "mongoose";
import { app } from "./app";
import { redisClient } from "./config/redis";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./utils/seedSuperAdmin";

import "./utils/Notification/notification";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Redis connect
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("redis connected!")
    }

    // MongoDB connect
    await mongoose.connect(envVars.MONGO_DB_URL as string);


    // seed admin
    await seedSuperAdmin();

    // local server only
    app.listen(PORT, () => {

      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log("Server error:", error);
  }
};

startServer();

// shutdown logic (kept but not useful in Vercel, harmless)
const shutdown = (signal: string, err?: any) => {
    console.log(`${signal} detected. Shutting down...`);

    if (err) console.error(err);

    process.exit(1);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (err) => shutdown("Unhandled Rejection", err));
process.on("uncaughtException", (err) => shutdown("Uncaught Exception", err));