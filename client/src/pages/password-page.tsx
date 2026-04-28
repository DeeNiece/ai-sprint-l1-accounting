import { Link } from "wouter";
import Nav from "@/components/nav";
import { ChevronLeft, KeyRound } from "lucide-react";

export default function PasswordPage() {
  return (
    <div className="page-wrap">
      <Nav />
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
        
        {/* Breadcrumb Back Link */}
        <div style={{ width: '100%', maxWidth: '420px', marginBottom: '1.5rem' }}>
          <Link href="/settings" className="back-link">
            <ChevronLeft size={16} /> Back to Settings
          </Link>
        </div>

        <div className="auth-card" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            {/* Teal Icon background */}
            <div className="why-icon" style={{ width: '40px', height: '40px', marginBottom: 0, background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <KeyRound size={20} />
            </div>
            <h2 className="auth-heading" style={{ marginBottom: 0 }}>Change Password</h2>
          </div>
          
          <p className="auth-subtext">
            Your password has expired; please choose a new password for Level 1.
          </p>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-field">
              <label>Old Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <div style={{ margin: '1.25rem 0', padding: '0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-divider)' }}>
               <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.5', margin: 0 }}>
                 <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Requirement:</span> Your password must be at least 6 characters and cannot contain spaces.
               </p>
            </div>

            <div className="auth-field">
              <label>New Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <div className="auth-field" style={{ marginTop: '1rem' }}>
              <label>Confirm New Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            {/* Teal Button */}
            <button 
              type="submit" 
              className="auth-submit" 
              style={{ 
                marginTop: '1.5rem', 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '8px',
                background: 'var(--color-primary)' 
              }}
            >
              Set New Password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
