import React, { useState, useMemo } from 'react';
import { berechneTaggeld, ALV_PARAMS } from './data/alvRechner.js';
import { Icon } from './IconSystem.jsx';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { text, weight, space, radius } from './config/tokens.js';

function currentAge(dateStr) {
  if (!dateStr) return null;
  const birth = new Date(dateStr);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  return now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
}

export const AlvRechner = ({ palette, t, data, onNavigate }) => {
  const alter = currentAge(data.basis?.dateOfBirth);
  const householdChildren = (data.basis?.household?.children || []).length;

  // Monatslohn aus den Finanzen vorbefüllen (überschreibbar) — nicht zweimal eingeben.
  const [bruttolohn, setBruttolohn] = useState(data.finanzen?.monthlyIncome ? String(data.finanzen.monthlyIncome) : '');
  const [hatKinder, setHatKinder] = useState(householdChildren > 0);
  const [beitragsmonate, setBeitragsmonate] = useState('');
  const [ivGrad40, setIvGrad40] = useState(false);

  const parsedLohn = Number(String(bruttolohn).replace(',', '.')) || 0;
  const parsedMonate = Number(beitragsmonate) || 0;

  const result = useMemo(() => {
    if (parsedLohn <= 0) return null;
    return berechneTaggeld({
      versicherterVerdienst: parsedLohn,
      hatKinder,
      ivGrad40,
      beitragsmonate: parsedMonate,
      alter,
    });
  }, [parsedLohn, hatKinder, ivGrad40, parsedMonate, alter]);

  const fmt = (v) => v != null ? v.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '–';
  const canton = data.basis?.canton;

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.6, marginBottom: space.md + 'px', maxWidth: '560px' },
    section: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.md + 'px' },
    row: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginBottom: space.md + 'px', alignItems: 'flex-end' },
    label: { fontWeight: weight.semi, marginBottom: space.xs + 'px', fontSize: text.sm },
    sublabel: { color: palette.mid, fontSize: text.xs, marginTop: '2px', maxWidth: '320px', lineHeight: 1.5 },
    input: { width: '160px', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none' },
    toggle: (active) => ({ padding: '8px 16px', fontSize: text.sm, fontWeight: active ? weight.semi : weight.normal, border: '1px solid ' + (active ? palette.sage : palette.border), borderRadius: radius.sm + 'px', background: active ? palette.sage + '22' : palette.surface, color: active ? palette.sage : palette.text, cursor: 'pointer', fontFamily: 'inherit' }),
    resultBox: { padding: space.md + 'px', background: palette.sage + '18', borderRadius: radius.sm + 'px', border: '1px solid ' + palette.sage + '66', marginBottom: space.md + 'px' },
    resLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.md + 'px', padding: '7px 0', borderBottom: '1px solid ' + palette.border + '66' },
    resKey: { fontSize: text.sm, color: palette.mid },
    resVal: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, textAlign: 'right' },
    resBig: { fontSize: text.xl, fontWeight: weight.bold, color: palette.sage },
    hint: { fontSize: text.xs, color: palette.mid, marginTop: space.sm + 'px', lineHeight: 1.5 },
    disclaimer: { fontSize: text.xs, color: palette.soft, marginTop: space.md + 'px', lineHeight: 1.5, fontStyle: 'italic' },
    empty: { fontSize: text.sm, color: palette.mid, padding: space.md + 'px', textAlign: 'center' },
    crosslink: { display: 'block', width: '100%', background: palette.sageMist || palette.up, border: 'none', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.sageDeep || palette.mid, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', marginBottom: space.md + 'px' },
  };

  const numField = (labelText, value, setter, opts = {}) =>
    React.createElement('div', null,
      React.createElement('label', { style: s.label }, labelText,
        opts.sublabel && React.createElement('div', { style: s.sublabel }, opts.sublabel),
        React.createElement('input', {
          style: { ...s.input, width: opts.width || '160px', marginTop: '6px' },
          type: 'number', inputMode: 'decimal',
          value, onChange: e => setter(e.target.value),
          placeholder: opts.placeholder || '', min: opts.min, max: opts.max,
          'aria-label': labelText,
        })
      )
    );

  const toggleField = (labelText, value, setter, sublabel) =>
    React.createElement('div', null,
      React.createElement('div', { style: s.label }, labelText),
      sublabel && React.createElement('div', { style: { ...s.sublabel, marginBottom: '6px' } }, sublabel),
      React.createElement('div', { style: { display: 'flex', gap: '6px', marginTop: '4px' } },
        [{ v: true, l: t('common.yes') }, { v: false, l: t('common.no') }].map((o, i) =>
          React.createElement('button', {
            key: i, type: 'button',
            'aria-pressed': value === o.v,
            style: s.toggle(value === o.v),
            onClick: () => setter(o.v),
          }, o.l)
        )
      )
    );

  const resultLine = (key, val, opts = {}) =>
    React.createElement('div', { style: { ...s.resLine, ...(opts.last ? { borderBottom: 'none' } : {}) } },
      React.createElement('span', { style: s.resKey }, key),
      React.createElement('span', { style: opts.big ? { ...s.resVal, ...s.resBig } : s.resVal }, val)
    );

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'family', size: 20 }),
      t('alv.title')
    ),
    React.createElement('p', { style: s.intro }, t('alv.intro')),

    // ── Eingaben ──
    React.createElement('div', { style: s.section },
      React.createElement('div', { style: s.row },
        numField(t('alv.bruttolohn'), bruttolohn, setBruttolohn, { placeholder: '6000', sublabel: t('alv.bruttolohnHint'), width: '180px' }),
        numField(t('alv.beitragsmonate'), beitragsmonate, setBeitragsmonate, { placeholder: '12', sublabel: t('alv.beitragsmonateHint'), width: '120px', min: 0, max: 24 })
      ),
      React.createElement('div', { style: s.row },
        toggleField(t('alv.kinder'), hatKinder, setHatKinder, t('alv.kinderHint')),
        toggleField(t('alv.ivGrad'), ivGrad40, setIvGrad40)
      )
    ),

    // ── Ergebnis ──
    !result && React.createElement('div', { style: s.empty }, t('alv.enterBrutto')),

    result && !result.anspruch && React.createElement('div', { style: s.resultBox },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.text } }, t('alv.noAnspruch'))
    ),

    result && result.anspruch && React.createElement('div', { style: s.resultBox },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm + 'px' } }, t('alv.resultTitle')),
      resultLine(t('alv.satzLabel'), t('alv.satzValue', { p: Math.round(result.satz * 100) })),
      resultLine(t('alv.taggeldLabel'), 'CHF ' + result.taggeld.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
      resultLine(t('alv.monatlichLabel'), 'CHF ' + fmt(result.monatlich), { big: true }),
      resultLine(t('alv.wartetageLabel'), t('alv.wartetageValue', { n: result.wartetage })),
      resultLine(t('alv.anspruchLabel'),
        result.anspruchstage != null
          ? t('alv.anspruchValue', { n: result.anspruchstage, m: Math.round(result.anspruchstage / ALV_PARAMS.taggelderProMonat) })
          : t('alv.anspruchUnklar'),
        { last: true }
      ),
      result.gedeckelt && React.createElement('div', { style: s.hint }, t('alv.gedeckeltHint', { max: fmt(ALV_PARAMS.versicherterVerdienstMax) })),
      React.createElement('div', { style: s.disclaimer }, t('alv.disclaimer'))
    ),

    // ── Anmeldung / RAV ──
    React.createElement('div', { style: { ...s.section, background: palette.sky + '14', border: '1px solid ' + palette.sky + '44' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.xs + 'px' } }, t('alv.ravTitle')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.6 } }, t('alv.ravBody'))
    ),

    canton && onNavigate && React.createElement('button', {
      style: s.crosslink,
      onClick: () => onNavigate('direktlinks'),
    }, t('alv.cantonLink', { canton })),

    // ── Offizielle Links ──
    React.createElement(OfficialLinkBox, { palette, t, data, ids: ['arbeitslosigkeit', 'ueberbrueckungsleistungen'] })
  );
};

export default AlvRechner;
