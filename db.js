const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todos.db');

// Create the todos table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority TEXT DEFAULT 'low',
      isComplete INTEGER DEFAULT 0,
      isFun INTEGER DEFAULT 1
    )
  `);
});

module.exports = db;
