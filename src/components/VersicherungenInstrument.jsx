import React, { useState, useEffect } from 'react';
import { text, weight, radius, space, leading } from '../config/tokens.js';
import { monatsAusgaben } from '../utils/monatsrechnung.js';
import { betrag, zahl } from '../utils/geld.js';
import { schildOptionen, schildState, bvgAktiv } from '../data/schutzschild.js';
import { betraegeFuer } from '../data/netzSchild.js';
import { bereichsTon } from '../utils/lebensbereichFruechte.js';
import { ausgabenPosten } from './Geldfluss.jsx';
import { franchiseVorschlag, gesundheitskostenBisher, parseFranchise } from '../data/franchiseTacho.js';
import { ladeFranchiseOpt } from '../data/franchiseLaden.js';
import { NetzSchild, betragText } from './NetzSchild.jsx';
import { FranchiseKreuz } from './FranchiseKreuz.jsx';
import { LegendenMarke } from './LegendenMarke.jsx';
import { calculateIPV } from '../config/cantonalData.js';
import { ipvAbzug } from '../data/ipvAbzug.js';
import { renderSource } from '../utils/renderSource.js';
import { ErgebnisArt } from './ErgebnisArt.jsx';
import { KK_LAST_ERGEBNIS } from '../KKLastCard.jsx';

// Kapitel Versicherungen · das Instrument oben (Fassung 6, Runde 9, Entwurf AA, Entscheid Stebler Studios 24.10.2026,
// nachgebessert am selben Tag). Wie das Wohnkosten-Instrument: unter der ruhigen Zusammenfassung, vor den Angaben.
// F7-K3-4 (Stebler Studios 01.11.2026, «vereine diese Dinge, ergänze die anderen Versicherungen, dafür haben wir die Farben»): 1 und 2
// sind eine Karte in der Farbe des Kapitels, die KK-Last steht bei der Krankenkasse. Darunter, was nicht in der Summe zählt.
//   1. «Versicherungen pro Monat» — aus der einen Monatsrechnung (utils/monatsrechnung.js), also dieselbe Zahl wie
//      die Budget-Gruppe «Versicherung & Gesundheit»: Krankenkasse, Hausrat ÷ 12, Haftpflicht ÷ 12, «Weitere
//      Versicherungen» aus dem Kapitel Finanzen. Darunter, was fehlt und was bewusst nicht zählt.
//   2. «Ihre KK-Last» — Prämie ÷ Monatseinkommen gegen den WHO-Richtwert 10 % (wie KKLastCard, dieselben Sätze,
//      dieselbe IPV-Entlastung über ipvAbzug, Quelle und «Orientierung» — Fachprüfung 25.10.2026).
//   3. Netz-Schild (seit 27.10.2026, F7-K3-6) — ein Schild aus Teilen statt der zwei kleinen Schilde und des Netzes.
//      Seit F7-K3-4 folgt es direkt auf die Summe, Posten und Liste sind eingeklappt.
//   4. Franchise-Kreuz klein — dieselbe Rechnung wie die Prämien-Seite (ladeFranchiseOpt, erst mit Kasse + PLZ),
//      der Vorschlag «Eher …» wie im Panel «Ihre Instrumente», darunter der Weg zur Übersicht.
const WHO = 10;
const has = (x) => x != null && String(x).trim() !== '';
const zahl2 = (x) => Number(x) || 0;

// `uebersicht` (Versicherungs-Übersicht, Schritt 3): nur Geld und KK-Last, die Posten zugeklappt unter «Was darin steckt»;
// Schutzschild und Franchise-Kreuz zeigt die Übersicht selbst.
export const VersicherungenInstrument = ({ palette, t, versicherungen, allData, onNavigate, uebersichtName, uebersicht = false }) => {
  const v = versicherungen || {};
  const daten = { ...(allData || {}), versicherungen: v };
  const p = monatsAusgaben(daten);
  const summe = p.healthInsurance + p.kkZusatz + p.uvgZusatz + p.lifeInsurance + p.householdInsurance + p.liabilityInsurance + p.otherInsurance;

  const [franchiseOpt, setFranchiseOpt] = useState(null);
  const plz = daten.wohnen?.postalCode, kasse = v.kkInsurer, geburt = daten.basis?.dateOfBirth;
  useEffect(() => {
    let aktiv = true;
    ladeFranchiseOpt(daten).then((o) => { if (aktiv) setFranchiseOpt(o); }).catch(() => { if (aktiv) setFranchiseOpt(null); });
    return () => { aktiv = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plz, kasse, geburt]);

  // Ohne erfasste Prämie bleibt der Geld-Teil weg; Schutzschild und Franchise-Kreuz stehen trotzdem
  // (das Schild war vorher immer da, sobald etwas erfasst ist).
  const hatGeld = summe > 0;

  const h = React.createElement;
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const zeile = { display: 'flex', justifyContent: 'space-between', gap: space.md + 'px', padding: '3px 0', fontSize: text.sm, color: palette.text };
  const kapH = { margin: space.lg + 'px 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };
  const geld = (n) => betrag(n, Number.isInteger(Math.round(n * 100) / 100) ? {} : { stellen: 2 });

  // Was erfasst ist, als Zeilen. Jahresprämien mit dem Jahresbetrag in Klammern, damit die ÷ 12 nachvollziehbar ist.
  const posten = [
    p.healthInsurance > 0 && { key: 'kk', quelle: 'healthInsurance', name: t('versInstrument.kk'), wert: p.healthInsurance },
    p.kkZusatz > 0 && { key: 'kkZusatz', quelle: 'kkZusatz', name: t('versInstrument.kkZusatz'), wert: p.kkZusatz },
    p.uvgZusatz > 0 && { key: 'uvgZusatz', quelle: 'uvgZusatz', name: t('versInstrument.uvgZusatz', { jahr: zahl(Number(v.uvgZusatzPremium)) }), wert: p.uvgZusatz },
    p.lifeInsurance > 0 && { key: 'leben', quelle: 'lifeInsurance', name: t('versInstrument.leben', { jahr: zahl(Number(v.lifeInsurancePremium)) }), wert: p.lifeInsurance },
    p.householdInsurance > 0 && { key: 'hausrat', quelle: 'householdInsurance', name: t('versInstrument.hausrat', { jahr: zahl(Number(v.householdInsuranceAmount)) }), wert: p.householdInsurance },
    p.liabilityInsurance > 0 && { key: 'haftpflicht', quelle: 'liabilityInsurance', name: t('versInstrument.haftpflicht', { jahr: zahl(Number(v.liabilityPremium)) }), wert: p.liabilityInsurance },
    p.otherInsurance > 0 && { key: 'weitere', quelle: 'otherInsurance', name: t('versInstrument.weitere'), wert: p.otherInsurance },
  ].filter(Boolean);

  // Versicherung «Ja», aber keine Prämie erfasst — genannt, nicht geschätzt.
  const fehlt = [
    v.householdInsurance === 'yes' && !(Number(v.householdInsuranceAmount) > 0) && t('versInstrument.nameHausrat'),
    v.liabilityInsurance === 'yes' && !(Number(v.liabilityPremium) > 0) && t('versInstrument.nameHaftpflicht'),
    v.kkZusatz && !(Number(v.kkZusatzPremium) > 0) && t('versInstrument.nameKkZusatz'),
    v.lifeInsurance === 'yes' && !(Number(v.lifeInsurancePremium) > 0) && t('versInstrument.nameLeben'),
  ].filter(Boolean);
  // Die Krankenkasse ist Pflicht: ist eine Kasse erfasst, aber keine Prämie, steht sie zuerst (Fachprüfung).
  if (v.kkInsurer && !(Number(v.kkPremium) > 0)) fehlt.unshift(t('versInstrument.nameKK'));
  // «Schon vom Lohn abgezogen» stimmt nur für Angestellte mit netto erfasstem Lohn — bei brutto steckt der
  // Beitrag noch im Betrag, Selbständige zahlen freiwillige Beiträge selbst (Fachprüfung 25.10.2026).
  const f = daten.finanzen || {};
  const pk = Number(v.bvgContribution) > 0 && f.employmentType === 'employed' && f.incomeType === 'netto' ? Number(v.bvgContribution) : 0;

  // KK-Last wie KKLastCard: Grundversicherungs-Prämie ÷ monatliches Einkommen.
  const kkPraemie = Number(v.kkPremium) || 0;
  const einkommen = Number(daten.finanzen?.monthlyIncome) || 0;
  const anteil = kkPraemie > 0 && einkommen > 0 ? (kkPraemie / einkommen) * 100 : null;
  const skala = anteil == null ? 15 : Math.max(15, Math.ceil(anteil / 5) * 5);
  const ueber = anteil != null && anteil >= WHO;
  // IPV-Entlastung wie KKLastCard: was abgezogen werden darf, entscheidet data/ipvAbzug.js.
  const ipvBetrag = anteil != null ? Math.min(kkPraemie, ipvAbzug(daten, calculateIPV(daten)).betrag || 0) : 0;
  const effektiv = ipvBetrag > 0 ? Math.round(((kkPraemie - ipvBetrag) / einkommen) * 1000) / 10 : null;

  const schildDa = schildState(v, schildOptionen(daten)).touched;

  const vorschlag = franchiseOpt ? franchiseVorschlag(franchiseOpt, {
    costs: gesundheitskostenBisher(daten),
    eigeneFranchise: parseFranchise(v.franchise),
    ersparnisse: daten.finanzen?.savingsAccount,
  }) : null;
  const vorschlagSatz = !vorschlag ? null
    : vorschlag.art === 'passt' ? t(vorschlag.polster ? 'instrumente.kreuzPasstPolster' : 'instrumente.kreuzPasst')
    : vorschlag.art === 'wechsel' ? t(vorschlag.polster ? 'instrumente.kreuzWechselPolster' : 'instrumente.kreuzWechsel', { franchise: zahl(vorschlag.franchise), jahr: franchiseOpt?.praemienJahr || '' })
    : null;

  const ton = bereichsTon('versicherungen', palette) || palette.sky;
  const farben = Object.fromEntries(ausgabenPosten(daten, t, palette).map((x) => [x.key, x.color]));
  const fuelle = (x) => farben[x.quelle] || ton;
  // Der Balken zeigt, woraus die Summe besteht; die Zeilen nennen dieselben Posten — für Screenreader stumm.
  const stapel = () => h('div', { 'aria-hidden': 'true', 'data-teil': 'versicherungen-balken', style: { display: 'flex', gap: '2px', height: '10px', margin: space.sm + 'px 0', borderRadius: radius.full, overflow: 'hidden', background: palette.up } },
    ...posten.map((x) => h('div', { key: x.key, style: { flex: x.wert + ' 1 0', minWidth: '3px', background: fuelle(x) } })));
  const marke = (farbe) => h('span', { 'aria-hidden': 'true', style: { width: '10px', height: '10px', borderRadius: radius.hair, flexShrink: 0, background: farbe } });
  // KK-Last: der Balken wiederholt die Zahl daneben — für Screenreader stumm.
  const kkLast = () => anteil != null && h('div', { 'data-teil': 'kk-last', style: { margin: space.xs + 'px 0 ' + space.sm + 'px 18px', padding: space.sm + 'px', background: palette.up, borderRadius: radius.sm } },
    // In der Übersicht steht die KK-Last direkt unter dem Seitentitel (h2) — darum h3 (A11y-Prüfung).
    h(uebersicht ? 'h3' : 'h4', { style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('kkLast.title')),
    h('div', { 'aria-hidden': 'true', 'data-teil': 'kk-last-balken', style: { position: 'relative', height: '8px', margin: space.sm + 'px 0', borderRadius: radius.full, background: palette.surface } },
      h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.min(100, (anteil / skala) * 100) + '%', background: ueber ? palette.gold : ton, borderRadius: radius.full } }),
      h('div', { style: { position: 'absolute', top: '-4px', bottom: '-4px', left: (WHO / skala) * 100 + '%', width: '2px', background: palette.text } })
    ),
    h('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px ' + space.md + 'px', fontSize: text.sm, color: palette.mid } },
      h('span', null, t('versInstrument.anteil', { pct: zahl(anteil, { hoechstens: 1 }) })),
      h('span', { style: { whiteSpace: 'nowrap' } }, h(LegendenMarke, { form: 'strich', color: palette.text, palette }), t('versInstrument.who'))
    ),
    h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t(ueber ? 'kkLast.overNote' : 'kkLast.underNote')),
    effektiv != null && h('p', { 'data-teil': 'kk-last-ipv', style: { ...klein, margin: space.xs + 'px 0 0', color: palette.skyDeep || palette.text } }, t('kkLast.ipvRelief', { ipv: zahl(ipvBetrag), share: zahl(effektiv, { hoechstens: 1 }) })),
    h(ErgebnisArt, { palette, t, ergebnis: KK_LAST_ERGEBNIS, style: { marginTop: space.xs + 'px' } }),
    h('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px' } }, renderSource(t('kkLast.source'), null, t)),
    ueber && onNavigate && h('button', {
      type: 'button', className: 'mp-link', onClick: () => onNavigate('premium'),
      style: { marginTop: space.sm + 'px', minHeight: '44px', padding: '0 ' + space.md + 'px', background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, fontSize: text.sm, color: palette.text, cursor: 'pointer' },
    }, t('kkLast.ipvLink'))
  );
  const postenZeilen = () => h('div', { 'data-teil': 'versicherungen-posten' },
    ...posten.map((x) => h(React.Fragment, { key: x.key },
      h('div', { style: zeile },
        h('span', { style: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, color: palette.text } }, marke(fuelle(x)), x.name),
        h('span', { style: { whiteSpace: 'nowrap', color: palette.text } }, geld(x.wert))),
      x.key === 'kk' && kkLast()
    ))
  );
  // Eingetragen, aber nicht in der Summe: über den Lohn, über den Arbeitgeber, anderswo im Budget oder ohne erfasste Prämie.
  // Nur aus erfassten Feldern, dieselben Beträge wie im Schild (betraegeFuer).
  const feld = (k) => t('chapters.versicherungen.fields.' + k + '.label');
  const ja = (x) => has(x) && x !== 'no' && x !== 'none';
  const ausserhalb = [
    (f.employmentType === 'employed' || zahl2(v.ahvContribution) > 0) && { key: 'ahv', name: t('netzSchild.vers.ahv'), b: betraegeFuer('ahv', v, f) },
    bvgAktiv(v) && { key: 'bvg', name: t('netzSchild.vers.bvg'), b: betraegeFuer('bvg', v, f) },
    Number(f.pension3a) > 0 && { key: 'saeule3a', name: t('netzSchild.vers.saeule3a'), b: betraegeFuer('saeule3a', v, f) },
    ja(v.uvg) && { key: 'uvg', name: t('netzSchild.vers.uvg'), b: betraegeFuer('uvg', v, f) },
    ja(v.ktg) && { key: 'ktg', name: feld('ktg'), b: v.ktg === 'employer' ? { arbeitgeber: true } : {} },
    ja(v.legalInsurance) && { key: 'legalInsurance', name: feld('legalInsurance'), b: {} },
    ja(v.travelInsurance) && { key: 'travelInsurance', name: feld('travelInsurance'), b: {} },
    ja(v.cyberInsurance) && { key: 'cyberInsurance', name: feld('cyberInsurance'), b: {} },
    ja(v.autoInsurance) && { key: 'autoInsurance', name: feld('autoInsurance'), b: Number(v.autoInsuranceAmount) > 0 ? { mt: Math.round((Number(v.autoInsuranceAmount) / 12) * 100) / 100, jahr: Number(v.autoInsuranceAmount) } : {} },
  ].filter(Boolean);
  const ausserhalbListe = () => ausserhalb.length > 0 && h('details', { 'data-teil': 'versicherungen-ausserhalb', style: { marginTop: space.xs + 'px', borderTop: '1px solid ' + palette.border + '88' } },
    // Der eigene Pfeil des Browsers zeigt offen/zu — kein Flex auf summary (A11y-Prüfung).
    h('summary', { style: { cursor: 'pointer', minHeight: '44px', fontSize: text.sm, color: palette.text, paddingTop: '10px' } },
      h('span', { style: { fontWeight: weight.medium, color: palette.text } }, t('versInstrument.ausserhalb')),
      h('span', { style: { fontSize: text.xs, color: palette.mid } }, ' · ' + t('vu.erfasst', { n: ausserhalb.length }))),
    ausserhalb.map((x) => h('div', { key: x.key, style: { ...zeile, alignItems: 'baseline', fontSize: text.xs } },
      h('span', { style: { color: palette.text, minWidth: 0 } }, x.name),
      h('span', { style: { color: palette.mid, textAlign: 'right' } }, betragText(x.b, t) || t('netzSchild.eingetragen'))
    )));
  const postenHinweise = () => h(React.Fragment, null,
    fehlt.length > 0 && h('p', { 'data-teil': 'versicherungen-hinweis', style: { ...klein, margin: space.xs + 'px 0 0' } }, t('versInstrument.nichtErfasst', { liste: fehlt.join(', ') })),
    pk > 0 && h('p', { 'data-teil': 'versicherungen-hinweis', style: { ...klein, margin: space.xs + 'px 0 0' } }, t('versInstrument.pk', { betrag: zahl(pk) })),
    Number(v.autoInsuranceAmount) > 0 && h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('versInstrument.fahrzeug')));

  const schild = !uebersicht && h(React.Fragment, null,
    schildDa && h('h4', { style: hatGeld ? kapH : { ...kapH, marginTop: 0 } }, t('instrumente.schild')),
    // Netz-Schild statt der zwei kleinen Schilde und des Spinnennetzes (F7-K3-6, 27.10.2026).
    h(NetzSchild, { palette, t, versicherungen: v, finanzen: daten.finanzen, kanton: daten.basis?.canton, stunden: daten.ausbildung?.workHoursPerWeek, ...schildOptionen(daten) }));

  return h('section', { 'data-teil': 'versicherungen-instrument', style: { marginBottom: space.lg + 'px' } },
    (hatGeld || ausserhalb.length > 0) && h('div', { 'data-teil': 'versicherungen-karte', style: { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.md, marginBottom: space.md + 'px' } },
      hatGeld && h('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '2px' } }, t('versInstrument.titel')),
      hatGeld && h('div', { style: { fontSize: text['2xl'], fontWeight: weight.bold, color: palette.text, lineHeight: 1.2 } }, betrag(Math.round(summe))),
      hatGeld && stapel(),
      hatGeld && postenZeilen(),
      hatGeld && postenHinweise(),
      ausserhalbListe()),
    schild,

    !uebersicht && franchiseOpt && h(React.Fragment, null,
      h('h4', { style: kapH }, t('instrumente.tacho')),
      h(FranchiseKreuz, { palette, t, franchiseOpt, costs: gesundheitskostenBisher(daten), onNavigate, klein: true, eigeneFranchise: parseFranchise(v.franchise) }),
      vorschlagSatz && h('p', { 'data-teil': 'franchise-vorschlag', style: { margin: 0, fontSize: text.sm, color: palette.text, lineHeight: leading.normal, textAlign: 'center' } }, vorschlagSatz),
      onNavigate && h('button', {
        type: 'button', className: 'mp-link', 'data-teil': 'zur-uebersicht', onClick: () => onNavigate('praemien'),
        style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', minHeight: '44px', marginTop: space.sm + 'px', textAlign: 'left', background: 'none', border: 'none', borderTop: '1px solid ' + palette.border + '88', borderBottom: '1px solid ' + palette.border + '88', padding: space.sm + 'px 0', cursor: 'pointer', fontFamily: 'inherit', color: palette.text },
      },
        h('span', { style: { flex: 1, minWidth: 0 } },
          h('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.medium } }, t('versInstrument.alles')),
          uebersichtName && h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, uebersichtName)
        ),
        h('span', { 'aria-hidden': 'true', style: { color: palette.mid } }, '›')
      )
    )
  );
};

export default VersicherungenInstrument;
