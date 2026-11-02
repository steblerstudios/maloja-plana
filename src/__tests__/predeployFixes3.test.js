import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { sozialhilfePegelState } from '../data/pegel.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import { berechneSozialhilfe } from '../data/sozialhilfeRechner.js';
import de from '../i18n/de.js';

const quelle = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const profil = (employmentType) => ({ basis: { canton: 'AG', dateOfBirth: '2008-03-01' }, wohnen: { rentAmount: '600' }, versicherungen: { kkPremium: '300' }, finanzen: { employmentType, monthlyIncome: '1200', incomeType: 'netto' } });

describe('Predeploy 02.11.2026, dritte Runde', () => {
  it('Lernende: kein Einkommensfreibetrag, Rechnung und Rechner gleich', () => {
    const lernend = calculateSozialhilfe(profil('apprentice'));
    const angestellt = calculateSozialhilfe(profil('employed'));
    expect(lernend.efb).toBe(0);
    expect(lernend.deficit).toBe(calculateSozialhilfe(profil(undefined)).deficit);
    expect(angestellt.efb).toBeGreaterThan(0);
    expect(lernend.erwerbsunkostenOffen).toBe(true);
    expect(lernend.ohneFreibetrag).toBe(true);
    expect(angestellt.ohneFreibetrag).toBe(false);
    // Das Feld für Erwerbsunkosten bleibt offen, der Freibetrag bleibt trotzdem weg.
    const v = sozialhilfeVorbefuellung(profil('apprentice'));
    expect(v.erwerbstaetig).toBe(true);
    expect(v.ohneFreibetrag).toBe(true);
    expect(sozialhilfeVorbefuellung(profil('employed')).ohneFreibetrag).toBe(false);
    const rechne = (ohneFreibetrag) => berechneSozialhilfe({ adults: 1, miete: 600, krankenkassePraemie: 300, erwerbseinkommen: 1200, erwerbsunkosten: 150, erwerbstaetig: true, ohneFreibetrag, kanton: 'AG' });
    expect(rechne(true).efb ?? 0).toBe(0);
    expect(rechne(false).efb).toBeGreaterThan(0);
  });

  it('Unfall: kein pauschaler Satz zu Arbeitslosen', () => {
    expect(de.absicherung?.unfallArbeitslos ?? quelle('../i18n/de.js')).toContain('AVIG Art. 8');
    expect(quelle('../i18n/de.js')).not.toContain('Wer arbeitslos ist, ist obligatorisch');
  });

  it('IV-Nachzahlung nennt die Ausnahme, die Rechnung den Aufschub', () => {
    expect(de.hilflos.wartezeitIv).toContain('(Abs. 2)');
    expect(de.hilflos.wartezeitIv).not.toContain('höchstens');
    expect(de.hilflos.aufschubNote).toContain('Art. 43bis');
    expect(de.hilflos.aufschubNote).toContain('Vorbezug');
    expect(quelle('../HilflosenRechner.jsx')).toContain("person !== 'kind' && React.createElement('div', { style: s.note }, t('hilflos.aufschubNote'))");
  });

  it('F, N, S: der Hinweis steht am Betrag', () => {
    expect(quelle('../components/Leistungsliste.jsx').match(/sh\.ansatzTiefer/g).length).toBe(2);
    expect(quelle('../SozialhilfeRechner.jsx')).toContain("hatAusweisFNS(data) && t('pegel.ansatzTiefer')");
    expect(quelle('../Schnellcheck.jsx')).toContain("w.ansatzTiefer ? ' · ' + t('pegel.ansatzTiefer')");
    expect(quelle('../data/anspruchWege.js')).toContain('ansatzTiefer: !!sh.ansatzTiefer');
  });
});

describe('Lernende: kein Nein ohne Grundlage (Predeploy 02.11.2026, vierte Runde)', () => {
  const fall = (employmentType, canton, lohn) => { const p = profil(employmentType); p.basis.canton = canton; p.finanzen.monthlyIncome = String(lohn); return p; };

  it('Mit Freibetrag ein Anspruch möglich: offen wie bei Angestellten, nicht «Kein Anspruch»', () => {
    const l = calculateSozialhilfe(fall('apprentice', 'AG', 2250));
    expect(l.income / l.totalBedarf).toBeGreaterThan(1.1);
    expect(l.deficit).toBe(0);
    expect(l.efbEntscheidet).toBe(true);
    expect(sozialhilfePegelState(fall('apprentice', 'AG', 2250)).mode).toBe('efb');
    // Gegenprobe: reicht das Einkommen auch mit Freibetrag, bleibt es gedeckt.
    expect(calculateSozialhilfe(fall('apprentice', 'AG', 2500)).efbEntscheidet).toBe(false);
    // Zürich zählt den Freibetrag beim Eintritt nicht: dort kein offener Fall.
    expect(calculateSozialhilfe(fall('apprentice', 'ZH', 2250)).efbEntscheidet).toBe(false);
  });

  it('Rechner: derselbe offene Fall', () => {
    const r = berechneSozialhilfe({ adults: 1, miete: 600, krankenkassePraemie: 300, erwerbseinkommen: 2250, erwerbstaetig: true, ohneFreibetrag: true, kanton: 'AG' });
    expect(r.efb ?? 0).toBe(0);
    expect(r.efbEntscheidet).toBe(true);
  });

  it('Basel-Stadt: gerechnet wie überall, aber kein Nein, solange der Eintrittsabzug einen Anspruch ergäbe', () => {
    const l = calculateSozialhilfe(fall('apprentice', 'BS', 1900));
    expect(l.efb).toBe(0);
    expect(l.deficit).toBe(61);
    expect(l.ohneFreibetrag).toBe(true);
    expect(calculateSozialhilfe(fall('apprentice', 'BS', 2100)).efbEntscheidet).toBe(true);
    // Über Bedarf + 200 gibt es auch für Angestellte nichts.
    expect(calculateSozialhilfe(fall('apprentice', 'BS', 2250)).efbEntscheidet).toBe(false);
  });

  it('Der offene Fall steht auch in der grossen Anzeige, im Dossier und auf der Karte', () => {
    expect(quelle('../SozialhilfeRechner.jsx')).toContain("result.efbEntscheidet || result.anspruchOffen ? 'dashboard.anspruchMoeglich' : 'sh.keinAnspruch'");
    expect(quelle('../dossierGenerator.js')).toContain("sozialhilfe.anspruchOffen ? t(sozialhilfe.offenText)");
    expect(quelle('../components/FinanzAuswertung.jsx')).toContain(": sozialhilfe.anspruchOffen ? t(sozialhilfe.offenText) +");
    expect(quelle('../SozialhilfeView.jsx')).toContain("sozialhilfe.anspruchOffen ? t(sozialhilfe.offenText) : t(sozialhilfe.noteKey");
  });

  it('Rechner kennt das offene Band, eine eingetragene Zahl beantwortet es', () => {
    const r = (erwerbsunkosten) => berechneSozialhilfe({ adults: 1, miete: 600, krankenkassePraemie: 300, erwerbseinkommen: 2000, erwerbsunkosten, erwerbstaetig: true, kanton: 'ZH' });
    expect(r(0).hatAnspruch).toBe(false);
    expect(r(0).anspruchOffen).toBe(true);
    expect(r(20).anspruchOffen).toBe(false);
    expect(berechneSozialhilfe({ adults: 1, miete: 600, krankenkassePraemie: 300, erwerbseinkommen: 2200, erwerbstaetig: true, kanton: 'ZH' }).anspruchOffen).toBe(false);
  });

  it('Rechner: eingetippte 0, kein Lohn und zu hohes Vermögen sind nicht offen', () => {
    const r = (x) => berechneSozialhilfe({ adults: 1, miete: 600, krankenkassePraemie: 300, erwerbseinkommen: 2000, erwerbstaetig: true, kanton: 'ZH', ...x });
    expect(r({ erwerbsunkostenErfasst: true }).anspruchOffen).toBe(false);
    expect(r({ erwerbseinkommen: 0, andereEinkuenfte: 2000 }).anspruchOffen).toBe(false);
    expect(r({ kanton: 'AG', erwerbseinkommen: 2011, vermoegen: 100000 }).efbEntscheidet).toBe(false);
    expect(r({ kanton: 'AG', erwerbseinkommen: 2011 }).efbEntscheidet).toBe(true);
  });

  it('Ohne Erwerb kein Lernenden-Fall', () => {
    expect(berechneSozialhilfe({ adults: 1, miete: 600, krankenkassePraemie: 300, erwerbseinkommen: 2250, erwerbstaetig: false, ohneFreibetrag: true, kanton: 'AG' }).efbEntscheidet).toBe(false);
    expect(calculateSozialhilfe(fall('apprentice', 'AG', 0)).ohneFreibetrag).toBe(false);
  });

  it('Der Hinweis steht an jedem Betrag und nennt beide Anerkennungen', () => {
    expect(quelle('../dossierGenerator.js')).toContain("sozialhilfe.ohneFreibetrag && t('pegel.ohneFreibetrag')");
    expect(quelle('../components/FinanzAuswertung.jsx').match(/sozialhilfe\.ohneFreibetrag/g).length).toBe(2);
    expect(quelle('../BudgetSync.jsx')).toContain("sozialhilfe?.ohneFreibetrag ? ' ' + t('pegel.ohneFreibetrag')");
    expect(de.pegel.ohneFreibetrag).toContain('Integrationszulage');
  });
});
