import Nav from "@/components/nav";
import { systemsSummary, metricsToTrack } from "@/data/curriculum";
import { Layers, BarChart2, CheckCircle2, Settings } from "lucide-react";

export default function SystemsPage() {
  const THEME_COLOR = "#0d7c8a"; 

  return (
    <div className="page-wrap">
      <Nav />
      <div className="inner-page">
        <div className="inner-page-header" style={{ 
          textAlign: 'center', padding: '3rem 1.5rem', 
          background: 'rgba(13, 124, 138, 0.03)', 
          border: '1px solid rgba(13, 124, 138, 0.1)', 
          borderRadius: '24px', marginBottom: '3rem'
        }}>
          <span className="inner-page-badge" style={{ background: THEME_COLOR, color: 'white', fontWeight: 800 }}>Level 1 Basic</span>
          <h1 className="inner-page-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Foundational Systems</h1>
          <p className="inner-page-desc" style={{ maxWidth: '600px', margin: '1rem auto 0' }}>
            The essential AI-powered workflows and standard operating procedures (SOPs) mastered in the Basic track.
          </p>
        </div>

        <section className="services-section">
          <div className="systems-weeks-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {systemsSummary.map((ws, i) => (
              <div key={i} className="system-week-card" style={{ background: 'rgba(22, 23, 30, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: THEME_COLOR }}>WEEK {ws.week}</span>
                <h3 style={{ color: 'white', marginTop: '4px' }}>{ws.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                  {ws.systems.map((s, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#aaa', marginBottom: '12px' }}>
                      <CheckCircle2 size={14} style={{ color: THEME_COLOR }} /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="services-section" style={{ marginTop: '4rem' }}>
          <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: THEME_COLOR }}><BarChart2 size={20}/> Key Performance Indicators</h2>
            <div className="metrics-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '2rem' }}>
              {metricsToTrack.map((m, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={14} style={{ color: THEME_COLOR }} /> {m.metric}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>{m.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
