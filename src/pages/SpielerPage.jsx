// Spieler verwalten: Formular zum Anlegen (mit Validierung) und Liste zum Auswählen/Löschen.
import { useState } from 'react';
import { Link } from 'react-router';
import { usePlayers } from '../context/PlayerContext.jsx';
import { validatePlayerName, NAME_MIN, NAME_MAX } from '../../shared/validation.js';
import Notice from '../components/Notice.jsx';

export default function SpielerPage() {
  const { players, player, setPlayerId, addPlayer, removePlayer } = usePlayers();

  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false); // Fehler erst zeigen, wenn schon etwas eingegeben wurde
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validationError = validatePlayerName(name);
  const shownError = (touched && validationError) || serverError;

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched(true);
    if (validationError) return;

    setSubmitting(true);
    try {
      const created = await addPlayer(name.trim());
      setSuccess(`Willkommen, ${created.name}! Du bist jetzt ausgewählt und kannst tippen.`);
      setName('');
      setTouched(false);
    } catch (err) {
      setServerError(err.message); // z.B. "Name schon vergeben"
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(p) {
    if (!window.confirm(`${p.name} und alle Tipps wirklich löschen?`)) return;
    try {
      await removePlayer(p.id);
    } catch (err) {
      setServerError(err.message);
    }
  }

  return (
    <div className="page page--narrow">
      <h1>Spieler</h1>
      <p className="muted">Kein Login nötig: Neu anlegen, dann oben im Menü auswählen.</p>

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="player-name">Name</label>
        <div className="form__row">
          <input
            id="player-name"
            type="text"
            value={name}
            required
            minLength={NAME_MIN}
            maxLength={NAME_MAX}
            placeholder="z.B. Kim"
            aria-invalid={Boolean(shownError)}
            aria-describedby="player-name-hint"
            onChange={(event) => {
              setName(event.target.value);
              setTouched(true);
              setServerError(null);
              setSuccess(null);
            }}
          />
          <button type="submit" className="button button--primary" disabled={submitting}>
            {submitting ? 'Speichere …' : 'Mitspielen'}
          </button>
        </div>
        <p id="player-name-hint" className={shownError ? 'form__error' : 'form__hint'}>
          {shownError || `2–${NAME_MAX} Zeichen, jeder Name nur einmal.`}
        </p>
        <Notice type="success">
          {success}
          {success && (
            <>
              {' '}
              <Link to="/tippen">Jetzt tippen →</Link>
            </>
          )}
        </Notice>
      </form>

      <h2>Tipprunde ({players.length})</h2>
      <ul className="player-list">
        {players.map((p) => (
          <li key={p.id} className={p.id === player?.id ? 'is-me' : undefined}>
            <span>{p.name}</span>
            <div className="player-list__actions">
              {p.id === player?.id ? (
                <span className="tag">ausgewählt</span>
              ) : (
                <button className="button button--ghost" onClick={() => setPlayerId(p.id)}>
                  Auswählen
                </button>
              )}
              <button className="button button--danger" onClick={() => handleDelete(p)} aria-label={`${p.name} löschen`}>
                Löschen
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
