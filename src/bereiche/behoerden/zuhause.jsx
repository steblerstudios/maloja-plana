import React, { useState, useEffect } from 'react';
import { text, weight, space, leading, radius } from '../../config/tokens.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';
import { auswahlLabel } from '../../utils/auswahlLabel.js';
import { steuernFuerProfil, steuerEingabenAusDaten } from '../../data/kantonaleSteuerdaten.js';
import { zahl } from '../../utils/geld.js';
import { linkStil, auswahlStil } from '../../components/PrimaryButton.jsx';
import { useEinkommen } from '../../components/EinkommenFeld.jsx';
import { ladeIPVModelle } from '../../config/cantonalData.js';
import { getCantonName } from '../../config/kantonPLZ.js';
import { Icon } from '../../IconSystem.jsx';
import { steuerfristLage, gaengeLage, leistungenLage, WEG_NAME } from './rechnung.js';
import { Anschlagbrett, Gemeindehaus, Wegweiser } from './bilder.jsx';

// Lebensbereich Behörden · der Ort (Bauplan Lebensbereich, Stebler Studios 18.11.2026; Behörden 21.11.2026).
// Erste Runde: Skizze _werkbank/entwuerfe/behoerden-kapitel.html, PR #916. Zweite Runde (23.11.2026, «hmm ja guter anfang»
// → Skizze behoerden-kapitel-2.html, «Ja, so bauen»), nach dem Muster von Wohnen:
//   1 Kopf: wo die Steuern laufen, gross; Steuernummer, offene Erklärungen, zuletzt eingereicht klein; «ändern ›» am Kopf.
//   2 Fenster antippen: jedes Fenster ist ein Gang; die Karte darunter zeigt ihn mit Haken und Weg (statt der Liste).
//   3 Rand: Betreibungsregister, Rechtsbeistand, Testament, je mit eigenem Zeichen.
//   4 Erklärungen am Bild: Frist und Leistungen klappen unter der Szene auf; keine Abschnitte, kein «Mehr dazu».
//   BehoerdenStrasse  die Szene: Anschlagbrett (A) · Gemeindehaus (B) · Wegweiser mit Kompass (C), Zahl unter jedem Teil.
//   BehoerdenZuhause  Kapitel Behörden, gross 256.
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
}, ' ' + t('instrumente.' + ab.einheit + (ab.n === 1 ? 'Eins' : '')))];

// Der Satz unter dem Kompass und in der Erklärung zu den Leistungen.
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
// Feldname aus dem Kapitel: manche Felder tragen ein Objekt { label, options }.
const feldName = (t, k) => { const v = t('chapters.behoerden.fields.' + k); return v && typeof v === 'object' ? v.label : v; };

// Name des Gangs, mit Steuerjahr, wenn «Steuererklärung eingereicht» aus «0 offen» folgt.
const gangName = (t, g) => (g.jahr != null ? t('behoerdenInstrument.steuererklaerungJahr', { jahr: g.jahr }) : t(g.key));

// `erkl`: welche Erklärung offen ist ('frist' | 'leistungen' | null) und wie sie umschaltet. Die Knöpfe stehen unter dem
// Bild, der Text darunter in voller Breite (die Spalten sind zu schmal für Sätze).
export const BehoerdenStrasse = ({ palette, t, frist, gaenge, leistungen, isDarkMode, lang = 'de', aktiv = null, onWaehle = null, erkl = null }) => {
  const h = React.createElement;
  const farbe = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  const boden = { height: BODEN + 'px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', borderBottom: '1px solid ' + palette.mid };
  const spalte = (breite, teil) => ({ 'data-teil': teil, style: { flex: '0 1 ' + breite + 'px', minWidth: 0, display: 'flex', flexDirection: 'column' } });
  const unter = (s, teil) => h('div', { 'data-teil': teil, style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.tight } }, s);
  const zahlDiv = (key, wert) => h('div', { 'data-instrument-zahl': key, 'aria-live': 'polite', style: { ...zahlStil, color: palette.text, marginTop: space.xs + 'px', overflowWrap: 'anywhere' } }, wert);
  const erklKnopf = (key, label) => erkl && h('button', {
    type: 'button', className: 'mp-link', 'data-erkl': key, 'aria-expanded': erkl.offen === key ? 'true' : 'false', 'aria-controls': 'mp-erkl-' + key,
    onClick: () => erkl.umschalten(key),
    style: { ...linkStil(palette), minHeight: '44px', fontSize: text.sm, padding: 0, textAlign: 'left', fontWeight: weight.semi, color: palette.goldDeep, textDecoration: 'none' },
  }, label + (erkl.offen === key ? '' : ' ›'));
  const fenster = gaenge.liste.map((g) => ({ an: g.erledigt, label: gangName(t, g) + ', ' + t(g.erledigt ? 'behoerdenZuhause.erledigt' : 'behoerdenZuhause.offenWort') }));
  return h('div', { 'data-teil': 'behoerden-strasse', style: { display: 'flex', alignItems: 'flex-start', gap: '0 ' + space.md + 'px', flexWrap: 'wrap', margin: '0 0 ' + space.sm + 'px' } },
    // Frage A · Anschlagbrett
    frist && h('div', spalte(84, 'strasse-frist'),
      h('div', { style: boden }, h(Anschlagbrett, { palette, iso: frist.iso, locale: SPRACHE[lang] || 'de-CH', vorbei: frist.vorbei, pfosten: 72 })),
      frist.zeigen && zahlDiv('steuerfrist', fristZahl(t, frist.abstand)),
      frist.zeigen && unter(t(frist.vorbei ? 'instrumente.steuerfristVorbeiSatz' : 'instrumente.steuerfristSatz'), 'frist-unter'),
      erklKnopf('frist', t('behoerdenZuhause.fristMehr'))),
    // Frage B · Gemeindehaus, die Fenster sind die Gänge
    h('div', spalte(130, 'strasse-gemeindehaus'),
      h('div', { style: boden }, h('div', { style: { width: '100%' } },
        h(Gemeindehaus, { palette, fenster, aktiv, onWaehle, farbe, label: t('behoerdenZuhause.hausAria') }))),
      zahlDiv('gaenge', gaenge.erledigt + '/' + gaenge.total),
      unter(t('instrumente.gaengeSatz'), 'gaenge-unter')),
    // Frage C · Wegweiser mit Kompass
    h('div', spalte(84, 'strasse-wegweiser'),
      h('div', { style: boden }, h(Wegweiser, { palette, kompass: leistungen, farbe })),
      // Eine Zahl nur bei gefundenen Wegen: eine grosse «0» läse sich als «Nein» (anspruchWege.js: nie ein Nein-Verdikt).
      leistungen.state === 'found' && zahlDiv('leistungen', String(leistungen.anzahl)),
      unter(kompassUnter(t, leistungen), 'kompass-unter'),
      erklKnopf('leistungen', t('behoerdenZuhause.leistungenMehr'))),
  );
};

// ── Kapitel Behörden (Zuhause, gross) ───────────────────────────────────────────────────────────────────────────────
// `angaben` (aus ChapterView, wie bei Wohnen): { offen(k), umschalten(k), formular(k) }. Die Abschnitte Steuern
// ('cantoneOfTaxation'), Recht ('registryOffice') und Vertretung ('legalRepresentative') öffnen ihr Formular am Bild.
const BehoerdenKapitel = ({ palette, t, behoerden, allData, onNavigate, checked = {}, onToggle, lang = 'de', isDarkMode, angaben = null }) => {
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
  // Anfangs gewählt: der erste Gang, wie in der Skizze (die Steuererklärung mit ihrem Jahr und dem Vorschlag).
  const [gangIndex, setGangIndex] = useState(0);
  const [erklOffen, setErklOffen] = useState(null);
  const profil = { ...allData, finanzen: { ...allData?.finanzen, monthlyIncome: e.nettoMonat, incomeType: 'netto' } };
  const leistungen = { ...leistungenLage(profil, { fertig }), artOffen: e.offen };
  const loc = SPRACHE[lang] || 'de-CH';
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const satz = { fontSize: text.sm, color: palette.text, lineHeight: leading.normal, margin: 0 };
  const trenner = { borderTop: '1px solid ' + palette.border + '88', paddingTop: space.sm + 'px', marginTop: space.md + 'px' };
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
  const weg = (label, ziel, key) => onNavigate && h('button', {
    type: 'button', className: 'mp-link', 'data-weg': key, onClick: ziel,
    style: { ...linkStil(palette), minHeight: '44px', fontSize: text.sm, padding: 0, textAlign: 'left' },
  }, label + ' ›');
  // «ändern ›» / «ergänzen ›» am Bild und das Formular an seiner Stelle (wie Wohnen).
  const aendern = (k, wort = 'aendern') => angaben && !angaben.offen(k) && h('button', {
    type: 'button', className: 'mp-link', 'data-aendern': k, onClick: () => angaben.umschalten(k),
    style: { ...linkStil(palette), minHeight: '44px', fontSize: text.sm, padding: 0, fontWeight: weight.semi, color: palette.sandDeep || palette.goldDeep, textDecoration: 'none' },
  }, t('wohnenKopf.' + wort) + ' ›');
  const formular = (k) => angaben && angaben.offen(k) && h('div', { key: 'f-' + k, 'data-szene-formular': k, style: { margin: space.sm + 'px 0' } }, angaben.formular(k));

  // 1 · Kopf: wo die Steuern laufen, gross.
  const kantonCode = d.cantoneOfTaxation || allData?.basis?.canton || '';
  const offen = frist ? frist.offen : null;
  const eingereicht = gaenge.liste[0]?.id === 'steuererklaerung' ? gaenge.liste[0].jahr : null;
  const kleineZahl = (label, wert, teil) => h('div', { key: teil, 'data-kopf-teil': teil, style: { minWidth: 0 } },
    h('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.tight } }, label),
    h('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' } }, wert));
  const kopf = h('div', { 'data-teil': 'behoerden-kopf', style: { marginBottom: space.md + 'px' } },
    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.sm + 'px', flexWrap: 'wrap' } },
      h('div', { 'data-teil': 'kopf-kanton', style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.15, color: palette.text } },
        kantonCode ? t('behoerdenZuhause.kanton', { kanton: getCantonName(kantonCode, t) }) : t('behoerdenZuhause.kantonOffen'),
        h('span', { style: { fontSize: text.sm, fontWeight: weight.normal, color: palette.mid } }, ' ' + t('behoerdenZuhause.kopfZusatz'))),
      aendern('cantoneOfTaxation', kantonCode ? 'aendern' : 'ergaenzen')),
    h('div', { style: { display: 'flex', gap: space.xs + 'px ' + space.lg + 'px', flexWrap: 'wrap', marginTop: space.sm + 'px' } },
      String(d.taxId || '').trim() && kleineZahl(feldName(t, 'taxId'), String(d.taxId).trim(), 'steuernummer'),
      offen != null && kleineZahl(t('behoerdenZuhause.offen'), String(offen), 'offen'),
      eingereicht != null && kleineZahl(t('behoerdenZuhause.eingereicht'), String(eingereicht), 'eingereicht')),
    formular('cantoneOfTaxation'));

  // 4 · Erklärungen am Bild, in voller Breite unter der Szene. Der Text steht immer im Dokument (`hidden`), damit er
  // vorlesbar und auffindbar bleibt; eine verpasste Frist steht offen da, nicht zum Aufklappen.
  const datum = frist ? new Date(frist.iso + 'T12:00:00') : null;
  const erklaerungFrist = frist && h('div', { id: 'mp-erkl-frist', 'data-teil': 'steuerfrist', hidden: erklOffen !== 'frist', style: { margin: space.sm + 'px 0' } },
    h('p', { style: satz }, t('behoerdenInstrument.faellig', { datum: datum.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }) })),
    h('p', { style: { ...klein, margin: '2px 0 0' } }, relativ(t, frist.abstand) + (frist.offen != null ? ' · ' + t('behoerdenInstrument.offen', { n: frist.offen }) : '')),
    onNavigate && h('div', { style: { marginTop: space.sm + 'px' } },
      zeilenKnopf('steuern', t('behoerdenInstrument.allesSteuern'), t('behoerdenInstrument.allesSteuernSub'), () => onNavigate('tax')),
      zeilenKnopf('finanzen', t('behoerdenInstrument.zuFinanzen'), steuerJahr != null
        ? t('instrumente.steuerGanz', { total: zahl(steuerJahr) }) + ' · ' + t('tax.roughEstimateBadge') + ' · ' + t('behoerdenInstrument.zuFinanzenSub')
        : t('behoerdenInstrument.zuFinanzenSub'), () => onNavigate('chapter', 2))));
  const fristVorbeiHinweis = frist && frist.vorbei && h('p', { role: 'note', 'data-teil': 'frist-vorbei', style: { ...satz, margin: space.sm + 'px 0', lineHeight: leading.relaxed } }, t('behördenStatus.pastHint'));
  const erklaerungLeistungen = h('div', { id: 'mp-erkl-leistungen', 'data-teil': 'leistungen', hidden: erklOffen !== 'leistungen', style: { margin: space.sm + 'px 0' } },
    h('p', { 'data-teil': 'leistungen-satz', style: satz }, leistungenSatz(t, leistungen)),
    leistungen.state === 'found' && h('p', { style: { ...klein, margin: '2px 0 0' } }, t('behoerdenZuhause.hinweis')),
    onNavigate && h('div', { style: { marginTop: space.sm + 'px' } },
      zeilenKnopf('situationen', t('dashboard.anspruchTitle'), t('behoerdenZuhause.anspruchSub'), () => onNavigate('situationen')),
      zeilenKnopf('sozialhilfe', t('nav.sozialhilfe'), t('behoerdenInstrument.zuFinanzenSub'), () => onNavigate('sozialhilfe'))));

  // 2 · Gang-Karte: der gewählte Gang mit Haken und Weg; die Leiste erreicht jeden Gang auch ohne Bild.
  const g = gaenge.liste[Math.min(gangIndex, gaenge.liste.length - 1)];
  const gangKarte = g && h('div', { 'data-teil': 'behoerdengaenge', style: { marginTop: space.sm + 'px', border: '1px solid ' + palette.border, borderRadius: radius.lg + 'px', padding: space.sm + 'px ' + space.md + 'px' } },
    h('div', { 'data-teil': 'gang-karte', 'data-gang': g.id, 'aria-live': 'polite', style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', flexWrap: 'wrap' } },
      h('label', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', flex: '1 1 200px', minWidth: 0, minHeight: '44px', cursor: 'pointer', fontSize: text.sm, color: palette.text } },
        h('input', { type: 'checkbox', checked: g.erledigt, onChange: () => onToggle && onToggle(g.id, !g.erledigt), style: { accentColor: palette.sand, flexShrink: 0, width: '20px', height: '20px' } }),
        h('span', { style: { color: palette.text, fontWeight: weight.medium } },
          gangName(t, g),
          g.vorschlag && h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid, fontWeight: weight.normal } }, t('behoerdenInstrument.vorschlag')))),
      g.weg && weg(t(g.wegKey), () => onNavigate(g.weg), 'gang-' + g.id)),
    h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('behoerdenInstrument.vonErledigt', { n: gaenge.erledigt, total: gaenge.total }) + ' ' + t('behoerdenZuhause.fensterTipp')),
    h('div', { role: 'group', 'aria-label': t('behoerdenZuhause.gangWaehlen'), style: { display: 'flex', gap: space.xs + 'px', flexWrap: 'wrap', marginTop: space.xs + 'px' } },
      gaenge.liste.map((x, i) => h('button', {
        key: x.id, type: 'button', 'data-gang-knopf': x.id, 'aria-label': gangName(t, x) + ', ' + t(x.erledigt ? 'behoerdenZuhause.erledigt' : 'behoerdenZuhause.offenWort'), 'aria-pressed': i === gangIndex ? 'true' : 'false', onClick: () => setGangIndex(i),
        style: { ...auswahlStil(palette, i === gangIndex), minHeight: '44px', padding: '0 ' + space.ms + 'px', fontSize: text.xs, fontWeight: weight.normal, display: 'inline-flex', alignItems: 'center', gap: space.xs + 'px' },
      },
        // Erledigt: ein kleines Fenster in Sand wie am Haus (kein Zeichen im Text, Wächter glyphenImText).
        h('span', { 'aria-hidden': 'true', style: { width: '10px', height: '10px', borderRadius: radius.hair + 'px', flexShrink: 0, background: x.erledigt ? palette.sand : 'transparent', border: '1.5px solid ' + (x.erledigt ? palette.sand : palette.mid) } }),
        t('behoerdenZuhause.kurz.' + x.id)))));

  // 3 · Rand: was kein Gang und keine Frist ist, mit eigenem Zeichen (wie Wohndauer, Versicherung, Vermieterschaft).
  const randStueck = (teil, icon, ...inhalt) => h('div', { 'data-rand': teil, style: { display: 'flex', gap: space.sm + 'px', alignItems: 'center', flex: '1 1 220px', minWidth: 0 } },
    h('div', { 'aria-hidden': 'true', style: { flex: '0 0 auto', display: 'flex', color: palette.text } }, h(Icon, { name: icon, size: 36 })),
    h('div', { style: { minWidth: 0 } }, ...inhalt));
  const randZahl = (s) => h('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, overflowWrap: 'anywhere' } }, s);
  const randSatz = (s) => s && h('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, s);
  const zeile = (...kinder) => h('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap' } }, ...kinder);
  const betreibung = auswahlLabel('behoerden', 'betreibungsStatus', d.betreibungsStatus, t);
  const gericht = auswahlLabel('behoerden', 'courtCases', d.courtCases, t);
  const beistand = String(d.legalRepresentative || '').trim();
  const telefon = String(d.representativePhone || '').trim();
  const testament = auswahlLabel('behoerden', 'willMade', d.willMade, t);
  const rand = [
    randStueck('betreibung', 'document',
      randZahl(feldName(t, 'betreibungsStatus') + (betreibung ? ': ' + betreibung : '')),
      randSatz([String(d.registryOffice || '').trim() && feldName(t, 'registryOffice') + ': ' + String(d.registryOffice).trim(),
        gericht && t('behördenStatus.courtCases') + ': ' + gericht].filter(Boolean).join(' · ') || (betreibung ? '' : t('wohnenKopf.nochLeer'))),
      zeile(weg(t('nav.betreibungsauszug'), () => onNavigate('betreibungsauszug'), 'betreibungsauszug'),
        aendern('registryOffice', betreibung ? 'aendern' : 'ergaenzen'))),
    randStueck('rechtsbeistand', 'legal',
      randZahl(feldName(t, 'legalRepresentative') + (beistand ? ': ' + beistand : '')),
      randSatz(beistand ? telefon : t('wohnenKopf.nochLeer')),
      zeile(telefon && h('a', { href: 'tel:' + telefon.replace(/[^+\d]/g, ''), className: 'mp-link', style: { ...linkStil(palette), display: 'inline-flex', alignItems: 'center', minHeight: '44px', fontSize: text.sm } }, t('wohnenKopf.anrufen') + ' ›'),
        aendern('legalRepresentative', beistand ? 'aendern' : 'ergaenzen'))),
    randStueck('fall-der-faelle', 'edit',
      randZahl(t('behördenStatus.will') + ': ' + (testament || t('behoerdenInstrument.nichtErfasst'))),
      randSatz(t('behoerdenInstrument.fallSatz')),
      zeile(weg(t('behoerdenInstrument.vorsorgeImNotfall'), () => onNavigate('notfallvorsorge'), 'vorsorge'))),
  ];

  return h('div', { 'data-teil': 'behoerden-instrument', style: { marginBottom: space.lg + 'px' } },
    kopf,
    h(BehoerdenStrasse, { palette, t, frist, gaenge, leistungen, isDarkMode, lang, aktiv: gangIndex, onWaehle: setGangIndex,
      erkl: { offen: erklOffen, umschalten: (k) => setErklOffen((o) => (o === k ? null : k)) } }),
    fristVorbeiHinweis, erklaerungFrist, erklaerungLeistungen,
    gangKarte,
    h('div', { 'data-teil': 'behoerden-rand', style: { display: 'flex', flexWrap: 'wrap', gap: space.md + 'px ' + space.xl + 'px', ...trenner } }, ...rand),
    formular('registryOffice'), formular('legalRepresentative'));
};

// useEinkommen liest das Profil nur beim ersten Zeichnen: ändert sich das Einkommen (auch Beispiel an/aus), neu beginnen.
export const BehoerdenZuhause = (props) => {
  const f = props.allData?.finanzen;
  return React.createElement(BehoerdenKapitel, { ...props, key: [f?.monthlyIncome, f?.incomeType].join('|') });
};
