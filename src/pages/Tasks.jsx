import React, { useMemo, useState } from 'react';
import { useAppState } from '../state/AppState';
import { priorityColor, statusBg, statusColor } from '../utils/constants';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';

function byId(list, id) {
  return list.find((item) => item.id === id);
}

export function Tasks({ user, toast }) {
  const { state, actions } = useAppState();
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', projectId: '', assignedTo: '', priority: 'medium', deadline: '', notes: '' });

  const canAssign = user.role === 'admin' || user.role === 'project_manager' || user.role === 'supervisor';

  const myTasks = useMemo(() => state.tasks.filter((task) => {
    if (user.role === 'admin') return true;
    if (user.role === 'project_manager') return state.projects.some((project) => project.manager === user.id && project.id === task.projectId);
    if (user.role === 'supervisor') return task.assignedBy === user.id || task.assignedTo === user.id;
    return task.assignedTo === user.id;
  }), [state.tasks, state.projects, user]);

  const filtered = myTasks.filter((task) => filter === 'all' || task.status === filter || task.priority === filter);
  const assignableUsers = state.users.filter((candidate) => {
    if (user.role === 'admin') return candidate.role !== 'admin';
    if (user.role === 'project_manager') return ['supervisor', 'employee'].includes(candidate.role);
    if (user.role === 'supervisor') return candidate.managedBy === user.id;
    return false;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'pending', 'in_progress', 'completed', 'high', 'medium', 'low'].map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setFilter(entry)}
            style={{ padding: '8px 14px', borderRadius: 12, border: '1.5px solid', borderColor: filter === entry ? '#f97316' : 'var(--border)', background: filter === entry ? '#fff7ed' : '#fff', color: filter === entry ? '#f97316' : 'var(--text)', fontWeight: 700, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize' }}
          >
            {entry.replace('_', ' ')}
          </button>
        ))}

        {canAssign ? (
          <button type="button" onClick={() => setShowAdd((value) => !value)} style={{ marginLeft: 'auto', padding: '10px 18px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            + Assign Task
          </button>
        ) : null}
      </div>

      {showAdd ? (
        <Card style={{ marginBottom: 20, border: '1px solid #fdba74' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>Assign New Task</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Task Title</label>
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Project</label>
              <select value={form.projectId} onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                <option value="">Select project</option>
                {state.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Assign To</label>
              <select value={form.assignedTo} onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                <option value="">Select person</option>
                {assignableUsers.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name} ({candidate.role.replace('_', ' ')})</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Priority</label>
              <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                {['high', 'medium', 'low'].map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Deadline</label>
              <input type="date" value={form.deadline} onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Notes</label>
              <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} rows={2} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              type="button"
              onClick={() => {
                if (!form.title || !form.projectId || !form.assignedTo || !form.deadline) {
                  toast('Fill out the required task fields first.');
                  return;
                }

                actions.addTask(form, user.id);
                toast('Task assigned successfully.');
                setShowAdd(false);
                setForm({ title: '', projectId: '', assignedTo: '', priority: 'medium', deadline: '', notes: '' });
              }}
              style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
            >
              Assign Task
            </button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '10px 20px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Card>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState icon="✓" message="No tasks found." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((task) => {
            const assignee = byId(state.users, task.assignedTo);
            const assigner = byId(state.users, task.assignedBy);
            const project = byId(state.projects, task.projectId);

            return (
              <Card key={task.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 4, minHeight: 60, background: priorityColor[task.priority], borderRadius: 999, flexShrink: 0, alignSelf: 'stretch' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{task.title}</h3>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <Badge label={task.priority} color={priorityColor[task.priority]} bg="transparent" />
                        <Badge label={task.status.replace('_', ' ')} color={statusColor[task.status]} bg={statusBg[task.status]} />
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text)' }}>{project?.name}</span>
                      {task.notes ? <span> · {task.notes}</span> : null}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--muted-2)' }}>
                      {assignee ? <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Avatar user={assignee} size={20} /> {assignee.name}</span> : null}
                      {assigner ? <span>↑ by {assigner.name}</span> : null}
                      <span style={{ color: '#f97316', fontWeight: 800 }}>Due: {task.deadline}</span>
                      {((user.role === 'employee' && task.assignedTo === user.id) || (user.role === 'supervisor' && task.assignedBy === user.id) || user.role === 'admin') ? (
                        <select
                          value={task.status}
                          onChange={(event) => {
                            actions.updateTaskStatus(task.id, event.target.value);
                            toast('Task status updated.');
                          }}
                          style={{ marginLeft: 'auto', padding: '6px 10px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 12, background: '#f8fafc' }}
                        >
                          {['pending', 'in_progress', 'completed'].map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
                        </select>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
