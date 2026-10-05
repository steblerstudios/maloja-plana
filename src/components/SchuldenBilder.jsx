import React from 'react';
import { text, weight, space, radius, visuallyHiddenStyle } from '../config/tokens.js';
import { betrag } from '../utils/geld.js';
import { formatDE } from '../utils/helpers.js';

// Wie die Karten im Schuldenmanager: mit Rappen, sonst ergeben Summe und Karten verschiedene Zahlen.
const chf = (x) => betrag(x, { stellen: 2 });
import { LegendenMarke } from './LegendenMarke.jsx';
import { AblaufLink } from '../AblaufSchale.jsx';
import { MAHNSTUFEN, leseStufe, naechsterWeg } from '../utils/mahnstufe.js';

// Drei ruhige Bilder für den Schuldenmanager (Dataviz-Runde 27.09.2026, Stebler Studios: A + B + C).
//
// Eine Farbe, abgestuft: Stufe 1 (vorrangig) am dunkelsten, Stufe 3 (übrige) am hellsten —
// Tinte der Schrift mit Deckkraft, damit hell und dunkel gleich funktionieren. Kein Rot:
// Schulden sind keine Alarmzahl. Jede Fläche steht zusätzlich als Text daneben (Legende mit
// Betrag, Zeilen mit Namen und Monat) — das Bild ist nie die einzige Quelle.

// Deckkraft je Stufe als Hex-Suffix an palette.text (wie palette.sand + '22' im Rest der App).
// Gerechnet (a11y-Prüfer 27.09.): Stufe 3 = '80' hält gegen surface 3,08:1 hell / 3,99:1 dunkel
// (WCAG 1.4.11 ≥ 3:1); '59' lag bei 2,1 / 2,7. Test: schuldenBilder.test.js.
export const STUFEN_TON = { 1: 'E6', 2: 'B8', 3: '80' };
const ton = (palette, stufe) => palette.text + (STUFEN_TON[stufe] || STUFEN_TON[3]);
const spur = (palette) => palette.text + '12';

export const tierLabelKey = (tier) => 'schulden.tier' + (tier === 1 ? 1 : tier === 2 ? 2 : 3);

// A · Übersicht: «Noch offen» als ein Balken, aufgeteilt nach der Reihenfolge-Stufe.
// Summen je Stufe aus prioritizeDebts (dort steht, warum welche Stufe).
export const summenJeStufe = (prioritized) => {
  const s = { 1: 0, 2: 0, 3: 0 };
  for (const d of prioritized) s[d.tier] = (s[d.tier] || 0) + (Number(d.amount) || 0);
  return [1, 2, 3].map(tier => ({ tier, summe: s[tier] })).filter(x => x.summe > 0);
};

export const OffenBalken = ({ palette, t, prioritized, status }) => {
  const teile = summenJeStufe(prioritized);
  const total = teile.reduce((a, x) => a + x.summe, 0);
  const erste = prioritized[0];
  const nebenzeile = [
    status.overdue > 0 && t('schulden.bild.ueberfaellig', { amount: chf(status.overdue) }),
    status.ohneDatum > 0 && t('schulden.bild.ohneDatum', { amount: chf(status.ohneDatum) }),
    status.paid > 0 && t('schulden.bild.bezahlt', { amount: chf(status.paid) }),
  ].filter(Boolean).join(' · ');
  return React.createElement('div', { style: { marginBottom: space.lg } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.sm, marginBottom: space.sm } },
      React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, t('schulden.bild.offen')),
      React.createElement('span', { style: { fontSize: text.xl, fontWeight: weight.semi, color: palette.text, fontVariantNumeric: 'tabular-nums' } }, chf(total))
    ),
    total > 0 && React.createElement('div', { 'aria-hidden': 'true', style: { display: 'flex', gap: '2px', marginBottom: space.sm } },
      teile.map((x, i) => React.createElement('div', {
        key: x.tier, title: t(tierLabelKey(x.tier)) + ': ' + chf(x.summe),
        style: { flex: x.summe + ' 1 0', minWidth: '4px', height: '14px', background: ton(palette, x.tier),
          borderRadius: [i === 0, i === teile.length - 1, i === teile.length - 1, i === 0].map(r => (r ? radius.xs : 0) + 'px').join(' ') },
      }))
    ),
    total > 0 && React.createElement('ul', { 'aria-label': t('schulden.bild.balkenLabel'), style: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px ' + space.md + 'px', listStyle: 'none', padding: 0, margin: 0, fontSize: text.sm, color: palette.mid } },
      teile.map(x => React.createElement('li', { key: x.tier },
        React.createElement(LegendenMarke, { form: 'fuellung', color: ton(palette, x.tier), palette }),
        t(tierLabelKey(x.tier)) + ' ',
        React.createElement('span', { style: { color: palette.text, fontVariantNumeric: 'tabular-nums' } }, chf(x.summe))
      ))
    ),
    nebenzeile && React.createElement('div', { style: { borderTop: '1px solid ' + palette.border, marginTop: space.md, paddingTop: space.sm, fontSize: text.sm, color: palette.mid, lineHeight: 1.5 } }, nebenzeile),
    erste && React.createElement('div', { style: { marginTop: space.sm, fontSize: text.sm, color: palette.text, lineHeight: 1.5 } },
      // Nur der Name — der Weg dazu steht einmal, in der Stufen-Leiste darunter.
      t('schulden.bild.naechstes', { name: erste.creditor || '—' })
    )
  );
};

// B · Abbau-Plan als Zeitachse. Jede Zeile: Name · Strecke von «von» bis «bis» (Monate, aus
// createDebtPlan) · «im N. Monat». Die Zeilen SIND die Liste — Name und Monat stehen als Text.
const achsenMarken = (monate) => {
  const schritt = monate <= 6 ? 1 : monate <= 12 ? 2 : monate <= 36 ? 6 : 12;
  const m = [];
  for (let i = schritt; i <= monate; i += schritt) m.push(i);
  if (m[m.length - 1] !== monate) m.push(monate);
  return m;
};

// Ein Ton für alle Zeilen: die Stufe steht in der Reihenfolge darunter als Text — hier trüge
// die Farbe sonst eine Information ohne Legende (a11y-Prüfer 27.09., WCAG 1.4.1).
export const zeitraum = (r) => {
  const ab = Math.floor(Math.max(0, r.von || 0) + 1e-9) + 1;
  return ab < r.monat ? { key: 'schulden.bild.vonBis', v: { von: String(ab), bis: String(r.monat) } } : { key: 'schulden.bild.imMonat', v: { n: String(r.monat) } };
};

export const AbbauZeitachse = ({ palette, t, plan }) => {
  if (!plan || !plan.machbar) return null;
  const n = plan.monate;
  const zeile = { display: 'grid', gridTemplateColumns: 'minmax(0, 7.5rem) minmax(0, 1fr) auto', alignItems: 'center', gap: space.sm + 'px', padding: '5px 0', fontSize: text.sm };
  return React.createElement('div', { style: { margin: space.md + 'px 0 ' + space.sm + 'px' } },
    React.createElement('div', { 'aria-hidden': 'true', style: { ...zeile, paddingTop: 0 } },
      React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } }, t('schulden.bild.achse')),
      React.createElement('div', { style: { position: 'relative', height: '1.2em', fontSize: text.xs, color: palette.mid } },
        // Nur Zahlen, «Monat» einmal links davor — auf dem Handy überlappten «Monat 1 … Monat 5» (27.09.).
        achsenMarken(n).map(m => React.createElement('span', { key: m, style: { position: 'absolute', right: (100 - (m / n) * 100) + '%', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } }, String(m)))
      ),
      React.createElement('span')
    ),
    React.createElement('ol', { 'aria-label': t('schulden.bild.zeitachseLabel'), style: { listStyle: 'none', padding: 0, margin: 0 } },
      plan.reihenfolge.map((r, i) => {
        const von = Math.max(0, r.von || 0), bis = Math.max(von, r.bis || r.monat);
        return React.createElement('li', { key: r.id, style: zeile },
          React.createElement('span', { style: { color: palette.text, overflowWrap: 'anywhere' } }, (i + 1) + ' · ' + (r.creditor || '—')),
          React.createElement('div', { 'aria-hidden': 'true', style: { position: 'relative', height: '12px', background: spur(palette), borderRadius: radius.sm } },
            React.createElement('div', { style: { position: 'absolute', left: (von / n) * 100 + '%', width: 'max(4px, ' + ((bis - von) / n) * 100 + '%)', top: 0, bottom: 0, background: ton(palette, 1), borderRadius: radius.xs } })
          ),
          React.createElement('span', { style: { color: palette.mid, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, (({ key, v }) => t(key, v))(zeitraum(r)))
        );
      })
    )
  );
};

// C · Wo jede Forderung steht: alle offenen Forderungen auf einer Leiste Rechnung → Mahnung →
// Zahlungsbefehl. Gefüllter Punkt = erreicht, Ring = noch nicht (Form statt Farbe).
export const MahnstufenUebersicht = ({ palette, t, prioritized, onNavigate }) => {
  if (prioritized.length === 0) return null;
  const punkt = (voll, aktuell) => React.createElement('span', { 'aria-hidden': 'true', style: { position: 'relative', display: 'block', width: '10px', height: '10px', borderRadius: '50%', boxSizing: 'border-box', border: '1.5px solid ' + (voll ? palette.text : palette.mid), background: voll ? palette.text : palette.surface, outline: aktuell ? '2px solid ' + palette.text + '40' : 'none', outlineOffset: '2px' } });
  const spalten = 'minmax(0, 7.5rem) minmax(0, 1fr)';
  return React.createElement('div', { style: { marginBottom: space.lg } },
    React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm, color: palette.text, marginBottom: space.sm } }, t('schulden.bild.stufenTitel')),
    React.createElement('div', { 'aria-hidden': 'true', style: { display: 'grid', gridTemplateColumns: spalten, gap: space.sm + 'px', fontSize: text.xs, color: palette.mid, marginBottom: '2px' } },
      React.createElement('span'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' } }, MAHNSTUFEN.map(k => React.createElement('span', { key: k }, t('schulden.stufe.' + k))))
    ),
    React.createElement('ul', { style: { listStyle: 'none', padding: 0, margin: 0 } },
      prioritized.map(d => {
        const stufe = leseStufe(d.stufe);
        const i = MAHNSTUFEN.indexOf(stufe);
        const weg = naechsterWeg(d);
        const lesart = (d.creditor || '—') + ': ' + (i >= 0 ? t('schulden.stufe.' + stufe) : t('schulden.bild.stufeOffen'));
        // Vorlesen: EIN Textknoten mit Name und Stufe; das Sichtbare daneben ist aria-hidden
        // (a11y-Prüfer 27.09.: aria-label auf li wird im Lesemodus nicht zuverlässig gelesen).
        return React.createElement('li', { key: d.id, style: { padding: '6px 0', borderTop: '1px solid ' + palette.border + '55' } },
          React.createElement('span', { style: visuallyHiddenStyle }, lesart),
          React.createElement('div', { 'aria-hidden': 'true', style: { display: 'grid', gridTemplateColumns: spalten, gap: space.sm + 'px', alignItems: 'center', fontSize: text.sm } },
            React.createElement('span', { style: { color: palette.text, overflowWrap: 'anywhere' } }, d.creditor || '—'),
            i < 0
              ? React.createElement('span', { style: { color: palette.mid, fontSize: text.xs } }, t('schulden.bild.stufeOffen'))
              : React.createElement('div', { 'aria-hidden': 'true', style: { position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'center' } },
                React.createElement('span', { style: { position: 'absolute', left: '5px', right: 'calc(33.333% - 5px)', top: '50%', height: '1.5px', background: palette.border } }),
                i > 0 && React.createElement('span', { style: { position: 'absolute', left: '5px', width: (i * 33.333) + '%', top: '50%', height: '1.5px', background: palette.text } }),
                MAHNSTUFEN.map((k, j) => React.createElement('span', { key: k }, punkt(j <= i, j === i)))
              )
          ),
          weg && onNavigate && React.createElement('div', { style: { paddingInlineStart: 'min(7.5rem, 40%)' } },
            React.createElement(AblaufLink, { palette, label: t(weg.key), onClick: () => onNavigate(weg.view) }))
        );
      })
    )
  );
};

// ① «Ausserdem offen» (Task 3, Schulden R2, 05.10.2026): eine ruhige Zeile unter dem Balken.
// Arztrechnungen aus dem KVG-Tracker stehen NICHT im Balken (eine Quelle je Wahrheit) — hier nur
// erwähnt, mit Weg dorthin. Ohne offene Beleg-Rechnungen: nichts. Kein Rot, nichts automatisch.
export const AusserdemOffen = ({ palette, t, posten, onNavigate }) => {
  const n = posten && posten.arzt ? posten.arzt.length : 0;
  if (n === 0) return null;
  const satz = t(n === 1 ? 'schulden.posten.ausserdemEins' : 'schulden.posten.ausserdem', { anzahl: n, betrag: chf(posten.summeArzt) });
  const frist = posten.naechsteFrist ? ' · ' + t('schulden.posten.naechsteFrist', { datum: formatDE(posten.naechsteFrist) }) : '';
  return React.createElement('div', { style: { marginBottom: space.lg, fontSize: text.sm, color: palette.text, lineHeight: 1.5 } },
    React.createElement('span', { style: { color: palette.text, fontVariantNumeric: 'tabular-nums' } }, satz + frist),
    onNavigate && React.createElement('div', null,
      React.createElement(AblaufLink, { palette, label: t('schulden.posten.zumTracker'), onClick: () => onNavigate('kvg') }))
  );
};

// ② «Offene Posten»: beide Ablagen nebeneinander gelesen — Arztrechnungen (KVG-Tracker) und
// Forderungen (Schuldenmanager). Nur lesen; die Summe ist die Summe der beiden Gruppen.
const forderungName = (f, t) => f.creditor
  || (f.belegDatum ? t('schulden.posten.rechnungVom', { datum: formatDE(f.belegDatum) }) : t('schulden.posten.ohneDatum'));

export const OffenePosten = ({ palette, t, posten, onNavigate }) => {
  const arzt = posten && posten.arzt ? posten.arzt : [];
  const forderungen = posten && posten.forderungen ? posten.forderungen : [];
  if (arzt.length + forderungen.length === 0) return null;
  const zeile = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.sm + 'px', padding: '6px 0', borderTop: '1px solid ' + palette.border + '55', fontSize: text.sm, color: palette.text };
  const betragStil = { color: palette.text, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
  const gruppenTitel = { fontSize: text.sm, color: palette.mid, margin: 0, fontWeight: weight.semi };
  const nebenText = { display: 'block', fontSize: text.xs, color: palette.mid };
  return React.createElement('section', { 'aria-labelledby': 'offene-posten-titel', style: { marginBottom: space.lg } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.sm + 'px', marginBottom: space.sm } },
      React.createElement('h3', { id: 'offene-posten-titel', style: { margin: 0, fontWeight: weight.semi, fontSize: text.body, color: palette.text } }, t('schulden.posten.titel')),
      React.createElement('span', { style: { ...betragStil, fontSize: text.lg, fontWeight: weight.semi } }, chf(posten.summe))
    ),
    arzt.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
      React.createElement('h4', { style: gruppenTitel }, t('schulden.posten.gruppeArzt')),
      React.createElement('ul', { style: { listStyle: 'none', padding: 0, margin: 0 } },
        arzt.map(b => React.createElement('li', { key: b.id, style: zeile },
          React.createElement('span', { style: { color: palette.text, overflowWrap: 'anywhere' } },
            b.datum ? t('schulden.posten.rechnungVom', { datum: formatDE(b.datum) }) : t('schulden.posten.ohneDatum'),
            b.frist && React.createElement('span', { style: nebenText }, t(b.abgelaufen ? 'schulden.posten.fristAbgelaufen' : 'schulden.posten.frist', { datum: formatDE(b.frist) }))),
          React.createElement('span', { style: betragStil }, chf(b.betrag))
        ))
      ),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('schulden.posten.zumTracker'), onClick: () => onNavigate('kvg') })
    ),
    forderungen.length > 0 && React.createElement('div', null,
      React.createElement('h4', { style: gruppenTitel }, t('schulden.posten.gruppeForderungen')),
      React.createElement('ul', { style: { listStyle: 'none', padding: 0, margin: 0 } },
        forderungen.map(f => React.createElement('li', { key: f.id, style: zeile },
          React.createElement('span', { style: { color: palette.text, overflowWrap: 'anywhere' } },
            forderungName(f, t),
            React.createElement('span', { style: nebenText },
              (f.stufe ? t('schulden.stufe.' + f.stufe) : t('schulden.stufe.keine')) + (f.ausBeleg ? ' · ' + t('schulden.posten.ausArzt') : ''))),
          React.createElement('span', { style: betragStil }, chf(f.amount))
        ))
      )
    )
  );
};
