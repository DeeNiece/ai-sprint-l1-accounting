// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: routes.ts  |  Repo: accounting
// Last updated: May 2026

import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { createServer } from "http";
import session from "express-session";
import { storage, db } from "./storage";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import OpenAI from "openai";
import Stripe from "stripe";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

declare module "express-session" {
  interface SessionData { userId: number; }
}

const stripeKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2023-10-16" }) : null as any;

const APP_URL = process.env.APP_URL || "https://ai-sprint-l1-accounting-production.up.railway.app";

// ── Pricing (USD) – updated to match pricing page ──────────────────────────
// Single $59 price grants both tracks via "accounting-bundle"
const PRICES: Record<string, { amount: number; label: string }> = {
  "accounting-bundle": { amount: 5900, label: "Accounting in the AI Era — Complete Course (Basic + Advanced)" },
};

// No hardcoded PAYMONGO_PRICES – now using live rate dynamically

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
  next();
}

export function registerRoutes(app: Express): Server {
  app.set("trust proxy", 1);

  // ── Stripe webhook (must be before express.json) ──────────
  app.post("/api/webhook", async (req: any, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
      event = stripe.webhooks.constructEvent(req.rawBody, sig as string, webhookSecret);
    } catch (err: any) { return res.status(400).send(`Webhook Error: ${err.message}`); }
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      const email = s.customer_details?.email || s.customer_email;
      const level = s.metadata?.level || "accounting-bundle";
      if (email) storage.recordPurchase(email, level, s.id, s.payment_intent as string | null, s.amount_total || 0);
    }
    res.json({ received: true });
  });

  // ── PayMongo webhook ──────────────────────────────────────
  app.post("/api/paymongo/webhook", async (req, res) => {
    const event = req.body;
    if (event?.data?.attributes?.type === "checkout_session.payment.paid") {
      const s = event.data.attributes.data;
      const email = s.attributes.metadata?.email || s.attributes.billing?.email;
      const level = s.attributes.metadata?.level || "accounting-bundle";
      const amount = s.attributes.line_items[0]?.amount || 0;
      if (email) storage.recordPurchase(email, level, s.id, null, amount);
    }
    res.json({ received: true });
  });

  // ── Sessions ──────────────────────────────────────────────
  app.use(session({
    secret: process.env.SESSION_SECRET || "accounting-sprint-secret",
    resave: false, saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.GOOGLE_CLIENT_ID) {
    passport.use(new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${APP_URL}/api/auth/google/callback`,
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No email found"));
        let user = storage.getUserByEmail(email);
        if (!user) user = storage.createUser(email, Math.random().toString(36), profile.displayName || "Google User");
        return done(null, user);
      }
    ));
  }

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser((id: number, done) => done(null, storage.getUserById(id)));

  // ── Auth routes ───────────────────────────────────────────
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/#/login" }),
    (req, res) => {
      req.session.userId = (req.user as any).id;
      res.redirect("/#/");
    }
  );

  app.post("/api/auth/register", (req, res) => {
    const b = z.object({ email: z.string().email(), password: z.string().min(6), displayName: z.string().min(1) }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    const user = storage.createUser(b.data.email, b.data.password, b.data.displayName);
    if (!user) return res.status(409).json({ error: "Email already exists" });
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
    if (!id) return res.json(null);
    const user = storage.getUserById(id);
    if (!user) return res.json(null);
    res.json({ ...user, licensedLevels: storage.getLicensedLevels(user.email), isAdmin: storage.isAdmin(user.email) });
  });

  app.post("/api/auth/change-password", requireAuth, (req, res) => {
    const b = z.object({ newPassword: z.string().min(6) }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Password must be at least 6 characters." });
    const user = storage.getUserById(req.session.userId!);
    if (!user) return res.status(404).json({ error: "User not found." });
    const ok = storage.resetUserPassword(user.email, b.data.newPassword);
    if (!ok) return res.status(500).json({ error: "Failed to update password." });
    res.json({ ok: true });
  });

  // ── Stripe checkout ───────────────────────────────────────
  app.post("/api/stripe/checkout", requireAuth, async (req, res) => {
    const b = z.object({ plan: z.string() }).safeParse(req.body);
    const user = storage.getUserById(req.session.userId!);
    if (!user) return res.status(401).json({ error: "Not logged in. Please log in and try again." });
    try {
      const planKey = b.data?.plan || "accounting-bundle";
      const priceInfo = PRICES[planKey] || PRICES["accounting-bundle"];
      const s = await stripe.checkout.sessions.create({
        mode: "payment", customer_email: user.email, metadata: { level: planKey },
        line_items: [{ price_data: { currency: "usd", product_data: { name: priceInfo.label }, unit_amount: priceInfo.amount }, quantity: 1 }],
        success_url: `${APP_URL}/#/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/#/pricing`,
      });
      res.json({ url: s.url });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // ── PayMongo checkout (dynamic PHP amount based on live USD rate) ──
  app.post("/api/paymongo/checkout", requireAuth, async (req, res) => {
    const b = z.object({ plan: z.string() }).safeParse(req.body);
    const user = storage.getUserById(req.session.userId!);
    const KEY = process.env.PAYMONGO_SECRET_KEY || "";
    try {
      const planKey = b.data?.plan || "accounting-bundle";
      const usdPriceCents = PRICES[planKey]?.amount || PRICES["accounting-bundle"].amount;
      const usdPrice = usdPriceCents / 100; // e.g., 2500 → $25.00

      // Fetch live USD/PHP rate
      let phpAmountCentavos: number;
      let rateUsed: number;
      try {
        const rateRes = await fetch("https://open.er-api.com/v6/latest/USD");
        const rateData = await rateRes.json();
        const liveRate = rateData?.rates?.PHP;
        if (liveRate && typeof liveRate === "number") {
          rateUsed = liveRate;
          phpAmountCentavos = Math.round(usdPrice * liveRate * 100);
        } else {
          throw new Error("Invalid rate response");
        }
      } catch (rateErr) {
        console.warn("Failed to fetch live rate, falling back to hardcoded rate (58 PHP/USD)");
        rateUsed = 58;
        phpAmountCentavos = Math.round(usdPrice * 58 * 100);
      }

      const priceInfo = {
        amount: phpAmountCentavos,
        label: PRICES[planKey].label,
      };

      const auth = `Basic ${Buffer.from(KEY + ":").toString("base64")}`;
      const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": auth },
        body: JSON.stringify({
          data: {
            attributes: {
              billing: { email: user!.email, name: user!.displayName },
              send_email_receipt: true,
              show_description: true,
              show_line_items: true,
              cancel_url: `${APP_URL}/#/pricing`,
              success_url: `${APP_URL}/#/purchase-success`,
              description: priceInfo.label,
              payment_method_types: ["qrph", "gcash", "paymaya", "card"],
              line_items: [
                {
                  currency: "PHP",
                  amount: priceInfo.amount,
                  name: priceInfo.label,
                  quantity: 1,
                },
              ],
              metadata: {
                level: planKey,
                email: user!.email,
                usd_rate: rateUsed.toString(),
                usd_amount: usdPrice.toString(),
              },
            },
          },
        }),
      });

      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].detail);
      res.json({ url: data.data.attributes.checkout_url });
    } catch (err: any) {
      console.error("PayMongo checkout error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── API Settings ──────────────────────────────────────────
  app.get("/api/settings", requireAuth, (req, res) => {
    const s = storage.getApiSettings(req.session.userId!);
    res.json(s || {});
  });

  app.post("/api/settings", requireAuth, (req, res) => {
    try {
      const { provider = "openai", apiKey = "", baseUrl = "", model = "" } = req.body;
      storage.saveApiSettings(req.session.userId!, provider, apiKey, baseUrl || req.body.baseURL || "", model);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to save settings." });
    }
  });

  app.delete("/api/settings", requireAuth, (req, res) => {
    try {
      storage.deleteApiSettings(req.session.userId!);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to remove API key." });
    }
  });

  app.post("/api/settings/test", requireAuth, async (req, res) => {
    try {
      const { apiKey = "", baseUrl = "", model = "", customPrompt } = req.body;
      let testApiKey = apiKey;
      let testBaseUrl = baseUrl || req.body.baseURL || "";
      let testModel = model;
      if (!testApiKey) {
        const saved = storage.getApiSettings(req.session.userId!);
        if (!saved?.apiKey) throw new Error("No API key provided or saved.");
        testApiKey = saved.apiKey;
        testBaseUrl = saved.baseUrl || "";
        testModel = saved.model || "";
      }
      if (!testModel && testBaseUrl.includes("deepseek")) testModel = "deepseek-chat";
      const client = new OpenAI({ apiKey: testApiKey, baseURL: testBaseUrl || undefined });
      const response = await client.chat.completions.create({
        model: testModel || "gpt-3.5-turbo",
        messages: [{ role: "user", content: customPrompt || "Ping" }],
        max_tokens: customPrompt ? 4000 : 5,
      });
      res.json({ success: true, message: "Connection successful", response: response.choices[0]?.message?.content || "" });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // ── Chat ──────────────────────────────────────────────────
  app.post("/api/chat", requireAuth, async (req, res) => {
    const s = storage.getApiSettings(req.session.userId!);
    if (!s?.apiKey) return res.status(400).json({ error: "No API key" });
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    try {
      let messages = req.body.messages || [];
      const dayContext = req.body.dayContext || "You are a helpful accounting AI assistant.";
      if (messages.length === 0 && req.body.prompt) messages = [{ role: "user", content: req.body.prompt }];
      let finalModel = s.model || "gpt-3.5-turbo";
      if (!s.model && (s.baseUrl || "").includes("deepseek")) finalModel = "deepseek-chat";
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

  // ── Progress — string day IDs: "L1-1", "L2-7" ────────────
  app.get("/api/progress", requireAuth, (req, res) => {
    res.json(storage.getAllProgress(req.session.userId!));
  });

  // Handles "L1-7", "L2-14"
  app.post("/api/progress/:level-:day", requireAuth, (req, res) => {
    const b = z.object({ completed: z.boolean() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    const dayId = `${req.params.level}-${req.params.day}`;
    res.json(storage.setDayComplete(req.session.userId!, dayId, b.data.completed));
  });

  // Fallback for any single-segment param
  app.post("/api/progress/:dayParam", requireAuth, (req, res) => {
    const b = z.object({ completed: z.boolean() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    res.json(storage.setDayComplete(req.session.userId!, req.params.dayParam, b.data.completed));
  });

  // ── Admin ─────────────────────────────────────────────────
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

  app.post("/api/admin/reset-password", requireAuth, (req, res) => {
    const admin = storage.getUserById(req.session.userId!);
    if (!admin || !storage.isAdmin(admin.email)) return res.status(403).json({ error: "Admin only" });
    const b = z.object({ email: z.string().email(), newPassword: z.string().min(6) }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    const ok = storage.resetUserPassword(b.data.email, b.data.newPassword);
    if (!ok) return res.status(404).json({ error: "User not found" });
    res.json({ ok: true });
  });

  app.post("/api/admin/remove-user", requireAuth, (req, res) => {
    const admin = storage.getUserById(req.session.userId!);
    if (!admin || !storage.isAdmin(admin.email)) return res.status(403).json({ error: "Admin only" });
    const b = z.object({ email: z.string().email() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    if (b.data.email.toLowerCase() === admin.email.toLowerCase()) {
      return res.status(400).json({ error: "You cannot delete your own account." });
    }
    storage.deleteUser(b.data.email);
    res.json({ ok: true });
  });

  // ── Reviews ───────────────────────────────────────────────
  app.get("/api/reviews", (req, res) => {
    try { res.json(storage.getApprovedReviews()); }
    catch { res.status(500).json({ error: "Failed to fetch reviews" }); }
  });

  app.post("/api/reviews/submit", (req, res) => {
    const b = z.object({ name: z.string().min(1), email: z.string().email(), review: z.string().min(1), rating: z.number().int().min(1).max(5) }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    try {
      const saved = storage.submitReview(b.data.name, b.data.email, b.data.review, b.data.rating);
      res.json({ ok: true, id: saved.id });
    } catch { res.status(500).json({ error: "Failed to save review" }); }
  });

  app.get("/api/admin/reviews", requireAuth, (req, res) => {
    const user = storage.getUserById(req.session.userId!);
    if (!user || !storage.isAdmin(user.email)) return res.status(403).json({ error: "Admin only" });
    res.json(storage.getAllReviews());
  });

  app.post("/api/admin/reviews/approve", requireAuth, (req, res) => {
    const user = storage.getUserById(req.session.userId!);
    if (!user || !storage.isAdmin(user.email)) return res.status(403).json({ error: "Admin only" });
    const b = z.object({ id: z.number().int() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    const ok = storage.approveReview(b.data.id);
    if (!ok) return res.status(404).json({ error: "Review not found" });
    res.json({ ok: true });
  });

  app.post("/api/admin/reviews/delete", requireAuth, (req, res) => {
    const user = storage.getUserById(req.session.userId!);
    if (!user || !storage.isAdmin(user.email)) return res.status(403).json({ error: "Admin only" });
    const b = z.object({ id: z.number().int() }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input" });
    const ok = storage.deleteReview(b.data.id);
    if (!ok) return res.status(404).json({ error: "Review not found" });
    res.json({ ok: true });
  });

  // ── Licenses ──────────────────────────────────────────────
  app.get("/api/licenses", requireAuth, (req, res) => {
    const user = storage.getUserById(req.session.userId!);
    if (!user) return res.status(401).json({ error: "Not logged in" });
    res.json({ licensedLevels: storage.getLicensedLevels(user.email) });
  });

  // ========== CONTACT FORM (Resend) ==========
  // ⚠️  Requires RESEND_API_KEY in Railway environment variables
  app.post("/api/contact", async (req, res) => {
    const b = z.object({
      name:    z.string().min(1).max(100),
      email:   z.string().email(),
      message: z.string().min(1).max(5000),
    }).safeParse(req.body);
    if (!b.success) return res.status(400).json({ error: "Invalid input. Please fill in all fields." });

    const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY env var");
      return res.status(500).json({ error: "Server email config missing. Please email support@aisprint.app directly." });
    }
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from:     "AI Sprint Accounting <noreply@aisprint.app>",
          to:       ["support@aisprint.app"],
          reply_to: b.data.email,
          subject:  `[Accounting Course] Message from ${b.data.name}`,
          html: `<h2>New Contact Form — Accounting Course</h2>
            <p><strong>Name:</strong> ${b.data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${b.data.email}">${b.data.email}</a></p>
            <hr/>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap">${b.data.message}</p>
            <hr/>
            <p style="color:#888;font-size:12px">Sent via Accounting course contact form · aisprint.app</p>`,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Resend error:", data);
        return res.status(500).json({ error: "Failed to send. Please email support@aisprint.app directly." });
      }
      res.json({ ok: true });
    } catch (err: any) {
      console.error("Contact route error:", err);
      res.status(500).json({ error: "Network error. Please email support@aisprint.app directly." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}