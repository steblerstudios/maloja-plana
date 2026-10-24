// Menü · Fassung 5 (entschieden 23.10.2026, VERGLEICH.md «Menü · entschieden» und
// «Merkliste und Kalender verknüpft · Icons»).
//
// Kein DOM (das Projekt fährt vitest ohne jsdom): das Menü wird mit
// renderToStaticMarkup gezeichnet und das Ergebnis gelesen. Was hier NICHT belegt
// ist: Tastatur und Fokus im echten Browser — die liefert useFocusTrap (fokusFalle.test.js).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { DARK_PALETTE, LIGHT_PALETTE, getChapters } from '../config/constants.js';
import { MobileNav } from '../MobileNav.jsx';
import { tagInZuerich } from '../utils/zuerichTag.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { Icons } from '../IconKern.jsx';

const SPRACHEN = { de, en, fr, it: it_, rm };
const lies = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const zeichne = (props = {}, sprache = 'de', anrede = 'sie') => {
  const t = createT(SPRACHEN, sprache, anrede);
  return renderToStaticMarkup(React.createElement(MobileNav, {
    palette: DARK_PALETTE, t, isOpen: true, onClose: () => {}, onNavigate: () => {},
    activeView: 'dashboard', activeChapter: 0, chapters: getChapters(t), completion: 63,
    onToggleSimpleView: () => {}, feedbackHref: 'mailto:info@malojaplana.ch', ...props,
  }));
};
// Textinhalt ohne Tags, Entitäten zurück.
const textVon = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, '’').replace(/\s+/g, ' ');

describe('Menü · Inhalt (Fassung 5)', () => {
  const html = zeichne();
  const txt = textVon(html);

  it('die vier Anker oben, mit ihren neuen Sätzen', () => {
    for (const s of ['Übersicht', 'Wo Sie gerade stehen und was als Nächstes dran ist.',
      'Was ansteht', 'Fristen, Termine und die Merkliste an einem Ort.',
      'Rucksack', 'Wege durch Lebensereignisse und alle Werkzeuge, geordnet wie Ausrüstung.',
      'Was steht mir zu?', 'Leistungen und Rechner — Prämienverbilligung, Ergänzungsleistungen, Sozialhilfe, Stipendien.']) {
      expect(txt, s).toContain(s);
    }
    // Reihenfolge: Anker vor den Bereichen
    expect(txt.indexOf('Was steht mir zu?')).toBeLessThan(txt.indexOf('Persönliche Basis'));
  });

  it('«Was ansteht» ersetzt im Menü den Kalender-Eintrag', () => {
    expect(txt).not.toMatch(/\bKalender\b/);
  });

  // 23.10.2026: dieselbe Seite stand als Anker «Was steht mir zu?» und als Werkzeug
  // «Lebenssituationen» im Menü — jetzt nur noch als Anker.
  it('«Was steht mir zu?» steht genau einmal im Menü', () => {
    expect(txt.split('Was steht mir zu?').length - 1).toBe(1);
    expect(txt).not.toContain('Lebenssituationen');
  });

  it('alle sieben Bereiche mit ihrer Kapitel-Beschreibung, in den drei Gruppen', () => {
    for (const k of ['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall']) {
      expect(txt).toContain(de.chapters[k].title.replace(/&/g, '&'));
      expect(txt).toContain(de.chapters[k].description.sie || de.chapters[k].description);
    }
    for (const g of ['Ihr Alltag', 'Ihre Absicherung', 'Ihr Schutz']) expect(txt).toContain(g);
  });

  it('nichts von heute fällt weg: Stand, Startbildschirm, Werkzeuge, Gepäck, Einstellungen, Hinweis', () => {
    for (const s of ['63% vollständig', 'Auf den Startbildschirm legen', 'Dokumentenablage', 'Merkliste',
      'Steuern', 'Finanz-Übersicht', 'Alle Werkzeuge im Rucksack ›',
      'Steuer, IPV, Sozialhilfe, EL — alles auf einen Blick.', 'Steuerbelastung abschätzen',
      'Einstellungen', 'Einfache Ansicht', 'Datenschutz & Rechtliches', 'Problem melden',
      'Lokal gespeichert. Ihre Eingaben verlassen Ihr Gerät nicht.']) {
      expect(txt, s).toContain(s);
    }
    expect(html).toContain('type="search"');
  });

  it('«Rundgang neu starten» steht nicht im Menü — auch nicht, wenn jemand ihn übergibt', () => {
    expect(textVon(zeichne({ onStartTour: () => {} }))).not.toContain(de.tour.reopen);
  });

  it('Du-Form wird gezogen', () => {
    const du = textVon(zeichne({}, 'de', 'du'));
    expect(du).toContain('Wo du gerade stehst und was als Nächstes dran ist.');
    expect(du).toContain('Lokal gespeichert. Deine Eingaben verlassen dein Gerät nicht.');
  });

  it('in allen fünf Sprachen ohne rohe Schlüssel', () => {
    for (const lang of Object.keys(SPRACHEN)) {
      const t2 = textVon(zeichne({ palette: LIGHT_PALETTE, isDarkMode: false }, lang));
      expect(t2, lang).not.toMatch(/nav\.(wasAnsteht|ankerSatz)/);
    }
  });

  it('Einfache Ansicht ist ein Schalter mit Zustand; Problem melden ist der Mail-Entwurf', () => {
    expect(html).toMatch(/aria-pressed="false"[^>]*>Einfache Ansicht/);
    expect(zeichne({ simpleView: true })).toMatch(/aria-pressed="true"[^>]*>Einfache Ansicht/);
    expect(html).toMatch(/<a href="mailto:info@malojaplana\.ch"[^>]*>Problem melden/);
  });
});

describe('Menü · Bedienbarkeit', () => {
  const html = zeichne();
  it('modal, mit Überschrift als Einstieg und beschriftetem Schliessen-Knopf', () => {
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toMatch(/<h2 data-dialog-titel="true" tabindex="-1"/);
    expect(html).toMatch(/<button type="button" aria-label="Schliessen"[^>]*width:44px;height:44px/);
  });

  it('kein autoFocus mehr ins Suchfeld (am Handy schöbe die Tastatur die Karten weg)', () => {
    expect(lies('MobileNav.jsx')).not.toMatch(/autoFocus/);
  });

  it('jeder Knopf und Link im Menü ist mindestens 44 px hoch (oder breit+hoch 44)', () => {
    const elemente = [...html.matchAll(/<(button|a)\b[^>]*style="([^"]*)"/g)];
    expect(elemente.length).toBeGreaterThan(20);
    for (const [, tag, stil] of elemente) {
      const h = stil.match(/(?:min-height|height):(\d+)px/);
      expect(h && Number(h[1]) >= 44, tag + ': ' + stil.slice(0, 80)).toBe(true);
    }
  });

  it('die aktive Ansicht ist als aria-current markiert', () => {
    expect(html).toMatch(/aria-current="page"[^>]*>.*?Übersicht/);
  });
});

describe('Icons · Was ansteht / Ablage / Merkliste', () => {
  it('der Kalender-Tag gilt in Europe/Zurich, nicht nach der Geräte-Uhr', () => {
    // 23.10.2026 23:30 UTC = 24.10. 01:30 in Zürich (Sommerzeit, UTC+2)
    expect(tagInZuerich(new Date('2026-10-23T23:30:00Z'))).toBe(24);
    // 31.12.2026 23:30 UTC = 1.1.2027 00:30 in Zürich (Winterzeit, UTC+1)
    expect(tagInZuerich(new Date('2026-12-31T23:30:00Z'))).toBe(1);
    // 23.10.2026 21:30 UTC = 23:30 in Zürich, noch der 23.
    expect(tagInZuerich(new Date('2026-10-23T21:30:00Z'))).toBe(23);
  });

  it('das Kalender-Zeichen zeigt den heutigen Zürcher Tag', () => {
    const svg = renderToStaticMarkup(Icons.calendar());
    expect(svg).toContain('>' + tagInZuerich() + '</text>');
  });

  it('Register: Ablage = Ordner, Kalender = Kalenderblatt, Merkliste = Haken', () => {
    const icon = Object.fromEntries(WERKZEUGE.map((w) => [w.view, w.icon]));
    expect(icon.tresor).toBe('ordner');
    expect(icon.calendar).toBe('calendar');
    expect(icon.merkliste).toBe('check');
    expect(Icons.ordner).toBeTruthy();
  });

  it('Boden-Anker und Erfassen-Fächer nutzen dieselben drei Zeichen, der Tag kommt aus Zürich', () => {
    const main = lies('main.jsx');
    expect(main).toMatch(/key: 'tresor', label: t\('nav\.capDokument'\), icon: 'ordner'/);
    expect(main).toMatch(/key: 'merkliste', label: t\('nav\.merkliste'\), icon: 'check'/);
    // Seit 23.10.2026 liegt der Kalender nur noch im Erfassen-Fächer, nicht mehr in der Leiste.
    expect(main).toMatch(/key: 'calendar', label: t\('nav\.capFrist'\), icon: 'calendarToday'/);
    expect(main).toMatch(/const day = String\(tagInZuerich\(\)\)/);
    expect(main).not.toMatch(/new Date\(\)\.getDate\(\)/);
    expect(lies('IconKern.jsx')).not.toMatch(/new Date\(\)\.getDate\(\)/);
    expect(lies('Dashboard.jsx')).toMatch(/view: 'tresor', icon: 'ordner'/);
  });
});
