import React, { useState } from 'react';
import { text, weight, space, radius, leading } from '../../config/tokens.js';
import { knopfStil } from '../../components/PrimaryButton.jsx';
import { PageTitle } from '../../components/Heading.jsx';
import { Icon } from '../../IconSystem.jsx';
import { karteikarten, diagnosenListe } from './rechnung.js';
import { Karteikasten, gesundheitFarbe } from './bilder.jsx';

// Fach Karteikarten im Arztkoffer (Stebler Studios 19.11.2026: «B · Karteikasten», alle vier Inhalte, «Eine Liste, zwei Orte»).
// Zwei Fragen (rechnung.js 7):
//   1 Wer behandelt mich?     karteikarten → Karteikasten (einmal je Seite) → «4 Karten» → Fachrichtungen
//   2 Was ist festgestellt?   diagnosenListe → Liste ohne Bild (Präzedenz Verfügungen)
// Keine eigene Datenhaltung: bearbeitet wird data.notfall.doctorsList und data.notfall.chronicDiseasesList, mit
// denselben Eingaben wie im Kapitel Notfall (DoctorManager, DiseaseManager, nachgeladen). Gesundheitsangaben, lokal.

const DoctorManager = React.lazy(() => import('../../DoctorManager.jsx'));
const DiseaseManager = React.lazy(() => import('../../DiseaseManager.jsx'));
const telHref = (nr) => 'tel:' + String(nr).replace(/[^\d+]/g, '');

export const Karteikarten = ({ palette, t, data, onUpdateData, bearbeitenOffen = false }) => {
  const h = React.createElement;
  const nf = data?.notfall || {};
  const stand = karteikarten(data);
  const diagnosen = diagnosenListe(data);
  const [kartenBearbeiten, setKartenBearbeiten] = useState(bearbeitenOffen);
  const [diagnosenBearbeiten, setDiagnosenBearbeiten] = useState(bearbeitenOffen);
  const farbe = gesundheitFarbe(palette);
  const fachName = (fach) => t('doctors.specialties.' + fach);
  const schreibe = (k, v) => onUpdateData && onUpdateData('notfall', k, v);

  const karte = { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.lg, marginBottom: space.md + 'px' };
  const frageZeile = (key, id) => h('h3', { id, style: { margin: '0 0 2px', fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } }, t(key));
  const satz = (inhalt, teil) => h('div', { 'data-teil': teil, style: { fontSize: text.sm, color: palette.mid, marginTop: '2px', lineHeight: leading.normal } }, inhalt);
  const leise = (inhalt, teil) => h('p', { 'data-teil': teil, style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.sm + 'px 0 0' } }, inhalt);
  const umschalter = (offen, setze, keyZu, keyAuf, teil) => onUpdateData && h('button', { type: 'button', 'data-teil': teil, 'aria-expanded': offen ? 'true' : 'false',
    onClick: () => setze(!offen), style: { ...knopfStil(palette, 'neben'), color: palette.text, marginTop: space.sm + 'px' } }, t(offen ? keyZu : keyAuf));
  const laden = (inhalt) => h(React.Suspense, { fallback: h('div', { style: { fontSize: text.sm, color: palette.mid } }, t('karteikarten.laden')) }, inhalt);

  // ── 1 · Wer behandelt mich? ──
  const frage1 = h('section', { 'data-teil': 'kartei-wer', 'aria-labelledby': 'mp-kartei-wer', style: { ...karte, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.md + 'px' } },
    h('div', { style: { flex: '0 0 auto', width: '128px' } }, h(Karteikasten, { palette, reiter: stand.reiter, anzahl: stand.anzahl })),
    h('div', { style: { minWidth: 0, flex: '1 1 200px' } },
      frageZeile('karteikarten.frage', 'mp-kartei-wer'),
      stand.anzahl
        ? h(React.Fragment, null,
            h('div', { 'data-instrument-zahl': 'karteikarten', style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } },
              t(stand.anzahl === 1 ? 'karteikarten.eineKarte' : 'karteikarten.anzahl', { n: stand.anzahl })),
            satz(stand.reiter.map(fachName).join(', '), 'kartei-satz'),
            !stand.hausarzt && satz(t('karteikarten.ohneHausarzt'), 'kartei-ohne-hausarzt'))
        : satz(t('karteikarten.leer'), 'kartei-leer')));

  // ── Die Karten ──
  const kartenListe = stand.anzahl > 0 && h('ul', { 'data-teil': 'kartei-karten', 'aria-label': t('karteikarten.karten'), style: { listStyle: 'none', margin: '0 0 ' + space.md + 'px', padding: 0, display: 'grid', gap: space.sm + 'px' } },
    stand.karten.map((k) => h('li', { key: k.index + ':' + k.name, 'data-karte': k.fach, 'data-gruppe': k.gruppe,
      style: { padding: space.sm + 'px ' + space.md + 'px', background: palette.surface, color: palette.text, border: '1px solid ' + palette.border,
        borderTop: '3px solid ' + farbe, borderRadius: radius.md } },
      h('div', { style: { fontSize: text.xs, color: palette.mid } }, fachName(k.fach)),
      h('div', { style: { fontSize: text.base, fontWeight: weight.semi, color: palette.text, overflowWrap: 'anywhere' } }, k.name),
      k.adresse && h('div', { 'data-teil': 'karte-adresse', style: { fontSize: text.sm, color: palette.mid, overflowWrap: 'anywhere' } }, k.adresse),
      k.notes && h('div', { 'data-teil': 'karte-hinweis', style: { fontSize: text.sm, color: palette.mid, overflowWrap: 'anywhere' } }, k.notes),
      k.phone && h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm + 'px', marginTop: '2px' } },
        h('span', { style: { fontSize: text.sm, color: palette.text, fontVariantNumeric: 'tabular-nums' } }, k.phone),
        h('a', { href: telHref(k.phone), 'data-teil': 'karte-anrufen', 'aria-label': t('karteikarten.anrufen') + ': ' + k.name,
          style: { display: 'inline-flex', alignItems: 'center', gap: '4px', minHeight: '44px', fontSize: text.sm, color: palette.skyDeep || palette.text } },
          h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: farbe } }, h(Icon, { name: 'phone', size: 16 })), t('karteikarten.anrufen'))),
      k.fach === 'hausarzt' && h('div', { 'data-teil': 'karte-notfall', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } },
        t(k.alt ? 'karteikarten.frueher' : 'karteikarten.aufNotfallkarte')))));

  const kartenBearbeitung = h('div', { 'data-teil': 'kartei-bearbeiten', style: { margin: '0 0 ' + space.md + 'px' } },
    leise(t('karteikarten.eineListe'), 'kartei-eine-liste'),
    umschalter(kartenBearbeiten, setKartenBearbeiten, 'karteikarten.fertig', stand.anzahl ? 'karteikarten.bearbeiten' : 'karteikarten.erste', 'kartei-umschalter'),
    kartenBearbeiten && onUpdateData && h('div', { style: { marginTop: space.sm + 'px' } },
      laden(h(DoctorManager, { palette, t, doctors: Array.isArray(nf.doctorsList) ? nf.doctorsList : [], onChange: (list) => schreibe('doctorsList', list) }))));

  // ── 2 · Was ist festgestellt? ── (Liste ohne Bild)
  const frage2 = h('section', { 'data-teil': 'kartei-diagnosen', 'aria-labelledby': 'mp-kartei-diagnosen', style: karte },
    frageZeile('karteikarten.diagnosen.frage', 'mp-kartei-diagnosen'),
    diagnosen.length
      ? h('ul', { style: { listStyle: 'none', margin: space.xs + 'px 0 0', padding: 0 } },
          diagnosen.map((d, i) => h('li', { key: i + d.name, 'data-diagnose': d.code || d.name, style: { padding: '6px 0', borderTop: i ? '1px solid ' + palette.border : 'none' } },
            h('span', { style: { display: 'block', fontSize: text.sm, color: palette.text, overflowWrap: 'anywhere' } }, d.name + (d.code ? ' (' + d.code + ')' : '')),
            d.notes && h('span', { style: { display: 'block', fontSize: text.xs, color: palette.mid, overflowWrap: 'anywhere' } }, d.notes))))
      : satz(t('karteikarten.diagnosen.leer'), 'diagnosen-leer'),
    umschalter(diagnosenBearbeiten, setDiagnosenBearbeiten, 'karteikarten.fertig', 'karteikarten.diagnosen.bearbeiten', 'diagnosen-umschalter'),
    diagnosenBearbeiten && onUpdateData && h('div', { style: { marginTop: space.sm + 'px' } },
      laden(h(DiseaseManager, { palette, t, diseases: Array.isArray(nf.chronicDiseasesList) ? nf.chronicDiseasesList : [], onChange: (list) => schreibe('chronicDiseasesList', list) }))),
    leise(t('karteikarten.diagnosen.hinweis'), 'diagnosen-hinweis'));

  return h('div', { 'data-teil': 'karteikarten', style: { maxWidth: '640px', margin: '0 auto' } },
    h(PageTitle, { palette, icon: h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: farbe } }, h(Icon, { name: 'contacts', size: 22 })), style: { marginBottom: space.md } },
      t('arztkoffer.faecher.karteikarten.title')),
    frage1, kartenListe, kartenBearbeitung, frage2);
};
