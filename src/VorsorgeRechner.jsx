import React, { useState, useMemo } from 'react';
import { berechneAltersrente, vergleicheVorbezugAufschub, berechneBVGGuthaben, bvgKoordinationsabzug, projiziereVorsorge, AHV_PARAMS, BVG_PARAMS } from './data/ahvRechner.js';
import { Icon, Icons } from './IconSystem.jsx';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { TwoRingsIcon } from './components/TwoRingsIcon.jsx';

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
  const [saeule3aAnnualInput, setSaeule3aAnnualInput] = useState(data.finanzen?.pension3a ? String(Math.round(Number(data.finanzen.pension3a))) : '');
  const [activeTab, setActiveTab] = useState('ahv');

  const saeule3aBalance = Number(data.finanzen?.pension3aBalance) || 0;
  const saeule3aAnnual = Number(saeule3aAnnualInput) || 0;
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

  // AHV fürs Zukunftsbild: auf durchgehende Beiträge bis zum Rücktritt projiziert
  // (min(Rücktritt−20, 44) volle Beitragsjahre), sonst würde die AHV mit den
  // heutigen Beitragsjahren stark unterschätzt. Eingetragene Beitragsjahre gehen vor.
  const projektionAhv = useMemo(() => {
    if (parsedEinkommen <= 0) return null;
    const bj = Number(beitragsjahre) || Math.min(Math.max(0, parsedBezugAlter - 20), AHV_PARAMS.volleBeitragsjahre);
    return berechneAltersrente({
      geburtsjahr: birthYear || 1970,
      durchschnittlichesJahreseinkommen: parsedEinkommen,
      beitragsjahre: bj,
      erziehungsjahre: Number(erziehungsjahre) || 0,
      bezugAlter: parsedBezugAlter,
      verheiratet,
      einkommenPartner: Number(einkommenPartner) || 0,
    });
  }, [parsedEinkommen, beitragsjahre, parsedBezugAlter, erziehungsjahre, verheiratet, einkommenPartner, birthYear]);

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
    // Reiter wie im ChapterView: sticky + einzeilig horizontal scrollbar (Jakob's Law —
    // gleiches Verhalten wie in den Finanzen-Kapiteln). top:-24px gleicht das padding-top
    // des Scroll-Containers aus, damit die Leiste bündig unter dem „100% lokal"-Streifen klebt.
    tabRow: { position: 'sticky', top: '-24px', zIndex: 5, display: 'flex', flexWrap: 'nowrap', gap: space.xs + 'px', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', padding: space.sm + 'px 0', marginBottom: space.md + 'px', background: palette.surface, borderBottom: '1px solid ' + palette.border + '55' },
    tab: (active) => ({ flexShrink: 0, whiteSpace: 'nowrap', padding: '8px 16px', fontSize: text.sm, fontWeight: active ? weight.semi : weight.normal, border: '1px solid ' + (active ? palette.sage : palette.border), borderRadius: radius.sm + 'px', background: active ? palette.sage + '22' : palette.surface, color: active ? palette.sage : palette.text, cursor: 'pointer', fontFamily: 'inherit' }),
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
          React.createElement('div', { style: { ...s.label, display: 'flex', alignItems: 'center', gap: '6px' } },
            t('vr.verheiratet'),
            verheiratet && React.createElement(TwoRingsIcon, { size: 15, color: palette.sage })
          ),
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
          field(t('vr.s3aAnnual'), saeule3aAnnualInput, setSaeule3aAnnualInput, { placeholder: '0', sublabel: t('vr.s3aAnnualHint') }),
          field(t('vr.s3bGuthaben'), saeule3bInput, setSaeule3bInput, { placeholder: '0' })
        )
      ),
      !alter && React.createElement('div', { style: { ...s.section, color: palette.mid } }, t('vr.geburtsdatumFehlt')),
      projektion && projektion.timeline.length > 1 && (() => {
        const tl = projektion.timeline;           // alter..Rücktritt (aus der Engine)
        const end = projektion.endsumme;
        const START = Math.floor(alter);
        const AXIS_END = 100;                      // keine Alters-Diskriminierung: Zeitachse bis 100
        const ret = Math.max(START, Math.round(parsedBezugAlter));
        const retMin = Math.max(58, START);
        const retMax = Math.max(retMin, 70);
        const setRet = (a) => setBezugAlter(String(Math.max(retMin, Math.min(retMax, Math.round(a)))));
        // Kapital pro Alter: bis Rücktritt aus der Engine, danach flach (Pension, kein Drawdown).
        const val = (a) => (a <= ret ? (tl[a - START] || tl[tl.length - 1]) : end);
        const ages = [];
        for (let a = START; a <= AXIS_END; a++) ages.push(a);
        // Stabile y-Skala (rundet auf, damit sie beim Ziehen nicht zappelt).
        const rawMax = end.total * 1.1;
        const step = rawMax > 400000 ? 100000 : 50000;
        const maxY = Math.max(step, Math.ceil(rawMax / step) * step);
        const VBW = 680, VBH = 340, x0 = 54, x1 = 628, y0 = 26, yB = 280;
        const xA = (a) => x0 + (a - START) / (AXIS_END - START) * (x1 - x0);
        const yV = (v) => yB - v / maxY * (yB - y0);
        const band = (lo, hi) => {
          let d = 'M ' + xA(START).toFixed(1) + ' ' + yV(hi(val(START))).toFixed(1);
          for (let k = 1; k < ages.length; k++) d += ' L ' + xA(ages[k]).toFixed(1) + ' ' + yV(hi(val(ages[k]))).toFixed(1);
          for (let k = ages.length - 1; k >= 0; k--) d += ' L ' + xA(ages[k]).toFixed(1) + ' ' + yV(lo(val(ages[k]))).toFixed(1);
          return d + ' Z';
        };
        const z = () => 0, b = (p) => p.bvg, ba = (p) => p.bvg + p.s3a, tot = (p) => p.bvg + p.s3a + p.s3b;
        const colBvg = palette.sky, col3a = palette.gold, col3b = palette.sage;
        const xret = xA(ret);
        const ageFromEvent = (e) => {
          const svg = e.currentTarget.ownerSVGElement || e.currentTarget;
          const r = svg.getBoundingClientRect();
          const vbX = (e.clientX - r.left) / r.width * VBW;
          return START + (vbX - x0) / (x1 - x0) * (AXIS_END - START);
        };
        const xticks = []; for (let a = Math.ceil(START / 10) * 10; a <= AXIS_END; a += 10) xticks.push(a);
        const yticks = [0, 0.5, 1].map((f) => maxY * f);
        const legendItem = (col, label) => React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: text.xs, color: palette.mid } },
          React.createElement('span', { style: { width: '10px', height: '10px', borderRadius: '2px', background: col, display: 'inline-block' } }), label);
        return React.createElement('div', null,
          React.createElement('div', { style: s.highlight },
            React.createElement('div', { style: s.label }, t('vr.zukunftEnde') + ' (' + end.alter + ')'),
            React.createElement('div', { style: s.big }, 'CHF ' + fmt(end.total)),
            React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
              'BVG ' + fmt(end.bvg) + ' · 3a ' + fmt(end.s3a) + ' · 3b ' + fmt(end.s3b))
          ),
          (() => {
            const ahvMonat = projektionAhv ? projektionAhv.monatsrente : 0;
            const bvgMonat = (bvgResult && bvgResult.versichert) ? bvgResult.monatsrente : 0;
            if (!ahvMonat && !bvgMonat) return null;
            return React.createElement('div', { style: { ...s.section, marginBottom: space.md + 'px' } },
              React.createElement('div', { style: s.label }, t('vr.zukunftRente')),
              React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text } },
                'CHF ' + fmt(ahvMonat + bvgMonat) + ' / ' + t('vr.monat')),
              React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
                'AHV ' + fmt(ahvMonat) + ' · BVG ' + fmt(bvgMonat)),
              React.createElement('div', { style: { ...s.sublabel, marginTop: space.xs } }, t('vr.zukunftRenteAufteilung')),
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs, lineHeight: 1.5 } }, t('vr.zukunftRenteHinweis'))
            );
          })(),
          React.createElement('svg', { viewBox: '0 0 ' + VBW + ' ' + VBH, width: '100%', role: 'group', 'aria-label': t('vr.tabZukunft'), style: { display: 'block', marginBottom: space.sm + 'px', touchAction: 'none' } },
            // Lebensphasen-Hintergrund
            React.createElement('rect', { x: x0, y: y0, width: Math.max(0, xret - x0), height: yB - y0, fill: palette.sage, opacity: 0.05 }),
            React.createElement('rect', { x: xret, y: y0, width: Math.max(0, x1 - xret), height: yB - y0, fill: palette.sky, opacity: 0.05 }),
            // Kapital-Flächen (BVG/3a/3b), flach ab Rücktritt
            React.createElement('path', { d: band(z, b), fill: colBvg, opacity: 0.55 }),
            React.createElement('path', { d: band(b, ba), fill: col3a, opacity: 0.6 }),
            React.createElement('path', { d: band(ba, tot), fill: col3b, opacity: 0.5 }),
            // Pensionsphase dimmen (Kapital wird gehalten, wächst nicht weiter)
            React.createElement('rect', { x: xret, y: y0, width: Math.max(0, x1 - xret), height: yB - y0, fill: palette.surface, opacity: 0.4 }),
            // y-Gitter + Ticks (CHF)
            ...yticks.map((v, i) => React.createElement('g', { key: 'y' + i },
              React.createElement('line', { x1: x0, y1: yV(v), x2: x1, y2: yV(v), stroke: palette.border, strokeWidth: 0.5, opacity: 0.6 }),
              React.createElement('text', { x: x0 - 6, y: yV(v) + 3, fill: palette.mid, fontSize: 9, fontFamily: 'inherit', textAnchor: 'end' }, v >= 1000 ? Math.round(v / 1000) + 'k' : Math.round(v)))),
            // Achsen
            React.createElement('line', { x1: x0, y1: yB, x2: x1, y2: yB, stroke: palette.mid, strokeWidth: 1 }),
            React.createElement('line', { x1: x0, y1: y0, x2: x0, y2: yB, stroke: palette.mid, strokeWidth: 1 }),
            // x-Ticks (Alter)
            ...xticks.map((a, i) => React.createElement('g', { key: 'x' + i },
              React.createElement('line', { x1: xA(a), y1: yB, x2: xA(a), y2: yB + 4, stroke: palette.mid, strokeWidth: 1 }),
              React.createElement('text', { x: xA(a), y: yB + 16, fill: palette.mid, fontSize: 9, fontFamily: 'inherit', textAnchor: 'middle' }, String(a)))),
            // Achsentitel (Bedeutung!)
            React.createElement('text', { x: x0 - 44, y: y0 - 10, fill: palette.text, fontSize: 11, fontWeight: weight.semi, fontFamily: 'inherit' }, 'CHF'),
            React.createElement('text', { x: x1, y: yB + 30, fill: palette.text, fontSize: 11, fontWeight: weight.semi, fontFamily: 'inherit', textAnchor: 'end' }, t('vr.achseAlter') + ' →'),
            // Lebensphasen-Beschriftung
            React.createElement('text', { x: (x0 + xret) / 2, y: yB + 30, fill: palette.mid, fontSize: 10, fontFamily: 'inherit', textAnchor: 'middle' }, t('vr.phaseErwerb')),
            React.createElement('text', { x: (xret + x1) / 2, y: yB + 30, fill: palette.mid, fontSize: 10, fontFamily: 'inherit', textAnchor: 'middle' }, t('vr.phasePension')),
            // Rücktritts-Linie + Marke
            React.createElement('line', { x1: xret, y1: y0 - 4, x2: xret, y2: yB, stroke: palette.text, strokeWidth: 1.5 }),
            React.createElement('text', { x: Math.min(x1 - 40, Math.max(x0 + 40, xret)), y: y0 - 10, fill: palette.text, fontSize: 11, fontWeight: weight.bold, fontFamily: 'inherit', textAnchor: 'middle' }, t('vr.bezugAlter') + ' ' + ret),
            // Interaktions-Overlay: Klick + Ziehen
            React.createElement('rect', { x: x0, y: y0 - 10, width: x1 - x0, height: yB - y0 + 10, fill: 'transparent', style: { cursor: 'ew-resize' },
              onPointerDown: (e) => { if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId); setRet(ageFromEvent(e)); },
              onPointerMove: (e) => { if (e.buttons & 1) setRet(ageFromEvent(e)); } }),
            // Ziehbarer Handle mit Tastatur + Fokus (barrierefrei)
            React.createElement('circle', { cx: xret, cy: y0 - 4, r: 8, fill: palette.text, stroke: palette.surface, strokeWidth: 2,
              tabIndex: 0, role: 'slider', 'aria-label': t('vr.bezugAlter'), 'aria-valuemin': retMin, 'aria-valuemax': retMax, 'aria-valuenow': ret, 'aria-valuetext': t('vr.bezugAlter') + ' ' + ret, style: { cursor: 'ew-resize', outline: 'none' },
              onKeyDown: (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setRet(ret - 1); }
                else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setRet(ret + 1); }
                else if (e.key === 'Home') { e.preventDefault(); setRet(retMin); }
                else if (e.key === 'End') { e.preventDefault(); setRet(retMax); }
              } })
          ),
          React.createElement('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginBottom: space.xs + 'px' } },
            legendItem(colBvg, 'BVG'), legendItem(col3a, '3a'), legendItem(col3b, '3b')),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.sage, marginBottom: space.xs + 'px' } }, t('vr.zukunftGraphHinweis')),
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
