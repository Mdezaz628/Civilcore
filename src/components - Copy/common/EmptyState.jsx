import React from 'react';

export function EmptyState({ icon, message }) {
  return (
    <div style={{ textAlign: 'center', padding: '44px 20px', color: 'var(--muted-2)' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 14 }}>{message}</div>
    </div>
  );
}
