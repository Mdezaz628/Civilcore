import React, { useState } from 'react';

const demoAccounts = [
  { label: 'Admin', email: 'rahul@structura.in', pass: 'admin123' },
  { label: 'Proj. Manager', email: 'priya@structura.in', pass: 'pm123' },
  { label: 'Supervisor', email: 'suresh@structura.in', pass: 'sup123' },
  { label: 'Employee', email: 'amit@structura.in', pass: 'emp123' },
];

export function Login({ users, onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function performLogin(nextEmail = email, nextPass = pass) {
    setLoading(true);
    setError('');

    window.setTimeout(() => {
      const user = users.find((entry) => entry.email === nextEmail && entry.password === nextPass);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Try a demo account.');
        setLoading(false);
      }
    }, 350);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #f97316, #fb923c)', borderRadius: 14, display: 'grid', placeItems: 'center', boxShadow: '0 14px 34px rgba(249, 115, 22, 0.3)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 18 12 2 21 18" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </div>
            <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.05em', color: '#0f172a' }}>STRUCTURA</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>Civil Engineering Management System</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(18px)', borderRadius: 24, padding: 30, boxShadow: 'var(--shadow)', border: '1px solid rgba(255,255,255,0.6)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>Sign in to your account</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Email address</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@structura.in"
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Password</label>
            <input
              value={pass}
              onChange={(event) => setPass(event.target.value)}
              type="password"
              placeholder="••••••••"
              onKeyDown={(event) => {
                if (event.key === 'Enter') performLogin();
              }}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, outline: 'none' }}
            />
          </div>

          {error ? (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 12px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => performLogin()}
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 14px 30px rgba(249, 115, 22, 0.25)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--muted-2)', margin: '0 0 10px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>Quick Demo Access</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {demoAccounts.map((account) => (
                <button
                  key={account.label}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPass(account.pass);
                    performLogin(account.email, account.pass);
                  }}
                  style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text)', textAlign: 'left' }}
                >
                  <div style={{ color: '#f97316', fontWeight: 800 }}>{account.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 1 }}>{account.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
