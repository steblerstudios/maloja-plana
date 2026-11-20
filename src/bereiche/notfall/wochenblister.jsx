import React, { useState } from 'react';
import { text, weight, space, radius, leading } from '../../config/tokens.js';
import { knopfStil } from '../../components/PrimaryButton.jsx';
import { PageTitle } from '../../components/Heading.jsx';
import { Icon } from '../../IconSystem.jsx';
import { wochenblister, BLISTER_ZEITEN } from './rechnung.js';
import { Blisterpackung, gesundheitFarbe } from './bilder.jsx';

// Fach Wochenblister im Arztkoffer (Sophie 20.11.2026: «A · Wochenblister», «Nur im Fach», Wochentage wählbar).
// Eine Frage (rechnung.js 8):
//   Was nehme ich wann?   wochenblister → Blisterpackung (einmal je Seite) → «2 Einnahmen am Tag» → Medikamente je Zeit
// Keine eigene Datenhaltung: bearbeitet wird data.notfall.medicationsList (MedicationManager, nachgeladen). Das ist
// der eine Ort zum Bearbeiten; das Kapitel zeigt nur die Namen und den Weg hierher. Gesundheitsangabe, lokal.
// Keine Dosierungsempfehlung: es steht nur, was eingetragen ist.

const MedicationManager = React.lazy(() => import('../../MedicationManager.jsx').then((m) => ({ default: m.MedicationManager })));

export const Wochenblister = ({ palette, t, lang = 'de', data, onUpdateData, bearbeitenOffen = false }) => {
  const h = React.createElement;
  const nf = data?.notfall || {};
  const stand = wochenblister(data);
  const [bearbeiten, setBearbeiten] = useState(bearbeitenOffen);
  const farbe = gesundheitFarbe(palette);
  const schreibe = (k, v) => onUpdateData && onUpdateData('notfall', k, v);

  const karte = { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.lg, marginBottom: space.md + 'px' };
  const satz = (inhalt, teil) => h('div', { 'data-teil': teil, style: { fontSize: text.sm, color: palette.mid, marginTop: '2px', lineHeight: leading.normal } }, inhalt);
  const leise = (inhalt, teil) => h('p', { 'data-teil': teil, style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.sm + 'px 0 0' } }, inhalt);
  const mitDosis = (m) => m.name + (m.dose ? ' ' + m.dose + (m.unit ? ' ' + m.unit : '') : '');
  const nurAn = (m) => (m.jedenTag ? '' : ' · ' + t('blister.nurAn', { tage: m.tage.map((d) => t('blister.tageKurz.' + d)).join(', ') }));

  const zahl = stand.einnahmenMin === stand.einnahmenMax
    ? t(stand.einnahmenMax === 1 ? 'blister.eineEinnahme' : 'blister.einnahmen', { n: stand.einnahmenMax })
    : t('blister.einnahmenSpanne', { von: stand.einnahmenMin, bis: stand.einnahmenMax });
  const teileSatz = [
    stand.regelmaessig && t(stand.regelmaessig === 1 ? 'blister.einMedikament' : 'blister.medikamente', { n: stand.regelmaessig }),
    stand.beiBedarf && t('blister.beiBedarfAnzahl', { n: stand.beiBedarf }),
  ].filter(Boolean).join(' · ');

  // ── Was nehme ich wann? ──
  const frage = h('section', { 'data-teil': 'blister-wann', 'aria-labelledby': 'mp-blister-wann', style: karte },
    h('h3', { id: 'mp-blister-wann', style: { margin: '0 0 ' + space.sm + 'px', fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } }, t('blister.frage')),
    h(Blisterpackung, { palette, t, raster: stand.raster }),
    h('div', { style: { marginTop: space.sm + 'px' } },
      stand.regelmaessig
        ? h(React.Fragment, null,
            h('div', { 'data-instrument-zahl': 'blister', style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } }, zahl),
            satz(teileSatz, 'blister-satz'))
        : satz(stand.beiBedarf ? t('blister.nurBeiBedarf') : t('blister.leer'), 'blister-leer')));

  // ── Die Medikamente je Zeit ── (Lesefassung des Bilds, auch für Vorlesen: das Bild ist aria-hidden)
  const gruppen = [
    ...BLISTER_ZEITEN.map((z) => ({ key: z, titel: t('medications.freq.' + z), liste: stand.medikamente.filter((m) => m.zeiten.includes(z)) })),
    { key: 'beiB', titel: t('medications.freq.beiB'), liste: stand.medikamente.filter((m) => m.beiBedarf) },
    { key: 'ohne', titel: t('blister.ohneZeit'), liste: stand.medikamente.filter((m) => !m.zeiten.length && !m.beiBedarf) },
  ].filter((g) => g.liste.length);
  const liste = gruppen.length > 0 && h('dl', { 'data-teil': 'blister-liste', style: { ...karte, margin: '0 0 ' + space.md + 'px' } },
    gruppen.map((g, gi) => h('div', { key: g.key, 'data-zeit': g.key, style: { padding: '6px 0', borderTop: gi ? '1px solid ' + palette.border : 'none' } },
      h('dt', { style: { fontSize: text.xs, fontWeight: weight.medium, color: palette.mid } }, g.titel),
      g.liste.map((m) => h('dd', { key: m.index, 'data-medikament': m.name, style: { margin: 0, fontSize: text.sm, color: palette.text, overflowWrap: 'anywhere' } },
        mitDosis(m),
        h('span', { style: { color: palette.mid } }, nurAn(m) + (m.notes ? ' · ' + m.notes : '')))))),
    stand.ohneZeit > 0 && leise(t('blister.ohneZeitHinweis'), 'blister-ohne-zeit'));

  const bearbeitung = h('div', { 'data-teil': 'blister-bearbeiten', style: { margin: '0 0 ' + space.md + 'px' } },
    onUpdateData && h('button', { type: 'button', 'data-teil': 'blister-umschalter', 'aria-expanded': bearbeiten ? 'true' : 'false',
      onClick: () => setBearbeiten(!bearbeiten), style: { ...knopfStil(palette, 'neben'), color: palette.text } },
      t(bearbeiten ? 'blister.fertig' : stand.medikamente.length ? 'blister.bearbeiten' : 'blister.erstes')),
    bearbeiten && onUpdateData && h('div', { style: { marginTop: space.sm + 'px' } },
      h(React.Suspense, { fallback: h('div', { style: { fontSize: text.sm, color: palette.mid } }, t('blister.laden')) },
        h(MedicationManager, { palette, t, lang, medications: Array.isArray(nf.medicationsList) ? nf.medicationsList : [], onChange: (l) => schreibe('medicationsList', l) }))),
    leise(t('blister.eineListe'), 'blister-eine-liste'),
    leise(t('blister.keineEmpfehlung'), 'blister-keine-empfehlung'));

  return h('div', { 'data-teil': 'wochenblister', style: { maxWidth: '640px', margin: '0 auto' } },
    h(PageTitle, { palette, icon: h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: farbe } }, h(Icon, { name: 'blister', size: 22 })), style: { marginBottom: space.md } },
      t('arztkoffer.faecher.blister.title')),
    frage, liste, bearbeitung);
};
