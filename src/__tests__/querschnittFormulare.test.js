// Querschnitt 2 Formulare (Gesamtbefund 09.11.2026, G4/U1/U3/U4/U5/U6; Stebler Studios: «Ja, Querschnitt 2»).
//  1 · Fragen-Ablauf: nach Weiter/Zurück Fokus auf die neue Frage, die Fläche trägt Rolle und Namen
//  2 · Fragen mit mehreren Feldern sind Gruppen (fieldset/legend), je Rolle eine eigene
//  3 · Tippflächen im Fragen-Ablauf mindestens 44 px
//  4 · Vorlese-Knopf steht nicht im <label> und hat 44 × 44
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { FragenAblauf } from '../components/FragenAblauf.jsx';
import { VorlesenButton } from '../components/VorlesenButton.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';

const t = (k, v) => (v ? k + JSON.stringify(v) : k);
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const ablauf = (fragen, antworten = {}) => renderToStaticMarkup(React.createElement(FragenAblauf, {
  palette: LIGHT_PALETTE, t, ns: 'x', fragen, antworten, setzen: () => {}, titel: 'Titel', vorschau: () => null,
}));

describe('1 · Fokus nach dem Blättern', () => {
  it('die Frageseite ist eine benannte, fokussierbare Gruppe', () => {
    const html = ablauf([{ key: 'a', art: 'eine', optionen: ['ja', 'nein'] }]);
    const m = html.match(/<div[^>]*data-fragen-flaeche[^>]*>/);
    expect(m).not.toBeNull();
    expect(m[0]).toContain('tabindex="-1"');
    expect(m[0]).toContain('role="group"');
    expect(m[0]).toMatch(/aria-label="x\.ui\.fortschritt[^"]*: x\.frage\.a"/);
  });

  it('Weiter und Zurück laufen über geheZu, das den Fokus setzt', () => {
    const s = quelle('../components/FragenAblauf.jsx');
    expect(s).toMatch(/useEffect\(\(\) => \{\s*if \(gewechselt\.current && flaeche\.current\) flaeche\.current\.focus\(\);/);
    // setSchritt nur in useState und in geheZu — sonst springt ein Weg am Fokus vorbei.
    expect(s.match(/setSchritt\(/g)).toHaveLength(1);
  });
});

describe('2 · Gruppen', () => {
  it('«gruppe» ist ein fieldset mit legend', () => {
    const html = ablauf([{ key: 'g', art: 'gruppe', teile: [{ key: 'u1', optionen: ['ja'] }] }]);
    expect(html).toMatch(/<fieldset[^>]*><legend[^>]*>x\.frage\.g<\/legend>/);
  });

  it('«personen» mit zwei Rollen: je Rolle ein fieldset mit dem Rollennamen als legend', () => {
    const html = ablauf([{ key: 'p', art: 'personen', rollen: ['haupt', 'ersatz'] }]);
    expect(html).toMatch(/<legend[^>]*>x\.frage\.p<\/legend>/);
    expect(html).toMatch(/<fieldset[^>]*><legend[^>]*>x\.doc\.rolle_haupt<\/legend>/);
    expect(html).toMatch(/<fieldset[^>]*><legend[^>]*>x\.doc\.rolle_ersatz<\/legend>/);
  });
});

describe('3 · Tippflächen', () => {
  it('Auswahlzeilen 44 px, «Warum wird das gefragt?» 12 px oben und unten', () => {
    const html = ablauf([{ key: 'a', art: 'eine', optionen: ['ja', 'nein'] }]);
    const zeile = html.match(/<label[^>]*><input type="radio"/)[0];
    expect(zeile).toContain('min-height:44px');
    expect(html).toMatch(/<summary[^>]*padding:12px 0/);
  });
});

describe('4 · Vorlese-Knopf', () => {
  it('Trefferfläche 44 × 44, ohne die Zeile zu vergrössern', () => {
    const html = renderToStaticMarkup(React.createElement(VorlesenButton, { text: 'Hallo', speak: () => {} }));
    expect(html).toContain('min-width:44px');
    expect(html).toContain('min-height:44px');
    expect(html).toContain('margin:-10px');
  });

  it('ChapterView setzt den Knopf neben das Label, nicht hinein', () => {
    const s = quelle('../ChapterView.jsx');
    const a = s.indexOf('const renderLabel =');
    const teil = s.slice(a, s.indexOf('\n    };', a));
    const labelTeil = teil.slice(0, teil.indexOf('if (!vorlesen?.enabled) return label;'));
    expect(labelTeil).not.toContain('VorlesenButton');
    expect(teil).toContain('VorlesenButton');
  });
});
