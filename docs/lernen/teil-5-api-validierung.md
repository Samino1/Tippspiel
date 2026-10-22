# Teil 5 – Externe API, Punktelogik und Validierung

**Worum es geht:** Woher die Spieldaten kommen, wie die Punkte berechnet werden und wie Eingaben geprüft werden. Dazu gehören zwei der drei Bonuspunkte: „Externe API“ und „Validierung“ (je bis 3 Punkte, Folie 36). Die vier Walkthrough-Punkte aus Folie 33 decken das nicht ab. Teil 5 ist **unser Vorschlag** für die fünfte Person.

## Dateien

| Datei | Aufgabe |
|---|---|
| `server/openligadb.js` | Spieldaten von OpenLigaDB holen und zwischenspeichern |
| `shared/scoring.js` | Punkte für einen Tipp, Rangliste bauen |
| `shared/validation.js` | Regeln für Namen und Tipps (Frontend und Backend) |

## Externe API: `server/openligadb.js`

OpenLigaDB (`https://api.openligadb.de`) ist kostenlos und braucht keinen Schlüssel. Wir nutzen drei Dinge daraus: alle Spiele der Saison, die Ergebnisse und den aktuellen Spieltag.

### 1. Daten holen mit `fetch` und `await`

```js
async function getJson(path) {
  const url = BASE_URL + path;
  const cached = cache.get(url);
  if (cached && Date.now() - cached.time < CACHE_MS) {
    return cached.data;              // jünger als 60 Sekunden: aus dem Cache
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenLigaDB antwortet mit Status ${response.status}`);
  }
  const data = await response.json();
  cache.set(url, { time: Date.now(), data });
  return data;
}
```

- `fetch` schickt eine HTTP-GET-Anfrage und liefert ein **Promise** (Folie 564).
- `await` wartet auf das Ergebnis, ohne das Programm zu blockieren. JavaScript läuft in einem Thread, Wartezeiten erledigt die Event Loop (Folien 567–581).
- `response.ok` ist bei 2XX-Statuscodes wahr. Sonst **werfen** wir einen Fehler (`throw`, Folie 562). Den fängt `handle` in `server/index.js` mit `try`/`catch` und antwortet mit 503.
- **Cache:** Eine `Map` (Folie 513) merkt sich pro URL die Daten und die Uhrzeit. Ist der Eintrag jünger als 60 Sekunden, fragen wir die API nicht erneut. Das macht die App schneller und schont die API.

### 2. Daten in unser Format bringen

```js
function toMatch(raw) {
  const final = raw.matchResults.find((r) => r.resultTypeID === 2); // 2 = Endergebnis
  return {
    id: raw.matchID,
    matchday: raw.group.groupOrderID,
    kickoff: raw.matchDateTimeUTC,
    finished: raw.matchIsFinished,
    home: { name: raw.team1.teamName, short: raw.team1.shortName, icon: raw.team1.teamIconUrl },
    away: { … },
    result: raw.matchIsFinished && final ? { home: final.pointsTeam1, away: final.pointsTeam2 } : null,
  };
}
```

OpenLigaDB liefert viele Felder mit eigenen Namen. `toMatch` macht daraus ein schlankes Objekt, das der Rest der App versteht. Ändert sich die API einmal, muss man nur diese Funktion anpassen. Der Ausdruck `bedingung ? a : b` ist der **Ternary-Operator** (Folie 464).

### 3. Die drei exportierten Funktionen

- `getSeasonMatches()`: alle 306 Spiele der Saison 2026/27 (`/getmatchdata/bl1/2026`)
- `getMatchdayMatches(matchday)`: filtert daraus einen Spieltag
- `getCurrentMatchday()`: der aktuelle Spieltag (`/getcurrentgroup/bl1`)

## Punktelogik: `shared/scoring.js`

### `scoreTip`

```js
export const POINTS = { exact: 3, difference: 2, tendency: 1 };

function tendency(home, away) {
  return Math.sign(home - away); // 1 Heimsieg, 0 Unentschieden, -1 Auswärtssieg
}

export function scoreTip(tip, result) {
  if (!result) return null;                                         // noch nicht gespielt
  if (tip.home === result.home && tip.away === result.away) return POINTS.exact;
  if (tip.home - tip.away === result.home - result.away) return POINTS.difference;
  if (tendency(tip.home, tip.away) === tendency(result.home, result.away)) return POINTS.tendency;
  return 0;
}
```

| Tipp | Ergebnis | Prüfung | Punkte |
|---|---|---|---|
| 2:1 | 2:1 | exakt gleich | 3 |
| 2:1 | 3:2 | Differenz +1 = +1 | 2 |
| 2:1 | 1:0 | Differenz +1 = +1 | 2 |
| 2:1 | 3:0 | Tendenz Heimsieg = Heimsieg | 1 |
| 1:1 | 2:2 | Differenz 0 = 0 | 2 |
| 2:1 | 0:1 | nichts stimmt | 0 |

Typischer Denkfehler: Tipp 2:1 gegen Ergebnis 1:0 ist nicht „nur Tendenz“. Die Tordifferenz ist beide Male +1, also gibt es 2 Punkte. Deshalb steht als Beispiel für die Tendenz 2:1 gegen 3:0.

`===` vergleicht Wert und Typ ohne Umwandlung (Folien 456–458).

### `buildLeaderboard`

```js
const matchById = new Map(matches.map((m) => [m.id, m]));
…
rows.sort((a, b) => b.points - a.points || b.exact - a.exact || a.name.localeCompare(b.name));
```

- Eine `Map` von Spiel-ID zu Spiel. Damit findet man zu jedem Tipp sein Spiel sofort, ohne jedes Mal das ganze Array zu durchsuchen.
- Sortierung: zuerst nach Punkten, bei Gleichstand nach Volltreffern, dann nach Name. `||` springt zur nächsten Regel, wenn der Vergleich davor `0` (gleich) ergibt.
- Gleiche Punkte und gleich viele Volltreffer ergeben den gleichen Platz.

## Validierung: `shared/validation.js`

### Warum zweimal prüfen?

- **Im Browser**, damit der Nutzer sofort Feedback bekommt: das Feld wird rot, eine Meldung erscheint, Speichern ist gesperrt.
- **Auf dem Server**, weil Anfragen auch ohne unsere Oberfläche kommen können, z. B. mit einem anderen HTTP-Client. CORS schützt das Backend nicht, laut Skript ist es „not a backend security feature“ (Folie 688).

Beide benutzen **dieselbe Datei**. So können die Regeln nie auseinanderlaufen.

### Die Regeln

```js
export const NAME_MIN = 2;
export const NAME_MAX = 20;
export const GOALS_MAX = 20;
const NAME_PATTERN = /^[\p{L}0-9 ._-]+$/u;
```

- `validatePlayerName(name)`: nicht leer, 2–20 Zeichen, nur Buchstaben (auch Umlaute, dafür `\p{L}` mit dem Flag `u`), Ziffern, Leerzeichen und `. _ -`
- `validateTip(tip)`: für den Server; `matchId` ist eine ganze Zahl, Tore sind ganze Zahlen von 0 bis 20 (`Number.isInteger`)
- `validateTipInput(home, away)`: für das Formular, die Eingaben sind noch Text. Beide leer heißt kein Tipp und ist erlaubt. Nur eines leer gibt „Bitte beide Felder ausfüllen.“. Nicht nur Ziffern gibt „Nur ganze Zahlen erlaubt.“.

Jede Funktion gibt eine **Fehlermeldung** oder `null` zurück. Die aufrufende Stelle zeigt die Meldung an (Frontend) oder schickt sie mit Status 400 zurück (Backend).

### Wo die Validierung benutzt wird

| Stelle | Was |
|---|---|
| `src/pages/SpielerPage.jsx` | `validatePlayerName` bei jeder Eingabe |
| `src/pages/TippenPage.jsx` | `validateTipInput` für jedes offene Spiel |
| `server/index.js` | `validatePlayerName` bei POST, `validateTip` bei PUT |

### HTML-Attribute (Folien 221, 223)

Zusätzlich beschreiben HTML-Attribute die erlaubte Eingabe:
- Namensfeld: `required`, `minLength={2}`, `maxLength={20}`
- Tor-Felder: `maxLength={2}`, `pattern="[0-9]{1,2}"`, `inputMode="numeric"`

Das Formular hat `noValidate`. Der Browser zeigt seine eigenen Blasen deshalb nicht an, weil wir eigene, einheitliche Meldungen anzeigen.

## Begriffe, die du erklären können musst

- **API**, **JSON**, **`fetch`**
- **Promise**, **`async`/`await`**, **Event Loop** (Folien 563–581)
- **Exception**, **`try`/`catch`**, **`throw`** (Folien 558–562)
- **Cache**
- **`Map`** (Folie 513), **Ternary** (464), **`===`** (456)
- **Clientseitige vs. serverseitige Validierung**
- **Regulärer Ausdruck** (`pattern`, `NAME_PATTERN`)

## Pferd-Kapitel zu diesem Teil

Exceptions (Folie 558), Promises und async/await mit Event Loop (563–581). Weil wir KI eingesetzt haben, auch „Coding with AI“ (93, 108, 110). Siehe [LERNZETTEL.md](LERNZETTEL.md).

## Selbsttest

Diese Fragen haben wir uns zum Üben ausgedacht. Sie stammen nicht aus dem Skript.

<details><summary>Was passiert, wenn OpenLigaDB nicht erreichbar ist?</summary>

`fetch` schlägt fehl oder `response.ok` ist falsch, und `getJson` wirft einen Fehler. `handle` in `server/index.js` fängt ihn und antwortet mit 503 und einer Meldung. Das Frontend zeigt sie an, die App stürzt nicht ab.
</details>

<details><summary>Wie viele Punkte gibt Tipp 0:0 bei Ergebnis 1:1?</summary>

2 Punkte: nicht exakt, aber die Tordifferenz ist beide Male 0.
</details>

<details><summary>Warum prüft der Server, obwohl das Frontend schon prüft?</summary>

Das Frontend kann man umgehen, etwa mit einem eigenen HTTP-Client. Nur die Prüfung auf dem Server ist verlässlich.
</details>

<details><summary>Was macht <code>await</code>, und warum blockiert es nicht die ganze App?</summary>

Es pausiert nur die aktuelle `async`-Funktion, bis das Promise erfüllt ist. In der Zwischenzeit kann die Event Loop andere Aufgaben abarbeiten.
</details>

## Zum Üben: selbst ändern

Ändere in `shared/scoring.js` die Punkte auf `{ exact: 4, difference: 3, tendency: 2 }` und lade die Startseite und die Rangliste neu. Beide passen sich an, weil alles `POINTS` benutzt. Danach wieder zurückstellen.
