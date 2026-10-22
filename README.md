# Tipprunde – Bundesliga-Tippspiel

Portfolio-Prüfung *Web Programmierung* (IV. Q. 26).

**Idee in einem Satz:** Eine Tipprunde für die Bundesliga, in der man Ergebnisse tippt, die echten Ergebnisse automatisch geladen werden und die Rangliste sich selbst berechnet.

## Starten

Voraussetzung: **Node.js ≥ 24** (Vorgabe im Skript, Folie 41) und eine Internetverbindung, weil die Spieldaten live von OpenLigaDB kommen.

```bash
git clone <repo-url>
cd tippspiel
npm install
npm run dev
```

Danach <http://localhost:5173> öffnen. `npm run dev` startet Frontend (Vite, Port 5173) und Backend (Express, Port 3001) gleichzeitig.

| Befehl | Was passiert |
|---|---|
| `npm run dev` | Frontend und Backend im Entwicklungsmodus |
| `npm run build` | Produktions-Build nach `dist/` |
| `npm start` | Backend liefert API und den fertigen Build aus `dist/` auf <http://localhost:3001> aus |
| `npm run seed` | Demo-Spieler mit Tipps für alle schon gespielten Partien anlegen |
| `npm run reset` | Alle Spieler und Tipps löschen (beim nächsten Start kommen wieder Demo-Daten) |

Beim ersten Start ist die Datenbank leer. Der Server legt dann automatisch vier Demo-Spieler an, damit die Rangliste nicht leer ist.

## Funktionen

- **Landing Page** (`/`): Zweck, Bedienung in 3 Schritten, Punkteregeln, aktuelle Top 3
- **Tippen** (`/tippen/:spieltag`): Spieltag wechseln, Ergebnisse eintragen, speichern. Nach dem Anpfiff ist das Spiel gesperrt. Beendete Spiele zeigen Endstand und Punkte.
- **Rangliste** (`/rangliste`): Gesamtwertung oder einzelner Spieltag, der eigene Name ist hervorgehoben
- **Spieler** (`/spieler`): Spieler anlegen (mit Validierung), auswählen, löschen. Ein Login gibt es nicht, man wählt einfach seinen Namen aus.

### Punkteregeln

| Punkte | Wann | Beispiel |
|---|---|---|
| 3 | Exaktes Ergebnis | Tipp 2:1, Ergebnis 2:1 |
| 2 | Richtige Tordifferenz | Tipp 2:1, Ergebnis 3:2 |
| 1 | Richtige Tendenz (Sieg/Remis/Niederlage) | Tipp 2:1, Ergebnis 1:0 |

Bei Punktgleichheit entscheidet die Anzahl der Volltreffer.

## Technik

| Bereich | Technologie |
|---|---|
| Frontend | React 19, React Router, Vite, eigenes CSS (kein Framework) |
| Backend | Node.js + Express 5, REST-API unter `/api` |
| Datenbank | SQLite über das eingebaute Modul `node:sqlite`, also keine Installation nötig |
| Externe API | [OpenLigaDB](https://www.openligadb.de), kostenlos und ohne Key |
| Start | `concurrently` startet Frontend und Backend mit einem Befehl |

## Projektstruktur

```
tippspiel/
├── index.html              Einstieg für Vite
├── vite.config.js          Dev-Server + Proxy /api → Backend
├── shared/                 Code, den Frontend UND Backend nutzen
│   ├── scoring.js          Punktelogik + Rangliste
│   └── validation.js       Validierungsregeln
├── server/                 Backend
│   ├── index.js            Express-App mit allen API-Routen
│   ├── db.js               SQLite: Tabellen + Abfragen
│   ├── openligadb.js       Externe API + Cache
│   ├── seed.js / reset.js  Demo-Daten anlegen / löschen
│   └── data/               SQLite-Datei (wird automatisch angelegt, nicht in Git)
└── src/                    Frontend (React)
    ├── main.jsx            React starten, Router + Context einbinden
    ├── App.jsx             Routen
    ├── api.js              Alle fetch-Aufrufe ans Backend
    ├── context/            Globaler State (ausgewählter Spieler)
    ├── hooks/              Eigene Hooks
    ├── components/         Wiederverwendbare Bausteine (+ zugehöriges CSS)
    ├── pages/              Eine Datei pro Seite
    └── styles/global.css   Farben, Layout, Buttons, Formulare
```

## REST-API

| Methode | Pfad | Zweck |
|---|---|---|
| GET | `/api/matchdays/current` | Aktueller Spieltag |
| GET | `/api/matchdays/:nr?playerId=` | Spiele eines Spieltags mit Tipp und Punkten des Spielers |
| GET | `/api/players` | Alle Spieler |
| POST | `/api/players` | Spieler anlegen (`{ name }`) |
| DELETE | `/api/players/:id` | Spieler und seine Tipps löschen |
| PUT | `/api/players/:id/tips` | Tipps eines Spielers speichern (`{ tips: [{ matchId, home, away }] }`) |
| GET | `/api/leaderboard?matchday=` | Rangliste (Saison oder ein Spieltag) |

Mehr zur Aufteilung für die Präsentation steht in [docs/AUFTEILUNG.md](docs/AUFTEILUNG.md). Die festgelegten Projektregeln für KI-Tools stehen in [SYSTEM.md](SYSTEM.md) (siehe Skript, Folien 89 und 98).
