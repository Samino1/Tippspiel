// Eine Partie mit beiden Teams, Anstoßzeit, Tipp-Eingabe und – wenn beendet – Ergebnis und Punkten.
import GoalInput from './GoalInput.jsx';
import TeamBadge from './TeamBadge.jsx';
import './MatchCard.css';

const dateFormat = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const POINT_LABELS = { 3: 'Volltreffer', 2: 'Tordifferenz', 1: 'Tendenz', 0: 'Daneben' };

export default function MatchCard({ match, draft, error, disabled, onDraftChange }) {
  const { home, away, result, locked, points } = match;
  const inputDisabled = locked || disabled;

  function update(side, value) {
    onDraftChange(match.id, { ...draft, [side]: value });
  }

  return (
    <article className={`match-card${locked ? ' match-card--locked' : ''}${error ? ' match-card--error' : ''}`}>
      <header className="match-card__meta">
        <time dateTime={match.kickoff}>{dateFormat.format(new Date(match.kickoff))}</time>
        {result && <span className="tag tag--result">Endstand {result.home}:{result.away}</span>}
        {locked && !result && <span className="tag tag--live">läuft / gesperrt</span>}
      </header>

      <div className="match-card__body">
        <TeamBadge team={home} />

        <div className="match-card__score">
          <GoalInput
            value={draft.home}
            onChange={(v) => update('home', v)}
            disabled={inputDisabled}
            invalid={Boolean(error)}
            label={`Tore ${home.name}`}
          />
          <span className="match-card__colon">:</span>
          <GoalInput
            value={draft.away}
            onChange={(v) => update('away', v)}
            disabled={inputDisabled}
            invalid={Boolean(error)}
            label={`Tore ${away.name}`}
          />
        </div>

        <TeamBadge team={away} align="right" />
      </div>

      {error && <p className="match-card__error" role="alert">{error}</p>}

      {points !== null && (
        <footer className={`match-card__points points--${points}`}>
          +{points} {points === 1 ? 'Punkt' : 'Punkte'} · {POINT_LABELS[points]}
        </footer>
      )}
      {locked && result && points === null && <footer className="match-card__points points--none">Kein Tipp abgegeben</footer>}
    </article>
  );
}
