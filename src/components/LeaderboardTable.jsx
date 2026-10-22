// Tabelle der Rangliste. Der ausgewählte Spieler wird hervorgehoben.
import './LeaderboardTable.css';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardTable({ rows, highlightId, compact = false }) {
  if (rows.length === 0) {
    return <p className="muted">Noch keine Spieler in der Tipprunde.</p>;
  }

  return (
    <div className="table-scroll">
      <table className={compact ? 'leaderboard leaderboard--compact' : 'leaderboard'}>
        <thead>
          <tr>
            <th scope="col">Platz</th>
            <th scope="col">Name</th>
            {!compact && <th scope="col" className="num hide-sm">Tipps</th>}
            {!compact && <th scope="col" className="num" title="Exakt richtige Ergebnisse">Volltreffer</th>}
            <th scope="col" className="num">Punkte</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.playerId} className={row.playerId === highlightId ? 'is-me' : undefined}>
              <td>
                {/* Medaillen erst, wenn es Punkte gibt – sonst wären vor dem Spieltag alle "Gold" */}
                <span className="rank">{(row.points > 0 && MEDALS[row.rank]) || row.rank}</span>
              </td>
              <td>{row.name}</td>
              {!compact && <td className="num hide-sm">{row.tips}</td>}
              {!compact && <td className="num">{row.exact}</td>}
              <td className="num points">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
