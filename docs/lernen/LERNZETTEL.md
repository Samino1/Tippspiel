# Lernzettel: alle Pferd-Kapitel

In der Fragerunde (ca. 5–10 Minuten) fragt der Prüfer **jede Person einzeln** zum Projekt und zu allgemeinen Web-Technologien. Gefragt wird, was in den Folien mit dem Pferd markiert ist (Folie 30). Ein Pferd auf einer Kapitel-Titelfolie heißt, dass das ganze Kapitel relevant ist, ein Pferd auf einer einzelnen Folie meint nur diese Folie (Folien 31–32).

Dieser Zettel fasst alle markierten Inhalte zusammen, mit Foliennummern. Er ersetzt das Skript nicht: Bei Unklarheiten im Skript nachlesen.

---

## 1. Internet

**Provider (Folie 53)**
- Tier 1: AT&T, Century Link (Level3), Deutsche Telekom. Sie tauschen Datenverkehr nur mit anderen Tier-1-Providern aus.
- Tier 2: Vodafone, Comcast, lokale Telekommunikationsfirmen. Sie liefern den Verkehr an die Endkunden.
- Tier 3: kleine, lokale ISPs.

**OSI-Modell (Folie 54), von unten nach oben**

| Nr. | Schicht | Aufgabe |
|---|---|---|
| 1 | Physical | überträgt rohe Bits über das physische Medium |
| 2 | Data Link | legt das Format der Daten im Netz fest |
| 3 | Network | entscheidet, welchen Weg die Daten nehmen |
| 4 | Transport | überträgt Daten mit Protokollen wie TCP und UDP |
| 5 | Session | hält Verbindungen, steuert Ports und Sessions |
| 6 | Presentation | bringt Daten in ein nutzbares Format, hier passiert Verschlüsselung |
| 7 | Application | Schicht für die Mensch-Computer-Interaktion, hier greifen Anwendungen auf das Netz zu |

**IP (Folie 61):** Ein Router schickt Daten von Computer A über verschiedene Netzwerke zu Computer B. Es gibt mehrere mögliche Wege.

**IP-Adressen (Folien 62–63)**
- IPv4: 32 Bit, geschrieben als 4 Blöcke à 8 Bit (`1.2.3.4`), also 2³² ≈ 4,29 Milliarden Adressen
- IPv6: 128 Bit (`ffff:ffff:…:ffff`), also 2¹²⁸ Adressen
- *Hinweis:* Im Text von Folie 62 steht „8 32bit tuples“. Die Grafik zeigt 8 Blöcke `0x0000`, das sind je 16 Bit, und 8 × 16 ergibt 128 Bit.

**localhost (Folie 64):** `http://localhost`, `http://127.0.0.1/` (IPv4), `http://::1/` (IPv6)

**TCP / UDP (Folie 65)**
- **TCP** ist zustandsbehaftet (stateful): Die Verbindung beginnt mit einem Handshake `SYN` → `SYN-ACK` → `ACK`, und es geht von einem Sender an einen Empfänger (Unicast).
- **UDP** ist zustandslos (stateless): Anfrage und Antworten ohne Verbindungsaufbau, auch an alle (Broadcast) oder an mehrere (Multicast).

---

## 2. Coding with AI

**Was wird an die KI geschickt? (Folie 93)** Die geöffneten Dateien, markierter Code, die Struktur des Workspace/Repos, der Chatverlauf der Sitzung, Custom Instructions und Terminal-Ausgaben.

**Werkzeug-Typen (Folie 108, Beispiele auf Folie 106)**
- **Agent + Inline** (Cursor, GitHub Copilot): am besten, um wirklich programmieren zu lernen. Fühlt sich an wie selbst programmieren, nur schneller. Viel Kontrolle.
- **Full Agent** (OpenAI Codex, Claude Code): macht einen sehr schnell, wenn man weiß, was man tut. Kann aber mit voller Geschwindigkeit in die falsche Richtung laufen. Man braucht eine Vorstellung davon, was man will.
- **Platform** (Lovable, Superapp): am wenigsten Freiheit, vorgegebener Stack. Man kommt vielleicht ohne Programmierwissen ans Ziel, läuft vielleicht gegen eine Wand, oder beides.

**Modell auswählen (Folie 110):** Aktualität der Trainingsdaten, Geschwindigkeit, Genauigkeit, Kosten (Tokens, Preis).

---

## 3. HTML

**Der Name (Folien 129–130):** *Hypertext*, weil HTML Webseiten miteinander verlinkt. *Markup Language*, weil es die Struktur einer Seite beschreibt.

**Unterschiede zu XML (Folien 137–141)**
- Nicht alle Tags müssen geschlossen werden (z. B. `<link>`).
- Manche Tags schließen sich automatisch, je nachdem, was darin verschachtelt ist („tag omission“).
- Elemente und Attribute unterscheiden nicht zwischen Groß- und Kleinschreibung.
- Attribute dürfen verkürzt werden: `<option selected />` braucht keinen Wert.
- Fremde Inhalte wie SVG oder MathML müssen gültiges XML sein, weil der Parser dafür in den XML-Modus wechselt.

**Allgemeine Struktur (Kapitel ab Folie 146)**
- `<!DOCTYPE html>`, `<html>` (Wurzelknoten), `<head>`, `<body>`
- Im `<head>`: `<meta charset="utf-8">` (Zeichensatz, wird vom Parser vorab gelesen), `<meta name="keywords">` (für Suchmaschinen/SEO), `<title>` (Text im Tab), `<link rel="stylesheet">` (externes CSS, Tag wird nicht geschlossen), `<style>` (eingebettetes CSS), `<script>` (eingebettetes JS)
- `<body>`: der sichtbare Inhalt; `<!-- … -->` ist ein Kommentarknoten
- HTML ist ein Baum: Elemente sind Knoten oder Blätter, alles hängt am `html`-Knoten (Folie 160).

**Elemente (Kapitel ab Folie 161)**
- Elemente haben eine Bedeutung (Semantik) und sollen danach benutzt werden (Folie 162).
- Aufbau: Start-Tag, End-Tag, Tag-Name, Attribut, Attributwert, Inhalt/Kinder. Nicht alle Tags dürfen Kinder haben (Folien 164–172).
- Auto-Closing: Manche Blockelemente dürfen nicht verschachtelt werden. Aus `<p>Text <div></div></p>` macht der Parser `<p>Text</p><div></div><p></p>` (Folien 173–176).
- Bei `<br>` und `<img>` kann das End-Tag entfallen (Folien 177–178).

**Layout-Struktur (Kapitel ab Folie 179)**
- Layout heißt, Inhalte so anzuordnen, dass sie übersichtlich, verständlich und auf allen Bildschirmgrößen nutzbar sind (Folie 180).
- Semantische Layout-Elemente (Folie 182): `<header>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<details>`/`<summary>`; `<div>` ist ein Container ohne Bedeutung. Semantik ist wichtig für Barrierefreiheit (Screenreader) und SEO (Folie 181).
- **Block-Elemente** beginnen auf einer neuen Zeile, nehmen die volle Breite ein und stapeln sich: `<div>`, `<p>`, `<h1>`–`<h6>`, `<ul>`, `<form>` (Folie 185).
- **Inline-Elemente** stehen nebeneinander und sind so breit wie ihr Inhalt: `<span>`, `<a>`, `<img>`, `<strong>`, `<em>` (Folie 187). Leerraum zwischen Inline-Elementen wird zu einem Leerzeichen zusammengefasst (Folie 188).
- **Tabellen** nur für tabellarische Daten, nicht für das Seitenlayout; das gilt heute als veraltet (Folie 190). Bausteine: `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>` (Folie 191).

**Textformatierung (Kapitel ab Folie 197):** `<p>` Absatz, `<i>` kursiv, `<b>` fett, `<sub>`/`<sup>` tief/hoch gestellt; `<ruby>` für ostasiatische Aussprachehilfen; `<bdo dir="rtl">` für gemischte Schreibrichtungen.

**Links (Kapitel ab Folie 201)**
- `<a href="…">` (a = anchor, href = hyper reference)
- Sprung innerhalb der Seite: Element bekommt eine `id`, der Link zeigt auf `#id` (Folie 206).
- Extern: `http://google.com`; relativ zur aktuellen Seite: `./about.html`; relativ zum Host: `/index.html` (Folien 207–209). Das Attribut `target` bestimmt, ob ein neues Fenster aufgeht.

**Inhalte einbetten (Kapitel ab Folie 210):** `<picture>` mit `<source media srcset>` je nach Viewport-Breite (Folie 212), `<video>` und `<audio>` mit mehreren `<source>`; der Browser nimmt die erste, die er kann (Folien 213–214); `<svg>` direkt im HTML, gut für Icons (Folie 215); `<iframe>` (Folie 216).

---

## 4. CSS

**Was ist CSS? (Folien 240–246)**
- Cascading Style Sheets. CSS legt fest, wie der Browser eine Seite darstellt.
- Ohne CSS sieht man nur die Struktur.
- Struktur (HTML) und Design (CSS) sind getrennt.
- Ein Design lässt sich für mehrere HTML-Dateien wiederverwenden.
- Verschiedene Designs für verschiedene Ziele: Desktop, Mobil, Druck.

**CSS und HTML verbinden: 4 Wege (Folien 247–252)**
1. `<style>`-Element im HTML
2. externe Datei über `<link rel="stylesheet" href="styles.css">`
3. `style`-Attribut direkt am Element (inline)
4. in JavaScript als „constructable stylesheet“ (`new CSSStyleSheet()`)

**Aufbau einer CSS-Datei (Kapitel ab Folie 253):** `@import`, ein oder mehrere Selektoren, Regelblöcke, Properties, Werte, `@media`-Regeln. Inline-CSS kann nur Properties enthalten, also keine Media Queries (Folie 260). Mehrere Werte können Kurzschreibweise für mehrere Properties sein: `border: 1px solid black` (Folie 262). Zusammengefasst auf Folie 261.

**Selektoren (Kapitel ab Folie 263)**

| Selektor | Beispiel | trifft |
|---|---|---|
| Universal | `*` | alle Elemente |
| Typ | `li` | alle `li` |
| ID | `#main` | Element mit `id="main"` |
| Klasse | `.list` | Elemente mit `class="list"` |
| Attribut | `[data-id="1"]` | Elemente mit diesem Attributwert |
| Pseudo | `li:nth-child(2)` | z. B. das 2. Kind |

Kombinieren (Folien 277–284):
- `#id.class`: verkettet, logisches UND
- `#id, .class`: Komma, logisches ODER
- `#id .class`: Leerzeichen, alle Nachfahren
- `#id > .class`: nur direkte Kinder
- `p ~ span`: alle folgenden Geschwister
- `p + span`: nur das direkt folgende Geschwister

**Spezifität und Kaskade (Kapitel ab Folie 285)**
- Das Author Stylesheet überschreibt das User Agent Stylesheet des Browsers (Folie 286).
- Passen mehrere Regeln, werden ihre Properties zusammengeführt. Bei Widersprüchen entscheidet die Spezifität (Folien 287–289).
- Zählung (Folien 290–295):
  - Typ-Selektor oder Pseudo-Element (`::before`): `0 0 0 0 1`
  - Klasse, Attribut, Pseudo-Klasse (`:hover`): `0 0 0 1 0`
  - ID: `0 0 1 0 0`
  - `style`-Attribut: `0 1 0 0 0`
  - `!important`: `1 0 0 0 0` („you probably never need important“)
- Bei gleicher Spezifität gewinnt die zuletzt definierte Regel (Folie 296).
- Reihenfolge (Folie 301): User-Agent-Stylesheet < Author-Stylesheet < Spezifität und Kaskade < Element-Style < `!important`.
- Vererbung: Manche Properties erben Kinder vom Elternelement, z. B. `color`, `font` und Custom Properties (Folie 303).

**Werte, Einheiten, Funktionen (Kapitel ab Folie 304)**
- Werte können Zahlen oder Strings sein (Folien 306–307).
- **Absolute Längen** sind immer gleich groß (px, cm …). Ein CSS-Pixel ist nicht gleich einem Gerätepixel, das hängt von DPI und Skalierung ab (Folien 309–310).
- **Relative Längen** (Folie 313):
  - `em`: Schriftgröße des Elternelements
  - `rem`: Schriftgröße des Wurzelelements
  - `vw`/`vh`: 1 % der Viewport-Breite bzw. -Höhe
  - `vmin`/`vmax`
  - `fr`: Anteil im Grid
  - `ch`, `ex`, `lh`
- `vh` auf Safari: Wird mit ausgefahrener Leiste berechnet und beim Scrollen nicht neu berechnet (Folie 315). Prozentwerte beziehen sich je nach Property auf Unterschiedliches (Folie 316).
- **Farben:** Schlüsselwort, Hex, `rgb()`, `rgba()`, `hsl()`, `hsla()` (Folie 318)
- **Funktionen:** `url()`, `calc(50% - 3em)` (Folie 319)
- `inherit`, `unset`, `initial` (Folie 320)
- **Custom Properties:** `--farbe: #f0f;` und `var(--farbe, black)` (Folie 321)

**Positionierung und Layouts (Kapitel ab Folie 322)**
- **Box Model:** margin, border, padding, content (Folien 323–325).
  - `box-sizing: content-box` ist der Standard: `width` gilt nur für den Inhalt, Padding und Border kommen dazu.
  - `border-box`: `width` schließt Padding und Border ein (Folien 326–328).
- **Containing Block:** Größe und Position hängen vom umgebenden Block ab, z. B. bei Prozentwerten (Folie 329).
- **Block-Layout:** volle Breite, stapelt sich vertikal (Folie 332).
- **Inline-Layout:** `width` und `height` wirken nicht (außer bei `inline-block`), Elemente brechen um (Folie 335).
- **Flex** (`display: flex`): verteilt und richtet Elemente horizontal oder vertikal aus, für dynamische und responsive Layouts. `flex: grow shrink basis`, z. B. `flex: 0 0 30px` oder `flex: 1 1 auto` (Folien 338–339). Wörtlich steht auf Folie 338: „If you need a 2-dimensional layout with unknown numbers of children prefer a flex layout over a grid layout“.
- **Grid** (`display: grid`): Ausrichtung an einem festgelegten Raster, für mehrdimensionale Layouts, „table on steroids“. Spalten und Zeilen mit `grid-template-columns`/`-rows`, Kinder per `grid-column`/`grid-row` (Folien 342–345).
- **Float:** nimmt das Element aus dem Fluss, Text fließt herum. Nur für den Textfluss benutzen, sonst Grid oder Flexbox (Folie 347).
- `display: none` entfernt das Element aus dem Layout, `visibility: hidden` macht es unsichtbar, aber der Platz bleibt (Folie 349).
- **Position** (Folien 350–357):
  - `static`: Standard
  - `relative`: um `top`/`left` … verschoben; absolut positionierte Kinder richten sich nach ihm
  - `absolute`: relativ zum nächsten Vorfahren mit `relative`, `absolute` oder `fixed`
  - `fixed`: relativ zum Viewport
- **Stacking Context:** Reihenfolge überlappender Elemente; entsteht durch `z-index`, `opacity`, `transform` (Folien 358–359).

**Animationen und Transitions (Kapitel ab Folie 361)**
- Animationen brauchen kein JavaScript: `@keyframes name { 0% {…} 50% {…} 100% {…} }` und am Element `animation: name 4s …` (Folien 362–364).
- **Transitions** laufen, wenn sich die passenden Selektoren ändern, z. B. bei `:hover`: `transition: all 2s ease-in` (Folien 365–366).

**Responsive Design (Kapitel ab Folie 368)**
- `@media` (oder das `media`-Attribut an `link`/`style`) wendet Styles abhängig von Bildschirmtyp, Viewport-Größe oder Farbschema an (Folie 369).
- Bedingungen lassen sich mit `and`, `or`, `not`, `only` verbinden: `@media screen and (min-width: 900px) { … }`. Andere Styles für Mobil, Tablet, Desktop oder Druck, ohne das HTML zu ändern (Folie 370).
- Beispiel `@media (prefers-color-scheme: dark)` für den Dark Mode (Folie 371).

---

## 5. JavaScript

**Was ist JavaScript? (Folien 374–383)** Eine Programmiersprache nach der ECMAScript-Spezifikation. Ihre Eigenschaften:
- High-Level: abstrahiert die Hardware
- meist Just-in-Time-kompiliert, also zur Laufzeit in Maschinencode übersetzt
- Multi-Paradigma: prozedural, objektorientiert, funktional (`map`, `filter`, `reduce`)
- dynamische Typisierung: Eine Variable kann ihren Typ wechseln
- prototypbasierte Objektorientierung: Objekte erben über die Prototypkette
- First-Class Functions: Funktionen sind Werte (zuweisen, übergeben, zurückgeben)

**Aufbau einer modernen JS-Datei (Kapitel ab Folie 384):** ES-Module mit `import` am Anfang, Funktions- und Klassendeklarationen, `export`. Moderne Browser und Node.js ab 14 unterstützen ES-Module. Alte ES5-Syntax arbeitet mit `"use strict"` und Prototypen (Folie 390).

**JavaScript laden (Kapitel ab Folie 391)**
- Im Browser:
  - `<script src="…">` für externe Dateien
  - Code direkt im `<script>`; mit `import` braucht es `type="module"`
  - Ein Script wird ausgeführt, sobald der Parser es erreicht (Folien 393–396).
- In Node.js (Folien 398–402):
  - `node datei.js` oder `node -e '…'`
  - historisch CommonJS
  - `.mjs` wird als ES-Modul behandelt, `.cjs` als CommonJS

**Primitive Datentypen (Kapitel ab Folie 403)**
- `boolean`: `true`/`false`; `Boolean('')` → false, `Boolean(100)` → true
- `string`: `'…'`, `"…"`, Template-Literal `` `Text ${x}` ``; `.length` zählt Zeichen, nicht Bytes
- `number`: nur Gleitkommazahlen; `0.1 + 0.2 = 0.30000000000000004` („blame IEEE 754“); `Number.parseInt`, `parseFloat`
- `bigint`: `5n`, für große Ganzzahlen
- `symbol`: eindeutige Werte (`Symbol('x') !== Symbol('x')`); „well-known“ Symbole wie `Symbol.iterator`
- `null` vs `undefined`: Deklariert, aber nicht belegt ergibt `undefined`; `null` ist bewusst „kein Wert“. `typeof null === 'object'`

**Variablen (Kapitel ab Folie 427)**
- `var`: darf erneut deklariert werden; im Skript ohne Modul landet die Variable auf dem globalen Objekt (`window`)
- `let`: veränderbar, nicht neu deklarierbar
- `const`: nicht neu zuweisbar
- In Modulen ist alles nur im Modul sichtbar (Folie 433).
- Faustregel: **`const` vor `let`, `let` vor `var`** (Folie 434).
- `let` in Schleifen erzeugt pro Durchlauf eine neue Variable (Folie 435).
- **Hoisting:** Deklarationen werden nach oben gezogen, Initialisierungen nicht. `var` ist vorher `undefined`, `let`/`const` werfen einen Fehler („Temporal Dead Zone“) (Folien 436–442).

**Operatoren (Kapitel ab Folie 443):** Zuweisung (`=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`), Rechnen (`+ - * / ** ++ -- %`; `+` verbindet auch Strings), logisch (`&& || !`), Vergleich (`== === != !== > < >= <=`), bitweise (`& | ^ ~ << >> >>>`).

**Typumwandlung und Vergleich (Kapitel ab Folie 450)**
- Implizite Umwandlung bei Operatoren mit verschiedenen Typen: `[] == ""` ist `true`, `1 == "1"` ist `true`, `"1" + 1` ergibt `"11"`
- Explizit mit `Number()`, `String()`, `Boolean()` (Folie 455)
- `===` / `!==` vergleichen ohne Umwandlung. Objekte werden nach Identität verglichen: `{} === {}` ist `false` (Folien 456–458).
- `typeof` (Folie 459, laut Skript 7 Typen: boolean, number, string, BigInt, Symbol, function, object; `typeof []` ist `"object"`). Außerdem `isPrototypeOf` und `instanceof` (Folien 460–461).

**Kontrollfluss (Kapitel ab Folie 462)**
- `if`/`else`; Ternary `a ? b : c`
- `||` nimmt den Ersatzwert bei jedem „falsy“-Wert (`false`, `undefined`, `null`, `0`, `""`). `??` nimmt ihn nur bei `null`/`undefined`, eine gültige `0` bleibt also erhalten (Folie 465).
- Optional Chaining `obj?.a?.b` (Folie 466)
- `switch`/`case` mit `break` und `default`
- `for (init; Bedingung; Schritt)`, `for…of` (Werte), `for…in` (Indizes)
- `while`, `do…while`
- `break` beendet die Schleife, `continue` springt zum nächsten Durchlauf

**Objekte (Kapitel ab Folie 476)**
- `{}` oder `Object.create({})`; Zugriff mit `obj.prop` oder `obj["prop"]`
- Methoden; `this` zeigt auf das Objekt
- Properties nachträglich hinzufügen oder mit `delete` entfernen; Getter/Setter
- `Object.defineProperty` mit `writable`, `enumerable`, `configurable`; `Object.freeze`/`seal`
- „Private“ Werte über einen Closure-Scope (IIFE)
- **Destructuring:** `const { one, two, ...rest } = obj`
- **Spread:** `{ ...obj1, ...obj2 }` bzw. `Object.assign` (flaches Zusammenführen)

**Arrays (Kapitel ab Folie 490)**
- `Array.isArray([])`; array-ähnliche Objekte mit `Array.from` umwandeln
- `push`, `unshift`, `pop`, `shift`, `reverse` **verändern das Array selbst**. Das betrifft alle Stellen, die dasselbe Array benutzen (Folie 499).
- `filter`, `map`, `reduce` für funktionalen Stil. Laufzeit beachten: `filter`+`map`+`reduce` läuft dreimal durch das Array, eine Schleife nur einmal (Folie 507). Mit `async`/`await` funktionieren sie nicht, dann eine normale Schleife nehmen (Folie 508).
- Typed Arrays für Binärdaten
- Destructuring `const [first, ...rest] = arr`; Spread `[...a, ...b]` bzw. `concat`

**Weitere Datentypen (Kapitel ab Folie 512):** `Map` (Schlüssel → Wert, iterierbar), `WeakMap` (Schlüssel sind Objekte, die der Garbage Collector entfernen darf, nicht iterierbar), `Set` (Werte ohne Duplikate), `WeakSet`.

**Funktionen (Kapitel ab Folie 516)**
- First-Class; **pure** Funktion: Das Ergebnis hängt nur von den Eingaben ab, ohne Nebenwirkungen (z. B. `Math.cos`)
- `this` hängt davon ab, wie die Funktion aufgerufen wird: allein ist es das globale Objekt, als Methode das Objekt. `call`/`apply` (Argumente einzeln bzw. als Array) und `bind` (feste Bindung als neue Funktion) ändern `this` (Folien 520–526).
- **Arrow Functions** `(a, b) => a * b` sind kürzer und haben **kein eigenes `this`** (Folien 527–530).
- In Modulen gibt es kein globales `this` (Folie 531).
- **Closure:** Eine innere Funktion merkt sich die Variablen der äußeren, auch nachdem diese fertig ist. Beispiel `createCounter()` (Folien 532–533).

**Klassen und Prototypen (Kapitel ab Folie 534)**
- `class` ist Syntaxzucker für Prototypen; `new` erzeugt eine Instanz
- `extends` und `super()` im Konstruktor; die Prototypkette sucht Properties in den Oberklassen
- `#privat` für private Felder
- Sinnvoll, wenn man viele gleich aufgebaute Objekte braucht

**Iteratoren (Kapitel ab Folie 545)**
- Ein Objekt wird iterierbar durch eine Funktion unter `Symbol.iterator`. Sie liefert ein Objekt mit `next()`, und `next()` gibt `{ value, done }` zurück.
- **Generatoren** `function*` mit `yield`; `return` beendet sie (`done: true`).

**Exceptions (Kapitel ab Folie 558)**
- `try { … } catch (e) { … }`: Läuft im `try` ein Fehler auf, springt das Programm in `catch` und läuft danach normal weiter.
- Fehler wandern den Aufrufstapel hoch bis zum nächsten `catch` (Folie 561).
- Eigene Fehler mit `throw new Error('…')` (Folie 562).

**Promises, async/await, Event Loop (Kapitel ab Folie 563)**
- Ein **Promise** ist ein Platzhalter für einen Wert, der später kommt. Es hat drei Zustände: pending, resolved, rejected. `.then(cb)` reagiert auf das Ergebnis, `.catch(cb)` auf einen Fehler (Folien 564–566).
- JavaScript ist **single-threaded**, jede Arbeit blockiert den Prozess. Echte Parallelität gibt es mit **WebWorkers** (Folien 568–570).
- Die **Event Loop** hat mehrere Warteschlangen (Folien 571–581):
  - **Task Queue** (FIFO): `setTimeout`, `setInterval`, `postMessage`
  - **Microtask Queue**: erledigte Promises, `queueMicrotask`, Mutation-/ResizeObserver. Läuft, bis sie leer ist, und kann die Loop deshalb blockieren.
  - **Idle Callback Queue**: `requestIdleCallback`, läuft nur, wenn der Browser nichts zu tun hat
  - **requestAnimationFrame**: läuft vor dem Zeichnen. Für 60 fps wird alle ~16,6 ms gezeichnet, ein Durchlauf sollte also nicht länger dauern.

---

## 6. DOM und Events

**Was ist das DOM? (Kapitel ab Folie 611)**
- Das Document Object Model ist die Datenstruktur hinter einer HTML-Seite, ein Baum (Folien 612–613).
- Attribute und Properties sind nicht dasselbe (Folien 615–620):
  - `element.id` gehört zum Attribut `id`.
  - `element.style` ist ein Objekt, `getAttribute('style')` ein String.
  - `classList` ist eine Liste, das Attribut `class` ein String.
  - `children` enthält nur Elemente, `childNodes` auch Textknoten.
  - `innerHTML`, `textContent`, `innerText` liefern den Inhalt unterschiedlich.

**Mit dem DOM arbeiten (Kapitel ab Folie 622)**
- Suchen: `document.querySelector('#test')`, `getElementById('test')`
- Navigieren: `parentElement`, `previousElementSibling`/`nextElementSibling` (ohne Textknoten), `children`
- Ändern:
  - `createElement`, `appendChild`, `prepend`
  - `createTextNode`, `innerText`
  - `innerHTML`: Achtung, Nutzereingaben vorher säubern (Folie 636)
  - `remove()`

**Events (Kapitel ab Folie 638)**
- Grundidee: Daten setzt man über Properties, Änderungen und Nutzeraktionen meldet das DOM über Events (Folie 639).
- Auslöser: Maus, Tastatur, Fokus, Tippen, eigene Events (Folie 640).
- `addEventListener('click', handler)`, `removeEventListener` (mit derselben Funktion)
- `event.stopPropagation()` stoppt die Weitergabe, `event.preventDefault()` verhindert das Standardverhalten (Folie 643).
- `event.target` ist das Element, auf dem das Event passierte; `event.currentTarget` das, an dem der Listener hängt (Folie 644).
- Eigene Events: `dispatchEvent(new CustomEvent('name'))` (Folie 645).
- Folie 646 („Working with the DOM (effectively)“) ist markiert, hat im Skript aber keine weiteren Inhaltsfolien.

---

## 7. Kommunikation

**HTTP (Kapitel ab Folie 652)**
- 1989 mit dem World Wide Web von Tim Berners-Lee eingeführt
- Request-Response-Protokoll im Client-Server-Modell; Ressourcen werden über URLs mit den Schemata `http`/`https` gefunden (Folien 653–655)
- **Request:** `GET /index.html HTTP/1.1` (Methode, Pfad, Version) und Header `Host`
- **Response:** `HTTP/1.1 200 OK` (Status), Header (`Date`, `Content-Type`, `Content-Length`, `Last-Modified`), Leerzeile, Inhalt (Folien 659–666)
- **Request mit Inhalt:** `POST` mit `Content-Type: application/json`, `Content-Length` und einem Body (Folien 667–673)
- **Methoden** (Folie 675):
  - `GET` holen
  - `HEAD` nur Header holen
  - `POST` Daten senden, ändert oft etwas auf dem Server
  - `PUT` Ressource aktualisieren
  - `DELETE` löschen
  - `OPTIONS` Kommunikationsoptionen abfragen, als Preflight für CORS
- **Statuscodes** (Folien 677–680):
  - `200` Erfolg
  - `3XX` verschoben oder nicht geändert
  - `4XX` Fehler beim Client: 400 Bad Request, 403 Forbidden, 404 Not Found, 418 I’m a teapot
  - `5XX` Fehler beim Server: 500 Internal Server Error, 503 Service Unavailable, 504 Gateway Timeout
- **HTTPS:** verschlüsselt mit TLS gegen Man-in-the-Middle-Angriffe und sollte Pflicht sein (Folie 681).
- **Server-Sent Events:** Einbahnstraße vom Server zum Client über eine offene TCP-Verbindung (`text/event-stream`) (Folie 682).
- **Cookies:** teilen Zustand zwischen Anfragen und werden bei jeder Anfrage und Antwort mitgeschickt (Folie 683).
- **CSP** (Content Security Policy): Ein Header legt fest, welche Skripte und Medien laden dürfen, z. B. `default-src 'self'; img-src *` (Folien 684–687).
- **Origin** = Protokoll + Host + Port. Andere Subdomain oder anderer Port heißt anderer Origin (Folie 685).
- **CORS:** Technik im Browser, um Inhalte von anderen Origins zu laden. **Kein Sicherheitsmerkmal fürs Backend**, andere HTTP-Clients kommen trotzdem an die Daten (Folie 688). Der Server erlaubt Origins mit dem Header `Access-Control-Allow-Origin`, wichtig wenn Seite und API auf verschiedenen Hosts liegen (Folie 689).

**Verbindung absichern (Kapitel ab Folie 705)**
- Alle besprochenen Protokolle übertragen unverschlüsselt und sind anfällig für Man-in-the-Middle-Angriffe.
- Dank der Schichten-Architektur lässt sich jedes Web-Protokoll mit TLS verschlüsseln, man wechselt nur das Protokoll in der URI: `http` ↔ `https`, `ws` ↔ `wss`.
- Mindestens TLS 1.2.
- Server und Client müssen die Verschlüsselung beide unterstützen; sie lässt sich mit Authentifizierung kombinieren.

**Authentifizierung (Kapitel ab Folie 710)**

| Verfahren | Vorteile | Nachteile |
|---|---|---|
| Cookies (713) | in jedem Browser, mit WebSockets, mit `<img>`, mit OAuth | kann deaktiviert werden, mit anderen HTTP-Clients kompliziert |
| HTTP-Authentication, Header `Authorization` (715) | in jedem Browser, verschiedene Schemata (basic, digest …), mit WebSockets | Benutzer und Passwort im Klartext (basic), andere Schemata mit anderen Clients schwierig |
| Token im eigenen Header (717) | gut für SPAs und andere Clients | funktioniert nicht mit WebSockets (die Folie nennt außerdem „Works only for SPAs“) |
| Client-Zertifikate im TLS-Handshake (719) | sehr gute Sicherheit | Verteilung der Zertifikate kompliziert |

**REST (Kapitel ab Folie 720)**
- HTTP liefert oft APIs aus, meist nach REST (Folie 721).
- REST legt fest, wie URL-Pfade benannt werden und wie man HTTP-Methoden semantisch richtig einsetzt (Folie 722):
  `GET /todos`, `GET /todos/:id`, `POST /todos`, `PUT /todos/:id`, `DELETE /todos/:id` (Folie 723)
- Daten gehen per Query-Parameter oder im Body mit (Folie 724). `GET`, `OPTIONS` und `DELETE` haben meist **keinen Body** (Folie 725). Binärdaten nur im Body, außer Base64-kodiert (Folie 726).
- Beispiel `GET /profile/234234234?format=json`: Methode, API-Pfad, Ressourcen-ID, optionale Query-Parameter (Folien 728–732)
- Beispiel `PUT /avatar`: Der Benutzer kommt aus dem Login-Kontext (Cookie), optional per Query-Parameter überschreibbar (Folien 733–736)
- Gute Praxis:
  - eine einheitliche API (Folie 738)
  - Methoden und Pfade passend benutzen, Primär-IDs in den Pfad, idempotente Methoden einhalten (Folie 739)
- REST hat feste Pfade und Strukturen. Als Abhilfe hat Facebook **GraphQL** entwickelt, das sich auch mit REST kombinieren lässt (Folie 740).

---

## Ohne Pferd, aber in unserer App benutzt

Nicht markiert, aber nützlich, wenn der Prüfer nach unserem Code fragt:
- **Formulare** (Folien 217–231): `<form>`, `<input type>`, `placeholder`, `required`, `pattern`, `min`/`max`/`step`, `<select>`, Buttons `submit`/`reset`, Kodierungen `application/x-www-form-urlencoded` und `multipart/form-data`
- **ARIA** (Folien 232–237): lieber das passende semantische Element als ARIA; ARIA nur für eigene Widgets (`role`, `aria-…`)
- **Modulsysteme** (Folien 584–607): ES-Module vs CommonJS; Bundler (Webpack, Rollup, esbuild) lösen Imports für den Browser auf. Bei uns erledigt das Vite.
