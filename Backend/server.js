<<<<<<< HEAD
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Webhook route needs raw body — mount BEFORE express.json() ────────────────
app.use("/api/webhooks", webhookRoutes);

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk attaches auth() to every request — required for getAuth() to work
app.use(clerkMiddleware());

// Serve uploaded images as static files
// e.g. http://localhost:5000/uploads/avatars/uuid.jpg
app.use("/uploads", express.static("uploads"));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

// Health check
app.get("/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// 404
app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`🚀 Traveloop server running → http://localhost:${PORT}`)
);

export default app;
=======
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
>>>>>>> origin/Frontend_Aavishkar
