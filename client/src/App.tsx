import { useEffect } from "react";
import { Router, Switch, Route, Redirect } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { LanguageProvider } from "@/i18n";

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

function hasBasic(user: any) {
  const levels = user?.licensedLevels || [];
  return levels.includes("accounting-basic") || levels.includes("accounting-bundle");
}

function hasAdvanced(user: any) {
  const levels = user?.licensedLevels || [];
  return levels.includes("accounting-advanced") || levels.includes("accounting-bundle");
}

function hasAnyLevel(user: any) {
  return hasBasic(user) || hasAdvanced(user);
}

function ProtectedRoute({ children, requiresLevel }: { children: React.ReactNode; requiresLevel?: "basic" | "advanced" | "any" }) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/auth" />;
  if (requiresLevel === "basic"    && !hasBasic(user))    return <Redirect to="/pricing" />;
  if (requiresLevel === "advanced" && !hasAdvanced(user)) return <Redirect to="/pricing" />;
  if (requiresLevel === "any"      && !hasAnyLevel(user)) return <Redirect to="/pricing" />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleUnload = () => { localStorage.clear(); sessionStorage.clear(); };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  if (loading) return <div style={{ background: "#0a0a0c", height: "100vh" }} />;

  return (
    <LanguageProvider isLoggedIn={!!user}>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/">
            {!user ? <LandingPage /> : hasAnyLevel(user) ? <HomePage /> : <Redirect to="/pricing" />}
          </Route>
          <Route path="/systems"><ProtectedRoute requiresLevel="any"><SystemsPage /></ProtectedRoute></Route>
          <Route path="/portfolio"><ProtectedRoute requiresLevel="any"><PortfolioPage /></ProtectedRoute></Route>
          <Route path="/toolkit"><ProtectedRoute requiresLevel="any"><ToolkitPage /></ProtectedRoute></Route>
          <Route path="/services"><ProtectedRoute requiresLevel="any"><ServicesPage /></ProtectedRoute></Route>
          <Route path="/day/:dayParam"><ProtectedRoute requiresLevel="any"><DayPage /></ProtectedRoute></Route>
          <Route path="/settings"><ProtectedRoute><SettingsPage /></ProtectedRoute></Route>
          <Route path="/settings/password"><ProtectedRoute><PasswordPage /></ProtectedRoute></Route>
          <Route path="/admin">
            {user?.isAdmin ? <AdminPage /> : <div style={{ color: "white", padding: "100px", textAlign: "center" }}><h1>403</h1><p>Admin Required</p></div>}
          </Route>
          <Route><div style={{ color: "white", padding: "100px", textAlign: "center" }}><h1>404</h1><p>Page Not Found</p></div></Route>
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
