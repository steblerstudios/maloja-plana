import React from 'react';
import { Icon } from './IconSystem.jsx';
import { calculateIPV } from './config/cantonalData.js';
import { ipvAbzug, IPV_ABZUG_GRUND, fristHinweisKey } from './data/ipvAbzug.js';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { ErgebnisArt } from './components/ErgebnisArt.jsx';
import { ergebnis, ERGEBNIS_ART } from './data/ergebnisArt.js';
import { zahl } from './utils/geld.js';

// Die 10 % sind nur noch eine offene Vergleichsmarke: kein Grenzwert, keine Empfehlung, keine Warnfarbe.
// WHO 4845 führt 10 % oder 25 % für Zahlungen aus der eigenen Tasche und schliesst Prämien aus;
// SDG 3.8.2 misst seit 2026 anders (Metadaten 27.03.2026). Entscheid Stebler Studios, 01.11.2026.
export const VERGLEICHSMARKE = 10;

// O3 — Ergebnis-Art: ORIENTIERUNG. Der Anteil ist die eigene Prämie geteilt durch das eigene
// Einkommen, keine Schweizer Regel für den Einzelfall. Die Karte erscheint nur, wenn beide Zahlen
// da sind, darum fehlt nie eine Angabe.
export const KK_LAST_ERGEBNIS = ergebnis(ERGEBNIS_ART.ORIENTIERUNG);

const NICHT_LOHN = ['retired', 'selfEmployed', 'freelance'];

// Woran die Prämie gemessen wird. Der Nenner ist überall `monthlyIncome`; der Satz sagt, was das hier ist.
export const kkLastBasisKey = (data) => {
  const f = data?.finanzen || {};
  if (data?.basis?.household?.isRetired || NICHT_LOHN.includes(f.employmentType)) return 'kkLast.basisEinkommen';
  if (f.incomeType === 'netto') return 'kkLast.basisNetto';
  if (f.incomeType === 'brutto') return 'kkLast.basisBrutto';
  return 'kkLast.basisOffen';
};

// Prämienverbilligung für beide Karten. Was abgezogen werden darf, entscheidet allein data/ipvAbzug.js
// (E9: nur belegter Kanton; Luzern nach der Anmeldefrist: nichts; eingetragene Verfügung: ihr Betrag).
export const kkLastIpv = (data, premium, income) => {
  const ipv = calculateIPV(data);
  const abzug = ipvAbzug(data, ipv);
  const betrag = Math.min(premium, abzug.betrag);
  return {
    ipv, abzug, betrag,
    netShare: (Math.max(0, premium - betrag) / income) * 100,
    fristVorbei: abzug.grund === IPV_ABZUG_GRUND.FRIST_VORBEI,
    // NE im Band über der Art.-16-Schwelle: nichts abgezogen; den Satz nennt das Ergebnis.
    gesuchText: abzug.grund === IPV_ABZUG_GRUND.GESUCH_NOETIG ? ipv.gesuchNichtAbgezogenKey : null,
  };
};

// Alles unter dem Balken, in beiden Karten gleich: Zusatzkosten, Stand der Verbilligung, Kantonssatz,
// Erklärung der Marke, Quellen und der Weg zur Prämienverbilligung.
export const KKLastEinordnung = ({ palette, t, onNavigate, stand }) => {
  const satz = { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, margin: space.xs + 'px 0 0' };
  const { ipv, betrag, netShare, fristVorbei, gesuchText, abzug } = stand;
  return React.createElement(React.Fragment, null,
    React.createElement('p', { style: satz }, t('kkLast.zusatzkosten')),
    betrag > 0 && React.createElement('p', { 'data-teil': 'kk-last-ipv', style: { ...satz, color: palette.skyDeep || palette.text, fontWeight: weight.medium } },
      t('kkLast.ipvRelief', { ipv: zahl(betrag), share: zahl(netShare, { hoechstens: 1 }) })
    ),
    // Nach der Anmeldefrist (LU, FR, GE, OW, NW, TI, SH, AR): statt der Abzugszeile der Grund, warum
    // nichts abgezogen ist. Welcher Text, sagt fristHinweisKey (data/ipvAbzug.js): der Schlüssel des
    // Kantons, der Luzerner nur für LU, sonst ein neutraler.
    fristVorbei && React.createElement('p', { style: satz }, t(fristHinweisKey(ipv), abzug.frist)),
    gesuchText && React.createElement('p', { style: satz }, t(gesuchText)),
    betrag === 0 && ipv && !ipv.eligible && React.createElement('p', { style: satz },
      ipv.belegt === false ? t(ipv.noteKey, ipv.noteParams) : t('kkLast.ipvNoClaim')
    ),
    React.createElement('p', { style: satz }, t('kkLast.kanton')),
    React.createElement('details', { 'data-teil': 'kk-last-marke', style: { marginTop: space.xs + 'px' } },
      React.createElement('summary', { style: { fontSize: text.sm, color: palette.text, cursor: 'pointer', minHeight: '44px', lineHeight: '44px' } }, t('kkLast.markeFrage')),
      React.createElement('p', { style: { ...satz, marginTop: 0 } }, t('kkLast.markeAntwort'))
    ),
    React.createElement(ErgebnisArt, { palette, t, ergebnis: KK_LAST_ERGEBNIS, style: { marginTop: space.xs + 'px' } }),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px' } }, renderSource(t('kkLast.source'), null, t)),
    onNavigate && React.createElement('button', {
      type: 'button', className: 'mp-link',
      onClick: () => onNavigate('premium'),
      style: {
        marginTop: space.sm + 'px', minHeight: '44px', padding: '0 ' + space.md + 'px', background: 'none',
        border: '1px solid ' + palette.border, borderRadius: radius.sm, fontSize: text.sm, color: palette.text,
        cursor: 'pointer', fontFamily: 'inherit',
      }
    }, t('kkLast.ipvLink'))
  );
};

// Zeigt die Grundversicherungs-Prämie als % des Einkommens mit der Vergleichsmarke.
// Rendert nichts, wenn Prämie oder Einkommen fehlen (kein Druck, calm UX).
export const KKLastCard = ({ palette, t, data, onNavigate }) => {
  const premium = Number(data?.versicherungen?.kkPremium) || 0;
  const income = Number(data?.finanzen?.monthlyIncome) || 0;
  if (premium <= 0 || income <= 0) return null;

  const share = (premium / income) * 100;
  const scaleMax = Math.max(20, Math.ceil(share / 5) * 5);
  const fillPct = Math.min(100, (share / scaleMax) * 100);
  const markerPct = (VERGLEICHSMARKE / scaleMax) * 100;

  const stand = kkLastIpv(data, premium, income);
  const netFillPct = Math.min(100, (stand.netShare / scaleMax) * 100);

  return React.createElement('div', {
    style: {
      padding: space.md + 'px', background: palette.up, borderRadius: radius.sm,
      border: '1px solid ' + palette.border, marginBottom: '16px',
    }
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: space.xs } },
      React.createElement(Icon, { name: 'health', size: 16 }),
      React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.body, color: palette.text } }, t('kkLast.title'))
    ),
    React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, zahl(share, { hoechstens: 1 }) + ' %'),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm, lineHeight: leading.normal } }, t(kkLastBasisKey(data))),
    // Ruhiger Balken mit Vergleichsmarke, immer dieselbe Farbe
    React.createElement('div', { 'aria-hidden': 'true', style: { position: 'relative', height: '8px', background: palette.border, borderRadius: radius.xs, marginBottom: '4px' } },
      React.createElement('div', { style: { height: '100%', width: fillPct + '%', background: palette.sage, borderRadius: radius.xs } }),
      // IPV-Anteil (was die Verbilligung von der Last abnimmt) hellblau über dem rechten Teil
      stand.betrag > 0 && React.createElement('div', { style: { position: 'absolute', top: 0, bottom: 0, left: netFillPct + '%', width: Math.max(0, fillPct - netFillPct) + '%', background: palette.sky, borderRadius: '0 ' + radius.xs + 'px ' + radius.xs + 'px 0' } }),
      React.createElement('div', { style: { position: 'absolute', top: '-3px', bottom: '-3px', left: markerPct + '%', width: '2px', background: palette.text } })
    ),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginBottom: space.xs } }, t('kkLast.marker')),
    React.createElement(KKLastEinordnung, { palette, t, onNavigate, stand })
  );
};

export default KKLastCard;
