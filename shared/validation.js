// Validierung – wird von Frontend UND Backend benutzt (gleiche Regeln an beiden Stellen).
// Das Frontend gibt damit sofort Feedback, der Server prüft trotzdem nochmal,
// weil Anfragen auch ohne unsere Oberfläche kommen könnten.

export const NAME_MIN = 2;
export const NAME_MAX = 20;
export const GOALS_MAX = 20;

const NAME_PATTERN = /^[\p{L}0-9 ._-]+$/u; // Buchstaben (auch Umlaute), Ziffern, Leerzeichen, . _ -

// Gibt eine Fehlermeldung zurück oder null, wenn alles passt
export function validatePlayerName(name) {
  if (typeof name !== 'string' || name.trim() === '') return 'Bitte gib einen Namen ein.';
  const trimmed = name.trim();
  if (trimmed.length < NAME_MIN) return `Der Name muss mindestens ${NAME_MIN} Zeichen haben.`;
  if (trimmed.length > NAME_MAX) return `Der Name darf höchstens ${NAME_MAX} Zeichen haben.`;
  if (!NAME_PATTERN.test(trimmed)) return 'Erlaubt sind Buchstaben, Ziffern, Leerzeichen und . _ -';
  return null;
}

export function validateGoals(value) {
  return Number.isInteger(value) && value >= 0 && value <= GOALS_MAX;
}

export function validateTip(tip) {
  if (!tip || !Number.isInteger(tip.matchId)) return 'Ungültige Spiel-ID.';
  if (!validateGoals(tip.home) || !validateGoals(tip.away)) {
    return `Tore müssen ganze Zahlen zwischen 0 und ${GOALS_MAX} sein.`;
  }
  return null;
}

// Für das Tipp-Formular im Frontend: prüft die zwei Eingabefelder (Strings).
// Beide leer = kein Tipp (ok). Rückgabe: Fehlermeldung oder null.
export function validateTipInput(home, away) {
  if (home === '' && away === '') return null;
  if (home === '' || away === '') return 'Bitte beide Felder ausfüllen.';
  if (!/^\d+$/.test(home) || !/^\d+$/.test(away)) return 'Nur ganze Zahlen erlaubt.';
  if (!validateGoals(Number(home)) || !validateGoals(Number(away))) {
    return `Höchstens ${GOALS_MAX} Tore pro Team.`;
  }
  return null;
}
