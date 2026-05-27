import React from 'react';

const colors = ['#1d4ed8', '#0369a1', '#15803d', '#7c3aed', '#c2410c', '#b45309'];

export function Avatar({ user, size = 36 }) {
  const color = colors[user.id % colors.length];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: Math.max(12, size * 0.35),
        flexShrink: 0,
        letterSpacing: '-0.04em',
      }}
    >
      {user.avatar}
    </div>
  );
}
