import React, { useState, useMemo } from 'react';
import { berechneAltersrente, vergleicheVorbezugAufschub, berechneBVGGuthaben, bvgKoordinationsabzug, AHV_PARAMS, BVG_PARAMS } from './data/ahvRechner.js';
import { Icon, Icons } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';

function parseYear(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d.getFullYear();
}

function currentAge(dateStr) {
  if (!dateStr) return null;
  const birth = new Date(dateStr);
  const now = new Date();
  return now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
}

export const VorsorgeRechner = ({ palette, t, data }) => {
  const birthYear = parseYear(data.basis?.dateOfBirth);
  const alter = currentAge(data.basis?.dateOfBirth);

  const [einkommen, setEinkommen] = useState(data.finanzen?.income || '');
  const [beitragsjahre, setBeitragsjahre] = useState('');
  const [erziehungsjahre, setErziehungsjahre] = useState('');
  const [bezugAlter, setBezugAlter] = useState('65');
  const [verheiratet, setVerheiratet] = useState(data.basis?.civilStatus === 'married');
  const [einkommenPartner, setEinkommenPartner] = useState('');
  const [bvgGuthaben, setBvgGuthaben] = useState('');
  const [activeTab, setActiveTab] = useState('ahv');

  const parsedEinkommen = Number(einkommen) || 0;
  const parsedBeitragsjahre = Number(beitragsjahre) || (alter && alter > 20 ? Math.min(alter - 20, 44) : 44);
  const parsedBezugAlter = Number(bezugAlter) || 65;

  const ahvResult = useMemo(() => {
    if (parsedEinkommen <= 0) return null;
    return berechneAltersrente({
      geburtsjahr: birthYear || 1970,
      durchschnittlichesJahreseinkommen: parsedEinkommen,
      beitragsjahre: parsedBeitragsjahre,
      erziehungsjahre: Number(erziehungsjahre) || 0,
      bezugAlter: parsedBezugAlter,
      verheiratet,
      einkommenPartner: Number(einkommenPartner) || 0,
    });
  }, [parsedEinkommen, parsedBeitragsjahre, erziehungsjahre, parsedBezugAlter, verheiratet, einkommenPartner, birthYear]);

  const vorbezugVergleich = useMemo(() => {
    if (parsedEinkommen <= 0) return [];
    return vergleicheVorbezugAufschub(parsedEinkommen, parsedBeitragsjahre);
  }, [parsedEinkommen, parsedBeitragsjahre]);

  const bvgResult = useMemo(() => {
    if (parsedEinkommen <= 0 || !alter) return null;
    return berechneBVGGuthaben({
      alter,
      jahresbruttolohn: parsedEinkommen,
      aktuellesGuthaben: Number(bvgGuthaben) || 0,
      austrittsalter: parsedBezugAlter,
    });
  }, [parsedEinkommen, alter, bvgGuthaben, parsedBezugAlter]);

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    section: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.md + 'px', fontSize: text.sm },
    label: { fontWeight: weight.semi, marginBottom: space.xs + 'px', fontSize: text.sm },
    sublabel: { color: palette.mid, fontSize: text.xs, marginTop: '2px' },
    input: { width: '140px', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none' },
    row: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginBottom: space.sm + 'px', alignItems: 'flex-end' },
    highlight: { padding: space.md + 'px', background: palette.sage + '22', borderRadius: radius.sm + 'px', border: '1px solid ' + palette.sage, marginBottom: space.md + 'px' },
    big: { fontSize: text.xl, fontWeight: weight.bold, color: palette.sage },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: text.sm },
    th: { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid ' + palette.border, color: palette.mid, fontWeight: weight.medium },
    td: { padding: '6px 8px', borderBottom: '1px solid ' + palette.border },
    tdActive: { padding: '6px 8px', borderBottom: '1px solid ' + palette.border, fontWeight: weight.semi, color: palette.sage },
    tabRow: { display: 'flex', gap: space.xs, marginBottom: space.md + 'px' },
    tab: (active) => ({ padding: '8px 16px', fontSize: text.sm, fontWeight: active ? weight.semi : weight.normal, border: '1px solid ' + (active ? palette.sage : palette.border), borderRadius: radius.sm + 'px', background: active ? palette.sage + '22' : palette.surface, color: active ? palette.sage : palette.text, cursor: 'pointer', fontFamily: 'inherit' }),
    source: { marginTop: space.md + 'px', fontSize: text.xs, color: palette.sky },
    checkbox: { display: 'flex', alignItems: 'center', gap: space.xs + 'px', cursor: 'pointer' },
  };

  const field = (labelText, value, setter, opts = {}) =>
    React.createElement('div', null,
      React.createElement('div', { style: s.label }, labelText),
      opts.sublabel && React.createElement('div', { style: s.sublabel }, opts.sublabel),
      React.createElement('input', {
        style: { ...s.input, width: opts.width || '140px' },
        type: 'number',
        inputMode: 'decimal',
        value,
        onChange: e => setter(e.target.value),
        placeholder: opts.placeholder || '',
        min: opts.min,
        max: opts.max,
      })
    );

  const fmt = (v) => v != null ? v.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '–';

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'vorsorge', size: 20 }),
      t('vr.title')
    ),

    // Tab row
    React.createElement('div', { style: s.tabRow },
      React.createElement('button', { style: s.tab(activeTab === 'ahv'), onClick: () => setActiveTab('ahv') }, t('vr.tabAhv')),
      React.createElement('button', { style: s.tab(activeTab === 'bvg'), onClick: () => setActiveTab('bvg') }, t('vr.tabBvg')),
      React.createElement('button', { style: s.tab(activeTab === 'vergleich'), onClick: () => setActiveTab('vergleich') }, t('vr.tabVergleich')),
      React.createElement('button', { style: s.tab(activeTab === 'fz'), onClick: () => setActiveTab('fz') }, t('vr.tabFreizuegigkeit'))
    ),

    // Input fields
    React.createElement('div', { style: s.section },
      React.createElement('div', { style: s.row },
        field(t('vr.einkommen'), einkommen, setEinkommen, { placeholder: '80000', sublabel: t('vr.einkommenHint') }),
        field(t('vr.beitragsjahre'), beitragsjahre, setBeitragsjahre, { placeholder: String(parsedBeitragsjahre), width: '80px', min: 1, max: 44 }),
        field(t('vr.bezugAlter'), bezugAlter, setBezugAlter, { width: '80px', min: 63, max: 70 })
      ),
      React.createElement('div', { style: s.row },
        field(t('vr.erziehungsjahre'), erziehungsjahre, setErziehungsjahre, { placeholder: '0', width: '80px', sublabel: t('vr.erziehungsjahreHint') }),
        React.createElement('div', null,
          React.createElement('label', { style: s.checkbox },
            React.createElement('input', { type: 'checkbox', checked: verheiratet, onChange: e => setVerheiratet(e.target.checked) }),
            t('vr.verheiratet')
          )
        ),
        verheiratet && field(t('vr.einkommenPartner'), einkommenPartner, setEinkommenPartner, { placeholder: '60000' })
      )
    ),

    // AHV Tab
    activeTab === 'ahv' && ahvResult && React.createElement(React.Fragment, null,
      React.createElement('div', { 'aria-live': 'polite', style: s.highlight },
        React.createElement('div', { style: s.label }, t('vr.ahvRente')),
        React.createElement('div', { style: s.big }, 'CHF ' + fmt(ahvResult.monatsrente) + ' / ' + t('vr.monat')),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
          'CHF ' + fmt(ahvResult.jahresrente) + ' / ' + t('vr.jahr')
        )
      ),
      React.createElement('div', { style: s.section },
        React.createElement('div', null, t('vr.skalenfaktor') + ': ' + (ahvResult.skalenfaktor * 100).toFixed(1) + '% (' + ahvResult.beitragsjahre + '/' + AHV_PARAMS.volleBeitragsjahre + ' ' + t('vr.jahre') + ')'),
        ahvResult.fehlendeBeitragsjahre > 0 && React.createElement('div', { style: { color: palette.gold } },
          t('vr.fehlendeBeitragsjahre') + ': ' + ahvResult.fehlendeBeitragsjahre
        ),
        ahvResult.vorbezugAufschub !== 0 && React.createElement('div', null,
          (ahvResult.vorbezugAufschub > 0 ? t('vr.aufschub') : t('vr.vorbezug')) + ': ' + Math.abs(ahvResult.vorbezugAufschub).toFixed(1) + '%'
        ),
        ahvResult.erziehungsgutschrift > 0 && React.createElement('div', null,
          t('vr.erziehungsgutschrift') + ': CHF ' + fmt(ahvResult.erziehungsgutschrift) + ' / ' + t('vr.jahr')
        ),
        ahvResult.plafoniert && React.createElement('div', { style: { color: palette.gold } },
          t('vr.plafoniert') + ': CHF ' + fmt(ahvResult.totalEhepaar) + ' / ' + t('vr.monat') + ' (' + t('vr.ehepaar') + ')'
        ),
        React.createElement('div', { style: { marginTop: space.sm + 'px', color: palette.mid, fontSize: text.xs } },
          t('vr.minMax') + ': CHF ' + fmt(AHV_PARAMS.minRente) + ' – ' + fmt(AHV_PARAMS.maxRente) + ' / ' + t('vr.monat')
        )
      )
    ),

    // BVG Tab
    activeTab === 'bvg' && React.createElement(React.Fragment, null,
      React.createElement('div', { style: s.section },
        field(t('vr.bvgGuthaben'), bvgGuthaben, setBvgGuthaben, { placeholder: '0', sublabel: t('vr.bvgGuthabenHint') })
      ),
      bvgResult && bvgResult.versichert && React.createElement(React.Fragment, null,
        React.createElement('div', { style: s.highlight },
          React.createElement('div', { style: s.label }, t('vr.bvgRente')),
          React.createElement('div', { style: s.big }, 'CHF ' + fmt(bvgResult.monatsrente) + ' / ' + t('vr.monat')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
            t('vr.bvgGuthabenBei') + ' ' + parsedBezugAlter + ': CHF ' + fmt(bvgResult.guthaben)
          )
        ),
        React.createElement('div', { style: s.section },
          React.createElement('div', null, t('vr.koordinierterLohn') + ': CHF ' + fmt(bvgResult.koordinierterLohn)),
          React.createElement('div', null, t('vr.umwandlungssatz') + ': ' + bvgResult.umwandlungssatz + '%'),
          React.createElement('div', null, t('vr.mindestzins') + ': ' + bvgResult.zinssatz + '%')
        )
      ),
      bvgResult && !bvgResult.versichert && React.createElement('div', { style: { ...s.section, color: palette.gold } },
        t('vr.bvgNichtVersichert') + ' (< CHF ' + fmt(BVG_PARAMS.eintrittsschwelle) + ')'
      ),
      !alter && React.createElement('div', { style: { ...s.section, color: palette.mid } }, t('vr.geburtsdatumFehlt'))
    ),

    // Vergleich Tab
    activeTab === 'vergleich' && vorbezugVergleich.length > 0 && React.createElement(React.Fragment, null,
      React.createElement('div', { style: { ...s.label, marginBottom: space.sm + 'px' } }, t('vr.vorbezugVergleich')),
      React.createElement('table', { style: s.table },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: s.th }, t('vr.bezugAlterLabel')),
            React.createElement('th', { style: s.th }, t('vr.monatsrenteLabel')),
            React.createElement('th', { style: s.th }, t('vr.jahresrenteLabel')),
            React.createElement('th', { style: s.th }, t('vr.anpassungLabel'))
          )
        ),
        React.createElement('tbody', null,
          vorbezugVergleich.map(row =>
            React.createElement('tr', { key: row.bezugAlter },
              React.createElement('td', { style: row.bezugAlter === parsedBezugAlter ? s.tdActive : s.td }, row.bezugAlter),
              React.createElement('td', { style: row.bezugAlter === parsedBezugAlter ? s.tdActive : s.td }, 'CHF ' + fmt(row.monatsrente)),
              React.createElement('td', { style: row.bezugAlter === parsedBezugAlter ? s.tdActive : s.td }, 'CHF ' + fmt(row.jahresrente)),
              React.createElement('td', { style: row.bezugAlter === parsedBezugAlter ? s.tdActive : s.td },
                row.anpassung === 0 ? '–' : (row.anpassung > 0 ? '+' : '') + row.anpassung.toFixed(1) + '%'
              )
            )
          )
        )
      ),

      // Combined AHV + BVG total
      ahvResult && bvgResult && bvgResult.versichert && React.createElement('div', { style: { ...s.highlight, marginTop: space.md + 'px' } },
        React.createElement('div', { style: s.label }, t('vr.totalRente')),
        React.createElement('div', { style: s.big }, 'CHF ' + fmt(ahvResult.monatsrente + bvgResult.monatsrente) + ' / ' + t('vr.monat')),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
          t('vr.saeulen') + ': AHV CHF ' + fmt(ahvResult.monatsrente) + ' + BVG CHF ' + fmt(bvgResult.monatsrente)
        )
      )
    ),

    // Freizügigkeit Tab
    activeTab === 'fz' && React.createElement(React.Fragment, null,
      React.createElement('div', { style: { ...s.section, background: palette.sky + '0A', border: '1px solid ' + palette.sky + '25' } },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: space.sm + 'px', color: palette.text } }, t('vr.fzTitle')),
        React.createElement('div', { style: { color: palette.mid, lineHeight: 1.6 } }, t('vr.fzIntro'))
      ),
      [
        { key: 'job', icon: 'work', color: palette.sage },
        { key: 'gap', icon: 'timeline', color: palette.gold },
        { key: 'self', icon: 'selfEmployment', color: palette.sand },
        { key: 'abroad', icon: 'mobility', color: palette.sky },
      ].map(sc => {
        const titleKey = 'vr.fzScenario' + sc.key.charAt(0).toUpperCase() + sc.key.slice(1);
        const textKey = titleKey + 'Text';
        const ScIcon = Icons[sc.icon];
        return React.createElement('div', {
          key: sc.key,
          style: { display: 'flex', gap: space.md + 'px', alignItems: 'flex-start', padding: space.md + 'px 0', borderBottom: '1px solid ' + palette.border + '44' }
        },
          React.createElement('div', { style: { width: '28px', height: '28px', flexShrink: 0, color: sc.color, marginTop: '2px' } },
            ScIcon ? ScIcon() : null
          ),
          React.createElement('div', null,
            React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm, marginBottom: space.xs + 'px' } }, t(titleKey)),
            React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.6 } }, t(textKey))
          )
        );
      }),
      React.createElement('div', { style: { ...s.highlight, background: palette.gold + '15', border: '1px solid ' + palette.gold + '30', marginTop: space.md + 'px' } },
        React.createElement('div', { style: { fontSize: text.sm, lineHeight: 1.6 } }, t('vr.fzTip'))
      ),
      React.createElement('div', { style: { marginTop: space.md + 'px' } },
        React.createElement('div', { style: { fontWeight: weight.medium, fontSize: text.sm, marginBottom: space.sm + 'px' } }, t('vr.fzLinks')),
        [
          { key: 'BSV', url: 'https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/bv/grundlagen-und-gesetze/freizuegigkeit.html' },
          { key: 'Auffang', url: 'https://www.aeis.ch/' },
          { key: 'FINMA', url: 'https://www.finma.ch/de/bewilligung/freizuegigkeitsstiftungen/' },
        ].map(link =>
          React.createElement('div', { key: link.key, style: { marginBottom: space.xs + 'px' } },
            React.createElement('a', {
              href: link.url,
              target: '_blank',
              rel: 'noopener noreferrer',
              style: { fontSize: text.sm, color: palette.sky, textDecoration: 'none' }
            }, t('vr.fzLink' + link.key) + ' →')
          )
        )
      )
    ),

    activeTab !== 'fz' && !parsedEinkommen && React.createElement('div', { style: { ...s.section, color: palette.mid } }, t('vr.einkommenEingeben')),

    React.createElement('div', { style: s.source },
      t('vr.source')
    )
  );
};

export default VorsorgeRechner;
