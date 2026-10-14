// Schulden R2 Teil 2, Fix-Welle 13.10.2026 (A + B): amtlicher Wortlaut fr/it (Fedlex SR 281.1, Stand 1.1.2026),
// Verjährung nur rechnerisch, Verlustscheine vor 1997 ohne Datum.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { verjaehrungVerlustschein } from '../schuldenCalc.js';
import { SchuldenManager } from '../SchuldenManager.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE as palette } from '../config/constants.js';

const vs = (l) => l.schulden.verlustschein;
const beide = (x) => [x.sie, x.du];

describe('A · amtlicher Wortlaut fr/it (Fedlex)', () => {
  it('fr zinslos: LP art. 149 al. 4 wörtlich', () => {
    for (const s of beide(vs(fr).zinslos)) {
      expect(s).toContain('LP art. 149, al. 4 : le créancier « ne peut réclamer au débiteur des intérêts pour la créance constatée par acte de défaut de biens ».');
    }
  });
  it('fr verjaehrung: LP art. 149a al. 1 wörtlich (amtliche Schreibweise «biens;»)', () => {
    for (const s of beide(vs(fr).verjaehrung)) {
      expect(s).toContain('LP art. 149a, al. 1 : la créance « se prescrit par 20 ans à compter de la délivrance de l’acte de défaut de biens; à l’égard des héritiers du débiteur, elle se prescrit au plus tard par un an à compter de l’ouverture de la succession ». L’axe ne compte que les 20 ans à partir de la date de délivrance saisie.');
    }
  });
  it('it zinslos: LEF art. 149 cpv. 4 wörtlich', () => {
    for (const s of beide(vs(it_).zinslos)) {
      expect(s).toContain('LEF art. 149 cpv. 4: «Il debitore non può essere costretto a corrispondere interessi su di un credito accertato mediante un attestato di carenza di beni».');
    }
  });
  it('it verjaehrung: LEF art. 149a cpv. 1 wörtlich', () => {
    for (const s of beide(vs(it_).verjaehrung)) {
      expect(s).toContain('LEF art. 149a cpv. 1: il credito «si prescrive in venti anni dal rilascio dell’attestato di carenza di beni; nei confronti degli eredi del debitore il credito si prescrive al più tardi un anno a contare dal giorno dell’apertura della successione». L’asse conta soltanto i venti anni dalla data di rilascio indicata.');
    }
  });
  it('fr/it Mitschuldner-Satz geschlechtergerecht (Punkt 7)', () => {
    for (const s of beide(vs(fr).zinslos)) expect(s).toContain('Les personnes codébitrices et les cautions');
    for (const s of beide(vs(it_).zinslos)) expect(s).toContain('Le persone condebitrici e i fideiussori');
  });
  it('de: Mitschuldner-Satz geschlechtergerecht, Gesetzessatz unverändert; rm = de', () => {
    expect(vs(de).zinslos.sie).toContain('«Der Schuldner hat … keine Zinsen zu zahlen.»');
    expect(vs(de).zinslos.sie).toContain('Mitschuldnerinnen, Mitschuldner und Bürgschaftsgebende, die an Ihrer Stelle Zinsen zahlen müssen, können sie nicht von Ihnen zurückverlangen.');
    expect(vs(de).zinslos.du).toContain('Mitschuldnerinnen, Mitschuldner und Bürgschaftsgebende, die an deiner Stelle Zinsen zahlen müssen, können sie nicht von dir zurückverlangen.');
    expect(vs(rm).zinslos).toEqual(vs(de).zinslos);
  });
});

describe('B · Verjährung nur rechnerisch', () => {
  it('Lesezeile «20 Jahre nach Ausstellung» statt «verjährt am»', () => {
    expect(vs(de).verjaehrt).toBe('20 Jahre nach Ausstellung: {datum}');
    expect(vs(rm).verjaehrt).toBe('20 Jahre nach Ausstellung: {datum}');
    expect(vs(en).verjaehrt).toBe('20 years after issue: {datum}');
    expect(vs(fr).verjaehrt).toBe('20 ans après la délivrance : {datum}');
    expect(vs(it_).verjaehrt).toBe('20 anni dopo il rilascio: {datum}');
  });
  it('neutraler Satz nach dem Gesetzessatz, ohne Ursachenbehauptung', () => {
    expect(vs(de).verjaehrung.sie).toMatch(/Ausstellungsdatum\. Ob sich die Frist in Ihrem Fall verändert hat, kann Ihnen das Betreibungsamt sagen\.$/);
    expect(vs(de).verjaehrung.du).toMatch(/Ob sich die Frist in deinem Fall verändert hat, kann dir das Betreibungsamt sagen\.$/);
    expect(vs(en).verjaehrung).toMatch(/The debt enforcement office can tell you whether the period has changed in your case\.$/);
    expect(vs(fr).verjaehrung.sie).toMatch(/L’office des poursuites peut vous dire si le délai a changé dans votre cas\.$/);
    expect(vs(fr).verjaehrung.du).toMatch(/L’office des poursuites peut te dire si le délai a changé dans ton cas\.$/);
    expect(vs(it_).verjaehrung.sie).toMatch(/L’ufficio d’esecuzione può dirLe se nel Suo caso il termine è cambiato\.$/);
    expect(vs(it_).verjaehrung.du).toMatch(/L’ufficio d’esecuzione può dirti se nel tuo caso il termine è cambiato\.$/);
  });
  it('en: keine Anführungszeichen (kein amtlicher Wortlaut), Quelle ehrlich', () => {
    expect(vs(en).zinslos).toBe('Under SchKG Art. 149 para. 4, the debtor does not have to pay interest on a claim documented by a certificate of unpaid debt. This applies to you as the debtor. Co-debtors and guarantors who have to pay interest in your place may not claim it back from you.');
    expect(vs(en).verjaehrung).toContain('Under SchKG Art. 149a para. 1, the claim becomes time-barred 20 years after the certificate is issued; against the debtor’s heirs, however, at the latest one year after the succession is opened. The axis only counts the 20 years from the entered issue date.');
    expect(vs(en).zinslos).not.toMatch(/[“”"]/);
    expect(vs(en).verjaehrung).not.toMatch(/[“”"]/);
    expect(vs(en).quelle).toContain('Official texts in German, French and Italian; the English version on Fedlex is a non-binding translation.');
    expect(vs(en).quelle).not.toContain('German text where no English exists');
  });
});

describe('B · Ausstellung vor 1997', () => {
  it('verjaehrungVerlustschein: vor 1997-01-01 null, ab 1997-01-01 +20 Jahre', () => {
    expect(verjaehrungVerlustschein({ date: '1990-05-01' })).toBeNull();
    expect(verjaehrungVerlustschein({ date: '1996-12-31' })).toBeNull();
    expect(verjaehrungVerlustschein({ date: '1997-01-01' })).toBe('2017-01-01');
    expect(verjaehrungVerlustschein({ date: '01.05.1990' })).toBeNull();
  });
  it('vor1997-Text in allen fünf Sprachen, sie/du wo die Sprache es unterscheidet', () => {
    expect(vs(de).vor1997.sie).toBe('Ausgestellt vor 1997 — für diese Verlustscheine gilt eine Übergangsregel. Das Betreibungsamt kann Ihnen das Datum sagen.');
    expect(vs(de).vor1997.du).toContain('kann dir das Datum sagen');
    expect(typeof vs(en).vor1997).toBe('string');
    expect(vs(fr).vor1997.sie).toContain('1997');
    expect(vs(it_).vor1997.du).toContain('1997');
    expect(vs(rm).vor1997).toEqual(vs(de).vor1997);
  });
  const rendern = (e) => renderToStaticMarkup(React.createElement(SchuldenManager, {
    palette, t: (k, v) => k + (v ? JSON.stringify(v) : ''), data: { schulden: [], betreibung: [], verlustscheine: [e], finanzen: {}, basis: {} }, onSave: () => {}, onNavigate: () => {}, startView: 'verlustscheine',
  })).replace(/&quot;/g, '"');
  it('Lesezeile: vor 1997 zeigt vor1997, kein Datum, keine Zeitachse', () => {
    const h = rendern({ id: 1, creditor: 'Alt AG', amount: 5, date: '1990-05-01', rolle: 'schulde' });
    expect(h).toContain('schulden.verlustschein.vor1997');
    expect(h).not.toContain('schulden.verlustschein.verjaehrt');
    expect(h).not.toContain('schulden.verlustschein.ohneDatum');
    expect(h).not.toContain('schulden.verlustschein.zeitachse.label');
  });
  it('Lesezeile: ohne Datum bleibt «ohneDatum»', () => {
    const h = rendern({ id: 2, creditor: 'Ohne AG', amount: 5, rolle: 'schulde' });
    expect(h).toContain('schulden.verlustschein.ohneDatum');
    expect(h).not.toContain('schulden.verlustschein.vor1997');
  });
});
