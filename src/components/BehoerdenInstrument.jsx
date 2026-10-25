import React from 'react';
import { text, weight, radius, space, leading } from '../config/tokens.js';
import { steuerfristVorbei } from '../utils/steuerfrist.js';

// Kapitel Behörden · oben (Fassung 6, Runde 9, Entwurf AD, Entscheid Sophie 24.10.2026; gebaut Abnahme 25.10.2026).
// Ersetzt den Kasten «Folgende Stände und Fristen sind erfasst» (er wiederholte die Angaben) und die zugeklappte
// «Behörden-Checkliste»:
//   1. Steuerfrist als Kalenderblatt mit «fällig am …», wann, wie viele offen; Weg zu Steuern und — Entscheid
//      «Steuern aufteilen» — zum Kapitel Finanzen, wo Betrag und Belastung stehen. Der Hinweis bei verpasster Frist
//      (belegt DBG/StHG, Fachprüfung 21.10.2026) bleibt.
//   2. Behördengänge offen, mit Wegen zu den Werkzeugen. «Steuererklärung eingereicht» gilt als erledigt, wenn
//      «Offene Steuererklärungen» 0 ist — bis man es selbst abwählt. Die Patientenverfügung steht nicht mehr hier.
//   3. «Für den Fall der Fälle»: Testament (dieses Kapitel), Vorsorgeauftrag und Patientenverfügung (eingetragen im
//      Kapitel Notfall, hier nur angezeigt), mit Weg zu «Vorsorgeauftrag & Patientenverfügung».

const SPRACHE = { de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en-GB', rm: 'de-CH' };

export const GAENGE = [
  { id: 'steuererklaerung', key: 'checklist.steuererklaerung', weg: 'tax', wegKey: 'behoerdenInstrument.wegSteuern' },
  { id: 'betreibungsauszug', key: 'checklist.betreibungsauszug', weg: 'betreibungsauszug', wegKey: 'behoerdenInstrument.wegSoGehts' },
  { id: 'ausweisRenewal', key: 'checklist.ausweisRenewal', weg: 'ausweis', wegKey: 'behoerdenInstrument.wegAblauf' },
  { id: 'wohnsitzbestaetigung', key: 'checklist.wohnsitzbestaetigung' },
  { id: 'strafregisterauszug', key: 'checklist.strafregisterauszug' },
];

// «Offene Steuererklärungen» als Zahl — leer, null und Leerzeichen heissen «nicht erfasst» (wie utils/steuerfrist.js).
export const offeneErklaerungen = (behoerden) => {
  const roh = behoerden?.pendingTaxReturns;
  if (roh == null || String(roh).trim() === '') return null;
  const n = Number(String(roh).trim());
  return Number.isFinite(n) ? n : null;
};

// Welches Steuerjahr mit «0 offen» erledigt ist (Fachprüfung 25.10.2026): die erfasste Frist gilt für das Jahr davor;
// liegt sie noch vor uns, ist erst die Erklärung des Jahres davor eingereicht. Ohne Frist kein Jahr, kein Vorschlag.
export const erledigtesSteuerjahr = (behoerden, heute = new Date()) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(behoerden?.taxFilingDeadline || ''));
  if (!m || offeneErklaerungen(behoerden) !== 0) return null;
  const frist = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return frist >= new Date(heute.getFullYear(), heute.getMonth(), heute.getDate()) ? Number(m[1]) - 2 : Number(m[1]) - 1;
};

// Erledigt: eigener Haken; sonst bei «Steuererklärung eingereicht» der Vorschlag aus «0 offen» — mit Steuerjahr.
export const gangErledigt = (id, checked, behoerden, heute) =>
  checked[id] !== undefined ? !!checked[id] : (id === 'steuererklaerung' && erledigtesSteuerjahr(behoerden, heute) != null);

const relativ = (tr, iso) => {
  const diffDays = Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
  if (diffDays === 0) return tr('behördenStatus.today');
  if (diffDays > 0 && diffDays < 60) return tr('behördenStatus.inDays').replace('{n}', diffDays);
  if (diffDays >= 60) return tr('behördenStatus.inMonths').replace('{n}', Math.round(diffDays / 30));
  if (diffDays > -60) return tr('behördenStatus.agoDays').replace('{n}', Math.abs(diffDays));
  return tr('behördenStatus.ago').replace('{n}', Math.round(Math.abs(diffDays) / 30));
};

export const BehoerdenInstrument = ({ palette, t: tr, behoerden, allData, onNavigate, checked = {}, onToggle, lang = 'de' }) => {
  const d = behoerden || {};
  const h = React.createElement;
  const kapH = { margin: space.lg + 'px 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const zeilenKnopf = (key, titel, sub, onClick) => h('button', {
    key, type: 'button', className: 'mp-link', onClick,
    style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', minHeight: '44px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid ' + palette.border + '88', padding: space.xs + 'px 0', cursor: 'pointer', fontFamily: 'inherit', color: palette.text },
  },
    h('span', { style: { flex: 1, minWidth: 0 } },
      h('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.medium } }, titel),
      sub && h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, sub)),
    h('span', { 'aria-hidden': 'true', style: { color: palette.mid } }, '›'));

  // 1. Steuerfrist
  const iso = d.taxFilingDeadline;
  // Mittags, damit keine Zeitzone das Datum auf den Vortag schiebt.
  const datum = iso && !isNaN(new Date(String(iso).slice(0, 10) + 'T12:00:00').getTime()) ? new Date(String(iso).slice(0, 10) + 'T12:00:00') : null;
  const loc = SPRACHE[lang] || 'de-CH';
  const n = new Date();
  const heute = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
  const frist = datum && h('section', { 'data-teil': 'steuerfrist', 'aria-labelledby': 'mp-steuerfrist' },
    h('h4', { id: 'mp-steuerfrist', style: { ...kapH, marginTop: 0 } }, tr('behördenStatus.taxDeadline')),
    h('div', { style: { display: 'flex', gap: space.md + 'px', alignItems: 'center' } },
      // Kalenderblatt: Monat · Tag · Jahr; das Datum steht im Satz daneben — fürs Vorlesen stumm.
      h('div', { 'aria-hidden': 'true', 'data-teil': 'kalenderblatt', style: { flexShrink: 0, width: '64px', textAlign: 'center', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, overflow: 'hidden' } },
        h('div', { style: { fontSize: '11px', fontWeight: weight.semi, letterSpacing: '0.5px', textTransform: 'uppercase', background: palette.up, color: palette.text, padding: '2px 0' } }, datum.toLocaleDateString(loc, { month: 'short' }).replace('.', '')),
        h('div', { style: { fontSize: text.xl || '22px', fontWeight: weight.bold, color: palette.text, lineHeight: 1.2, paddingTop: '2px' } }, String(datum.getDate())),
        h('div', { style: { fontSize: '11px', color: palette.mid, paddingBottom: '3px' } }, String(datum.getFullYear()))
      ),
      h('div', { style: { minWidth: 0 } },
        h('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: leading.normal } }, tr('behoerdenInstrument.faellig', { datum: datum.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }) })),
        h('div', { style: klein }, relativ(tr, iso) + (offeneErklaerungen(d) != null ? ' · ' + tr('behoerdenInstrument.offen', { n: offeneErklaerungen(d) }) : ''))
      )
    ),
    steuerfristVorbei(d, heute) && h('p', { role: 'note', style: { fontSize: text.sm, color: palette.text, margin: space.sm + 'px 0 0', lineHeight: leading.relaxed } }, tr('behördenStatus.pastHint')),
    onNavigate && h('div', { style: { marginTop: space.sm + 'px' } },
      zeilenKnopf('steuern', tr('behoerdenInstrument.allesSteuern'), tr('behoerdenInstrument.allesSteuernSub'), () => onNavigate('tax')),
      zeilenKnopf('finanzen', tr('behoerdenInstrument.zuFinanzen'), tr('behoerdenInstrument.zuFinanzenSub'), () => onNavigate('chapter', 2)))
  );

  // 2. Behördengänge
  const erledigt = GAENGE.filter((g) => gangErledigt(g.id, checked, d)).length;
  const gaenge = h('section', { 'data-teil': 'behoerdengaenge', 'aria-labelledby': 'mp-behoerdengaenge' },
    h('h4', { id: 'mp-behoerdengaenge', style: datum ? kapH : { ...kapH, marginTop: 0 } }, tr('behoerdenInstrument.gaenge')),
    h('p', { style: { ...klein, margin: '0 0 ' + space.xs + 'px' } }, tr('checklist.intro'), ' ', tr('behoerdenInstrument.vonErledigt', { n: erledigt, total: GAENGE.length })),
    ...GAENGE.map((g) => {
      const ist = gangErledigt(g.id, checked, d);
      // «Steuererklärung 2025 eingereicht» statt ohne Jahr — sonst stünde sie angehakt neben der Frist fürs nächste Jahr.
      const jahr = g.id === 'steuererklaerung' ? erledigtesSteuerjahr(d) : null;
      const vorschlag = jahr != null && checked[g.id] === undefined;
      return h('div', { key: g.id, style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', borderBottom: '1px solid ' + palette.border + '33', minHeight: '44px' } },
        h('label', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', flex: 1, minWidth: 0, minHeight: '44px', cursor: 'pointer', fontSize: text.sm } },
          h('input', { type: 'checkbox', checked: ist, onChange: () => onToggle && onToggle(g.id, !ist), style: { accentColor: palette.sand, flexShrink: 0, width: '18px', height: '18px' } }),
          h('span', { style: { color: ist ? palette.mid : palette.text } },
            jahr != null ? tr('behoerdenInstrument.steuererklaerungJahr', { jahr }) : tr(g.key),
            vorschlag && h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, tr('behoerdenInstrument.vorschlag')))),
        g.weg && onNavigate && h('button', {
          type: 'button', className: 'mp-link', onClick: () => onNavigate(g.weg),
          style: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs, color: palette.sandDeep || palette.mid, minHeight: '44px', padding: '0 4px', whiteSpace: 'nowrap' },
        }, tr(g.wegKey), ' ›'));
    })
  );

  // 3. Für den Fall der Fälle
  const nf = allData?.notfall || {};
  const opt = (kap, feld, wert) => (wert ? (tr('chapters.' + kap + '.fields.' + feld + '.options.' + wert) || wert) : tr('behoerdenInstrument.nichtErfasst'));
  const vorsorge = [
    { key: 'testament', name: tr('behördenStatus.will'), wert: opt('behoerden', 'willMade', d.willMade) },
    { key: 'vorsorgeauftrag', name: tr('behoerdenInstrument.vorsorgeauftrag'), wert: opt('notfall', 'vorsorgeauftrag', nf.vorsorgeauftrag) },
    { key: 'patientenverfuegung', name: tr('behoerdenInstrument.patientenverfuegung'), wert: opt('notfall', 'patientenverfuegung', nf.patientenverfuegung) },
  ];
  const fall = h('section', { 'data-teil': 'fall-der-faelle', 'aria-labelledby': 'mp-fall-der-faelle' },
    h('h4', { id: 'mp-fall-der-faelle', style: kapH }, tr('behoerdenInstrument.fallTitel')),
    h('p', { style: { ...klein, margin: '0 0 ' + space.sm + 'px' } }, tr('behoerdenInstrument.fallSatz')),
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: space.sm + 'px' } },
      ...vorsorge.map((x) => h('div', { key: x.key, style: { padding: space.sm + 'px', borderRadius: radius.sm, background: palette.up, minWidth: 0 } },
        h('div', { style: { fontSize: text.xs, color: palette.mid, hyphens: 'auto', WebkitHyphens: 'auto', overflowWrap: 'break-word' } }, x.name),
        h('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, overflowWrap: 'break-word' } }, x.wert)))),
    onNavigate && h('div', { style: { marginTop: space.sm + 'px' } },
      zeilenKnopf('vorsorge', tr('behoerdenInstrument.vorsorgeWeg'), tr('behoerdenInstrument.vorsorgeWegSub'), () => onNavigate('vorsorgeauftrag')))
  );

  return h('div', { 'data-teil': 'behoerden-instrument', style: { marginBottom: space.lg + 'px' } }, frist, gaenge, fall);
};

export default BehoerdenInstrument;
