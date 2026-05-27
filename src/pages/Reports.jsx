import React from 'react';
import { useAppState } from '../state/AppState';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatCard } from '../components/common/StatCard';
import { fmt, parseMoneyLabel } from '../utils/formatters';
import { statusBg, statusColor } from '../utils/constants';
import { Badge } from '../components/common/Badge';

export function Reports() {
  const { state } = useAppState();
  const totalProjectValue = state.projects.reduce((sum, project) => sum + parseMoneyLabel(project.value), 0);
  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const completedCount = state.projects.filter((project) => project.status === 'completed').length;
  const activeCount = state.projects.filter((project) => project.status === 'active').length;
  const tasksDone = state.tasks.filter((task) => task.status === 'completed').length;
  const tasksTotal = state.tasks.length;
  const expenseByCategory = state.expenses.reduce((accumulator, expense) => {
    accumulator[expense.category] = (accumulator[expense.category] || 0) + expense.amount;
    return accumulator;
  }, {});
  const expenseByProject = state.projects
    .map((project) => ({
      name: project.name.split(' ').slice(0, 2).join(' '),
      amount: state.expenses.filter((expense) => expense.projectId === project.id).reduce((sum, expense) => sum + expense.amount, 0),
      status: project.status,
    }))
    .filter((project) => project.amount > 0);
  const maxExpense = Math.max(...expenseByProject.map((project) => project.amount), 1);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard icon="◈" label="Total Projects" value={state.projects.length} sub={`${activeCount} active, ${completedCount} done`} color="#f97316" />
        <StatCard icon="₹" label="Total Expenses" value={fmt(totalExpenses)} sub="logged so far" color="#dc2626" />
        <StatCard icon="✓" label="Tasks Completed" value={`${tasksDone}/${tasksTotal}`} sub={`${tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0}% done`} color="#15803d" />
        <StatCard icon="◎" label="Total Staff" value={state.users.length - 1} sub="excluding admin" color="#1d4ed8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <SectionHeader title="Expenses by Project" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {expenseByProject.map((project) => (
              <div key={project.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{project.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{fmt(project.amount)}</span>
                </div>
                <ProgressBar value={Math.round((project.amount / maxExpense) * 100)} color="#f97316" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Expenses by Category" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(expenseByCategory).map(([category, amount]) => {
              const palette = { Material: '#f97316', Equipment: '#1d4ed8', Labor: '#15803d', Transport: '#7c3aed', Other: '#374151' };

              return (
                <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: palette[category] || '#374151', flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{category}</div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{fmt(amount)}</div>
                  <div style={{ width: 70 }}><ProgressBar value={Math.round((amount / totalExpenses) * 100)} color={palette[category] || '#374151'} /></div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Project Status Overview" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {state.projects.map((project) => (
              <div key={project.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{project.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>{project.client}</div>
                </div>
                <div style={{ width: 90 }}><ProgressBar value={project.progress} color={statusColor[project.status]} /></div>
                <div style={{ fontSize: 12, fontWeight: 800, minWidth: 34 }}>{project.progress}%</div>
                <Badge label={project.status.replace('_', ' ')} color={statusColor[project.status]} bg={statusBg[project.status]} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Budget Summary" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--muted-2)', marginBottom: 4 }}>Tracked Project Value</div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{fmt(totalProjectValue)}</div>
            </div>
            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--muted-2)', marginBottom: 4 }}>Logged Expenses</div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{fmt(totalExpenses)}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
