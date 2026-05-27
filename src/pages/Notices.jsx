import React, { useState } from 'react';
import { useAppState } from '../state/AppState';
import { priorityColor } from '../utils/constants';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';

function byId(list, id) {
  return list.find((item) => item.id === id);
}

export function Notices({ user, toast }) {
  const { state, actions } = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', priority: 'medium', audience: 'all' });

  const canPost = user.role === 'admin' || user.role === 'project_manager';

  return (
    <div>
      {canPost ? (
        <div style={{ marginBottom: 20 }}>
          <button type="button" onClick={() => setShowAdd((value) => !value)} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            + Post Notice
          </button>
        </div>
      ) : null}

      {showAdd ? (
        <Card style={{ marginBottom: 20, border: '1px solid #fdba74' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>Post New Notice</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Title</label>
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Message</label>
              <textarea value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} rows={4} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Priority</label>
              <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                {['high', 'medium', 'low'].map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Audience</label>
              <select value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                {[['all', 'Everyone'], ['pm', 'Project Managers'], ['supervisor', 'Supervisors'], ['employee', 'Employees']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={() => {
              if (!form.title || !form.body) {
                toast('Fill out the required notice fields first.');
                return;
              }

              actions.addNotice(form, user.id);
              toast('Notice posted successfully.');
              setShowAdd(false);
              setForm({ title: '', body: '', priority: 'medium', audience: 'all' });
            }} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
              Post Notice
            </button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '10px 20px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Card>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {state.notices.map((notice) => {
          const poster = byId(state.users, notice.postedBy);
          const high = notice.priority === 'high';

          return (
            <div key={notice.id} style={{ background: '#fff', border: `1px solid ${high ? '#fecaca' : '#e5e7eb'}`, borderLeft: `4px solid ${priorityColor[notice.priority]}`, borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{notice.title}</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Badge label={notice.priority} color={priorityColor[notice.priority]} bg={high ? '#fef2f2' : '#f9fafb'} />
                  <Badge label={notice.audience === 'all' ? 'Everyone' : notice.audience} color="#374151" bg="#f3f4f6" />
                </div>
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{notice.body}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--muted-2)' }}>
                {poster ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Avatar user={poster} size={20} /> {poster.name}</span> : null}
                <span>·</span>
                <span>{notice.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
