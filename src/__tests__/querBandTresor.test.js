import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// Quer zu den Gruppen A–E (Entscheid Stebler Studios 11.11.2026, «Alle drei wie empfohlen»):
// Q1 Landschaftsband der Kapitelseiten greift nur so weit in den Rand, wie main ihn hat (20 px) —
//    vorher −24 px, die Seite war 379 statt 375 px breit (gemessen 11.11. auf /?beispiel#/chapter/1).
// Q2 Keine Tresor-Sperre versprechen: activateTresor wird nirgends aufgerufen, der Sperrbildschirm
//    läuft nur im Entwicklungsmodus. Kein Satz zur Ablage darf Verschlüsselung zusagen.
// ─────────────────────────────────────────────────────────────

const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('Q1: Landschaftsband der Kapitelseiten ohne Überbreite', () => {
  it('Band greift genau so weit in den Rand, wie main seitlich Platz lässt', () => {
    const main = quelle('main.jsx');
    const rand = main.match(/view === 'chapter' \? '0' : '24px'\) \+ ' (\d+)px 32px (\d+)px'/);
    expect(rand, 'Seitenrand von main nicht gefunden').not.toBeNull();
    expect(rand[1]).toBe(rand[2]);
    const kapitel = quelle('ChapterView.jsx');
    expect(kapitel).toContain("React.createElement(Landschaftsband, { palette, grund: kachelGrund, margin: '0 -" + rand[1] + "px' })");
  });
});

// Erlaubnisliste: diese Sätze nennen Verschlüsselung und sind am 11.11.2026 gelesen. tresorLock.* steht nur
// auf dem Sperrbildschirm (Entwicklungsmodus), backup1 und faq.a5 sprechen von der Sicherungsdatei.
const GEPRUEFT = new Set([
  'tresorLock.intro.sie', 'tresorLock.intro.du',
  'legal.privacy.backup1.sie', 'legal.privacy.backup1.du',
  'legal.faq.a5.sie', 'legal.faq.a5.du',
]);
const THEMA = /(Dokument|document|documento|Ablage|Tresor|coffre|cassaforte|vault)/i;
// Nicht «chiffre»/«cifra» allein: das heisst in fr/it/rm auch «Zahl».
const VERSCHLUESSELT = /(verschlüssel|chiffré|chiffrée|chiffrement|cifrat|crittograf|encrypt|criptad|criptaziun)/i;
const EHRLICH_NEIN = /(unverschlüsselt|nicht verschlüsselt|non chiffr|pas chiffr|non cifrat|non crittografat|unencrypted|not encrypted|betg criptad)/i;

const saetze = (o, p = '', aus = []) => {
  for (const [k, v] of Object.entries(o)) {
    const q = p ? p + '.' + k : k;
    if (v && typeof v === 'object') saetze(v, q, aus);
    else if (typeof v === 'string') aus.push([q, v]);
  }
  return aus;
};

describe('Q2: keine Tresor-Sperre versprechen', () => {
  it('activateTresor wird ausserhalb von secureStore nirgends aufgerufen (sonst diesen Wächter neu fassen)', () => {
    const dateien = [];
    const lauf = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) { if (e.name !== '__tests__') lauf(p); }
        else if (/\.(js|jsx)$/.test(e.name)) dateien.push(p);
      }
    };
    lauf(path.resolve(__dirname, '..'));
    const aufrufe = dateien.filter((p) => !p.endsWith(path.join('utils', 'secureStore.js')) && /activateTresor\s*\(/.test(fs.readFileSync(p, 'utf8')));
    expect(aufrufe).toEqual([]);
  });
  it('kein Satz zur Ablage sagt in einer der fünf Sprachen Verschlüsselung zu (ausser den gelesenen)', () => {
    const treffer = [];
    for (const [sprache, l] of Object.entries({ de, fr, it: itTranslations, en, rm })) {
      for (const [k, v] of saetze(l)) {
        if (THEMA.test(v) && VERSCHLUESSELT.test(v) && !EHRLICH_NEIN.test(v) && !GEPRUEFT.has(k)) treffer.push(sprache + ' ' + k);
      }
    }
    expect(treffer).toEqual([]);
  });
});
