import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Icons } from '../IconKern.jsx';
import '../IconSystem.jsx';
import { ICON_INVENTAR } from '../config/iconInventar.js';
import { SEITEN_ZEICHEN } from '../config/seitenZeichen.js';

// Bauplan B6 (08.11.2026): Wörterbuch und Code sagen dasselbe. Der Nachtrag vom 08.11. in
// docs/brand/icon-dictionary.md nennt Register-Namen in `Backticks`; jeder davon muss gezeichnet
// sein und im Inventar stehen — und was er als «aufgelöst» meldet, darf es nicht mehr geben.
const woerterbuch = readFileSync(resolve(__dirname, '../../docs/brand/icon-dictionary.md'), 'utf8');
const nachtrag = woerterbuch.slice(woerterbuch.indexOf('⟨Nachtrag 08.11.2026, Bauplan B1–B5c⟩'));
const namen = (text) => [...text.matchAll(/`([a-zA-Z]+)`/g)].map((m) => m[1]);

describe('B6 · Icon-Wörterbuch = Code', () => {
  it('der Nachtrag vom 08.11. ist da', () => {
    expect(nachtrag.length).toBeGreaterThan(200);
  });
  it('jedes genannte Zeichen ist gezeichnet und steht im Inventar', () => {
    const [gilt] = nachtrag.split('**Aufgelöst, nicht mehr im Register:**');
    const genannt = namen(gilt);
    expect(genannt).toEqual(expect.arrayContaining(['download', 'sicherung', 'drucker', 'check', 'teilen']));
    expect(genannt.filter((n) => !Icons[n] || !ICON_INVENTAR[n])).toEqual([]);
  });
  it('was als aufgelöst gemeldet ist, gibt es im Register nicht mehr', () => {
    const zeile = nachtrag.split('**Aufgelöst, nicht mehr im Register:**')[1].split('\n')[0];
    const weg = namen(zeile);
    expect(weg).toEqual(['success', 'dokumentTresor', 'exportTool', 'kalenderUhr', 'qr']);
    expect(weg.filter((n) => Icons[n] || ICON_INVENTAR[n])).toEqual([]);
  });
  it('Einbürgerung = Karte mit Plus, Stundenlohn = Uhr, wie im Wörterbuch', () => {
    expect(SEITEN_ZEICHEN.einbuergerung.zeichen).toBe('kartePlus');
    expect(SEITEN_ZEICHEN.stundenlohn.zeichen).toBe('uhr');
    expect(nachtrag).toMatch(/\*\*Einbürgerung\*\* \| Helvetia mit Abzeichen \*\*Karte mit Plus\*\*/);
  });
});
