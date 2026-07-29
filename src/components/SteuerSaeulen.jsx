import React from 'react';
import { PanelTitle } from './Heading.jsx';
import { text, weight, radius, space } from '../config/tokens.js';

// Ruhige Zivilstand-Säulen (Probier-Modus) — zeigt dieselbe Steuerbasis unter
// verschiedenen Zivilständen als drei schlanke Säulen nebeneinander.
//
// Wahrheits-Disziplin (Maloja = CH-Rechts-/Finanzhilfe):
// - Nur die zwei amtlich belegten Tarife tragen eine Zahl:
//   «Ledig» (Grundtarif) und «Verheiratet, gemeinsam» (Verheiratetentarif),
//   beide DBG Art. 36 via vergleicheTarife().
// - «Verheiratet, einzeln» (Individualbesteuerung) ist in der Schweiz NOCH NICHT
//   in Kraft (laufende Reform). Diese Säule bleibt bewusst zahllos und wird als
//   Platzhalter gezeigt — keine erfundene Zahl, bis der Rechts-Check steht.
// - Bezugsgrösse ist nur die direkte Bundessteuer; Kanton/Gemeinde bleiben aussen.
//
// Interaktion: die zwei belegten Säulen sind Knöpfe, die den Zivilstand im
// Rechner umschalten (Probier-Modus). Die Platzhalter-Säule ist nicht klickbar.
export const SteuerSaeulen = ({ palette, t, istVerheiratet, vergleich, onSelect }) => {
  const basis = vergleich && Number(vergleich.steuerBaresEinkommen);

  // Empty-State: ohne steuerbares Einkommen gibt es nichts zu vergleichen.
  if (!vergleich || !Number.isFinite(basis) || basis <= 0) {
    return React.createElement('div', { style: { marginTop: space.lg, padding: space.md, background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement(PanelTitle, { palette, style: { marginBottom: space.xs } }, t('tax.saeulen.title')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, fontStyle: 'italic' } }, t('tax.saeulen.empty'))
    );
  }

  const ledig = Math.max(0, Math.round(Number(vergleich.alleinstehend) || 0));
  const gemeinsam = Math.max(0, Math.round(Number(vergleich.verheiratet) || 0));
  const diff = Math.round(Number(vergleich.differenz) || 0); // >0 → gemeinsam günstiger

  const BAR_MAX_H = 120;
  const BAR_MIN_H = 8;
  const maxVal = Math.max(ledig, gemeinsam, 1);
  const barH = (v) => Math.max(BAR_MIN_H, Math.round((BAR_MAX_H * v) / maxVal));

  // Eine belegte Säule: als Knopf, um den Zivilstand auszuprobieren.
  const firmSaeule = (key, aktiv, betrag, onClick) => {
    const label = t('tax.saeulen.' + key);
    return React.createElement('button', {
      type: 'button',
      onClick,
      'aria-pressed': aktiv,
      'aria-label': label + ': CHF ' + betrag + (aktiv ? ' — ' + t('tax.saeulen.active') : ''),
      style: {
        flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: space.xs, padding: space.sm, cursor: 'pointer', fontFamily: 'inherit',
        background: aktiv ? palette.sand + '14' : 'transparent',
        border: '1px solid ' + (aktiv ? palette.sand : palette.border),
        borderRadius: radius.sm,
      },
    },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, 'CHF ' + betrag),
      React.createElement('div', { 'aria-hidden': true, style: {
        width: '100%', maxWidth: '72px', height: barH(betrag) + 'px',
        background: aktiv ? palette.sand : palette.mid + '55',
        borderRadius: radius.sm + ' ' + radius.sm + ' 0 0', transition: 'height .2s ease',
      } }),
      React.createElement('div', { style: { fontSize: text.xs, color: aktiv ? palette.sandDeep : palette.mid, fontWeight: aktiv ? weight.semi : weight.medium, textAlign: 'center', lineHeight: 1.3 } }, label)
    );
  };

  // Die Platzhalter-Säule «einzeln»: bewusst ohne Zahl, gedämpft, nicht klickbar.
  const pendingSaeule = React.createElement('div', {
    style: {
      flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: space.xs, padding: space.sm, border: '1px dashed ' + palette.border, borderRadius: radius.sm,
    },
  },
    React.createElement('div', { style: { fontSize: text.sm, color: palette.soft, fontWeight: weight.medium } }, '–'),
    React.createElement('div', { 'aria-hidden': true, style: {
      width: '100%', maxWidth: '72px', height: '44px',
      border: '1px dashed ' + palette.border, borderBottom: 'none',
      borderRadius: radius.sm + ' ' + radius.sm + ' 0 0', background: 'transparent',
    } }),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, fontWeight: weight.medium, textAlign: 'center', lineHeight: 1.3 } }, t('tax.saeulen.einzeln'))
  );

  // Klartext-Lesart des Unterschieds (nur belegte Tarife).
  let lesart;
  if (Math.abs(diff) < 20) lesart = t('tax.saeulen.similar');
  else if (diff > 0) lesart = t('tax.saeulen.cheaper', { value: Math.abs(diff) });
  else lesart = t('tax.saeulen.dearer', { value: Math.abs(diff) });

  return React.createElement('div', { style: { marginTop: space.lg, padding: space.md, background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PanelTitle, { palette, style: { marginBottom: space.xs } }, t('tax.saeulen.title')),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.md } }, t('tax.saeulen.hint')),

    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: space.sm, marginBottom: space.md } },
      firmSaeule('ledig', !istVerheiratet, ledig, () => onSelect && onSelect(false)),
      firmSaeule('gemeinsam', istVerheiratet, gemeinsam, () => onSelect && onSelect(true)),
      pendingSaeule
    ),

    React.createElement('div', { 'aria-live': 'polite', style: { fontSize: text.sm, color: palette.text, marginBottom: space.xs } }, lesart),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm } }, t('tax.saeulen.twoIncomeNote')),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, fontStyle: 'italic', paddingTop: space.sm, borderTop: '1px solid ' + palette.border } },
      'ⓘ ' + t('tax.saeulen.einzelnPending')),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
      'ⓘ ' + t('tax.saeulen.scope'))
  );
};

export default SteuerSaeulen;
