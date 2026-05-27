import React from 'react';

export function StatCard({ icon, label, value, sub, color = '#1d4ed8' }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 20, color }}>{icon}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
      {sub ? <div style={{ fontSize: 12, color: 'var(--muted-2)' }}>{sub}</div> : null}
    </div>
  );
}
