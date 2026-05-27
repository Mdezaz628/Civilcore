import { createClient } from '@supabase/supabase-js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  ATTENDANCE,
  EXPENSES,
  NOTICES,
  PROJECTS,
  TASKS,
  USERS,
} from '../src/data/seedData.js';

dotenv.config({ path: './.env' });
console.log(process.env.SUPABASE_URL);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Temporary in-memory state
let appState = {
  users: USERS,
  projects: PROJECTS,
  tasks: TASKS,
  attendance: ATTENDANCE,
  notices: NOTICES,
  expenses: EXPENSES,
};

app.get('/api/state', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    res.json(data.data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get('/api/state', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    res.json(data.data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
async function start() {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});