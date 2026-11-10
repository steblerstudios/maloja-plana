import { describe, it, expect } from 'vitest';
import { probezeitEnde } from '../NeuerJob.jsx';
import { selbstAhvWerte, SELBST_AHV_JE_JAHR } from '../data/selbstaendigAhv.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Kapitel 5 «Ausbildung & Arbeit», Inhalt L5–L7, A1, A2, K (Entscheid Stebler Studios 10.11.2026 «Ja, alles»).
const tDe = createT({ de }, 'de', 'sie');
const sprachen = { de, fr, it: it_, en, rm };

describe('K · Probezeit-Ende (OR Art. 335b Abs. 1)', () => {
  it('Antritt am Monatsende: 31.01. → 28.02. (vorher 27.02.)', () => {
    expect(probezeitEnde('2027-01-31')).toBe('2027-02-28');
    expect(probezeitEnde('2027-01-29')).toBe('2027-02-28');
    expect(probezeitEnde('2028-01-31')).toBe('2028-02-29');
  });
  it('Normalfall unverändert: 01.08. → 31.08., 28.01. → 27.02., 15.03. → 14.04.', () => {
    expect(probezeitEnde('2026-08-01')).toBe('2026-08-31');
    expect(probezeitEnde('2027-01-28')).toBe('2027-02-27');
    expect(probezeitEnde('2026-03-15')).toBe('2026-04-14');
  });
  it('ungültiges Datum → kein Datum', () => {
    expect(probezeitEnde('2026-02-31')).toBeNull();
    expect(probezeitEnde('')).toBeNull();
  });
});

describe('A2 · Probezeit: sieben Tage Frist, Verlängerung bei Krankheit und Unfall (OR Art. 335b Abs. 3)', () => {
  it('Text und Erinnerung nennen beides', () => {
    expect(tDe('neuerJob.step5Text')).toMatch(/sieben Tagen/);
    expect(tDe('neuerJob.step5Text')).toMatch(/krank oder verunfallt, verlängert sie sich/);
    expect(tDe('neuerJob.reminderNotes')).toMatch(/verlängern/);
  });
  it('K · «ab 8 Stunden» meint die Freizeit (UVV Art. 13), Berufsunfall immer', () => {
    const s = tDe('neuerJob.step3Text');
    expect(s).toMatch(/gegen Berufsunfälle versichert/);
    expect(s).toMatch(/mindestens 8 Stunden pro Woche, auch gegen Unfälle in der Freizeit \(UVV Art\. 13\)/);
  });
});

describe('L5–L7 · Stelle verloren', () => {
  it('L5: Einstellung nach Gesetz — 31 bis 60 Tage bei eigener Kündigung ohne neue Stelle, Kasse verfügt', () => {
    const s = tDe('stelleVerloren.footerSperrzeit');
    expect(s).toMatch(/31 bis 60 Tage/);
    expect(s).toMatch(/Höchstzahl der Taggelder ab/);
    expect(s).toMatch(/verfügt die Arbeitslosenkasse \(AVIG Art\. 30, AVIV Art\. 45\)/);
    expect(s).not.toMatch(/kann das RAV/);
  });
  it('L6: fehlende Arbeitsbemühungen → Einstelltage', () => {
    expect(tDe('stelleVerloren.step1Text')).toMatch(/Fehlen sie, gibt es Einstelltage/);
  });
  it('L7: Abredeversicherung vor dem Ende der Deckung, mit Datum (UVV Art. 8)', () => {
    const s = tDe('stelleVerloren.step2Hinweis', { date: '01.03.2027' });
    expect(s).toMatch(/spätestens am 01\.03\.2027 \(UVV Art\. 8\)/);
    for (const [l, d] of Object.entries(sprachen)) expect(d.stelleVerloren.step2Hinweis, l).toMatch(/\{date\}.*\{date\}/);
  });
});

describe('A1 · Selbständig: AHV-Akontobeiträge (AHV-Merkblatt 2.02, Stand 1.1.2026)', () => {
  it('Werte 2026 wie im Merkblatt', () => {
    expect(SELBST_AHV_JE_JAHR[2026]).toMatchObject({ satzVoll: 10, grenzeVoll: 60500, mindestbeitrag: 530, verzugszins: 5 });
  });
  it('2027 ist nicht eingetragen: die Seite zeigt die Werte 2026 und sagt «Stand 2026»', () => {
    const w = selbstAhvWerte(2027);
    expect(w.jahr).toBe(2026);
    expect(w.belegt).toBe(false);
  });
  it('der Satz nennt vierteljährlich, Mindestbeitrag, Verzugszins und den Stand', () => {
    const s = tDe('selbstaendigkeit.step4Text', { satz: 10, grenze: '60’500', mindest: '530', zins: 5, jahr: 2026 });
    expect(s).toMatch(/jedes Quartal/);
    expect(s).toMatch(/mindestens aber 530 Franken/);
    expect(s).toMatch(/5 % Verzugszins/);
    expect(s).toMatch(/Stand 2026/);
    expect(s).not.toMatch(/an der Quelle/);
    expect(s).toMatch(/im In- und Ausland zusammengezählt \(MWSTG Art\. 10\)/);
  });
});
