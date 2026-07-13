import React, { useState, useEffect } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { calculateIPV, calculateSozialhilfe, checkELEligibility, getCantonName, getHouseholdInfo } from './config/cantonalData.js';
import { Icon } from './IconSystem.jsx';
import { LeistungsKompass } from './components/LeistungsKompass.jsx';
import { Pegel } from './components/Pegel.jsx';
import { PraemienBeleg } from './components/PraemienBeleg.jsx';
import { sozialhilfePegelState } from './data/pegel.js';
import { praemienBelegState } from './data/praemienBeleg.js';
import { text, weight, leading, space, radius, shadow } from './config/tokens.js';

// Leistungs-Schnellcheck (Basel-Stadt-Leistungsrechner als Vorbild): EIN Satz
// Angaben — auto vorbelegt aus dem Profil, hier frei anpassbar zum Ausprobieren —
// zeigt ALLE Leistungen, die logisch gedeckt sind. Nur POSITIVE Hinweise, nie
// ein „Nein"-Verdikt (Würde). Dieselbe Engine wie die Voll-Tools (calculateIPV/
// calculateSozialhilfe/checkELEligibility), damit Schnellcheck und Rechner nie
// widersprüchliche Zahlen zeigen.
export const Schnellcheck = ({ palette, t, data, onNavigate, onProbeChange }) => {
  const canton = data?.basis?.canton || '';
  const hh = getHouseholdInfo(data);
  const [income, setIncome] = useState(data?.finanzen?.monthlyIncome ? String(data.finanzen.monthlyIncome) : '');
  const [rent, setRent] = useState(data?.wohnen?.rentAmount ? String(data.wohnen.rentAmount) : '');
  const [kk, setKk] = useState(data?.versicherungen?.kkPremium ? String(data.versicherungen.kkPremium) : '');

  const fmt = (n) => 'CHF ' + Number(n || 0).toLocaleString('de-CH', { maximumFractionDigits: 0 });

  const numIncome = Number(income) || 0;
  const numRent = Number(rent) || 0;
  const probe = {
    ...data,
    finanzen: { ...(data?.finanzen || {}), monthlyIncome: numIncome },
    wohnen: { ...(data?.wohnen || {}), rentAmount: numRent },
    versicherungen: { ...(data?.versicherungen || {}), kkPremium: Number(kk) || 0 },
  };

  // Wird der Schnellcheck als Schritt 1 einer Brücke gerendert (AnspruchCheck),
  // fliessen die hier frei angepassten Zahlen an den Ergebnis-Schritt weiter —
  // sonst blieben sie in diesem lokalen Zustand gefangen. Ohne Callback (Solo-
  // Ansicht) passiert nichts. Kanton bleibt profilgebunden (kein Feld hier).
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Absicht: bei Änderung der Roh-Eingaben feuern und das abgeleitete `probe` durchreichen. `probe` (jedes Render neu) / `onProbeChange` (Prop) als Dep würden bei jedem Render feuern.
  useEffect(() => { if (onProbeChange) onProbeChange(probe); }, [income, rent, kk, data]);

  // Gedeckte Leistungen sammeln — jede mit eigenem Ehrlichkeits-Gate.
  const benefits = [];
  try {
    // IPV: kantonal + einkommensgetrieben. Ohne Kanton kein erfundener Betrag.
    const ipv = (numIncome > 0 && canton) ? calculateIPV(probe) : null;
    if (ipv && ipv.eligible) benefits.push({
      key: 'ipv', view: 'premium', color: palette.sky, textColor: palette.skyDeep,
      label: t('schnellcheck.ipv'), monthly: ipv.amount, note: t('schnellcheck.ipvNote'),
    });
    // Sozialhilfe: nur mit Mietkontext (sonst Bedarf unvollständig) + ungedecktem
    // Bedarf + Vermögen unter Freibetrag — sonst wäre „Anspruch" unehrlich.
    if (numRent > 0) {
      const sh = calculateSozialhilfe(probe);
      if (sh?.eligible && (sh?.vermoegenUeberFreibetrag || 0) === 0) benefits.push({
        key: 'soz', view: 'sozialhilfe', color: palette.sage, textColor: palette.sageDeep,
        label: t('nav.sozialhilfe'), monthly: sh.deficit, note: t('schnellcheck.sozNote'),
      });
    }
    // EL: nur bei AHV-/IV-Kontext (Renten hinterlegt). Qualitativ, kein Betrag.
    const el = checkELEligibility(probe);
    if (el?.eligible) benefits.push({
      key: 'el', view: 'sozialhilfe', color: palette.goldDeep, textColor: palette.goldDeep,
      label: t('schnellcheck.el'), qualitative: true, note: t('schnellcheck.elNote'),
    });
  } catch { /* Orientierung, nie blockierend */ }

  // Instrument-Zustände (Beleg/Pegel) im selben Ehrlichkeits-/Crash-Gate berechnen
  // wie die Leistungsliste: werfen calculateIPV/calculateSozialhilfe, degradiert die
  // ganze Ansicht sonst zum leeren Screen statt sanft zu „keine Angabe".
  let belegState = null, sozPegelState = null;
  try {
    if (canton && numIncome > 0) belegState = praemienBelegState(probe);
    if (canton && numIncome > 0 && numRent > 0) sozPegelState = sozialhilfePegelState(probe);
  } catch { /* Orientierung, nie blockierend */ }

  const monetary = benefits.filter(b => !b.qualitative && b.monthly > 0);
  // IPV ist subsidiär: greift Sozialhilfe, wird die volle Prämie schon über den
  // Sozialhilfe-Bedarf mitgetragen (calculateSozialhilfe rechnet die ganze Prämie
  // in den Bedarf). Die IPV ist dann KEIN additiver Geldbetrag, sondern ein Teil,
  // wie dieser Fehlbetrag gedeckt wird — darum nicht doppelt zählen. Quelle: SKOS-
  // Faktenblatt „IPV und Sozialhilfe" 2024. calculateIPV/-Sozialhilfe unberührt.
  const ipvSubsumed = monetary.some(b => b.key === 'soz');
  const countedMonetary = monetary.filter(b => !(ipvSubsumed && b.key === 'ipv'));
  const ipvAmount = (monetary.find(b => b.key === 'ipv') || {}).monthly || 0;
  const totalMonthly = countedMonetary.reduce((s, b) => s + b.monthly, 0);
  // Stärkster Weg für die Kompass-Peilung: höchster Betrag zuerst, sonst der erste
  // (qualitative wie EL zählen als Weg, aber ohne Betrag hinter den monetären).
  const topBenefit = [...benefits].sort((a, b) => (b.monthly || 0) - (a.monthly || 0))[0];
  const topLabel = topBenefit ? topBenefit.label : null;

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border, boxShadow: shadow.sm },
    h2: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    intro: { fontSize: text.body, color: palette.text, lineHeight: leading.relaxed, margin: space.sm + 'px 0 ' + space.lg + 'px', padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', border: '1px solid ' + palette.border },
    section: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.lg + 'px' },
    label: { fontSize: text.xs, color: palette.mid, display: 'block', marginBottom: space.xs + 'px' },
    input: { width: '100%', padding: '9px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
    field: { flex: '1 1 150px', minWidth: '130px' },
    context: { fontSize: text.xs, color: palette.mid, marginTop: space.sm + 'px', lineHeight: leading.relaxed },
    disclaimer: { fontSize: text.xs, color: palette.mid, marginTop: space.md + 'px', lineHeight: leading.relaxed },
  };

  const field = (labelText, value, setter, placeholder) =>
    React.createElement('label', { style: s.field },
      React.createElement('span', { style: s.label }, labelText),
      React.createElement('input', {
        type: 'number', inputMode: 'numeric', placeholder, value,
        onChange: (e) => setter(e.target.value), style: s.input,
      })
    );

  // Flat-Balken: die monetären Leistungen als monatliche Entlastung, vergleichbar.
  // Zeigt NUR gezählte Wege (subsidiäre IPV ist bei Sozialhilfe darin enthalten).
  const bar = countedMonetary.length > 0 && React.createElement('div', { style: { marginTop: space.md + 'px' } },
    React.createElement('div', { style: { fontSize: text.xl, fontWeight: weight.bold, color: palette.text, marginBottom: space.sm + 'px' } },
      fmt(totalMonthly) + ' / ' + t('schnellcheck.monat')),
    ipvSubsumed && ipvAmount > 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px', lineHeight: leading.normal } },
      t('schnellcheck.ipvSubsumed', { amount: fmt(ipvAmount) })),
    React.createElement('div', { style: { display: 'flex', height: '28px', borderRadius: radius.sm + 'px', overflow: 'hidden', background: palette.up } },
      countedMonetary.map((b, i) => {
        const wide = totalMonthly > 0 && (b.monthly / totalMonthly) >= 0.18;
        // Nicht nur Farbe: Sozialhilfe trägt die feine Schraffur (wie der Pegel),
        // jedes Segment ein immer sichtbares Kürzel und einen hellen Trenner —
        // so bleiben sky↔sage auch bei Farbenblindheit unterscheidbar (nicht rein
        // farblich). Das volle Label erscheint ab 18 % Breite, sonst das Kürzel.
        const hatch = b.key === 'soz'
          ? 'repeating-linear-gradient(45deg, transparent 0, transparent 3px, ' + palette.surface + '55 3px, ' + palette.surface + '55 5px)'
          : 'none';
        return React.createElement('div', {
          key: b.key,
          // textColor (Deep-Variante) als Fläche, damit der weisse Text ≥4.5:1 hält —
          // rohes sky/sage trägt weissen Text nur mit 3.20/4.32:1 (AA-Fail).
          style: {
            width: (totalMonthly > 0 ? (b.monthly / totalMonthly * 100) : 0).toFixed(1) + '%',
            backgroundColor: b.textColor, backgroundImage: hatch,
            display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0,
            boxShadow: i < countedMonetary.length - 1 ? 'inset -1px 0 0 0 ' + palette.surface : 'none',
          },
        }, React.createElement('span', {
          style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.surface, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 4px' },
        }, wide ? b.label : t(b.key === 'soz' ? 'barKurz.soz' : 'barKurz.ipv')));
      })
    ),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px' } }, t('schnellcheck.barHint'))
  );

  const benefitRow = (b) => {
    // Subsidiäre IPV bei Sozialhilfe: als Bestandteil ausweisen, nicht als
    // zusätzlichen Geldbetrag (sonst liest sich die Zeile wie Extra-Geld).
    const subsumed = ipvSubsumed && b.key === 'ipv';
    return React.createElement('button', {
    key: b.key,
    onClick: () => onNavigate && onNavigate(b.view),
    style: {
      display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textAlign: 'left',
      padding: '12px 14px', marginBottom: space.sm + 'px', cursor: 'pointer', fontFamily: 'inherit',
      background: b.color + '10', color: palette.text,
      border: '1px solid ' + b.color + '33', borderRadius: radius.sm + 'px',
    },
    onMouseEnter: (e) => { e.currentTarget.style.background = b.color + '1e'; },
    onMouseLeave: (e) => { e.currentTarget.style.background = b.color + '10'; },
  },
    React.createElement('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: b.color, flexShrink: 0 }, 'aria-hidden': true }),
    React.createElement('div', { style: { minWidth: 0, flex: 1 } },
      React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi } }, b.label),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, b.note)
    ),
    React.createElement('div', { style: { flexShrink: 0, textAlign: 'right' } },
      subsumed
        ? React.createElement('span', { style: { fontSize: text.xs, fontWeight: weight.medium, color: palette.mid } }, t('schnellcheck.ipvEnthalten'))
        : b.qualitative
          ? React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.medium, color: b.textColor } }, t('schnellcheck.pruefen'))
          : React.createElement('span', { style: { fontSize: text.body, fontWeight: weight.bold, color: b.textColor, whiteSpace: 'nowrap' } }, fmt(b.monthly) + ' / ' + t('schnellcheck.monat'))
    ),
    React.createElement('span', { style: { color: b.color, flexShrink: 0 }, 'aria-hidden': true }, '→')
    );
  };

  const wegeItem = (view, label) => React.createElement('button', {
    key: view, onClick: () => onNavigate && onNavigate(view),
    style: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.skyDeep, textAlign: 'left' },
  }, label + ' →');

  return React.createElement('div', { style: s.card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'insurance', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('schnellcheck.title')),
    React.createElement('p', { style: s.intro }, t('schnellcheck.intro')),

    // Angaben — auto vorbelegt, frei anpassbar
    React.createElement('div', { style: s.section },
      React.createElement('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap' } },
        field(t('schnellcheck.income'), income, setIncome, '4500'),
        field(t('schnellcheck.rent'), rent, setRent, '1500'),
        field(t('schnellcheck.kk'), kk, setKk, '350')
      ),
      React.createElement('div', { style: s.context },
        canton
          ? t('schnellcheck.contextCanton', { canton: getCantonName(canton, t) || canton, size: hh.householdSize })
          : t('schnellcheck.contextNoCanton'),
        ' ',
        React.createElement('button', {
          onClick: () => onNavigate && onNavigate('chapter', 0),
          style: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs, color: palette.skyDeep },
        }, t('schnellcheck.adjustProfile'))
      )
    ),

    // Leistungs-Kompass: Peilung über dem Ergebnis (Instrument über derselben Logik)
    React.createElement(LeistungsKompass, {
      palette, t, benefitCount: benefits.length, topLabel, hasIncome: numIncome > 0,
    }),

    // IPV-Instrument: Prämien-Beleg (Papier) — bewusst anderes Material als der
    // Sozialhilfe-Pegel (Glas), damit sie nebeneinander unterscheidbar sind.
    // Reine Anzeige über calculateIPV, Berechnung unberührt.
    belegState && React.createElement(PraemienBeleg, {
      palette, t, state: belegState,
    }),

    // Sozialhilfe-Pegel (Aufstockungs-Modus): dieselbe Metapher, Linie = Existenz-
    // minimum. Braucht Miet-Kontext, sonst wäre der Bedarf unvollständig.
    sozPegelState && React.createElement(Pegel, {
      palette, t, state: sozPegelState,
    }),

    // Ergebnis
    numIncome > 0
      ? (benefits.length > 0
          ? React.createElement('div', null,
              React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' } }, t('schnellcheck.resultTitle')),
              bar || null,
              React.createElement('div', { style: { marginTop: space.md + 'px' } }, benefits.map(benefitRow))
            )
          : React.createElement('div', { style: { ...s.section, color: palette.mid, fontSize: text.sm, lineHeight: leading.relaxed } },
              canton ? t('schnellcheck.noResult') : t('schnellcheck.noResultNoCanton'))
        )
      : React.createElement('div', { style: { ...s.section, color: palette.mid, fontSize: text.sm } }, t('schnellcheck.enterIncome')),

    // Weitere Wege (versteckte Berechtigungen / Stipendien) — immer sichtbar,
    // weil vieles nicht rein einkommensabhängig ist.
    React.createElement('div', { style: { marginTop: space.lg + 'px', paddingTop: space.md + 'px', borderTop: '1px solid ' + palette.border } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' } }, t('schnellcheck.moreWays')),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.xs + 'px', alignItems: 'flex-start' } },
        wegeItem('situationen', t('schnellcheck.waySituationen')),
        wegeItem('stipendien', t('schnellcheck.wayStipendien')),
        wegeItem('mietzins', t('schnellcheck.wayMietzins'))
      )
    ),

    // Lage-abhängige Leistungen: hängen nicht am Einkommen, sondern an einer
    // Lebenslage → nur Wegweiser, keine Berechnung (Ehrlichkeit/Haftung). Genau
    // die Trennung, die der Schnellcheck sonst nur implizit macht, sichtbar gemacht.
    React.createElement('div', { style: { marginTop: space.md + 'px', paddingTop: space.md + 'px', borderTop: '1px solid ' + palette.border } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.xs + 'px' } }, t('schnellcheck.lageTitle')),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px', lineHeight: leading.relaxed } }, t('schnellcheck.lageIntro')),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.xs + 'px', alignItems: 'flex-start' } },
        wegeItem('iv', t('schnellcheck.lageIv')),
        wegeItem('alv', t('schnellcheck.lageAlv')),
        wegeItem('eo', t('schnellcheck.lageEo')),
        wegeItem('kind', t('schnellcheck.lageFamilienzulagen'))
      )
    ),

    React.createElement('p', { style: s.disclaimer }, t('schnellcheck.disclaimer'))
  );
};

export default Schnellcheck;
