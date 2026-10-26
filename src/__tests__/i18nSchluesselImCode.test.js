// Wächter: jeder im Code wörtlich benutzte Schlüssel steht in allen fünf Sprachen — und kein Rückfall
// `t('x') || 'Text'`.
//
// Seitenrundgang 26.10.2026 (S1): t() gibt bei fehlendem Schlüssel den SCHLÜSSEL zurück (i18n/index.js),
// nicht undefined. Die Rückfälle `t('x') || 'Text'` griffen deshalb nie: im Kalender stand nach dem
// Abhaken wörtlich «calendar.nicelyDone», das Menü las dem Screenreader «common.clear» vor. Drei Schlüssel
// fehlten in allen Sprachen, und kein Test merkte es.
//
// Geprüft werden nur VOLLSTÄNDIGE Schlüssel: `t('a.b')` oder `t('a.b', {…})`. Zusammengesetzte wie
// `t('kvg.cat' + x)` lassen sich so nicht prüfen und bleiben aussen vor.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';

const SRC = path.resolve(__dirname, '..');
const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return ['__tests__', 'i18n', 'vendor'].includes(e.name) ? [] : dateien(p);
  return /\.(jsx?|ts)$/.test(e.name) ? [p] : [];
});
const QUELLEN = dateien(SRC).map((p) => [path.relative(SRC, p), fs.readFileSync(p, 'utf8')]);
const wert = (o, k) => k.split('.').reduce((a, b) => (a == null ? undefined : a[b]), o);

describe('i18n-Schlüssel im Code', () => {
  it('jeder wörtlich benutzte Schlüssel steht in allen fünf Sprachen', () => {
    const fehlt = [];
    for (const [datei, src] of QUELLEN) {
      for (const m of src.matchAll(/\b(?:t|tr)\(\s*'([a-zA-Z][\w.-]*\.[\w-]+)'\s*[),]/g)) {
        for (const [lang, tab] of [['de', de], ['fr', fr], ['it', itSprache], ['en', en], ['rm', rm]]) {
          if (wert(tab, m[1]) === undefined) fehlt.push(`${datei}: ${m[1]} (${lang})`);
        }
      }
    }
    expect(fehlt).toEqual([]);
  });

  it('kein Rückfall «t(…) || \'Text\'» — er greift nie und täuscht Sicherheit vor', () => {
    const stellen = [];
    for (const [datei, src] of QUELLEN) {
      src.split('\n').forEach((z, i) => {
        if (/\bt\(\s*'[^']+'\s*(?:,\s*\{[^}]*\})?\)\s*\|\|\s*['"]/.test(z)) stellen.push(`${datei}:${i + 1}`);
      });
    }
    expect(stellen).toEqual([]);
  });
});
