# Teil 4 – Backend und Datenbank

**Worum es geht:** der Server, die REST-API und die Datenbank. Im Skript ist das Punkt 4 des Walkthroughs: „Die Anbindung an ein Backend oder eine Datenbank“ (Folie 33). Dazu gehört der Bonus „Datenbank-Anbindung“ (bis 3 Punkte, Folie 36).

## Dateien

| Datei | Aufgabe |
|---|---|
| `server/index.js` | Express-App mit allen API-Routen |
| `server/db.js` | SQLite: Tabellen anlegen, Abfragen |
| `server/seed.js` | Demo-Daten beim ersten Start |
| `server/reset.js` | Datenbank leeren (`npm run reset`) |
| `src/api.js` | Frontend-Seite: alle `fetch`-Aufrufe ans Backend |

## Das Bild im Kopf

```
Browser ──HTTP──▶ Express (server/index.js) ──▶ SQLite (server/db.js)
                          │
                          └──▶ OpenLigaDB (siehe Teil 5)
```

Das Frontend schickt **HTTP-Anfragen** an `/api/...`. Express antwortet mit JSON. HTTP ist ein Request-Response-Protokoll im Client-Server-Modell (Folie 654).

## Schritt für Schritt: `server/index.js`

### 1. Express starten

```js
const PORT = process.env.API_PORT || 3001;
const app = express();
app.use(express.json());
…
app.listen(PORT, async () => {
  console.log(`API läuft auf http://localhost:${PORT}`);
  await seedIfEmpty();
});
```

- `express.json()` liest den JSON-Body einer Anfrage (bei POST und PUT). Danach steht er in `req.body`.
- `app.listen` startet den Server. Ist die Datenbank leer, legt `seedIfEmpty()` Demo-Spieler an.

### 2. Die REST-API

REST legt fest, wie man URL-Pfade benennt und HTTP-Methoden passend einsetzt (Folie 722). Das Muster aus dem Skript (Folie 723):

```
GET /todos   GET /todos/:id   POST /todos   PUT /todos/:id   DELETE /todos/:id
```

Unsere Routen:

| Methode | Pfad | Was passiert |
|---|---|---|
| GET | `/api/matchdays/current` | aktueller Spieltag |
| GET | `/api/matchdays/:matchday?playerId=1` | Spiele eines Spieltags, mit Tipp und Punkten des Spielers |
| GET | `/api/players` | alle Spieler |
| POST | `/api/players` | Spieler anlegen, Body `{ name }` |
| DELETE | `/api/players/:id` | Spieler und seine Tipps löschen |
| PUT | `/api/players/:id/tips` | Tipps speichern, Body `{ tips: [...] }` |
| GET | `/api/leaderboard?matchday=5` | Rangliste (ohne `matchday`: ganze Saison) |

- **Methoden** (Folie 675): GET holt Daten, POST legt etwas an, PUT aktualisiert, DELETE löscht.
- **ID im Pfad** (Folie 739): `/api/players/1/tips`, nicht `/api/tips?player=1`.
- **Query-Parameter** für Optionales (Folien 728–732): `?playerId=1`, `?matchday=5`.
- GET und DELETE haben **keinen Body** (Folie 725).
- PUT ist **idempotent**: Zweimal dieselben Tipps speichern ergibt denselben Zustand (Folie 739).

### 3. Eine Route genau gelesen: Tipps speichern

```js
app.put('/api/players/:id/tips', handle(async (req, res) => {
  const playerId = Number(req.params.id);   // :id aus der URL
  const { tips } = req.body || {};          // Body der Anfrage

  if (!db.getPlayer(playerId)) {
    return res.status(404).json({ error: 'Spieler nicht gefunden.' });
  }
  if (!Array.isArray(tips) || tips.length === 0) {
    return res.status(400).json({ error: 'Keine Tipps zum Speichern übergeben.' });
  }
  for (const tip of tips) {
    const error = validateTip(tip);          // gleiche Regeln wie im Frontend
    if (error) return res.status(400).json({ error });
  }

  const matches = await openLiga.getSeasonMatches();
  … // Gibt es das Spiel? Hat es schon begonnen? → sonst 400 bzw. 403

  db.saveTips(playerId, tips);
  res.json({ saved: tips.length });
}));
```

Die Route prüft der Reihe nach:
1. Gibt es den Spieler? Sonst **404**.
2. Sind Tipps dabei? Sonst **400**.
3. Ist jeder Tipp gültig? Sonst **400**.
4. Gibt es das Spiel, und hat es noch nicht begonnen? Sonst **400** bzw. **403**.
5. Erst dann wird gespeichert, Antwort **200** mit `{ saved: … }`.

### 4. Statuscodes (Folien 677–680)

| Code | Bedeutung | Bei uns |
|---|---|---|
| 200 | Erfolg | normale Antworten |
| 201 | Erfolg, etwas wurde angelegt | `POST /api/players` |
| 204 | Erfolg, keine Daten zurück | `DELETE /api/players/:id` |
| 400 | Bad Request | ungültige Eingabe, Name schon vergeben |
| 403 | Forbidden | Tipp nach Anpfiff |
| 404 | Not Found | Spieler oder API-Pfad gibt es nicht |
| 503 | Service Unavailable | OpenLigaDB nicht erreichbar |

2XX heißt Erfolg, 4XX ein Fehler auf der Client-Seite, 5XX ein Fehler auf der Server-Seite. 201 und 204 nennt das Skript nicht einzeln, sie gehören aber zu den 2XX-Erfolgscodes.

### 5. Fehler abfangen: `handle`

```js
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error(error);
    res.status(503).json({ error: 'Die Spieldaten konnten gerade nicht geladen werden. …' });
  }
};
```

Routen, die OpenLigaDB brauchen, laufen durch `handle`. Fällt die externe API aus, stürzt der Server nicht ab: Er antwortet mit 503 und einer verständlichen Meldung. `handle` ist eine Funktion, die eine Funktion zurückgibt (Funktionen sind „first class“, Folie 517).

## Schritt für Schritt: `server/db.js`

### 1. Verbindung

```js
import { DatabaseSync } from 'node:sqlite';
export const db = new DatabaseSync(dataDir + 'tippspiel.db');
```

`node:sqlite` ist in Node.js eingebaut. Es muss also **nichts installiert werden**, und `npm install` + `npm run dev` reichen auf jedem Rechner. Die Datei `server/data/tippspiel.db` entsteht beim ersten Start. In Git liegt sie nicht (`.gitignore`).

### 2. Tabellen

```sql
CREATE TABLE IF NOT EXISTS players (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL UNIQUE COLLATE NOCASE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tips (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id  INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  match_id   INTEGER NOT NULL,
  home_goals INTEGER NOT NULL,
  away_goals INTEGER NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (player_id, match_id)
);
```

- `IF NOT EXISTS`: Beim zweiten Start passiert nichts.
- `UNIQUE COLLATE NOCASE`: Ein Name darf nur einmal vorkommen, Groß-/Kleinschreibung egal („Kim“ = „kim“).
- `REFERENCES players(id) ON DELETE CASCADE`: Wird ein Spieler gelöscht, verschwinden auch seine Tipps. Dafür muss `PRAGMA foreign_keys = ON` gesetzt sein, das steht direkt darunter.
- `UNIQUE (player_id, match_id)`: pro Spieler und Spiel genau ein Tipp.
- Die Spiele selbst speichern wir **nicht**. Sie kommen immer frisch von OpenLigaDB, wir merken uns nur die `match_id`.

### 3. Abfragen mit Platzhaltern

```js
export function getPlayer(id) {
  return db.prepare('SELECT id, name FROM players WHERE id = ?').get(id);
}
```

- `prepare` bereitet die Abfrage vor. `?` ist ein Platzhalter, der Wert wird getrennt übergeben. So kann eine Eingabe nie selbst zu SQL werden.
- `.get()` liefert eine Zeile, `.all()` alle Zeilen, `.run()` führt INSERT/UPDATE/DELETE aus.

### 4. Upsert: anlegen oder überschreiben

```sql
INSERT INTO tips (player_id, match_id, home_goals, away_goals)
VALUES (?, ?, ?, ?)
ON CONFLICT (player_id, match_id)
DO UPDATE SET home_goals = excluded.home_goals,
              away_goals = excluded.away_goals,
              updated_at = datetime('now')
```

Gibt es den Tipp schon (Konflikt mit `UNIQUE`), wird er aktualisiert. `excluded` meint die Werte, die gerade eingefügt werden sollten. Deshalb kann man seinen Tipp bis zum Anpfiff beliebig oft ändern.

### 5. Transaktion

```js
db.exec('BEGIN');
try {
  for (const tip of tips) upsertTip.run(playerId, tip.matchId, tip.home, tip.away);
  db.exec('COMMIT');
} catch (error) {
  db.exec('ROLLBACK');
  throw error;
}
```

Entweder werden **alle** Tipps gespeichert oder **keiner**. Geht in der Mitte etwas schief, macht `ROLLBACK` alles rückgängig.

## Die Frontend-Seite: `src/api.js`

```js
async function request(path, options = {}) {
  const response = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `Fehler ${response.status}`);
  return data;
}

export const api = {
  saveTips: (playerId, tips) =>
    request(`/players/${playerId}/tips`, { method: 'PUT', body: JSON.stringify({ tips }) }),
  …
};
```

- Alle Anfragen gehen hier durch, die Komponenten kennen keine URLs.
- `Content-Type: application/json` sagt dem Server, dass JSON im Body steht (Folie 670).
- `JSON.stringify` macht aus einem Objekt Text, `response.json()` macht aus Text wieder ein Objekt.
- `response.ok` ist bei 2XX wahr. Sonst werfen wir einen Fehler mit der Meldung des Servers, den die Seite im `catch` anzeigt.

## Begriffe, die du erklären können musst

- **HTTP-Request/Response**, Methoden, Header, Body (Folien 652–675)
- **Statuscodes** (Folien 677–680)
- **REST** (Folien 720–740)
- **CORS / Origin** (Folien 685–689); bei uns verhindert der Vite-Proxy CORS-Probleme
- **Primärschlüssel**, **UNIQUE**, **Fremdschlüssel**
- **Upsert**, **Transaktion**, **Platzhalter (`?`)**
- **JSON**

## Pferd-Kapitel zu diesem Teil

HTTP (Folien 652–690), Verbindung absichern (705), Authentifizierung (710), REST (720). Siehe [LERNZETTEL.md](LERNZETTEL.md).

## Selbsttest

Diese Fragen haben wir uns zum Üben ausgedacht. Sie stammen nicht aus dem Skript.

<details><summary>Warum PUT und nicht POST zum Speichern der Tipps?</summary>

Wir aktualisieren die Tipps eines bestimmten Spielers, dessen ID im Pfad steht. Mehrfaches Senden ergibt dasselbe Ergebnis (idempotent). POST benutzen wir zum Anlegen eines neuen Spielers.
</details>

<details><summary>Was passiert, wenn jemand nach Anpfiff noch einen Tipp schickt, etwa mit einem eigenen Tool statt unserer Oberfläche?</summary>

Der Server vergleicht die Anstoßzeit von OpenLigaDB mit der aktuellen Zeit und antwortet mit 403. Die Sperre im Frontend ist nur Anzeige, die eigentliche Prüfung macht der Server.
</details>

<details><summary>Warum speichern wir die Spiele nicht in der Datenbank?</summary>

Sie gehören OpenLigaDB und ändern sich, etwa Ergebnisse oder Anstoßzeiten. Wir holen sie frisch (60 Sekunden zwischengespeichert) und speichern nur unsere eigenen Daten: Spieler und Tipps.
</details>

<details><summary>Was passiert mit den Tipps, wenn man einen Spieler löscht?</summary>

Sie werden mitgelöscht, wegen `ON DELETE CASCADE` und `PRAGMA foreign_keys = ON`.
</details>

## Zum Üben: selbst ändern

Baue eine Route `GET /api/players/:id`, die einen einzelnen Spieler liefert, oder 404, wenn es ihn nicht gibt. `db.getPlayer(id)` gibt es schon. Teste sie im Browser mit `http://localhost:5173/api/players/1`.
