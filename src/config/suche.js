// Eine Suche für Lupe und Menü (Fassung 9, F9-D1, Stebler Studios 05.11.2026 «sauber weiter»).
// Befund der Bestandsaufnahme: Die Menü-Suche las nur das Werkzeug-Register und die Kapitel —
// «heirat», «todesfall», «notfallkarte» ergaben dort keine Treffer, die Lupe fand sie. Umgekehrt
// fand die Lupe «Was steht mir zu?» und «Arztkoffer» nicht. Jetzt lesen beide diese eine Liste
// und dieselbe Trefferregel. Wächter: src/__tests__/eineSuche.test.js.
//
// Klein und ohne React: das Menü liegt im Startbündel.
import { SEARCH_VIEWS } from './ansichtenRegister.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';

const eintragKey = (v) => v.key || v.view;

// Alles, was gefunden werden soll: die Ansichten der Lupe, dazu die Kapitel-Werkzeuge
// (`view: 'chapter'` mit `kapitel`), der Rucksack und die Einstellungen. Doppelte fallen weg.
export const SUCHLISTE = (() => {
  const gesehen = new Set();
  return [
    ...SEARCH_VIEWS,
    ...WERKZEUGE.filter((w) => w.view === 'chapter'),
    { view: 'gepaeck', nav: 'gepaeck.menuAlle', icon: 'mappe', aliases: ['rucksack', 'gepäck', 'werkzeuge'] },
    { view: 'settings', nav: 'common.settingsTitle', icon: 'settings', aliases: ['einstellungen', 'settings'] },
  ].filter((v) => { const k = eintragKey(v); if (gesehen.has(k)) return false; gesehen.add(k); return true; });
})();

// Die Trefferregel: Name, Untertitel, Schlüssel und Suchwörter. Leere Anfrage = alles.
export const suchTreffer = (anfrage, t, chapters = []) => {
  const q = (anfrage || '').trim().toLowerCase();
  const passt = (teile) => !q || teile.some((p) => (p || '').toLowerCase().includes(q));
  return {
    werkzeuge: SUCHLISTE.filter((v) => passt([t(v.nav), v.sub ? t(v.sub) : '', eintragKey(v), ...(v.aliases || [])])),
    kapitel: chapters.map((ch, idx) => ({ ch, idx })).filter(({ ch }) => passt([ch.title, ch.description, ch.key])),
  };
};

// Einen Treffer öffnen: Kapitel-Werkzeuge springen ins Kapitel.
export const oeffneTreffer = (v, chapters, onNavigate) => {
  if (v.view === 'chapter') {
    const idx = (chapters || []).findIndex((c) => c.key === v.kapitel);
    if (idx >= 0) onNavigate('chapter', idx);
    return;
  }
  onNavigate(v.view);
};

export { eintragKey };
