import React from 'react';
import { roleBg, roleColor, roleLabel } from '../../utils/constants';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

const tabTitles = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  tasks: 'Tasks',
  team: 'Team',
  attendance: 'Attendance',
  expenses: 'Expenses',
  notices: 'Notices',
  reports: 'Reports',
  profile: 'My Profile',
};

export function Topbar({ user, activeTab, onLogout }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header
      style={{
        height: 68,
        background: 'rgba(255,255,255,0.84)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        flexShrink: 0,
      }}
    >
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{tabTitles[activeTab]}</h1>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-2)' }}>{today}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Badge label={roleLabel[user.role]} color={roleColor[user.role]} bg={roleBg[user.role]} />
        <Avatar user={user} size={34} />
        <button
          type="button"
          onClick={onLogout}
          style={{ padding: '8px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
