import React, { useMemo, useState } from 'react';
import { useAppState } from '../state/AppState';
import { attColor, roleBg, roleColor, roleLabel } from '../utils/constants';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { SectionHeader } from '../components/common/SectionHeader';

export function Attendance({ user, toast }) {
  const { state, actions } = useAppState();
  const dates = useMemo(() => ['2026-05-27', '2026-05-26', '2026-05-25'], []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  const canEdit = user.role === 'admin' || user.role === 'project_manager' || user.role === 'supervisor';

  const staff = state.users.filter((candidate) => {
    if (user.role === 'admin' || user.role === 'project_manager') return candidate.role !== 'admin';
    if (user.role === 'supervisor') return candidate.managedBy === user.id;
    return false;
  });

  const attendance = state.attendance[selectedDate] || {};
  const counts = staff.reduce((accumulator, member) => {
    const status = attendance[member.id] || 'absent';
    accumulator[status] = (accumulator[status] || 0) + 1;
    return accumulator;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginRight: 8 }}>Date:</label>
          <select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, background: '#fff' }}>
            {dates.map((date) => <option key={date} value={date}>{date}</option>)}
          </select>
        </div>

        {canEdit ? (
          <button type="button" onClick={() => toast('Attendance saved successfully.')} style={{ marginLeft: 'auto', padding: '10px 18px', background: 'linear-gradient(135deg, #15803d, #22c55e)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            Save Attendance
          </button>
        ) : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[['Present', counts.present || 0, '#15803d', '#f0fdf4'], ['Absent', counts.absent || 0, '#dc2626', '#fef2f2'], ['Half Day', counts.half || 0, '#d97706', '#fffbeb']].map(([label, value, color, background]) => (
          <div key={label} style={{ background, border: `1px solid ${color}33`, borderRadius: 16, padding: '14px 18px' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
            <div style={{ fontSize: 13, color, fontWeight: 700 }}>{label}</div>
          </div>
        ))}
      </div>

      <Card>
        <SectionHeader title={`Attendance — ${selectedDate}`} />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                {['Employee', 'Designation', 'Role', 'Status'].map((heading) => <th key={heading} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => {
                const status = attendance[member.id] || 'absent';

                return (
                  <tr key={member.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar user={member} size={32} />
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{member.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: 14, color: 'var(--muted)' }}>{member.designation}</td>
                    <td style={{ padding: '12px' }}><Badge label={roleLabel[member.role]} color={roleColor[member.role]} bg={roleBg[member.role]} /></td>
                    <td style={{ padding: '12px' }}>
                      {canEdit ? (
                        <select
                          value={status}
                          onChange={(event) => actions.updateAttendance(selectedDate, member.id, event.target.value)}
                          style={{ padding: '7px 10px', border: `1.5px solid ${attColor[status]}`, borderRadius: 10, fontSize: 13, background: `${attColor[status]}15`, color: attColor[status], fontWeight: 700, cursor: 'pointer' }}
                        >
                          {['present', 'absent', 'half'].map((entry) => <option key={entry} value={entry}>{entry === 'half' ? 'Half Day' : entry.charAt(0).toUpperCase() + entry.slice(1)}</option>)}
                        </select>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: attColor[status] }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: attColor[status], textTransform: 'capitalize' }}>{status === 'half' ? 'Half Day' : status}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
