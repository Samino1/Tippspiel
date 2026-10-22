// Spieltag wechseln: Pfeile für vor/zurück und ein Dropdown für 1–34.
// Wiederverwendet auf der Tipp-Seite und in der Rangliste.
const MATCHDAYS = Array.from({ length: 34 }, (_, i) => i + 1);

export default function MatchdaySwitcher({ value, onChange, current }) {
  return (
    <div className="switcher">
      <button
        className="button button--ghost"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Vorheriger Spieltag"
      >
        ‹
      </button>

      <select value={value} onChange={(event) => onChange(Number(event.target.value))} aria-label="Spieltag wählen">
        {MATCHDAYS.map((day) => (
          <option key={day} value={day}>
            {day}. Spieltag{day === current ? ' (aktuell)' : ''}
          </option>
        ))}
      </select>

      <button
        className="button button--ghost"
        onClick={() => onChange(value + 1)}
        disabled={value >= 34}
        aria-label="Nächster Spieltag"
      >
        ›
      </button>
    </div>
  );
}
