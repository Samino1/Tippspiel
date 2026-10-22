// Kernfunktion: Tipps für einen Spieltag abgeben.
// URL: /tippen (aktueller Spieltag) oder /tippen/12 (bestimmter Spieltag)
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { api } from '../api.js';
import { usePlayers } from '../context/PlayerContext.jsx';
import { useCurrentMatchday } from '../hooks/useCurrentMatchday.js';
import { validateTipInput } from '../../shared/validation.js';
import MatchCard from '../components/MatchCard.jsx';
import MatchdaySwitcher from '../components/MatchdaySwitcher.jsx';
import LeaderboardTable from '../components/LeaderboardTable.jsx';
import Notice from '../components/Notice.jsx';

// Gespeicherte Tipps aus der API in Formular-Werte (Strings) umwandeln
function toDrafts(matches) {
  const drafts = {};
  for (const match of matches) {
    drafts[match.id] = {
      home: match.tip ? String(match.tip.home) : '',
      away: match.tip ? String(match.tip.away) : '',
    };
  }
  return drafts;
}

export default function TippenPage() {
  const { matchday: matchdayParam } = useParams();
  const navigate = useNavigate();
  const { player } = usePlayers();
  const { current, error: currentError } = useCurrentMatchday();

  // Spieltag aus der URL, sonst der aktuelle
  const matchday = Number(matchdayParam) || current;

  const [matches, setMatches] = useState([]);
  const [drafts, setDrafts] = useState({}); // { [matchId]: { home: '2', away: '1' } }
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [reloadKey, setReloadKey] = useState(0);

  // Spiele + Spieltags-Rangliste laden, sobald sich Spieltag oder Spieler ändern
  useEffect(() => {
    if (!matchday) return;
    let cancelled = false; // verhindert, dass eine alte, langsame Antwort neuere Daten überschreibt

    setLoading(true);
    Promise.all([api.getMatchday(matchday, player?.id), api.getLeaderboard(matchday)])
      .then(([matchData, rankingData]) => {
        if (cancelled) return;
        setMatches(matchData);
        setDrafts(toDrafts(matchData));
        setRanking(rankingData);
      })
      .catch((err) => !cancelled && setMessage({ type: 'error', text: err.message }))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [matchday, player?.id, reloadKey]);

  // ---------- abgeleitete Werte (werden bei jedem Rendern neu berechnet) ----------

  const openMatches = matches.filter((m) => !m.locked);

  const errors = {};
  for (const match of openMatches) {
    const draft = drafts[match.id];
    const error = draft && validateTipInput(draft.home, draft.away);
    if (error) errors[match.id] = error;
  }
  const hasErrors = Object.keys(errors).length > 0;

  // Geänderte, vollständig ausgefüllte Tipps
  const changedTips = openMatches
    .filter((m) => {
      const draft = drafts[m.id];
      if (!draft || draft.home === '' || draft.away === '' || errors[m.id]) return false;
      return !m.tip || String(m.tip.home) !== draft.home || String(m.tip.away) !== draft.away;
    })
    .map((m) => ({ matchId: m.id, home: Number(drafts[m.id].home), away: Number(drafts[m.id].away) }));

  const myPoints = matches.reduce((sum, m) => sum + (m.points ?? 0), 0);
  const tippedCount = matches.filter((m) => m.tip).length;

  // ---------- Event-Handler ----------

  function handleDraftChange(matchId, draft) {
    setDrafts((prev) => ({ ...prev, [matchId]: draft }));
    setMessage(null);
  }

  function changeMatchday(day) {
    if (changedTips.length > 0 && !window.confirm('Du hast ungespeicherte Tipps. Trotzdem den Spieltag wechseln?')) {
      return;
    }
    setMessage(null);
    navigate(`/tippen/${day}`);
  }

  async function handleSubmit(event) {
    event.preventDefault(); // kein Neuladen der Seite
    if (!player || hasErrors || changedTips.length === 0) return;

    setSaving(true);
    try {
      const { saved } = await api.saveTips(player.id, changedTips);
      setMessage({ type: 'success', text: `${saved} ${saved === 1 ? 'Tipp' : 'Tipps'} gespeichert. Viel Glück!` });
      setReloadKey((k) => k + 1); // Daten neu laden
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  // ---------- Anzeige ----------

  if (currentError && !matchday) return <Notice type="error">{currentError}</Notice>;
  if (!matchday) return <p className="muted">Lade aktuellen Spieltag …</p>;

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>{matchday}. Spieltag</h1>
          <p className="muted">
            {player
              ? `${player.name}: ${tippedCount} von ${matches.length} Spielen getippt · ${myPoints} Punkte an diesem Spieltag`
              : 'Wähle oben rechts aus, wer tippt.'}
          </p>
        </div>
        <MatchdaySwitcher value={matchday} current={current} onChange={changeMatchday} />
      </div>

      {!player && (
        <Notice type="info">
          Noch kein Spieler ausgewählt. Wähle deinen Namen oben im Menü oder <Link to="/spieler">lege dich neu an</Link>.
        </Notice>
      )}

      <div className="tippen-grid">
        <form onSubmit={handleSubmit} className="tippen-form" noValidate>
          {loading && matches.length === 0 ? (
            <p className="muted">Lade Spiele …</p>
          ) : (
            <div className={loading ? 'match-list is-loading' : 'match-list'}>
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  draft={drafts[match.id] || { home: '', away: '' }}
                  error={errors[match.id]}
                  disabled={!player}
                  onDraftChange={handleDraftChange}
                />
              ))}
            </div>
          )}

          {openMatches.length > 0 && (
            <div className="save-bar">
              <Notice type={message?.type}>{message?.text}</Notice>
              <button
                type="submit"
                className="button button--primary"
                disabled={!player || saving || hasErrors || changedTips.length === 0}
              >
                {saving ? 'Speichere …' : `Tipps speichern${changedTips.length ? ` (${changedTips.length})` : ''}`}
              </button>
            </div>
          )}
          {openMatches.length === 0 && message && <Notice type={message.type}>{message.text}</Notice>}
        </form>

        <aside className="card">
          <h2>Rangliste {matchday}. Spieltag</h2>
          <LeaderboardTable rows={ranking} highlightId={player?.id} compact />
          <Link to="/rangliste" className="link-more">
            Zur Gesamtwertung →
          </Link>
        </aside>
      </div>
    </div>
  );
}
