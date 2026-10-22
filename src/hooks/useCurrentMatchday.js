// Eigener Hook: fragt einmal beim Backend nach, welcher Spieltag gerade aktuell ist.
import { useEffect, useState } from 'react';
import { api } from '../api.js';

export function useCurrentMatchday() {
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getCurrentMatchday()
      .then((data) => setCurrent(data.matchday))
      .catch((err) => setError(err.message));
  }, []);

  return { current, error };
}
