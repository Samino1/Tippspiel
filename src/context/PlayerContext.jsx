// Globaler State: Liste der Spieler und wer gerade tippt.
// Über den Context können alle Komponenten darauf zugreifen, ohne Props durch viele Ebenen zu reichen.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';

const PlayerContext = createContext(null);
const STORAGE_KEY = 'tippspiel.playerId';

function loadStoredPlayerId() {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function PlayerProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [playerId, setPlayerId] = useState(loadStoredPlayerId);
  const [error, setError] = useState(null);

  const reloadPlayers = useCallback(async () => {
    try {
      setPlayers(await api.getPlayers());
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Beim ersten Laden der App die Spieler holen
  useEffect(() => {
    reloadPlayers();
  }, [reloadPlayers]);

  // Ausgewählten Spieler im Browser merken, damit er nach dem Neuladen noch da ist
  useEffect(() => {
    try {
      if (playerId) localStorage.setItem(STORAGE_KEY, String(playerId));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage nicht verfügbar (z.B. privates Fenster) – dann eben ohne Merken
    }
  }, [playerId]);

  async function addPlayer(name) {
    const player = await api.createPlayer(name);
    await reloadPlayers();
    setPlayerId(player.id); // neuer Spieler ist gleich ausgewählt
    return player;
  }

  async function removePlayer(id) {
    await api.deletePlayer(id);
    if (id === playerId) setPlayerId(null);
    await reloadPlayers();
  }

  // Abgeleiteter Wert: das Spieler-Objekt zur ausgewählten ID (falls es ihn noch gibt)
  const player = players.find((p) => p.id === playerId) || null;

  const value = { players, player, setPlayerId, addPlayer, removePlayer, error };
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

// Eigener Hook, damit Komponenten einfach "const { player } = usePlayers()" schreiben können
export function usePlayers() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayers muss innerhalb von <PlayerProvider> benutzt werden.');
  return context;
}
