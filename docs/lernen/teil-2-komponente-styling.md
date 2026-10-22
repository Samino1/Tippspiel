# Teil 2 – Komponente `MatchCard` und Styling

**Worum es geht:** Wie eine wichtige Komponente aufgebaut ist und wie das Design funktioniert. Im Skript ist das Punkt 2 des Walkthroughs: „Der Aufbau einer wichtigen Komponente“ (Folie 33). Die Bewertung vergibt dafür „Komponenten & Wiederverwendbarkeit“ (6 Punkte) und „Styling & Responsiveness“ (6 Punkte, Folie 36).

## Dateien

| Datei | Aufgabe |
|---|---|
| `src/components/MatchCard.jsx` + `.css` | Ein Spiel: Teams, Anstoß, Eingabe, Ergebnis, Punkte |
| `src/components/GoalInput.jsx` | Ein Eingabefeld für Tore |
| `src/components/TeamBadge.jsx` | Wappen + Vereinsname |
| `src/components/MatchdaySwitcher.jsx` | Spieltag wechseln (‹ Auswahl ›) |
| `src/components/LeaderboardTable.jsx` + `.css` | Ranglisten-Tabelle |
| `src/components/Notice.jsx` | Hinweisbox (Erfolg, Fehler, Info) |
| `src/styles/global.css` | Farben, Grundlayout, Buttons, Formulare |

## Was ist eine Komponente?

Eine Komponente ist eine JavaScript-Funktion, die beschreibt, wie ein Teil der Oberfläche aussieht. Sie bekommt Daten als **Props** (Eigenschaften) und gibt JSX zurück, also HTML-ähnlichen Code. Ändern sich die Props, zeichnet React die Komponente neu.

## Schritt für Schritt: `MatchCard.jsx`

### Props: Daten rein, Ereignis raus

```jsx
export default function MatchCard({ match, draft, error, disabled, onDraftChange }) {
  const { home, away, result, locked, points } = match;
```

- `match`: das Spiel vom Server (Teams, Anstoß, Ergebnis, gesperrt?, Punkte)
- `draft`: was gerade in den zwei Feldern steht, z. B. `{ home: '2', away: '1' }`
- `error`: Fehlermeldung der Validierung oder `undefined`
- `disabled`: Eingabe gesperrt, z. B. weil kein Spieler ausgewählt ist
- `onDraftChange`: eine **Funktion**, die die Karte aufruft, wenn sich eine Eingabe ändert

`const { home, away, … } = match` ist **Destructuring** (Folie 488): Es holt die Eigenschaften in einzelne Variablen.

Wichtig: Die Karte **speichert selbst nichts**. Der State liegt in der Seite (`TippenPage`, siehe Teil 3). Die Karte zeigt nur an und meldet Änderungen nach oben.

### Eine Eingabe melden

```jsx
function update(side, value) {
  onDraftChange(match.id, { ...draft, [side]: value });
}
```

- `{ ...draft }` kopiert das alte Objekt (Spread-Operator, Folie 489).
- `[side]: value` überschreibt genau ein Feld, `'home'` oder `'away'`.
- Dann wird die Funktion der Seite aufgerufen. Die Seite aktualisiert ihren State, und React zeichnet die Karte mit den neuen Props neu.

### Zusammensetzen aus kleineren Komponenten

```jsx
<div className="match-card__body">
  <TeamBadge team={home} />
  <div className="match-card__score">
    <GoalInput value={draft.home} onChange={(v) => update('home', v)} … />
    <span className="match-card__colon">:</span>
    <GoalInput value={draft.away} onChange={(v) => update('away', v)} … />
  </div>
  <TeamBadge team={away} align="right" />
</div>
```

`TeamBadge` und `GoalInput` kommen je zweimal vor. Das ist **Wiederverwendung**.

### Bedingtes Rendern

```jsx
{result && <span className="tag tag--result">Endstand {result.home}:{result.away}</span>}
{error && <p className="match-card__error" role="alert">{error}</p>}
{points !== null && (
  <footer className={`match-card__points points--${points}`}>…</footer>
)}
```

`bedingung && <Element>` zeigt das Element nur, wenn die Bedingung wahr ist. So erscheint der Punkte-Footer nur bei beendeten, getippten Spielen.

Die CSS-Klasse `points--3`, `points--2` usw. wird mit einem **Template-String** (Backticks, `${…}`) zusammengebaut (Folie 408). Darüber kommt die Farbe: Gelb, Grün oder Blau.

### Datum formatieren

```js
const dateFormat = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', … });
dateFormat.format(new Date(match.kickoff)); // z. B. "Sa., 24.10., 15:30"
```

`Intl.DateTimeFormat` ist im Browser eingebaut. Es zeigt die Zeit in der Zeitzone des Nutzers.

## Die anderen Komponenten kurz

- **`GoalInput`**: ein **kontrolliertes Eingabefeld**. `value` kommt aus dem State, und `onChange` meldet jede Änderung. `inputMode="numeric"` zeigt auf dem Handy die Zahlentastatur, `maxLength={2}` und `pattern="[0-9]{1,2}"` beschreiben die erlaubte Eingabe direkt im HTML (Folien 221, 223). `aria-label` beschreibt das Feld für Screenreader, weil es keine sichtbare Beschriftung hat.
- **`TeamBadge`**: Wappen und Name. `onError` versteckt das Bild, falls es nicht lädt. Ob der lange oder der kurze Name sichtbar ist, entscheidet CSS (siehe unten).
- **`MatchdaySwitcher`**: `Array.from({ length: 34 }, (_, i) => i + 1)` erzeugt `[1, 2, …, 34]` (Folie 492). Die Pfeil-Buttons sind bei Spieltag 1 bzw. 34 `disabled`. Die Komponente wird auf der **Tipp-Seite und in der Rangliste** benutzt.
- **`LeaderboardTable`**: eine echte HTML-Tabelle, weil Ranglisten tabellarische Daten sind (Folie 190). Mit der Prop `compact` werden Spalten ausgeblendet; diese Variante steht auf der Startseite und neben den Tipps. `highlightId` hebt den ausgewählten Spieler hervor. Medaillen gibt es erst, wenn jemand Punkte hat.
- **`Notice`**: gibt `null` zurück, wenn es nichts anzuzeigen gibt. `role="alert"` lässt Screenreader Fehler sofort vorlesen.

## Styling

### CSS-Variablen (Folie 321)

```css
:root {
  --green-900: #063d27;
  --accent: #ffc83d;
  --radius: 12px;
}
.button--primary { background: var(--green-700); }
```

Alle Farben stehen einmal in `:root`. Will man das Grün ändern, ändert man eine Zeile.

### Klassen-Namen

Klassen wie `match-card__body` oder `button--primary` folgen einem Muster: `block__teil` für Teile einer Komponente, `block--variante` für Varianten. So sieht man am Namen, wozu die Regel gehört. Das sind **Klassen-Selektoren** (Folie 274).

### Layout mit Grid und Flexbox (Folien 337–345)

```css
.match-card__body {
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* Team | Ergebnis | Team */
}
.match-card__score {
  display: flex;
  align-items: center;
}
```

- **Grid** für die Karte: zwei gleich breite Spalten (`1fr`) für die Teams, in der Mitte so breit wie nötig (`auto`).
- **Flexbox** für die Eingabefelder nebeneinander.
- `.tippen-grid` setzt Spiele und Rangliste nebeneinander: `grid-template-columns: minmax(0, 1fr) 320px`.

### Responsive Design mit Media Queries (Folien 369–371)

```css
@media (max-width: 560px) {
  .team__name { display: none; }   /* langer Name aus */
  .team__short { display: block; } /* Kurzname an */
}
```

| Breite | Was passiert |
|---|---|
| unter 900 px | Rangliste rutscht unter die Spiele (`global.css`) |
| unter 720 px | Navigation wird zum Menü-Button (`global.css`) |
| unter 560 px | Wappen über dem Kurznamen (`MatchCard.css`) |
| unter 480 px | Tabelle blendet die Spalte „Tipps“ aus (`LeaderboardTable.css`) |

`display: none` nimmt ein Element komplett aus dem Layout (Folie 349).

### Spezifität am Beispiel (Folien 285–301)

```css
.leaderboard tr.is-me td { background: #fff6da; }
```

Die Regel hat 2 Klassen (`.leaderboard`, `.is-me`) und 2 Typ-Selektoren (`tr`, `td`). Sie ist damit spezifischer als z. B. `.leaderboard td` und gewinnt.

## Begriffe, die du erklären können musst

- **Komponente, Props, JSX**
- **Kontrolliertes Eingabefeld:** `value` aus dem State plus `onChange`
- **Bedingtes Rendern** mit `&&`
- **Box Model** (Folien 323–328): wir setzen `box-sizing: border-box` für alle Elemente
- **Flexbox vs. Grid:** Flex verteilt in einer Richtung, Grid in zwei (Folien 338, 342)
- **Media Query**, **CSS-Variable**, **Spezifität**

## Pferd-Kapitel zu diesem Teil

Das gesamte CSS-Kapitel: Folien 240–248, 253, 261, 263–264, 277, 285, 304, 322, 361, 368. Siehe [LERNZETTEL.md](LERNZETTEL.md).

## Selbsttest

Diese Fragen haben wir uns zum Üben ausgedacht. Sie stammen nicht aus dem Skript.

<details><summary>Wo liegt der State der Eingabefelder, in <code>MatchCard</code> oder in <code>TippenPage</code>? Warum?</summary>

In `TippenPage`. Die Seite braucht alle Eingaben auf einmal: zum Validieren, zum Zählen der Änderungen und zum Speichern. Die Karte zeigt nur an und meldet Änderungen per `onDraftChange`.
</details>

<details><summary>Was bedeutet <code>grid-template-columns: 1fr auto 1fr</code>?</summary>

Drei Spalten: Die äußeren teilen sich den freien Platz gleichmäßig (`1fr` = ein Anteil), die mittlere ist so breit wie ihr Inhalt.
</details>

<details><summary>Was ist der Unterschied zwischen <code>display: none</code> und <code>visibility: hidden</code>?</summary>

`display: none` nimmt das Element aus dem Layout. `visibility: hidden` macht es nur unsichtbar, der Platz bleibt (Folie 349).
</details>

<details><summary>Warum ist die Rangliste eine <code>&lt;table&gt;</code> und kein Grid aus <code>div</code>s?</summary>

Es sind echte tabellarische Daten. Laut Skript sollen Tabellen nur für Daten benutzt werden, nicht für das Seitenlayout (Folie 190).
</details>

## Zum Üben: selbst ändern

1. Ändere in `src/styles/global.css` die Farbe für Volltreffer (`.points--3`) und schau dir die Tipp-Seite eines vergangenen Spieltags an.
2. Ändere in `MatchCard.css` die Grenze `560px` auf `700px` und teste mit den DevTools (F12, Gerätesymbol), ab wann nur noch der Kurzname erscheint.
