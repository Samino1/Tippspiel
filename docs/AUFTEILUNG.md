# Prüfung & Aufteilung

Alle Angaben stammen aus dem Skript „Web Programmierung“ (Felix Leber, IV. Q. 26). Die Foliennummern stehen jeweils dabei. Was **unser Vorschlag** ist und nicht im Skript steht, ist so gekennzeichnet.

## Ablauf am 16.12. (Folien 4, 30)

- Termin: 16.12.2026, 08:00–12:15, mündliche Prüfung in Gruppen
- **1. Starten:** Auf dem Prüfungsrechner `git clone`, `npm install`, `npm run dev`. Der Prüfer verifiziert den fehlerfreien Start.
- **2. Präsentation (ca. 15 Min.):** Konzept („Welches Problem löst eure App?“), Live-Demo, Code-Walkthrough
- **3. Fragerunde (ca. 5–10 Min.):** Jede Person bekommt individuelle Fragen zum Projekt und zu allgemeinen Web-Technologien. Gefragt wird, was in den Folien mit dem Pferd markiert ist.

## 0 Punkte, wenn … (Folie 35)

- die App nicht startet,
- sie direkt nach dem Start abstürzt oder keine Mindestanforderung erfüllt,
- Plagiat nachgewiesen wird,
- die Gruppenmitglieder die grundlegende Funktionsweise des selbst geschriebenen Codes nicht erklären können.

Laut Folie 27 ist KI erlaubt und erwünscht. Wichtig ist, „dass ihr den generierten Code vollständig versteht und seine Funktionsweise erklären könnt“.

## Bewertung und wo die App sie erfüllt (Folien 34, 36)

Insgesamt gibt es 70 Punkte: 40 für das Projekt (gleich für alle), 30 für die Präsentation. Bestanden ist ab 35 Punkten.

| Kriterium | Max. | Wo in der App |
|---|---|---|
| Saubere Projektstruktur | 6 | `src/` (Frontend), `server/` (Backend), `shared/` (beides), Kommentare im Code |
| Komponenten & Wiederverwendbarkeit | 6 | `src/components/`: `MatchdaySwitcher` und `LeaderboardTable` werden auf mehreren Seiten genutzt |
| Styling & Responsiveness | 6 | `global.css` mit CSS-Variablen, Media Queries in `global.css`, `MatchCard.css`, `LeaderboardTable.css` |
| Landing Page | 6 | `src/pages/LandingPage.jsx`: Zweck, Bedienung in 3 Schritten, Punkteregeln |
| Dynamische Kernfunktion | 10 | `src/pages/TippenPage.jsx`: tippen, Spieltag wechseln, speichern, alles ohne Neuladen |
| State Management | 6 | `useState`/`useEffect` in den Seiten, `PlayerContext` für den ausgewählten Spieler |
| Routing | 5 | `src/App.jsx`: `/`, `/tippen/:matchday?`, `/rangliste`, `/spieler`, 404-Seite |
| Bonus Datenbank | bis 3 | SQLite (`server/db.js`) über ein Express-Backend |
| Bonus Externe API | bis 3 | OpenLigaDB (`server/openligadb.js`) |
| Bonus Validierung | bis 3 | `shared/validation.js` im Frontend und auf dem Server, mit Fehlermeldungen in der Oberfläche |

## Code-Walkthrough (Folie 33)

Laut Skript erklärt jedes Gruppenmitglied einen Teil des Codes. Wichtige Punkte sind:
1. die allgemeine Projektstruktur,
2. der Aufbau einer wichtigen Komponente,
3. die Verwaltung des Zustands (State) und die Reaktion auf Benutzerereignisse (Events),
4. die Anbindung an ein Backend oder eine Datenbank.

**Unser Vorschlag** für 5 Personen: die vier Punkte aus dem Skript plus einen fünften Teil für die externe API und die Validierung. Zu jedem Teil stehen die passenden Pferd-Kapitel daneben. Weil der Prüfer **jede Person** zu allgemeinen Web-Technologien fragt (Folie 30), sollten aber alle **alle** Pferd-Kapitel können.

### Teil 1 – Projektstruktur, Routing, Landing Page
**Dateien:** `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/components/Layout.jsx`, `src/pages/LandingPage.jsx`
- Ordneraufbau. `npm run dev` startet mit `concurrently` Frontend und Backend zusammen.
- Vite leitet `/api` an das Backend auf Port 3001 weiter. Frontend und API haben dadurch denselben Origin, und CORS spielt keine Rolle (Folien 685–689).
- `App.jsx`: Routen, optionaler Parameter `:matchday?`, `*` für die 404-Seite
- `Layout.jsx`: semantische Elemente `header`, `nav`, `main`, `footer` (Folie 182)

Pferd-Kapitel: Internet (Folien 53–65, u. a. OSI, IP, IPv4/IPv6, localhost, TCP/UDP), HTML (129–141, 146, 161, 179, 197, 201, 210), Aufbau einer JS-Datei und ES-Module (384), JavaScript laden (391)

### Teil 2 – Wichtige Komponente: `MatchCard` + Styling
**Dateien:** `src/components/MatchCard.jsx` (+ `.css`), `GoalInput.jsx`, `TeamBadge.jsx`, `MatchdaySwitcher.jsx`, `src/styles/global.css`
- Props rein (`match`, `draft`, `error`), Ereignis raus (`onDraftChange`)
- `MatchCard` setzt sich aus `TeamBadge` und `GoalInput` zusammen
- CSS: Grid, Flexbox, CSS-Variablen (Folie 321), Media Queries (Folien 369–371)

Pferd-Kapitel: CSS komplett (Folien 240–248, 253, 261, 263–264, 277, 285 Spezifität, 304 Einheiten, 322 Box Model/Layouts/Positioning, 361 Animationen, 368 Responsive Design)

### Teil 3 – State & Events
**Dateien:** `src/pages/TippenPage.jsx`, `src/context/PlayerContext.jsx`, `src/hooks/useCurrentMatchday.js`
- `useState` für Spiele, Eingaben und Meldungen. Fehler, geänderte Tipps und Punkte werden bei jedem Rendern aus dem State berechnet.
- `useEffect` lädt Daten neu, wenn Spieltag oder Spieler wechseln
- Events: `onChange` bei den Eingaben, `onSubmit` mit `event.preventDefault()` (Folie 643)
- Context für den ausgewählten Spieler, der im `localStorage` gemerkt wird

Pferd-Kapitel: DOM (611, 622), Events (638, 646), JavaScript-Grundlagen (403 Datentypen, 427 Variablen, 443 Operatoren, 450 Type Coercion, 462 Kontrollfluss, 476 Objekte, 490 Arrays, 512 Map/Set, 516 Funktionen, 534 Klassen, 545 Iteratoren)

### Teil 4 – Backend & Datenbank
**Dateien:** `server/index.js`, `server/db.js`, `server/seed.js`, `src/api.js`
- REST-Routen nach dem Muster aus Folie 723, die ID steht im Pfad (Folie 739):
  `GET /api/players`, `POST /api/players`, `DELETE /api/players/:id`, `PUT /api/players/:id/tips`
- Statuscodes (Folien 677–680): 2XX Erfolg (200, 201, 204), 400 Bad Request, 403 (Tipp nach Anpfiff), 404 Not Found, 503 (OpenLigaDB nicht erreichbar)
- SQLite über `node:sqlite`: Tabellen `players` und `tips`. Ein Tipp kann bis zum Anpfiff überschrieben werden.
- `src/api.js`: alle `fetch`-Aufrufe an einer Stelle

Pferd-Kapitel: HTTP (652–690, u. a. Methoden, Statuscodes, Cookies, CSP, Origin, CORS), Verbindung absichern (705), Authentifizierung (710), REST (720–740)

### Teil 5 – Externe API & Validierung
**Dateien:** `server/openligadb.js`, `shared/scoring.js`, `shared/validation.js`
- OpenLigaDB mit `fetch` und `async/await`, Zwischenspeicher für 60 Sekunden
- Punkte: 3 für das exakte Ergebnis, 2 für die richtige Tordifferenz, 1 für die richtige Tendenz
- Validierung mit demselben Code im Frontend und auf dem Server. Dazu kommen HTML-Attribute wie `pattern`, `required` und `maxlength` (Folien 221, 223).
- Fehlerbehandlung mit `try/catch` (Folie 560)

Pferd-Kapitel: Exceptions (558), Promises/async/await und Event Loop (563–581), Coding with AI (93, 108, 110)

## Termine (Folien 4, 37)

| Datum | Was |
|---|---|
| 11.11. | Vorlesung Node.js, Grundlagen Backend, Frameworks, common Pitfalls |
| 25.11. | Übung Backend / Q&A für die Prüfung, letzte Möglichkeit für Fragen |
| 06.12. | Abgabe des Projekts |
| 16.12. | Präsentation |

## Vor der Abgabe (aus den Mindestanforderungen, Folien 29, 30, 41)

- [ ] Auf einem **fremden Rechner**: `git clone` → `npm install` → `npm run dev` startet fehlerfrei
- [ ] `npm run build` läuft ohne Fehler durch
- [ ] Node.js ≥ 24 ist installiert
- [ ] Jede Person kann ihren Teil des Codes erklären
- [ ] **Unsere Empfehlung, nicht aus dem Skript:** Am 25.11. klären, ob der Prüfungsrechner Internet hat. Ohne Internet lädt die App keine Spieldaten.
