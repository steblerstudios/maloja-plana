import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { generateLetter, brauchtZustimmungFamilienwohnung } from '../briefGenerator.js';
import { kvgKuendigungsTermin } from '../utils/festeFristen.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// Gruppe B «Ordnen & Unterlagen» (Befund 11.11.2026, docs/design/gruppe-b-unterlagen.html).
// L1: Mietkündigung der Familienwohnung braucht die Zustimmung der Ehegattin, des Ehegatten oder der
//     eingetragenen Person, sonst nichtig (OR Art. 266m, 266o) — zweite Unterschrift im Brief.
// L2: Kassenwechsel-Brief kündigt nach der Frist (letzter Werktag im November, KVG Art. 7 Abs. 2) auf das
//     nächste Jahresende, nie auf einen Termin, der nicht mehr möglich ist.
// ─────────────────────────────────────────────────────────────

const t = createT({ de, en, fr, it: itTranslations, rm }, 'de', 'sie');
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const person = (maritalStatus) => ({ basis: { firstName: 'Anna', lastName: 'Muster', maritalStatus }, wohnen: { address: 'Hof 3', city: 'Basel' }, versicherungen: { kkInsurer: 'CSS' } });

describe('L1: Zustimmung zur Kündigung der Familienwohnung', () => {
  it('verheiratet und eingetragen: zweite Unterschrift im Brief (gedruckt, nicht nur in der legal-note)', () => {
    for (const z of ['married', 'registeredPartnership']) {
      const html = generateLetter('leaseTermination', person(z), t);
      expect(html).toContain('class="zustimmung"');
      expect(html).toContain(de.briefe.leaseTermination.zustimmungTitel);
    }
  });
  it('ohne Angabe zum Zivilstand: die Zeile steht im Brief (lieber zu viel als nichtig)', () => {
    expect(generateLetter('leaseTermination', person(undefined), t)).toContain('class="zustimmung"');
  });
  it('ledig, Konkubinat, geschieden, verwitwet, aufgelöst: keine zweite Unterschrift', () => {
    for (const z of ['single', 'cohabiting', 'divorced', 'widowed', 'dissolvedPartnership']) {
      expect(brauchtZustimmungFamilienwohnung(person(z))).toBe(false);
      expect(generateLetter('leaseTermination', person(z), t)).not.toContain('class="zustimmung"');
    }
  });
  it('der Druck blendet die Zeile nicht aus (nur .legal-note ist versteckt)', () => {
    const html = generateLetter('leaseTermination', person('married'), t);
    const druck = html.split('\n').find((z) => z.includes('@media print'));
    expect(druck).toContain('.legal-note { display: none; }');
    expect(druck).not.toContain('zustimmung');
  });
  it('vor dem Formular steht der Hinweis (OR Art. 266m, 266o) und «von Hand, eingeschrieben»', () => {
    expect(quelle('BriefGenerator.jsx')).toMatch(/selected === 'leaseTermination'[\s\S]{0,300}brauchtZustimmungFamilienwohnung\(data\)/);
    expect(de.briefe.leaseTermination.hinweis.zustimmung.sie).toMatch(/nichtig \(OR Art\. 266m, 266o\)/);
  });
});

describe('L2: Kassenwechsel-Brief nennt das Jahr, nach der Frist das nächste', () => {
  it('Termin: bis zum letzten Werktag im November das laufende Jahr, danach das nächste', () => {
    expect(kvgKuendigungsTermin('2026-11-11')).toMatchObject({ jahr: 2026, frist: '2026-11-30', nachFrist: false });
    expect(kvgKuendigungsTermin('2026-11-30')).toMatchObject({ jahr: 2026, nachFrist: false });
    expect(kvgKuendigungsTermin('2026-12-01')).toMatchObject({ jahr: 2027, frist: '2027-11-30', nachFrist: true, verpasstJahr: 2026 });
    // 2030: der 30.11. ist ein Samstag → Frist Freitag 29.11.; am Samstag ist sie schon vorbei.
    expect(kvgKuendigungsTermin('2030-11-29')).toMatchObject({ jahr: 2030, frist: '2030-11-29' });
    expect(kvgKuendigungsTermin('2030-11-30')).toMatchObject({ jahr: 2031, nachFrist: true });
  });
  it('der Brief kündigt «per 31. Dezember 2026» am 11.11. und «2027» am 1.12. — nie «des laufenden Jahres»', () => {
    expect(generateLetter('insuranceSwitch', person('single'), t, { heute: '2026-11-11' })).toContain('per 31. Dezember 2026.');
    const dez = generateLetter('insuranceSwitch', person('single'), t, { heute: '2026-12-01' });
    expect(dez).toContain('per 31. Dezember 2027.');
    expect(dez).not.toContain('des laufenden Jahres');
  });
  it('alle Sprachen setzen das Jahr ein', () => {
    for (const l of [de, fr, itTranslations, en, rm]) expect(l.briefe.insuranceSwitch.body1).toContain('{jahr}');
  });
  it('L3: Hinweis vor dem Formular — Frist, Anmeldung zuerst (Art. 7 Abs. 5), Ausstände (Art. 64a Abs. 6)', () => {
    const h = de.briefe.insuranceSwitch.hinweis;
    expect(h.anmelden).toMatch(/KVG Art\. 7 Abs\. 5/);
    expect(h.ausstaende).toMatch(/KVG Art\. 64a Abs\. 6/);
    expect(quelle('BriefGenerator.jsx')).toMatch(/selected === 'insuranceSwitch'[\s\S]{0,200}kvgKuendigungsTermin\(heuteIso\(\)\)/);
  });
});

// ─── L4–L8 und Kleines ───
describe('L4/L5: Kalender-Vorlagen nie aus dem Klickdatum', () => {
  it('L5 Kassenwechsel: zehn Tage vor dem letzten Werktag im November, danach nächstes Jahr', async () => {
    const { kkWechselErinnerung } = await import('../CalendarReminders.jsx');
    expect(kkWechselErinnerung('2026-11-11')).toBe('2026-11-20');
    expect(kkWechselErinnerung('2026-11-25')).toBe('2026-11-25'); // Erinnerungsdatum vorbei, Frist nicht: heute
    expect(kkWechselErinnerung('2026-12-01')).toBe('2027-11-20');
    expect(kkWechselErinnerung('2030-01-10')).toBe('2030-11-19'); // 30.11.2030 Samstag → Frist 29.11.
  });
  it('L4 Steuerfrist aus den Angaben, sonst ins Formular ohne Datum; Bewilligung ohne Datum', () => {
    const s = quelle('CalendarReminders.jsx');
    expect(s).toMatch(/taxDeadline'\), category: 'finance', recurrence: 'yearly', festesDatum: data\?\.behoerden\?\.taxFilingDeadline/);
    expect(s).toMatch(/permitRenewal'\), category: 'admin', recurrence: 'once', ohneDatum: true/);
    expect(s).toMatch(/if \(template\.ohneDatum\) \{[\s\S]{0,300}setNewDate\(''\); setView\('add'\)/);
    expect(s).not.toMatch(/taxDeadline'\)[^\n]*daysFromNow/);
  });
});

describe('L6–L8 und Kleines', () => {
  it('L6 Rechnung beanstanden: Verfügung verlangen (ATSG Art. 49, 51)', () => {
    expect(de.briefe.kkReklamation.body3).toMatch(/anfechtbare Verfügung \(Art\. 49 Abs\. 1 und 51 Abs\. 2 ATSG\)/);
    expect(quelle('briefGenerator.js')).toMatch(/legalRef: 'ATSG Art\. 49, 51'/);
  });
  it('L7 Ablage: kein «sicher» ohne Tresor-Sperre', () => {
    expect(de.tresor.noDocumentsHint.sie).not.toMatch(/sicher\b/);
    expect(de.tresor.noDocumentsHint.sie).toMatch(/Tresor-Sperre zusätzlich verschlüsselt/);
  });
  it('L8 Organspende: kein Register als Antragsstelle; Links korrigiert', async () => {
    const s = quelle('data/direktLinks.js');
    expect(s).not.toMatch(/Organspende-Register/);
    expect(s).not.toMatch(/ge\.ch\/tax\/|taxme\.ch|Kantonale AHV-Zweigstelle|ältere Arbeitslose ab 60/);
  });
  it('Lohnmahnung: Gericht am Arbeitsort oder am Sitz des Arbeitgebers (ZPO Art. 34)', () => {
    expect(de.briefe.unpaidWage.legalNote).toMatch(/am Arbeitsort oder am Sitz des Arbeitgebers/);
  });
  it('Lebensmappe und Behörden-Dossier nennen die persönlichen Angaben', () => {
    expect(de.lebensmappe.footerPrivacy).toMatch(/AHV-Nummer/);
    expect(de.behoerdenDossier.footerPrivacy).toMatch(/AHV-Nummer/);
  });
});

describe('Gestaltung A, C, D (B Bücherregal: nicht gebaut, zum Besprechen)', () => {
  it('A: auch die eigene Wahl per Karte springt zum Formular; über dem Formular steht der Name des Briefs', () => {
    const s = quelle('BriefGenerator.jsx');
    expect(s).toMatch(/setSprung\(\(n\) => n \+ 1\)/);
    expect(s).toMatch(/\}, \[initialTemplate, sprung\]\);/);
    expect(s).toMatch(/'aria-pressed': selected === tmpl\.key/);
    expect(s).toMatch(/id: 'brief-form-titel'/);
    expect(de.briefe.formTitel).toBe('Brief: {name}');
  });
  it('C: Was ansteht nicht breiter als die Seite (−20 px wie das Seitenpolster), Löschen am Eintrag, Reiter «Termine»', () => {
    const s = quelle('CalendarReminders.jsx');
    expect(s).not.toMatch(/margin: '(4px|0) -24px 2px'/);
    expect(s).toMatch(/onDelete: \(\) => deleteReminder\(r\.id\)/);
    expect(s).not.toMatch(/t\('calendar\.loeschHinweis'\)/);
    expect(de.calendar.reiterTermine).toBe('Termine');
  });
  it('D: Ablage-Titel trennt «Dokumenten-ablage», ein Satz für beide Wege', () => {
    expect(de.tresor.title).toBe('Dokumenten­ablage');
    expect(de.tresor.noDocumentsHint.sie).toMatch(/^Fügen Sie oben oder im passenden Kapitel ein Dokument hinzu\./);
  });
});
