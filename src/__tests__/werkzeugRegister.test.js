import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { WERKZEUGE, MENUE_WERKZEUGE, werkzeugeImFach, werkzeugKey, AUSSENFACH, EINSTELLUNGEN } from '../data/werkzeugRegister.js';
import { GEGENSTAENDE, alleWege } from '../data/gepaeck.js';
import { VALID_VIEWS } from '../utils/hashRouter.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import frLang from '../i18n/fr.js';
// NICHT `it` nennen — das überschreibt vitests `it`.
import itLang from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Werkzeug-Vorschau 27.09.2026 («alle drei in einem, im Rucksack»).
// Bedingung aus dem Entscheid: EIN Register. Diese Tests halten es ehrlich.

const SPRACHEN = { de, en, fr: frLang, it: itLang, rm };
const resolve = (obj, path) => path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
const present = (v) => typeof v === 'string' ? v.length > 0 : (v && typeof v === 'object' && (present(v.sie) || present(v.du)));
const GEGENSTAND_KEYS = GEGENSTAENDE.map((g) => g.key);

// Stand main 6c24111 (27.09.2026), von Hand abgezählt: was heute im Menü (`allTools`,
// 18) oder im Werkzeug-Raster des Dashboards (19 + Abläufe) steht. Diese Liste ist ein
// FESTER Schnappschuss, nicht aus dem Code abgeleitet — sonst prüfte sie sich selbst.
// 'mindestlohn' ist die Kapitel-Aktion «Mindestlohn-Check».
const HEUTE_IM_MENUE = [
  'settings', 'finanzuebersicht', 'situationen', 'unterlagen', 'tresor', 'kk', 'budget', 'schulden',
  'tax', 'sozialhilfe', 'organ', 'calendar', 'sync', 'premium', 'cv', 'charts', 'export', 'notifications',
];
const HEUTE_AUF_DEM_DASHBOARD = [
  'gesundheit', 'situationen', 'tax', 'taxImport', 'sync', 'mietzins', 'vorsorge', 'mindestlohn',
  'premium', 'praemien', 'kvg', 'tresor', 'unterlagen', 'direktlinks', 'flyer',
  'search', 'merkliste', 'calendar', 'cv',
];

// Was nach dem Umbau erreichbar ist — und worüber.
const imGepaeck = () => new Set([
  ...alleWege().map((w) => w.view),
  ...WERKZEUGE.filter((w) => w.fach !== EINSTELLUNGEN).map(werkzeugKey),
]);
const imMenue = () => new Set([...MENUE_WERKZEUGE.map(werkzeugKey), 'gepaeck', 'settings']);
// Über die Einstellungen (SettingsView): Export und Benachrichtigungen.
const inEinstellungen = () => new Set(WERKZEUGE.filter((w) => w.fach === EINSTELLUNGEN).map(werkzeugKey));

describe('Werkzeug-Register: ein Eintrag je Werkzeug', () => {
  it('jeder Schlüssel steht genau einmal — über Register UND Gepäck-Wege', () => {
    const alle = [...WERKZEUGE.map(werkzeugKey), ...alleWege().map((w) => w.view)];
    const doppelt = alle.filter((k, i) => alle.indexOf(k) !== i);
    expect(doppelt, 'doppelt: ' + doppelt.join(', ')).toEqual([]);
  });

  it('jeder Eintrag führt in eine gültige Ansicht (Kapitel-Aktionen in ein echtes Kapitel)', () => {
    for (const w of WERKZEUGE) {
      expect(VALID_VIEWS.has(w.view), `${werkzeugKey(w)} → unbekannte View ${w.view}`).toBe(true);
      if (w.view === 'chapter') {
        expect(w.key, 'Kapitel-Aktion braucht eigenen key').toBeTruthy();
        expect(CHAPTER_KEYS).toContain(w.kapitel);
      }
    }
  });

  it('jedes Fach ist ein Gegenstand, das Aussenfach oder die Einstellungen', () => {
    const erlaubt = new Set([...GEGENSTAND_KEYS, AUSSENFACH, EINSTELLUNGEN]);
    for (const w of WERKZEUGE) expect(erlaubt.has(w.fach), `${werkzeugKey(w)}: Fach ${w.fach}`).toBe(true);
  });

  it('jeder Menüeintrag liegt auch im Gepäck (Bedingung «beides»)', () => {
    expect(MENUE_WERKZEUGE.length).toBeGreaterThan(0);
    const gepaeck = imGepaeck();
    for (const w of MENUE_WERKZEUGE) {
      expect(w.fach, `${werkzeugKey(w)} steht im Menü, aber in keinem Fach`).not.toBe(EINSTELLUNGEN);
      expect(gepaeck.has(werkzeugKey(w)), `${werkzeugKey(w)} fehlt im Gepäck`).toBe(true);
    }
  });

  it('im Menü stehen genau die drei für den Alltag (Entscheid 27.09.)', () => {
    expect(MENUE_WERKZEUGE.map(werkzeugKey).sort()).toEqual(['calendar', 'merkliste', 'tresor']);
  });

  it('jeder Label-Schlüssel löst in allen 5 Sprachen auf', () => {
    for (const [lang, dict] of Object.entries(SPRACHEN)) {
      for (const w of WERKZEUGE) {
        expect(present(resolve(dict, w.nav)), `${lang}: ${w.nav}`).toBe(true);
        if (w.sub) expect(present(resolve(dict, w.sub)), `${lang}: ${w.sub}`).toBe(true);
      }
    }
  });
});

describe('Portemonnaie und Aussenfach', () => {
  it('Portemonnaie ist der 7. Gegenstand und trägt die acht Geld-Werkzeuge', () => {
    expect(GEGENSTAND_KEYS).toHaveLength(7);
    expect(GEGENSTAND_KEYS).toContain('geld');
    expect(werkzeugeImFach('geld').map(werkzeugKey).sort()).toEqual(
      ['budget', 'finanzuebersicht', 'mindestlohn', 'schulden', 'sozialhilfe', 'sync', 'tax', 'taxImport'],
    );
  });

  it('Arztkoffer und Feldflasche tragen ihre Werkzeuge laut Zuordnungstabelle', () => {
    expect(werkzeugeImFach('gesundheit').map(werkzeugKey).sort()).toEqual(['kk', 'kvg', 'praemien', 'premium']);
    expect(werkzeugeImFach('alter').map(werkzeugKey)).toEqual(['vorsorge']);
  });

  it('das Aussenfach trägt alle Ablage-Werkzeuge', () => {
    const aussen = werkzeugeImFach(AUSSENFACH).map(werkzeugKey);
    for (const v of ['tresor', 'unterlagen', 'calendar', 'merkliste', 'cv', 'direktlinks', 'flyer', 'charts']) {
      expect(aussen, `${v} fehlt im Aussenfach`).toContain(v);
    }
  });

  it('jeder Gegenstand hat Namen und Untertitel in allen 5 Sprachen', () => {
    for (const [lang, dict] of Object.entries(SPRACHEN)) {
      for (const g of GEGENSTAND_KEYS) {
        expect(present(resolve(dict, 'gepaeck.obj.' + g)), `${lang}: gepaeck.obj.${g}`).toBe(true);
        expect(present(resolve(dict, 'gepaeck.objSub.' + g)), `${lang}: gepaeck.objSub.${g}`).toBe(true);
      }
      for (const k of ['werkzeuge', 'werkzeugeOne', 'wegeTitel', 'werkzeugeTitel', 'aussenfach', 'aussenfachSub', 'menuAlle']) {
        expect(present(resolve(dict, 'gepaeck.' + k)), `${lang}: gepaeck.${k}`).toBe(true);
      }
    }
  });
});

describe('Nichts wird unerreichbar', () => {
  it('jede heute im Menü oder auf dem Dashboard erreichbare Ansicht ist nachher über Menü, Gepäck oder Einstellungen erreichbar', () => {
    const nachher = new Set([...imGepaeck(), ...imMenue(), ...inEinstellungen()]);
    const verloren = [...new Set([...HEUTE_IM_MENUE, ...HEUTE_AUF_DEM_DASHBOARD])].filter((v) => !nachher.has(v));
    expect(verloren, 'unerreichbar: ' + verloren.join(', ')).toEqual([]);
  });

  it('die Einstellungen bieten wirklich Export und Benachrichtigungen an', () => {
    expect([...inEinstellungen()].sort()).toEqual(['export', 'notifications']);
    const quelle = readFileSync(new URL('../SettingsView.jsx', import.meta.url), 'utf8');
    expect(quelle).toContain("t('nav.export')");
    expect(quelle).toContain("t('nav.notifications')");
    const main = readFileSync(new URL('../main.jsx', import.meta.url), 'utf8');
    expect(main).toMatch(/onNotifications: \(\) => handleNavigate\('notifications'\)/);
  });

  it('das Menü liest aus dem Register, nicht aus einer eigenen Liste', () => {
    const nav = readFileSync(new URL('../MobileNav.jsx', import.meta.url), 'utf8');
    expect(nav).toContain('MENUE_WERKZEUGE');
    // Die alte Handliste begann mit diesem Eintrag — sie darf nicht zurückkommen.
    expect(nav).not.toMatch(/key: 'finanzuebersicht', label:/);
  });
});

// VORSCHAU-VARIANTEN — vor dem Merge entfernen (samt src/utils/vorschauVarianten.js).
import { leseVarianten, werkzeugeFuerVariante, PLAETZE, INHALTE, MENUE_ZUSAETZE, OBEN, STANDARD } from '../utils/vorschauVarianten.js';

describe('Vorschau-Varianten (nur zum Vergleichen)', () => {
  it('ohne Parameter gilt der Stand der Vorschau; Unbekanntes fällt auf den Standard zurück', () => {
    expect(leseVarianten('')).toEqual(STANDARD);
    expect(leseVarianten('?platz=seitlich&inhalt=x&menue=foo')).toEqual(STANDARD);
    expect(leseVarianten('?platz=karte&inhalt=beide&menue=steuern,lebens,steuern'))
      .toEqual({ platz: 'karte', inhalt: 'beide', menue: ['steuern', 'lebens'] });
    expect(werkzeugeFuerVariante(WERKZEUGE, STANDARD)).toEqual(WERKZEUGE);
  });

  const teilmengen = (xs) => xs.reduce((acc, x) => acc.concat(acc.map((a) => [...a, x])), [[]]);
  const kombis = [];
  for (const platz of PLAETZE) for (const inhalt of INHALTE) for (const menue of teilmengen(Object.keys(MENUE_ZUSAETZE))) kombis.push({ platz, inhalt, menue });

  it(`keine der ${3 * 3 * 8} Kombinationen verliert eine Ansicht`, () => {
    const heute = [...new Set([...HEUTE_IM_MENUE, ...HEUTE_AUF_DEM_DASHBOARD])];
    const erlaubt = new Set([...GEGENSTAND_KEYS, AUSSENFACH, EINSTELLUNGEN, OBEN]);
    for (const v of kombis) {
      const liste = werkzeugeFuerVariante(WERKZEUGE, v);
      expect(liste).toHaveLength(WERKZEUGE.length);
      for (const w of liste) expect(erlaubt.has(w.fach), `${JSON.stringify(v)}: ${werkzeugKey(w)} → ${w.fach}`).toBe(true);
      const nachher = new Set([
        ...alleWege().map((w) => w.view),
        ...liste.map(werkzeugKey), // Gepäck (jedes Fach inkl. oben) oder Einstellungen
        ...liste.filter((w) => w.imMenue).map(werkzeugKey), 'gepaeck', 'settings',
      ]);
      const verloren = heute.filter((x) => !nachher.has(x));
      expect(verloren, JSON.stringify(v) + ' verliert ' + verloren.join(', ')).toEqual([]);
      // Jeder Menüeintrag liegt auch im Gepäck (nie nur unter Einstellungen).
      for (const w of liste.filter((x) => x.imMenue)) expect(w.fach).not.toBe(EINSTELLUNGEN);
    }
  });
});
