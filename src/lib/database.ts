import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);


// Ini adalah cara untuk membuat tabel projects dan tasks saat pertama kali berjalan.
// Ini adalah metode yang tepat untuk multiple statements.
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT,
    userId TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    completed INTEGER,
    dueDate TEXT,
    completionDate TEXT,
    projectId TEXT,
    userId TEXT,
    FOREIGN KEY(projectId) REFERENCES projects(id),
    FOREIGN KEY(userId) REFERENCES users(id)
  );
  
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT NOT NULL
  );
`);

// CARA MEMBUAT TABEL YANG DISARANKAN
// Ini adalah metode yang tepat untuk statement tunggal
// db.prepare(`
// CREATE TABLE IF NOT EXISTS projects (
//     id TEXT PRIMARY KEY,
//     name TEXT,
//     userId TEXT,
//     FOREIGN KEY(userId) REFERENCES users(id)
//   );
// `).run();


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAll<T>(statement: string, params: any[] = []): T[] {
  return db.prepare(statement).all(...params) as T[];
}

export default db;