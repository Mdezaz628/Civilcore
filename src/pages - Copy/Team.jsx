import React, { useState } from 'react';
import { useAppState } from '../state/AppState';
import { attColor, roleBg, roleColor, roleLabel, statusBg, statusColor } from '../utils/constants';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { SectionHeader } from '../components/common/SectionHeader';

function byId(list, id) {
  return list.find((item) => item.id === id);
}

export function Team({ user, toast }) {
  const { state, actions } = useAppState();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', dept: '', designation: '', role: 'employee' });

  const canManage = user.role === 'admin';

  const members = state.users.filter((candidate) => {
    if (user.role === 'admin') return true;
    if (user.role === 'project_manager') return candidate.managedBy === user.id || state.users.some((supervisor) => supervisor.id === candidate.managedBy && supervisor.managedBy === user.id);
    if (user.role === 'supervisor') return candidate.managedBy === user.id;
    return false;
  }).filter((candidate) => candidate.id !== user.id);

  const filtered = members.filter((candidate) => {
    if (roleFilter !== 'all' && candidate.role !== roleFilter) return false;
    if (search && !candidate.name.toLowerCase().includes(search.toLowerCase()) && !candidate.designation.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selected) {
    const member = selected;
    const manager = byId(state.users, member.managedBy);
    const userTasks = state.tasks.filter((task) => task.assignedTo === member.id);
    const todayAttendance = state.attendance['2026-05-27'] || {};
    const attendanceStatus = todayAttendance[member.id];

    return (
      <div>
        <button type="button" onClick={() => setSelected(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#f97316', fontWeight: 800, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}>
          ← Back to Team
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          <Card style={{ textAlign: 'center' }}>
            <Avatar user={member} size={72} />
            <div style={{ marginTop: 14 }}>
              <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>{member.name}</h2>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 10 }}>{member.designation}</div>
              <Badge label={roleLabel[member.role]} color={roleColor[member.role]} bg={roleBg[member.role]} />
            </div>
            <div style={{ marginTop: 20, textAlign: 'left' }}>
              {[['Email', member.email], ['Phone', member.phone], ['Department', member.dept], ['Joined', member.joinDate]].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13, gap: 12 }}>
                  <span style={{ color: 'var(--muted-2)', fontWeight: 700 }}>{label}</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
            {manager ? (
              <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 14, textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-2)', marginBottom: 6, fontWeight: 800 }}>REPORTS TO</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar user={manager} size={28} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{manager.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>{manager.designation}</div>
                  </div>
                </div>
              </div>
            ) : null}
            {attendanceStatus ? (
              <div style={{ marginTop: 12, padding: 10, background: `${attColor[attendanceStatus]}22`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: attColor[attendanceStatus] }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: attColor[attendanceStatus], textTransform: 'capitalize' }}>Today: {attendanceStatus}</span>
              </div>
            ) : null}
          </Card>

          <Card>
            <SectionHeader title="Assigned Tasks" />
            {userTasks.length === 0 ? <EmptyState icon="✓" message="No tasks assigned." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {userTasks.map((task) => {
                  const project = byId(state.projects, task.projectId);
                  return (
                    <div key={task.id} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 10 }}>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{task.title}</div>
                        <Badge label={task.status.replace('_', ' ')} color={statusColor[task.status]} bg={statusBg[task.status]} />
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted-2)' }}>{project?.name} · Due: {task.deadline}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or designation…" style={{ flex: '1 1 220px', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, outline: 'none' }} />
        {['all', 'project_manager', 'supervisor', 'employee'].map((role) => (
          <button key={role} type="button" onClick={() => setRoleFilter(role)} style={{ padding: '8px 14px', borderRadius: 12, border: '1.5px solid', borderColor: roleFilter === role ? '#f97316' : 'var(--border)', background: roleFilter === role ? '#fff7ed' : '#fff', color: roleFilter === role ? '#f97316' : 'var(--text)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            {role === 'all' ? 'All' : roleLabel[role]}
          </button>
        ))}
        {canManage ? (
          <button type="button" onClick={() => setShowAdd((value) => !value)} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            + Add Member
          </button>
        ) : null}
      </div>

      {showAdd ? (
        <Card style={{ marginBottom: 20, border: '1px solid #fdba74' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>Add Team Member</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[['name', 'Full Name'], ['email', 'Email'], ['phone', 'Phone'], ['dept', 'Department'], ['designation', 'Designation']].map(([key, label]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{label}</label>
                <input value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Role</label>
              <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                {['project_manager', 'supervisor', 'employee'].map((role) => <option key={role} value={role}>{roleLabel[role]}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={() => {
              if (!form.name || !form.email || !form.phone || !form.dept || !form.designation) {
                toast('Fill out the required member fields first.');
                return;
              }

              actions.addUser(form, user.id);
              toast('Team member added.');
              setShowAdd(false);
              setForm({ name: '', email: '', phone: '', dept: '', designation: '', role: 'employee' });
            }} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
              Add Member
            </button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '10px 20px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Card>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {filtered.map((member) => {
          const todayStatus = state.attendance['2026-05-27']?.[member.id];
          const activeTaskCount = state.tasks.filter((task) => task.assignedTo === member.id && task.status !== 'completed').length;

          return (
            <div key={member.id} onClick={() => setSelected(member)} role="button" tabIndex={0} onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') setSelected(member);
            }} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 18, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Avatar user={member} size={44} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{member.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted-2)' }}>{member.designation}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge label={roleLabel[member.role]} color={roleColor[member.role]} bg={roleBg[member.role]} />
                {todayStatus ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: attColor[todayStatus] }} />
                    <span style={{ fontSize: 11, color: attColor[todayStatus], fontWeight: 700, textTransform: 'capitalize' }}>{todayStatus}</span>
                  </div>
                ) : null}
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted-2)' }}>
                <span>{member.dept}</span>
                <span>{activeTaskCount} active task{activeTaskCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
