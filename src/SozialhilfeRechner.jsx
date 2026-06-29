import React, { useState, useMemo } from 'react';
import { berechneSozialhilfe, SKOS_PARAMS } from './data/sozialhilfeRechner.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';

export const SozialhilfeRechner = ({ palette, t, data }) => {
  const household = data?.basis?.household;
  const initAdults = household?.adults || 1;
  const initChildren = Array.isArray(household?.children) ? household.children.length : 0;

  const [adults, setAdults] = useState(initAdults);
  const [kinderCount, setKinderCount] = useState(initChildren);
  // Vorbefüllen aus bereits erfassten Angaben (überschreibbar) — nicht zweimal eingeben.
  const [miete, setMiete] = useState(data?.wohnen?.rentAmount ? String(data.wohnen.rentAmount) : '');
  const [kvg, setKvg] = useState(data?.versicherungen?.kkPremium ? String(data.versicherungen.kkPremium) : '');
  const [einkommen, setEinkommen] = useState(data?.finanzen?.monthlyIncome ? String(data.finanzen.monthlyIncome) : '');
  const [andereEinkuenfte, setAndereEinkuenfte] = useState('');
  const [vermoegen, setVermoegen] = useState('');
  const [erwerbstaetig, setErwerbstaetig] = useState(false);
  const [integration, setIntegration] = useState(false);

  const result = useMemo(() => {
    const m = Number(miete) || 0;
    const k = Number(kvg) || 0;
    if (m <= 0 && k <= 0) return null;
    return berechneSozialhilfe({
      adults,
      kinderImHaushalt: kinderCount,
      miete: m,
      krankenkassePraemie: k,
      erwerbseinkommen: Number(einkommen) || 0,
      andereEinkuenfte: Number(andereEinkuenfte) || 0,
      vermoegen: Number(vermoegen) || 0,
      erwerbstaetig,
      integrationsMassnahme: integration,
    });
  }, [adults, kinderCount, miete, kvg, einkommen, andereEinkuenfte, vermoegen, erwerbstaetig, integration]);

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    section: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.md + 'px', fontSize: text.sm },
    label: { fontWeight: weight.semi, marginBottom: space.xs + 'px', fontSize: text.sm },
    hint: { color: palette.mid, fontSize: text.xs, marginBottom: space.xs + 'px' },
    inputRow: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginBottom: space.sm + 'px', alignItems: 'flex-end' },
    inputGroup: { display: 'flex', flexDirection: 'column', minWidth: '140px' },
    input: { width: '140px', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none' },
    select: { width: '100%', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none', appearance: 'none', WebkitAppearance: 'none', paddingRight: '28px', cursor: 'pointer', boxSizing: 'border-box' },
    selectWrap: { position: 'relative', display: 'inline-block', width: '80px' },
    selectChevron: { position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' },
    checkbox: { display: 'flex', alignItems: 'center', gap: space.xs + 'px', fontSize: text.sm, cursor: 'pointer', marginBottom: space.xs + 'px' },
    highlight: { padding: space.md + 'px', borderRadius: radius.sm + 'px', border: '1px solid ', marginBottom: space.md + 'px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: text.sm },
    th: { textAlign: 'left', padding: space.sm, borderBottom: '1px solid ' + palette.border, color: palette.mid, fontWeight: weight.medium },
    td: { padding: space.sm, borderBottom: '1px solid ' + palette.border },
    tdRight: { padding: space.sm, borderBottom: '1px solid ' + palette.border, textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
    big: { fontSize: text.xl, fontWeight: weight.bold },
    source: { marginTop: space.md + 'px', fontSize: text.sm, color: palette.mid, padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', border: '1px solid ' + palette.border, lineHeight: '1.5' },
  };

  const fmt = (v) => v != null ? v.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '–';

  const field = (labelKey, value, setter, placeholder) =>
    React.createElement('div', { style: s.inputGroup },
      React.createElement('div', { style: s.label }, t(labelKey)),
      React.createElement('input', {
        style: s.input, type: 'number', inputMode: 'decimal', value, placeholder,
        'aria-label': t(labelKey),
        onChange: e => setter(e.target.value),
      })
    );

  const toggle = (labelKey, value, setter) =>
    React.createElement('label', { style: s.checkbox },
      React.createElement('input', {
        type: 'checkbox', checked: value,
        onChange: e => setter(e.target.checked),
      }),
      t(labelKey)
    );

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'budget', size: 20 }),
      t('sh.title')
    ),

    React.createElement('div', { style: s.section },
      React.createElement('div', { style: s.inputRow },
        React.createElement('div', { style: s.inputGroup },
          React.createElement('div', { style: s.label }, t('sh.erwachsene')),
          React.createElement('div', { style: s.selectWrap },
            React.createElement('select', {
              style: s.select, value: adults,
              'aria-label': t('sh.erwachsene'),
              onChange: e => setAdults(Number(e.target.value)),
            },
              [1,2,3,4].map(n =>
                React.createElement('option', { key: n, value: n }, n)
              )
            ),
            React.createElement('div', { style: s.selectChevron }, '▾')
          )
        ),
        React.createElement('div', { style: s.inputGroup },
          React.createElement('div', { style: s.label }, t('sh.kinder')),
          React.createElement('div', { style: s.selectWrap },
            React.createElement('select', {
              style: s.select, value: kinderCount,
              'aria-label': t('sh.kinder'),
              onChange: e => setKinderCount(Number(e.target.value)),
            },
              [0,1,2,3,4,5].map(n =>
                React.createElement('option', { key: n, value: n }, n)
              )
            ),
            React.createElement('div', { style: s.selectChevron }, '▾')
          )
        ),
        field('sh.miete', miete, setMiete, '1200'),
        field('sh.kvg', kvg, setKvg, '380'),
      ),
      React.createElement('div', { style: s.inputRow },
        field('sh.einkommen', einkommen, setEinkommen, '0'),
        field('sh.andereEinkuenfte', andereEinkuenfte, setAndereEinkuenfte, '0'),
        field('sh.vermoegen', vermoegen, setVermoegen, '0'),
      ),
      React.createElement('div', { style: { marginTop: space.sm + 'px' } },
        toggle('sh.erwerbstaetig', erwerbstaetig, setErwerbstaetig),
        toggle('sh.integration', integration, setIntegration),
        React.createElement('div', { style: { ...s.hint, marginTop: '2px', marginLeft: '24px' } }, t('sh.integrationHint'))
      )
    ),

    result && React.createElement(React.Fragment, null,
      React.createElement('div', {
        'aria-live': 'polite',
        style: {
          ...s.highlight,
          borderColor: result.hatAnspruch ? palette.sage : palette.border,
          background: result.hatAnspruch ? palette.sage + '15' : palette.up,
        }
      },
        React.createElement('div', { style: s.label }, t('sh.anspruch')),
        React.createElement('div', {
          style: { ...s.big, color: result.hatAnspruch ? palette.sage : palette.mid }
        },
          result.hatAnspruch
            ? 'CHF ' + fmt(result.totalUnterstuetzung) + ' / ' + t('sh.monat')
            : t('sh.keinAnspruch')
        ),
        result.hatAnspruch && result.izu > 0 && React.createElement('div', { style: s.hint },
          t('sh.inklusiveIzu') + ': CHF ' + fmt(result.izu)
        )
      ),

      React.createElement('table', { style: s.table },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: s.th }, t('sh.position')),
            React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, 'CHF')
          )
        ),
        React.createElement('tbody', null,
          React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.gbl') + ' (' + result.haushaltGroesse + ' ' + t('sh.personen') + ')'),
            React.createElement('td', { style: s.tdRight }, fmt(result.gbl))
          ),
          React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.wohnkosten')),
            React.createElement('td', { style: s.tdRight }, fmt(result.wohnkosten))
          ),
          React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.kvgLabel')),
            React.createElement('td', { style: s.tdRight }, fmt(result.kvgPraemie))
          ),
          React.createElement('tr', null,
            React.createElement('td', { style: { ...s.td, fontWeight: weight.semi } }, t('sh.bedarf')),
            React.createElement('td', { style: { ...s.tdRight, fontWeight: weight.semi } }, fmt(result.bedarf))
          ),
          result.totalEinkommen > 0 && React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.einkommenTotal')),
            React.createElement('td', { style: s.tdRight }, '− ' + fmt(result.totalEinkommen))
          ),
          result.efb > 0 && React.createElement('tr', null,
            React.createElement('td', { style: { ...s.td, color: palette.sage } }, t('sh.efbLabel')),
            React.createElement('td', { style: { ...s.tdRight, color: palette.sage } }, '+ ' + fmt(result.efb))
          ),
          result.totalEinkommen > 0 && React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.anrechenbar')),
            React.createElement('td', { style: s.tdRight }, '− ' + fmt(result.anrechenbaresEinkommen))
          ),
          React.createElement('tr', null,
            React.createElement('td', { style: { ...s.td, fontWeight: weight.bold } }, t('sh.sozialhilfe')),
            React.createElement('td', { style: { ...s.tdRight, fontWeight: weight.bold } }, fmt(result.sozialhilfeAnspruch))
          )
        )
      ),

      result.anrechenbaresVermoegen > 0 && React.createElement('div', {
        style: { ...s.section, marginTop: space.md + 'px', color: palette.warn || palette.mid, border: '1px solid ' + (palette.warn || palette.mid), background: (palette.warn || palette.mid) + '15' }
      },
        t('sh.vermoegenHinweis') + ' (CHF ' + fmt(result.vermoegensfreibetrag) + ' ' + t('sh.freibetrag') + ')'
      )
    ),

    !result && React.createElement('div', { style: { ...s.section, color: palette.mid } }, t('sh.eingeben')),

    React.createElement('div', { style: s.source }, t('sh.source'))
  );
};

export default SozialhilfeRechner;
