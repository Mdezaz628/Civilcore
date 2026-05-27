import React from 'react';

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 1px 0 rgba(15, 23, 42, 0.02)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
