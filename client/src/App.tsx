// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: App.tsx | Repo: accounting
// Last updated: May 2026
//
// PRICING UPDATE: Single $59 price — hasAccess() replaces hasBasic/hasAdvanced/hasAnyLevel
// Legal pages are inline components (no Nav) to avoid useAuth/AuthProvider errors.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { Router, Switch, Route, Redirect } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { LanguageProvider } from "@/i18n";
import { ScrollToTop } from "@/components/ScrollToTop";

import AuthPage from "@/pages/auth";
import HomePage from "@/pages/home";
import LandingPage from "@/pages/landing";
import DayPage from "@/pages/day";
import ToolkitPage from "@/pages/toolkit";
import PortfolioPage from "@/pages/portfolio";
import SettingsPage from "@/pages/settings";
import FAQPage from "@/pages/faq";
import SystemsPage from "@/pages/systems";
import Pricing from "@/pages/pricing";
import PasswordPage from "@/pages/password-page";
import AdminPage from "@/pages/admin";
import ServicesPage from "@/pages/services";

// ── Legal pages — inline to avoid Nav/useAuth dependency issues ───────────────
// These pages are public routes. Using <Nav /> here would call useAuth()
// which requires AuthProvider context and causes a crash on public routes.
function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem", color: "#fff" }}>
      <h1>Privacy Policy</h1>
      <p>Last updated: May 2026</p>
      <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
      <a href="/" style={{ color: "#0d7c8a" }}>← Back to Home</a>
    </div>
  );
}

function TermsOfService() {
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem", color: "#fff" }}>
      <h1>Terms of Service</h1>
      <p>Last updated: May 2026</p>
      <p>By using AI Sprint, you agree to these terms. Please read them carefully.</p>
      <a href="/" style={{ color: "#0d7c8a" }}>← Back to Home</a>
    </div>
  );
}

function CookieSettings() {
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem", color: "#fff" }}>
      <h1>Cookie Settings</h1>
      <p>We use cookies to enhance your experience. You can control your preferences here.</p>
      <a href="/" style={{ color: "#0d7c8a" }}>← Back to Home</a>
    </div>
  );
}

function Accessibility() {
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem", color: "#fff" }}>
      <h1>Accessibility</h1>
      <p>AI Sprint is committed to making our platform usable by everyone, including people with disabilities.</p>
      <a href="/" style={{ color: "#0d7c8a" }}>← Back to Home</a>
    </div>
  );
}

// ── License helper ────────────────────────────────────────────────────────────
function hasAccess(user: any) {
  const levels = user?.licensedLevels || [];
  return levels.includes("accounting-bundle") ||
         levels.includes("accounting-basic") ||
         levels.includes("accounting-advanced");
}

// ── ProtectedRoute ────────────────────────────────────────────────────────────
function ProtectedRoute({
  children,
  requiresLevel,
}: {
  children: React.ReactNode;
  requiresLevel?: "any" | undefined;
}) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/auth" />;
  if (requiresLevel === "any" && !hasAccess(user)) return <Redirect to="/pricing" />;
  return <>{children}</>;
}

// ── App Routes ────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleUnload = () => {
      localStorage.clear();
      sessionStorage.clear();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  if (loading) return <div style={{ background: "#0a0a0c", height: "100vh" }} />;

  return (
    <LanguageProvider isLoggedIn={!!user}>
      <Router hook={useHashLocation}>
        <ScrollToTop />
        <Switch>
          {/* Public routes */}
          <Route path="/auth"            component={AuthPage} />
          <Route path="/faq"             component={FAQPage} />
          <Route path="/pricing"         component={Pricing} />

          {/* Legal routes — inline components, no Nav */}
          <Route path="/privacy"         component={PrivacyPolicy} />
          <Route path="/terms"           component={TermsOfService} />
          <Route path="/cookies"         component={CookieSettings} />
          <Route path="/cookie-settings" component={CookieSettings} />
          <Route path="/accessibility"   component={Accessibility} />

          {/* Root */}
          <Route path="/">
            {!user
              ? <LandingPage />
              : hasAccess(user)
                ? <HomePage />
                : <Redirect to="/pricing" />
            }
          </Route>

          {/* Protected routes */}
          <Route path="/systems">
            <ProtectedRoute requiresLevel="any"><SystemsPage /></ProtectedRoute>
          </Route>
          <Route path="/portfolio">
            <ProtectedRoute requiresLevel="any"><PortfolioPage /></ProtectedRoute>
          </Route>
          <Route path="/toolkit">
            <ProtectedRoute requiresLevel="any"><ToolkitPage /></ProtectedRoute>
          </Route>
          <Route path="/services">
            <ProtectedRoute requiresLevel="any"><ServicesPage /></ProtectedRoute>
          </Route>
          <Route path="/day/:dayParam">
            <ProtectedRoute requiresLevel="any"><DayPage /></ProtectedRoute>
          </Route>

          {/* Settings — login only */}
          <Route path="/settings">
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          </Route>
          <Route path="/settings/password">
            <ProtectedRoute><PasswordPage /></ProtectedRoute>
          </Route>

          {/* Admin */}
          <Route path="/admin">
            {user?.isAdmin
              ? <AdminPage />
              : <div style={{ color: "white", padding: "100px", textAlign: "center" }}><h1>403</h1><p>Admin Required</p></div>
            }
          </Route>

          {/* 404 */}
          <Route>
            <div style={{ color: "white", padding: "100px", textAlign: "center" }}>
              <h1>404</h1><p>Page Not Found</p>
            </div>
          </Route>
        </Switch>
      </Router>
    </LanguageProvider>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}