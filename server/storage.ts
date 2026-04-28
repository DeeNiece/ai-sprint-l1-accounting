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

const sqlite = new Database(getDbPath());
export const db = drizzle(sqlite, { schema });

export class Storage {
  isAdmin(email: string): boolean {
    const list = (process.env.ADMIN_EMAILS || "").toLowerCase().split(",");
    return list.includes(email.toLowerCase().trim());
  }

  isFreePass(email: string): boolean {
    const freeList = (process.env.FREE_PASS_EMAILS || "").toLowerCase().split(",");
    return this.isAdmin(email) || freeList.includes(email.toLowerCase().trim());
  }

  getLicensedLevels(email: string): string[] {
    if (this.isFreePass(email)) return ["1", "2", "3"];
    const purchases = db.select().from(schema.purchases)
      .where(eq(schema.purchases.email, email.toLowerCase().trim())).all();
    
    const levels = new Set<string>();
    purchases.forEach(p => {
      if (p.level === "bundle") { levels.add("1"); levels.add("2"); levels.add("3"); }
      else if (p.level === "bundle23") { levels.add("2"); levels.add("3"); }
      else { levels.add(p.level); }
    });
    return Array.from(levels);
  }

  getAllMembersData() {
    const users = db.select().from(schema.users).all();
    const purchases = db.select().from(schema.purchases).all();
    const allEmails = new Set([
      ...users.map(u => u.email.toLowerCase().trim()),
      ...purchases.map(p => p.email.toLowerCase().trim())
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
          ? "Paid Users (Bundle)" 
          : `Paid Users (${userPurchases.map(p => p.level.replace("level", "Level ")).join(" + ")})`;
      } else if (u) displayPlan = "Only registered";
      else displayPlan = "Unregistered Buyer";

      return {
        name: u ? u.displayName : "Unregistered Buyer",
        email: email,
        dateJoined: u ? new Date(u.createdAt).toLocaleDateString() : "N/A",
        planPurchased: displayPlan,
        amount: `$${totalAmount.toFixed(2)}`
      };
    });
  }

  createUser(email: string, password: string, displayName: string): User | null {
    const salt = randomBytes(16).toString("hex");
    const passwordHash = createHash("sha256").update(password + salt).digest("hex") + ":" + salt;
    try {
      db.insert(schema.users).values({ email: email.toLowerCase().trim(), passwordHash, displayName: displayName.trim(), createdAt: new Date().toISOString() }).run();
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

  getUserByEmail(email: string): User | null { return db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim())).get() || null; }
  getUserById(id: number): User | null { return db.select().from(schema.users).where(eq(schema.users.id, id)).get() || null; }

  recordPurchase(email: string, level: string, sessionId: string, paymentIntentId: string | null, amountCents: number) {
    db.insert(schema.purchases).values({ email: email.toLowerCase().trim(), level, stripeSessionId: sessionId, stripePaymentIntentId: paymentIntentId, amountCents, createdAt: new Date().toISOString() }).run();
  }

  getApiSettings(userId: number): ApiSettings | null { return db.select().from(schema.apiSettings).where(eq(schema.apiSettings.userId, userId)).get() || null; }
  
  saveApiSettings(userId: number, provider: string, apiKey: string, baseUrl: string, model: string): ApiSettings {
    const existing = this.getApiSettings(userId);
    const data = { provider: provider || "openai", apiKey: apiKey || "", baseUrl: baseUrl || "", model: model || "" };
    if (existing) { db.update(schema.apiSettings).set(data).where(eq(schema.apiSettings.userId, userId)).run(); } 
    else { db.insert(schema.apiSettings).values({ userId, ...data }).run(); }
    return this.getApiSettings(userId)!;
  }

  // ✅ Delete a user's API settings (called when they click "Remove Key")
  deleteApiSettings(userId: number): void {
    db.delete(schema.apiSettings).where(eq(schema.apiSettings.userId, userId)).run();
  }

  getAllProgress(userId: number): DayProgress[] { return db.select().from(schema.dayProgress).where(eq(schema.dayProgress.userId, userId)).all(); }
  setDayComplete(userId: number, dayNumber: number, completed: boolean): DayProgress {
    const existing = db.select().from(schema.dayProgress).where(and(eq(schema.dayProgress.userId, userId), eq(schema.dayProgress.dayNumber, dayNumber))).get();
    if (existing) { db.update(schema.dayProgress).set({ completed: completed ? 1 : 0 }).where(and(eq(schema.dayProgress.userId, userId), eq(schema.dayProgress.dayNumber, dayNumber))).run(); } 
    else { db.insert(schema.dayProgress).values({ userId, dayNumber, completed: completed ? 1 : 0 }).run(); }
    return db.select().from(schema.dayProgress).where(and(eq(schema.dayProgress.userId, userId), eq(schema.dayProgress.dayNumber, dayNumber))).get() as DayProgress;
  }

  // ========== REVIEWS ==========

  // Submit a new review — always starts as unapproved
  submitReview(name: string, email: string, review: string, rating: number): Review {
    db.insert(schema.reviews).values({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      review: review.trim(),
      rating: Math.min(5, Math.max(1, rating)), // clamp 1–5
      approved: false,
      createdAt: new Date().toISOString(),
    }).run();
    // Return the newly inserted row
    return db.select().from(schema.reviews)
      .where(eq(schema.reviews.email, email.toLowerCase().trim()))
      .all()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  // Public — only approved reviews
  getApprovedReviews(): Review[] {
    return db.select().from(schema.reviews)
      .where(eq(schema.reviews.approved, true))
      .all()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Admin — all reviews including pending
  getAllReviews(): Review[] {
    return db.select().from(schema.reviews)
      .all()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Admin — approve a review by ID
  approveReview(id: number): boolean {
    const review = db.select().from(schema.reviews).where(eq(schema.reviews.id, id)).get();
    if (!review) return false;
    db.update(schema.reviews).set({ approved: true }).where(eq(schema.reviews.id, id)).run();
    return true;
  }

  // Admin — delete a review by ID
  deleteReview(id: number): boolean {
    const review = db.select().from(schema.reviews).where(eq(schema.reviews.id, id)).get();
    if (!review) return false;
    db.delete(schema.reviews).where(eq(schema.reviews.id, id)).run();
    return true;
  }
}

export const storage = new Storage();
