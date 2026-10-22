// Alle Aufrufe an unser Backend an einer Stelle.
// Die Komponenten rufen nur diese Funktionen auf und müssen keine URLs kennen.

async function request(path, options = {}) {
  const response = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    // Der Server schickt bei Fehlern { error: "..." } – diese Meldung zeigen wir an
    throw new Error(data?.error || `Fehler ${response.status}`);
  }
  return data;
}

export const api = {
  getCurrentMatchday: () => request('/matchdays/current'),

  getMatchday: (matchday, playerId) =>
    request(`/matchdays/${matchday}` + (playerId ? `?playerId=${playerId}` : '')),

  getPlayers: () => request('/players'),

  createPlayer: (name) => request('/players', { method: 'POST', body: JSON.stringify({ name }) }),

  deletePlayer: (id) => request(`/players/${id}`, { method: 'DELETE' }),

  saveTips: (playerId, tips) => request(`/players/${playerId}/tips`, { method: 'PUT', body: JSON.stringify({ tips }) }),

  getLeaderboard: (matchday) => request('/leaderboard' + (matchday ? `?matchday=${matchday}` : '')),
};
