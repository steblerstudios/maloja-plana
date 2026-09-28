// Bestattungswünsche — Fragen und Druckdokument.
//
// Grundlage: docs/design/vorsorge-dokumente-2026-09-27.md, geprüft am 27.09.2026 (rechts-pruefer).
// Regeln — jede hat einen Test (data/__tests__/vorsorgeDokumente.test.js):
//   · Keine Aussage zur Verbindlichkeit (nicht belegt); was möglich ist, regeln Kanton und Gemeinde.
//   · «Den Angehörigen überlassen» ist ein Wunsch und steht als Satz im Dokument.
//   · «Weiss ich noch nicht» und Unbeantwortetes fehlen.
//   · Keine Frage nach der Konfession (DSG Art. 5 lit. c Ziff. 1).
//   · Grabart und Ort getrennt; «nicht überall möglich» steht bei der Frage (Hilfetext).

import { escapeHtml as esc } from '../utils/helpers.js';
import { OFFEN, leer, druckSeite, druckFeld, druckLinie, datumCH } from './patientenverfuegung.js';

export const FRAGEN_BW = [
  { key: 'art', art: 'eine', optionen: ['erd', 'kremation', 'angehoerige', OFFEN] },
  { key: 'grabart', art: 'eine', optionen: ['reihengrab', 'urnengrab', 'gemeinschaftsgrab', 'natur', 'anderes', 'angehoerige', OFFEN], zusatz: { bei: 'anderes', key: 'grabartText', typ: 'text' } },
  { key: 'ort', art: 'text', einzeilig: true },
  { key: 'abschied', art: 'eine', optionen: ['religioes', 'nichtReligioes', 'engsterKreis', 'keiner', 'angehoerige', OFFEN] },
  { key: 'gestaltung', art: 'text' },
  { key: 'anzeige', art: 'eine', optionen: ['ja', 'karten', 'keine', 'angehoerige', OFFEN], zusatz: { bei: 'ja', key: 'anzeigeWo', typ: 'text' } },
  { key: 'benachrichtigen', art: 'text' },
  { key: 'geregelt', art: 'text' },
];

const WAHL = ['art', 'grabart', 'abschied', 'anzeige'];
const TEXT = ['ort', 'gestaltung', 'benachrichtigen', 'geregelt'];

export function bestattungDokument(antworten, daten, t) {
  const a = antworten || {};
  const zeilen = [];
  const texte = [];
  for (const f of FRAGEN_BW) {
    if (WAHL.includes(f.key)) {
      const v = a[f.key];
      if (leer(v) || v === OFFEN) continue;
      if (f.key === 'grabart' && v === 'anderes') zeilen.push(t('bw.doc.grabart_anderes', { text: leer(a.grabartText) ? '__________' : String(a.grabartText).trim() }));
      else if (f.key === 'anzeige' && v === 'ja') zeilen.push(t('bw.doc.anzeige_ja', { wo: leer(a.anzeigeWo) ? '__________' : String(a.anzeigeWo).trim() }));
      else zeilen.push(t('bw.doc.' + f.key + '_' + v));
    } else if (TEXT.includes(f.key) && !leer(a[f.key])) {
      texte.push({ key: f.key, titel: t('bw.doc.titel_' + f.key), text: String(a[f.key]).trim() });
    }
  }
  const b = daten?.basis || {};
  const person = { name: [b.firstName, b.lastName].filter((x) => !leer(x)).join(' '), geburt: datumCH(b.dateOfBirth) };
  return { person, zeilen, texte, leer: zeilen.length === 0 && texte.length === 0 };
}

export function bestattungHtml(antworten, daten, t, lang = 'de') {
  const d = bestattungDokument(antworten, daten, t);
  const koerper = `<div class="pv-blatt">
<h1>${esc(t('bw.doc.titel'))}</h1>
${druckFeld(t('bw.doc.name'), d.person.name)}
${druckFeld(t('bw.doc.geburt'), d.person.geburt)}
<section>
${d.zeilen.map((z) => `<p>${esc(z)}</p>`).join('\n')}
</section>
${d.texte.map((x) => `<section><h2>${esc(x.titel)}</h2><p style="white-space:pre-wrap">${esc(x.text)}</p></section>`).join('\n')}
<div class="pv-linien">${druckLinie(t('bw.doc.datum'))}${druckLinie(t('bw.doc.unterschrift'))}</div>
</div>`;
  return druckSeite({
    lang, titel: t('bw.doc.titel'), koerper, begleitTitel: t('bw.begleit.titel'), druckLabel: t('bw.ui.drucken'),
    begleitPunkte: [t('bw.begleit.wo'), t('bw.begleit.gemeinde'), t('bw.begleit.testament'), t('bw.begleit.keineBeratung')],
  });
}
