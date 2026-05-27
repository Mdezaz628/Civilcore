import React from 'react';
import { useAppState } from '../state/AppState';
import { attColor, priorityColor, statusBg, statusColor } from '../utils/constants';
import { fmt, parseMoneyLabel } from '../utils/formatters';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { ProgressBar } from '../components/common/ProgressBar';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatCard } from '../components/common/StatCard';

function getUser(users, id) {
  return users.find((user) => user.id === id);
}

function getProject(projects, id) {
  return projects.find((project) => project.id === id);
}

export function Dashboard({ user }) {
  const { state } = useAppState();
  const today = '2026-05-27';
  const todayAttendance = state.attendance[today] || {};

  const visibleProjects = user.role === 'admin'
    ? state.projects
    : user.role === 'project_manager'
      ? state.projects.filter((project) => project.manager === user.id)
      : state.projects.slice(0, 3);

  const activeProjects = visibleProjects.filter((project) => project.status === 'active').length;
  const myTasks = state.tasks.filter((task) => {
    if (user.role === 'admin') return true;
    if (user.role === 'project_manager') return task.assignedBy === user.id || task.assignedTo === user.id || state.projects.some((project) => project.manager === user.id && project.id === task.projectId);
    if (user.role === 'supervisor') return task.assignedBy === user.id || task.assignedTo === user.id;
    return task.assignedTo === user.id;
  });

  const pendingTasks = myTasks.filter((task) => task.status === 'pending' || task.status === 'in_progress').length;
  const presentToday = Object.values(todayAttendance).filter((value) => value === 'present').length;
  const totalStaff = state.users.filter((entry) => entry.role !== 'admin').length;
  const recentProjects = visibleProjects.slice(0, 4);
  const recentTasks = myTasks.slice(0, 5);
  const projectValue = state.projects.reduce((total, project) => total + parseMoneyLabel(project.value), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 20, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff' }}>Good morning, {user.name.split(' ')[0]}!</h2>
          <p style={{ margin: '6px 0 0', color: '#cbd5e1', fontSize: 14 }}>{user.designation} · {user.dept} Department</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>Today's Attendance</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#f97316' }}>{presentToday}/{totalStaff}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>staff present</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        <StatCard icon="◈" label="Active Projects" value={activeProjects} sub={`${visibleProjects.length} total`} color="#f97316" />
        <StatCard icon="✓" label="Pending Tasks" value={pendingTasks} sub="requires action" color="#dc2626" />
        {(user.role === 'admin' || user.role === 'project_manager') ? <StatCard icon="◎" label="Team Size" value={totalStaff} sub="active staff" color="#1d4ed8" /> : null}
        {user.role === 'admin' ? <StatCard icon="₹" label="Total Projects Value" value={fmt(projectValue)} sub="tracked value" color="#15803d" /> : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        <Card>
          <SectionHeader title="Active Projects" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recentProjects.map((project) => (
              <div key={project.id} style={{ paddingBottom: 14, borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{project.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 2 }}>{project.location} · {project.client}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <Badge label={project.status.replace('_', ' ')} color={statusColor[project.status]} bg={statusBg[project.status]} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>{project.value}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ProgressBar value={project.progress} color={project.progress === 100 ? '#15803d' : '#f97316'} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', minWidth: 36 }}>{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Recent Tasks" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentTasks.length === 0 ? <EmptyState icon="✓" message="No tasks assigned." /> : recentTasks.map((task) => {
              const project = getProject(state.projects, task.projectId);
              return (
                <div key={task.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 10, background: 'var(--panel-soft)', borderRadius: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColor[task.priority], marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{task.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 3 }}>{project?.name}</div>
                  </div>
                  <Badge label={task.status.replace('_', ' ')} color={statusColor[task.status]} bg={statusBg[task.status]} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Latest Notices" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {state.notices.slice(0, 3).map((notice) => {
            const high = notice.priority === 'high';

            return (
              <div key={notice.id} style={{ border: `1px solid ${high ? '#fecaca' : '#e5e7eb'}`, borderRadius: 14, padding: '14px 16px', background: high ? '#fef2f2' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>{notice.title}</div>
                  <Badge label={notice.priority} color={priorityColor[notice.priority]} bg="transparent" />
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{notice.body.slice(0, 80)}…</div>
                <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 8 }}>Posted · {notice.date}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Attendance Snapshot" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {Object.entries(todayAttendance).slice(0, 4).map(([memberId, status]) => {
            const member = getUser(state.users, Number(memberId));
            if (!member) return null;
            return (
              <div key={memberId} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 14, padding: 12 }}>
                <Avatar user={member} size={32} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{member.name}</div>
                  <div style={{ fontSize: 12, color: attColor[status], textTransform: 'capitalize' }}>{status}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
