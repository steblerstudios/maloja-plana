import React, { useState, useMemo } from 'react';
import { vergleicheEOLeistungen, EO_PARAMS } from './data/eoRechner.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';

export const EOrechner = ({ palette, t, data }) => {
  const prefill = data.finanzen?.monthlyIncome ? Math.round(parseFloat(data.finanzen.monthlyIncome) * 12) : '';
  const [einkommen, setEinkommen] = useState(prefill || '');
  const parsedEinkommen = Number(einkommen) || 0;

  const result = useMemo(() => {
    if (parsedEinkommen <= 0) return null;
    return vergleicheEOLeistungen(parsedEinkommen);
  }, [parsedEinkommen]);

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    section: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.md + 'px', fontSize: text.sm },
    label: { fontWeight: weight.semi, marginBottom: space.xs + 'px', fontSize: text.sm },
    input: { width: '160px', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none' },
    highlight: { padding: space.md + 'px', background: palette.sage + '22', borderRadius: radius.sm + 'px', border: '1px solid ' + palette.sage, marginBottom: space.md + 'px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: text.sm },
    th: { textAlign: 'left', padding: space.sm, borderBottom: '1px solid ' + palette.border, color: palette.mid, fontWeight: weight.medium },
    td: { padding: space.sm, borderBottom: '1px solid ' + palette.border },
    big: { fontSize: text.xl, fontWeight: weight.bold, color: palette.sage },
    tag: { display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: text.xs, background: palette.sage + '22', color: palette.sage, marginLeft: space.xs + 'px' },
    source: { marginTop: space.md + 'px', fontSize: text.xs, color: palette.mid },
  };

  const fmt = (v) => v != null ? v.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '–';

  const leistungRow = (leistung, labelKey) => {
    if (!leistung || !leistung.anspruch) return null;
    return React.createElement('tr', { key: leistung.typ },
      React.createElement('td', { style: s.td },
        t('eo.' + labelKey),
        leistung.istPlafoniert && React.createElement('span', { style: s.tag }, t('eo.plafoniert'))
      ),
      React.createElement('td', { style: s.td }, leistung.tage + ' ' + t('eo.tage')),
      React.createElement('td', { style: s.td }, 'CHF ' + fmt(leistung.taggeld)),
      React.createElement('td', { style: { ...s.td, fontWeight: weight.semi } }, 'CHF ' + fmt(leistung.totalEntschaedigung))
    );
  };

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'family', size: 20 }),
      t('eo.title')
    ),

    React.createElement('div', { style: s.section },
      React.createElement('div', { style: s.label }, t('eo.einkommen')),
      React.createElement('div', { style: { color: palette.mid, fontSize: text.xs, marginBottom: space.xs + 'px' } }, t('eo.einkommenHint')),
      React.createElement('input', {
        style: s.input,
        type: 'number',
        inputMode: 'decimal',
        value: einkommen,
        onChange: e => setEinkommen(e.target.value),
        placeholder: '80000',
      })
    ),

    result && React.createElement(React.Fragment, null,
      React.createElement('div', { style: s.highlight },
        React.createElement('div', { style: s.label }, t('eo.taggeld')),
        React.createElement('div', { style: s.big }, 'CHF ' + fmt(result.mutterschaft.taggeld) + ' / ' + t('eo.tag')),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
          t('eo.entschaedigungssatz') + ': ' + EO_PARAMS.entschaedigungssatz + '% · ' +
          t('eo.maximum') + ': CHF ' + fmt(EO_PARAMS.maxTaggeld) + '/' + t('eo.tag')
        )
      ),

      React.createElement('table', { style: s.table },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: s.th }, t('eo.leistung')),
            React.createElement('th', { style: s.th }, t('eo.dauer')),
            React.createElement('th', { style: s.th }, t('eo.proTag')),
            React.createElement('th', { style: s.th }, t('eo.total'))
          )
        ),
        React.createElement('tbody', null,
          leistungRow(result.mutterschaft, 'mutterschaft'),
          leistungRow(result.vaterschaft, 'vaterschaft'),
          leistungRow(result.adoption, 'adoption'),
          leistungRow(result.betreuung, 'betreuung')
        )
      ),

      React.createElement('div', { style: { ...s.section, marginTop: space.md + 'px', fontSize: text.xs } },
        React.createElement('div', null, t('eo.hinweisMutterschaft')),
        React.createElement('div', null, t('eo.hinweisVaterschaft')),
        React.createElement('div', null, t('eo.hinweisAdoption'))
      )
    ),

    !parsedEinkommen && React.createElement('div', { style: { ...s.section, color: palette.mid } },
      React.createElement('div', null, t('eo.einkommenEingeben')),
      React.createElement('div', { style: { marginTop: space.sm + 'px', fontSize: text.xs } }, t('eo.erklaerung'))
    ),

    React.createElement('div', { style: s.source }, t('eo.source'))
  );
};

export default EOrechner;
