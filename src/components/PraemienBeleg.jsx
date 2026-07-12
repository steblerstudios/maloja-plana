import React from 'react';
import { text, weight, space, radius, leading } from '../config/tokens.js';

// Der IPV-Prämien-Beleg (Phase 1 „geschätzt"): zeigt IPV als das, was es ist —
// ein Abzug von der KK-Prämie, mit Deckungsbalken (selbst / Kanton). Bewusst
// „Papier"-Material (warme Fläche, Perforation, Mono-Zahlen) — so steht es neben
// dem Sozialhilfe-Pegel (Glas) sofort als etwas anderes da. Reine Anzeige über
// calculateIPV (siehe data/praemienBeleg.js), Berechnung unberührt.

const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
const fmtCHF = (n) => 'CHF ' + Number(n || 0).toLocaleString('de-CH', { maximumFractionDigits: 0 });

export const PraemienBeleg = ({ palette, t, state }) => {
  const h = React.createElement;
  if (!state || !state.show || state.mode === 'empty') return null;
  const { mode, verbilligung, praemie, selbst } = state;
  const over = mode === 'over';
  const hasBalken = mode === 'eligible' && praemie > 0;
  const kantonPct = hasBalken ? Math.min(100, Math.max(0, (Math.min(verbilligung, praemie) / praemie) * 100)) : 0;
  const selbstPct = 100 - kantonPct;

  const headRow = h('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm + 'px', marginBottom: space.sm + 'px' } },
    h('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('schnellcheck.ipv')),
    h('div', { style: { fontSize: text.xs, color: palette.soft, fontFamily: MONO } }, t('beleg.geschaetzt'))
  );

  let body;
  if (over) {
    body = h('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, t('beleg.keineVerbilligung'));
  } else {
    const amount = h('div', { style: { fontSize: text.xl, fontWeight: weight.bold, color: palette.sageDeep, lineHeight: leading.tight, marginBottom: space.sm + 'px' } },
      fmtCHF(verbilligung) + ' / ' + t('schnellcheck.monat'));
    const balken = hasBalken ? h('div', null,
      h('div', { style: { display: 'flex', height: '22px', borderRadius: radius.sm + 'px', overflow: 'hidden', background: palette.up } },
        h('div', { style: { width: selbstPct.toFixed(1) + '%', background: palette.sage, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 } },
          selbstPct >= 22 ? h('span', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.surface, fontFamily: MONO, whiteSpace: 'nowrap' } }, t('beleg.selbst') + ' ' + selbst) : null),
        h('div', { style: { width: kantonPct.toFixed(1) + '%', background: palette.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 } },
          kantonPct >= 22 ? h('span', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.surface, fontFamily: MONO, whiteSpace: 'nowrap' } }, t('beleg.kanton') + ' ' + verbilligung) : null)
      ),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: space.sm + 'px', fontSize: text.xs, color: palette.mid, fontFamily: MONO } },
        h('span', null, t('beleg.praemie')),
        h('span', { style: { color: palette.text, fontWeight: weight.semi } }, fmtCHF(praemie))
      )
    ) : null;
    const hint = mode === 'nopremium' ? h('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal } }, t('beleg.premiumHint')) : null;
    body = h('div', null, amount, balken, hint);
  }

  // Ein „Papier"-Beleg: warme Fläche, Perforation oben, Sand-Kante links.
  return h('div', {
    style: {
      padding: space.md + 'px', marginTop: space.md + 'px', marginBottom: space.md + 'px',
      background: palette.surface,
      border: '1px solid ' + palette.border,
      borderTop: '2px dashed ' + palette.border,
      borderLeft: '3px solid ' + palette.sand,
      borderRadius: radius.sm + 'px',
    },
    role: 'img',
    'aria-label': t('schnellcheck.ipv') + ' — ' + (over ? t('beleg.keineVerbilligung') : fmtCHF(verbilligung) + ' / ' + t('schnellcheck.monat')),
  }, headRow, body);
};

export default PraemienBeleg;
