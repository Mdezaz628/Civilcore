import React, { useMemo, useState } from 'react';
import { useAppState } from './state/AppState';
import { Login } from './pages/Login';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Team } from './pages/Team';
import { Attendance } from './pages/Attendance';
import { Expenses } from './pages/Expenses';
import { Notices } from './pages/Notices';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { EmptyState } from './components/common/EmptyState';
import { Toast } from './components/common/Toast';

export default function App() {
  const { state, ready, syncError } = useAppState();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const user = useMemo(() => state.users.find((entry) => entry.id === currentUserId) || null, [state.users, currentUserId]);

  function toast(message) {
    setToastMessage(message);
  }

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow)', maxWidth: 420, width: '100%' }}>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Connecting to MongoDB</div>
          <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
            Loading the app state from the API. If this stalls, make sure the server is running and MONGO_URI is set.
          </div>
          {syncError ? <div style={{ marginTop: 12, fontSize: 13, color: '#b45309', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 12, padding: 12 }}>{syncError}</div> : null}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login users={state.users} onLogin={(account) => { setCurrentUserId(account.id); setActiveTab('dashboard'); }} />;
  }

  const panels = {
    dashboard: <Dashboard user={user} />,
    projects: <Projects user={user} toast={toast} />,
    tasks: <Tasks user={user} toast={toast} />,
    team: <Team user={user} toast={toast} />,
    attendance: <Attendance user={user} toast={toast} />,
    expenses: <Expenses user={user} toast={toast} />,
    notices: <Notices user={user} toast={toast} />,
    reports: <Reports user={user} />,
    profile: <Profile user={user} toast={toast} />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar user={user} activeTab={activeTab} onLogout={() => { setCurrentUserId(null); setActiveTab('dashboard'); }} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {panels[activeTab] || <EmptyState icon="⊞" message="Page not found." />}
        </main>
      </div>

      {toastMessage ? <Toast message={toastMessage} onDone={() => setToastMessage('')} /> : null}
    </div>
  );
}
