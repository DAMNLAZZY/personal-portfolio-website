import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Initialize SQLite database
const dbPath = path.resolve(process.cwd(), 'portfolio.db');
const db = new Database(dbPath, { verbose: console.log });

let isInitialized = false;

export function initDb() {
  if (isInitialized) return db;
  
  // Create tables if they don't exist
  
  // General Information
  db.exec(`
    CREATE TABLE IF NOT EXISTS general_info (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      about TEXT NOT NULL
    )
  `);

  try {
    db.exec('ALTER TABLE general_info ADD COLUMN image_url TEXT');
  } catch (e) {}

  try {
    db.exec('ALTER TABLE general_info ADD COLUMN resume_url TEXT');
  } catch (e) {}

  // Skills
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      level INTEGER NOT NULL,
      category TEXT
    )
  `);

  // Projects
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      link TEXT,
      tags TEXT
    )
  `);

  // Certifications
  db.exec(`
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      date TEXT,
      url TEXT,
      badge_image_url TEXT
    )
  `);

  // Experience
  db.exec(`
    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      duration TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

  // Blog
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `);

  // Insert default general info if empty
  const stmt = db.prepare('SELECT COUNT(*) as count FROM general_info');
  const result = stmt.get() as { count: number };
  
  if (result.count === 0) {
    const insert = db.prepare('INSERT INTO general_info (id, name, title, about) VALUES (?, ?, ?, ?)');
    insert.run(1, 'Jay Sanklecha', 'B.Tech Student in AI & Data Science', 'Passionate about exploring how AI and advanced data analysis can revolutionize decision-making. Building expertise to create innovative solutions that can revolutionize industries and make real-world impact.');
  }
  
  isInitialized = true;
  return db;
}

export default db;
