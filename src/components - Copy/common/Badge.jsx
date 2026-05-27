import React from 'react';

export function Badge({ label, color, bg }) {
  return (
    <span
      style={{
        background: bg || '#f3f4f6',
        color: color || '#374151',
        fontSize: 11,
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: 999,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
