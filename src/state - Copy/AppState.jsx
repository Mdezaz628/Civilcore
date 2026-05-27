import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ATTENDANCE, EXPENSES, NOTICES, PROJECTS, TASKS, USERS } from '../data/seedData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const AppStateContext = createContext(null);

function cloneSeed() {
  return {
    users: USERS,
    projects: PROJECTS,
    tasks: TASKS,
    attendance: ATTENDANCE,
    notices: NOTICES,
    expenses: EXPENSES,
  };
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

async function fetchState() {
  const response = await fetch(`${API_BASE}/state`);
  if (!response.ok) throw new Error('Failed to load app state');
  return response.json();
}

async function persistState(state) {
  const response = await fetch(`${API_BASE}/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });

  if (!response.ok) throw new Error('Failed to save app state');
}

export function AppStateProvider({ children }) {
  const [state, setState] = useState(cloneSeed);
  const [ready, setReady] = useState(false);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const remoteState = await fetchState();
        if (active && remoteState) {
          setState({
            users: remoteState.users?.length ? remoteState.users : USERS,
            projects: remoteState.projects?.length ? remoteState.projects : PROJECTS,
            tasks: remoteState.tasks?.length ? remoteState.tasks : TASKS,
            attendance: remoteState.attendance || ATTENDANCE,
            notices: remoteState.notices?.length ? remoteState.notices : NOTICES,
            expenses: remoteState.expenses?.length ? remoteState.expenses : EXPENSES,
          });
        }
      } catch (error) {
        if (active) {
          setSyncError(error instanceof Error ? error.message : 'Failed to connect to MongoDB API');
        }
      } finally {
        if (active) setReady(true);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function save() {
      try {
        await persistState(state);
      } catch (error) {
        if (!cancelled) {
          setSyncError(error instanceof Error ? error.message : 'Failed to save state to MongoDB');
        }
      }
    }

    save();

    return () => {
      cancelled = true;
    };
  }, [state, ready]);

  const actions = useMemo(() => ({
    addProject(input, managerId) {
      setState((current) => ({
        ...current,
        projects: [
          {
            id: nextId(current.projects),
            name: input.name.trim(),
            client: input.client.trim(),
            value: input.value.trim(),
            status: 'planning',
            progress: 0,
            deadline: input.deadline,
            location: input.location.trim(),
            manager: managerId,
            category: input.category,
            startDate: input.startDate || new Date().toISOString().slice(0, 10),
            description: input.description.trim(),
            priority: input.priority,
          },
          ...current.projects,
        ],
      }));
    },

    addTask(input, assignedById) {
      setState((current) => ({
        ...current,
        tasks: [
          {
            id: nextId(current.tasks),
            title: input.title.trim(),
            projectId: Number(input.projectId),
            assignedTo: Number(input.assignedTo),
            assignedBy: assignedById,
            priority: input.priority,
            status: 'pending',
            deadline: input.deadline,
            notes: input.notes.trim(),
          },
          ...current.tasks,
        ],
      }));
    },

    addUser(input, managerId) {
      setState((current) => ({
        ...current,
        users: [
          {
            id: nextId(current.users),
            name: input.name.trim(),
            email: input.email.trim(),
            password: input.password?.trim() || 'emp123',
            role: input.role,
            avatar: input.avatar || input.name.trim().split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
            phone: input.phone.trim(),
            dept: input.dept.trim(),
            joinDate: input.joinDate || new Date().toISOString().slice(0, 10),
            designation: input.designation.trim(),
            managedBy: input.role === 'project_manager' ? 1 : managerId,
          },
          ...current.users,
        ],
      }));
    },

    addExpense(input, approvedById) {
      setState((current) => ({
        ...current,
        expenses: [
          {
            id: nextId(current.expenses),
            projectId: Number(input.projectId),
            desc: input.desc.trim(),
            amount: Number(input.amount),
            date: input.date,
            category: input.category,
            approvedBy: approvedById,
          },
          ...current.expenses,
        ],
      }));
    },

    addNotice(input, postedById) {
      setState((current) => ({
        ...current,
        notices: [
          {
            id: nextId(current.notices),
            title: input.title.trim(),
            body: input.body.trim(),
            date: new Date().toISOString().slice(0, 10),
            postedBy: postedById,
            audience: input.audience,
            priority: input.priority,
          },
          ...current.notices,
        ],
      }));
    },

    updateTaskStatus(taskId, status) {
      setState((current) => ({
        ...current,
        tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
      }));
    },

    updateAttendance(date, userId, status) {
      setState((current) => ({
        ...current,
        attendance: {
          ...current.attendance,
          [date]: {
            ...(current.attendance[date] || {}),
            [userId]: status,
          },
        },
      }));
    },

    updateUserProfile(userId, patch) {
      setState((current) => ({
        ...current,
        users: current.users.map((user) => (user.id === userId ? { ...user, ...patch } : user)),
      }));
    },
  }), []);

  const value = useMemo(() => ({ state, actions, ready, syncError }), [state, actions, ready, syncError]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider');
  return context;
}
