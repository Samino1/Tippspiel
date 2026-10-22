// Rangliste: Gesamtwertung der Saison oder Wertung eines einzelnen Spieltags.
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { usePlayers } from '../context/PlayerContext.jsx';
import { useCurrentMatchday } from '../hooks/useCurrentMatchday.js';
import LeaderboardTable from '../components/LeaderboardTable.jsx';
import MatchdaySwitcher from '../components/MatchdaySwitcher.jsx';
import Notice from '../components/Notice.jsx';

export default function RanglistePage() {
  const { player } = usePlayers();
  const { current } = useCurrentMatchday();

  const [mode, setMode] = useState('season'); // 'season' oder 'matchday'
  const [matchday, setMatchday] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  // Standard für die Spieltagswertung: der letzte Spieltag vor dem aktuellen (der ist schon gespielt)
  const selectedDay = matchday ?? Math.max(1, (current ?? 2) - 1);

  useEffect(() => {
    let cancelled = false;
    api
      .getLeaderboard(mode === 'matchday' ? selectedDay : null)
      .then((data) => {
        if (cancelled) return;
        setRows(data);
        setError(null);
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [mode, selectedDay]);

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Rangliste</h1>
          <p className="muted">
            {mode === 'season' ? 'Alle Punkte der Saison 2026/27' : `Nur Punkte vom ${selectedDay}. Spieltag`}
          </p>
        </div>

        <div className="toolbar">
          <div className="segmented" role="group" aria-label="Wertung">
            <button className={mode === 'season' ? 'is-active' : ''} onClick={() => setMode('season')}>
              Gesamt
            </button>
            <button className={mode === 'matchday' ? 'is-active' : ''} onClick={() => setMode('matchday')}>
              Spieltag
            </button>
          </div>
          {mode === 'matchday' && <MatchdaySwitcher value={selectedDay} current={current} onChange={setMatchday} />}
        </div>
      </div>

      <Notice type="error">{error}</Notice>

      <div className="card">
        <LeaderboardTable rows={rows} highlightId={player?.id} />
      </div>
      <p className="muted small">Bei Punktgleichheit entscheidet die Anzahl der Volltreffer.</p>
    </div>
  );
}
