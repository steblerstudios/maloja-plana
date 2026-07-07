import React, { useState, useMemo } from 'react';
import { berechneAltersrente, vergleicheVorbezugAufschub, berechneBVGGuthaben, bvgKoordinationsabzug, projiziereVorsorge, AHV_PARAMS, BVG_PARAMS } from './data/ahvRechner.js';
import { Icon, Icons } from './IconSystem.jsx';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';

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

export const VorsorgeRechner = ({ palette, t, data, onNavigate }) => {
  const birthYear = parseYear(data.basis?.dateOfBirth);
  const alter = currentAge(data.basis?.dateOfBirth);

  const [einkommen, setEinkommen] = useState(data.finanzen?.monthlyIncome ? String(Math.round(Number(data.finanzen.monthlyIncome) * 12)) : '');
  const [beitragsjahre, setBeitragsjahre] = useState('');
  const [erziehungsjahre, setErziehungsjahre] = useState('');
  const [bezugAlter, setBezugAlter] = useState('65');
  const [verheiratet, setVerheiratet] = useState(data.basis?.maritalStatus === 'married');
  const [einkommenPartner, setEinkommenPartner] = useState(data.basis?.household?.partnerIncome ? String(Math.round(Number(data.basis.household.partnerIncome) * 12)) : '');
  const [bvgGuthaben, setBvgGuthaben] = useState('');
  const [rendite, setRendite] = useState('1.5');
  const [saeule3bInput, setSaeule3bInput] = useState(data.finanzen?.pension3bBalance ? String(Math.round(Number(data.finanzen.pension3bBalance))) : '');
  const [activeTab, setActiveTab] = useState('ahv');

  const saeule3aBalance = Number(data.finanzen?.pension3aBalance) || 0;
  const saeule3aAnnual = Number(data.finanzen?.pension3a) || 0;
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

  const projektion = useMemo(() => {
    if (!alter) return null;
    const bvgSerie = (bvgResult && bvgResult.jahresDetail || []).map(d => d.guthaben);
    return projiziereVorsorge({
      alter,
      austrittsalter: parsedBezugAlter,
      bvgHeute: Number(bvgGuthaben) || 0,
      bvgSerie,
      s3aBalance: saeule3aBalance,
      s3aAnnual: saeule3aAnnual,
      s3aRendite: Number(rendite) || 0,
      s3bBalance: Number(saeule3bInput) || 0,
      s3bAnnual: 0,
      s3bRendite: Number(rendite) || 0,
    });
  }, [alter, parsedBezugAlter, bvgGuthaben, bvgResult, saeule3aBalance, saeule3aAnnual, saeule3bInput, rendite]);

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
    intlDetails: { marginTop: space.md + 'px', background: palette.up, border: '1px solid ' + palette.border + '88', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.md + 'px' },
    intlSummary: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, cursor: 'pointer' },
    intlIntro: { fontSize: text.xs, color: palette.mid, lineHeight: 1.6, margin: space.sm + 'px 0' },
    intlSit: { paddingTop: space.sm + 'px', marginTop: space.sm + 'px', borderTop: '1px solid ' + palette.border + '66' },
    intlSitTitle: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text },
    intlSitText: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, margin: '2px 0 4px' },
    intlLink: { fontSize: text.xs, color: palette.sky, textDecoration: 'none' },
    intlContact: { fontSize: text.xs, color: palette.mid, marginTop: space.md + 'px', fontWeight: weight.medium },
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
      React.createElement('button', { style: s.tab(activeTab === 'zukunft'), onClick: () => setActiveTab('zukunft') }, t('vr.tabZukunft')),
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
          React.createElement('div', { style: s.label }, t('vr.verheiratet')),
          React.createElement('div', { style: { display: 'flex', gap: '6px' } },
            [{ v: false, l: t('common.no') }, { v: true, l: t('common.yes') }].map((o, i) =>
              React.createElement('button', {
                key: i, type: 'button',
                onClick: () => setVerheiratet(o.v),
                style: s.tab(verheiratet === o.v)
              }, o.l)
            )
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

    // AHV mit Auslandbezug (Orientierung) — immer im AHV-Tab, einklappbar
    activeTab === 'ahv' && React.createElement('details', { style: s.intlDetails },
      React.createElement('summary', { style: s.intlSummary }, t('vr.intlTitle')),
      React.createElement('p', { style: s.intlIntro }, t('vr.intlIntro')),
      [
        { key: 'leaving', title: 'vr.intlLeavingTitle', text: 'vr.intlLeavingText', url: 'https://www.zas.admin.ch/de/verlassen-der-schweiz' },
        { key: 'voluntary', title: 'vr.intlVoluntaryTitle', text: 'vr.intlVoluntaryText', url: 'https://www.zas.admin.ch/de/freiwillige-ahviv' },
        { key: 'refund', title: 'vr.intlRefundTitle', text: 'vr.intlRefundText', url: 'https://www.zas.admin.ch/de/rueckverguetungen' },
      ].map(sit =>
        React.createElement('div', { key: sit.key, style: s.intlSit },
          React.createElement('div', { style: s.intlSitTitle }, t(sit.title)),
          React.createElement('div', { style: s.intlSitText }, t(sit.text)),
          React.createElement('a', { href: sit.url, target: '_blank', rel: 'noopener noreferrer', style: s.intlLink }, t('vr.intlMore'))
        )
      ),
      React.createElement('div', { style: s.intlContact }, t('vr.intlContact'))
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

    // Zukunft Tab — Projektion 2./3. Säule bis zum Rücktritt
    activeTab === 'zukunft' && React.createElement(React.Fragment, null,
      React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.md + 'px' } }, t('vr.zukunftIntro')),
      React.createElement('div', { style: s.section },
        React.createElement('div', { style: s.row },
          field(t('vr.rendite'), rendite, setRendite, { width: '90px', min: 0, max: 10, sublabel: t('vr.renditeHint') }),
          field(t('vr.s3bGuthaben'), saeule3bInput, setSaeule3bInput, { placeholder: '0' })
        )
      ),
      !alter && React.createElement('div', { style: { ...s.section, color: palette.mid } }, t('vr.geburtsdatumFehlt')),
      projektion && projektion.timeline.length > 1 && (() => {
        const pts = projektion.timeline;
        const N = pts.length;
        const maxT = Math.max(1, ...pts.map(p => p.total));
        const W = 340, H = 170, padL = 6, padR = 6, padT = 12, padB = 20;
        const xAt = (i) => padL + (N <= 1 ? 0 : (i / (N - 1))) * (W - padL - padR);
        const yAt = (v) => (H - padB) - (v / maxT) * (H - padT - padB);
        const band = (lower, upper) => {
          let d = 'M ' + xAt(0).toFixed(1) + ' ' + yAt(upper[0]).toFixed(1);
          for (let i = 1; i < N; i++) d += ' L ' + xAt(i).toFixed(1) + ' ' + yAt(upper[i]).toFixed(1);
          for (let i = N - 1; i >= 0; i--) d += ' L ' + xAt(i).toFixed(1) + ' ' + yAt(lower[i]).toFixed(1);
          return d + ' Z';
        };
        const zero = pts.map(() => 0);
        const bvgTop = pts.map(p => p.bvg);
        const s3aTop = pts.map(p => p.bvg + p.s3a);
        const totTop = pts.map(p => p.total);
        const colBvg = palette.sky, col3a = palette.gold, col3b = palette.sage;
        const legendItem = (col, label) => React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: text.xs, color: palette.mid } },
          React.createElement('span', { style: { width: '10px', height: '10px', borderRadius: '2px', background: col, display: 'inline-block' } }), label);
        const end = projektion.endsumme;
        return React.createElement('div', null,
          React.createElement('div', { style: s.highlight },
            React.createElement('div', { style: s.label }, t('vr.zukunftEnde') + ' (' + end.alter + ')'),
            React.createElement('div', { style: s.big }, 'CHF ' + fmt(end.total)),
            React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
              'BVG ' + fmt(end.bvg) + ' · 3a ' + fmt(end.s3a) + ' · 3b ' + fmt(end.s3b))
          ),
          React.createElement('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', role: 'img', 'aria-label': t('vr.zukunftEnde') + ': CHF ' + fmt(end.total), style: { display: 'block', marginBottom: space.sm + 'px' } },
            React.createElement('line', { x1: padL, y1: H - padB, x2: W - padR, y2: H - padB, stroke: palette.border, strokeWidth: 1 }),
            React.createElement('path', { d: band(zero, bvgTop), fill: colBvg, opacity: 0.55 }),
            React.createElement('path', { d: band(bvgTop, s3aTop), fill: col3a, opacity: 0.6 }),
            React.createElement('path', { d: band(s3aTop, totTop), fill: col3b, opacity: 0.5 }),
            React.createElement('text', { x: padL, y: H - 6, fill: palette.mid, fontSize: 9, fontFamily: 'inherit' }, t('vr.zukunftHeute') + ' (' + pts[0].alter + ')'),
            React.createElement('text', { x: W - padR, y: H - 6, fill: palette.mid, fontSize: 9, fontFamily: 'inherit', textAnchor: 'end' }, String(end.alter))
          ),
          React.createElement('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginBottom: space.sm + 'px' } },
            legendItem(colBvg, 'BVG'), legendItem(col3a, '3a'), legendItem(col3b, '3b')),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5 } }, t('vr.zukunftHinweis'))
        );
      })()
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
      ),

      // 3a forecast
      (() => {
        const has3a = saeule3aBalance > 0 || saeule3aAnnual > 0;
        const yearsLeft = alter ? Math.max(0, parsedBezugAlter - alter) : 0;
        const projected3a = saeule3aBalance + (saeule3aAnnual * yearsLeft);
        if (!has3a) return React.createElement('div', { style: { ...s.section, color: palette.mid, marginTop: space.md + 'px' } },
          'ⓘ ' + t('vr.saeule3aHint')
        );
        return React.createElement('div', { style: { ...s.section, marginTop: space.md + 'px', background: palette.sky + '0A', border: '1px solid ' + palette.sky + '25' } },
          React.createElement('div', { style: s.label }, t('vr.saeule3a')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.sky } }, 'CHF ' + fmt(projected3a)),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
            t('vr.saeule3aKapital', { alter: parsedBezugAlter }) + ' — ' + t('vr.saeule3aDetail', { balance: fmt(saeule3aBalance), years: yearsLeft, annual: fmt(saeule3aAnnual) })
          ),
          ahvResult && bvgResult && bvgResult.versichert && React.createElement('div', { style: { marginTop: space.sm + 'px', fontWeight: weight.semi, fontSize: text.sm } },
            t('vr.totalMitSaeule3a') + ': CHF ' + fmt(ahvResult.monatsrente + bvgResult.monatsrente) + '/' + t('vr.monat') + ' + CHF ' + fmt(projected3a) + ' ' + t('vr.saeule3a')
          )
        );
      })()
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
          { key: 'BSV', url: 'https://www.bsv.admin.ch/de/bv-gesetze-verordnungen' },
          { key: 'Auffang', url: 'https://www.aeis.ch/' },
          { key: 'FINMA', url: 'https://www.finma.ch/en/authorisation/types-of-licensing/' },
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

    React.createElement(OfficialLinkBox, { palette, t, data, ids: ['ahv', 'ergaenzungsleistungen'] }),

    React.createElement('div', { style: s.source },
      renderSource(t('vr.source'))
    ),

    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('finanzuebersicht'),
      style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sand, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md + 'px' }
    }, '→ ' + t('nav.finanzUebersicht'))
  );
};

export default VorsorgeRechner;
