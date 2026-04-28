import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: text("created_at").notNull(),
});

// API key settings — one per user
export const apiSettings = sqliteTable("api_settings", {
  userId: integer("user_id").primaryKey().references(() => users.id),
  provider: text("provider").notNull(),
  apiKey: text("api_key").notNull(),
  baseUrl: text("base_url").notNull(),
  model: text("model").notNull(),
});

// Progress tracking — per user per day
export const dayProgress = sqliteTable("day_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  dayNumber: integer("day_number").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
});

// Purchases — tracks which levels each email has paid for
export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  level: text("level").notNull(), // "1", "2", "3", or "bundle"
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  stripePaymentIntent: text("stripe_payment_intent"),
  amountCents: integer("amount_cents").notNull(),
  createdAt: text("created_at").notNull(),
});

// Password reset tokens
export const passwordResets = sqliteTable("password_resets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  token: text("token").notNull(),
  expiresAt: text("expires_at").notNull(),
  used: integer("used", { mode: "boolean" }).notNull().default(false),
});

// Reviews — customer reviews pending approval
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  review: text("review").notNull(),
  rating: integer("rating").notNull().default(5), // 1-5 stars
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const insertDayProgressSchema = createInsertSchema(dayProgress);
export type InsertDayProgress = z.infer<typeof insertDayProgressSchema>;
export type DayProgress = typeof dayProgress.$inferSelect;
export type User = typeof users.$inferSelect;
export type ApiSettings = typeof apiSettings.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
export type Review = typeof reviews.$inferSelect;
