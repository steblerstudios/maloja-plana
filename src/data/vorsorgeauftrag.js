// Vorsorgeauftrag — Vorlage zum Abschreiben.
//
// Grundlage: docs/design/vorsorge-dokumente-2026-09-27.md, geprüft am 27.09.2026 (rechts-pruefer,
// ZGB SR 210 Stand 1.7.2026, UWG SR 241 Stand 1.1.2025).
//
// Stehende Regeln — jede hat einen Test (data/__tests__/vorsorgeDokumente.test.js):
//   · Der Ausdruck ist KEIN Vorsorgeauftrag: gültig nur eigenhändig (ZGB Art. 361 Abs. 2) oder
//     öffentlich beurkundet (Abs. 1). Der Warnsatz steht abgesetzt, mit «nicht abschreiben».
//   · Benennung «Vorlage zum Abschreiben», nie «Vorsorgeauftrag erstellen» (UWG Art. 3 Abs. 1 lit. b).
//   · Gewählte Bereiche erscheinen als Sätze (Art. 360 Abs. 2); ohne Bereich eine Lücke.
//   · Entschädigung wie Art. 366: unentgeltlich (Spesen werden ohnehin ersetzt) oder angemessen.
//   · Nichts erfunden: fehlende Angaben werden zu Lücken, kein Datum vorbelegt.

import { escapeHtml as esc } from '../utils/helpers.js';
import { OFFEN, LUECKE, leer, datumCH, druckSeite, druckLinie } from './patientenverfuegung.js';

const PERSON_FELDER = ['name', 'beziehung', 'geburt', 'adresse'];

export const FRAGEN_VA = [
  { key: 'bestehend', art: 'eine', optionen: ['nein', 'ersetzt', 'ergaenzt'], zusatz: { bei: 'ergaenzt', key: 'bestehendDatum', typ: 'date' } },
  { key: 'beauftragtFrage', art: 'personen', rollen: ['beauftragt'], felder: PERSON_FELDER },
  { key: 'bereiche', art: 'mehrere', optionen: ['personensorge', 'vermoegenssorge', 'rechtsverkehr'] },
  { key: 'weisungen', art: 'text' },
  { key: 'ersatzFrage', art: 'personen', rollen: ['ersatz'], felder: PERSON_FELDER },
  { key: 'entschaedigung', art: 'eine', optionen: ['unentgeltlich', 'angemessen', OFFEN] },
];

const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');

// Nennt der Vorsorgeauftrag eine andere Person als die Patientenverfügung? Beide Dokumente stehen in
// ZGB Art. 378 Abs. 1 Ziff. 1 auf derselben Stufe, eine Kollisionsregel fehlt (Rechtsprüfung 27.09.).
export function abweichendeVertretung(va, pv) {
  const a = norm(va?.beauftragt?.name);
  const b = norm(pv?.vertretung?.name);
  return !!a && !!b && a !== b;
}

const personZusatz = (p, t) => [
  leer(p.beziehung) ? null : String(p.beziehung).trim(),
  datumCH(p.geburt) ? t('va.doc.geboren', { datum: datumCH(p.geburt) }) : null,
  leer(p.adresse) ? null : String(p.adresse).trim(),
].filter(Boolean).join(', ');

export function vorlage(antworten, daten, t) {
  const a = antworten || {};
  const b = daten?.basis || {};
  const w = daten?.wohnen || {};
  const ich = {
    name: [b.firstName, b.lastName].filter((x) => !leer(x)).join(' ') || LUECKE,
    geburt: datumCH(b.dateOfBirth) || LUECKE,
    adresse: [w.address, [w.postalCode, w.city].filter((x) => !leer(x)).join(' ')].filter((x) => !leer(x)).join(', ') || LUECKE,
  };
  const beauftragt = a.beauftragt || {};
  const ersatz = a.ersatz || {};
  const bereiche = Array.isArray(a.bereiche) ? a.bereiche : [];

  const saetze = [
    t('va.doc.einleitung', ich),
    t('va.doc.beauftragt', { name: leer(beauftragt.name) ? LUECKE : String(beauftragt.name).trim(), zusatz: personZusatz(beauftragt, t) }),
    ...(bereiche.length ? bereiche.map((x) => t('va.doc.bereich_' + x)) : [t('va.doc.bereichLuecke')]),
    ...(leer(a.weisungen) ? [] : [t('va.doc.weisungen', { text: String(a.weisungen).trim() })]),
    ...(leer(ersatz.name) ? [] : [t('va.doc.ersatz', { name: String(ersatz.name).trim(), zusatz: personZusatz(ersatz, t) })]),
    ...(a.entschaedigung && a.entschaedigung !== OFFEN ? [t('va.doc.entschaedigung_' + a.entschaedigung)] : []),
    ...(a.bestehend === 'ersetzt' ? [t('va.doc.ersetzt')] : []),
    ...(a.bestehend === 'ergaenzt' ? [t('va.doc.ergaenzt', { datum: datumCH(a.bestehendDatum) || LUECKE })] : []),
  ];
  return { saetze };
}

export function vorlageHtml(antworten, daten, t, lang = 'de') {
  const v = vorlage(antworten, daten, t);
  const koerper = `<div class="pv-blatt">
<div class="va-warnung"><strong>${esc(t('va.vorlage.nichtAbschreiben'))}</strong><br>${esc(t('va.vorlage.warnung'))}</div>
<div class="va-abschreiben">
<h1>${esc(t('va.doc.titel'))}</h1>
${v.saetze.map((s) => `<p>${esc(s)}</p>`).join('\n')}
<div class="pv-linien">${druckLinie(t('va.doc.ortDatum'))}</div>
<div class="pv-linien">${druckLinie(t('va.doc.unterschrift'))}</div>
</div>
</div>`;
  return druckSeite({
    lang, titel: t('va.vorlage.titel'), koerper, begleitTitel: t('va.begleit.titel'), druckLabel: t('va.ui.drucken'),
    zusatzCss: `  .va-warnung { border: 2px dashed #8A6D3B; background: #FBF6EC; padding: 12px 14px; margin-bottom: 28px; font-family: -apple-system, 'Segoe UI', Arial, sans-serif; font-size: 11pt; }
  .va-abschreiben { font-size: 14pt; line-height: 1.9; }
  .va-abschreiben p { margin-bottom: 14px; }`,
    begleitPunkte: [t('va.begleit.form'), t('va.begleit.alter'), t('va.begleit.zivilstandsamt'), t('va.begleit.kesb'),
      t('va.begleit.besondere'), t('va.begleit.patientenverfuegung'), t('va.begleit.keineBeratung')],
  });
}
