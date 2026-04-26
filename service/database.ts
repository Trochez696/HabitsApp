import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('habits.db');
  
  // Crear tabla de hábitos
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    );
  `);
  
  // Crear tabla de preferencias
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      theme TEXT DEFAULT 'light',
      showAlerts INTEGER DEFAULT 1,
      sortBy TEXT DEFAULT 'name'
    );
  `);
  
  // Insertar preferencias por defecto si no existen
  const prefs = await db.getFirstAsync('SELECT * FROM preferences WHERE id = 1');
  if (!prefs) {
    await db.runAsync('INSERT INTO preferences (theme, showAlerts, sortBy) VALUES (?, ?, ?)', ['light', 1, 'name']);
  }
  
  return db;
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    await initDatabase();
  }
  return db!;
}

// ============ OPERACIONES CRUD PARA HÁBITOS ============

export interface Habit {
  id: number;
  name: string;
  completed: number;
}

export async function getAllHabits(): Promise<Habit[]> {
  const database = await getDatabase();
  const habits = await database.getAllAsync<Habit>('SELECT * FROM habits ORDER BY id DESC');
  return habits;
}

export async function addHabit(name: string): Promise<number> {
  const database = await getDatabase();
  const result = await database.runAsync('INSERT INTO habits (name, completed) VALUES (?, ?)', [name, 0]);
  return result.lastInsertRowId;
}

export async function updateHabit(id: number, name: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE habits SET name = ? WHERE id = ?', [name, id]);
}

export async function toggleHabitCompletion(id: number, completed: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE habits SET completed = ? WHERE id = ?', [completed ? 1 : 0, id]);
}

export async function deleteHabit(id: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM habits WHERE id = ?', [id]);
}

// ============ OPERACIONES CRUD PARA PREFERENCIAS ============

export interface Preferences {
  id: number;
  theme: string;
  showAlerts: number;
  sortBy: string;
}

export async function getPreferences(): Promise<Preferences> {
  const database = await getDatabase();
  const prefs = await database.getFirstAsync<Preferences>('SELECT * FROM preferences WHERE id = 1');
  return prefs!;
}

export async function updateTheme(theme: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE preferences SET theme = ? WHERE id = 1', [theme]);
}

export async function updateShowAlerts(showAlerts: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE preferences SET showAlerts = ? WHERE id = 1', [showAlerts]);
}

export async function updateSortBy(sortBy: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE preferences SET sortBy = ? WHERE id = 1', [sortBy]);
}