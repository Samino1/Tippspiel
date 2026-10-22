// Startseite: erklärt, worum es geht und wie man mitspielt.
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { api } from '../api.js';
import { POINTS } from '../../shared/scoring.js';
import LeaderboardTable from '../components/LeaderboardTable.jsx';
import './LandingPage.css';

const STEPS = [
  { title: 'Name wählen', text: 'Leg dich unter „Spieler“ an oder wähle deinen Namen oben im Menü. Ein Login brauchst du nicht.' },
  { title: 'Ergebnisse tippen', text: 'Trag für jedes Spiel des Spieltags dein Ergebnis ein. Bis zum Anpfiff kannst du Tipps noch ändern.' },
  { title: 'Punkte sammeln', text: 'Nach Abpfiff holen wir die echten Ergebnisse von OpenLigaDB, und die Rangliste rechnet sich neu.' },
];

const RULES = [
  { points: POINTS.exact, title: 'Volltreffer', example: 'Tipp 2:1 · Ergebnis 2:1' },
  { points: POINTS.difference, title: 'Tordifferenz', example: 'Tipp 2:1 · Ergebnis 3:2' },
  { points: POINTS.tendency, title: 'Tendenz', example: 'Tipp 2:1 · Ergebnis 1:0' },
];

export default function LandingPage() {
  const [top, setTop] = useState([]);

  useEffect(() => {
    api
      .getLeaderboard()
      .then((rows) => setTop(rows.slice(0, 3)))
      .catch(() => setTop([])); // Startseite funktioniert auch ohne Rangliste
  }, []);

  return (
    <div className="landing">
      <section className="hero">
        <p className="hero__kicker">Bundesliga 2026/27</p>
        <h1>Tippen, Punkte sammeln, vorne stehen</h1>
        <p className="hero__lead">
          Das Tippspiel für die Bundesliga: Ergebnisse tippen, echte Spieldaten, automatisch berechnete Rangliste.
        </p>
        <div className="hero__actions">
          <Link to="/tippen" className="button button--accent">
            Jetzt tippen
          </Link>
          <Link to="/rangliste" className="button button--light">
            Rangliste ansehen
          </Link>
        </div>
      </section>

      <section>
        <h2>So funktioniert’s</h2>
        <ol className="steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card step">
              <span className="step__number">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="landing__split">
        <div>
          <h2>Punkteregeln</h2>
          <ul className="rules">
            {RULES.map((rule) => (
              <li key={rule.title} className={`rule points--${rule.points}`}>
                <span className="rule__points">{rule.points}</span>
                <div>
                  <strong>{rule.title}</strong>
                  <span className="muted small">{rule.example}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Aktuell vorne</h2>
          <div className="card">
            <LeaderboardTable rows={top} compact />
            <Link to="/rangliste" className="link-more">
              Ganze Rangliste →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
