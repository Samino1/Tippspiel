// Backend: kleiner Express-Server mit einer REST-API unter /api
// Im Entwicklungsmodus leitet Vite alle /api-Anfragen hierher weiter (siehe vite.config.js).
import express from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as db from './db.js';
import * as openLiga from './openligadb.js';
import { buildLeaderboard, scoreTip } from '../shared/scoring.js';
import { validatePlayerName, validateTip } from '../shared/validation.js';
import { seedIfEmpty } from './seed.js';

const PORT = process.env.API_PORT || 3001; // muss zum Proxy in vite.config.js passen
const app = express();
app.use(express.json());

// Hilfsfunktion: fängt Fehler aus async-Routen ab und schickt eine verständliche Antwort
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error(error);
    res.status(503).json({ error: 'Die Spieldaten konnten gerade nicht geladen werden. Bitte später erneut versuchen.' });
  }
};

// ---------- Spieltage & Spiele ----------

// GET /api/matchdays/current -> { season, matchday }
app.get('/api/matchdays/current', handle(async (req, res) => {
  const matchday = await openLiga.getCurrentMatchday();
  res.json({ season: openLiga.SEASON, matchday });
}));

// GET /api/matchdays/7?playerId=1 -> Spiele des Spieltags, inkl. Tipp und Punkte des Spielers
app.get('/api/matchdays/:matchday', handle(async (req, res) => {
  const matchday = Number(req.params.matchday);
  if (!Number.isInteger(matchday) || matchday < 1 || matchday > 34) {
    return res.status(400).json({ error: 'Spieltag muss zwischen 1 und 34 liegen.' });
  }

  const matches = await openLiga.getMatchdayMatches(matchday);
  const playerId = Number(req.query.playerId);
  const tips = playerId ? db.getTipsOfPlayer(playerId) : [];
  const tipByMatch = new Map(tips.map((t) => [t.matchId, t]));

  const now = Date.now();
  res.json(
    matches.map((match) => {
      const tip = tipByMatch.get(match.id) || null;
      return {
        ...match,
        locked: new Date(match.kickoff).getTime() <= now, // nach Anpfiff kein Tippen mehr
        tip: tip ? { home: tip.home, away: tip.away } : null,
        points: tip ? scoreTip(tip, match.result) : null,
      };
    }),
  );
}));

// ---------- Spieler ----------

app.get('/api/players', (req, res) => {
  res.json(db.getPlayers());
});

app.post('/api/players', (req, res) => {
  const error = validatePlayerName(req.body?.name);
  if (error) return res.status(400).json({ error });

  const name = req.body.name.trim();
  if (db.findPlayerByName(name)) {
    return res.status(400).json({ error: `„${name}“ ist schon in der Tipprunde.` });
  }
  res.status(201).json(db.createPlayer(name));
});

app.delete('/api/players/:id', (req, res) => {
  const deleted = db.deletePlayer(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Spieler nicht gefunden.' });
  res.status(204).end();
});

// ---------- Tipps ----------

// PUT /api/players/1/tips  Body: { tips: [{ matchId, home, away }] }
// Die Spieler-ID steht im Pfad (REST: Primär-ID gehört in den Pfad)
app.put('/api/players/:id/tips', handle(async (req, res) => {
  const playerId = Number(req.params.id);
  const { tips } = req.body || {};

  if (!db.getPlayer(playerId)) {
    return res.status(404).json({ error: 'Spieler nicht gefunden.' });
  }
  if (!Array.isArray(tips) || tips.length === 0) {
    return res.status(400).json({ error: 'Keine Tipps zum Speichern übergeben.' });
  }
  for (const tip of tips) {
    const error = validateTip(tip);
    if (error) return res.status(400).json({ error });
  }

  // Prüfen, ob die Spiele existieren und noch nicht angepfiffen sind
  const matches = await openLiga.getSeasonMatches();
  const matchById = new Map(matches.map((m) => [m.id, m]));
  for (const tip of tips) {
    const match = matchById.get(tip.matchId);
    if (!match) return res.status(400).json({ error: `Spiel ${tip.matchId} gibt es nicht.` });
    if (new Date(match.kickoff).getTime() <= Date.now()) {
      return res.status(403).json({
        error: `${match.home.short} – ${match.away.short} hat schon begonnen, der Tipp ist gesperrt.`,
      });
    }
  }

  db.saveTips(playerId, tips);
  res.json({ saved: tips.length });
}));

// ---------- Rangliste ----------

// GET /api/leaderboard            -> ganze Saison
// GET /api/leaderboard?matchday=5 -> nur Spieltag 5
app.get('/api/leaderboard', handle(async (req, res) => {
  const matchday = req.query.matchday ? Number(req.query.matchday) : null;
  const matches = await openLiga.getSeasonMatches();
  res.json(buildLeaderboard(db.getPlayers(), db.getAllTips(), matches, matchday));
}));

// Unbekannte API-Pfade
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Diesen API-Pfad gibt es nicht.' });
});

// Nach "npm run build" liefert der Server auch das fertige Frontend aus (npm start)
const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('/{*path}', (req, res) => res.sendFile(distDir + 'index.html'));
}

app.listen(PORT, async () => {
  console.log(`API läuft auf http://localhost:${PORT}`);
  await seedIfEmpty();
});
