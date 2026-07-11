import React, { useState, useMemo } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { EmptyState } from './components/EmptyState.jsx';
import { berechneAltersrente, vergleicheVorbezugAufschub, berechneBVGGuthaben, bvgKoordinationsabzug, projiziereVorsorge, berechneIKAuszug, vorbelegeIKAuszug, IK_TYP, AHV_PARAMS, BVG_PARAMS, SAEULE3A_ZINSSCHWELLE } from './data/ahvRechner.js';
import { Icon, Icons } from './IconSystem.jsx';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { text, weight, space, radius, ease } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { TwoRingsIcon } from './components/TwoRingsIcon.jsx';
import { berechneKapitalbezug, kapitalsteuerBandbreite, vergleicheStaffelung, alleKapitalKantone } from './data/kapitalbezugSteuer.js';

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

export const VorsorgeRechner = ({ palette, t, data, onNavigate, onUpdateData }) => {
  const birthYear = parseYear(data.basis?.dateOfBirth);
  const alter = currentAge(data.basis?.dateOfBirth);

  const [einkommen, setEinkommen] = useState(data.finanzen?.monthlyIncome ? String(Math.round(Number(data.finanzen.monthlyIncome) * 12)) : '');
  const [beitragsjahre, setBeitragsjahre] = useState('');
  const [erziehungsjahre, setErziehungsjahre] = useState('');
  const [betreuungsjahre, setBetreuungsjahre] = useState('');
  const [bezugAlter, setBezugAlter] = useState('65');
  const [ruecktrittDragging, setRuecktrittDragging] = useState(false);  // Zukunft-Graph: Handle wird gerade gezogen → Live-Tooltip
  const [verheiratet, setVerheiratet] = useState(data.basis?.maritalStatus === 'married');
  const [einkommenPartner, setEinkommenPartner] = useState(data.basis?.household?.partnerIncome ? String(Math.round(Number(data.basis.household.partnerIncome) * 12)) : '');
  const [bvgGuthaben, setBvgGuthaben] = useState('');
  // Umwandlungssatz der eigenen Pensionskasse (leer = BVG-Mindestsatz 6,8 %).
  const [bvgUmwandlung, setBvgUmwandlung] = useState('');
  const [rendite, setRendite] = useState('1.5');
  const [saeule3bInput, setSaeule3bInput] = useState(data.finanzen?.pension3bBalance ? String(Math.round(Number(data.finanzen.pension3bBalance))) : '');
  const [saeule3aAnnualInput, setSaeule3aAnnualInput] = useState(data.finanzen?.pension3a ? String(Math.round(Number(data.finanzen.pension3a))) : '');
  const [activeTab, setActiveTab] = useState('ahv');
  // Kapitalbezugssteuer (Zukunft-Tab): Kanton aus den Basis-Daten vorbelegt, Anzahl
  // gestaffelter Bezugsjahre für den Progressions-Vergleich.
  const [kbKanton, setKbKanton] = useState(data.basis?.canton || '');
  const [kbTranchen, setKbTranchen] = useState('3');

  // IK-Auszug (Beitragshistorie nachstellen): wird — anders als die übrigen Rechner-
  // Felder — in data.vorsorge.ikAuszug persistiert (die nachgestellte Historie ist
  // Aufwand, den man nicht verlieren will). Opt-in: erst wenn „verwenden" aktiv ist,
  // ersetzt die echte Historie die Annahme in der AHV-Berechnung.
  const [ikEntries, setIkEntries] = useState(() => (Array.isArray(data.vorsorge?.ikAuszug) ? data.vorsorge.ikAuszug : []));
  const [ikActive, setIkActive] = useState(() => !!data.vorsorge?.ikActive);
  const [ikJugend, setIkJugend] = useState(() => (Array.isArray(data.vorsorge?.ikAuszug) ? data.vorsorge.ikAuszug.some(e => e.typ === IK_TYP.JUGEND) : false));
  const [ikExpanded, setIkExpanded] = useState(null); // von-Jahr der aufgeklappten Phase
  const [zukunftIkOpen, setZukunftIkOpen] = useState(false); // IK-Editor im Zukunft-Reiter (gleiche Wahrheit, kein Doppel-Eintrag)

  // IK-Auszug + Opt-in persistieren (Standard-Datenpfad; respektiert Sandbox/demoMode).
  // Erster Render überspringt das Schreiben, damit ein leerer Rechner keinen
  // vorsorge-Block anlegt.
  const ikDidMount = React.useRef(false);
  React.useEffect(() => {
    if (!onUpdateData) return;
    if (!ikDidMount.current) { ikDidMount.current = true; return; }
    onUpdateData('vorsorge', 'ikAuszug', ikEntries);
    onUpdateData('vorsorge', 'ikActive', ikActive);
  }, [ikEntries, ikActive]);

  const saeule3aBalance = Number(data.finanzen?.pension3aBalance) || 0;
  const saeule3aAnnual = Number(saeule3aAnnualInput) || 0;
  const parsedEinkommen = Number(einkommen) || 0;
  const parsedBeitragsjahre = Number(beitragsjahre) || (alter && alter > 20 ? Math.min(alter - 20, 44) : 44);
  const parsedBezugAlter = Number(bezugAlter) || 65;
  // Statistische Lebenserwartung ab 65 (BFS, gerundet): Frauen ~88, Männer ~85,
  // sonst ~86. Vorbelegt aus dem hinterlegten Geschlecht, jederzeit anpassbar.
  // Bestimmt, über wie viele Jahre AHV/BVG-Rente und 3a/3b-Kapital gerechnet werden.
  const LE_DEFAULT = { female: 88, male: 85, diverse: 86 };
  const [lebenserwartung, setLebenserwartung] = useState(() => String(LE_DEFAULT[data.basis?.gender] || 86));
  const parsedLE = Math.max(70, Math.min(105, Number(lebenserwartung) || 86));

  // Aus dem nachgestellten IK-Auszug abgeleitete Kennzahlen (nur wenn aktiv + Einträge).
  const ikResult = useMemo(
    () => (ikActive && ikEntries.length ? berechneIKAuszug(ikEntries) : null),
    [ikActive, ikEntries]
  );

  const ahvResult = useMemo(() => {
    // Bei aktivem IK-Auszug ersetzt die echte Historie die Annahme (Einkommen/Beitragsjahre/Erziehung).
    const eink = ikResult ? ikResult.durchschnittlichesJahreseinkommen : parsedEinkommen;
    const bj = ikResult ? ikResult.beitragsjahre : parsedBeitragsjahre;
    const erz = ikResult ? ikResult.erziehungsjahre : (Number(erziehungsjahre) || 0);
    const betr = ikResult ? ikResult.betreuungsjahre : (Number(betreuungsjahre) || 0);
    if (eink <= 0) return null;
    return berechneAltersrente({
      geburtsjahr: birthYear || 1970,
      durchschnittlichesJahreseinkommen: eink,
      beitragsjahre: bj,
      erziehungsjahre: erz,
      betreuungsjahre: betr,
      bezugAlter: parsedBezugAlter,
      verheiratet,
      einkommenPartner: Number(einkommenPartner) || 0,
    });
  }, [ikResult, parsedEinkommen, parsedBeitragsjahre, erziehungsjahre, betreuungsjahre, parsedBezugAlter, verheiratet, einkommenPartner, birthYear]);

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
      umwandlungssatz: Number(bvgUmwandlung) || undefined,
    });
  }, [parsedEinkommen, alter, bvgGuthaben, parsedBezugAlter, bvgUmwandlung]);

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
      betreuungsjahre: Number(betreuungsjahre) || 0,
      bezugAlter: parsedBezugAlter,
      verheiratet,
      einkommenPartner: Number(einkommenPartner) || 0,
    });
  }, [parsedEinkommen, beitragsjahre, parsedBezugAlter, erziehungsjahre, betreuungsjahre, verheiratet, einkommenPartner, birthYear]);

  // Kapitalbezugssteuer auf das voraussichtliche Vorsorgekapital (BVG+3a+3b) bei
  // Rücktritt — falls als Kapital statt Rente bezogen. Bund exakt (Art. 38 DBG),
  // Kanton als Orientierung, plus Staffelungs-Vergleich (Progression).
  const kapitalbezug = useMemo(() => {
    const kapital = Math.round(projektion?.endsumme?.total || 0);
    if (kapital <= 0) return null;
    const kuerzel = kbKanton || null;
    return {
      kapital,
      einzel: berechneKapitalbezug({ betrag: kapital, kuerzel, verheiratet }),
      bandbreite: kuerzel ? null : kapitalsteuerBandbreite(kapital),
      staffel: vergleicheStaffelung({ betrag: kapital, tranchen: Number(kbTranchen) || 3, kuerzel, verheiratet }),
    };
  }, [projektion, kbKanton, kbTranchen, verheiratet]);

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    section: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.md + 'px', fontSize: text.sm },
    label: { fontWeight: weight.semi, marginBottom: space.xs + 'px', fontSize: text.sm },
    sublabel: { color: palette.mid, fontSize: text.xs, marginTop: '2px' },
    input: { width: '140px', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none' },
    row: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginBottom: space.sm + 'px', alignItems: 'flex-end' },
    highlight: { padding: space.md + 'px', background: palette.sage + '22', borderRadius: radius.sm + 'px', border: '1px solid ' + palette.sage, marginBottom: space.md + 'px' },
    big: { fontSize: text.xl, fontWeight: weight.bold, color: palette.sageDeep },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: text.sm },
    th: { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid ' + palette.border, color: palette.mid, fontWeight: weight.medium },
    td: { padding: '6px 8px', borderBottom: '1px solid ' + palette.border },
    tdActive: { padding: '6px 8px', borderBottom: '1px solid ' + palette.border, fontWeight: weight.semi, color: palette.sageDeep },
    // Reiter wie im ChapterView: sticky + einzeilig horizontal scrollbar (Jakob's Law —
    // gleiches Verhalten wie in den Finanzen-Kapiteln). top:-24px gleicht das padding-top
    // des Scroll-Containers aus, damit die Leiste bündig unter dem „100% lokal"-Streifen klebt.
    // Sticky Wrapper hält die Leiste oben; das Scrollen passiert im inneren tabRow,
    // die rechte Verlauf-Kante (tabFade) signalisiert auf Mobil „hier geht's weiter →".
    tabWrap: { position: 'sticky', top: '-24px', zIndex: 5, marginBottom: space.md + 'px', background: palette.surface, borderBottom: '1px solid ' + palette.border + '55' },
    tabRow: { display: 'flex', flexWrap: 'nowrap', gap: space.xs + 'px', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', padding: space.sm + 'px 0' },
    tabFade: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '28px', pointerEvents: 'none', background: 'linear-gradient(to right, ' + palette.surface + '00, ' + palette.surface + ')' },
    tab: (active) => ({ flexShrink: 0, whiteSpace: 'nowrap', padding: '8px 16px', fontSize: text.sm, fontWeight: active ? weight.semi : weight.normal, border: '1px solid ' + (active ? palette.sage : palette.border), borderRadius: radius.sm + 'px', background: active ? palette.sage + '22' : palette.surface, color: active ? palette.sage : palette.text, cursor: 'pointer', fontFamily: 'inherit' }),
    source: { marginTop: space.md + 'px', fontSize: text.xs, color: palette.skyDeep },
    checkbox: { display: 'flex', alignItems: 'center', gap: space.xs + 'px', cursor: 'pointer' },
    intlDetails: { marginTop: space.md + 'px', background: palette.up, border: '1px solid ' + palette.border + '88', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.md + 'px' },
    intlSummary: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, cursor: 'pointer' },
    intlIntro: { fontSize: text.xs, color: palette.mid, lineHeight: 1.6, margin: space.sm + 'px 0' },
    intlSit: { paddingTop: space.sm + 'px', marginTop: space.sm + 'px', borderTop: '1px solid ' + palette.border + '66' },
    intlSitTitle: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text },
    intlSitText: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, margin: '2px 0 4px' },
    intlLink: { fontSize: text.xs, color: palette.skyDeep, textDecoration: 'none' },
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

  // === IK-Auszug: Helfer + Render ===
  const ikTypLabel = (typ) => t('vr.ikTyp' + typ.charAt(0).toUpperCase() + typ.slice(1));
  const IK_TYP_WAHL = [IK_TYP.ERWERB, IK_TYP.ALV, IK_TYP.ERZIEHUNG, IK_TYP.BETREUUNG, IK_TYP.LUECKE, IK_TYP.JUGEND];

  // Aufeinanderfolgende Jahre gleichen Typs zu Lebensphasen-Blöcken bündeln.
  const groupPhases = (entries) => {
    const sorted = [...entries].sort((a, b) => a.jahr - b.jahr);
    const phases = [];
    for (const e of sorted) {
      const last = phases[phases.length - 1];
      if (last && last.typ === e.typ && e.jahr === last.bis + 1) { last.bis = e.jahr; last.jahre.push(e); }
      else phases.push({ typ: e.typ, von: e.jahr, bis: e.jahr, jahre: [e] });
    }
    return phases;
  };

  const updateYear = (jahr, patch) => setIkEntries(prev => prev.map(e => e.jahr === jahr ? { ...e, ...patch } : e));

  const prefillIK = () => setIkEntries(vorbelegeIKAuszug({
    geburtsjahr: birthYear, aktuellesAlter: alter, aktuellesEinkommen: parsedEinkommen, mitJugendjahren: ikJugend,
  }));

  const toggleJugend = () => {
    const next = !ikJugend;
    setIkJugend(next);
    if (!birthYear) return;
    const hasJugend = ikEntries.some(e => e.typ === IK_TYP.JUGEND);
    if (next && !hasJugend) {
      const j = [];
      for (let a = 17; a < 21; a++) j.push({ jahr: birthYear + a, alter: a, einkommen: parsedEinkommen, typ: IK_TYP.JUGEND });
      setIkEntries([...j, ...ikEntries]);
    } else if (!next && hasJugend) {
      setIkEntries(ikEntries.filter(e => e.typ !== IK_TYP.JUGEND));
    }
  };

  const resetIK = () => { setIkEntries([]); setIkActive(false); setIkExpanded(null); };

  const renderIKAuszug = () => {
    const phases = groupPhases(ikEntries);
    const r = ikEntries.length ? berechneIKAuszug(ikEntries) : null;
    return React.createElement('details', { style: s.intlDetails, open: ikEntries.length > 0 },
      React.createElement('summary', { style: s.intlSummary }, t('vr.ikTitle')),
      React.createElement('p', { style: s.intlIntro }, t('vr.ikIntro')),

      // Empty-State (dritter Konsistenz-Baustein): ruhiger Titel + Anleitung + eine Handlung
      ikEntries.length === 0 && React.createElement(EmptyState, {
        palette,
        title: t('vr.ikEmptyTitle'),
        description: t('vr.ikEmpty'),
        style: { marginTop: space.sm + 'px' },
        action: React.createElement(React.Fragment, null,
          React.createElement('button', { style: s.tab(false), onClick: prefillIK, disabled: !birthYear }, t('vr.ikPrefill')),
          !birthYear && React.createElement('div', { style: { ...s.sublabel, color: palette.goldDeep, marginTop: space.xs + 'px' } }, t('vr.geburtsdatumFehlt'))
        ),
      }),

      // Gefüllt: Jugend-Schalter + Phasen-Blöcke + Live-Auswertung
      ikEntries.length > 0 && React.createElement(React.Fragment, null,
        React.createElement('label', { style: { ...s.checkbox, marginBottom: space.sm + 'px' } },
          React.createElement('input', { type: 'checkbox', checked: ikJugend, onChange: toggleJugend }),
          React.createElement('span', null, t('vr.ikJugend'))
        ),

        ...phases.map(ph => {
          const isOpen = ikExpanded === ph.von;
          const count = ph.jahre.length;
          const avg = Math.round(ph.jahre.reduce((sum, e) => sum + (Number(e.einkommen) || 0), 0) / count);
          const meta = ph.von + (ph.bis > ph.von ? '–' + ph.bis : '') + ' · ' + count + ' ' + t('vr.jahre') + (ph.typ !== IK_TYP.LUECKE ? ' · Ø ' + fmt(avg) : '');
          return React.createElement('div', { key: ph.typ + ph.von, style: { border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', marginBottom: space.xs + 'px', overflow: 'hidden' } },
            React.createElement('button', {
              onClick: () => setIkExpanded(isOpen ? null : ph.von),
              style: { width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px', alignItems: 'center', padding: space.sm + 'px ' + space.md + 'px', background: palette.up, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.text }
            },
              React.createElement('span', null, (isOpen ? '▾ ' : '▸ ') + ikTypLabel(ph.typ)),
              React.createElement('span', { style: { color: palette.mid, fontSize: text.xs, textAlign: 'right' } }, meta)
            ),
            isOpen && React.createElement('div', { style: { padding: space.sm + 'px ' + space.md + 'px' } },
              ...ph.jahre.map(e => React.createElement('div', { key: e.jahr, style: { display: 'flex', gap: space.sm + 'px', alignItems: 'center', marginBottom: space.xs + 'px', flexWrap: 'wrap' } },
                React.createElement('span', { style: { width: '78px', fontSize: text.xs, color: palette.mid } }, e.jahr + (e.alter ? ' (' + e.alter + ')' : '')),
                React.createElement('input', {
                  type: 'number', inputMode: 'decimal', value: e.einkommen, 'aria-label': t('vr.ikIncome') + ' ' + e.jahr,
                  onChange: ev => updateYear(e.jahr, { einkommen: Number(ev.target.value) || 0 }),
                  disabled: e.typ === IK_TYP.LUECKE,
                  style: { ...s.input, width: '104px', padding: '4px 8px', fontSize: text.sm, opacity: e.typ === IK_TYP.LUECKE ? 0.5 : 1 }
                }),
                React.createElement('select', {
                  value: e.typ, 'aria-label': t('vr.ikYear') + ' ' + e.jahr,
                  onChange: ev => updateYear(e.jahr, { typ: ev.target.value }),
                  style: { ...s.input, width: 'auto', padding: '4px 8px', fontSize: text.sm }
                }, ...IK_TYP_WAHL.map(ty => React.createElement('option', { key: ty, value: ty }, ikTypLabel(ty))))
              ))
            )
          );
        }),
        React.createElement('div', { style: { ...s.sublabel, marginTop: space.xs + 'px' } }, t('vr.ikEditHint')),

        // Live-Auswertung (Success-Feedback)
        r && React.createElement('div', { 'aria-live': 'polite', style: { ...s.section, marginTop: space.sm + 'px', background: palette.sage + '11', border: '1px solid ' + palette.sage + '33' } },
          React.createElement('div', { style: s.label }, t('vr.ikSummary')),
          React.createElement('div', null, t('vr.ikBeitragsjahre') + ': ' + r.beitragsjahre + '/' + AHV_PARAMS.volleBeitragsjahre),
          React.createElement('div', null, t('vr.ikDurchschnitt') + ': CHF ' + fmt(r.durchschnittlichesJahreseinkommen)),
          r.jugendjahreGenutzt > 0 && React.createElement('div', { style: { color: palette.sage } }, t('vr.ikJugendGenutzt') + ': ' + r.jugendjahreGenutzt),
          r.luecken > 0 && React.createElement('div', { style: { color: palette.goldDeep } }, t('vr.ikLuecken') + ': ' + r.luecken),
          r.alvJahre > 0 && React.createElement('div', { style: { color: palette.mid, fontSize: text.xs, marginTop: space.xs + 'px', lineHeight: 1.5 } }, t('vr.ikAlvHinweis', { n: r.alvJahre }))
        ),

        // Opt-in: Historie für die Berechnung verwenden
        React.createElement('label', { style: { ...s.checkbox, marginTop: space.sm + 'px', fontWeight: weight.semi } },
          React.createElement('input', { type: 'checkbox', checked: ikActive, onChange: () => setIkActive(!ikActive) }),
          React.createElement('span', null, t('vr.ikUse'))
        ),
        React.createElement('button', {
          onClick: resetIK,
          style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: space.sm + 'px', display: 'block', fontSize: text.xs, color: palette.mid, textDecoration: 'underline', fontFamily: 'inherit' }
        }, t('vr.ikReset')),
        React.createElement('div', { style: { ...s.sublabel, marginTop: space.sm + 'px', lineHeight: 1.5 } }, t('vr.ikDisclaimer'))
      )
    );
  };

  // Reiter als Daten — für ARIA-Tabs-Muster (tablist/tab/tabpanel) + Pfeiltasten-Navigation.
  const TABS = [
    { key: 'ahv', label: t('vr.tabAhv') },
    { key: 'bvg', label: t('vr.tabBvg') },
    { key: 'vergleich', label: t('vr.tabVergleich') },
    { key: 'zukunft', label: t('vr.tabZukunft') },
    { key: 'fz', label: t('vr.tabFreizuegigkeit') },
  ];
  // Pfeiltasten/Home/End bewegen die Auswahl UND den Fokus (WAI-ARIA „roving tabindex").
  const onTabKey = (e, idx) => {
    const targets = { ArrowRight: idx + 1, ArrowLeft: idx - 1, Home: 0, End: TABS.length - 1 };
    if (!(e.key in targets)) return;
    e.preventDefault();
    const next = (targets[e.key] + TABS.length) % TABS.length;
    setActiveTab(TABS[next].key);
    const el = document.getElementById('vrtab-' + TABS[next].key);
    if (el) el.focus();
  };

  return React.createElement('div', { style: s.card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'vorsorge', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('vr.title')),

    // Tab row (sticky Wrapper + scrollender Inhalt + rechte Verlauf-Kante)
    React.createElement('div', { style: s.tabWrap },
      React.createElement('div', { style: s.tabRow, role: 'tablist', 'aria-label': t('vr.title') },
        TABS.map((tab, i) => {
          const active = activeTab === tab.key;
          return React.createElement('button', {
            key: tab.key,
            id: 'vrtab-' + tab.key,
            role: 'tab',
            'aria-selected': active,
            'aria-controls': 'vr-tabpanel',
            tabIndex: active ? 0 : -1,
            onClick: (e) => { setActiveTab(tab.key); e.currentTarget.scrollIntoView({ inline: 'nearest', block: 'nearest' }); },
            onKeyDown: (e) => onTabKey(e, i),
            style: s.tab(active),
          }, tab.label);
        })
      ),
      React.createElement('div', { style: s.tabFade })
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
        field(t('vr.betreuungsjahre'), betreuungsjahre, setBetreuungsjahre, { placeholder: '0', width: '80px', sublabel: t('vr.betreuungsjahreHint') }),
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

    // Reiter-Inhalt als ein tabpanel (relabelt sich nach aktivem Reiter) — die
    // geteilten Elemente darunter (Amtslinks/Quelle/Nav) bleiben bewusst aussen.
    React.createElement('div', { role: 'tabpanel', id: 'vr-tabpanel', 'aria-labelledby': 'vrtab-' + activeTab, tabIndex: 0 },

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
        React.createElement('div', null, t('vr.skalenfaktor') + ': ' + (ahvResult.skalenfaktor * 100).toFixed(1) + '% (' + ahvResult.beitragsjahre + '/' + AHV_PARAMS.volleBeitragsjahre + ' ' + t('vr.jahre') + ')',
          ikResult && React.createElement('span', { style: { marginLeft: space.xs + 'px', fontSize: text.xs, color: palette.sageDeep, fontWeight: weight.semi } }, '· ' + t('vr.ikFromIk'))
        ),
        ahvResult.fehlendeBeitragsjahre > 0 && React.createElement('div', { style: { color: palette.goldDeep } },
          t('vr.fehlendeBeitragsjahre') + ': ' + ahvResult.fehlendeBeitragsjahre
        ),
        ahvResult.vorbezugAufschub !== 0 && React.createElement('div', null,
          (ahvResult.vorbezugAufschub > 0 ? t('vr.aufschub') : t('vr.vorbezug')) + ': ' + Math.abs(ahvResult.vorbezugAufschub).toFixed(1) + '%'
        ),
        ahvResult.erziehungsgutschrift > 0 && React.createElement('div', null,
          t('vr.erziehungsgutschrift') + ': CHF ' + fmt(ahvResult.erziehungsgutschrift) + ' / ' + t('vr.jahr')
        ),
        ahvResult.erziehungsjahre > 0 && ahvResult.betreuungsjahre > 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: 1.5 } },
          t('vr.gutschriftHinweis')
        ),
        ahvResult.plafoniert && React.createElement('div', { style: { color: palette.goldDeep } },
          t('vr.plafoniert') + ': CHF ' + fmt(ahvResult.totalEhepaar) + ' / ' + t('vr.monat') + ' (' + t('vr.ehepaar') + ')'
        ),
        React.createElement('div', { style: { marginTop: space.sm + 'px', color: palette.mid, fontSize: text.xs } },
          t('vr.minMax') + ': CHF ' + fmt(AHV_PARAMS.minRente) + ' – ' + fmt(AHV_PARAMS.maxRente) + ' / ' + t('vr.monat')
        )
      )
    ),

    // IK-Auszug nachstellen (echte Beitragshistorie statt Annahme) — immer im AHV-Tab
    activeTab === 'ahv' && renderIKAuszug(),

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
      React.createElement('div', { style: { ...s.section, display: 'flex', gap: space.md, flexWrap: 'wrap' } },
        field(t('vr.bvgGuthaben'), bvgGuthaben, setBvgGuthaben, { placeholder: '0', sublabel: t('vr.bvgGuthabenHint') }),
        field(t('vr.umwandlungssatzEigen'), bvgUmwandlung, setBvgUmwandlung, { placeholder: '6.8', sublabel: t('vr.umwandlungssatzHint'), width: '110px', min: 1, max: 10 })
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
          React.createElement('div', null, t('vr.umwandlungssatz') + ': ' + bvgResult.umwandlungssatz + '% ' +
            ((Number(bvgUmwandlung) >= 1 && Number(bvgUmwandlung) <= 10) ? t('vr.umwandlungssatzEigenMarker') : t('vr.umwandlungssatzMindest'))),
          React.createElement('div', null, t('vr.mindestzins') + ': ' + bvgResult.zinssatz + '%')
        )
      ),
      bvgResult && !bvgResult.versichert && React.createElement('div', { style: { ...s.section, color: palette.goldDeep } },
        t('vr.bvgNichtVersichert') + ' (< CHF ' + fmt(BVG_PARAMS.eintrittsschwelle) + ')'
      ),
      !alter && React.createElement('div', { style: { ...s.section, color: palette.mid } }, t('vr.geburtsdatumFehlt'))
    ),

    // Zukunft Tab — Projektion 2./3. Säule bis zum Rücktritt
    activeTab === 'zukunft' && React.createElement(React.Fragment, null,
      React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.md + 'px' } }, t('vr.zukunftIntro')),

      // AHV-Grundlage: die IK-Historie auch hier (Prinzip „nie zurück-navigieren müssen").
      // Ehrliche Kontext-Zeile + glanceable Kennzahl, aufklappbar der ECHTE Editor
      // (renderIKAuszug, gleicher State = eine Wahrheit, kein Doppel-Eintrag) + Sprung.
      React.createElement('div', { style: { ...s.section, marginBottom: space.md + 'px' } },
        React.createElement('div', { style: s.label }, t('vr.zukunftIkTitle')),
        (ikActive && ikResult)
          ? React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: space.xs + 'px', flexWrap: 'wrap' } },
              React.createElement('span', { style: { color: palette.sage } }, '●'),
              React.createElement('span', { style: { fontSize: text.sm, color: palette.text, lineHeight: 1.5 } },
                t('vr.zukunftIkAktiv', { jahre: ikResult.beitragsjahre, eink: fmt(ikResult.durchschnittlichesJahreseinkommen) }))
            )
          : React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.5 } }, t('vr.zukunftIkInaktiv')),
        React.createElement('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginTop: space.sm + 'px' } },
          React.createElement('button', {
            onClick: () => setZukunftIkOpen(o => !o),
            style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sageDeep, textDecoration: 'underline', fontFamily: 'inherit' }
          }, zukunftIkOpen ? t('vr.zukunftIkHide') : t('vr.zukunftIkEdit')),
          React.createElement('button', {
            onClick: () => setActiveTab('ahv'),
            style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.mid, textDecoration: 'underline', fontFamily: 'inherit' }
          }, t('vr.zukunftIkJump'))
        ),
        zukunftIkOpen && React.createElement('div', { style: { marginTop: space.sm + 'px' } }, renderIKAuszug())
      ),

      React.createElement('div', { style: s.section },
        React.createElement('div', { style: s.row },
          field(t('vr.rendite'), rendite, setRendite, { width: '90px', min: 0, max: 10, sublabel: t('vr.renditeHint') }),
          field(t('vr.s3aAnnual'), saeule3aAnnualInput, setSaeule3aAnnualInput, { placeholder: '0', sublabel: t('vr.s3aAnnualHint') }),
          field(t('vr.s3bGuthaben'), saeule3bInput, setSaeule3bInput, { placeholder: '0' }),
          field(t('vr.lebenserwartung'), lebenserwartung, setLebenserwartung, { width: '90px', min: 66, max: 105, sublabel: t('vr.lebenserwartungHint') })
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
        // Bedeutungs-Alter mit leichtem Magneten: 63 (früheste AHV), 64, 65 (Referenz),
        // 70 (spätester Aufschub). Beim Ziehen „rasten" sie sanft ein (Fangradius 0.6 J),
        // ohne die freien Zwischenalter zu blockieren. Ganzzahl bleibt der Normalfall.
        const SNAP_AGES = [63, 64, 65, 70].filter((a) => a >= retMin && a <= retMax);
        const snap = (a) => { const near = SNAP_AGES.find((s) => Math.abs(a - s) <= 0.6); return near != null ? near : Math.round(a); };
        const setRet = (a) => setBezugAlter(String(Math.max(retMin, Math.min(retMax, snap(a)))));
        // Kapital pro Alter: bis Rücktritt aus der Engine, danach flach (Pension, kein Drawdown).
        const val = (a) => (a <= ret ? (tl[a - START] || tl[tl.length - 1]) : end);
        const ages = [];
        for (let a = START; a <= AXIS_END; a++) ages.push(a);
        // AHV als kapitalisierte Fundament-Fläche (Barwert der lebenslangen Rente:
        // Monatsrente × Monate bis Alter 85). Wächst von heutiger Anwartschaft zur
        // projizierten bei Rücktritt, dann flach — die 1. Säule als sichtbares Fundament.
        const ahvHorizonM = Math.max(12, (parsedLE - ret) * 12);
        const ahvCapRet = (projektionAhv ? projektionAhv.monatsrente : 0) * ahvHorizonM;
        const ahvCapNow = (ahvResult ? ahvResult.monatsrente : 0) * ahvHorizonM;
        const ahvAt = (a) => a <= START ? ahvCapNow : (a >= ret ? ahvCapRet : ahvCapNow + (ahvCapRet - ahvCapNow) * (a - START) / Math.max(1, ret - START));
        // Stabile y-Skala (rundet auf, damit sie beim Ziehen nicht zappelt).
        const rawMax = (end.total + ahvCapRet) * 1.1;
        const step = rawMax > 400000 ? 100000 : 50000;
        const maxY = Math.max(step, Math.ceil(rawMax / step) * step);
        const VBW = 680, VBH = 340, x0 = 54, x1 = 628, y0 = 26, yB = 280;
        const xA = (a) => x0 + (a - START) / (AXIS_END - START) * (x1 - x0);
        const yV = (v) => yB - v / maxY * (yB - y0);
        // Flächen als kumulierte Höhen pro Alter (AHV zuunterst als Fundament).
        const band = (lo, hi) => {
          let d = 'M ' + xA(START).toFixed(1) + ' ' + yV(hi(START)).toFixed(1);
          for (let k = 1; k < ages.length; k++) d += ' L ' + xA(ages[k]).toFixed(1) + ' ' + yV(hi(ages[k])).toFixed(1);
          for (let k = ages.length - 1; k >= 0; k--) d += ' L ' + xA(ages[k]).toFixed(1) + ' ' + yV(lo(ages[k])).toFixed(1);
          return d + ' Z';
        };
        const zero = () => 0;
        const lAhv = (a) => ahvAt(a);
        const lBvg = (a) => ahvAt(a) + val(a).bvg;
        const l3a = (a) => ahvAt(a) + val(a).bvg + val(a).s3a;
        const l3b = (a) => ahvAt(a) + val(a).bvg + val(a).s3a + val(a).s3b;
        // Vier klar unterscheidbare Säulen-Farben. Im Farbenblind-Modus greift eine
        // Okabe-Ito-Palette (Grau/Blau/Orange/Türkis) — sonst kollidierten hier drei
        // bläulich-graue Töne (AHV soft, BVG sky, 3b sage→blau).
        const cbChart = palette.colorBlind;
        const colBvg = cbChart ? '#2E7DB8' : palette.sky;
        const col3a  = cbChart ? '#E69F00' : palette.gold;
        const col3b  = cbChart ? '#0F9D8C' : palette.sage;
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
        // Monatliche Rente ab Rücktritt — macht alle vier Säulen VERGLEICHBAR:
        // AHV/BVG sind lebenslange Renten; 3a/3b sind Kapital, hier transparent auf
        // eine Monatsrente umgelegt (Kapital gleichmässig verteilt bis Alter 85).
        const drawdownMonate = Math.max(12, (parsedLE - ret) * 12);
        const ahvMonat = projektionAhv ? projektionAhv.monatsrente : 0;
        const bvgMonat = (bvgResult && bvgResult.versichert) ? bvgResult.monatsrente : 0;
        const s3aMonat = end.s3a > 0 ? end.s3a / drawdownMonate : 0;
        const s3bMonat = end.s3b > 0 ? end.s3b / drawdownMonate : 0;
        const colAhv = cbChart ? '#8A8D92' : palette.soft;  // AHV = ruhiger Granit-Ton (Fundament); CB: neutrales Grau, distinkt zu Blau/Orange/Türkis
        return React.createElement('div', null,
          React.createElement('div', { style: s.highlight },
            React.createElement('div', { style: s.label }, t('vr.zukunftEnde') + ' (' + end.alter + ')'),
            React.createElement('div', { style: s.big }, 'CHF ' + fmt(end.total)),
            React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
              'BVG ' + fmt(end.bvg) + ' · 3a ' + fmt(end.s3a) + ' · 3b ' + fmt(end.s3b))
          ),
          (() => {
            if (!ahvMonat && !bvgMonat && !s3aMonat && !s3bMonat) return null;
            const totMonat = ahvMonat + bvgMonat + s3aMonat + s3bMonat;
            const pctOf = (v) => totMonat > 0 ? (v / totMonat * 100) : 0;
            const seg = (col, v, label) => v > 0 ? React.createElement('div', {
              key: label, style: { width: pctOf(v).toFixed(1) + '%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 } },
              pctOf(v) >= 16 ? React.createElement('span', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.surface, whiteSpace: 'nowrap' } }, label) : null) : null;
            const legendDot = (col, label, amount) => amount > 0 ? React.createElement('span', { key: label, style: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: text.xs, color: palette.mid } },
              React.createElement('span', { style: { width: '9px', height: '9px', borderRadius: '2px', background: col, display: 'inline-block' } }),
              label + ' CHF ' + fmt(amount) + ' / ' + t('vr.monat')) : null;
            const kapitalRente = s3aMonat > 0 || s3bMonat > 0;
            return React.createElement('div', { style: { ...s.section, marginBottom: space.md + 'px' } },
              React.createElement('div', { style: s.label }, t('vr.zukunftRente')),
              React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text, marginBottom: space.sm + 'px' } },
                'CHF ' + fmt(totMonat) + ' / ' + t('vr.monat')),
              // Flat-Design-Balken: monatliche Rente, alle vier Säulen vergleichbar
              // AHV (Granit) + BVG (Himmel) + 3a (Gold) + 3b (Salbei)
              React.createElement('div', { style: { display: 'flex', height: '30px', borderRadius: radius.sm + 'px', overflow: 'hidden', background: palette.up } },
                seg(colAhv, ahvMonat, 'AHV'), seg(colBvg, bvgMonat, 'BVG'), seg(col3a, s3aMonat, '3a'), seg(col3b, s3bMonat, '3b')),
              React.createElement('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginTop: space.sm + 'px' } },
                legendDot(colAhv, 'AHV', ahvMonat), legendDot(colBvg, 'BVG', bvgMonat), legendDot(col3a, '3a', s3aMonat), legendDot(col3b, '3b', s3bMonat)),
              React.createElement('div', { style: { ...s.sublabel, marginTop: space.xs } }, t('vr.zukunftRenteAufteilung')),
              kapitalRente ? React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs, lineHeight: 1.5 } }, t('vr.zukunftRenteKapitalHinweis', { le: parsedLE })) : null,
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs, lineHeight: 1.5 } }, t('vr.zukunftRenteHinweis'))
            );
          })(),
          React.createElement('svg', { viewBox: '0 0 ' + VBW + ' ' + VBH, width: '100%', role: 'group', 'aria-label': t('vr.tabZukunft'), style: { display: 'block', marginBottom: space.sm + 'px', touchAction: 'none' } },
            // Lebensphasen-Hintergrund
            React.createElement('rect', { x: x0, y: y0, width: Math.max(0, xret - x0), height: yB - y0, fill: palette.sage, opacity: 0.05 }),
            React.createElement('rect', { x: xret, y: y0, width: Math.max(0, x1 - xret), height: yB - y0, fill: palette.sky, opacity: 0.05 }),
            // Flächen: AHV-Fundament (kapitalisiert) zuunterst, dann Kapital BVG/3a/3b
            React.createElement('path', { d: band(zero, lAhv), fill: colAhv, opacity: 0.5 }),
            React.createElement('path', { d: band(lAhv, lBvg), fill: colBvg, opacity: 0.55 }),
            React.createElement('path', { d: band(lBvg, l3a), fill: col3a, opacity: 0.6 }),
            React.createElement('path', { d: band(l3a, l3b), fill: col3b, opacity: 0.5 }),
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
            // Renten-Readout IN der Pensionsphase — macht die AHV im Graph sichtbar (Rente ≠ Kapital, darum Beschriftung statt Fläche)
            (ahvMonat + bvgMonat) > 0 && (x1 - xret) > 130 && React.createElement('g', { key: 'pensRente' },
              React.createElement('rect', { x: Math.min(x1 - 152, (xret + x1) / 2 - 74), y: y0 + 16, width: 148, height: 34, rx: 6, fill: palette.surface, stroke: palette.border, strokeWidth: 1 }),
              React.createElement('text', { x: Math.min(x1 - 78, (xret + x1) / 2), y: y0 + 29, fill: palette.mid, fontSize: 8.5, fontFamily: 'inherit', textAnchor: 'middle' }, t('vr.zukunftRente')),
              React.createElement('text', { x: Math.min(x1 - 78, (xret + x1) / 2), y: y0 + 43, fill: palette.text, fontSize: 11, fontWeight: weight.bold, fontFamily: 'inherit', textAnchor: 'middle' },
                // Nur die tatsächlich vorhandenen Säulen benennen (wie die Legende) —
                // sonst stünde „AHV 0", wenn kein Einkommen erfasst ist, aber BVG versichert.
                [ahvMonat > 0 ? 'AHV ' + fmt(ahvMonat) : null, bvgMonat > 0 ? 'BVG ' + fmt(bvgMonat) : null].filter(Boolean).join(' + '))),
            // Rücktritts-Linie + Marke
            React.createElement('line', { x1: xret, y1: y0 - 4, x2: xret, y2: yB, stroke: palette.text, strokeWidth: 1.5 }),
            React.createElement('text', { x: Math.min(x1 - 40, Math.max(x0 + 40, xret)), y: y0 - 10, fill: palette.text, fontSize: 11, fontWeight: weight.bold, fontFamily: 'inherit', textAnchor: 'middle' }, t('vr.bezugAlter') + ' ' + ret),
            // Snap-Marken an den Bedeutungs-Altern (63/64/65/70): kleine Kerben an der
            // Achse, damit die einrastenden Alter sichtbar sind. Das aktive Alter in Gold.
            ...SNAP_AGES.map((a) => React.createElement('g', { key: 'snap' + a },
              React.createElement('line', { x1: xA(a), y1: yB, x2: xA(a), y2: yB - 6, stroke: a === ret ? col3a : palette.mid, strokeWidth: a === ret ? 2 : 1, opacity: a === ret ? 1 : 0.55 }))),
            // Interaktions-Overlay: Klick + Ziehen
            React.createElement('rect', { x: x0, y: y0 - 10, width: x1 - x0, height: yB - y0 + 10, fill: 'transparent', style: { cursor: 'ew-resize' },
              onPointerDown: (e) => { setRuecktrittDragging(true); setRet(ageFromEvent(e)); try { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); } catch { /* Pointer-Capture optional */ } },
              onPointerMove: (e) => { if (e.buttons & 1) setRet(ageFromEvent(e)); },
              onPointerUp: () => setRuecktrittDragging(false),
              onPointerCancel: () => setRuecktrittDragging(false),
              onLostPointerCapture: () => setRuecktrittDragging(false) }),
            // Live-Tooltip beim Ziehen: Alter + resultierende Monatsrente sofort sichtbar
            // (Wunsch von Stebler Studios — „was bringt das" ohne loszulassen). Ruhig, folgt dem Handle.
            ruecktrittDragging && (() => {
              const totMonatChart = ahvMonat + bvgMonat + s3aMonat + s3bMonat;
              const hasRente = totMonatChart > 0;
              const tw = hasRente ? 122 : 66, th = hasRente ? 40 : 24;
              const tx = Math.min(x1 - tw / 2, Math.max(x0 + tw / 2, xret));
              return React.createElement('g', { key: 'dragTip', style: { pointerEvents: 'none' } },
                React.createElement('rect', { x: tx - tw / 2, y: y0 + 4, width: tw, height: th, rx: 6, fill: palette.text, opacity: 0.94 }),
                React.createElement('text', { x: tx, y: y0 + (hasRente ? 18 : 20), fill: palette.surface, fontSize: 12, fontWeight: weight.bold, fontFamily: 'inherit', textAnchor: 'middle' }, t('vr.bezugAlter') + ' ' + ret),
                hasRente ? React.createElement('text', { x: tx, y: y0 + 33, fill: palette.surface, fontSize: 11, fontFamily: 'inherit', textAnchor: 'middle', opacity: 0.9 }, 'CHF ' + fmt(totMonatChart) + ' / ' + t('vr.monat')) : null);
            })(),
            // Ziehbarer Handle mit Tastatur + Fokus (barrierefrei) — beim Ziehen grösser
            React.createElement('circle', { cx: xret, cy: y0 - 4, r: ruecktrittDragging ? 10 : 8, fill: palette.text, stroke: palette.surface, strokeWidth: 2,
              tabIndex: 0, role: 'slider', 'aria-label': t('vr.bezugAlter'), 'aria-valuemin': retMin, 'aria-valuemax': retMax, 'aria-valuenow': ret, 'aria-valuetext': t('vr.bezugAlter') + ' ' + ret, style: { cursor: 'ew-resize', outline: 'none', transition: 'r 120ms ' + ease },
              onKeyDown: (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setRet(ret - 1); }
                else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setRet(ret + 1); }
                else if (e.key === 'Home') { e.preventDefault(); setRet(retMin); }
                else if (e.key === 'End') { e.preventDefault(); setRet(retMax); }
              } })
          ),
          // Rücktritts-Szenario: übersetzt das gezogene Alter in Klartext und bleibt
          // dabei ehrlich zu den frühesten Bezugsaltern (AHV 63, BVG 58, 3a 60). Reine
          // Erklärung — die AHV-Monatsrente oben ist bereits auf frühestens 63 gedeckelt.
          (() => {
            const refAge = 65, ahvMin = 63;
            const delta = ret - refAge;
            const nAbs = Math.abs(delta);
            const dauer = nAbs + ' ' + t(nAbs === 1 ? 'vr.szenarioJahr' : 'vr.szenarioJahre');
            const pctVal = projektionAhv ? projektionAhv.vorbezugAufschub : 0;
            const pct = (pctVal > 0 ? '+' : '') + pctVal.toFixed(1) + '%';
            const ahvBezug = Math.max(ahvMin, Math.min(70, ret));
            const line = (txt, key) => React.createElement('div', { key, style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5, marginTop: '3px' } }, txt);
            const rows = [];
            if (delta < 0) {
              rows.push(line(t('vr.zukunftSzenarioFrueh', { dauer }), 'a'));
              rows.push(line(t('vr.zukunftSzenarioAhvFrueh', { alter: ahvBezug, pct }), 'b'));
              if (ret < ahvMin) rows.push(line(t('vr.zukunftSzenarioBridge', { von: ret }), 'c'));
              rows.push(line(t('vr.zukunftSzenarioSaeulen'), 'd'));
            } else if (delta > 0) {
              rows.push(line(t('vr.zukunftSzenarioAufschub', { dauer }), 'a'));
              rows.push(line(t('vr.zukunftSzenarioAhvAufschub', { alter: ahvBezug, pct }), 'b'));
              rows.push(line(t('vr.zukunftSzenarioWeiter'), 'c'));
            } else {
              rows.push(line(t('vr.zukunftSzenarioReferenz'), 'a'));
            }
            return React.createElement('div', { style: { ...s.section, marginBottom: space.md + 'px' } },
              React.createElement('div', { style: s.label }, t('vr.zukunftSzenarioTitle')),
              ...rows
            );
          })(),
          // Legende = alle vier Flächen: AHV (kapitalisiertes Fundament) + BVG/3a/3b.
          React.createElement('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginBottom: space.xs + 'px' } },
            legendItem(colAhv, 'AHV'), legendItem(colBvg, 'BVG'), legendItem(col3a, '3a'), legendItem(col3b, '3b')),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px', lineHeight: 1.5 } }, t('vr.zukunftAhvFlaeche', { le: parsedLE })),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.sageDeep, marginBottom: space.xs + 'px' } }, t('vr.zukunftGraphHinweis')),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5 } }, t('vr.zukunftHinweis'))
        );
      })(),

      // Was im Alter auf dich zukommt (Rest von Braindump-32 #1): ehrliche Posten-
      // Übersicht OHNE erfundene Beträge — die Höhe hängt stark von Situation/Kanton ab.
      // Pflege ist oft der grösste Posten → Cross-Link in den geführten Ablauf.
      alter && React.createElement('div', { style: { ...s.section, marginTop: space.sm + 'px' } },
        React.createElement('div', { style: s.label }, t('vr.altersKostenTitle')),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, marginTop: space.xs + 'px', marginBottom: space.sm + 'px' } }, t('vr.altersKostenIntro')),
        ...['K1', 'K2', 'K3', 'K4', 'K5'].map((k) => React.createElement('div', {
          key: k, style: { display: 'flex', gap: space.sm + 'px', fontSize: text.sm, color: palette.text, lineHeight: 1.5, marginBottom: space.xs + 'px' },
        },
          React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.sandDeep, flexShrink: 0, fontWeight: weight.bold } }, '·'),
          React.createElement('span', null, t('vr.altersKosten' + k))
        )),
        onNavigate && React.createElement('button', {
          onClick: () => onNavigate('pflege'),
          style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: space.xs + 'px', fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium },
        }, '→ ' + t('gepaeck.w.pflege'))
      ),

      // Vergünstigungen im Alter (Braindump-32 #1): bei tiefer Rente steht oft mehr zu,
      // als bekannt ist. Surfaced im Pensionsplanungs-Kontext. Nur echte, kuratierte
      // Quellen (OfficialLinkBox = auditierte Registry) + Cross-Link zum Schnellcheck;
      // keine erfundenen Zahlen. EL/Pro Senectute/AHV stehen schon im Fuss-Linkkasten.
      alter && React.createElement('div', {
        style: { ...s.section, marginTop: space.sm + 'px', background: palette.gold + '0E', border: '1px solid ' + palette.gold + '33' },
      },
        React.createElement('div', { style: s.label }, t('vr.altersHilfenTitle')),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, marginTop: space.xs + 'px' } }, t('vr.altersHilfenIntro')),
        React.createElement(OfficialLinkBox, { palette, t, data, ids: ['praemienverbilligung'] }),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, marginTop: space.sm + 'px' } }, t('vr.altersHilfenRegional')),
        onNavigate && React.createElement('button', {
          onClick: () => onNavigate('schnellcheck'),
          style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: space.sm + 'px', fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium },
        }, '→ ' + t('vr.altersHilfenCheck'))
      ),

      // 3a-Zinsschwelle: ruhiger Strategie-Hinweis, sobald das voraussichtliche
      // 3a-Kapital die Vorzugszins-Schwelle übersteigt. Kein Knick in der Kurve
      // (die Engine modelliert 3a als einen Klumpen mit einer angenommenen Rendite
      // — ein Einzelkonto-Knick wäre für Mehr-Konten-Fälle falsch); stattdessen die
      // Strategie sichtbar machen und zum gestaffelten Bezug unten überleiten.
      projektion && projektion.endsumme.s3a > SAEULE3A_ZINSSCHWELLE && React.createElement('div', {
        style: { ...s.section, marginTop: space.sm + 'px', background: palette.sage + '11', border: '1px solid ' + palette.sage + '33' },
      },
        React.createElement('div', { style: s.label }, t('vr.zukunft3aSchwelleTitle')),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, marginTop: space.xs + 'px' } },
          t('vr.zukunft3aSchwelle', { schwelle: fmt(SAEULE3A_ZINSSCHWELLE) }))
      ),

      // Steuer beim Kapitalbezug (2. Säule/3a als Kapital statt Rente) — einklappbar,
      // rechnet auf dem voraussichtlichen Kapital. Bund exakt, Kanton Orientierung.
      kapitalbezug && React.createElement('details', { style: s.intlDetails },
        React.createElement('summary', { style: s.intlSummary }, t('vr.kbTitle')),
        React.createElement('p', { style: s.intlIntro }, t('vr.kbIntro')),

        // Kanton-Auswahl (aus Basis-Daten vorbelegt)
        React.createElement('div', { style: { display: 'flex', gap: space.sm + 'px', alignItems: 'center', flexWrap: 'wrap', margin: space.sm + 'px 0 ' + space.xs + 'px' } },
          React.createElement('label', { style: { ...s.label, marginBottom: 0 }, htmlFor: 'kbKanton' }, t('vr.kbCanton')),
          React.createElement('select', { id: 'kbKanton', value: kbKanton, onChange: e => setKbKanton(e.target.value), style: { ...s.input, width: 'auto', cursor: 'pointer' } },
            React.createElement('option', { value: '' }, t('vr.kbCantonNone')),
            ...alleKapitalKantone().map(k => React.createElement('option', { key: k.kuerzel, value: k.kuerzel }, k.kuerzel + ' – ' + k.hauptort)))
        ),
        React.createElement('div', { style: s.sublabel }, t('vr.kbBasisHint')),

        // Ergebnis auf dem voraussichtlichen Kapital
        (() => {
          const { kapital, einzel, bandbreite } = kapitalbezug;
          if (einzel.hatKanton) {
            return React.createElement('div', { 'aria-live': 'polite', style: { ...s.section, marginTop: space.sm + 'px' } },
              React.createElement('div', { style: s.label }, t('vr.kbOnCapital', { betrag: fmt(kapital) })),
              React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text, marginTop: space.xs + 'px' } },
                'CHF ' + fmt(einzel.total) + ' (' + t('vr.kbEffective', { pct: einzel.effektiverSatz }) + ')'),
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } },
                t('vr.kbFederal') + ' CHF ' + fmt(einzel.bund) + ' · ' + t('vr.kbCantonal') + ' CHF ' + fmt(einzel.kantonGemeinde) + ' (' + einzel.hauptort + ')'),
              React.createElement('div', { style: { marginTop: space.xs + 'px', fontWeight: weight.semi, color: palette.sageDeep } },
                t('vr.kbNet') + ': CHF ' + fmt(einzel.netto))
            );
          }
          return React.createElement('div', { 'aria-live': 'polite', style: { ...s.section, marginTop: space.sm + 'px' } },
            React.createElement('div', { style: s.label }, t('vr.kbOnCapital', { betrag: fmt(kapital) })),
            React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text, marginTop: space.xs + 'px' } },
              'CHF ' + fmt(bandbreite.minTotal) + ' – ' + fmt(bandbreite.maxTotal)),
            React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } },
              t('vr.kbRange', { minK: bandbreite.minHauptort, maxK: bandbreite.maxHauptort })),
            React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px' } },
              t('vr.kbFederal') + ' CHF ' + fmt(einzel.bund) + ' (' + t('vr.kbExact') + ')'),
            React.createElement('div', { style: { fontSize: text.xs, color: palette.goldDeep, marginTop: space.xs + 'px', lineHeight: 1.5 } }, t('vr.kbPickCanton'))
          );
        })(),

        // Staffelung: Progression sichtbar machen
        kapitalbezug.staffel && React.createElement('div', { style: { ...s.section, marginTop: space.sm + 'px', background: palette.sage + '11', border: '1px solid ' + palette.sage + '33' } },
          React.createElement('div', { style: { display: 'flex', gap: space.sm + 'px', alignItems: 'center', flexWrap: 'wrap' } },
            React.createElement('span', { style: { ...s.label, marginBottom: 0 } }, t('vr.kbStaffelTitle')),
            React.createElement('select', { value: kbTranchen, onChange: e => setKbTranchen(e.target.value), 'aria-label': t('vr.kbStaffelTitle'), style: { ...s.input, width: 'auto', padding: '4px 8px', fontSize: text.sm, cursor: 'pointer' } },
              ...['2', '3', '4', '5'].map(n => React.createElement('option', { key: n, value: n }, t('vr.kbStaffelYears', { n }))))
          ),
          kapitalbezug.staffel.ersparnis > 0
            ? React.createElement('div', { style: { marginTop: space.xs + 'px' } }, t('vr.kbStaffelResult', { total: fmt(kapitalbezug.staffel.gestaffeltTotal), einmal: fmt(kapitalbezug.staffel.einmalTotal), ersparnis: fmt(kapitalbezug.staffel.ersparnis) }))
            : React.createElement('div', { style: { marginTop: space.xs + 'px', color: palette.mid } }, t('vr.kbStaffelNone')),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: 1.5 } }, t('vr.kbStaffelHint'))
        ),

        // Disclaimer + amtlicher Rechner
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.sm + 'px', lineHeight: 1.5 } }, t('vr.kbDisclaimer')),
        React.createElement('a', { href: 'https://swisstaxcalculator.estv.admin.ch/', target: '_blank', rel: 'noopener noreferrer', style: { ...s.intlLink, display: 'inline-block', marginTop: space.xs + 'px' } }, t('vr.kbOfficialLink') + ' →'),
        React.createElement('div', { style: s.source }, renderSource(t('vr.kbSource')))
      )
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
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.skyDeep } }, 'CHF ' + fmt(projected3a)),
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
              style: { fontSize: text.sm, color: palette.skyDeep, textDecoration: 'none' }
            }, t('vr.fzLink' + link.key) + ' →')
          )
        )
      )
    )),

    activeTab !== 'fz' && !parsedEinkommen && React.createElement('div', { style: { ...s.section, color: palette.mid } }, t('vr.einkommenEingeben')),

    React.createElement(OfficialLinkBox, { palette, t, data, ids: ['ahv', 'ergaenzungsleistungen', 'prosenectute'] }),

    React.createElement('div', { style: s.source },
      renderSource(t('vr.source'))
    ),

    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('finanzuebersicht'),
      style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md + 'px' }
    }, '→ ' + t('nav.finanzUebersicht'))
  );
};

export default VorsorgeRechner;
