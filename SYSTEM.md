# SYSTEM.md – Regeln für dieses Projekt

Diese Datei gebt ihr KI-Tools (Claude, ChatGPT, Copilot, Cursor …) als Kontext mit. Das Skript empfiehlt das auf den Folien 89, 95 und 98: Den Stack bewusst festlegen, kurze Regeln in Markdown aufschreiben und die Datei mit Git versionieren.

## Stack (fest, nicht wechseln)
- Frontend: React 19 + Vite, Routing mit `react-router`, eigenes CSS (kein CSS-Framework)
- Backend: Node.js ≥ 24 + Express 5, REST-API unter `/api`
- Datenbank: SQLite über das eingebaute `node:sqlite`
- Externe API: OpenLigaDB (`server/openligadb.js`)
- Sprache: JavaScript mit ES-Modulen, kein TypeScript

## Regeln
- `npm install` + `npm run dev` und `npm run build` müssen auf einem fremden Rechner fehlerfrei laufen (Folie 29)
- Keine neuen Pakete ohne Absprache in der Gruppe
- Kleine Komponenten mit klarer Aufgabe in `src/components/`, eine Datei pro Seite in `src/pages/`
- Alle Backend-Aufrufe laufen über `src/api.js`
- Validierungsregeln stehen nur in `shared/validation.js`, Frontend und Backend nutzen dieselbe Datei
- REST: Ressource im Pfad, ID im Pfad, passende HTTP-Methode (Folien 723, 739)
- `const` vor `let`, kein `var` (Folie 434)
- Kommentare auf Deutsch, nur wo nötig
- Code nur übernehmen, wenn ihn jemand aus der Gruppe erklären kann (Folien 27, 35)
