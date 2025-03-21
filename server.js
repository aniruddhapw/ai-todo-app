import express from 'express';
import cors from 'cors';
import { db } from './db/index.js';
import { todosTable } from './db/schema.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await db.select().from(todosTable);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { todo } = req.body;
    const [result] = await db.insert().into(todosTable).values({ todo }).returning();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete().from(todosTable).where('id').eq(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 