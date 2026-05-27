import React, { useState } from 'react';
import { useAppState } from '../state/AppState';
import { Card } from '../components/common/Card';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { fmt } from '../utils/formatters';

function byId(list, id) {
  return list.find((item) => item.id === id);
}

export function Expenses({ user, toast }) {
  const { state, actions } = useAppState();
  const [projFilter, setProjFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ projectId: '', desc: '', amount: '', category: 'Material', date: '' });

  const filtered = projFilter === 'all' ? state.expenses : state.expenses.filter((expense) => expense.projectId === Number(projFilter));
  const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
  const categories = ['Material', 'Equipment', 'Labor', 'Transport', 'Other'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={projFilter} onChange={(event) => setProjFilter(event.target.value)} style={{ flex: '1 1 200px', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, background: '#fff' }}>
          <option value="all">All Projects</option>
          {state.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        {user.role === 'admin' ? (
          <button type="button" onClick={() => setShowAdd((value) => !value)} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            + Add Expense
          </button>
        ) : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard icon="₹" label="Total Expenses" value={fmt(total)} sub={`${filtered.length} entries`} color="#dc2626" />
        {state.projects.slice(0, 3).map((project) => {
          const projectTotal = state.expenses.filter((expense) => expense.projectId === project.id).reduce((sum, expense) => sum + expense.amount, 0);
          return <StatCard key={project.id} icon="◈" label={project.name.split(' ').slice(0, 2).join(' ')} value={fmt(projectTotal)} color="#1d4ed8" />;
        })}
      </div>

      {showAdd ? (
        <Card style={{ marginBottom: 20, border: '1px solid #fdba74' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>Log Expense</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Project</label>
              <select value={form.projectId} onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                <option value="">Select project</option>
                {state.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Category</label>
              <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Description</label>
              <input value={form.desc} onChange={(event) => setForm((current) => ({ ...current, desc: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Amount (₹)</label>
              <input type="number" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Date</label>
              <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={() => {
              if (!form.projectId || !form.desc || !form.amount || !form.date) {
                toast('Fill out the required expense fields first.');
                return;
              }

              actions.addExpense(form, user.id);
              toast('Expense logged.');
              setShowAdd(false);
              setForm({ projectId: '', desc: '', amount: '', category: 'Material', date: '' });
            }} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #f97316, #fb923c)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
              Log Expense
            </button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '10px 20px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Card>
      ) : null}

      <Card>
        <SectionHeader title="Expense Log" />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
              {['Date', 'Project', 'Description', 'Category', 'Amount', 'Approved By'].map((heading) => <th key={heading} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{heading}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((expense) => {
              const project = byId(state.projects, expense.projectId);
              const approver = byId(state.users, expense.approvedBy);
              return (
                <tr key={expense.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px', fontSize: 13, color: 'var(--muted)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{expense.date}</td>
                  <td style={{ padding: '12px', fontSize: 13, fontWeight: 700 }}>{project?.name}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: 'var(--text)' }}>{expense.desc}</td>
                  <td style={{ padding: '12px' }}><Badge label={expense.category} color="#374151" bg="#f3f4f6" /></td>
                  <td style={{ padding: '12px', fontSize: 14, fontWeight: 800 }}>{fmt(expense.amount)}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: 'var(--muted)' }}>{approver?.name}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid #f3f4f6', background: '#f8fafc' }}>
              <td colSpan={4} style={{ padding: '12px', fontWeight: 800, color: 'var(--text)' }}>Total</td>
              <td style={{ padding: '12px', fontSize: 16, fontWeight: 900 }}>{fmt(total)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  );
}
