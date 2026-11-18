import React from 'react';
import { text, weight, space, radius } from '../../config/tokens.js';
import { zahl, betrag as chfBetrag } from '../../utils/geld.js';
import { linkStil } from '../../components/PrimaryButton.jsx';
import { Kalenderblatt } from '../../components/Kalenderblatt.jsx';
import { loadVorsorgeDates } from '../../utils/vorsorge.js';
import { bereitschaft, lagenStand, franchiseStand, naechstesFaellig } from './rechnung.js';
import { FranchiseAblesung, HerzPuls } from './bilder.jsx';

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

const monatJahr = (iso, locale) => {
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
              : t('gesundheitZuhause.faelligBeleg'), 'faellig-satz'),
            faellig.vorbei && satz(t('gesundheitZuhause.faelligVorbei'), 'faellig-vorbei'))
        : satz(t('gesundheitZuhause.faelligLeer'), 'faellig-leer'),
      faellig && faellig.art === 'beleg'
        ? weg(t('gesundheitZuhause.zuDenBelegen'), () => onNavigate('kvg', undefined, 'franchise'))
        : weg(t('gesundheitZuhause.zumKatalog'), () => onNavigate('kvg', undefined, 'katalog'))));

  return h('div', { 'data-teil': 'gesundheit-zuhause', style: { marginBottom: space.lg + 'px' } }, franchise, naechstes);
};
