import React, { useMemo, useState } from 'react';
import { useAppState } from '../state/AppState';
import { priorityColor, statusBg, statusColor } from '../utils/constants';
import { fmt } from '../utils/formatters';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { ProgressBar } from '../components/common/ProgressBar';
import { SectionHeader } from '../components/common/SectionHeader';

function byId(list, id) {
  return list.find((item) => item.id === id);
}

export function Projects({ user, toast }) {
  const { state, actions } = useAppState();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', client: '', value: '', location: '', deadline: '', category: 'Infrastructure', priority: 'medium', description: '' });

  const canManage = user.role === 'admin' || user.role === 'project_manager';
  const projects = user.role === 'admin'
    ? state.projects
    : user.role === 'project_manager'
      ? state.projects.filter((project) => project.manager === user.id)
      : state.projects;

  const filtered = useMemo(() => projects.filter((project) => {
    if (filter !== 'all' && project.status !== filter) return false;
    if (search && !project.name.toLowerCase().includes(search.toLowerCase()) && !project.client.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [projects, filter, search]);

  const categories = ['Infrastructure', 'Residential', 'Industrial', 'Water Works', 'Road', 'Commercial'];
  const statuses = ['all', 'active', 'planning', 'on_hold', 'completed'];

  if (selected) {
    const project = selected;
    const manager = byId(state.users, project.manager);
    const projectTasks = state.tasks.filter((task) => task.projectId === project.id);
    const projectExpenses = state.expenses.filter((expense) => expense.projectId === project.id);
    const totalSpent = projectExpenses.reduce((total, expense) => total + expense.amount, 0);

    return (
      <div>
        <button type="button" onClick={() => setSelected(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#f97316', fontWeight: 800, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}>
          ← Back to Projects
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>{project.name}</h2>
                <div style={{ fontSize: 13, color: 'var(--muted-2)' }}>{project.location} · {project.client}</div>
              </div>
              <Badge label={project.status.replace('_', ' ')} color={statusColor[project.status]} bg={statusBg[project.status]} />
            </div>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 20 }}>{project.description}</p>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Progress</span>
                <span style={{ fontSize: 13, fontWeight: 800 }}>{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} color="#f97316" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>Contract Value</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{project.value}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>Deadline</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{project.deadline}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>Category</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{project.category}</div>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', marginBottom: 12 }}>PROJECT MANAGER</div>
              {manager ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar user={manager} size={40} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{manager.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-2)' }}>{manager.designation}</div>
                  </div>
                </div>
              ) : null}
            </Card>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', marginBottom: 12 }}>EXPENSES</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>{fmt(totalSpent)}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-2)' }}>across {projectExpenses.length} entries</div>
            </Card>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', marginBottom: 12 }}>TASKS</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#15803d' }}>{projectTasks.filter((task) => task.status === 'completed').length}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>done</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#d97706' }}>{projectTasks.filter((task) => task.status === 'in_progress').length}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>in progress</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--muted)' }}>{projectTasks.filter((task) => task.status === 'pending').length}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>pending</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card style={{ marginTop: 20 }}>
          <SectionHeader title={`Tasks (${projectTasks.length})`} />
          {projectTasks.length === 0 ? <EmptyState icon="✓" message="No tasks for this project." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {projectTasks.map((task) => {
                const assignee = byId(state.users, task.assignedTo);

                return (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#f8fafc', borderRadius: 14 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColor[task.priority], flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{task.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted-2)' }}>Due: {task.deadline}</div>
                    </div>
                    {assignee ? <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Avatar user={assignee} size={26} /><span style={{ fontSize: 13, color: 'var(--muted)' }}>{assignee.name}</span></div> : null}
                    <Badge label={task.status.replace('_', ' ')} color={statusColor[task.status]} bg={statusBg[task.status]} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects…"
          style={{ flex: '1 1 220px', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, outline: 'none', background: '#fff' }}
        />

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              style={{ padding: '9px 14px', borderRadius: 12, border: '1.5px solid', borderColor: filter === status ? '#f97316' : 'var(--border)', background: filter === status ? '#fff7ed' : '#fff', color: filter === status ? '#f97316' : 'var(--text)', fontWeight: 700, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {canManage ? (
          <button
            type="button"
            onClick={() => setShowAdd((value) => !value)}
            style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
          >
            + New Project
          </button>
        ) : null}
      </div>

      {showAdd ? (
        <Card style={{ marginBottom: 20, border: '1px solid #fdba74', boxShadow: '0 12px 32px rgba(249, 115, 22, 0.08)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>Add New Project</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[['name', 'Project Name'], ['client', 'Client'], ['value', 'Contract Value'], ['location', 'Location'], ['deadline', 'Deadline']].map(([key, label]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{label}</label>
                <input value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Category</label>
              <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Priority</label>
              <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                {['high', 'medium', 'low'].map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Description</label>
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              type="button"
              onClick={() => {
                if (!form.name || !form.client || !form.value || !form.location || !form.deadline) {
                  toast('Fill out the required project fields first.');
                  return;
                }

                actions.addProject(form, user.id);
                toast('Project added successfully.');
                setShowAdd(false);
                setForm({ name: '', client: '', value: '', location: '', deadline: '', category: 'Infrastructure', priority: 'medium', description: '' });
              }}
              style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
            >
              Save Project
            </button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '10px 20px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Card>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState icon="◈" message="No projects found." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map((project) => {
            const manager = byId(state.users, project.manager);
            return (
              <div
                key={project.id}
                onClick={() => setSelected(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setSelected(project);
                }}
                style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 20, cursor: 'pointer', boxShadow: '0 1px 0 rgba(15, 23, 42, 0.03)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <Badge label={project.category} color='#374151' bg='#f3f4f6' />
                  <Badge label={project.status.replace('_', ' ')} color={statusColor[project.status]} bg={statusBg[project.status]} />
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{project.name}</h3>
                <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--muted-2)' }}>{project.location} · {project.client}</p>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Progress</span>
                    <span style={{ fontSize: 12, fontWeight: 800 }}>{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} color={project.progress === 100 ? '#15803d' : '#f97316'} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>{project.value}</div>
                  {manager ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Avatar user={manager} size={24} />
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{manager.name.split(' ')[0]}</span>
                    </div>
                  ) : null}
                </div>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f3f4f6', fontSize: 12, color: 'var(--muted-2)', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span>Started: {project.startDate}</span>
                  <span style={{ color: '#f97316', fontWeight: 800 }}>Deadline: {project.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
