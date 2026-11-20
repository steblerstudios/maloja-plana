import React from 'react';
import { text, weight, space, radius } from '../../config/tokens.js';
import { zahl, betrag as chfBetrag } from '../../utils/geld.js';
import { linkStil } from '../../components/PrimaryButton.jsx';
import { Kalenderblatt } from '../../components/Kalenderblatt.jsx';
import { Icon } from '../../IconSystem.jsx';
import { loadVorsorgeDates } from '../../utils/vorsorge.js';
import { bereitschaft, lagenStand, franchiseStand, naechstesFaellig } from './rechnung.js';
import { FranchiseAblesung, HerzPuls, gesundheitFarbe } from './bilder.jsx';

// Lebensbereich Notfall & Gesundheit · die Zuhause (Bauplan Lebensbereich, Stebler Studios 18.11.2026).
//   BereitZuhause      Kapitel Notfall: Herz mit Puls gross → «17 von 20» → Satz.
//   GesundheitZuhause  Seite Arztkoffer, oben vor den Fächern: je Frage Bild → Zahl → Satz → Weg ins Werkzeug.
//                      1 Franchise (Thermometer stehend) · 2 Als Nächstes fällig (Kalenderblatt).
// Jedes Bild steht nur einmal auf der Seite.

const zahlStil = { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' };

export const BereitZuhause = ({ palette, t, data }) => {
  const h = React.createElement;
  const stand = bereitschaft(data);
  return h('div', { 'data-teil': 'bereit-zuhause', style: { margin: space.xs + 'px 0 ' + space.sm + 'px' } },
    h(HerzPuls, { palette, t, lagen: lagenStand(data), groesse: 'gross' }),
    h('div', { style: { display: 'flex', alignItems: 'baseline', gap: space.sm + 'px', flexWrap: 'wrap', marginTop: space.xs + 'px' } },
      h('span', { 'data-instrument-zahl': 'bereit', style: { ...zahlStil, color: palette.text, whiteSpace: 'nowrap' } }, t('notfallKapitel.vonN', { n: stand.erledigt, total: stand.gesamt })),
      h('span', { style: { fontSize: text.sm, color: palette.mid } }, t('notfallKapitel.bereitSatz'))));
};

export const monatJahr = (iso, locale) => {
  const d = new Date(iso + 'T00:00:00');
  try { return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' }); } catch { return iso.slice(5, 7) + '.' + iso.slice(0, 4); }
};

export const GesundheitZuhause = ({ palette, t, data, onNavigate, letzteBesuche, heute = new Date() }) => {
  const h = React.createElement;
  const lokal = (() => { const l = t('calendar.locale'); return typeof l === 'string' ? l : 'de-CH'; })();
  const fr = franchiseStand(data, heute);
  const faellig = naechstesFaellig(data, letzteBesuche || loadVorsorgeDates(), heute);
  const karte = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.md + 'px', padding: space.md + 'px', background: palette.surface,
    border: '1px solid ' + palette.border, borderRadius: radius.lg, marginBottom: space.sm + 'px' };
  const frage = (key) => h('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '2px' } }, t(key));
  const satz = (inhalt, teil) => h('div', { 'data-teil': teil, style: { fontSize: text.sm, color: palette.mid, marginTop: '2px' } }, inhalt);
  const weg = (label, onClick) => onNavigate && h('button', { type: 'button', onClick, style: { ...linkStil(palette), color: palette.skyDeep || palette.text, minHeight: '44px', fontSize: text.sm, padding: 0 } }, label + ' ›');

  const franchise = h('section', { 'data-teil': 'gesundheit-franchise', style: karte },
    fr && h('div', { style: { flex: '0 1 auto' } }, h(FranchiseAblesung, { palette, t, stand: fr, groesse: 'gross' })),
    h('div', { style: { minWidth: 0 } },
      frage('instrumente.franchise'),
      fr
        ? h(React.Fragment, null,
            h('div', { 'data-instrument-zahl': 'franchise', style: { ...zahlStil, color: palette.text } },
              chfBetrag(fr.franchiseOffen > 0 ? fr.franchiseVerbraucht : fr.franchise),
              fr.franchiseOffen > 0 && h('span', { style: { fontSize: text.sm, fontWeight: weight.normal, color: palette.mid } }, ' ' + t('instrumente.franchiseVon', { franchise: zahl(fr.franchise) }))),
            satz(t(fr.franchiseOffen > 0 ? 'instrumente.franchiseSatz' : 'instrumente.franchiseErreichtSatz', { jahr: heute.getFullYear() }), 'franchise-satz'))
        : satz(t('gesundheitZuhause.franchiseLeer'), 'franchise-leer'),
      weg(t('gesundheitZuhause.zurFranchise'), () => onNavigate('kvg', undefined, 'franchise'))));

  const naechstes = h('section', { 'data-teil': 'gesundheit-faellig', style: karte },
    faellig && h('div', { style: { flex: '0 0 auto', width: '80px', display: 'flex', justifyContent: 'center' } },
      h(Kalenderblatt, { iso: faellig.iso, palette, vorbei: faellig.vorbei, locale: lokal })),
    h('div', { style: { minWidth: 0 } },
      frage('gesundheitZuhause.faelligTitel'),
      faellig
        ? h(React.Fragment, null,
            h('div', { 'data-instrument-zahl': 'faellig', style: { ...zahlStil, color: palette.text } }, monatJahr(faellig.iso, lokal)),
            satz(faellig.art === 'vorsorge'
              ? t('kvg.' + faellig.key) + ' · ' + t('gesundheitZuhause.faelligVorsorge')
              : faellig.art === 'impfung'
                ? t('impfausweis.arten.' + faellig.key) + ' · ' + t('gesundheitZuhause.faelligImpfung')
                : t('gesundheitZuhause.faelligBeleg'), 'faellig-satz'),
            faellig.vorbei && satz(t('gesundheitZuhause.faelligVorbei'), 'faellig-vorbei'))
        : satz(t('gesundheitZuhause.faelligLeer'), 'faellig-leer'),
      faellig && faellig.art === 'beleg'
        ? weg(t('gesundheitZuhause.zuDenBelegen'), () => onNavigate('kvg', undefined, 'franchise'))
        : faellig && faellig.art === 'impfung'
          ? weg(t('gesundheitZuhause.zumImpfausweis'), () => onNavigate('impfausweis'))
          : weg(t('gesundheitZuhause.zumKatalog'), () => onNavigate('kvg', undefined, 'katalog'))));

  return h('div', { 'data-teil': 'gesundheit-zuhause', style: { marginBottom: space.lg + 'px' } }, franchise, naechstes);
};

// ─── Die drei Teile der Seite Gesundheit (Sophie 19.11.2026, «A · Drei Teile»): ① Im Notfall · ② Arztkoffer ·
// ③ Vorsorge und Angaben. Ein Titel je Teil, mit Nummer, über einer Linie (ausser dem ersten). Die Nummer ist eine
// Ziffer in einem gezeichneten Kreis (CSS), kein Schriftzeichen ①. Ebene h3 wie die Abschnitte darin (Wächter halten
// die Abschnitte als h3); der Teil unterscheidet sich durch Grösse und Linie.
export const TeilTitel = ({ palette, nr, id, children, tabIndex }) => {
  const h = React.createElement;
  const farbe = gesundheitFarbe(palette);
  return h('h3', { id, tabIndex, 'data-teil-nr': nr, style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px',
    margin: (nr === 1 ? 0 : space.xl + 'px') + ' 0 ' + space.sm + 'px', paddingTop: nr === 1 ? 0 : space.lg + 'px',
    borderTop: nr === 1 ? 'none' : '1px solid ' + palette.border, fontSize: text.lg, fontWeight: weight.semi, color: palette.text, scrollMarginTop: 'var(--mp-sprungabstand)' } },
    h('span', { 'aria-hidden': 'true', style: { display: 'inline-grid', placeItems: 'center', width: '26px', height: '26px', flexShrink: 0, borderRadius: '50%',
      border: '2px solid ' + farbe, color: palette.text, fontSize: text.xs, fontWeight: weight.semi, fontVariantNumeric: 'tabular-nums' } }, String(nr)),
    h('span', { style: { color: palette.text } }, children));
};

// ─── Der offene Arztkoffer (Sophie 18.11.2026: «einen kompletten arzt koffer gezeichnet», «wollen wir die seiten
// vereinen?» → Kapitel Gesundheit und Arztkoffer sind eine Seite). Zeichen der Gesundheit (Brand Book §5), in der
// Farbe Gesundheit. Im Deckel die fertigen Fächer als Knöpfe (antippen = Werkzeug), unten die geplanten gestrichelt,
// «bald». Gezeichnet aus HTML statt SVG: echte Knöpfe (Tastatur, Vorlesen, 44 px), Schrift wächst nicht klein.
// Die Notfallkarte steht nicht im Koffer: sie ist auf derselben Seite unter «Ihre Notfall-Unterlagen» (jedes Bild,
// jeder Weg einmal je Seite).
export const KOFFER_FAECHER = [
  { key: 'kvg', view: 'kvg', icon: 'insurance' },
  { key: 'kkbeleg', view: 'kk', icon: 'documents' },
  // Fach Impfausweis (Sophie 19.11.2026, «A · Liste + fällig»): eigene Seite, Rechnung naechsteImpfung.
  { key: 'impfausweis', view: 'impfausweis', icon: 'health' },
  // Fach Karteikarten (Sophie 19.11.2026, «B · Karteikasten»): eigene Seite, Rechnung karteikarten.
  { key: 'karteikarten', view: 'karteikarten', icon: 'contacts' },
  // Fach Wochenblister (Sophie 20.11.2026, «A · Wochenblister»): eigene Seite, Rechnung wochenblister.
  { key: 'blister', view: 'blister', icon: 'blister' },
  { key: 'thermometer', view: null },
];
export const KOFFER_ANKER = 'mp-gesundheit-koffer';

export const GesundheitKoffer = ({ palette, t, onNavigate }) => {
  const h = React.createElement;
  const farbe = gesundheitFarbe(palette);
  const fertig = KOFFER_FAECHER.filter((f) => f.view);
  const bald = KOFFER_FAECHER.filter((f) => !f.view);
  const titel = (f) => t('arztkoffer.faecher.' + f.key + '.title');
  const raster = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: space.sm + 'px' };
  return h('section', { id: KOFFER_ANKER, 'data-teil': 'gesundheit-koffer', 'aria-labelledby': KOFFER_ANKER + '-titel', style: { margin: '0 0 ' + space.md + 'px' } },
    // Teil ② der Seite: der Titel des Koffers ist der Titel des Teils.
    h(TeilTitel, { palette, nr: 2, id: KOFFER_ANKER + '-titel' }, t('arztkoffer.title')),
    // Griff
    h('div', { 'aria-hidden': 'true', style: { width: '72px', height: '16px', margin: '0 auto', border: '4px solid ' + farbe, borderBottom: 'none', borderRadius: radius.lg + 'px ' + radius.lg + 'px 0 0' } }),
    // Deckel: fertige Fächer
    h('div', { 'data-teil': 'koffer-deckel', style: { border: '3px solid ' + farbe, borderRadius: radius.lg + 'px ' + radius.lg + 'px ' + radius.xs + 'px ' + radius.xs + 'px', padding: space.sm + 'px', ...raster } },
      fertig.map((f) => h('button', { key: f.key, type: 'button', 'data-fach': f.key, onClick: () => onNavigate && onNavigate(f.view),
        style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', minHeight: '56px', padding: space.sm + 'px', textAlign: 'left',
          background: palette.surface, color: palette.text, border: '1px solid ' + palette.border, borderRadius: radius.md, cursor: 'pointer', fontFamily: 'inherit' } },
        h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: farbe, flexShrink: 0 } }, h(Icon, { name: f.icon, size: 22 })),
        h('span', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, titel(f))))),
    // Boden: geplante Fächer
    h('div', { 'data-teil': 'koffer-boden', style: { border: '3px solid ' + farbe, borderTop: '1px solid ' + farbe, borderRadius: radius.xs + 'px ' + radius.xs + 'px ' + radius.lg + 'px ' + radius.lg + 'px', padding: space.sm + 'px', marginTop: '3px', ...raster } },
      bald.map((f) => h('div', { key: f.key, 'data-fach': f.key, 'data-bald': 'ja',
        style: { minHeight: '56px', padding: space.sm + 'px', border: '1px dashed ' + palette.border, borderRadius: radius.md, color: palette.mid } },
        h('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, titel(f)),
        h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, t('arztkoffer.inVorbereitung'))))));
};
