// Anbindung an die externe API OpenLigaDB (kostenlos, ohne API-Key).
// Doku: https://api.openligadb.de  bzw. https://github.com/OpenLigaDB/OpenLigaDB-Samples

export const LEAGUE = 'bl1'; // 1. Bundesliga
export const SEASON = 2026; // Saison 2026/27

const BASE_URL = 'https://api.openligadb.de';
const CACHE_MS = 60 * 1000; // Daten höchstens einmal pro Minute neu laden

// Einfacher In-Memory-Cache: URL -> { zeit, daten }
const cache = new Map();

async function getJson(path) {
  const url = BASE_URL + path;
  const cached = cache.get(url);
  if (cached && Date.now() - cached.time < CACHE_MS) {
    return cached.data;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenLigaDB antwortet mit Status ${response.status}`);
  }
  const data = await response.json();
  cache.set(url, { time: Date.now(), data });
  return data;
}

// Wandelt ein Spiel aus OpenLigaDB in ein schlankes Objekt für unsere App um.
function toMatch(raw) {
  // resultTypeID 2 = Endergebnis, 1 = Halbzeit
  const final = raw.matchResults.find((r) => r.resultTypeID === 2);
  return {
    id: raw.matchID,
    matchday: raw.group.groupOrderID,
    kickoff: raw.matchDateTimeUTC,
    finished: raw.matchIsFinished,
    home: { name: raw.team1.teamName, short: raw.team1.shortName, icon: raw.team1.teamIconUrl },
    away: { name: raw.team2.teamName, short: raw.team2.shortName, icon: raw.team2.teamIconUrl },
    result: raw.matchIsFinished && final ? { home: final.pointsTeam1, away: final.pointsTeam2 } : null,
  };
}

// Alle Spiele der Saison (306 Stück) – wird für die Rangliste gebraucht.
export async function getSeasonMatches() {
  const data = await getJson(`/getmatchdata/${LEAGUE}/${SEASON}`);
  return data.map(toMatch);
}

// Spiele eines einzelnen Spieltags (1–34)
export async function getMatchdayMatches(matchday) {
  const all = await getSeasonMatches();
  return all.filter((m) => m.matchday === matchday);
}

// Aktueller Spieltag laut OpenLigaDB
export async function getCurrentMatchday() {
  const data = await getJson(`/getcurrentgroup/${LEAGUE}`);
  return data.groupOrderID;
}
