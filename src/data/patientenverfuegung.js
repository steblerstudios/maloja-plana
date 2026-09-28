// Patientenverfügung in Fragen — Fragen und Dokument.
//
// Grundlage: docs/design/patientenverfuegung-fragen-2026-09-27.md, geprüft am 27.09.2026 von
// rechts- und swiss-precision-pruefer am Wortlaut (ZGB 01.07.2026, VVK 01.01.2023,
// SAMW «Umgang mit Sterben und Tod» 2018/2021, «Patientenverfügungen» 2009/2013).
//
// Stehende Regeln aus der Prüfung — jede hat einen Test:
//   · «Weiss ich noch nicht» (OFFEN) erscheint nie im Dokument; was nicht beantwortet ist, fehlt.
//   · Kein Standardwert wird übernommen — auch nicht die Organspende aus einem anderen Eintrag.
//   · Datum und Unterschrift sind leere Zeilen, nie vorbelegt (ZGB Art. 371 Abs. 1, Art. 362 Abs. 3).
//   · «ergänzt» nennt das Datum der früheren Verfügung (ZGB Art. 362 Abs. 3 i. V. m. Art. 371 Abs. 3).
//   · Hinweise stehen auf einem Begleitblatt, nicht in der Erklärung selbst.
// Keine Vorlage Dritter lag beim Schreiben offen (URG Art. 2; nur Gesetz und SAMW).

import { escapeHtml as esc } from '../utils/helpers.js';

export const OFFEN = 'offen';

// art: 'eine' (eine Antwort) · 'mehrere' · 'text' · 'gruppe' (mehrere Teilfragen) · 'personen'
// Darstellung: components/FragenAblauf.jsx (zusatz = Feld unter einer Auswahl, einzeilig = kurzes Textfeld).
export const FRAGEN = [
  { key: 'bestehend', art: 'eine', optionen: ['nein', 'ersetzt', 'ergaenzt'], zusatz: { bei: 'ergaenzt', key: 'bestehendDatum', typ: 'date' } },
  { key: 'werte', art: 'text' },
  { key: 'therapieziel', art: 'eine', optionen: ['verlaengern', 'lebensqualitaet', OFFEN] },
  { key: 'situationen', art: 'mehrere', optionen: ['notfall', 'bewusstlos', 'demenz', 'endphase'] },
  { key: 'reanimation', art: 'eine', optionen: ['ja', 'nein', OFFEN] },
  { key: 'lebensverlaengernd', art: 'eine', optionen: ['ja', 'begrenzt', 'nein', OFFEN] },
  { key: 'ernaehrung', art: 'eine', optionen: ['ja', 'begrenzt', 'nein', OFFEN] },
  { key: 'linderung', art: 'eine', optionen: ['ja', OFFEN] },
  { key: 'sedierung', art: 'eine', optionen: ['ja', 'nein', OFFEN] },
  { key: 'ortBegleitung', art: 'text' },
  { key: 'organe', art: 'gruppe', teile: [
    { key: 'organspende', optionen: ['ja', 'nein', 'bestimmte', OFFEN], zusatz: { bei: 'bestimmte', key: 'organeListe', typ: 'text' } },
    { key: 'obduktion', optionen: ['ja', 'nein', OFFEN] },
    { key: 'forschung', optionen: ['ja', 'nein', OFFEN] },
  ] },
  { key: 'vertretung', art: 'personen', rollen: ['vertretung', 'ersatz'] },
  { key: 'original', art: 'text', einzeilig: true },
];

const ENTSCHEIDE = ['reanimation', 'lebensverlaengernd', 'ernaehrung', 'linderung', 'sedierung'];
export const LUECKE = '__________';

export const leer = (v) => v === undefined || v === null || String(v).trim() === '';
export const datumCH = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim());
  return m ? m[3] + '.' + m[2] + '.' + m[1] : '';
};

// Ist die Frage beantwortet? «Weiss ich noch nicht» gilt als beantwortet — bewusst offen gelassen.
export function beantwortet(a, key) {
  const v = (a || {})[key];
  if (Array.isArray(v)) return v.length > 0;
  if (v && typeof v === 'object') return Object.values(v).some((x) => !leer(x));
  return !leer(v);
}

export function dokument(antworten, daten, t) {
  const a = antworten || {};
  const b = daten?.basis || {};
  const w = daten?.wohnen || {};
  const person = {
    name: [b.firstName, b.lastName].filter((x) => !leer(x)).join(' '),
    geburt: datumCH(b.dateOfBirth),
    adresse: [w.address, [w.postalCode, w.city].filter((x) => !leer(x)).join(' ')].filter((x) => !leer(x)).join(', '),
  };

  const gewaehlt = (key) => (!leer(a[key]) && a[key] !== OFFEN ? a[key] : null);
  const abschnitte = [];
  const dazu = (key, zeilen, extra) => { if (zeilen.length || extra) abschnitte.push({ key, titel: t('pv.doc.titel_' + key), zeilen, ...extra }); };

  dazu('werte', [
    ...(leer(a.werte) ? [] : [String(a.werte).trim()]),
    ...(gewaehlt('therapieziel') ? [t('pv.doc.therapieziel_' + a.therapieziel)] : []),
  ]);
  dazu('entscheide', ENTSCHEIDE.filter(gewaehlt).map((k) => t('pv.doc.' + k + '_' + a[k])));
  dazu('ort', leer(a.ortBegleitung) ? [] : [String(a.ortBegleitung).trim()]);

  const o = a.organe || {};
  const tod = [];
  if (o.organspende && o.organspende !== OFFEN) {
    tod.push(o.organspende === 'bestimmte'
      ? t('pv.doc.organspende_bestimmte', { liste: leer(o.organeListe) ? LUECKE : String(o.organeListe).trim() })
      : t('pv.doc.organspende_' + o.organspende));
  }
  for (const k of ['obduktion', 'forschung']) if (o[k] && o[k] !== OFFEN) tod.push(t('pv.doc.' + k + '_' + o[k]));
  dazu('tod', tod);

  const personen = ['vertretung', 'ersatz']
    .map((rolle) => ({ rolle, ...(a[rolle] || {}) }))
    .filter((p) => !leer(p.name))
    .map((p) => ({ rolle: p.rolle, name: String(p.name).trim(), beziehung: String(p.beziehung || '').trim(), telefon: String(p.telefon || '').trim() }));
  if (personen.length) abschnitte.push({ key: 'vertretung', titel: t('pv.doc.titel_vertretung'), zeilen: [], personen });

  const situationen = (Array.isArray(a.situationen) ? a.situationen : []).map((s) => t('pv.doc.sit_' + s));
  const bestehendSatz = a.bestehend === 'ersetzt' ? t('pv.doc.ersetzt')
    : a.bestehend === 'ergaenzt' ? t('pv.doc.ergaenzt', { datum: datumCH(a.bestehendDatum) || LUECKE })
    : null;

  return { person, abschnitte, situationen, bestehendSatz, original: leer(a.original) ? '' : String(a.original).trim(), leer: abschnitte.length === 0 };
}

// Druckfarben: warmes Papier wie die Dossiers (dossierGenerator.js DRUCK), hier nur die nötigen.
const TINTE = '#1C1A17';
const GRAU = '#6B6560';
const RAND = '#DDD8D0';

// Gemeinsame Druckhilfen — auch für Vorsorgeauftrag-Vorlage und Bestattungswünsche.
export const druckFeld = (label, wert) => `<div class="pv-feld"><span class="pv-label">${esc(label)}</span><span class="pv-wert">${esc(wert) || '&nbsp;'}</span></div>`;
export const druckLinie = (label) => `<div class="pv-linie"><span></span><em>${esc(label)}</em></div>`;

// Ein Druckblatt: Dokument, danach (eigene Seite) das Begleitblatt mit Hinweisen und dem Druckknopf.
// `koerper` ist fertiges, bereits escaptes HTML; `begleitPunkte` sind Klartexte.
export function druckSeite({ lang = 'de', titel, koerper, begleitTitel, begleitPunkte, druckLabel, zusatzCss = '' }) {
  return `<!DOCTYPE html>
<html lang="${esc(lang)}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titel)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 12pt; line-height: 1.55; color: ${TINTE}; background: #fff; padding: 32px 20px; }
  .pv-blatt { max-width: 640px; margin: 0 auto; }
  h1 { font-size: 20pt; font-weight: normal; margin-bottom: 16px; }
  h2 { font-size: 12pt; margin: 18px 0 6px; border-bottom: 1px solid ${RAND}; padding-bottom: 2px; }
  p { margin-bottom: 6px; }
  .pv-feld { display: flex; gap: 12px; margin-bottom: 4px; }
  .pv-label { color: ${GRAU}; min-width: 120px; }
  .pv-wert { flex: 1; border-bottom: 1px solid ${RAND}; }
  .pv-linien { display: flex; gap: 24px; margin-top: 40px; }
  .pv-linie { flex: 1; }
  .pv-linie span { display: block; border-bottom: 1px solid ${TINTE}; height: 36px; }
  .pv-linie em { font-style: normal; color: ${GRAU}; font-size: 10pt; }
  .pv-begleitblatt { page-break-before: always; break-before: page; margin-top: 48px; font-family: -apple-system, 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; }
  .pv-begleitblatt li { margin: 0 0 6px 18px; }
  .pv-druck { display: block; margin: 32px auto 0; padding: 10px 20px; font: inherit; border: 1px solid ${RAND}; background: #F5F2EE; color: ${TINTE}; border-radius: 6px; cursor: pointer; }
  @media print { .pv-druck { display: none; } body { padding: 0; } }
${zusatzCss}
</style>
</head>
<body>
${koerper}
<div class="pv-blatt pv-begleitblatt">
<h2>${esc(begleitTitel)}</h2>
<ul>
${begleitPunkte.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join('\n')}
</ul>
<button class="pv-druck" data-druck onclick="window.print()">${esc(druckLabel)}</button>
</div>
</body>
</html>`;
}

export function dokumentHtml(antworten, daten, t, lang = 'de') {
  const d = dokument(antworten, daten, t);
  const abschnitt = (s) => `<section><h2>${esc(s.titel)}</h2>`
    + s.zeilen.map((z) => `<p>${esc(z)}</p>`).join('')
    + (s.personen || []).map((p) => `<p class="pv-person"><strong>${esc(t('pv.doc.rolle_' + p.rolle))}</strong><br>`
      + [p.name, p.beziehung, p.telefon].filter(Boolean).map(esc).join(' · ') + '</p>').join('')
    + '</section>';
  const koerper = `<div class="pv-blatt">
<h1>${esc(t('pv.doc.titel'))}</h1>
${druckFeld(t('pv.doc.name'), d.person.name)}
${druckFeld(t('pv.doc.geburt'), d.person.geburt)}
${druckFeld(t('pv.doc.adresse'), d.person.adresse)}
<section>
<p>${esc(t('pv.doc.urteilsfaehig'))}</p>
<p>${esc(t('pv.doc.gilt'))}${d.situationen.length ? ' ' + esc(t('pv.doc.giltInsbesondere')) : ''}</p>
${d.situationen.length ? '<ul>' + d.situationen.map((s) => `<li style="margin-left:18px">${esc(s)}</li>`).join('') + '</ul>' : ''}
</section>
${d.abschnitte.map(abschnitt).join('\n')}
${d.bestehendSatz ? `<p style="margin-top:18px">${esc(d.bestehendSatz)}</p>` : ''}
<div class="pv-linien">${druckLinie(t('pv.doc.ort'))}${druckLinie(t('pv.doc.datum'))}</div>
<div class="pv-linien">${druckLinie(t('pv.doc.unterschrift'))}</div>
</div>`;
  return druckSeite({
    lang, titel: t('pv.doc.titel'), koerper, begleitTitel: t('pv.begleit.titel'), druckLabel: t('pv.ui.drucken'),
    begleitPunkte: [t('pv.begleit.ungueltig'), t('pv.begleit.urteilsfaehig'), t('pv.begleit.besprechen'), t('pv.begleit.karte'),
      d.original ? t('pv.begleit.original', { ort: d.original }) : null, t('pv.begleit.neueFassung'), t('pv.begleit.keineBeratung')],
  });
}
