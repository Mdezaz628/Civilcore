import React, { useEffect } from 'react';

export function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: '#111827',
        color: '#fff',
        padding: '12px 18px',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 700,
        zIndex: 1000,
        boxShadow: '0 18px 42px rgba(15, 23, 42, 0.28)',
      }}
    >
      {message}
    </div>
  );
}
