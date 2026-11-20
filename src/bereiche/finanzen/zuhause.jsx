import React, { useEffect, useState } from 'react';
import { text, weight, space, leading } from '../../config/tokens.js';
import { betrag, zahl } from '../../utils/geld.js';
import { CHAPTER_KEYS } from '../../config/constants.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';
import { schildOptionen } from '../../data/schutzschild.js';
import { linkStil } from '../../components/PrimaryButton.jsx';
import { Monatsring } from '../../components/Monatsring.jsx';
import { NetzSchild } from '../../components/NetzSchild.jsx';
import { Kalenderblatt } from '../../components/Kalenderblatt.jsx';
import { DrittelHaus } from '../wohnen/bilder.jsx';
import { wohnkostenRechnung } from '../wohnen/rechnung.js';
import { FranchiseThermometer } from '../notfall/bilder.jsx';
import { franchiseStand } from '../notfall/rechnung.js';
import { lohnMuenzen, steuerFranken, notgroschen, steuerfrist } from './rechnung.js';
import { versicherungenSumme, monatsAusgaben } from '../../utils/monatsrechnung.js';
import { MuenzLohn, SteuerMuenzen, Sparschwein } from './bilder.jsx';
import { finanzWerte, ipvStatusKurz, formatCHF } from '../../components/FinanzAuswertung.jsx';
import { ladeIPVModelle } from '../../config/cantonalData.js';

// Lebensbereich Finanzen · die Szene (Bauplan Lebensbereich, Entwurf Stebler Studios 20.11.2026, Skizze
// _werkbank/entwuerfe/finanzen-mischung.html). Der Monatsring ist die Szene:
//   oben      der Lohn als Münzleiste — fliesst in den Ring
//   der Ring  jedes Stück trägt das Bild seines Lebensbereichs: Wohnen das Drittel-Haus, Versicherungen das Netz-Schild,
//             Steuern den Steuerfranken (mit der geschätzten Steuer darunter)
//   unten     was bleibt, sammelt sich im Sparschwein (Notgroschen)
//   am Rand   was kein Ring-Stück ist, mit seinem eigenen Bild: Kalenderblatt (Steuerfrist, Behörden), Fieberthermometer
//             (Franchise, Gesundheit)
// Jedes Bild steht auf der Seite einmal. Offen (FINANZEN-BAUPLAN-2026-11-20.md): Lohn-Zuhause, Bild der KK-Last (erst nach
// Gesundheit), IPV in der Krankenkassen-Logik, Tür am Mini-Haus, Ort des Tachos.
const zahlStil = { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' };

export const FinanzenSzene = ({ palette, t, data, isDarkMode, onNavigate, einkommen, verplant, titel, titelJahr, zahl: bleibt, kopf }) => {
  const h = React.createElement;
  // Die IPV-Kantonsmodelle laden nach (wie FinanzenImKapitel): danach einmal neu zeichnen.
  const [, setIpvGeladen] = useState(0);
  useEffect(() => {
    let aktiv = true;
    ladeIPVModelle().then(() => { if (aktiv) setIpvGeladen((n) => n + 1); }).catch(() => {});
    return () => { aktiv = false; };
  }, []);
  const w = finanzWerte(data, t);
  const lohn = lohnMuenzen(data);
  const steuer = steuerFranken(data);
  const tank = notgroschen(data);
  const frist = steuerfrist(data);
  const fr = franchiseStand(data);
  const wohnen = (() => { try { return wohnkostenRechnung(data?.wohnen, data); } catch { return null; } })();
  const v = data?.versicherungen || {};
  const netzOpts = { ...schildOptionen(data), finanzen: data?.finanzen, kanton: data?.basis?.canton };

  const weg = (label, ziel) => onNavigate && h('button', {
    type: 'button', className: 'mp-link', onClick: ziel,
    style: { ...linkStil(palette), minHeight: '44px', fontSize: text.sm, padding: 0, textAlign: 'left' },
  }, label + ' ›');
  const satz = (inhalt) => h('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, inhalt);
  const block = (teil, bild, inhalt) => h('div', { 'data-teil': teil, style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm + 'px ' + space.md + 'px', margin: space.md + 'px 0' } },
    h('div', { 'aria-hidden': 'true', style: { flex: '0 0 auto' } }, bild), h('div', { style: { minWidth: 0, flex: '1 1 180px' } }, inhalt));

  // Bilder an den Ring-Stücken
  const bilder = {
    wohnen: wohnen && wohnen.anteil != null ? h(DrittelHaus, { palette, t, anteil: wohnen.anteil, ueberDrittel: wohnen.ueberDrittel, fuell: bereichFillColor('wohnen', isDarkMode), groesse: 'klein' }) : null,
    versicherungen: h(NetzSchild, { palette, t, versicherungen: v, ...netzOpts, groesse: 'klein' }),
  };
  const praemie = Number(v.kkPremium) || 0;
  const unter = {
    // Steuer als Münzbalken (eine Münze = 1 % vom Einkommen, Bund grau), darunter Jahr, Anteil und Legende.
    steuern: steuer ? h('div', { 'data-teil': 'steuer-muenzen-zeile', style: { margin: space.xs + 'px 0' } },
      h(SteuerMuenzen, { palette, isDarkMode, anteil: steuer.anteilEinkommen, bundAnteil: steuer.bundAnteilEinkommen }),
      h('div', { 'data-instrument-zahl': 'steuer', style: { fontSize: text.sm, color: palette.text, marginTop: '4px' } },
        t('instrumente.steuerMuenzZeile', { betrag: betrag(steuer.total), pct: zahl(steuer.anteilEinkommen * 100, { hoechstens: 0 }) })),
      h('div', { style: { fontSize: text.xs, color: palette.mid } }, t('instrumente.steuerMuenzLegende') + ' · ' + t('instrumente.steuerSatz'))) : null,
    // Satz aus dem KK-Spiegel (KKLastCard), der bis 20.11. als eigene Karte unten stand. Das Bild der KK-Last folgt erst
    // nach Gesundheit (FINANZEN-BAUPLAN-2026-11-20.md).
    versicherungen: praemie > 0 && verplant > 0 ? t(Math.round(versicherungenSumme(monatsAusgaben(data))) <= Math.round(praemie) ? 'kkLast.spiegelSatzAllein' : 'kkLast.spiegelSatz',
      { praemie: Number.isInteger(praemie) ? zahl(praemie) : zahl(praemie, { stellen: 2 }), summe: zahl(Math.round(versicherungenSumme(monatsAusgaben(data)))) })
      // Die IPV gehört in die Logik der Krankenkasse (Stebler Studios 20.11.2026), darum hier und nicht als eigene Karte.
      + ' ' + t('finanzUebersicht.ipv') + ': ' + ipvStatusKurz(t, w) : null,
  };

  return h('div', { 'data-teil': 'finanzen-szene' },
    // Lohn als Münzleiste
    lohn.show && block('szene-lohn',
      lohn.vergleichbar ? h(MuenzLohn, { palette, fuell: lohn.fuell, isDarkMode, groesse: 'gross' }) : null,
      h(React.Fragment, null,
        h('div', { 'data-instrument-zahl': 'lohn', style: { ...zahlStil, color: palette.text } }, betrag(lohn.netto),
          h('span', { style: { fontSize: text.sm, fontWeight: weight.normal, color: palette.mid } }, ' ' + t('common.perMonth'))),
        lohn.brutto && satz('≈ ' + betrag(lohn.brutto) + ' ' + t('einkommensfeld.brutto')),
        weg(t('lohnEinordnung.title'), () => onNavigate('chapter', CHAPTER_KEYS.indexOf('ausbildung'))))),
    // Der Ring
    h(Monatsring, { palette, t, data, einkommen, verplant, titel, titelJahr, zahl: bleibt, kopf, bilder, unter }),
    // Was bleibt → Sparschwein
    tank.show && tank.mode === 'months' && block('szene-sparschwein',
      h(Sparschwein, { palette, isDarkMode, monate: tank.months, empfohlen: tank.recommendMonths, voll: tank.fullMonths }),
      h(React.Fragment, null,
        h('div', { 'data-instrument-zahl': 'notgroschen', style: { ...zahlStil, color: palette.text } }, zahl(tank.months, { hoechstens: 1 }),
          h('span', { style: { fontSize: text.sm, fontWeight: weight.normal, color: palette.mid } }, ' ' + t(tank.months === 1 ? 'instrumente.tankMonat' : 'instrumente.tankMonate'))),
        satz(t('instrumente.tankSatz')),
        w.hasAssets && satz(t('finanzUebersicht.assets') + ': ' + formatCHF(w.totalAssets)))),
    // Am Rand: was kein Ring-Stück ist, mit eigenem Bild
    (frist || fr) && h('div', { 'data-teil': 'szene-rand', style: { display: 'flex', flexWrap: 'wrap', gap: space.md + 'px ' + space.xl + 'px', paddingTop: space.md + 'px', borderTop: '1px solid ' + palette.border + '88' } },
      frist && h('div', { 'data-rand': 'steuerfrist', style: { display: 'flex', gap: space.sm + 'px', alignItems: 'center', flex: '1 1 220px', minWidth: 0 } },
        h(Kalenderblatt, { iso: frist.iso, palette, vorbei: frist.vorbei, klein: true }),
        h('div', null, satz(t('instrumente.steuerFrist', { datum: frist.iso.split('-').reverse().join('.') })),
          weg(t('chapters.behoerden.title'), () => onNavigate('chapter', CHAPTER_KEYS.indexOf('behoerden'))))),
      fr && h('div', { 'data-rand': 'franchise', style: { display: 'flex', gap: space.sm + 'px', alignItems: 'center', flex: '1 1 220px', minWidth: 0 } },
        h('div', { 'aria-hidden': 'true' }, h(FranchiseThermometer, { palette, t, stand: fr, groesse: 'klein' })),
        h('div', null,
          h('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } },
            betrag(fr.franchiseOffen > 0 ? fr.franchiseVerbraucht : fr.franchise),
            fr.franchiseOffen > 0 && h('span', { style: { fontSize: text.sm, fontWeight: weight.normal, color: palette.mid } }, ' ' + t('instrumente.franchiseVon', { franchise: zahl(fr.franchise) }))),
          // Bezahlte Gesundheitskosten gehören zu Finanzen (#898); sie stehen beim Franchise-Stand, aus dem sie kommen.
          w.hasGesundheitsausgaben && h('div', { style: { fontSize: text.xs, color: palette.mid } },
            t('finanzUebersicht.healthCosts') + ': ' + formatCHF(w.gesundheitsausgaben)
            + (w.gesundheitsausgabenOffen > 0 ? ' · ' + t('finanzUebersicht.healthCostsOpen', { amount: formatCHF(w.gesundheitsausgabenOffen) }) : '')),
          weg(t('instrumente.franchise'), () => onNavigate('gesundheit'))))
    )
  );
};
