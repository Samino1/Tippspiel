import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="page page--narrow center">
      <h1>Abseits!</h1>
      <p className="muted">Diese Seite gibt es nicht.</p>
      <Link to="/" className="button button--primary">
        Zur Startseite
      </Link>
    </div>
  );
}
