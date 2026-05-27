import React from 'react';
import { roleLabel } from '../../utils/constants';
import { Avatar } from '../common/Avatar';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞', roles: ['admin', 'project_manager', 'supervisor', 'employee'] },
  { id: 'projects', label: 'Projects', icon: '◈', roles: ['admin', 'project_manager', 'supervisor'] },
  { id: 'tasks', label: 'My Tasks', icon: '✓', roles: ['admin', 'project_manager', 'supervisor', 'employee'] },
  { id: 'team', label: 'Team', icon: '◎', roles: ['admin', 'project_manager', 'supervisor'] },
  { id: 'attendance', label: 'Attendance', icon: '◉', roles: ['admin', 'project_manager', 'supervisor'] },
  { id: 'expenses', label: 'Expenses', icon: '₹', roles: ['admin', 'project_manager'] },
  { id: 'notices', label: 'Notices', icon: '◆', roles: ['admin', 'project_manager', 'supervisor', 'employee'] },
  { id: 'reports', label: 'Reports', icon: '▣', roles: ['admin', 'project_manager'] },
  { id: 'profile', label: 'My Profile', icon: '◉', roles: ['admin', 'project_manager', 'supervisor', 'employee'] },
];

export function Sidebar({ user, activeTab, setActiveTab, collapsed, setCollapsed }) {
  const nav = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside
      style={{
        width: collapsed ? 68 : 240,
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
        color: '#fff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.25s ease',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: collapsed ? '18px 14px' : '18px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: 34, height: 34, background: '#f97316', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 18 12 2 21 18" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </div>
        {!collapsed ? <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.03em' }}>STRUCTURA</span> : null}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20, padding: 0 }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {nav.map((item) => {
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '11px 14px' : '11px 20px',
                background: active ? 'rgba(249, 115, 22, 0.14)' : 'transparent',
                border: 'none',
                color: active ? '#f97316' : '#cbd5e1',
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                textAlign: 'left',
                borderLeft: active ? '3px solid #f97316' : '3px solid transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed ? <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span> : null}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: collapsed ? '12px 10px' : '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar user={user} size={32} />
        {!collapsed ? (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name.split(' ')[0]}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>{roleLabel[user.role]}</div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
