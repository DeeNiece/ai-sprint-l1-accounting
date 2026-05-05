import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
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
  const { t } = useLanguage();
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
        setTestResult({ success: true, message: "L1 Connection Healthy: " + data.response });
      } else {
        setTestResult({ success: false, message: data.error || "L1 Connection failed" });
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
    // No inline background — body already uses var(--color-bg) from index.css, which is theme-aware
    <div className="page-wrap">
      <Nav />
      <main className="settings-page">

        <div className="settings-header">
          <h1 className="settings-title">
            <Key size={24} /> {t("settings.title")} · Level 1
          </h1>
          <p className="settings-desc">
            To use the AI Coach chat and Prompt Labs in each lesson, you need your own API key. Each user provides and manages their own key — you're in full control.
            <br /><br />
            <span style={{ fontStyle: 'italic', opacity: 0.85 }}>
              A typical conversation with the AI Coach (back-and-forth messages) costs about $0.001 — that's one-tenth of a cent. Even $2 of credit could last you through the entire 28-day course with heavy usage.
            </span>
            <br /><br />
            <span style={{ fontStyle: 'italic', opacity: 0.85 }}>
              *If you don't have (or don't want to use) an API key, you can still run these examples by copy and pasting each sample prompt into your preferred AI chat tool and comparing the results there.
            </span>
          </p>
        </div>

        {loadingSaved ? (
          <div className="settings-card">
            <Loader2 size={18} className="spin" /> {t("settings.loading")}
          </div>
        ) : saved ? (
          <div className="settings-card">
            <div className="saved-status">
              <CheckCircle2 size={20} className="text-green" style={{ marginTop: '2px' }} />
              <div>
                <div className="saved-title">{t("settings.keyActive")}</div>
                <div className="saved-detail">
                  {t("settings.provider")}: <strong>{saved.provider}</strong> · {t("settings.key")}: <code>{saved.apiKeyPreview}</code> · {t("settings.model")}: <code>{saved.model}</code>
                </div>
              </div>
            </div>
            <div className="saved-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={handleCheckHealth}
                disabled={testing}
                className="test-btn"
              >
                {testing ? <Loader2 size={14} className="spin" /> : <Activity size={14} />}
                Check Health
              </button>
              <button onClick={handleRemove} className="remove-btn">
                <Trash2 size={14} /> {t("settings.removeKey")}
              </button>
            </div>
          </div>
        ) : (
          <div className="settings-card no-key-card">
            <Info size={20} style={{ marginTop: '2px' }} />
            <div>
              <div className="saved-title">{t("settings.noKey")}</div>
              <div className="saved-detail">{t("settings.noKeyDesc")}</div>
            </div>
          </div>
        )}

        <div className="settings-card setup-card">
          <h2 className="setup-heading">
            {saved ? t("settings.changeKey") : t("settings.setupKey")}
          </h2>

          <div className="settings-field">
            <label>{t("settings.chooseProvider")}</label>
            <div className="provider-grid">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  className={`provider-btn ${providerId === p.id ? "active" : ""}`}
                  onClick={() => selectProvider(p.id)}
                >
                  <div className="provider-name">{p.name}</div>
                  {p.note && <div className="provider-note">{t(`settings.${p.id}Note`)}</div>}
                </button>
              ))}
            </div>
          </div>

          {selectedProvider.signupUrl && (
            <div className="provider-signup">
              {t("settings.noKeyYet")} <a href={selectedProvider.signupUrl} target="_blank" rel="noopener">
                {t("settings.signupAt", { name: selectedProvider.name })} →
              </a>
            </div>
          )}

          <div className="settings-field">
            <label htmlFor="apiKey">{t("settings.apiKeyLabel")}</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
              placeholder="sk-..."
              className="settings-input"
            />
          </div>

          {(providerId === "custom" || showAdvanced) ? (
            <>
              <div className="settings-field">
                <label htmlFor="baseUrl">{t("settings.baseUrlLabel")}</label>
                <input
                  id="baseUrl"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className="settings-input"
                />
              </div>
              <div className="settings-field">
                <label htmlFor="model">{t("settings.modelLabel")}</label>
                <input
                  id="model"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="model-name"
                  className="settings-input"
                />
              </div>
            </>
          ) : (
            <button className="advanced-toggle" onClick={() => setShowAdvanced(true)}>
              <ChevronDown size={14} /> {t("settings.showAdvanced")}
            </button>
          )}

          {testResult && (
            <div className={`test-result ${testResult.success ? "success" : "fail"}`}>
              {testResult.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {testResult.message}
            </div>
          )}

          {error && (
            <div className="test-result fail">
              <XCircle size={14} /> {error}
            </div>
          )}

          <div className="settings-actions">
            <button
              onClick={handleTest}
              disabled={testing || !apiKey.trim()}
              className="test-btn"
              style={{ opacity: (testing || !apiKey.trim()) ? 0.5 : 1, cursor: (testing || !apiKey.trim()) ? 'not-allowed' : 'pointer' }}
            >
              {testing ? <><Loader2 size={14} className="spin" /> {t("settings.testing")}</> : <><TestTube2 size={14} /> {t("settings.testConnection")}</>}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !apiKey.trim()}
              className="save-btn"
              style={{ opacity: (saving || !apiKey.trim()) ? 0.5 : 1, cursor: (saving || !apiKey.trim()) ? 'not-allowed' : 'pointer' }}
            >
              {saving ? t("settings.saving") : t("settings.saveKey")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
