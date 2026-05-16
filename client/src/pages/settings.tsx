// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: settings.tsx  |  Repo: accounting
// Last updated: May 2026
//
// Full dark/light mode support – adapts all colours dynamically.
// Uses useTheme() from theme-provider to detect the current theme.

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/i18n";
import Nav from "@/components/nav";
import { Key, Trash2, TestTube2, CheckCircle2, XCircle, Loader2, ChevronDown, Info, Activity } from "lucide-react";

const PROVIDERS = [
  { id: "deepseek", name: "DeepSeek", baseUrl: "https://api.deepseek.com", model: "deepseek-chat", signupUrl: "https://platform.deepseek.com", note: "Works in Hong Kong. Very affordable." },
  { id: "mistral", name: "Mistral AI", baseUrl: "https://api.mistral.ai/v1", model: "mistral-small-latest", signupUrl: "https://console.mistral.ai", note: "EU-based. Works in Hong Kong." },
  { id: "openai", name: "OpenAI", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini", signupUrl: "https://platform.openai.com", note: "Blocked in some regions (HK, China)." },
  { id: "groq", name: "Groq", baseUrl: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile", signupUrl: "https://console.groq.com", note: "Free tier available. Very fast." },
  { id: "custom", name: "Custom (OpenAI-compatible)", baseUrl: "", model: "", signupUrl: "", note: "Any API that uses the OpenAI format." },
];

interface SavedSettings {
  provider: string;
  apiKeyPreview: string;
  baseUrl: string;
  model: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const [saved, setSaved] = useState<SavedSettings | null>(null);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const [providerId, setProviderId] = useState("deepseek");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState(PROVIDERS[0].baseUrl);
  const [model, setModel] = useState(PROVIDERS[0].model);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Theme‑aware colour variables
  const textPrimary  = isDark ? "#e2e8f0" : "#1a1a2e";
  const textMuted    = isDark ? "#94a3b8" : "#4a5568";
  const bgCard       = isDark ? "#1e293b" : "#ffffff";
  const borderColor  = isDark ? "#334155" : "#e2e8f0";
  const inputBg      = isDark ? "#0f172a" : "#f8fafc";
  const inputBorder  = isDark ? "#334155" : "#cbd5e1";
  const inputText    = isDark ? "#f1f5f9" : "#0f172a";
  const btnBgStripe  = isDark ? "#0d7c8a" : "#0d7c8a";
  const btnBgRemove  = isDark ? "rgba(220,38,38,0.15)" : "rgba(220,38,38,0.1)";
  const btnTextRemove = isDark ? "#f87171" : "#dc2626";
  const providerBgActive = isDark ? "rgba(13,124,138,0.15)" : "rgba(13,124,138,0.08)";

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { setSaved(data); setLoadingSaved(false); })
      .catch(() => setLoadingSaved(false));
  }, []);

  async function handleCheckHealth() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useSaved: true }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ success: true, message: "Connection Healthy: " + data.response });
      } else {
        setTestResult({ success: false, message: data.error || "Connection failed" });
      }
    } catch {
      setTestResult({ success: false, message: t("settings.networkError") });
    }
    setTesting(false);
  }

  function selectProvider(id: string) {
    setProviderId(id);
    setTestResult(null);
    setError(null);
    const p = PROVIDERS.find((p) => p.id === id);
    if (p && id !== "custom") {
      setBaseUrl(p.baseUrl);
      setModel(p.model);
    }
  }

  async function handleTest() {
    if (!apiKey.trim()) { setError(t("settings.enterKey")); return; }
    setTesting(true);
    setTestResult(null);
    setError(null);
    try {
      const res = await fetch("/api/settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, baseUrl, model }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ success: true, message: t("settings.testSuccess", { response: data.response }) });
      } else {
        setTestResult({ success: false, message: data.error || t("settings.testFailed") });
      }
    } catch {
      setTestResult({ success: false, message: t("settings.networkError") });
    }
    setTesting(false);
  }

  async function handleSave() {
    if (!apiKey.trim()) { setError(t("settings.enterKey")); return; }
    if (!baseUrl.trim() || !model.trim()) { setError(t("settings.fillAll")); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: providerId, apiKey, baseUrl, model }),
      });
      if (!res.ok) { setError(t("settings.saveFailed")); setSaving(false); return; }
      const data = await res.json();
      setSaved(data);
      setApiKey("");
    } catch {
      setError(t("settings.networkError"));
    }
    setSaving(false);
  }

  async function handleRemove() {
    if (!confirm(t("settings.removeConfirm"))) return;
    try {
      const res = await fetch("/api/settings", { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to remove API key. Please try again.");
        return;
      }
      setSaved(null);
      setTestResult(null);
      setApiKey("");
      setError(null);
    } catch {
      setError("Network error. Please try again.");
    }
  }

  const selectedProvider = PROVIDERS.find((p) => p.id === providerId)!;

  return (
    <div className="page-wrap" style={{ background: isDark ? "#0a0a0c" : "#f8fafc", minHeight: "100vh" }}>
      <Nav />
      <main className="settings-page" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>

        <div className="settings-header" style={{ marginBottom: "32px" }}>
          <h1 className="settings-title" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.8rem", marginBottom: "16px", color: textPrimary }}>
            <Key size={24} style={{ color: "#0d7c8a" }} /> {t("settings.title")}
          </h1>
          <div style={{ color: textMuted, lineHeight: "1.6" }}>
            <p>To use the AI Coach chat and Prompt Labs in each lesson, you need your own API key. Each user provides and manages their own key — you're in full control.</p>
            <br />
            <p style={{ fontStyle: "italic", opacity: 0.85 }}>
              A typical conversation with the AI Coach (back-and-forth messages) costs about $0.001 — that's one-tenth of a cent. Even $2 of credit could last you through the entire 28-day course with heavy usage.
            </p>
            <br />
            <p style={{ fontStyle: "italic", opacity: 0.85 }}>
              *If you don't have (or don't want to use) an API key, you can still run these examples by copy and pasting each sample prompt into your preferred AI chat tool and comparing the results there.
            </p>
          </div>
        </div>

        {loadingSaved ? (
          <div style={{ background: bgCard, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
            <Loader2 size={18} className="spin" style={{ color: "#0d7c8a" }} /> {t("settings.loading")}
          </div>
        ) : saved ? (
          <div style={{ background: bgCard, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <CheckCircle2 size={20} style={{ color: "#0d7c8a", marginTop: "2px" }} />
              <div>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "8px", color: textPrimary }}>{t("settings.keyActive")}</div>
                <div style={{ color: textMuted, fontSize: "0.9rem" }}>
                  {t("settings.provider")}: <strong style={{ color: textPrimary }}>{saved.provider}</strong> · {t("settings.key")}: <code style={{ background: inputBg, padding: "2px 6px", borderRadius: "4px" }}>{saved.apiKeyPreview}</code> · {t("settings.model")}: <code style={{ background: inputBg, padding: "2px 6px", borderRadius: "4px" }}>{saved.model}</code>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button
                onClick={handleCheckHealth}
                disabled={testing}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "6px", fontSize: "0.9rem", background: inputBg, border: `1px solid ${borderColor}`, cursor: "pointer", color: "#0d7c8a" }}
              >
                {testing ? <Loader2 size={14} className="spin" /> : <Activity size={14} />}
                Check Health
              </button>
              <button
                onClick={handleRemove}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "6px", fontSize: "0.9rem", background: btnBgRemove, border: "none", color: btnTextRemove, cursor: "pointer" }}
              >
                <Trash2 size={14} /> {t("settings.removeKey")}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: bgCard, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "24px", marginBottom: "24px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <Info size={20} style={{ color: textMuted, marginTop: "2px" }} />
            <div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "8px", color: textPrimary }}>{t("settings.noKey")}</div>
              <div style={{ color: textMuted }}>{t("settings.noKeyDesc")}</div>
            </div>
          </div>
        )}

        <div style={{ background: bgCard, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "20px", color: textPrimary }}>
            {saved ? t("settings.changeKey") : t("settings.setupKey")}
          </h2>

          <div className="settings-field" style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "12px", color: textMuted, fontWeight: 500 }}>Choose a provider</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProvider(p.id)}
                  style={{
                    border: providerId === p.id ? `1px solid #0d7c8a` : `1px solid ${borderColor}`,
                    background: providerId === p.id ? providerBgActive : (isDark ? "#0f172a" : "#f8fafc"),
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: textPrimary,
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{p.name}</div>
                  {p.note && <div style={{ fontSize: "0.8rem", color: textMuted, lineHeight: "1.4" }}>{t(`settings.${p.id}Note`)}</div>}
                </button>
              ))}
            </div>
          </div>

          {selectedProvider.signupUrl && (
            <div className="provider-signup" style={{ marginBottom: "24px", fontSize: "0.9rem", color: textMuted }}>
              {t("settings.noKeyYet")} <a href={selectedProvider.signupUrl} target="_blank" rel="noopener" style={{ color: "#0d7c8a", textDecoration: "none", fontWeight: "bold" }}>
                {t("settings.signupAt", { name: selectedProvider.name })} →
              </a>
            </div>
          )}

          <div className="settings-field" style={{ marginBottom: "20px" }}>
            <label htmlFor="apiKey" style={{ display: "block", color: textMuted, fontWeight: 500 }}>{t("settings.apiKeyLabel")}</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
              placeholder="sk-..."
              style={{ width: "100%", padding: "12px", borderRadius: "8px", background: inputBg, border: `1px solid ${inputBorder}`, color: inputText, marginTop: "8px", outline: "none" }}
            />
          </div>

          {(providerId === "custom" || showAdvanced) ? (
            <>
              <div className="settings-field" style={{ marginBottom: "20px" }}>
                <label htmlFor="baseUrl" style={{ display: "block", color: textMuted, fontWeight: 500 }}>{t("settings.baseUrlLabel")}</label>
                <input
                  id="baseUrl"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.example.com/v1"
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", background: inputBg, border: `1px solid ${inputBorder}`, color: inputText, marginTop: "8px", outline: "none" }}
                />
              </div>
              <div className="settings-field" style={{ marginBottom: "24px" }}>
                <label htmlFor="model" style={{ display: "block", color: textMuted, fontWeight: 500 }}>{t("settings.modelLabel")}</label>
                <input
                  id="model"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="model-name"
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", background: inputBg, border: `1px solid ${inputBorder}`, color: inputText, marginTop: "8px", outline: "none" }}
                />
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowAdvanced(true)}
              style={{ background: "none", border: "none", color: textMuted, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", padding: 0, marginBottom: "24px" }}
            >
              <ChevronDown size={14} /> {t("settings.showAdvanced")}
            </button>
          )}

          {testResult && (
            <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", background: testResult.success ? "rgba(47,184,122,0.1)" : "rgba(239,68,68,0.1)", border: testResult.success ? "1px solid #2fb87a" : "1px solid #ef4444", color: testResult.success ? "#2fb87a" : "#ef4444", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
              {testResult.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {testResult.message}
            </div>
          )}

          {error && (
            <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", color: "#ef4444", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
              <XCircle size={14} /> {error}
            </div>
          )}

          <div className="settings-actions" style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleTest}
              disabled={testing || !apiKey.trim()}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: inputBg, border: `1px solid ${borderColor}`, color: textPrimary, cursor: (testing || !apiKey.trim()) ? "not-allowed" : "pointer", opacity: (testing || !apiKey.trim()) ? 0.5 : 1 }}
            >
              {testing ? <><Loader2 size={14} className="spin" /> {t("settings.testing")}</> : <><TestTube2 size={14} /> {t("settings.testConnection")}</>}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !apiKey.trim()}
              style={{ padding: "10px 24px", borderRadius: "8px", background: btnBgStripe, border: "none", color: "white", fontWeight: "bold", cursor: (saving || !apiKey.trim()) ? "not-allowed" : "pointer", opacity: (saving || !apiKey.trim()) ? 0.5 : 1 }}
            >
              {saving ? t("settings.saving") : t("settings.saveKey")}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}