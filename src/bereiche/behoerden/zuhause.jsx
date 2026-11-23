import React, { useState, useEffect } from 'react';
import { text, weight, space, leading, radius, duration, ease } from '../../config/tokens.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';
import { auswahlLabel } from '../../utils/auswahlLabel.js';
import { steuernFuerProfil, steuerEingabenAusDaten } from '../../data/kantonaleSteuerdaten.js';
import { zahl } from '../../utils/geld.js';
import { linkStil } from '../../components/PrimaryButton.jsx';
import { useEinkommen } from '../../components/EinkommenFeld.jsx';
import { ladeIPVModelle } from '../../config/cantonalData.js';
import { steuerfristLage, gaengeLage, leistungenLage, WEG_NAME } from './rechnung.js';
import { Anschlagbrett, Gemeindehaus, Wegweiser } from './bilder.jsx';

// Lebensbereich Behörden · der Ort (Bauplan Lebensbereich, Stebler Studios 18.11.2026; Behörden 21.11.2026, Skizze
// _werkbank/entwuerfe/behoerden-kapitel.html, «Ja, so bauen»).
//   BehoerdenStrasse  die eine Szene: Anschlagbrett (A) · Gemeindehaus (B) · Wegweiser mit Kompass (C), auf einem Boden.
//                     Unter jedem Teil seine Hauptzahl (Regel «Zahl», Matrix §10).
//   BehoerdenZuhause  Kapitel Behörden, gross 256: Szene, dann je Frage Satz und Weg, Zusätze unter «Mehr dazu».
// Ersetzt components/BehoerdenInstrument.jsx (Fassung 6, Runde 9 AD). Dessen Texte und Regeln bleiben: Frist mit
// Kalenderblatt und belegtem Hinweis bei verpasster Frist, Gänge mit Steuerjahr-Vorschlag, Testament mit Weg zur Vorsorge.

const SPRACHE = { de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en-GB', rm: 'de-CH' };
const zahlStil = { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' };
const BODEN = 150;

// «in 4 Monaten», «heute», «vor 12 Tagen»: dieselben Texte wie bisher im Kapitel.
const relativ = (t, ab) => {
  if (!ab) return '';
  if (ab.tage === 0) return t('behördenStatus.today');
  const k = ab.vorbei ? (ab.einheit === 'tage' ? 'behördenStatus.agoDays' : 'behördenStatus.ago') : (ab.einheit === 'tage' ? 'behördenStatus.inDays' : 'behördenStatus.inMonths');
  return t(k).replace('{n}', ab.n);
};
// Die Zahl unter dem Brett wie auf der Kachel: Zahl gross, Einheit klein («4 Monate», «12 Tage»), oder «heute».
// Einheit kleiner, damit sie in der schmalen Spalte unter dem Brett bleibt (gesehen 23.11.2026: «4 Monate» lief in «1/5»).
const fristZahl = (t, ab) => ab.tage === 0 ? t('behördenStatus.today') : [String(ab.n), React.createElement('span', {
  key: 'e', style: { fontSize: text.sm, fontWeight: weight.normal },
}, '\u00a0' + t('instrumente.' + ab.einheit + (ab.n === 1 ? 'Eins' : '')))];

// Der Satz unter dem Kompass und im Abschnitt Leistungen.
const kompassUnter = (t, k) => k.state === 'found' ? t(k.anzahl === 1 ? 'instrumente.kompassFoundOne' : 'instrumente.kompassFound', { n: k.anzahl })
  : k.state === 'none' ? t('instrumente.kompassNone') : t('instrumente.kompass');
const leistungenSatz = (t, k) => {
  if (k.state === 'laden') return t('common.loading');
  // Betrag da, aber brutto oder netto offen: derselbe Hinweis wie am Einkommensfeld der Übersicht.
  if (k.state === 'idle') return t(k.artOffen ? 'einkommensart.offenNetto' : 'schnellcheck.kompassIdle');
  if (k.state !== 'found') return t('schnellcheck.kompassNone');
  const namen = k.wege.map((w) => t(WEG_NAME[w.key] || w.key));
  return k.anzahl === 1 ? t('behoerdenZuhause.wegEins', { name: namen[0] }) : t('behoerdenZuhause.wege', { n: k.anzahl, liste: namen.join(', ') });
};

export const BehoerdenStrasse = ({ palette, t, frist, gaenge, leistungen, isDarkMode, onNavigate, lang = 'de' }) => {
  const h = React.createElement;
  const farbe = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  const boden = { height: BODEN + 'px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', borderBottom: '1px solid ' + palette.mid };
  const spalte = (breite, teil) => ({ 'data-teil': teil, style: { flex: '0 1 ' + breite + 'px', minWidth: 0, display: 'flex', flexDirection: 'column' } });
  const unter = (s, teil) => h('div', { 'data-teil': teil, style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.tight } }, s);
  const zahlDiv = (key, wert) => h('div', { 'data-instrument-zahl': key, 'aria-live': 'polite', style: { ...zahlStil, color: palette.text, marginTop: space.xs + 'px', overflowWrap: 'anywhere' } }, wert);
  return h('div', { 'data-teil': 'behoerden-strasse', style: { display: 'flex', alignItems: 'flex-start', gap: '0 ' + space.md + 'px', flexWrap: 'wrap', margin: '0 0 ' + space.sm + 'px' } },
    // Frage A · Anschlagbrett
    frist && h('div', spalte(84, 'strasse-frist'),
      h('div', { style: boden }, h(Anschlagbrett, { palette, iso: frist.iso, locale: SPRACHE[lang] || 'de-CH', vorbei: frist.vorbei, pfosten: 72 })),
      frist.zeigen && zahlDiv('steuerfrist', fristZahl(t, frist.abstand)),
      frist.zeigen && unter(t(frist.vorbei ? 'instrumente.steuerfristVorbeiSatz' : 'instrumente.steuerfristSatz'), 'frist-unter')),
    // Frage B · Gemeindehaus
    h('div', spalte(130, 'strasse-gemeindehaus'),
      h('div', { style: boden }, h('div', { style: { width: '100%' } }, h(Gemeindehaus, { palette, erledigt: gaenge.erledigt, total: gaenge.total, farbe }))),
      zahlDiv('gaenge', gaenge.erledigt + '/' + gaenge.total),
      unter(t('instrumente.gaengeSatz'), 'gaenge-unter')),
    // Frage C · Wegweiser mit Kompass, führt zu «Was steht mir zu?»
    h('div', spalte(84, 'strasse-wegweiser'),
      h('div', { style: boden },
        onNavigate
          ? h('button', { type: 'button', className: 'mp-link', 'data-teil': 'wegweiser-knopf', onClick: () => onNavigate('situationen'), 'aria-label': t('dashboard.anspruchTitle'),
            style: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: palette.text, display: 'flex', alignItems: 'flex-end' } },
          h(Wegweiser, { palette, kompass: leistungen, farbe }))
          : h(Wegweiser, { palette, kompass: leistungen, farbe })),
      // Eine Zahl nur bei gefundenen Wegen: eine grosse «0» läse sich als «Nein» (anspruchWege.js: nie ein Nein-Verdikt).
      leistungen.state === 'found' && zahlDiv('leistungen', String(leistungen.anzahl)),
      unter(kompassUnter(t, leistungen), 'kompass-unter')),
  );
};

// ── Kapitel Behörden (Zuhause, gross) ───────────────────────────────────────────────────────────────────────────────
const BehoerdenKapitel = ({ palette, t, behoerden, allData, onNavigate, checked = {}, onToggle, lang = 'de', isDarkMode }) => {
  const h = React.createElement;
  const d = behoerden || {};
  const heute = new Date();
  const frist = steuerfristLage(d, heute);
  const gaenge = gaengeLage(checked, d, heute);
  // Netto wie Übersicht und Schnellcheck (useEinkommen); nach dem Laden der IPV-Modelle einmal neu zeichnen.
  const e = useEinkommen(allData);
  const [fertig, setFertig] = useState(false);
  useEffect(() => {
    let aktiv = true;
    const ende = () => { if (aktiv) setFertig(true); };
    ladeIPVModelle().then(ende, ende);
    return () => { aktiv = false; };
  }, []);
  const [mehrOffen, setMehrOffen] = useState(false);
  const profil = { ...allData, finanzen: { ...allData?.finanzen, monthlyIncome: e.nettoMonat, incomeType: 'netto' } };
  const leistungen = { ...leistungenLage(profil, { fertig }), artOffen: e.offen };
  const loc = SPRACHE[lang] || 'de-CH';
  const kapH = { margin: space.lg + 'px 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const satz = { fontSize: text.sm, color: palette.text, lineHeight: leading.normal, margin: 0 };
  // F7-K5-1 (Stebler Studios 01.11.2026): dieselbe Steuerzahl wie Finanzen, nur mit erfasstem Lohn; Sperren in steuernFuerProfil.
  const steuerJahr = (Number(allData?.finanzen?.monthlyIncome) || 0) > 0
    ? steuernFuerProfil(steuerEingabenAusDaten(allData))?.kanton?.kantonal?.total : null;
  const zeilenKnopf = (key, titel, sub, onClick) => h('button', {
    key, type: 'button', className: 'mp-link', 'data-weg': key, onClick,
    style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', minHeight: '44px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid ' + palette.border + '88', padding: space.xs + 'px 0', cursor: 'pointer', fontFamily: 'inherit', color: palette.text },
  },
    h('span', { style: { flex: 1, minWidth: 0 } },
      h('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, titel),
      sub && h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, sub)),
    h('span', { 'aria-hidden': 'true', style: { color: palette.mid } }, '›'));

  // Frage A · Steuerfrist: Satz, Abstand und offene Erklärungen, Wege zu Steuern und Finanzen.
  const datum = frist ? new Date(frist.iso + 'T12:00:00') : null;
  const abschnittFrist = frist && h('section', { 'data-teil': 'steuerfrist', 'aria-labelledby': 'mp-steuerfrist' },
    h('h3', { id: 'mp-steuerfrist', style: kapH }, t('behördenStatus.taxDeadline')),
    h('p', { style: satz }, t('behoerdenInstrument.faellig', { datum: datum.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }) })),
    h('p', { style: { ...klein, margin: '2px 0 0' } }, relativ(t, frist.abstand) + (frist.offen != null ? ' · ' + t('behoerdenInstrument.offen', { n: frist.offen }) : '')),
    frist.vorbei && h('p', { role: 'note', style: { ...satz, margin: space.sm + 'px 0 0', lineHeight: leading.relaxed } }, t('behördenStatus.pastHint')),
    onNavigate && h('div', { style: { marginTop: space.sm + 'px' } },
      zeilenKnopf('steuern', t('behoerdenInstrument.allesSteuern'), t('behoerdenInstrument.allesSteuernSub'), () => onNavigate('tax')),
      zeilenKnopf('finanzen', t('behoerdenInstrument.zuFinanzen'), steuerJahr != null
        ? t('instrumente.steuerGanz', { total: zahl(steuerJahr) }) + ' · ' + t('tax.roughEstimateBadge') + ' · ' + t('behoerdenInstrument.zuFinanzenSub')
        : t('behoerdenInstrument.zuFinanzenSub'), () => onNavigate('chapter', 2))));

  // Frage B · Behördengänge: die Haken schalten die Fenster im Gemeindehaus.
  const abschnittGaenge = h('section', { 'data-teil': 'behoerdengaenge', 'aria-labelledby': 'mp-behoerdengaenge' },
    h('h3', { id: 'mp-behoerdengaenge', style: kapH }, t('behoerdenInstrument.gaenge')),
    h('p', { style: { ...klein, margin: '0 0 ' + space.xs + 'px' } }, t('checklist.intro'), ' ', t('behoerdenInstrument.vonErledigt', { n: gaenge.erledigt, total: gaenge.total })),
    ...gaenge.liste.map((g) => h('div', { key: g.id, 'data-gang': g.id, style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', borderBottom: '1px solid ' + palette.border + '33', minHeight: '44px' } },
      h('label', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', flex: 1, minWidth: 0, minHeight: '44px', cursor: 'pointer', fontSize: text.sm, color: palette.text } },
        h('input', { type: 'checkbox', checked: g.erledigt, onChange: () => onToggle && onToggle(g.id, !g.erledigt), style: { accentColor: palette.sand, flexShrink: 0, width: '18px', height: '18px' } }),
        // «Steuererklärung 2025 eingereicht» statt ohne Jahr — sonst stünde sie angehakt neben der Frist fürs nächste Jahr.
        h('span', { style: { color: g.erledigt ? palette.mid : palette.text } },
          g.jahr != null ? t('behoerdenInstrument.steuererklaerungJahr', { jahr: g.jahr }) : t(g.key),
          g.vorschlag && h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, t('behoerdenInstrument.vorschlag')))),
      g.weg && onNavigate && h('button', {
        type: 'button', className: 'mp-link', onClick: () => onNavigate(g.weg),
        style: { ...linkStil(palette), fontSize: text.xs, minHeight: '44px', padding: '0 4px', whiteSpace: 'nowrap' },
      }, t(g.wegKey), ' ›'))));

  // Frage C · Leistungen: ein Hinweis aus den Angaben, kein Anspruch. Der Weg führt zu «Was steht mir zu?».
  const abschnittLeistungen = h('section', { 'data-teil': 'leistungen', 'aria-labelledby': 'mp-leistungen' },
    h('h3', { id: 'mp-leistungen', style: kapH }, t('behoerdenZuhause.leistungen')),
    h('p', { 'data-teil': 'leistungen-satz', style: satz }, leistungenSatz(t, leistungen)),
    leistungen.state === 'found' && h('p', { style: { ...klein, margin: '2px 0 0' } }, t('behoerdenZuhause.hinweis')),
    onNavigate && h('div', { style: { marginTop: space.sm + 'px' } },
      zeilenKnopf('situationen', t('dashboard.anspruchTitle'), t('behoerdenZuhause.anspruchSub'), () => onNavigate('situationen'))));

  // Mehr dazu: Testament (Für den Fall der Fälle), Behörden-Dossier, Sozialhilfe (zu Hause in Finanzen).
  const testament = auswahlLabel('behoerden', 'willMade', d.willMade, t) || t('behoerdenInstrument.nichtErfasst');
  const mehr = h('details', { 'data-teil': 'behoerden-mehr', onToggle: (ev) => setMehrOffen(ev.currentTarget.open), style: { marginTop: space.md + 'px', borderTop: '1px solid ' + palette.border + '88', paddingTop: space.sm + 'px' } },
    h('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text, listStyle: 'none' } },
      h('span', null, t('wohnenInstrument.mehrDazu')),
      h('span', { 'aria-hidden': 'true', style: { fontSize: text.lg, lineHeight: 1, color: palette.mid, transform: mehrOffen ? 'rotate(90deg)' : 'none', transition: 'transform ' + duration.fast + 'ms ' + ease } }, '›')),
    h('section', { 'data-teil': 'fall-der-faelle', 'aria-labelledby': 'mp-fall-der-faelle' },
      h('h3', { id: 'mp-fall-der-faelle', style: { ...kapH, marginTop: space.xs + 'px' } }, t('behoerdenInstrument.fallTitel')),
      h('p', { style: { ...klein, margin: '0 0 ' + space.sm + 'px' } }, t('behoerdenInstrument.fallSatz')),
      h('div', { style: { padding: space.sm + 'px', borderRadius: radius.md, background: palette.up } },
        h('div', { style: { fontSize: text.xs, color: palette.mid } }, t('behördenStatus.will')),
        h('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, overflowWrap: 'break-word' } }, testament)),
      onNavigate && h('div', { style: { marginTop: space.sm + 'px' } },
        zeilenKnopf('vorsorge', t('behoerdenInstrument.vorsorgeImNotfall'), t('behoerdenInstrument.vorsorgeWegSub'), () => onNavigate('notfallvorsorge')))),
    onNavigate && h('div', { style: { marginTop: space.sm + 'px' } },
      zeilenKnopf('dossier', t('behoerdenDossier.title'), t('behoerdenDossier.subtitle'), () => onNavigate('behoerdendossier')),
      zeilenKnopf('sozialhilfe', t('nav.sozialhilfe'), t('behoerdenInstrument.zuFinanzenSub'), () => onNavigate('sozialhilfe'))));

  return h('div', { 'data-teil': 'behoerden-instrument', style: { marginBottom: space.lg + 'px' } },
    h(BehoerdenStrasse, { palette, t, frist, gaenge, leistungen, isDarkMode, onNavigate, lang }),
    abschnittFrist, abschnittGaenge, abschnittLeistungen, mehr);
};

// useEinkommen liest das Profil nur beim ersten Zeichnen: ändert sich das Einkommen (auch Beispiel an/aus), neu beginnen.
export const BehoerdenZuhause = (props) => {
  const f = props.allData?.finanzen;
  return React.createElement(BehoerdenKapitel, { ...props, key: [f?.monthlyIncome, f?.incomeType].join('|') });
};
