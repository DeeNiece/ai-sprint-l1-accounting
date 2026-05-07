import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import Nav from "@/components/nav";
import { useAuth } from "@/components/auth-provider";
import {
  Users,
  DollarSign,
  Download,
  ArrowLeft,
  ShieldAlert,
  KeyRound,
  Gift,
  ShieldCheck,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Star,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

type MemberData = {
  name: string;
  email: string;
  dateJoined: string;
  planPurchased: string;
  amount: string;
};

type ReviewData = {
  id: number;
  name: string;
  email: string;
  review: string;
  rating: number;
  approved: boolean;
  createdAt: string;
};

// ── Reusable card wrapper ──────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--bg-card)", padding: 24, borderRadius: 12, border: "1px solid var(--border)", ...style }}>
      {children}
    </div>
  );
}

// ── Small status banner ────────────────────────────────────────
function StatusMsg({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      marginBottom: 12, padding: "10px 14px", borderRadius: 8,
      background: ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
      color: ok ? "#22c55e" : "#ef4444",
      border: `1px solid ${ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
      fontSize: "0.9rem",
    }}>
      {msg}
    </div>
  );
}

// ── Confirm Delete Modal ───────────────────────────────────────
function ConfirmDeleteModal({
  email,
  onConfirm,
  onCancel,
  loading,
}: {
  email: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "var(--bg-card)", borderRadius: 16, padding: 32,
        maxWidth: 440, width: "100%", border: "1px solid rgba(239,68,68,0.3)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "rgba(239,68,68,0.15)", borderRadius: 10, padding: 10 }}>
            <AlertTriangle size={24} color="#ef4444" />
          </div>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Delete User Account</h2>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.5 }}>
          You are about to permanently delete:
        </p>
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 8, padding: "10px 14px", marginBottom: 16,
          fontWeight: 700, color: "#ef4444", wordBreak: "break-all",
        }}>
          {email}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24, lineHeight: 1.5 }}>
          This will delete their account and all progress data. Their purchase records will be kept for accounting. <strong style={{ color: "var(--text)" }}>This cannot be undone.</strong>
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, padding: "11px", borderRadius: 8,
              border: "1px solid var(--border)", background: "transparent",
              color: "var(--text)", fontWeight: 600, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: "11px", borderRadius: 8, border: "none",
              background: "#ef4444", color: "white", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // ── Reset password state ──
  const [resetEmail, setResetEmail]       = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetMsg, setResetMsg]           = useState<{ text: string; ok: boolean } | null>(null);
  const [resetLoading, setResetLoading]   = useState(false);

  // ── Grant access state ──
  const [grantEmail, setGrantEmail]     = useState("");
  const [grantLevel, setGrantLevel]     = useState("1");
  const [grantMsg, setGrantMsg]         = useState<{ text: string; ok: boolean } | null>(null);
  const [grantLoading, setGrantLoading] = useState(false);

  // ── Designate admin state ──
  const [adminEmail, setAdminEmail]     = useState("");
  const [adminMsg, setAdminMsg]         = useState<{ text: string; ok: boolean } | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  // ── Remove user state ──
  const [deleteTarget, setDeleteTarget]   = useState<string | null>(null); // email pending confirmation
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg]         = useState<{ text: string; ok: boolean } | null>(null);

  // ── Active tab ──
  const [activeTab, setActiveTab] = useState<"users" | "reviews">("users");

  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useQuery<MemberData[]>({
    queryKey: ["/api/admin/dashboard"],
    retry: false,
  });

  // ── Reviews query ──
  const {
    data: allReviews = [],
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useQuery<ReviewData[]>({
    queryKey: ["/api/admin/reviews"],
    retry: false,
  });

  const pendingReviews = allReviews.filter(r => !r.approved);
  const approvedReviews = allReviews.filter(r => r.approved);

  // ── Guard: not logged in ──
  if (!user) {
    return (
      <div className="page-wrap">
        <Nav />
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <ShieldAlert size={64} color="#ef4444" style={{ margin: "0 auto 20px" }} />
          <h2>Not Logged In</h2>
          <p>Please log in to access the admin panel.</p>
          <Link href="/login" className="back-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  // ── Guard: not admin ──
  if (error || (user as any).isAdmin === false) {
    return (
      <div className="page-wrap">
        <Nav />
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <ShieldAlert size={64} color="#ef4444" style={{ margin: "0 auto 20px" }} />
          <h2>Access Denied</h2>
          <p>You do not have admin permissions to view this page.</p>
          <Link href="/" className="back-link">Return to Journey</Link>
        </div>
      </div>
    );
  }

  const totalMembers = members.length;
  const totalRevenue = members.reduce((sum, m) => sum + parseFloat(m.amount.replace("$", "") || "0"), 0);

  // ── Handlers ──────────────────────────────────────────────────
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetMsg(null);
    setResetLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: resetEmail, newPassword: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setResetMsg({ text: data.error || "Reset failed.", ok: false });
      } else {
        setResetMsg({ text: "Password reset successfully.", ok: true });
        setResetEmail(""); setResetPassword("");
      }
    } catch {
      setResetMsg({ text: "Network error. Please try again.", ok: false });
    } finally { setResetLoading(false); }
  }

  async function handleGrantAccess(e: React.FormEvent) {
    e.preventDefault();
    setGrantMsg(null);
    setGrantLoading(true);
    try {
      const res = await fetch("/api/admin/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: grantEmail, level: grantLevel }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setGrantMsg({ text: data.error || "Grant failed.", ok: false });
      } else {
        setGrantMsg({ text: `Free access to Level ${grantLevel} granted to ${grantEmail}.`, ok: true });
        setGrantEmail("");
        refetch();
      }
    } catch {
      setGrantMsg({ text: "Network error. Please try again.", ok: false });
    } finally { setGrantLoading(false); }
  }

  async function handleDesignateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAdminMsg(null);
    setAdminLoading(true);
    try {
      const res = await fetch("/api/admin/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: adminEmail, level: "admin" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setAdminMsg({ text: data.error || "Failed to designate admin.", ok: false });
      } else {
        setAdminMsg({ text: `${adminEmail} has been granted admin access.`, ok: true });
        setAdminEmail("");
      }
    } catch {
      setAdminMsg({ text: "Network error. Please try again.", ok: false });
    } finally { setAdminLoading(false); }
  }

  // ── NEW: Remove user handler ───────────────────────────────────
  async function handleDeleteUser() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteMsg(null);
    try {
      const res = await fetch("/api/admin/remove-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: deleteTarget }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setDeleteMsg({ text: data.error || "Failed to delete user.", ok: false });
        setDeleteTarget(null);
      } else {
        // Close modal first, then refetch so list is fresh when banner shows
        const removed = deleteTarget;
        setDeleteTarget(null);
        await refetch();
        setDeleteMsg({ text: `User ${removed} has been removed.`, ok: true });
      }
    } catch {
      setDeleteMsg({ text: "Network error. Please try again.", ok: false });
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Review handlers ──
  async function handleApproveReview(id: number) {
    try {
      const res = await fetch("/api/admin/reviews/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      if (res.ok) refetchReviews();
    } catch { /* silent */ }
  }

  async function handleDeleteReview(id: number) {
    try {
      const res = await fetch("/api/admin/reviews/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      if (res.ok) refetchReviews();
    } catch { /* silent */ }
  }

  return (
    <div className="page-wrap">
      {/* ── Confirm Delete Modal ── */}
      {deleteTarget && (
        <ConfirmDeleteModal
          email={deleteTarget}
          onConfirm={handleDeleteUser}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      <Nav />
      <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, flexWrap: "wrap", gap: 12 }}>
          <div>
            <Link href="/" className="back-link" style={{ marginBottom: 15, display: "inline-block" }}>
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <h1 style={{ fontSize: "2rem", margin: 0 }}>Admin Control Panel</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.9rem" }}>
              Logged in as <strong style={{ color: "#0d7c8a" }}>{(user as any).email}</strong>
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => refetch()}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontWeight: 600, cursor: "pointer" }}
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <a
              href="/api/admin/export"
              download
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0d7c8a", color: "white", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: "bold" }}
            >
              <Download size={18} /> Export CSV
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", marginBottom: 10 }}>
              <Users size={20} /> <span style={{ fontWeight: 600 }}>Total Members</span>
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{isLoading ? "…" : totalMembers}</div>
          </Card>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", marginBottom: 10 }}>
              <DollarSign size={20} /> <span style={{ fontWeight: 600 }}>Total Revenue</span>
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#22c55e" }}>
              {isLoading ? "…" : `$${totalRevenue.toFixed(2)}`}
            </div>
          </Card>
        </div>

        {/* Action Cards — 3 column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>

          {/* Grant Free Access */}
          <Card>
            <h2 style={{ marginTop: 0, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Gift size={18} color="#22c55e" /> Grant Free Access
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 0, marginBottom: 14 }}>
              Give a user free access to any level.
            </p>
            {grantMsg && <StatusMsg msg={grantMsg.text} ok={grantMsg.ok} />}
            <form onSubmit={handleGrantAccess} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="email" placeholder="User email" value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)} required
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", width: "100%" }}
              />
              <select
                value={grantLevel} onChange={(e) => setGrantLevel(e.target.value)}
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", width: "100%" }}
              >
                <option value="1">Level 1 — Basic</option>
                <option value="2">Level 2 — Advanced</option>
                <option value="3">Level 3 — Master</option>
                <option value="bundle">All Levels Bundle</option>
              </select>
              <button type="submit" disabled={grantLoading}
                style={{ padding: "10px", borderRadius: 8, border: "none", background: "#22c55e", color: "#000", fontWeight: 700, cursor: grantLoading ? "not-allowed" : "pointer" }}>
                {grantLoading ? "Granting…" : "Grant Access"}
              </button>
            </form>
          </Card>

          {/* Reset Password */}
          <Card>
            <h2 style={{ marginTop: 0, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <KeyRound size={18} color="#f59e0b" /> Reset Password
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 0, marginBottom: 14 }}>
              Set a new password for any user account.
            </p>
            {resetMsg && <StatusMsg msg={resetMsg.text} ok={resetMsg.ok} />}
            <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="email" placeholder="User email" value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)} required
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", width: "100%" }}
              />
              <input
                type="password" placeholder="New password (min 6 chars)" value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)} required minLength={6}
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", width: "100%" }}
              />
              <button type="submit" disabled={resetLoading}
                style={{ padding: "10px", borderRadius: 8, border: "none", background: "#f59e0b", color: "#000", fontWeight: 700, cursor: resetLoading ? "not-allowed" : "pointer" }}>
                {resetLoading ? "Resetting…" : "Reset Password"}
              </button>
            </form>
          </Card>

          {/* Designate Admin */}
          <Card>
            <h2 style={{ marginTop: 0, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={18} color="#7c3aed" /> Designate Admin
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 0, marginBottom: 14 }}>
              Grant admin panel access to a user by email.
            </p>
            {adminMsg && <StatusMsg msg={adminMsg.text} ok={adminMsg.ok} />}
            <form onSubmit={handleDesignateAdmin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="email" placeholder="User email" value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)} required
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", width: "100%" }}
              />
              <button type="submit" disabled={adminLoading}
                style={{ padding: "10px", borderRadius: 8, border: "none", background: "#7c3aed", color: "white", fontWeight: 700, cursor: adminLoading ? "not-allowed" : "pointer" }}>
                {adminLoading ? "Saving…" : "Make Admin"}
              </button>
            </form>
          </Card>

        </div>

        {/* ── Tab Switcher ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { key: "users", label: "Registered Users", icon: <Users size={15} /> },
            { key: "reviews", label: `Reviews ${pendingReviews.length > 0 ? `(${pendingReviews.length} pending)` : ""}`, icon: <MessageSquare size={15} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "users" | "reviews")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 18px", borderRadius: 8, fontWeight: 600, fontSize: "0.9rem",
                cursor: "pointer", border: "1px solid var(--border)",
                background: activeTab === tab.key ? "#0d7c8a" : "transparent",
                color: activeTab === tab.key ? "white" : "var(--text)",
                transition: "all 0.15s",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Users Table ── */}
        {activeTab === "users" && (
        <div style={{ background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: 20, borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Registered Users</h2>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{totalMembers} total</span>
          </div>

          {/* ── NEW: delete status message above table ── */}
          {deleteMsg && (
            <div style={{ padding: "0 20px", paddingTop: 16 }}>
              <StatusMsg msg={deleteMsg.text} ok={deleteMsg.ok} />
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.05)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "15px 20px", fontWeight: 600 }}>Name</th>
                  <th style={{ padding: "15px 20px", fontWeight: 600 }}>Email</th>
                  <th style={{ padding: "15px 20px", fontWeight: 600 }}>Date Joined</th>
                  <th style={{ padding: "15px 20px", fontWeight: 600 }}>Plan</th>
                  <th style={{ padding: "15px 20px", fontWeight: 600 }}>Amount</th>
                  {/* ── NEW: Actions column header ── */}
                  <th style={{ padding: "15px 20px", fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} style={{ padding: 30, textAlign: "center" }}>Loading members…</td></tr>
                ) : members.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 30, textAlign: "center" }}>No members found.</td></tr>
                ) : members.map((m, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "15px 20px", fontWeight: 500 }}>{m.name}</td>
                    <td style={{ padding: "15px 20px", color: "var(--text-muted)" }}>{m.email}</td>
                    <td style={{ padding: "15px 20px" }}>{m.dateJoined}</td>
                    <td style={{ padding: "15px 20px" }}>
                      <span style={{ background: "var(--bg)", padding: "4px 10px", borderRadius: 20, fontSize: "0.85rem" }}>{m.planPurchased}</span>
                    </td>
                    <td style={{ padding: "15px 20px", color: "#22c55e", fontWeight: 600 }}>{m.amount}</td>

                    {/* ── NEW: Delete button per row ── */}
                    <td style={{ padding: "15px 20px" }}>
                      <button
                        onClick={() => { setDeleteMsg(null); setDeleteTarget(m.email); }}
                        title={`Delete ${m.email}`}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "6px 12px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)",
                          background: "rgba(239,68,68,0.08)", color: "#ef4444",
                          fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* ── Reviews Panel ── */}
        {activeTab === "reviews" && (
          <div>
            {/* Pending Reviews */}
            <div style={{ background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: 20, borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={18} color="#f59e0b" /> Pending Approval
                </h2>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{pendingReviews.length} pending</span>
              </div>
              {reviewsLoading ? (
                <div style={{ padding: 30, textAlign: "center" }}>Loading reviews…</div>
              ) : pendingReviews.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "var(--text-muted)" }}>No pending reviews — you're all caught up!</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {pendingReviews.map((r) => (
                    <div key={r.id} style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontWeight: 700 }}>{r.name}</span>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{r.email}</span>
                            <div style={{ display: "flex", gap: 2 }}>
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < r.rating ? "#f59e0b" : "transparent"} color={i < r.rating ? "#f59e0b" : "#555"} />
                              ))}
                            </div>
                          </div>
                          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>"{r.review}"</p>
                          <div style={{ fontSize: "0.75rem", color: "#555", marginTop: 6 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button
                            onClick={() => handleApproveReview(r.id)}
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#22c55e", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
                          >
                            <CheckCircle2 size={13} /> Approve
                          </button>
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Reviews */}
            <div style={{ background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
              <div style={{ padding: 20, borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle2 size={18} color="#22c55e" /> Approved & Live
                </h2>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{approvedReviews.length} published</span>
              </div>
              {approvedReviews.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "var(--text-muted)" }}>No approved reviews yet.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {approvedReviews.map((r) => (
                    <div key={r.id} style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontWeight: 700 }}>{r.name}</span>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{r.email}</span>
                            <div style={{ display: "flex", gap: 2 }}>
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < r.rating ? "#f59e0b" : "transparent"} color={i < r.rating ? "#f59e0b" : "#555"} />
                              ))}
                            </div>
                            <span style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.7rem", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>LIVE</span>
                          </div>
                          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>"{r.review}"</p>
                          <div style={{ fontSize: "0.75rem", color: "#555", marginTop: 6 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", flexShrink: 0 }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
