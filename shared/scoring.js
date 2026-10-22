// Wird vom Backend (Rangliste) und vom Frontend (Punkteregeln auf der Landing Page) benutzt.
// Punktelogik des Tippspiels
//   3 Punkte: exaktes Ergebnis       (Tipp 2:1, Ergebnis 2:1)
//   2 Punkte: richtige Tordifferenz  (Tipp 2:1, Ergebnis 3:2)
//   1 Punkt:  richtige Tendenz       (Tipp 2:1, Ergebnis 3:0 – Heimsieg stimmt)
//   0 Punkte: sonst

export const POINTS = { exact: 3, difference: 2, tendency: 1 };

// Liefert -1 (Auswärtssieg), 0 (Unentschieden) oder 1 (Heimsieg)
function tendency(home, away) {
  return Math.sign(home - away);
}

// Berechnet die Punkte für einen Tipp. Gibt null zurück, solange das Spiel kein Ergebnis hat.
export function scoreTip(tip, result) {
  if (!result) return null;

  if (tip.home === result.home && tip.away === result.away) {
    return POINTS.exact;
  }
  if (tip.home - tip.away === result.home - result.away) {
    return POINTS.difference;
  }
  if (tendency(tip.home, tip.away) === tendency(result.home, result.away)) {
    return POINTS.tendency;
  }
  return 0;
}

// Baut die Rangliste aus Spielern, Tipps und Spielen.
// Optional nur für einen Spieltag (matchday), sonst die ganze Saison.
export function buildLeaderboard(players, tips, matches, matchday = null) {
  const matchById = new Map(matches.map((m) => [m.id, m]));

  const rows = players.map((player) => ({
    playerId: player.id,
    name: player.name,
    points: 0,
    exact: 0,
    tips: 0,
  }));
  const rowById = new Map(rows.map((r) => [r.playerId, r]));

  for (const tip of tips) {
    const match = matchById.get(tip.matchId);
    const row = rowById.get(tip.playerId);
    if (!match || !row) continue;
    if (matchday !== null && match.matchday !== matchday) continue;

    const points = scoreTip(tip, match.result);
    if (points === null) continue; // Spiel noch nicht beendet

    row.tips += 1;
    row.points += points;
    if (points === POINTS.exact) row.exact += 1;
  }

  // Sortierung: Punkte, dann Anzahl exakter Tipps, dann Name
  rows.sort((a, b) => b.points - a.points || b.exact - a.exact || a.name.localeCompare(b.name));

  // Platzierung vergeben (gleiche Punkte + gleiche Volltreffer = gleicher Platz)
  rows.forEach((row, i) => {
    const prev = rows[i - 1];
    row.rank = prev && prev.points === row.points && prev.exact === row.exact ? prev.rank : i + 1;
  });

  return rows;
}
