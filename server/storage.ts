import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { DayProgress, User, ApiSettings, Purchase, Review } from "@shared/schema";
import { createHash, randomBytes } from "crypto";
import { mkdirSync, accessSync, constants } from "fs";

function getDbPath(): string {
  if (process.env.NODE_ENV === "production") {
    try {
      mkdirSync("/data", { recursive: true });
      accessSync("/data", constants.W_OK);
      return "/data/sqlite.db";
    } catch { return "sqlite.db"; }
  }
  return "sqlite.db";
}

const DB_PATH = getDbPath();
console.log("Database path:", DB_PATH);
const sqlite = new Database(DB_PATH);
export const db = drizzle(sqlite, { schema });

// ── Create tables ─────────────────────────────────────────────
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS api_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    provider TEXT NOT NULL,
    api_key TEXT NOT NULL,
    base_url TEXT NOT NULL,
    model TEXT NOT NULL
  )
`);

// dayNumber is TEXT to support "L1-1", "L2-7"
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS day_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    day_number TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, day_number)
  )
`);

sqlite.exec(`
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

sqlite.exec(`
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

// ── Migrations ────────────────────────────────────────────────
// Migrate day_progress.day_number from INTEGER to TEXT if needed
try {
  const info = sqlite.pragma("table_info(day_progress)") as any[];
  const col = info.find((c: any) => c.name === "day_number");
  if (!col || col.type?.toUpperCase() === "INTEGER") {
    console.log("Migrating day_progress.day_number to TEXT...");
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS day_progress_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        day_number TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        UNIQUE(user_id, day_number)
      )
    `);
    sqlite.exec(`
      INSERT OR IGNORE INTO day_progress_new (id, user_id, day_number, completed)
      SELECT id, user_id, CAST(day_number AS TEXT), completed FROM day_progress
    `);
    sqlite.exec("DROP TABLE day_progress");
    sqlite.exec("ALTER TABLE day_progress_new RENAME TO day_progress");
    console.log("Migration complete.");
  }
} catch (e) {
  console.warn("day_progress migration skipped:", e);
}

export class Storage {

  // ── Auth helpers ──────────────────────────────────────────
  isAdmin(email: string): boolean {
    const safeEmail = email.toLowerCase().trim();
    const adminStr = process.env.ADMIN_EMAILS || "";
    return adminStr.toLowerCase().split(",").map(e => e.trim()).filter(Boolean).includes(safeEmail);
  }

  isFreePass(email: string): boolean {
    const safeEmail = email.toLowerCase().trim();
    // Check BOTH env vars — email in either one gets full access
    const freePassStr = process.env.FREE_PASS_EMAILS || "";
    const adminStr = process.env.ADMIN_EMAILS || "";
    const allEmails = [
      ...freePassStr.toLowerCase().split(","),
      ...adminStr.toLowerCase().split(","),
    ].map(e => e.trim()).filter(Boolean);
    return allEmails.includes(safeEmail);
  }

  getLicensedLevels(email: string): string[] {
    if (this.isFreePass(email)) {
      return ["accounting-basic", "accounting-advanced", "accounting-bundle"];
    }
    const rows = db.select().from(schema.purchases)
      .where(eq(schema.purchases.email, email.toLowerCase().trim())).all();
    const levels = new Set<string>();
    rows.forEach(p => {
      if (p.level === "accounting-bundle") {
        levels.add("accounting-basic");
        levels.add("accounting-advanced");
        levels.add("accounting-bundle");
      } else {
        levels.add(p.level);
      }
    });
    return Array.from(levels);
  }

  createUser(email: string, password: string, displayName: string): User | null {
    const salt = randomBytes(16).toString("hex");
    const passwordHash = createHash("sha256").update(password + salt).digest("hex") + ":" + salt;
    try {
      db.insert(schema.users).values({
        email: email.toLowerCase().trim(),
        passwordHash,
        displayName: displayName.trim(),
        createdAt: new Date().toISOString(),
      }).run();
      return this.getUserByEmail(email);
    } catch { return null; }
  }

  authenticateUser(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;
    const [storedHash, salt] = user.passwordHash.split(":");
    const inputHash = createHash("sha256").update(password + salt).digest("hex");
    return inputHash === storedHash ? user : null;
  }

  getUserByEmail(email: string): User | null {
    return db.select().from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase().trim())).get() || null;
  }

  getUserById(id: number): User | null {
    return db.select().from(schema.users).where(eq(schema.users.id, id)).get() || null;
  }

  getApiSettings(userId: number): ApiSettings | null {
    return db.select().from(schema.apiSettings)
      .where(eq(schema.apiSettings.userId, userId)).get() || null;
  }

  saveApiSettings(userId: number, provider: string, apiKey: string, baseUrl: string, model: string): ApiSettings {
    const data = { provider: provider || "openai", apiKey: apiKey || "", baseUrl: baseUrl || "", model: model || "" };
    const existing = this.getApiSettings(userId);
    if (existing) {
      db.update(schema.apiSettings).set(data).where(eq(schema.apiSettings.userId, userId)).run();
    } else {
      db.insert(schema.apiSettings).values({ userId, ...data }).run();
    }
    return this.getApiSettings(userId)!;
  }

  deleteApiSettings(userId: number): void {
    db.delete(schema.apiSettings).where(eq(schema.apiSettings.userId, userId)).run();
  }

  // dayNumber is a string: "L1-1", "L2-7", or legacy "1"
  getAllProgress(userId: number): DayProgress[] {
    return db.select().from(schema.dayProgress)
      .where(eq(schema.dayProgress.userId, userId)).all();
  }

  setDayComplete(userId: number, dayNumber: string, completed: boolean): DayProgress {
    const dayStr = String(dayNumber);
    const existing = db.select().from(schema.dayProgress)
      .where(and(eq(schema.dayProgress.userId, userId), eq(schema.dayProgress.dayNumber, dayStr)))
      .get();
    if (existing) {
      db.update(schema.dayProgress).set({ completed })
        .where(and(eq(schema.dayProgress.userId, userId), eq(schema.dayProgress.dayNumber, dayStr)))
        .run();
    } else {
      db.insert(schema.dayProgress).values({ userId, dayNumber: dayStr, completed }).run();
    }
    return db.select().from(schema.dayProgress)
      .where(and(eq(schema.dayProgress.userId, userId), eq(schema.dayProgress.dayNumber, dayStr)))
      .get() as DayProgress;
  }

  recordPurchase(email: string, level: string, sessionId: string, paymentIntentId: string | null, amountCents: number): void {
    try {
      db.insert(schema.purchases).values({
        email: email.toLowerCase().trim(),
        level,
        stripeSessionId: sessionId,
        stripePaymentIntent: paymentIntentId,
        amountCents,
        createdAt: new Date().toISOString(),
      }).run();
    } catch (err) {
      console.error("Failed to record purchase:", err);
    }
  }

  resetUserPassword(email: string, newPassword: string): boolean {
    const user = this.getUserByEmail(email);
    if (!user) return false;
    const salt = randomBytes(16).toString("hex");
    const passwordHash = createHash("sha256").update(newPassword + salt).digest("hex") + ":" + salt;
    try {
      sqlite.prepare("UPDATE users SET password_hash = ? WHERE email = ?")
        .run(passwordHash, email.toLowerCase().trim());
      return true;
    } catch { return false; }
  }

  getAllMembersData(): any[] {
    const users = db.select().from(schema.users).all();
    const purchases = db.select().from(schema.purchases).all();
    const allEmails = new Set([
      ...users.map(u => u.email.toLowerCase().trim()),
      ...purchases.map(p => p.email.toLowerCase().trim()),
    ]);
    return Array.from(allEmails).map(email => {
      const u = users.find(user => user.email.toLowerCase().trim() === email);
      const userPurchases = purchases.filter(p => p.email.toLowerCase().trim() === email);
      const totalAmount = userPurchases.reduce((sum, p) => sum + (p.amountCents || 0), 0) / 100;
      let displayPlan = "";
      if (this.isAdmin(email)) displayPlan = "Admin";
      else if (this.isFreePass(email)) displayPlan = "Free Pass";
      else if (userPurchases.length > 0) {
        displayPlan = userPurchases.some(p => p.level.includes("bundle"))
          ? "Bundle" : userPurchases.map(p => p.level).join(" + ");
      } else if (u) displayPlan = "Registered (no plan)";
      else displayPlan = "Unregistered buyer";
      return {
        name: u ? u.displayName : "Unregistered Buyer",
        email,
        dateJoined: u ? new Date(u.createdAt).toLocaleDateString() : "N/A",
        planPurchased: displayPlan,
        amount: `$${totalAmount.toFixed(2)}`,
      };
    });
  }

  deleteUser(email: string): void {
    const user = this.getUserByEmail(email);
    if (!user) return;
    db.delete(schema.dayProgress).where(eq(schema.dayProgress.userId, user.id)).run();
    db.delete(schema.apiSettings).where(eq(schema.apiSettings.userId, user.id)).run();
    db.delete(schema.users).where(eq(schema.users.id, user.id)).run();
  }

  submitReview(name: string, email: string, review: string, rating: number): Review {
    db.insert(schema.reviews).values({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      review: review.trim(),
      rating: Math.min(5, Math.max(1, rating)),
      approved: false,
      createdAt: new Date().toISOString(),
    }).run();
    return db.select().from(schema.reviews)
      .where(eq(schema.reviews.email, email.toLowerCase().trim()))
      .all()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  getApprovedReviews(): Review[] {
    return db.select().from(schema.reviews).where(eq(schema.reviews.approved, true)).all()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllReviews(): Review[] {
    return db.select().from(schema.reviews).all()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  approveReview(id: number): boolean {
    const review = db.select().from(schema.reviews).where(eq(schema.reviews.id, id)).get();
    if (!review) return false;
    db.update(schema.reviews).set({ approved: true }).where(eq(schema.reviews.id, id)).run();
    return true;
  }

  deleteReview(id: number): boolean {
    const review = db.select().from(schema.reviews).where(eq(schema.reviews.id, id)).get();
    if (!review) return false;
    db.delete(schema.reviews).where(eq(schema.reviews.id, id)).run();
    return true;
  }
}

export const storage = new Storage();
