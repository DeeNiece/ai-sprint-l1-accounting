import { useState, useEffect } from "react";
import { Loader2, Beaker, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface PromptLabProps {
  dayTitle: string;
  badExample: string;
  goodExample: string;
}

export default function PromptLab({ dayTitle, badExample, goodExample }: PromptLabProps) {
  const [results, setResults] = useState<{ a: string; b: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✨ NEW: Reset results and errors whenever the day changes
  useEffect(() => {
    setResults(null);
    setError(null);
  }, [dayTitle]);

  async function runComparison() {
    setLoading(true);
    setError(null);
    try {
      const [resA, resB] = await Promise.all([
        fetch("/api/settings/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ useSaved: true, customPrompt: badExample }),
        }),
        fetch("/api/settings/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ useSaved: true, customPrompt: goodExample }),
        })
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();

      if (!dataA.success || !dataB.success) {
        throw new Error(dataA.error || dataB.error || "API Key missing or invalid");
      }

      setResults({ a: dataA.response, b: dataB.response });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="day-section prompt-lab-container" style={{ margin: '2rem 0', padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
          <Beaker size={18} className="text-primary" /> Prompt Lab: {dayTitle}
        </h3>
        <button 
          onClick={runComparison} 
          disabled={loading}
          style={{ background: 'hsl(var(--primary))', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
        >
          {loading ? <Loader2 size={14} className="spin" /> : <Zap size={14} />}
          {loading ? "Running..." : "Compare Results"}
        </button>
      </div>

      {/* Added the API key notice here */}
      <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#888', marginBottom: '1.5rem', marginTop: 0, lineHeight: '1.4' }}>
        *If you don’t have (or don’t want to use) an API key, you can still run these examples by copy and pasting each sample prompt into your preferred AI chat tool and comparing the results there."
      </p>

      {error && (
        <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={14} /> {error}. Check your API Key in Settings.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {/* Bad Side */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>The "Lazy" Prompt</div>
          <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>"{badExample}"</div>
          {results && <div style={{ fontSize: '0.85rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', borderLeft: '3px solid #ef4444' }}>{results.a}</div>}
        </div>

        {/* Good Side */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>The AI Sprint Prompt</div>
          <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>"{goodExample}"</div>
          {results && <div style={{ fontSize: '0.85rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', borderLeft: '3px solid #22c55e' }}>{results.b}</div>}
        </div>
      </div>

      {results && (
        <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={14} /> Notice how context and structure changed the output quality!
        </div>
      )}
    </div>
  );
}
