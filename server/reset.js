// Löscht alle Spieler und Tipps ("npm run reset").
// Beim nächsten Start werden automatisch wieder Demo-Daten angelegt.
import { db } from './db.js';

db.exec('DELETE FROM tips; DELETE FROM players;');
console.log('Datenbank geleert.');
