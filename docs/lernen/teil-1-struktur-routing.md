# Teil 1 – Projektstruktur, Routing, Landing Page

**Worum es geht:** Wie ist das Projekt aufgebaut, wie startet es, und wie wechselt man zwischen den Seiten? Im Skript ist das Punkt 1 des Walkthroughs: „Die allgemeine Projektstruktur“ (Folie 33).

## Dateien

| Datei | Aufgabe |
|---|---|
| `package.json` | Projektbeschreibung, Pakete, Befehle (`npm run …`) |
| `vite.config.js` | Einstellungen für Dev-Server und Build (Vite) |
| `index.html` | Die einzige HTML-Seite der App |
| `src/main.jsx` | Startet React |
| `src/App.jsx` | Routen: welche URL zeigt welche Seite |
| `src/components/Layout.jsx` | Kopfzeile, Navigation, Fußzeile |
| `src/pages/LandingPage.jsx` | Startseite |
| `src/pages/NotFoundPage.jsx` | Seite für unbekannte URLs (404) |

## Schritt für Schritt

### 1. Ordneraufbau

```
src/      Frontend (React), läuft im Browser
server/   Backend (Express + Datenbank), läuft in Node.js
shared/   Code, den beide nutzen (Punktelogik, Validierung)
public/   Dateien, die unverändert ausgeliefert werden (Ball-Icon)
docs/     Dokumentation
```

In `src/` gibt es eine Datei pro Seite in `pages/`. Wiederverwendbare Bausteine liegen in `components/`, globaler State in `context/`, eigene Hooks in `hooks/`.

### 2. `package.json`: die Befehle

```json
"type": "module",
"engines": { "node": ">=24" },
"scripts": {
  "dev": "concurrently -n api,web -c blue,green \"npm:dev:api\" \"npm:dev:web\"",
  "dev:api": "node --watch --disable-warning=ExperimentalWarning server/index.js",
  "dev:web": "vite",
  "build": "vite build",
  "start": "node --disable-warning=ExperimentalWarning server/index.js"
}
```

- `"type": "module"` heißt: Alle `.js`-Dateien sind ES-Module mit `import`/`export` (Skript Folien 385–389, 593).
- `npm run dev` startet mit dem Paket **concurrently** zwei Befehle gleichzeitig:
  - `dev:api` startet das Backend. `--watch` startet es bei jeder Code-Änderung neu.
  - `dev:web` startet Vite, den Dev-Server für das Frontend.
- `npm run build` erzeugt mit Vite die fertige Version im Ordner `dist/`. Das ist eine Mindestanforderung (Folie 29).
- `npm start` startet nur das Backend. Es liefert dann auch das gebaute Frontend aus `dist/` aus.

### 3. `vite.config.js`: der Proxy

```js
server: {
  port: 5173,
  proxy: {
    '/api': 'http://localhost:3001',
  },
},
```

Der Browser fragt alles bei `localhost:5173` an. Beginnt der Pfad mit `/api`, leitet Vite die Anfrage an das Backend auf Port 3001 weiter. Für den Browser kommt so alles vom **selben Origin** (Protokoll, Host und Port, Folie 685). Deshalb sind keine CORS-Header nötig (Folien 688–689).

### 4. `index.html`: die einzige HTML-Seite

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Tipprunde – Bundesliga-Tippspiel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- `<!doctype html>` sagt dem Parser, wie er das Dokument lesen soll (Folien 142–145).
- `meta charset` legt den Zeichensatz fest, `title` den Text im Browser-Tab (Folien 150–152).
- `<div id="root">` ist leer. React füllt es.
- `type="module"`, weil wir ES-Module benutzen (Folie 395).

### 5. `src/main.jsx`: React starten

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </BrowserRouter>
  </StrictMode>,
);
```

- `document.getElementById('root')` holt das Element aus dem DOM (Folie 623).
- `BrowserRouter` macht das Routing möglich.
- `PlayerProvider` stellt den ausgewählten Spieler allen Seiten bereit (siehe Teil 3).

### 6. `src/App.jsx`: die Routen

```jsx
<Routes>
  <Route element={<Layout />}>
    <Route index element={<LandingPage />} />
    <Route path="tippen/:matchday?" element={<TippenPage />} />
    <Route path="rangliste" element={<RanglistePage />} />
    <Route path="spieler" element={<SpielerPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

- `index` ist die Startseite (`/`).
- `:matchday?` ist ein **URL-Parameter**. Das `?` macht ihn optional: `/tippen` und `/tippen/12` funktionieren beide. Die Seite liest ihn mit `useParams()`.
- `*` fängt jede unbekannte URL ab und zeigt die 404-Seite.
- Alle Routen liegen in der Route mit `<Layout />`. Deshalb haben alle Seiten dieselbe Kopf- und Fußzeile.

**Warum lädt die Seite beim Klicken nicht neu?** React Router fängt Klicks auf Links ab, ändert die URL und tauscht nur die angezeigte Komponente aus. Das nennt man **Single-Page-Application** (SPA), und die Aufgabe verlangt genau das (Folie 26).

### 7. `src/components/Layout.jsx`: der Rahmen

```jsx
<header className="header">…<nav>…</nav></header>
<main className="container main">
  <Outlet />
</main>
<footer className="footer">…</footer>
```

- `header`, `nav`, `main` und `footer` sind **semantische HTML-Elemente** (Folie 182). Sie helfen Screenreadern und Suchmaschinen (Folie 181).
- `<Outlet />` ist die Stelle, an der die aktuelle Seite erscheint.
- `NavLink` ist ein Link, der automatisch die Klasse `active` bekommt, wenn man auf dieser Seite ist. Deshalb ist der aktive Menüpunkt gelb.
- Das Handy-Menü hängt an `const [menuOpen, setMenuOpen] = useState(false)`. Ein Klick auf den Button schaltet den Wert um, und die CSS-Klasse `nav--open` blendet die Navigation ein.
- `aria-expanded` sagt Screenreadern, ob das Menü offen ist (ARIA, Folien 233–236).

### 8. `src/pages/LandingPage.jsx`: die Startseite

- Die Mindestanforderung lautet: eine Startseite, „die den Zweck und die Bedienung der Anwendung erklärt“ (Folie 29). Dafür gibt es drei Bereiche:
  - oben einen Kopfbereich mit Titel und zwei Buttons,
  - „So funktioniert’s“ in drei Schritten,
  - die Punkteregeln.
- Die Schritte stehen im Array `STEPS` und werden mit `.map()` zu Elementen (Folie 501). Jedes Element braucht ein eindeutiges `key`, damit React die Elemente auseinanderhalten kann.
- Die Punkte kommen aus `POINTS` in `shared/scoring.js`. Ändert man dort die Punkte, passt sich die Startseite automatisch an.
- `useEffect` lädt beim ersten Anzeigen die Top 3 der Rangliste.

## Begriffe, die du erklären können musst

- **SPA:** eine einzige HTML-Seite, JavaScript tauscht den Inhalt aus, ohne neu zu laden
- **Route / URL-Parameter:** Zuordnung von URL zu Komponente; `:matchday` ist ein variabler Teil der URL
- **npm-Skript:** ein Befehl aus `package.json`, gestartet mit `npm run <name>`
- **ES-Modul:** eine Datei mit `import`/`export` (Folie 593)
- **Origin / CORS:** Folien 685–689
- **Semantisches HTML:** Elemente nach ihrer Bedeutung wählen (Folie 162)

## Pferd-Kapitel zu diesem Teil

Internet (Folien 53–65), HTML (129–141, 146, 161, 179, 197, 201, 210), Aufbau einer JS-Datei (384), JavaScript laden (391). Alles zusammengefasst in [LERNZETTEL.md](LERNZETTEL.md).

## Selbsttest

Diese Fragen haben wir uns zum Üben ausgedacht. Sie stammen nicht aus dem Skript.

<details><summary>Was passiert bei <code>npm run dev</code>?</summary>

npm liest `scripts.dev` aus `package.json`. Dort startet `concurrently` zwei Befehle gleichzeitig: `dev:api` (das Express-Backend auf Port 3001) und `dev:web` (Vite auf Port 5173).
</details>

<details><summary>Warum gibt es keine CORS-Probleme, obwohl Frontend und Backend auf verschiedenen Ports laufen?</summary>

Der Browser spricht nur mit Vite auf Port 5173. Vite leitet `/api`-Anfragen im Hintergrund an Port 3001 weiter. Für den Browser ist das derselbe Origin.
</details>

<details><summary>Was macht <code>&lt;Outlet /&gt;</code>?</summary>

Es ist der Platzhalter im Layout. Dort zeigt React Router die Seite an, die zur aktuellen URL passt.
</details>

<details><summary>Warum braucht jedes Element aus <code>.map()</code> ein <code>key</code>?</summary>

Damit React beim erneuten Rendern erkennt, welches Element welches ist, und nur das Nötige im DOM ändert.
</details>

<details><summary>Was liegt nach <code>npm run build</code> in <code>dist/</code>?</summary>

Die fertige, optimierte App: eine `index.html` und gebündelte JS- und CSS-Dateien. Vite hat dafür alle Imports aufgelöst; so ein Werkzeug nennt man Bundler (Folie 607).
</details>

## Zum Üben: selbst ändern

Lege eine neue Seite `/regeln` an:
1. eine neue Datei in `src/pages/`,
2. eine neue `<Route>` in `App.jsx`,
3. einen Eintrag in `NAV_ITEMS` in `Layout.jsx`.

Wenn das klappt, hast du Routing verstanden.
