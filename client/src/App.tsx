import { useEffect } from "react";
import { Router, Switch, Route, Redirect } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { LanguageProvider } from "@/i18n";

// Page Imports
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

// ✅ NEW: ProtectedRoute checks both login AND license
// - No user → redirect to /auth
// - Has user but no license for required level → redirect to /pricing
// - requiresLevel is optional; omit it for routes that only need login (e.g. settings)
function ProtectedRoute({
  children,
  requiresLevel,
}: {
  children: React.ReactNode;
  requiresLevel?: string;
}) {
  const { user } = useAuth();

  if (!user) return <Redirect to="/auth" />;

  if (requiresLevel && !user.licensedLevels?.includes(requiresLevel)) {
    return <Redirect to="/pricing" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  // 🔒 AUTO-LOGOUT LOGIC: Clear cache only when browser/tab is truly closed (not on refresh)
  useEffect(() => {
    // Mark that a reload is happening BEFORE the page unloads
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isReloading", "true");
    };
    // On actual unload: only clear if it's NOT a reload
    const handleUnload = () => {
      if (!sessionStorage.getItem("isReloading")) {
        localStorage.clear();
        sessionStorage.clear();
      } else {
        // It was a reload — remove the flag so next close works correctly
        sessionStorage.removeItem("isReloading");
      }
    };
    // On page load: clear the reload flag in case it lingered
    sessionStorage.removeItem("isReloading");

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#0a0a0c" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#0d7c8a" }}></div>
      </div>
    );
  }

  return (
    <LanguageProvider isLoggedIn={!!user}>
      <Router hook={useHashLocation}>
        <Switch>
          {/* Public Routes */}
          <Route path="/auth" component={AuthPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/pricing" component={Pricing} />

          {/* ✅ CONDITIONAL ROOT: Landing Page for guests, Home for users */}
          <Route path="/">
            {user ? <HomePage /> : <LandingPage />}
          </Route>

          {/* ✅ FIXED: These routes now require login AND a Level 1 license.
              A new user with no purchase will be redirected to /pricing. */}
          <Route path="/systems">
            <ProtectedRoute requiresLevel="1"><SystemsPage /></ProtectedRoute>
          </Route>
          <Route path="/portfolio">
            <ProtectedRoute requiresLevel="1"><PortfolioPage /></ProtectedRoute>
          </Route>
          <Route path="/toolkit">
            <ProtectedRoute requiresLevel="1"><ToolkitPage /></ProtectedRoute>
          </Route>
          <Route path="/day/:dayNum">
            <ProtectedRoute requiresLevel="1"><DayPage /></ProtectedRoute>
          </Route>

          {/* Settings only require login, not a license */}
          <Route path="/settings">
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          </Route>
          <Route path="/settings/password">
            <ProtectedRoute><PasswordPage /></ProtectedRoute>
          </Route>

          {/* Admin Access Control */}
          <Route path="/admin">
            {user?.isAdmin
              ? <AdminPage />
              : <div style={{ color: "white", padding: "100px", textAlign: "center" }}><h1>403</h1><p>Admin Required</p></div>
            }
          </Route>

          {/* 404 Fallback */}
          <Route>
            <div style={{ color: "white", padding: "100px", textAlign: "center" }}>
              <h1>404</h1>
              <p>Page Not Found</p>
            </div>
          </Route>
        </Switch>
      </Router>
    </LanguageProvider>
  );
}

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
