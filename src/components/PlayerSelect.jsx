// Auswahl "Wer tippt?" – statt Login reicht bei der Tipprunde die Namensauswahl.
import { usePlayers } from '../context/PlayerContext.jsx';

export default function PlayerSelect() {
  const { players, player, setPlayerId } = usePlayers();

  return (
    <label className="player-select">
      <span className="visually-hidden">Wer tippt?</span>
      <select
        value={player?.id ?? ''}
        onChange={(event) => setPlayerId(Number(event.target.value) || null)}
      >
        <option value="">– Wer tippt? –</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  );
}
