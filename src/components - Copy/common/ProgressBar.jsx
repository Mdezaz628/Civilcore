import React from 'react';

export function ProgressBar({ value, color = '#1d4ed8' }) {
  return (
    <div style={{ height: 7, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: color,
          borderRadius: 999,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}
