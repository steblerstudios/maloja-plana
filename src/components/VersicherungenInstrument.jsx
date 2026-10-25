import React, { useState, useEffect } from 'react';
import { text, weight, radius, space, leading } from '../config/tokens.js';
import { monatsAusgaben } from '../utils/monatsrechnung.js';
import { betrag, zahl } from '../utils/geld.js';
import { schildOptionen, schildState } from '../data/schutzschild.js';
import { franchiseVorschlag, gesundheitskostenBisher, parseFranchise } from '../data/franchiseTacho.js';
import { ladeFranchiseOpt } from '../data/franchiseLaden.js';
import { Schutzschild } from './Schutzschild.jsx';
import { FranchiseKreuz } from './FranchiseKreuz.jsx';
import { LegendenMarke } from './LegendenMarke.jsx';
import { calculateIPV } from '../config/cantonalData.js';
import { ipvAbzug } from '../data/ipvAbzug.js';
import { renderSource } from '../utils/renderSource.js';
import { ErgebnisArt } from './ErgebnisArt.jsx';
import { KK_LAST_ERGEBNIS } from '../KKLastCard.jsx';

// Kapitel Versicherungen · das Instrument oben (Fassung 6, Runde 9, Entwurf AA, Entscheid Sophie 24.10.2026,
// nachgebessert am selben Tag). Wie das Wohnkosten-Instrument: unter der ruhigen Zusammenfassung, vor den Angaben.
//   1. «Versicherungen pro Monat» — aus der einen Monatsrechnung (utils/monatsrechnung.js), also dieselbe Zahl wie
//      die Budget-Gruppe «Versicherung & Gesundheit»: Krankenkasse, Hausrat ÷ 12, Haftpflicht ÷ 12, «Weitere
//      Versicherungen» aus dem Kapitel Finanzen. Darunter, was fehlt und was bewusst nicht zählt.
//   2. «Ihre KK-Last» — Prämie ÷ Monatseinkommen gegen den WHO-Richtwert 10 % (wie KKLastCard, dieselben Sätze,
//      dieselbe IPV-Entlastung über ipvAbzug, Quelle und «Orientierung» — Fachprüfung 25.10.2026).
//   3. Schutzschild klein — zwei Schilde mit Listen, offen (statt der grossen Schilde darunter).
//   4. Franchise-Kreuz klein — dieselbe Rechnung wie die Prämien-Seite (ladeFranchiseOpt, erst mit Kasse + PLZ),
//      der Vorschlag «Eher …» wie im Panel «Ihre Instrumente», darunter der Weg zur Übersicht.
const WHO = 10;

export const VersicherungenInstrument = ({ palette, t, versicherungen, allData, onNavigate, uebersichtName }) => {
  const v = versicherungen || {};
  const daten = { ...(allData || {}), versicherungen: v };
  const p = monatsAusgaben(daten);
  const summe = p.healthInsurance + p.householdInsurance + p.liabilityInsurance + p.otherInsurance;

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
    p.healthInsurance > 0 && { key: 'kk', name: t('versInstrument.kk'), wert: p.healthInsurance },
    p.householdInsurance > 0 && { key: 'hausrat', name: t('versInstrument.hausrat', { jahr: zahl(Number(v.householdInsuranceAmount)) }), wert: p.householdInsurance },
    p.liabilityInsurance > 0 && { key: 'haftpflicht', name: t('versInstrument.haftpflicht', { jahr: zahl(Number(v.liabilityPremium)) }), wert: p.liabilityInsurance },
    p.otherInsurance > 0 && { key: 'weitere', name: t('versInstrument.weitere'), wert: p.otherInsurance },
  ].filter(Boolean);

  // Versicherung «Ja», aber keine Prämie erfasst — genannt, nicht geschätzt.
  const fehlt = [
    v.householdInsurance === 'yes' && !(Number(v.householdInsuranceAmount) > 0) && t('versInstrument.nameHausrat'),
    v.liabilityInsurance === 'yes' && !(Number(v.liabilityPremium) > 0) && t('versInstrument.nameHaftpflicht'),
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

  return h('section', { 'data-teil': 'versicherungen-instrument', style: { marginBottom: space.lg + 'px' } },
    hatGeld && h('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '2px' } }, t('versInstrument.titel')),
    hatGeld && h('div', { style: { fontSize: text['2xl'], fontWeight: weight.bold, color: palette.text, lineHeight: 1.2, marginBottom: space.sm + 'px' } }, betrag(Math.round(summe))),
    hatGeld && h('div', { 'data-teil': 'versicherungen-posten' },
      ...posten.map((x) => h('div', { key: x.key, style: zeile },
        h('span', { style: { color: palette.mid } }, x.name),
        h('span', { style: { whiteSpace: 'nowrap' } }, geld(x.wert))
      ))
    ),
    hatGeld && (fehlt.length > 0 || pk > 0) && h('p', { 'data-teil': 'versicherungen-hinweis', style: { ...klein, margin: space.xs + 'px 0 0' } },
      fehlt.length > 0 ? t('versInstrument.nichtErfasst', { liste: fehlt.join(', ') }) + ' ' : '',
      pk > 0 ? t('versInstrument.pk', { betrag: zahl(pk) }) : ''
    ),
    hatGeld && Number(v.autoInsuranceAmount) > 0 && h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('versInstrument.fahrzeug')),

    // KK-Last: der Balken wiederholt die Zahl daneben — für Screenreader stumm.
    anteil != null && h(React.Fragment, null,
      h('h4', { style: kapH }, t('kkLast.title')),
      h('div', { 'aria-hidden': 'true', 'data-teil': 'kk-last-balken', style: { position: 'relative', height: '10px', margin: space.sm + 'px 0', borderRadius: radius.full, background: palette.up, border: '1px solid ' + palette.border } },
        h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.min(100, (anteil / skala) * 100) + '%', background: ueber ? palette.gold : palette.sky, borderRadius: radius.full } }),
        h('div', { style: { position: 'absolute', top: '-5px', bottom: '-5px', left: (WHO / skala) * 100 + '%', width: '2px', background: palette.text } })
      ),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px ' + space.md + 'px', fontSize: text.sm, color: palette.mid } },
        h('span', null, t('versInstrument.anteil', { pct: zahl(anteil, { hoechstens: 1 }) })),
        h('span', { style: { whiteSpace: 'nowrap' } }, h(LegendenMarke, { form: 'strich', color: palette.text, palette }), t('versInstrument.who'))
      ),
      h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t(ueber ? 'kkLast.overNote' : 'kkLast.underNote')),
      effektiv != null && h('p', { 'data-teil': 'kk-last-ipv', style: { ...klein, margin: space.xs + 'px 0 0', color: palette.skyDeep || palette.text } }, t('kkLast.ipvRelief', { ipv: zahl(ipvBetrag), share: effektiv })),
      h(ErgebnisArt, { palette, t, ergebnis: KK_LAST_ERGEBNIS, style: { marginTop: space.xs + 'px' } }),
      h('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px' } }, renderSource(t('kkLast.source'), null, t)),
      ueber && onNavigate && h('button', {
        type: 'button', className: 'mp-link', onClick: () => onNavigate('premium'),
        style: { marginTop: space.sm + 'px', minHeight: '44px', padding: '0 ' + space.md + 'px', background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, fontSize: text.sm, color: palette.text, cursor: 'pointer', fontFamily: 'inherit' },
      }, t('kkLast.ipvLink'))
    ),

    schildDa && h('h4', { style: hatGeld ? kapH : { ...kapH, margin: '0 0 ' + space.xs + 'px' } }, t('instrumente.schild')),
    h(Schutzschild, { palette, t, versicherungen: v, klein: true, ...schildOptionen(daten) }),

    franchiseOpt && h(React.Fragment, null,
      h('h4', { style: kapH }, t('instrumente.tacho')),
      h(FranchiseKreuz, { palette, t, franchiseOpt, costs: gesundheitskostenBisher(daten), onNavigate, klein: true }),
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
