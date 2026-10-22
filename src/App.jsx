// Routing: welche Seite bei welcher URL angezeigt wird.
// Alle Seiten liegen im gemeinsamen Layout (Kopfzeile mit Navigation + Fußzeile).
import { Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import TippenPage from './pages/TippenPage.jsx';
import RanglistePage from './pages/RanglistePage.jsx';
import SpielerPage from './pages/SpielerPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="tippen/:matchday?" element={<TippenPage />} />
        <Route path="rangliste" element={<RanglistePage />} />
        <Route path="spieler" element={<SpielerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
