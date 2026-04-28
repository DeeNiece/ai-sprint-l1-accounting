import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import session from "express-session";
import { storage, db } from "./storage"; 
import * as schema from "@shared/schema"; 
import { eq } from "drizzle-orm"; 
import { z } from "zod";
import OpenAI from "openai";
import Stripe from "stripe";
import express from "express";
import passport from "passport"; 
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

declare module "express-session" {
  interface SessionData { userId: number; }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" });

const PRICES: Record<string, { amount: number; label: string }> = {
  "1": { amount: 500,  label: "Level 1 — Basic" },
  "2": { amount: 700,  label: "Level 2 — Advanced" },
  "3": { amount: 1000, label: "Level 3 — Master" },
  "bundle": { amount: 1500, label: "All 3 Levels Bundle" },
  "bundle23": { amount: 1200, label: "Level 2 + Level 3 Bundle" },
};

const PAYMONGO_PRICES: Record<string, { amount: number; label: string }> = {
  "1": { amount: 28000,  label: "Level 1 — Basic" },
  "2": { amount: 39500,  label: "Level 2 — Advanced" },
  "3": { amount: 56000, label: "Level 3 — Master" },
  "bundle": { amount: 85000, label: "All 3 Levels Bundle" },
  "bundle23": { amount: 67500, label: "Level 2 + Level 3 Bundle" },
};

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
  next();
}

export function registerRoutes(httpServer: Server, app: Express) {
  app.set("trust proxy", 1);

  // ========== STRIPE & PAYMONGO WEBHOOKS ==========
  app.post("/api/webhook", async (req: any, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
      event = stripe.webhooks.constructEvent(req.rawBody, sig as string, webhookSecret);
    } catch (err: any) { return res.status(400).send(`Webhook Error: ${err.message}`); }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email || session.customer_email;
      const level = session.metadata?.level || "bundle";
      if (email) storage.recordPurchase(email, level, session.id, session.payment_intent as string | null, session.amount_total || 0);
    }
    res.json({ received: true });
  });

  app.use(express.json());

  app.post("/api/paymongo/webhook", async (req, res) => {
    const event = req.body;
    if (event?.data?.attributes?.type === "checkout_session.payment.paid") {
      const s = event.data.attributes.data;
      const email = s.attributes.metadata?.email || s.attributes.billing?.email;
      const level = s.attributes.metadata?.level || "bundle";
      const amount = s.attributes.line_items[0]?.amount || 0; 
      if (email) storage.recordPurchase(email, level, s.id, null, amount);
    }
    res.json({ received: true });
  });

  // ========== AUTH & SESSIONS ==========
  const isProd = process.env.NODE_ENV === "production";
  app.use(session({
    secret: process.env.SESSION_SECRET || "ai-sprint-secret",
    resave: false, saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: isProd ? "none" : "lax", secure: isProd },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.GOOGLE_CLIENT_ID) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: isProd ? "https://ai-sprint-app-production.up.railway.app/api/auth/google/callback" : "/api/auth/google/callback",
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No email found"));
        let user = storage.getUserByEmail(email);
        if (!user) user = storage.createUser(email, Math.random().toString(36), profile.displayName);
        return done(null, user);
      }
    ));
  }

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser((id: number, done) => done(null, storage.getUserById(id)));

  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get("/api/auth/google/callback", passport.authenticate("google", { failureRedirect: "/#/login" }), (req, res) => {
    req.session.userId = (req.user as any).id;
    res.redirect("/#/"); 
  });

  app.post("/api/auth/register", (req, res) => {
    const b = z.object({ email: z.string().email(), password: z.string().min(6), displayName: z.string().min(1) }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    const user = storage.createUser(b.data.email, b.data.password, b.data.displayName);
    if (!user) return res.status(409).json({ error: "Email exists" });
    req.session.userId = user.id;
    res.json({ ...user, licensedLevels: storage.getLicensedLevels(user.email), isAdmin: storage.isAdmin(user.email) });
  });

  app.post("/api/auth/login", (req, res) => {
    const b = z.object({ email: z.string().email(), password: z.string() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    const user = storage.authenticateUser(b.data.email, b.data.password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    req.session.userId = user.id;
    res.json({ ...user, licensedLevels: storage.getLicensedLevels(user.email), isAdmin: storage.isAdmin(user.email) });
  });

  app.post("/api/auth/logout", (req, res) => { req.session.destroy(() => res.json({ ok: true })); });

  app.get("/api/auth/me", (req, res) => {
    const id = req.session.userId;
    if (!id) return res.status(401).json({ error: "Not logged in" });
    const user = storage.getUserById(id);
    if (!user) return res.status(401).json({ error: "User not found" });
    res.json({ ...user, licensedLevels: storage.getLicensedLevels(user.email), isAdmin: storage.isAdmin(user.email) });
  });

  // ========== CHECKOUTS ==========
  app.post("/api/stripe/checkout", requireAuth, async (req, res) => {
    const b = z.object({ plan: z.string() }).safeParse(req.body);
    const user = storage.getUserById(req.session.userId!);
    try {
      const planKey = b.data?.plan || "bundle";
      const priceInfo = PRICES[planKey] || PRICES["bundle"];
      const session = await stripe.checkout.sessions.create({
        mode: "payment", customer_email: user!.email, metadata: { level: planKey }, 
        line_items: [{ price_data: { currency: "usd", product_data: { name: priceInfo.label }, unit_amount: priceInfo.amount }, quantity: 1 }],
        success_url: `https://ai-sprint-app-production.up.railway.app/#/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://ai-sprint-app-production.up.railway.app/#/pricing`,
      });
      res.json({ url: session.url });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  app.post("/api/paymongo/checkout", requireAuth, async (req, res) => {
    const b = z.object({ plan: z.string() }).safeParse(req.body);
    const user = storage.getUserById(req.session.userId!);
    const KEY = process.env.PAYMONGO_SECRET_KEY || "";
    try {
      const planKey = b.data?.plan || "bundle";
      const priceInfo = PAYMONGO_PRICES[planKey] || PAYMONGO_PRICES["bundle"];
      const auth = `Basic ${Buffer.from(KEY + ":").toString("base64")}`;
      const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": auth },
        body: JSON.stringify({
          data: { attributes: {
              billing: { email: user!.email, name: user!.displayName },
              send_email_receipt: true, show_description: true, show_line_items: true,
              cancel_url: `https://ai-sprint-app-production.up.railway.app/#/pricing`,
              success_url: `https://ai-sprint-app-production.up.railway.app/#/purchase-success`,
              description: priceInfo.label,
              payment_method_types: ["gcash", "paymaya", "card", "grab_pay"],
              line_items: [{ currency: "PHP", amount: priceInfo.amount, name: priceInfo.label, quantity: 1 }],
              metadata: { level: planKey, email: user!.email }
            }
          }
        })
      });
      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].detail);
      res.json({ url: data.data.attributes.checkout_url });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // ========== API SETTINGS ==========
  app.get("/api/settings", requireAuth, (req, res) => {
    const s = storage.getApiSettings(req.session.userId!);
    res.json(s || {});
  });

  app.post("/api/settings", requireAuth, (req, res) => {
    try {
      const { provider = "openai", apiKey = "", baseUrl = "", model = "" } = req.body;
      const finalUrl = baseUrl || req.body.baseURL || ""; 
      storage.saveApiSettings(req.session.userId!, provider, apiKey, finalUrl, model);
      res.json({ ok: true });
    } catch (err: any) {
      console.error("Database Save Error:", err);
      res.status(500).json({ error: "Failed to save settings to database." });
    }
  });

  // ✅ DELETE /api/settings — removes the user's saved API key from the database
  app.delete("/api/settings", requireAuth, (req, res) => {
    try {
      storage.deleteApiSettings(req.session.userId!);
      res.json({ ok: true });
    } catch (err: any) {
      console.error("Delete Settings Error:", err);
      res.status(500).json({ error: "Failed to remove API key." });
    }
  });

  // ========== TEST CONNECTION & PROMPT LAB ==========
  app.post("/api/settings/test", requireAuth, async (req, res) => {
    try {
      const { apiKey = "", baseUrl = "", model = "", customPrompt } = req.body;
      const finalUrlFromReq = baseUrl || req.body.baseURL || "";
      
      let testApiKey = apiKey;
      let testBaseUrl = finalUrlFromReq;
      let testModel = model;

      if (!testApiKey) {
         const savedSettings = storage.getApiSettings(req.session.userId!);
         if (!savedSettings || !savedSettings.apiKey) throw new Error("No API key provided or saved.");
         testApiKey = savedSettings.apiKey;
         testBaseUrl = savedSettings.baseUrl || "";
         testModel = savedSettings.model || "";
      }
      
      if (!testModel && testBaseUrl.includes("deepseek")) testModel = "deepseek-chat";
      
      const client = new OpenAI({ apiKey: testApiKey, baseURL: testBaseUrl || undefined });
      
      const promptToUse = customPrompt || "Ping";
      const maxTokens = customPrompt ? 4000 : 5; 

      const response = await client.chat.completions.create({
        model: testModel || "gpt-3.5-turbo",
        messages: [{ role: "user", content: promptToUse }],
        max_tokens: maxTokens
      });
      
      const replyText = response.choices[0]?.message?.content || "";

      res.json({ success: true, message: "Connection successful", response: replyText });
    } catch (err: any) {
      console.error("Test Connection Error:", err.message);
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // ========== CHAT & AI ==========
  app.post("/api/chat", requireAuth, async (req, res) => {
    const s = storage.getApiSettings(req.session.userId!);
    if (!s || !s.apiKey) {
      res.status(400).json({ error: "No API key" });
      return;
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    try {
      let messages = req.body.messages || [];
      const dayContext = req.body.dayContext || "You are a helpful AI assistant.";
      
      if (messages.length === 0 && req.body.prompt) {
          messages = [{ role: "user", content: req.body.prompt }];
      }

      let finalModel = s.model || "gpt-3.5-turbo";
      if (!s.model && (s.baseUrl || "").includes("deepseek")) {
          finalModel = "deepseek-chat";
      }

      const client = new OpenAI({ apiKey: s.apiKey, baseURL: s.baseUrl || undefined });
      const stream = await client.chat.completions.create({
        model: finalModel,
        messages: [{ role: "system", content: dayContext }, ...messages],
        stream: true,
      });
      
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) res.write(text);
      }
      res.end();
    } catch (err: any) { 
      res.write(`\n\n[API Connection Error: ${err.message}]`);
      res.end(); 
    }
  });

  // ========== PROGRESS & ADMIN ==========
  app.get("/api/progress", requireAuth, (req, res) => res.json(storage.getAllProgress(req.session.userId!)));
  app.post("/api/progress/:day", requireAuth, (req, res) => {
    const b = z.object({ completed: z.boolean() }).safeParse(req.body);
    if (b.success) res.json(storage.setDayComplete(req.session.userId!, parseInt(req.params.day), b.data.completed));
  });

  app.get("/api/admin/dashboard", requireAuth, (req, res) => {
    const user = storage.getUserById(req.session.userId!);
    if (!user || !storage.isAdmin(user.email)) return res.status(403).json({ error: "Admin only" });
    res.json(storage.getAllMembersData());
  });

  app.post("/api/admin/grant", requireAuth, (req, res) => {
    const user = storage.getUserById(req.session.userId!);
    if (!user || !storage.isAdmin(user.email)) return res.status(403).json({ error: "Admin only" });
    const b = z.object({ email: z.string().email(), level: z.string() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    storage.recordPurchase(b.data.email, b.data.level, "admin_grant_" + Date.now(), null, 0);
    res.json({ ok: true });
  });

  // ========== NEW: REMOVE USER ==========
  // Deletes the user row + their progress from the DB.
  // Purchase records are intentionally kept for accounting purposes.
  // Only admins can call this. Admins cannot delete themselves.
  app.post("/api/admin/remove-user", requireAuth, (req, res) => {
    const admin = storage.getUserById(req.session.userId!);
    if (!admin || !storage.isAdmin(admin.email)) {
      return res.status(403).json({ error: "Admin only" });
    }

    const b = z.object({ email: z.string().email() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });

    const targetEmail = b.data.email.toLowerCase().trim();

    // Safety: prevent admin from deleting themselves
    if (targetEmail === admin.email.toLowerCase().trim()) {
      return res.status(400).json({ error: "You cannot delete your own account." });
    }

    const targetUser = storage.getUserByEmail(targetEmail);
    if (!targetUser) {
      // No registered account found — still return ok (may be unregistered buyer in purchases only)
      return res.json({ ok: true });
    }

    // Delete their progress records first (foreign key safety)
    db.delete(schema.dayProgress)
      .where(eq(schema.dayProgress.userId, targetUser.id))
      .run();

    // Delete their API settings
    db.delete(schema.apiSettings)
      .where(eq(schema.apiSettings.userId, targetUser.id))
      .run();

    // Delete the user account itself
    db.delete(schema.users)
      .where(eq(schema.users.id, targetUser.id))
      .run();

    // NOTE: purchases are intentionally NOT deleted — kept for accounting records.

    res.json({ ok: true });
  });

  // ========== REVIEWS ==========

  // Public: returns only approved reviews for the FAQ page
  app.get("/api/reviews", (req, res) => {
    try {
      res.json(storage.getApprovedReviews());
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Public: submit a new review (saved as unapproved, admin must approve)
  app.post("/api/reviews/submit", (req, res) => {
    const b = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      review: z.string().min(1),
      rating: z.number().int().min(1).max(5),
    }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    try {
      const saved = storage.submitReview(b.data.name, b.data.email, b.data.review, b.data.rating);
      res.json({ ok: true, id: saved.id });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to save review" });
    }
  });

  // Admin: get ALL reviews including pending
  app.get("/api/admin/reviews", requireAuth, (req, res) => {
    const user = storage.getUserById(req.session.userId!);
    if (!user || !storage.isAdmin(user.email)) return res.status(403).json({ error: "Admin only" });
    res.json(storage.getAllReviews());
  });

  // Admin: approve a review
  app.post("/api/admin/reviews/approve", requireAuth, (req, res) => {
    const user = storage.getUserById(req.session.userId!);
    if (!user || !storage.isAdmin(user.email)) return res.status(403).json({ error: "Admin only" });
    const b = z.object({ id: z.number().int() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    const ok = storage.approveReview(b.data.id);
    if (!ok) return res.status(404).json({ error: "Review not found" });
    res.json({ ok: true });
  });

  // Admin: delete a review
  app.post("/api/admin/reviews/delete", requireAuth, (req, res) => {
    const user = storage.getUserById(req.session.userId!);
    if (!user || !storage.isAdmin(user.email)) return res.status(403).json({ error: "Admin only" });
    const b = z.object({ id: z.number().int() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    const ok = storage.deleteReview(b.data.id);
    if (!ok) return res.status(404).json({ error: "Review not found" });
    res.json({ ok: true });
  });

}
