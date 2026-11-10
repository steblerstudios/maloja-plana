// Bugsuche 09.11.2026, B-15 · «Weitere Bereiche» gilt je Kapitel.
// Vorher las ChapterView den Startwert nur beim ersten Aufbau. Da die Ansicht beim Wechsel
// bewusst nicht neu aufgebaut wird, übernahm Finanzen den Zustand des vorigen Kapitels: ein
// Bereich mit Daten blieb eingeklappt, entgegen «startet offen, sobald eines Daten trägt».
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { weitereBereicheAnfang } from '../ChapterView.jsx';

const src = fs.readFileSync(path.join(__dirname, '..', 'ChapterView.jsx'), 'utf8');

describe('weitereBereicheAnfang(hatDaten, gespeichert)', () => {
  it('offen, sobald ein weiterer Bereich Daten trägt — auch wenn zuletzt zugeklappt', () => {
    expect(weitereBereicheAnfang(true, 'false')).toBe(true);
  });
  it('sonst wie zuletzt in diesem Kapitel gewählt', () => {
    expect(weitereBereicheAnfang(false, 'true')).toBe(true);
    expect(weitereBereicheAnfang(false, 'false')).toBe(false);
    expect(weitereBereicheAnfang(false, null)).toBe(false);
  });
});

describe('Kapitelwechsel bestimmt den Startwert neu', () => {
  it('ein Effekt auf chapter.key setzt showSecondary aus weitereBereicheAnfang', () => {
    const effekte = src.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[chapter\.key\]\)[^\n]*/g) || [];
    expect(effekte.some((e) => /setShowSecondary\(weitereBereicheAnfang\(/.test(e))).toBe(true);
  });
});
