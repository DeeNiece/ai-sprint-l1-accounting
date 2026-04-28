import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { queryClient } from "@/lib/queryClient";

interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  licensedLevels: string[]; // ["1", "2", "3"]
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, displayName: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialise state from sessionStorage for "Auto-Logout" on close
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = sessionStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Helper to update both React state and sessionStorage
  const updateAuth = (userData: AuthUser | null) => {
    setUser(userData);
    if (userData) {
      sessionStorage.setItem("auth_user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("auth_user");
    }
  };

  async function fetchMe() {
    try {
      const r = await fetch("/api/auth/me");
      if (r.ok) {
        const data = await r.json();
        updateAuth({ ...data, licensedLevels: data.licensedLevels || [] });
      } else {
        updateAuth(null);
      }
    } catch {
      updateAuth(null);
    }
  }

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string): Promise<string | null> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        return err.error || "Login failed";
      }

      const data = await res.json();
      const levels = data.licensedLevels || [];
      updateAuth({ ...data, licensedLevels: levels });
      queryClient.clear();

      // ✅ FIX: Let App.tsx routing handle where to go after login.
      // The Route for "/" already shows HomePage for logged-in users.
      // No hard redirect needed here — removing it prevents bypassing
      // the ProtectedRoute license checks in App.tsx.
      if (typeof window !== "undefined") {
        window.location.hash = levels.length > 0 ? "" : "/pricing";
      }
      return null;
    } catch {
      return "Network error";
    }
  }

  async function register(email: string, password: string, displayName: string): Promise<string | null> {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });

      if (!res.ok) {
        const err = await res.json();
        return err.error || "Registration failed";
      }

      const data = await res.json();
      const levels = data.licensedLevels || [];
      updateAuth({ ...data, licensedLevels: levels });
      queryClient.clear();

      // ✅ FIX: New users ALWAYS go to /pricing after signup.
      // A brand-new account has no licensedLevels, so the old logic
      // `levels.includes("1") ? "" : "/pricing"` was accidentally
      // sending them to "" (home/Level 1) when levels was [].
      // Now we explicitly send them to /pricing unless they somehow
      // already have a license (e.g. admin-granted before signup).
      if (typeof window !== "undefined") {
        window.location.hash = levels.length > 0 ? "" : "/pricing";
      }
      return null;
    } catch {
      return "Network error";
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      updateAuth(null);
      queryClient.clear();
      // Redirect to landing page immediately upon logout
      if (typeof window !== "undefined") window.location.hash = "/";
    }
  }

  async function refreshUser() {
    await fetchMe();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
