// Datenbank: SQLite über das in Node.js 24 eingebaute Modul node:sqlite.
// Es muss nichts extra installiert werden – die Datei wird beim ersten Start angelegt.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dataDir = fileURLToPath(new URL('./data/', import.meta.url));
mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(dataDir + 'tippspiel.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL UNIQUE COLLATE NOCASE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tips (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id  INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    match_id   INTEGER NOT NULL,
    home_goals INTEGER NOT NULL,
    away_goals INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (player_id, match_id)
  );
`);
db.exec('PRAGMA foreign_keys = ON');

// ---------- Spieler ----------

export function getPlayers() {
  return db.prepare('SELECT id, name FROM players ORDER BY name').all();
}

export function getPlayer(id) {
  return db.prepare('SELECT id, name FROM players WHERE id = ?').get(id);
}

export function findPlayerByName(name) {
  return db.prepare('SELECT id, name FROM players WHERE name = ?').get(name);
}

export function createPlayer(name) {
  const result = db.prepare('INSERT INTO players (name) VALUES (?)').run(name);
  return getPlayer(Number(result.lastInsertRowid));
}

export function deletePlayer(id) {
  return db.prepare('DELETE FROM players WHERE id = ?').run(id).changes > 0;
}

// ---------- Tipps ----------

// Alle Tipps (für die Rangliste), Spaltennamen passend für scoring.js
export function getAllTips() {
  return db
    .prepare('SELECT player_id AS playerId, match_id AS matchId, home_goals AS home, away_goals AS away FROM tips')
    .all();
}

export function getTipsOfPlayer(playerId) {
  return db
    .prepare('SELECT match_id AS matchId, home_goals AS home, away_goals AS away FROM tips WHERE player_id = ?')
    .all(playerId);
}

// Speichert einen Tipp oder überschreibt den bestehenden ("Upsert")
const upsertTip = db.prepare(`
  INSERT INTO tips (player_id, match_id, home_goals, away_goals)
  VALUES (?, ?, ?, ?)
  ON CONFLICT (player_id, match_id)
  DO UPDATE SET home_goals = excluded.home_goals,
                away_goals = excluded.away_goals,
                updated_at = datetime('now')
`);

export function saveTips(playerId, tips) {
  // Transaktion: entweder werden alle Tipps gespeichert oder keiner
  db.exec('BEGIN');
  try {
    for (const tip of tips) {
      upsertTip.run(playerId, tip.matchId, tip.home, tip.away);
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
