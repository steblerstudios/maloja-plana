import React, { useState } from 'react';
import { text, weight, space, leading, duration, ease, radius } from '../../config/tokens.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';
import { PROGRAMM_KANTONE } from '../../data/mietzinsbeitraege.js';
import { WOHNEN_INTERNATIONAL } from '../../data/wohnenInternational.js';
import { renderSource } from '../../utils/renderSource.js';
import { zahl, betrag } from '../../utils/geld.js';
import { LegendenMarke } from '../../components/LegendenMarke.jsx';
import { Belege } from '../../components/Belege.jsx';
import { knopfStil, linkStil } from '../../components/PrimaryButton.jsx';
import { Kalenderblatt } from '../../components/Kalenderblatt.jsx';
import { Icon } from '../../IconSystem.jsx';
import { CHAPTER_KEYS } from '../../config/constants.js';
import { calcDuration, addressLine } from '../../MirrorCards.jsx';
import { wohnkostenRechnung, anteilText, wohnkostenSatzKey, drittelSatzKey, mieteLage, mietVorbehalte, mietzinsHilfe, beitragAnteil, lageWert } from './rechnung.js';
import { DrittelHaus, Vergleichshaus, MoeglichKnopf, Kachelkarte } from './bilder.jsx';

// Lebensbereich Wohnen · die Orte (Bauplan Lebensbereich, Stebler Studios 18.11.2026).
//   WohnenZuhause   Kapitel Wohnen, gross 256
//   WohnenWerkzeug  Werkzeug «Mietzins», mittel 128
//   WohnenStrasse   die eine Szene für beide: Drittel-Haus · Vergleichshaus (Tür = Fass) · Wegweiser «möglich ›».
// Unter jedem Haus seine Hauptzahl (Regel «Zahl», Matrix §10): Anteil unter dem Drittel-Haus, Lage unter dem
// Vergleichshaus. Jedes Bild steht nur einmal auf der Seite; Zusätze (Regler, Kantonskarte, Ausland) unter «Mehr dazu».

export const REGLER_MIN = 800;
export const REGLER_MAX = 3500;
export const REGLER_SCHRITT = 50;
// Eine erfasste Miete über 3'500 bleibt auf dem Regler erreichbar (kein Sprung beim ersten Schieben).
export const reglerMax = (heute) => Math.max(REGLER_MAX, Math.ceil(heute / REGLER_SCHRITT) * REGLER_SCHRITT);
const aufRegler = (v, max) => Math.min(max, Math.max(REGLER_MIN, Math.round(v / REGLER_SCHRITT) * REGLER_SCHRITT));

const zahlStil = { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' };
const BILDHOEHE = { gross: 190, mittel: 128 };

// Die Szene. `r` = wohnkostenRechnung, `ml` = mieteLage, `hilfe` = mietzinsHilfe. Der Wegweiser führt im Kapitel
// ins Werkzeug (`onNavigate`), im Werkzeug zur kantonalen Stelle (`url`).
// `kapitel`: die Kosten stehen schon gross im Kopf, darum sagt die Zeile unter dem Drittel-Haus, worauf sich die
// Prozente beziehen (Stebler Studios 20.11.2026, «wie die Finanzen»).
export const WohnenStrasse = ({ palette, t, r, ml, hilfe, groesse = 'gross', isDarkMode, onNavigate, ausprobiert = false, kapitel = false }) => {
  const h = React.createElement;
  const fuell = bereichFillColor('wohnen', isDarkMode) || palette.sage;
  const behoerden = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  const mitAnteil = r && r.anteil != null;
  const bildH = BILDHOEHE[groesse] || BILDHOEHE.gross;
  const boden = { height: bildH + 'px', display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid ' + palette.mid, paddingBottom: 0 };
  const spalte = (breite) => ({ flex: '0 1 ' + breite + 'px', minWidth: 0, display: 'flex', flexDirection: 'column' });
  const tuer = hilfe ? { programm: hilfe.programm, fass: hilfe.fass, farbe: behoerden } : null;
  const schild = hilfe && hilfe.moeglich ? h(MoeglichKnopf, { palette, t, onNavigate, url: onNavigate ? undefined : hilfe.url, kurz: true }) : null;
  return h('div', { 'data-teil': 'wohnen-strasse', 'data-groesse': groesse, style: { display: 'flex', alignItems: 'flex-start', gap: '0 ' + space.md + 'px', flexWrap: 'wrap', margin: '0 0 ' + space.sm + 'px' } },
    // Frage A · Ihr Haus
    mitAnteil && h('div', { 'data-teil': 'strasse-drittel', style: spalte(bildH) },
      h('div', { style: boden }, h('div', { style: { width: '100%' } },
        h(DrittelHaus, { palette, t, anteil: r.anteil, ueberDrittel: r.ueberDrittel, mitPartner: r.mitPartner, brutto: r.brutto,
          teile: groesse === 'gross' && r.haushalt ? { sie: r.einkommen - r.partnerEinkommen, partner: r.partnerEinkommen } : null,
          beitrag: r.beitrag ? { ...r.beitrag, farbe: behoerden } : null, fuell, groesse }))),
      h('div', { 'data-instrument-zahl': 'wohnkosten', 'aria-live': 'polite', style: { ...zahlStil, color: palette.text, marginTop: space.xs + 'px' } }, anteilText(r)),
      h('div', { 'data-teil': 'wohnkosten-franken', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } },
        kapitel && !ausprobiert ? t(wohnkostenSatzKey(r)) + ' (' + betrag(r.einkommen) + ')'
          : t(ausprobiert ? 'wohnenInstrument.titelAusprobiert' : 'wohnenInstrument.titel') + ': ' + betrag(r.kosten))),
    // Frage B · das Vergleichshaus, Tür = Fass (Frage C)
    ml && h('div', { 'data-teil': 'strasse-vergleich', style: spalte(bildH) },
      h('div', { style: boden }, h('div', { style: { width: '100%' } },
        h(Vergleichshaus, { palette, lage: ml, fuell, tuer, groesse, kanton: ml.kanton }))),
      ml.lage && h('div', { 'data-instrument-zahl': 'miete', style: { ...zahlStil, color: palette.text, marginTop: space.xs + 'px' } }, lageWert(ml.lage)),
      h('div', { 'data-teil': 'strasse-betrag', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', whiteSpace: 'nowrap' } },
        (ausprobiert ? t('strasse.ausprobiert') : t('strasse.eigen')) + ': ' + betrag(ml.netto))),
    // Frage C · der Wegweiser steht auf dem Boden der Strasse, rechts vom Vergleichshaus
    schild && h('div', { 'data-teil': 'wegweiser-in-strasse', style: { ...spalte(140), flex: '0 0 auto' } },
      h('div', { style: { ...boden, borderBottom: '1px solid ' + palette.mid } }, schild)),
  );
};

// Die Sätze zur Lage (ehemals im Barometer): eigener Wert gegen den Kanton, Kanton gegen die Schweiz, Vorbehalte, Quelle.
export const MieteSaetze = ({ palette, t, ml, imKapitel, ohneQuelle = false }) => {
  if (!ml) return null;
  const h = React.createElement;
  const ns = 'po.regionalCompare.';
  const k = ns + 'rent.';
  const { diffPct } = ml.vergleich;
  const rund = Math.round(diffPct);
  const dir = rund > 0 ? 'Above' : rund < 0 ? 'Below' : 'Equal';
  const textFarbe = ml.lage?.richtung === 'Above' ? palette.goldDeep : ml.lage?.richtung === 'Below' ? palette.sageDeep : palette.mid;
  const klein = { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal };
  return h('div', { 'data-teil': 'miete-saetze' },
    ml.lage && h('div', { 'data-teil': 'barometer-eigener-wert', style: { fontSize: text.sm, color: textFarbe, fontWeight: weight.medium, marginTop: space.sm + 'px', lineHeight: leading.normal } },
      t(k + 'user' + ml.lage.richtung, { pct: Math.abs(ml.lage.pct) })),
    h('div', { 'data-teil': 'barometer-region', style: klein }, t(ns + 'region' + dir, { pct: Math.abs(rund) })),
    h('div', { 'data-teil': 'miete-vergleich-groesse', style: klein }, mietVorbehalte(t, ml.vergleich, { imKapitel }).join(' ')),
    !ohneQuelle && h(MieteQuelle, { palette, t, ml }),
  );
};

// Die Quelle der Vergleichsmieten (BFS). Im Kapitel sichtbar direkt unter der Strasse, weil die Zahlen im
// Vergleichshaus daraus kommen.
export const MieteQuelle = ({ palette, t, ml }) => React.createElement('div', {
  'data-teil': 'miete-quelle', style: { fontSize: text.xs, color: palette.soft, fontStyle: 'italic', marginTop: space.xs + 'px', lineHeight: leading.normal },
}, renderSource(t('po.regionalCompare.rent.source', { year: ml.vergleich.year }), null, t));

// Der Satz und die Quelle zum EU-Stock: abgeleitet, keine gemessenen Preise in Franken.
export const InternationalHinweis = ({ palette, t }) => React.createElement('div', { 'data-teil': 'international-hinweis', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.xs + 'px 0 ' + space.sm + 'px' } },
  React.createElement('p', { style: { margin: 0 } }, t('wohnenInternational.satz', Object.fromEntries(['DE', 'AT', 'FR', 'IT'].map((c) => {
    const p = Math.round((WOHNEN_INTERNATIONAL.index[c] / WOHNEN_INTERNATIONAL.index.CH - 1) * 100);
    return [c, (p >= 0 ? '+' : '−') + Math.abs(p)];
  })))),
  React.createElement(Belege, { palette, t, zeile: t('wohnenInternational.quelle'), style: { fontSize: text.xs } }));

const BeitragLegende = ({ palette, t, hoechst, farbe }) => React.createElement('p', {
  'data-teil': 'beitrag-legende', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.xs + 'px 0 0', display: 'flex', gap: '4px' },
},
  React.createElement('svg', { width: 14, height: 10, viewBox: '0 0 14 10', 'aria-hidden': 'true', style: { flexShrink: 0, marginTop: '4px' } },
    React.createElement('rect', { x: 0.75, y: 0.75, width: 12.5, height: 8.5, fill: 'none', stroke: farbe, strokeWidth: 1.5, strokeDasharray: '3 2' })),
  t('mietzinsSzene.beitragLegende', { betrag: zahl(hoechst) }));

// Satz zu Frage C: die Einschätzung des Kantons, nie «Anspruch».
const hilfeSatz = (t, hilfe) => {
  const e = hilfe.einschaetzung;
  return e.hasProgram && e.assessment ? t('mietzinsView.result_' + e.assessment.key, e.assessment.params || {}) : t('mietzins.' + e.info.state);
};

// Alles, was der Ort braucht, aus den drei Rechnungen.
const szene = (data, wohnen, probe, kanton) => {
  const r = wohnkostenRechnung(wohnen, data, probe);
  const profil = { ...(data || {}), wohnen: { ...(data?.wohnen || {}), ...(wohnen || {}) } };
  const ml = r.netto > 0 ? mieteLage(profil, { kanton, miete: r.netto }) : null;
  const hilfe = mietzinsHilfe(profil, kanton || profil?.basis?.canton || '');
  const b = beitragAnteil(profil, r, kanton || profil?.basis?.canton || '');
  return { r: { ...r, beitrag: b }, ml, hilfe };
};

// ── Kapitel Wohnen (Zuhause, gross) ─────────────────────────────────────────────────────────────────────────────────
// Aufbau wie Finanzen (Stebler Studios 20.11.2026, Varianten docs/design/wohnen-varianten.html: 1 A+C, 2 weg, 3 A+B+C,
// 4 A+B+C): oben die Wohnkosten gross, Monat oder Jahr · die Strasse (die Häuser tragen Anteil und Lage, darum keine
// Zeilen mit Balken) · Mietbeiträge mit der Kantonskarte offen (die Tür im Vergleichshaus ist das Fass dazu) ·
// Regler offen · am Rand Wohndauer, Hausrat & Haftpflicht (Schild), Vermieterschaft · «Mehr dazu» nur noch die Sätze.
const halb = (v) => Math.round(Number(v) || 0);
export const WohnenZuhause = ({ palette, t, wohnen, allData, isDarkMode, onNavigate }) => {
  const h = React.createElement;
  const [probe, setProbe] = useState(null);
  const [offen, setOffen] = useState(false);
  const [jahr, setJahr] = useState(false);
  const { r, ml, hilfe } = szene(allData, wohnen, probe);
  // Ohne erfasste Wohnkosten bleibt das Instrument weg — das Formular darunter ist der Ort zum Eintragen.
  if (r.kosten <= 0) return null;
  const max = reglerMax(r.heute);
  const ausprobiert = probe != null && probe !== r.heute;
  const fuell = bereichFillColor('wohnen', isDarkMode) || palette.sage;
  const behoerden = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const satz = { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal };
  const zeile = { display: 'flex', justifyContent: 'space-between', gap: space.md + 'px', padding: '8px 0', fontSize: text.sm, color: palette.text };
  const kapH = { margin: space.lg + 'px 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };
  const trenner = { borderTop: '1px solid ' + palette.border + '88', paddingTop: space.sm + 'px', marginTop: space.md + 'px' };
  const w = wohnen || {};
  const v = allData?.versicherungen || {};
  const f = jahr ? 12 : 1;
  const geld = (x) => betrag(halb(x * f));

  // Kopf: Wohnkosten gross, darunter woraus sie bestehen und wo.
  const hypothek = w.mortgageStatus === 'no' ? 0 : Number(w.mortgagePayment) || 0;
  const teile = [
    r.netto > 0 && t('wohnenKopf.miete', { betrag: geld(r.netto) }),
    hypothek > 0 && t('wohnenKopf.hypothek', { betrag: geld(hypothek) }),
    r.nk > 0 && t('wohnenKopf.nebenkosten', { betrag: geld(r.nk) }),
    Number(w.buildingsInsurance) > 0 && t('wohnenKopf.gebaeude', { betrag: geld(Number(w.buildingsInsurance) / 12) }),
  ].filter(Boolean);
  const adresse = addressLine(w);
  const pille = (an, label, onClick) => h('button', {
    type: 'button', 'aria-pressed': an ? 'true' : 'false', onClick,
    style: { minHeight: '44px', padding: '0 ' + space.md + 'px', border: 'none', borderRadius: radius.md + 'px', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm,
      fontWeight: an ? weight.semi : weight.normal, color: palette.text, background: an ? palette.gold : palette.border + '55' },
  }, label);
  const kopf = h('div', { 'data-teil': 'wohnen-kopf', style: { marginBottom: space.md + 'px' } },
    h('div', { role: 'group', 'aria-label': t('wohnenKopf.zeitraum'), style: { display: 'flex', gap: space.xs + 'px', marginBottom: space.sm + 'px' } },
      pille(!jahr, t('wohnenKopf.monat'), () => setJahr(false)), pille(jahr, t('wohnenKopf.jahr'), () => setJahr(true))),
    h('div', { 'data-instrument-zahl': 'wohnkosten-kopf', 'aria-live': 'polite', style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } },
      geld(r.kosten), h('span', { style: { fontSize: text.sm, fontWeight: weight.normal, color: palette.mid } }, ' ' + (jahr ? t('wohnenKopf.imJahr') : t('common.perMonth')))),
    (teile.length > 0 || adresse) && h('div', { style: satz }, [teile.join(' + '), adresse].filter(Boolean).join(' · ')));

  // Am Rand: was kein Haus ist, mit eigenem Bild (wie Kalenderblatt und Thermometer bei Finanzen).
  const weg = (label, ziel) => onNavigate && h('button', {
    type: 'button', className: 'mp-link', onClick: ziel,
    style: { ...linkStil(palette), minHeight: '44px', fontSize: text.sm, padding: 0, textAlign: 'left' },
  }, label + ' ›');
  const randStueck = (teil, bild, ...inhalt) => h('div', { 'data-rand': teil, style: { display: 'flex', gap: space.sm + 'px', alignItems: 'center', flex: '1 1 220px', minWidth: 0 } },
    h('div', { 'aria-hidden': 'true', style: { flex: '0 0 auto', display: 'flex' } }, bild), h('div', { style: { minWidth: 0 } }, ...inhalt));
  const randZahl = (s) => h('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, s);
  const dauer = calcDuration(w.moveInDate, t);
  const hausrat = v.householdInsurance === 'yes' || v.householdInsurance === 'no';
  const haftpflicht = v.liabilityInsurance === 'yes' || v.liabilityInsurance === 'no';
  const status = (wert) => wert === 'yes' ? '' : ': ' + t('wohnenKopf.keine');
  const praemien = [v.householdInsurance === 'yes' && Number(v.householdInsuranceAmount) > 0 && betrag(Number(v.householdInsuranceAmount)),
    v.liabilityInsurance === 'yes' && Number(v.liabilityPremium) > 0 && betrag(Number(v.liabilityPremium))].filter(Boolean);
  const telefon = String(w.landlordPhone || '').trim();
  const rand = [
    dauer && randStueck('wohndauer', h(Kalenderblatt, { iso: String(w.moveInDate).slice(0, 10), palette, klein: true }),
      // Die Dauer allein (Nominativ wie «Wohndauer 5 Jahre, 3 Monate»); «seit» stünde im Dativ.
      randZahl(dauer),
      h('div', { style: satz }, t('wohnenKopf.seitDatum', { datum: String(w.moveInDate).slice(0, 10).split('-').reverse().join('.') })),
      weg(t('wohnenKopf.umzug'), () => onNavigate('umzug'))),
    (hausrat || haftpflicht) && randStueck('zuhause-versichert', h(Icon, { name: 'versicherungen', size: 44, color: bereichFillColor('versicherungen', isDarkMode) || palette.text }),
      randZahl([hausrat && t('wohnenKopf.hausrat') + status(v.householdInsurance), haftpflicht && t('wohnenKopf.haftpflicht') + status(v.liabilityInsurance)].filter(Boolean).join(' · ')),
      (v.householdInsurance === 'yes' || v.liabilityInsurance === 'yes') && h('div', { style: satz },
        [t('wohnenKopf.versichert'), praemien.length > 0 && praemien.join(' + ') + ' ' + t('wohnenKopf.imJahr')].filter(Boolean).join(' · ')),
      weg(t('chapters.versicherungen.title'), () => onNavigate('chapter', CHAPTER_KEYS.indexOf('versicherungen')))),
    w.landlord && randStueck('vermieterschaft', h(Icon, { name: 'phone', size: 36, color: palette.text }),
      randZahl(w.landlord),
      telefon && h('div', { style: satz }, telefon),
      telefon && h('a', { href: 'tel:' + telefon.replace(/[^+\d]/g, ''), className: 'mp-link',
        style: { ...linkStil(palette), display: 'inline-flex', alignItems: 'center', minHeight: '44px', fontSize: text.sm } }, t('wohnenKopf.anrufen') + ' ›')),
  ].filter(Boolean);

  return h('section', { 'data-teil': 'wohnkosten', style: { marginBottom: space.lg + 'px' } },
    kopf,
    h(WohnenStrasse, { palette, t, r, ml, hilfe, groesse: 'gross', isDarkMode, onNavigate, ausprobiert, kapitel: true }),

    // Was die Linien im Drittel-Haus heissen, und woher die Zahlen im Vergleichshaus kommen.
    r.anteil != null && h('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px ' + space.md + 'px', fontSize: text.sm, color: palette.mid } },
      h('span', null, h(LegendenMarke, { form: 'strich', color: r.ueberDrittel && !r.mitPartner ? palette.roseDeep : palette.text, palette }), t('wohnenInstrument.drittel')),
      !r.mitPartner && !r.brutto && h('span', { 'data-teil': 'viertel-legende' }, h(LegendenMarke, { form: 'punktlinie', color: palette.mid, palette }), t('wohnenInstrument.viertel'))),
    r.beitrag && h(BeitragLegende, { palette, t, hoechst: r.beitrag.hoechst, farbe: behoerden }),
    r.anteil == null && h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('wohnenInstrument.ohneEinkommen')),
    ml && h(MieteQuelle, { palette, t, ml }),

    // Mietbeiträge: die Tür im Vergleichshaus ist das Fass, hier der Satz und die Kantonskarte, offen.
    hilfe && h('div', { 'data-teil': 'mietzins-szene', style: { marginTop: space.md + 'px' } },
      h('h3', { style: kapH }, t('mietzinsSzene.titel')),
      h('p', { style: { margin: 0, fontSize: text.sm, color: palette.text, lineHeight: leading.normal } }, hilfeSatz(t, hilfe)),
      h('div', { style: { marginTop: space.sm + 'px' } },
        h(Kachelkarte, { palette, t, kanton: hilfe.kanton, gefuellt: PROGRAMM_KANTONE, isDarkMode }),
        h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('mietzinsSzene.karteLegende')))),

    // Regler «andere Miete», offen. Nichts wird gespeichert.
    !r.eigentum && h('div', { 'data-teil': 'miete-ausprobieren', style: trenner },
      h('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('wohnenInstrument.ausprobieren')),
      h('label', { htmlFor: 'wohnen-regler', style: { ...zeile, paddingBottom: 0 } },
        h('span', null, t('wohnenInstrument.reglerLabel')),
        h('span', { style: { fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, betrag(r.netto))),
      h('input', {
        id: 'wohnen-regler', type: 'range', min: REGLER_MIN, max, step: REGLER_SCHRITT,
        value: aufRegler(probe ?? (r.heute || REGLER_MIN), max),
        onChange: (e) => setProbe(Number(e.target.value)),
        'aria-valuetext': betrag(r.netto),
        style: { width: '100%', minHeight: '44px', accentColor: fuell, margin: 0 },
      }),
      h('div', { style: zeile },
        h('span', null, t('wohnenInstrument.nebenkostenWieHeute')),
        h('span', { style: { color: palette.text, whiteSpace: 'nowrap' } }, betrag(r.nk))),
      r.brutto && r.einkommen > 0
        ? h('div', { role: 'status', style: { ...zeile, display: 'block', borderTop: '1px solid ' + palette.border + '88' } }, t('budgetSync.availableNeedsNetto'))
        : r.frei != null && h('div', { role: 'status', 'data-teil': 'frei-danach', style: { ...zeile, fontWeight: weight.semi, borderTop: '1px solid ' + palette.border + '88' } },
          h('span', null, t(r.frei < 0 ? 'wohnenInstrument.fehltDanach' : 'wohnenInstrument.freiDanach')),
          h('span', { style: { color: palette.text, whiteSpace: 'nowrap' } }, betrag(Math.abs(r.frei)))),
      h('p', { style: { ...klein, margin: space.xs + 'px 0 ' + space.sm + 'px' } }, t('wohnenInstrument.durchspielen')),
      probe != null && h('button', { type: 'button', onClick: () => setProbe(null), style: knopfStil(palette, 'neben') }, t('wohnenInstrument.zurueck'))),

    // Am Rand
    rand.length > 0 && h('div', { 'data-teil': 'wohnen-rand', style: { display: 'flex', flexWrap: 'wrap', gap: space.md + 'px ' + space.xl + 'px', ...trenner } }, ...rand),

    // Mehr dazu: nur noch die Sätze (Drittel-Regel, Lage, Ausland).
    // Das «›» zeigt, dass die Zeile aufgeht (Abnahme F6, 25.10.2026: ohne Zeichen wirkte sie nicht aufklappbar;
    // `display: flex` nimmt dem summary das eigene Dreieck).
    h('details', { 'data-teil': 'wohnen-mehr', onToggle: (e) => setOffen(e.currentTarget.open), style: trenner },
      h('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text, listStyle: 'none' } },
        h('span', null, t('wohnenInstrument.mehrDazu')),
        h('span', { 'aria-hidden': 'true', 'data-teil': 'ausprobieren-zeichen', style: { fontSize: text.lg, lineHeight: 1, color: palette.mid, transform: offen ? 'rotate(90deg)' : 'none', transition: 'transform ' + duration.fast + 'ms ' + ease } }, '›')),
      r.anteil != null && h('p', { 'data-teil': 'drittel-satz', style: { ...klein, margin: space.xs + 'px 0 0', color: r.ueberDrittel ? palette.text : palette.mid } }, t(drittelSatzKey(r))),
      ml && h(MieteSaetze, { palette, t, ml, imKapitel: true, ohneQuelle: true }),
      ml && h(InternationalHinweis, { palette, t })),
  );
};

// ── Werkzeug «Mietzins» (mittel) ────────────────────────────────────────────────────────────────────────────────────
// Dieselbe Strasse in mittel, der Wegweiser führt zur kantonalen Stelle. Die Kantonskarte steht hier immer offen.
export const WohnenWerkzeug = ({ palette, t, data, isDarkMode, kanton }) => {
  const h = React.createElement;
  const { r, ml, hilfe } = szene(data, data?.wohnen, null, kanton);
  const behoerden = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  if (r.kosten <= 0 && !hilfe) return null;
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  return h('div', { 'data-teil': 'wohnen-werkzeug', style: { margin: space.md + 'px 0' } },
    r.kosten > 0 && h(WohnenStrasse, { palette, t, r, ml, hilfe, groesse: 'mittel', isDarkMode }),
    r.anteil != null && h('p', { 'data-teil': 'wohnkosten-satz', style: { ...klein, margin: space.xs + 'px 0 0', color: palette.text } },
      t(wohnkostenSatzKey(r)) + ' (' + betrag(r.einkommen) + ')'),
    r.anteil != null && h('p', { style: { ...klein, margin: '2px 0 0' } }, t(r.mitPartner ? 'wohnenInstrument.mitPartner' : 'mietzinsView.rentShareGuide')),
    r.beitrag && h(BeitragLegende, { palette, t, hoechst: r.beitrag.hoechst, farbe: behoerden }),
    ml && h(MieteSaetze, { palette, t, ml }),
    hilfe && h('div', { style: { marginTop: space.md + 'px' } },
      h(Kachelkarte, { palette, t, kanton: hilfe.kanton, gefuellt: PROGRAMM_KANTONE, isDarkMode }),
      h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('mietzinsSzene.karteLegende'))),
  );
};

