import React from 'react';

export function SectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{title}</h2>
      {action}
    </div>
  );
}
