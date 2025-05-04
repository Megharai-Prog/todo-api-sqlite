const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all todos
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET todo by ID
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Todo not found' });
    res.json(row);
  });
});

// POST new todo
app.post('/todos', (req, res) => {
  const { name, priority = 'low', isFun = 'true' } = req.body;
  if (!name.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const stmt = db.prepare('INSERT INTO todos (name, priority, isFun) VALUES (?, ?, ?)');
  stmt.run(name, priority, isFun === 'true' ? 1 : 0, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM todos WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});

// DELETE todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: `Todo item ${id} deleted.` });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
