import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ATTENDANCE, EXPENSES, NOTICES, PROJECTS, TASKS, USERS } from '../src/data/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const appStateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    users: { type: Array, required: true },
    projects: { type: Array, required: true },
    tasks: { type: Array, required: true },
    attendance: { type: Object, required: true },
    notices: { type: Array, required: true },
    expenses: { type: Array, required: true },
  },
  { timestamps: true, versionKey: false },
);

const AppState = mongoose.model('AppState', appStateSchema);

function seedState() {
  return {
    users: USERS,
    projects: PROJECTS,
    tasks: TASKS,
    attendance: ATTENDANCE,
    notices: NOTICES,
    expenses: EXPENSES,
  };
}

async function ensureState() {
  let state = await AppState.findOne({ key: 'main' });
  if (!state) {
    state = await AppState.create({ key: 'main', ...seedState() });
  }
  return state;
}

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.get('/api/state', async (_req, res) => {
  try {
    const state = await ensureState();
    res.json({
      users: state.users,
      projects: state.projects,
      tasks: state.tasks,
      attendance: state.attendance,
      notices: state.notices,
      expenses: state.expenses,
    });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to load state' });
  }
});

app.put('/api/state', async (req, res) => {
  try {
    const payload = req.body;
    const state = await AppState.findOneAndUpdate(
      { key: 'main' },
      { $set: { ...payload, key: 'main' } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json({
      users: state.users,
      projects: state.projects,
      tasks: state.tasks,
      attendance: state.attendance,
      notices: state.notices,
      expenses: state.expenses,
    });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to save state' });
  }
});

async function start() {
  if (!MONGO_URI) {
    console.warn('MONGO_URI is not set. Add it to a .env file to use MongoDB.');
  } else {
    await mongoose.connect(MONGO_URI);
    await ensureState();
    console.log('Connected to MongoDB');
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
