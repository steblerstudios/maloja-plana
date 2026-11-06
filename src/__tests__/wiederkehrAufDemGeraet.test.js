// Wiederkehr auf dem Gerät (02.11.2026, Entscheid Stebler Studios: «Zählen ja, drängen nein»)
//
// Die App merkt sich nur auf dem Gerät, an wie vielen Tagen sie im laufenden Monat geöffnet
// wurde. Die Zahl geht nur mit, wenn die Person sie im Beta-Feedback ankreuzt und die E-Mail
// selbst sendet. Festgehalten wird hier die Zusage: kein Netzaufruf, keine Kennung, keine
// Inhalte, Vorgabe aus, jederzeit löschbar.
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createT } from '../i18n/index.js';
import { betaFeedbackText } from '../utils/betaFeedbackMail.js';
import { SCHLUESSEL, ABGELEHNT, tagMerken, tageLoeschen, zaehlenErlaubt, lokal, stand } from '../utils/nutzungsTage.js';
import { nutzungstageImMonat, zaehlenSetzen, FEEDBACK, feedbackRuht, feedbackMerken } from '../utils/nutzungsAnzeige.js';
import { BEHALTEN } from '../utils/datenLoeschen.js';
// 🛑 Nicht `import it from '../i18n/it.js'` — das überschreibt vitests `it`.
import deTexte from '../i18n/de.js';
import enTexte from '../i18n/en.js';
import frTexte from '../i18n/fr.js';
import itTexte from '../i18n/it.js';
import rmTexte from '../i18n/rm.js';

const SPRACHEN = { de: deTexte, en: enTexte, fr: frTexte, it: itTexte, rm: rmTexte };
const lesen = (...p) => fs.readFileSync(path.resolve(__dirname, '..', ...p), 'utf8');

const speicher = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    roh: () => m.get(SCHLUESSEL),
  };
};
const tag = (s) => new Date(s + 'T12:00:00');

describe('Zählung auf dem Gerät', () => {
  let s;
  beforeEach(() => { s = speicher(); });

  it('zählt jeden Tag nur einmal', () => {
    tagMerken(s, tag('2026-11-02'));
    tagMerken(s, tag('2026-11-02'));
    tagMerken(s, tag('2026-11-05'));
    expect(nutzungstageImMonat(s, tag('2026-11-05'))).toBe(2);
  });

  it('beginnt im neuen Monat von vorn und behält den alten Monat nicht', () => {
    tagMerken(s, tag('2026-11-30'));
    tagMerken(s, tag('2026-12-01'));
    expect(nutzungstageImMonat(s, tag('2026-12-01'))).toBe(1);
    expect(s.roh()).not.toContain('2026-11');
  });

  it('liest aus einem vergangenen Monat 0, auch ohne neuen Tag', () => {
    tagMerken(s, tag('2026-11-30'));
    expect(nutzungstageImMonat(s, tag('2026-12-15'))).toBe(0);
  });

  it('speichert nur Monat, letzten Tag und Anzahl', () => {
    tagMerken(s, tag('2026-11-02'));
    expect(Object.keys(JSON.parse(s.roh())).sort()).toEqual(['letzter', 'monat', 'tage']);
  });

  it('übersteht kaputte Werte und fehlenden Speicher', () => {
    s.setItem(SCHLUESSEL, '{kaputt');
    expect(nutzungstageImMonat(s, tag('2026-11-02'))).toBe(0);
    tagMerken(s, tag('2026-11-02'));
    expect(nutzungstageImMonat(s, tag('2026-11-02'))).toBe(1);
    s.setItem(SCHLUESSEL, JSON.stringify({ monat: '2026-11', letzter: '2026-11-01', tage: 'viele' }));
    expect(nutzungstageImMonat(s, tag('2026-11-02'))).toBe(0);
    const kaputt = { getItem() { throw new Error('gesperrt'); }, setItem() { throw new Error('gesperrt'); }, removeItem() { throw new Error('gesperrt'); } };
    expect(() => tagMerken(kaputt, tag('2026-11-02'))).not.toThrow();
    expect(nutzungstageImMonat(kaputt, tag('2026-11-02'))).toBe(0);
    expect(() => tageLoeschen(kaputt)).not.toThrow();
  });

  it('lässt sich löschen, und «Alle Daten löschen» nimmt die Zählung mit', () => {
    tagMerken(s, tag('2026-11-02'));
    tageLoeschen(s);
    expect(nutzungstageImMonat(s, tag('2026-11-02'))).toBe(0);
    expect(SCHLUESSEL.startsWith('or5_')).toBe(true);
    expect(BEHALTEN).not.toContain(SCHLUESSEL);
  });
});

describe('Ablehnen und Ende der Zählung', () => {
  let s;
  beforeEach(() => { s = speicher(); });

  it('wer ablehnt, wird nicht mehr gezählt, und die Zahl ist weg', () => {
    tagMerken(s, tag('2026-11-02'));
    zaehlenSetzen(false, s);
    expect(zaehlenErlaubt(s)).toBe(false);
    expect(s.roh()).toBeUndefined();
    tagMerken(s, tag('2026-11-03'));
    expect(nutzungstageImMonat(s, tag('2026-11-03'))).toBe(0);
  });

  it('wer wieder zustimmt, wird wieder gezählt', () => {
    zaehlenSetzen(false, s);
    zaehlenSetzen(true, s);
    tagMerken(s, tag('2026-11-03'));
    expect(nutzungstageImMonat(s, tag('2026-11-03'))).toBe(1);
  });

  it('nach dem Beta-Feedback läuft die Zählung weiter', () => {
    tagMerken(s, tag('2026-11-02'));
    feedbackMerken(false, s, tag('2026-11-02'));
    tagMerken(s, tag('2026-11-03'));
    expect(nutzungstageImMonat(s, tag('2026-11-03'))).toBe(2);
  });

  it('die Ablehnung übersteht «Alle Daten löschen»', () => {
    expect(BEHALTEN).toContain(ABGELEHNT);
  });

  it('der Ort zum Ablehnen ist immer erreichbar und zählt das Beispiel nicht', () => {
    const k = lesen('components', 'NutzungsZaehlung.jsx');
    expect(lesen('SettingsView.jsx')).toContain('React.createElement(NutzungsZaehlung');
    expect(k).toContain('demoMode');
    expect(k).toMatch(/zaehlenSetzen\(wert\)/);
  });

  it('das Zählen läuft vor dem ersten Rendern des Feedbacks', () => {
    expect(lesen('main.jsx')).toMatch(/useState\(\(\) => \{ if \(!demo && isOnboardingDone\(\)\) tagMerken\(\); return null; \}\)/);
  });
});

describe('Feedback alle drei Monate', () => {
  let s;
  beforeEach(() => { s = speicher(); });

  it('ist ohne Merker bereit', () => {
    expect(feedbackRuht(s, tag('2026-11-02'))).toBe(null);
  });

  it('ruht nach einer Antwort 89 Tage und ist am 90. Tag wieder da', () => {
    feedbackMerken(false, s, tag('2026-11-02'));
    expect(feedbackRuht(s, tag('2027-01-30'))).toBe('beantwortet');
    expect(feedbackRuht(s, tag('2027-01-31'))).toBe(null);
  });

  it('Wegklicken zählt wie eine Antwort, wird aber nicht verdankt', () => {
    feedbackMerken(true, s, tag('2026-11-02'));
    expect(feedbackRuht(s, tag('2026-12-01'))).toBe('weggeklickt');
    expect(feedbackRuht(s, tag('2027-01-31'))).toBe(null);
  });

  it('das alte «done» beginnt die Frist heute', () => {
    s.setItem(FEEDBACK, 'done');
    expect(feedbackRuht(s, tag('2026-11-02'))).toBe('beantwortet');
    expect(feedbackRuht(s, tag('2027-01-30'))).toBe('beantwortet');
    expect(feedbackRuht(s, tag('2027-01-31'))).toBe(null);
  });

  it('übersteht kaputte Werte', () => {
    s.setItem(FEEDBACK, 'unsinn');
    expect(feedbackRuht(s, tag('2026-11-02'))).toBe(null);
  });

  it('der Abschnitt drängt nicht: kein Hinweis ausserhalb der Karte', () => {
    expect(lesen('utils', 'nutzungsTage.js') + lesen('utils', 'nutzungsAnzeige.js')).not.toMatch(/Notification|setTimeout|setInterval/);
  });
});

describe('Die Zahl geht nur freiwillig mit', () => {
  const t = createT({ de: deTexte }, 'de', 'sie');
  const basis = { q1: 'yes', q2: '', q3: '', t, version: '1', lang: 'de' };

  it('steht ohne Ankreuzen nicht im Entwurf', () => {
    const ohne = betaFeedbackText(basis);
    expect(ohne).not.toMatch(/\bTage\b/);
    expect(betaFeedbackText({ ...basis, nutzungstage: null })).toBe(ohne);
  });

  it('steht mit Ankreuzen im Kontext-Block', () => {
    const mit = betaFeedbackText({ ...basis, nutzungstage: 3 });
    expect(mit.slice(mit.indexOf('— — —'))).toContain(t('beta.feedback.nutzungZeile', { n: 3 }));
  });

  it('das Kästchen ist vorgegeben aus und erscheint nur mit einer Zahl', () => {
    const k = lesen('components', 'BetaFeedback.jsx');
    expect(k).toMatch(/const \[nutzungMit, setNutzungMit\] = useState\(false\)/);
    expect(k).toMatch(/nutzungstage: nutzungMit \? tage : null/);
    expect(k).toMatch(/tage > 0 && React\.createElement/);
  });
});

describe('Startbündel', () => {
  it('main.jsx lädt nur das Zählen, nicht die Anzeige', () => {
    expect(lesen('main.jsx')).not.toContain('nutzungsAnzeige');
    const dashboard = lesen('Dashboard.jsx');
    // Nachgeladen, egal ob per React.lazy oder lazyMitTexten (seit Fassung 9 lädt main Texte mit).
    expect(dashboard).toMatch(/(React\.lazy|lazyMitTexten)\(\(\) => import\('\.\/components\/BetaFeedback\.jsx'\)/);
    expect(dashboard).not.toMatch(/from '\.\/components\/BetaFeedback\.jsx'/);
    expect(dashboard).not.toContain('nutzungsAnzeige');
  });
});

describe('Es wird nichts gesendet', () => {
  it('der Baustein hat keinen Netzweg', () => {
    expect(lesen('utils', 'nutzungsTage.js') + lesen('utils', 'nutzungsAnzeige.js')).not.toMatch(/fetch|sendBeacon|XMLHttpRequest|WebSocket|navigator\.|document\.cookie/);
  });

  it('der Baustein der Einstellungen hat keinen Netzweg', () => {
    expect(lesen('components', 'NutzungsZaehlung.jsx')).not.toMatch(/fetch|sendBeacon|XMLHttpRequest|WebSocket/);
  });
});

describe('Texte in allen Sprachen', () => {
  for (const [lang, texte] of Object.entries(SPRACHEN)) {
    for (const anrede of ['sie', 'du']) {
      const t = createT({ [lang]: texte }, lang, anrede);
      it(`${lang}/${anrede}: alles da`, () => {
        for (const k of ['beta.feedback.nutzungKaestchen', 'beta.feedback.nutzungHinweis', 'beta.feedback.nutzungZeile', 'beta.feedback.nutzungLoeschen', 'beta.feedback.nutzungSchalter', 'beta.feedback.nutzungStand', 'beta.feedback.diesmalNicht', 'legal.privacy.zaehlungTitle', 'legal.privacy.zaehlung1']) {
          expect(t(k, { n: 4 }), k).not.toBe(k);
        }
        expect(t('beta.feedback.nutzungZeile', { n: 4 })).toContain('4');
        expect(t('beta.feedback.nutzungKaestchen', { n: 4 })).toContain('4');
      });
    }
  }

  it('der Datenschutz zeigt den Abschnitt', () => {
    const legal = lesen('LegalView.jsx');
    expect(legal).toContain("t('legal.privacy.zaehlungTitle')");
    expect(legal).toContain("t('legal.privacy.zaehlung1')");
  });
});

describe('Zählung · robust gegen gesperrten oder vollen Speicher (sicherheits-pruefer 06.11.2026)', () => {
  it('gesperrter localStorage wirft nicht, es wird einfach nicht gezählt', () => {
    const vorher = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('SecurityError'); } });
    try {
      expect(lokal()).toBeNull();
      expect(() => nutzungstageImMonat()).not.toThrow();
      expect(nutzungstageImMonat()).toBe(0);
      expect(() => feedbackRuht()).not.toThrow();
      expect(zaehlenErlaubt()).toBe(false);
    } finally {
      if (vorher) Object.defineProperty(globalThis, 'localStorage', vorher);
      else delete globalThis.localStorage;
    }
  });

  it('mehr als 31 Tage im Monat gilt nicht als Stand', () => {
    const s = speicher();
    s.setItem(SCHLUESSEL, JSON.stringify({ monat: '2026-11', letzter: '2026-11-06', tage: 99999 }));
    expect(stand(s)).toBeNull();
    s.setItem(SCHLUESSEL, JSON.stringify({ monat: '2026-11', letzter: '2026-11-06', tage: 31 }));
    expect(stand(s)).not.toBeNull();
  });

  it('Ablehnen bei vollem Speicher: Zahl ist weg, die Wahl meldet «nicht gespeichert»', () => {
    const s = speicher();
    s.setItem(SCHLUESSEL, JSON.stringify({ monat: '2026-11', letzter: '2026-11-06', tage: 3 }));
    const voll = { ...s, setItem: () => { throw new Error('QuotaExceededError'); } };
    expect(zaehlenSetzen(false, voll)).toBe(false);
    expect(s.roh()).toBeUndefined();
    expect(zaehlenSetzen(false, s)).toBe(true);
    expect(s.getItem(ABGELEHNT)).toBe('1');
  });
});

describe('Rundgang · «kein Tracking» steht nicht allein (rechts-pruefer Soll 2, Stebler Studios 06.11.2026)', () => {
  it('nennt in allen Sprachen die Zählung auf dem Gerät und das Ablehnen in den Einstellungen', () => {
    const muster = {
      de: [/zählt nur auf diesem Gerät/, /Einstellungen/],
      fr: [/compte seulement sur cet appareil/, /Paramètres/],
      it: [/conta solo su questo dispositivo/, /Impostazioni/],
      en: [/only counts the days per month on this device/, /Settings/],
      rm: [/dumbra mo sin quest apparat/, /Configuraziuns/],
    };
    for (const [lang, texte] of Object.entries(SPRACHEN)) {
      const v = texte.tour.privacy.text;
      for (const s of typeof v === 'string' ? [v] : [v.sie, v.du]) {
        for (const m of muster[lang]) expect(s, lang).toMatch(m);
      }
    }
  });
});

