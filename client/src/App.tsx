// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: App.tsx | Repo: accounting
// Last updated: June 2026
// Changes: Day 1 free — /day/L1-1 bypasses license check; unlicensed root redirects to Day 1 not pricing; admin bypass added
//
// PRICING UPDATE: Single $59 price — hasAccess() replaces hasBasic/hasAdvanced/hasAnyLevel
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
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import CookieSettingsPage from "@/pages/cookie-settings";
import AccessibilityPage from "@/pages/accessibility";

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
  if (requiresLevel === "any" && !hasAccess(user) && !user.isAdmin) return <Redirect to="/pricing" />;
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

          {/* Legal routes */}
          <Route path="/privacy"         component={PrivacyPage} />
          <Route path="/terms"           component={TermsPage} />
          <Route path="/cookies"         component={CookieSettingsPage} />
          <Route path="/cookie-settings" component={CookieSettingsPage} />
          <Route path="/accessibility"   component={AccessibilityPage} />

          {/* Root */}
          <Route path="/">
            {!user
              ? <LandingPage />
              : (hasAccess(user) || user.isAdmin)
                ? <HomePage />
                : <Redirect to="/day/L1-1" />
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
            {({ dayParam }: { dayParam?: string }) => {
              // Day 1 (L1-1 or just "1") is free for all logged-in users
              const isDay1 = dayParam === "L1-1" || dayParam === "1";
              if (!user) return <Redirect to="/auth" />;
              if (!isDay1 && !hasAccess(user) && !user.isAdmin) return <Redirect to="/pricing" />;
              return <DayPage />;
            }}
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