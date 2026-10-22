// Grundgerüst jeder Seite: Kopfzeile mit Navigation, Inhalt (<Outlet />) und Fußzeile.
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import PlayerSelect from './PlayerSelect.jsx';

const NAV_ITEMS = [
  { to: '/tippen', label: 'Tippen' },
  { to: '/rangliste', label: 'Rangliste' },
  { to: '/spieler', label: 'Spieler' },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner container">
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <img src="/ball.svg" alt="" width="32" height="32" />
            <span>Tipprunde</span>
          </Link>

          <button
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'Schließen' : 'Menü'}
          </button>

          <nav id="main-nav" className={menuOpen ? 'nav nav--open' : 'nav'}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav__link" onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <PlayerSelect />
          </nav>
        </div>
      </header>

      <main className="container main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          Spieldaten: <a href="https://www.openligadb.de" target="_blank" rel="noreferrer">OpenLigaDB</a> ·
          Projekt im Fach Web Programmierung
        </div>
      </footer>
    </div>
  );
}
