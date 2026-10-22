// Demo-Daten: legt Beispiel-Spieler mit Tipps für bereits gespielte Partien an,
// damit die Rangliste bei der Präsentation nicht leer ist.
// Läuft automatisch beim ersten Start (leere Datenbank) oder manuell mit "npm run seed".
import { pathToFileURL } from 'node:url';
import * as db from './db.js';
import { getSeasonMatches } from './openligadb.js';

const DEMO_PLAYERS = ['Alex', 'Kim', 'Sam', 'Jo'];

// Kleiner Zufallsgenerator mit festem Startwert -> jedes Mal dieselben Demo-Tipps
function createRandom(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

function randomGoals(random) {
  // Typische Fußballergebnisse: meistens 0–3 Tore
  return [0, 0, 1, 1, 1, 2, 2, 3, 4][Math.floor(random() * 9)];
}

export async function seed() {
  const matches = (await getSeasonMatches()).filter((m) => m.finished);
  const random = createRandom(42);

  for (const name of DEMO_PLAYERS) {
    const player = db.findPlayerByName(name) || db.createPlayer(name);
    const tips = matches.map((m) => ({ matchId: m.id, home: randomGoals(random), away: randomGoals(random) }));
    db.saveTips(player.id, tips);
  }
  console.log(`Demo-Daten: ${DEMO_PLAYERS.length} Spieler mit Tipps für ${matches.length} beendete Spiele angelegt.`);
}

export async function seedIfEmpty() {
  if (db.getPlayers().length > 0) return;
  try {
    await seed();
  } catch (error) {
    console.warn('Demo-Daten konnten nicht angelegt werden:', error.message);
  }
}

// Direkt ausgeführt (npm run seed)?
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await seed();
}
