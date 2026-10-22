# Teil 3 – State und Events

**Worum es geht:** Wie die App Daten im Speicher hält und auf Klicks und Eingaben reagiert. Im Skript ist das Punkt 3 des Walkthroughs: „Die Verwaltung des Zustands (State) und die Reaktion auf Benutzerereignisse (Events)“ (Folie 33). Dazu gehören zwei Kriterien der Bewertung: „State Management“ (6 Punkte) und „Dynamische Kernfunktion“ (10 Punkte, Folie 36).

## Dateien

| Datei | Aufgabe |
|---|---|
| `src/pages/TippenPage.jsx` | Kernfunktion: Tipps abgeben |
| `src/context/PlayerContext.jsx` | Globaler State: Spielerliste und ausgewählter Spieler |
| `src/hooks/useCurrentMatchday.js` | Eigener Hook: aktueller Spieltag |
| `src/pages/RanglistePage.jsx`, `SpielerPage.jsx` | Weitere Beispiele für State und Events |

## Was ist State?

State sind Daten, die sich ändern können und die Anzeige beeinflussen. In React legt man State mit `useState` an:

```jsx
const [message, setMessage] = useState(null);
```

- `message` ist der aktuelle Wert.
- `setMessage(neuerWert)` ändert ihn. Danach **zeichnet React die Komponente neu**. Das Neuladen der Seite ist dafür nicht nötig, und genau das verlangt die Mindestanforderung „Dynamisches Element“ (Folie 29).

## Schritt für Schritt: `TippenPage.jsx`

### 1. Der State der Seite

```jsx
const [matches, setMatches] = useState([]);   // Spiele vom Server
const [drafts, setDrafts] = useState({});     // Eingaben: { [matchId]: { home: '2', away: '1' } }
const [ranking, setRanking] = useState([]);   // Rangliste des Spieltags
const [loading, setLoading] = useState(true); // lädt gerade?
const [saving, setSaving] = useState(false);  // speichert gerade?
const [message, setMessage] = useState(null); // Erfolg oder Fehler
const [reloadKey, setReloadKey] = useState(0); // erhöhen = neu laden
```

`drafts` speichert die Eingaben als **Text**, nicht als Zahl. Ein leeres Feld ist dann einfach `''`, und auch Fehleingaben wie `'x'` lassen sich prüfen.

### 2. Daten laden mit `useEffect`

```jsx
useEffect(() => {
  if (!matchday) return;
  let cancelled = false;

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
```

- `useEffect(funktion, [abhängigkeiten])` führt die Funktion nach dem Rendern aus. Danach läuft sie **immer dann erneut, wenn sich eine Abhängigkeit ändert**: ein anderer Spieltag, ein anderer Spieler oder ein erhöhter `reloadKey`.
- `Promise.all` startet beide Anfragen gleichzeitig und wartet auf beide. Promises haben drei Zustände (pending, resolved, rejected), `.then` reagiert auf Erfolg, `.catch` auf Fehler (Folien 564–566).
- `player?.id` ist **Optional Chaining** (Folie 466): Gibt es keinen Spieler, ist das Ergebnis `undefined` statt eines Absturzes.
- **Die Aufräumfunktion** (`return () => { cancelled = true }`): Wechselt man schnell den Spieltag, könnte die alte Antwort nach der neuen ankommen und sie überschreiben. Vor jedem neuen Durchlauf setzt React deshalb `cancelled = true` für den alten Durchlauf, und dessen Antwort wird ignoriert.

### 3. Abgeleitete Werte statt doppeltem State

```jsx
const openMatches = matches.filter((m) => !m.locked);

const errors = {};
for (const match of openMatches) {
  const draft = drafts[match.id];
  const error = draft && validateTipInput(draft.home, draft.away);
  if (error) errors[match.id] = error;
}

const changedTips = openMatches.filter(…).map(…);
const myPoints = matches.reduce((sum, m) => sum + (m.points ?? 0), 0);
```

`errors`, `changedTips` und `myPoints` werden **bei jedem Rendern neu berechnet**. Sie liegen nicht im State. Würden sie dort zusätzlich liegen, müsste man sie bei jeder Eingabe von Hand aktualisieren und könnte das vergessen. So passen sie immer zu `matches` und `drafts`.

- `filter`, `map`, `reduce` sind die Array-Funktionen aus Folie 501.
- `m.points ?? 0` nimmt 0, wenn `points` `null` ist (Folie 465). Mit `||` wäre das hier zufällig gleich, aber `??` ist die genauere Wahl.

### 4. Events: auf den Nutzer reagieren

**Eingabe in ein Feld** (`onChange` in `GoalInput` → `onDraftChange` in `MatchCard` → hier):

```jsx
function handleDraftChange(matchId, draft) {
  setDrafts((prev) => ({ ...prev, [matchId]: draft }));
  setMessage(null);
}
```

`setDrafts((prev) => …)` bekommt den **vorherigen State** und gibt einen neuen zurück. Wir erzeugen ein neues Objekt, statt das alte zu verändern. Nur so erkennt React die Änderung.

**Spieltag wechseln:**

```jsx
function changeMatchday(day) {
  if (changedTips.length > 0 && !window.confirm('Du hast ungespeicherte Tipps. …')) return;
  navigate(`/tippen/${day}`);
}
```

Statt den Spieltag im State zu speichern, ändern wir die **URL**. `useParams()` liest den neuen Wert, und der `useEffect` lädt neu. Vorteil: Man kann `/tippen/12` als Link teilen.

**Formular absenden:**

```jsx
async function handleSubmit(event) {
  event.preventDefault(); // kein Neuladen der Seite
  if (!player || hasErrors || changedTips.length === 0) return;

  setSaving(true);
  try {
    const { saved } = await api.saveTips(player.id, changedTips);
    setMessage({ type: 'success', text: `${saved} … gespeichert. Viel Glück!` });
    setReloadKey((k) => k + 1);
  } catch (err) {
    setMessage({ type: 'error', text: err.message });
  } finally {
    setSaving(false);
  }
}
```

- `event.preventDefault()` verhindert das normale Verhalten des Browsers. Ein `<form>` würde die Seite sonst neu laden (Folie 643).
- `async`/`await` wartet auf die Antwort des Servers, ohne die Seite zu blockieren.
- `try`/`catch`/`finally` (Folie 560): Bei einem Fehler zeigen wir die Meldung an. `finally` läuft immer und setzt `saving` zurück.
- `setReloadKey(k => k + 1)` löst den `useEffect` erneut aus, und die frisch gespeicherten Tipps werden geladen.

## Globaler State: `PlayerContext.jsx`

Viele Seiten brauchen den ausgewählten Spieler: die Kopfzeile, die Tipp-Seite, die Rangliste und die Spieler-Seite. Statt ihn als Prop durch alle Ebenen zu reichen, gibt es einen **Context**:

```jsx
const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [playerId, setPlayerId] = useState(loadStoredPlayerId);
  …
  const player = players.find((p) => p.id === playerId) || null;
  const value = { players, player, setPlayerId, addPlayer, removePlayer, error };
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayers() {
  return useContext(PlayerContext);
}
```

- `PlayerProvider` umschließt die ganze App (`main.jsx`). Jede Komponente darunter bekommt mit `usePlayers()` Zugriff.
- `useState(loadStoredPlayerId)` liest beim Start die gespeicherte Auswahl aus dem **localStorage** des Browsers.
- Ein zweiter `useEffect` schreibt jede Änderung von `playerId` zurück in den localStorage. Nach einem Neuladen ist man also noch ausgewählt.
- `try`/`catch` um den localStorage, weil er in privaten Fenstern gesperrt sein kann.
- `player` wird abgeleitet: Es ist das Objekt zur gespeicherten ID.

## Eigener Hook: `useCurrentMatchday.js`

```js
// gekürzt: die Fehlerbehandlung (error) ist weggelassen
export function useCurrentMatchday() {
  const [current, setCurrent] = useState(null);
  useEffect(() => {
    api.getCurrentMatchday().then((data) => setCurrent(data.matchday));
  }, []);
  return { current, error };
}
```

Ein **Hook** ist eine Funktion, deren Name mit `use` beginnt und die andere Hooks benutzt. Die Tipp-Seite und die Rangliste brauchen beide den aktuellen Spieltag, deshalb steht der Code nur einmal hier. Das leere `[]` bedeutet: nur beim ersten Anzeigen ausführen.

## Weitere Beispiele

- **`SpielerPage.jsx`:** `touched` merkt sich, ob schon getippt wurde. Fehler erscheinen erst dann, sonst wäre das Feld beim Öffnen schon rot. `serverError` zeigt Fehler vom Server an, z. B. einen doppelten Namen.
- **`RanglistePage.jsx`:** `mode` (`'season'` oder `'matchday'`) steuert, ob die Gesamt- oder die Spieltagswertung geladen wird. Der Klick auf „Gesamt“ oder „Spieltag“ ändert `mode`, und der `useEffect` lädt neu.

## Begriffe, die du erklären können musst

- **State** und **Re-Rendern**
- **`useState`**, **`useEffect`** (mit Abhängigkeiten und Aufräumfunktion), **Context**, **eigener Hook**
- **Abgeleiteter Wert**
- **Event**, **Event-Handler**, **`preventDefault`** (Folien 639–643)
- **Promise**, **`async`/`await`** (Folien 564–566)
- **localStorage**

## Pferd-Kapitel zu diesem Teil

DOM (Folien 611, 622), Events (638, 646), JavaScript-Grundlagen (403, 427, 443, 450, 462, 476, 490, 512, 516, 534, 545). Siehe [LERNZETTEL.md](LERNZETTEL.md).

## Selbsttest

Diese Fragen haben wir uns zum Üben ausgedacht. Sie stammen nicht aus dem Skript.

<details><summary>Warum sieht man nach dem Speichern sofort den neuen Stand, ohne dass die Seite neu lädt?</summary>

`handleSubmit` verhindert mit `preventDefault()` das Neuladen. Nach dem Speichern erhöht es `reloadKey`. Der `useEffect` hat `reloadKey` als Abhängigkeit, lädt die Daten neu und setzt den State. React zeichnet daraufhin nur die geänderten Teile neu.
</details>

<details><summary>Wann läuft der <code>useEffect</code> in <code>TippenPage</code>?</summary>

Nach dem ersten Rendern und jedes Mal, wenn sich `matchday`, `player?.id` oder `reloadKey` ändert.
</details>

<details><summary>Warum stehen <code>errors</code> nicht im State?</summary>

Weil sie sich vollständig aus `drafts` berechnen lassen. Lägen sie zusätzlich im State, könnten beide auseinanderlaufen.
</details>

<details><summary>Wozu brauchen wir den Context, wenn es doch Props gibt?</summary>

Der ausgewählte Spieler wird an vielen Stellen gebraucht, die weit auseinanderliegen. Ohne Context müsste man ihn von `App` durch jede Ebene reichen.
</details>

<details><summary>Was passiert ohne <code>event.preventDefault()</code>?</summary>

Der Browser würde das Formular klassisch abschicken und die Seite neu laden. Der ganze State wäre weg.
</details>

## Zum Üben: selbst ändern

Zeig auf der Tipp-Seite unter der Überschrift an, wie viele Spiele noch offen sind. `openMatches.length` gibt es schon. Baue es in den Text neben „… von … Spielen getippt“ ein.
