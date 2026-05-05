// settings.tsx
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

// Helper to detect dark mode
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(isDarkMode);
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', check);
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', check);
    };
  }, []);
  return isDark;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isDark = useIsDarkMode();

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

  const THEME_COLOR = "#0d7c8a";
  const THEME_BG = "rgba(13, 124, 138, 0.1)";

  // Dynamic styles based on dark mode
  const headingColor = isDark ? "white" : "#1a1a1a";
  const mutedColor = isDark ? "#aaa" : "#555";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const cardBg = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.04)";
  const inputBg = isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)";
  const codeBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${borderColor}`,
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: inputBg,
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    color: headingColor,
    marginTop: '8px'
  };

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
    <div className="page-wrap" style={{ background: isDark ? "radial-gradient(circle at 50% 0%, rgba(13, 124, 138, 0.05) 0%, #0a0a0c 100%)" : "#f5f5f7", minHeight: "100vh" }}>
      <Nav />
      <main className="settings-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        
        <div className="settings-header" style={{ marginBottom: '32px' }}>
          <h1 className="settings-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem', marginBottom: '16px', color: headingColor }}>
            <Key size={24} style={{ color: THEME_COLOR }} /> {t("settings.title")} · Level 1
          </h1>
          <p className="settings-desc" style={{ color: mutedColor, lineHeight: '1.6' }}>
            To use the AI Coach chat and Prompt Labs in each lesson, you need your own API key. Each user provides and manages their own key — you're in full control.
            <br /><br />
            <span style={{ fontStyle: 'italic', opacity: 0.8, fontSize: '0.95em', color: mutedColor }}>
              A typical conversation with the AI Coach (back-and-forth messages) costs about $0.001 — that's one-tenth of a cent. Even $2 of credit could last you through the entire 28-day course with heavy usage.
            </span>
            <br /><br />
            <span style={{ fontStyle: 'italic', opacity: 0.8, fontSize: '0.95em', color: mutedColor }}>
              *If you don’t have (or don’t want to use) an API key, you can still run these examples by copy and pasting each sample prompt into your preferred AI chat tool and comparing the results there.
            </span>
          </p>
        </div>

        {loadingSaved ? (
          <div style={cardStyle}><Loader2 size={18} className="spin" style={{ color: mutedColor }} /> {t("settings.loading")}</div>
        ) : saved ? (
          <div style={cardStyle}>
            <div className="saved-status" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} style={{ color: THEME_COLOR, marginTop: '2px' }} />
              <div>
                <div className="saved-title" style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px', color: headingColor }}>{t("settings.keyActive")}</div>
                <div className="saved-detail" style={{ color: mutedColor, fontSize: '0.9rem' }}>
                  {t("settings.provider")}: <strong style={{ color: headingColor }}>{saved.provider}</strong> · {t("settings.key")}: <code style={{ background: codeBg, padding: '2px 6px', borderRadius: '4px', color: headingColor }}>{saved.apiKeyPreview}</code> · {t("settings.model")}: <code style={{ background: codeBg, padding: '2px 6px', borderRadius: '4px', color: headingColor }}>{saved.model}</code>
                </div>
              </div>
            </div>
            <div className="saved-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                onClick={handleCheckHealth} 
                disabled={testing} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', background: cardBg, border: `1px solid ${borderColor}`, cursor: 'pointer', color: THEME_COLOR }}
              >
                {testing ? <Loader2 size={14} className="spin" /> : <Activity size={14} />} 
                Check Health
              </button>
              <button onClick={handleRemove} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', background: 'transparent', border: isDark ? '1px solid rgba(255,50,50,0.3)' : '1px solid rgba(200,0,0,0.35)', color: isDark ? '#ff6b6b' : '#cc2222', cursor: 'pointer' }}>
                <Trash2 size={14} /> {t("settings.removeKey")}
              </button>
            </div>
          </div>
        ) : (
          <div style={cardStyle}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Info size={20} style={{ color: mutedColor, marginTop: '2px' }} />
              <div>
                <div className="saved-title" style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px', color: headingColor }}>{t("settings.noKey")}</div>
                <div className="saved-detail" style={{ color: mutedColor }}>{t("settings.noKeyDesc")}</div>
              </div>
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <h2 className="setup-heading" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: headingColor }}>
            {saved ? t("settings.changeKey") : t("settings.setupKey")}
          </h2>

          <div className="settings-field" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: mutedColor, fontWeight: 500 }}>Choose a provider</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  style={{
                    border: providerId === p.id ? `1px solid ${THEME_COLOR}` : `1px solid ${borderColor}`,
                    background: providerId === p.id ? THEME_BG : cardBg,
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: headingColor,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => selectProvider(p.id)}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{p.name}</div>
                  {p.note && <div style={{ fontSize: '0.8rem', color: mutedColor, lineHeight: '1.4' }}>{t(`settings.${p.id}Note`, p.note)}</div>}
                </button>
              ))}
            </div>
          </div>

          {selectedProvider.signupUrl && (
            <div className="provider-signup" style={{ marginBottom: '24px', fontSize: '0.9rem', color: mutedColor }}>
              {t("settings.noKeyYet")} <a href={selectedProvider.signupUrl} target="_blank" rel="noopener" style={{ color: THEME_COLOR, textDecoration: 'none', fontWeight: 'bold' }}>
                {t("settings.signupAt", { name: selectedProvider.name })} →
              </a>
            </div>
          )}

          <div className="settings-field" style={{ marginBottom: '20px' }}>
            <label htmlFor="apiKey" style={{ display: 'block', color: mutedColor, fontWeight: 500 }}>{t("settings.apiKeyLabel")}</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
              placeholder="sk-..."
              style={inputStyle}
            />
          </div>

          {(providerId === "custom" || showAdvanced) ? (
            <>
              <div className="settings-field" style={{ marginBottom: '20px' }}>
                <label htmlFor="baseUrl" style={{ display: 'block', color: mutedColor, fontWeight: 500 }}>{t("settings.baseUrlLabel")}</label>
                <input
                  id="baseUrl"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.example.com/v1"
                  style={inputStyle}
                />
              </div>
              <div className="settings-field" style={{ marginBottom: '24px' }}>
                <label htmlFor="model" style={{ display: 'block', color: mutedColor, fontWeight: 500 }}>{t("settings.modelLabel")}</label>
                <input
                  id="model"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="model-name"
                  style={inputStyle}
                />
              </div>
            </>
          ) : (
            <button 
              onClick={() => setShowAdvanced(true)}
              style={{ background: 'none', border: 'none', color: mutedColor, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, marginBottom: '24px' }}
            >
              <ChevronDown size={14} /> {t("settings.showAdvanced")}
            </button>
          )}

          {testResult && (
            <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', background: testResult.success ? 'rgba(47, 184, 122, 0.1)' : 'rgba(255, 107, 107, 0.1)', border: testResult.success ? '1px solid #2fb87a' : '1px solid #ff6b6b', color: testResult.success ? (isDark ? '#2fb87a' : '#1a7a4a') : (isDark ? '#ff6b6b' : '#cc2222'), display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              {testResult.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {testResult.message}
            </div>
          )}

          {error && (
            <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid #ff6b6b', color: isDark ? '#ff6b6b' : '#cc2222', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <XCircle size={16} /> {error}
            </div>
          )}

          <div className="settings-actions" style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleTest} 
              disabled={testing || !apiKey.trim()} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: cardBg, border: `1px solid ${borderColor}`, color: headingColor, cursor: (testing || !apiKey.trim()) ? 'not-allowed' : 'pointer', opacity: (testing || !apiKey.trim()) ? 0.5 : 1 }}
            >
              {testing ? <><Loader2 size={16} className="spin" /> {t("settings.testing")}</> : <><TestTube2 size={16} /> {t("settings.testConnection")}</>}
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving || !apiKey.trim()} 
              style={{ padding: '10px 24px', borderRadius: '8px', background: THEME_COLOR, border: 'none', color: 'white', fontWeight: 'bold', cursor: (saving || !apiKey.trim()) ? 'not-allowed' : 'pointer', opacity: (saving || !apiKey.trim()) ? 0.5 : 1 }}
            >
              {saving ? t("settings.saving") : t("settings.saveKey")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
