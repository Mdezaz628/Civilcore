import React, { useEffect, useState } from 'react';
import { useAppState } from '../state/AppState';
import { roleBg, roleColor, roleLabel } from '../utils/constants';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { SectionHeader } from '../components/common/SectionHeader';

export function Profile({ user, toast }) {
  const { actions } = useAppState();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone, dept: user.dept });

  useEffect(() => {
    setForm({ name: user.name, phone: user.phone, dept: user.dept });
  }, [user]);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f3f4f6', flexWrap: 'wrap' }}>
          <Avatar user={user} size={80} />
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>{user.name}</h2>
            <div style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 8 }}>{user.designation} · {user.dept}</div>
            <Badge label={roleLabel[user.role]} color={roleColor[user.role]} bg={roleBg[user.role]} />
          </div>
          <button type="button" onClick={() => setEditing((value) => !value)} style={{ marginLeft: 'auto', padding: '10px 18px', background: editing ? '#f3f4f6' : 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: editing ? 'var(--text)' : '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[['name', 'Full Name'], ['phone', 'Phone Number'], ['dept', 'Department']].map(([key, label]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{label}</label>
                  <input value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
                </div>
              ))}
            </div>
            <button type="button" onClick={() => {
              if (!form.name || !form.phone || !form.dept) {
                toast('Fill out the profile fields first.');
                return;
              }

              actions.updateUserProfile(user.id, form);
              toast('Profile updated.');
              setEditing(false);
            }} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
              Save Changes
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {[['Email', user.email], ['Phone', user.phone], ['Department', user.dept], ['Designation', user.designation], ['Joined', user.joinDate], ['Role', roleLabel[user.role]]].map(([label, value]) => (
              <div key={label} style={{ padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card style={{ marginTop: 20 }}>
        <SectionHeader title="Access Permissions" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['Dashboard', true], ['Projects', ['admin', 'project_manager', 'supervisor'].includes(user.role)], ['Team Management', ['admin', 'project_manager', 'supervisor'].includes(user.role)], ['Attendance', ['admin', 'project_manager', 'supervisor'].includes(user.role)], ['Expenses', ['admin', 'project_manager'].includes(user.role)], ['Reports', ['admin', 'project_manager'].includes(user.role)], ['Post Notices', ['admin', 'project_manager'].includes(user.role)], ['Add/Edit Projects', user.role === 'admin'], ['Add Team Members', user.role === 'admin']].map(([label, allowed]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: allowed ? '#15803d' : '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{allowed ? '✓' : '✗'}</span>
                {allowed ? 'Allowed' : 'Restricted'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
