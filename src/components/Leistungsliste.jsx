import React, { useState } from 'react';
import Icons from '../IconKern.jsx';
import { text, weight, leading, space, radius, ease, duration } from '../config/tokens.js';
import { PanelTitle } from './Heading.jsx';
import { miniCompass } from './miniKompass.js';
import { kompassBearing } from '../data/leistungsKompass.js';
import { calculateIPV, calculateSozialhilfe } from '../config/cantonalData.js';
import { zahl } from '../utils/geld.js';

// Leistungsliste des Dashboard-Blocks «Was steht mir zu?» (seit 25.09.2026 eigene Datei,
// lazy geladen — vorher in Dashboard.jsx). Name QuickCheck bleibt: Tests und Übergabe-Logik
// (B-1/E22) hängen daran.
export const QuickCheck = ({ palette, t, onNavigate, data }) => {
  const [income, setIncome] = useState(data?.finanzen?.monthlyIncome || '');
  const annual = (Number(income) || 0) * 12;
  const canton = data?.basis?.canton;
  const fmt = (v) => zahl(v, { hoechstens: 2 });

  // Seit 25.09.2026 EINE Liste: Schnell-Check und die Leistungs-Kacheln waren zwei
  // Darstellungen derselben Frage. Jede Leistung ist eine Zeile; wo echte Logik
  // dahintersteht (IPV, Sozialhilfe), zeigt die Zeile das Ergebnis, sonst ihren Untertitel.
  // Nur POSITIVE, logisch gedeckte Hinweise, nie ein „Nein"-Verdikt (Würde). Die
  // Berechnung ist dieselbe wie in den vollständigen Tools (calculateIPV/
  // calculateSozialhilfe), damit Liste und Rechner nie widersprechen.
  const probe = { ...data, finanzen: { ...(data?.finanzen || {}), monthlyIncome: income } };
  const found = {};
  let sozPegel = null;
  try {
    // IPV: kantonal, einkommensgetrieben. Ohne Kanton kein erfundener Betrag.
    const ipv = (annual > 0 && canton) ? calculateIPV(probe) : null;
    // E9: ohne amtlich belegten Kanton kein Betrag, nur die Orientierung.
    // B-1/E22: das hier eingetippte Einkommen geht an den IPV-Rechner mit (nicht ins Profil).
    if (ipv && ipv.anspruchMoeglich) found.ipv = {
      uebergabe: { schnellcheck: { monthlyIncome: Number(income) } },
      monthly: ipv.eligible ? ipv.amount : 0,
      detail: ipv.eligible ? t('dashboard.quickCheckResult', { income: fmt(annual), amount: fmt(ipv.annual) }) : t(ipv.noteKey),
    };
    // Sozialhilfe: nur zeigen, wenn Mietkontext vorhanden (sonst wäre der Bedarf
    // unvollständig) UND Bedarf ungedeckt UND kein Vermögen über dem Freibetrag —
    // sonst wäre ein „Anspruch möglich" unehrlich.
    const rentContext = Number(data?.wohnen?.rentAmount || 0) > 0;
    if (annual > 0 && rentContext) {
      const sh = calculateSozialhilfe(probe);
      if (sh?.eligible && (sh?.vermoegenUeberFreibetrag || 0) === 0) found.soz = {
        monthly: sh.deficit,
        // R4: Freibetrag kantonal nicht bestätigt → leise mitsagen.
        detail: t('dashboard.anspruchMoeglich') + (sh.vfbUnbestaetigt ? ' · ' + t('sozialhilfe.assetLimitUnconfirmedShort') : ''),
      };
      // Sonst trotzdem eine Aussage (Wunsch 25.09.2026: «gleich dazuschreiben, ob einem
      // etwas zusteht»), sachlich statt als Urteil: Einkommen gegen SKOS-Bedarf, als Pegel.
      // Texte aus dem Pegel-Werkzeug (pegel.*), dieselbe Engine wie der Rechner.
      else if (sh) sozPegel = {
        bedarf: sh.totalBedarf, einkommen: sh.income,
        detail: sh.eligible ? t('pegel.vermoegen') : t('pegel.covered'),
      };
    }
  } catch { /* Orientierung, nie blockierend */ }

  // Wie der volle Schnellcheck (Schnellcheck.jsx): bei Sozialhilfe steckt die IPV schon
  // im Bedarf — sie zählt dann nicht zusätzlich. Bis 25.09.2026 zählte das Dashboard
  // beide zusammen und zeigte damit mehr Entlastung als der Schnellcheck selbst.
  const ipvSubsumed = !!found.soz && !!found.ipv && found.ipv.monthly > 0;
  const counted = ['ipv', 'soz'].filter(k => found[k] && found[k].monthly > 0 && !(ipvSubsumed && k === 'ipv'));
  const totalMonthly = counted.reduce((sum, k) => sum + found[k].monthly, 0);
  const maxMonthly = Math.max(0, ...counted.map(k => found[k].monthly));

  // Kompass-Peilung aus derselben Liste: was hier gefunden wird, zählt.
  const anzahlGefunden = Object.keys(found).length;
  const kompass = kompassBearing({ hasIncome: annual > 0, benefitCount: anzahlGefunden });

  const leistungen = [
    { key: 'ipv', label: t('dashboard.quickCheckIpv'), sub: t('dashboard.highlightIpvSub'), view: 'premium', icon: 'praemienverbilligung' },
    { key: 'soz', label: t('nav.sozialhilfe'), sub: t('dashboard.highlightSozialhilfeSub'), view: 'sozialhilfe', icon: 'health' },
    { key: 'stipendien', label: t('nav.stipendien'), sub: t('nav.sub.stipendien'), view: 'stipendien', icon: 'ausbildung' },
    { key: 'alv', label: t('nav.alv'), sub: t('nav.sub.alv'), view: 'alv', icon: 'family' },
    { key: 'eo', label: t('nav.eo'), sub: t('nav.sub.eo'), view: 'eo', icon: 'family' },
  ];

  // Zeile statt Karte (dichte Liste: Linien, keine Rahmen). Rechts, wo ein Betrag
  // gezählt wird, ein dünner Balken auf GEMEINSAMER Skala (Grösse = Betrag), eine Farbe:
  // es ist dieselbe Grösse, keine Kategorie. Der Betrag steht als Text daneben.
  const row = (l) => {
    const f = found[l.key];
    const zaehlt = f && counted.includes(l.key);
    const IconFn = Icons[l.icon];
    return React.createElement('button', {
      key: l.key,
      onClick: () => (f && f.uebergabe) ? onNavigate(l.view, undefined, f.uebergabe) : onNavigate(l.view),
      style: {
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
        padding: '12px 4px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        background: 'transparent', color: palette.text,
        border: 'none', borderTop: '1px solid ' + palette.border + '55', borderRadius: 0,
        transition: `background ${duration.normal}ms ${ease}`,
      },
      onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
      onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
    },
      React.createElement('div', { style: { width: '20px', height: '20px', flexShrink: 0, color: f ? (palette.sageDeep || palette.sage) : palette.mid } }, IconFn ? IconFn() : null),
      React.createElement('div', { style: { minWidth: 0, flex: 1 } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, l.label),
        React.createElement('div', { style: { fontSize: text.xs - 1, color: f ? (palette.sageDeep || palette.sage) : palette.mid, marginTop: '2px', lineHeight: leading.normal } },
          f ? (ipvSubsumed && l.key === 'ipv' ? t('schnellcheck.ipvSubsumed', { amount: fmt(f.monthly) }) : f.detail)
            : (l.key === 'soz' && sozPegel) ? sozPegel.detail : l.sub)
      ),
      // Pegel: Balken = Einkommen, Strich = SKOS-Bedarf, gemeinsame Skala (das Grössere).
      // Neutral eingefärbt — es ist eine Lage, kein Betrag, der zusteht.
      !f && l.key === 'soz' && sozPegel && (() => {
        const max = Math.max(sozPegel.bedarf, sozPegel.einkommen, 1);
        return React.createElement('div', { style: { flexShrink: 0, width: '96px', textAlign: 'right' } },
          React.createElement('div', { style: { fontSize: text.xs - 1, color: palette.mid, fontVariantNumeric: 'tabular-nums' } },
            t('pegel.bedarf') + ' ≈ ' + fmt(sozPegel.bedarf)),
          React.createElement('div', { 'aria-hidden': true, style: { position: 'relative', height: '6px', marginTop: '5px', borderRadius: '3px', background: palette.up } },
            React.createElement('div', { style: { height: '100%', width: (sozPegel.einkommen / max * 100).toFixed(1) + '%', background: palette.mid, opacity: 0.55, borderRadius: '3px' } }),
            React.createElement('div', { style: { position: 'absolute', top: '-3px', bottom: '-3px', width: '2px', left: 'calc(' + (sozPegel.bedarf / max * 100).toFixed(1) + '% - 1px)', background: palette.text } })));
      })(),
      zaehlt && React.createElement('div', { style: { flexShrink: 0, width: '96px', textAlign: 'right' } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, fontVariantNumeric: 'tabular-nums' } }, '≈ CHF ' + fmt(f.monthly)),
        React.createElement('div', { 'aria-hidden': true, style: { height: '6px', marginTop: '4px', borderRadius: '3px', background: palette.up, overflow: 'hidden' } },
          React.createElement('div', { style: { height: '100%', width: (maxMonthly > 0 ? f.monthly / maxMonthly * 100 : 0).toFixed(1) + '%', background: palette.sage, borderRadius: '3px' } }))
      )
    );
  };

  return React.createElement('div', { style: { marginTop: space.xl + 'px' } },
    // Kopf: Titel links, rechts der Leistungs-Kompass (bis 25.09.2026 ein Instrument).
    // Seine Nadel zählt, was die Liste darunter findet, und führt zum vollen Schnellcheck.
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space.md + 'px', marginBottom: space.sm + 'px' }
    },
      React.createElement(PanelTitle, {
        palette, style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text }
      }, t('schnellcheck.kompassLeistungen')),
      React.createElement('button', {
        onClick: () => onNavigate('schnellcheck'),
        style: {
          display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0',
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'right',
        },
      },
        React.createElement('span', { style: { minWidth: 0 } },
          React.createElement('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.medium, color: palette.sageDeep || palette.sage } }, t('instrumente.kompass')),
          React.createElement('span', { style: { display: 'block', fontSize: text.xs - 1, color: palette.mid } },
            kompass.state === 'found'
              ? (anzahlGefunden === 1 ? t('instrumente.kompassFoundOne') : t('instrumente.kompassFound', { n: anzahlGefunden }))
              : kompass.state === 'none' ? t('instrumente.kompassNone') : t('instrumente.setup'))),
        miniCompass(palette, kompass.bearing, kompass.state))
    ),
    React.createElement('div', {
      style: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: space.md + 'px', marginBottom: space.md + 'px' }
    },
      React.createElement('label', { style: { display: 'block', flex: '0 1 220px' } },
        React.createElement('span', {
          style: { fontSize: text.xs, color: palette.mid, display: 'block', marginBottom: space.xs }
        }, t('dashboard.quickCheckIncome')),
        React.createElement('input', {
          type: 'number',
          inputMode: 'numeric',
          placeholder: t('dashboard.quickCheckPlaceholder'),
          'aria-label': t('dashboard.quickCheckIncome'),
          value: income,
          onChange: (e) => setIncome(e.target.value),
          style: {
            width: '100%', padding: '10px 12px', fontSize: text.body,
            border: '1px solid ' + palette.border, borderRadius: radius.sm,
            background: palette.surface, color: palette.text,
            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          }
        })
      ),
      // Die eine Kennzahl: geschätzte Entlastung pro Monat — nur wenn etwas gezählt wird.
      totalMonthly > 0 && React.createElement('div', { style: { textAlign: 'right' } },
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('dashboard.quickCheckWithIncome')),
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, fontVariantNumeric: 'tabular-nums' } },
          '≈ CHF ' + fmt(totalMonthly) + ' / ' + t('schnellcheck.monat'))
      )
    ),
    React.createElement('div', { style: { borderBottom: '1px solid ' + palette.border + '55' } }, leistungen.map(row)),
    React.createElement('div', {
      style: { fontSize: text.xs - 1, color: palette.mid, marginTop: space.sm, lineHeight: leading.relaxed }
    }, annual > 0 ? (totalMonthly > 0 ? t('schnellcheck.barHint') : t('dashboard.quickCheckHint')) : t('schnellcheck.enterIncome'))
  );
};

