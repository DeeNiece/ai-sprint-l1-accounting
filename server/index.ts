import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { db } from "./storage";
import * as schema from "@shared/schema";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// ─── 0. Database Initialisation ───────────────────────────────────────────────
// Runs on every startup. Creates all tables if they don't exist yet.
// Safe to run repeatedly — uses "if not exists" semantics via Drizzle push.
function initDb() {
  try {
    // Matches schema.ts exactly — column names must align with Drizzle definitions
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        level TEXT NOT NULL,
        stripe_session_id TEXT NOT NULL UNIQUE,
        stripe_payment_intent TEXT,
        amount_cents INTEGER NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS day_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        day_number INTEGER NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS api_settings (
        user_id INTEGER PRIMARY KEY REFERENCES users(id),
        provider TEXT NOT NULL,
        api_key TEXT NOT NULL,
        base_url TEXT NOT NULL,
        model TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        token TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        used INTEGER NOT NULL DEFAULT 0
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        review TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        approved INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `);
    console.log("[db] Tables initialised successfully");
  } catch (err) {
    console.error("[db] Table initialisation error:", err);
    throw err;
  }
}

// ─── 1. Stripe Webhook Verification ───────────────────────────────────────────
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// ─── 2. Session Configuration ──────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || "accounting-sprint-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  }
}));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// ─── 3. Logging Middleware ─────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });
  next();
});

(async () => {
  // ─── 4. Initialise Database Tables ────────────────────────────────────────
  initDb();

  // ─── 5. Register API Routes ───────────────────────────────────────────────
 const server = await registerRoutes(app);

  // ─── 6. Global Error Handler ──────────────────────────────────────────────
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(status).json({ message });
  });

  // ─── 7. Serve Frontend ────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ─── 8. Start Server ──────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT || "8080", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
