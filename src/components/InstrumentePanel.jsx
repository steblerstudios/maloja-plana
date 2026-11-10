import React, { useState, useEffect, useContext } from 'react';
import { I18nContext } from '../i18n/index.js';
import { schildOptionen } from '../data/schutzschild.js';
import { netzSchildTeile } from '../data/netzSchild.js';
import { NetzSchild } from './NetzSchild.jsx';
import { ReserveTank } from './ReserveTank.jsx';
import { wohnkostenRechnung, DrittelBalkenKlein, wohnkostenSatzKey } from './WohnkostenInstrument.jsx';
import { RegionalBarometerKlein, lageZurRegion, mietVorbehalte } from './RegionalBarometer.jsx';
import { Kalenderblatt } from './Kalenderblatt.jsx';
import { GaengeKlein } from './BehoerdenInstrument.jsx';
import { GAENGE, gangErledigt, gespeicherteHaken } from '../utils/behoerdenGaenge.js';
import { bereitschaft, BereitRingKlein } from './NotfallImKapitel.jsx';
import { berechneFranchise } from '../data/kvgLeistungen.js';
import { getRentComparison } from '../data/mietpreise.js';
import { getHouseholdInfo } from '../config/cantonalData.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { reserveTankState } from '../data/reserveTank.js';
import { monthlyExpenses } from '../data/haushaltskosten.js';
import { steuernFuerProfil, steuerEingabenAusDaten } from '../data/kantonaleSteuerdaten.js';
import { steuerfristVorbei } from '../utils/steuerfrist.js';
import { fristAbstand } from '../utils/fristAbstand.js';
import { heuteIso } from '../utils/fristen.js';
import { CHAPTER_KEYS, DARK_PALETTE } from '../config/constants.js';
import { franchiseVorschlag, gesundheitskostenBisher, parseFranchise } from '../data/franchiseTacho.js';
import { ladeFranchiseOpt } from '../data/franchiseLaden.js';
import { giltAlsVerheiratet } from '../utils/zivilstand.js';
import { zahl, betrag as chfBetrag } from '../utils/geld.js';
import { PanelTitle } from './Heading.jsx';
import { text, weight, space, radius, leading, duration, ease, INSTRUMENT_GROESSE } from '../config/tokens.js';

// Dashboard-Spiegel der vier „Instrumente": eine kompakte Reihe, die jedes
// Instrument als Mini-Glyph + Peilung + Ort zeigt und in die Detailansicht führt.
// Live wo es günstig/robust ist (Schild, Tankanzeige, Steuer-Säule — reine Zustands-
// Funktionen). Das Franchise-Kreuz braucht die Prämien-Pipeline → hier bewusst nur
// Einstieg statt eines erfundenen Standes (Ehrlichkeit). Seit 25.09.2026 hat jedes
// Instrument eine eigene Form: Kreuz · Säule · Tacho (Reserve) · Schild.

// ── Mini-Glyphen (ohne Text, damit sie klein lesbar bleiben) ──

// Franchise-Stand klein (10.11.2026): Balken bis zur Franchise, Strich am Ende = Franchise erreicht. Nur das Bild.
const miniFranchise = (palette, anteil) => {
  const h = React.createElement;
  return h('svg', { viewBox: '0 0 60 40', width: '100%', 'aria-hidden': true, 'data-franchise': 'klein', style: { maxWidth: INSTRUMENT_GROESSE.klein + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    h('rect', { x: 2, y: 16, width: 54, height: 8, rx: 4, fill: palette.border }),
    anteil > 0 && h('rect', { x: 2, y: 16, width: Math.max(8, Math.min(1, anteil) * 54), height: 8, rx: 4, fill: palette.sky }),
    h('line', { x1: 57, y1: 10, x2: 57, y2: 30, stroke: palette.text, strokeWidth: 2 }));
};

// Der kleine Tank stand bis 10.11.2026 hier als eigene Zeichnung (miniGauge) — jetzt ReserveTank groesse 'klein'.

// Steuer-Säule im Kleinen — Spiegel der EINEN Säule aus SteuerSaeulen.jsx, die die Person
// betrifft (Wunsch 25.09.2026): ihr Zivilstand, in Sand wie «aktuell gewählt» im Rechner,
// oben gerundet, auf der Grundlinie stehend. Eine einzelne Säule hat nichts, woran ihre Höhe
// sich messen könnte — darum feste Höhe; die Zahl darunter trägt die Aussage. Ohne Betrag
// gestrichelt, wie die Platzhalter-Säule im Rechner. <title> mit Name und Betrag (Hover).
// F7-K5-1 (01.11.2026): Mit Gesamtzahl zwei Teile: unten satt die Bundessteuer, oben heller Kanton und Gemeinde (Schätzung).
const S_BASIS = 40, S_BREIT = 16, S_HOCH = 30;
const oben = (x, y, w, h, r) => 'M ' + x + ' ' + (y + h) + ' V ' + (y + r) + ' Q ' + x + ' ' + y + ' ' + (x + r) + ' ' + y
  + ' H ' + (x + w - r) + ' Q ' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) + ' V ' + (y + h);
const miniSaeule = (palette, t, { betragJahr, verheiratet, bundAnteil, titelText }) => {
  const h = React.createElement;
  const x = 20;
  const titel = titelText || t('tax.saeulen.' + (verheiratet ? 'gemeinsam' : 'ledig')) + (betragJahr != null ? ': ' + chfBetrag(betragJahr) : '');
  // Mindesthöhe, damit der Bund-Teil auch bei kleinem Anteil sichtbar bleibt; die Zahl steht im Text.
  const bundHoch = bundAnteil != null ? Math.max(5, Math.round(S_HOCH * bundAnteil)) : null;
  return h('svg', { viewBox: '0 0 56 44', width: '100%', style: { height: 'auto', display: 'block' }, role: 'img', 'aria-label': titel },
    bundHoch != null && h('path', { d: oben(x, S_BASIS - S_HOCH, S_BREIT, S_HOCH, 3) + ' Z', fill: palette.sand, opacity: 0.4 }, h('title', null, titel)),
    bundHoch != null && h('rect', { x, y: S_BASIS - bundHoch, width: S_BREIT, height: bundHoch, fill: palette.sand }),
    bundHoch != null ? null : betragJahr != null
      ? h('path', { d: oben(x, S_BASIS - S_HOCH, S_BREIT, S_HOCH, 3) + ' Z', fill: palette.sand }, h('title', null, titel))
      : h('path', { d: oben(x + 0.5, S_BASIS - S_HOCH, S_BREIT - 1, S_HOCH, 2), fill: 'none', stroke: palette.mid, strokeWidth: 1, strokeDasharray: '2 2' }, h('title', null, titel)),
    h('line', { x1: 12, x2: 44, y1: S_BASIS + 0.5, y2: S_BASIS + 0.5, stroke: palette.border, strokeWidth: 1 })
  );
};

// Mini-Kreuz — Spiegel des Franchise-Kreuzes (PraemienOrientierung): zwei Linien, die sich
// kreuzen (hohe Franchise sky, tiefe sand, wie dort). Bewusst ohne Strich für die eigenen
// Kosten — die Prämien-Pipeline läuft hier nicht, also kein erfundener Stand.
const miniKreuz = (palette) => {
  const h = React.createElement;
  return h('svg', { viewBox: '0 0 64 44', width: '100%', style: { height: 'auto', display: 'block' }, 'aria-hidden': true },
    h('line', { x1: 4, x2: 60, y1: 40.5, y2: 40.5, stroke: palette.border, strokeWidth: 1 }),
    h('polyline', { points: '6,28 34,15 58,15', fill: 'none', stroke: palette.sand, strokeWidth: 2.5, strokeLinejoin: 'round' }),
    h('polyline', { points: '6,35 40,11 58,7', fill: 'none', stroke: palette.sky, strokeWidth: 2.5, strokeLinejoin: 'round' }),
    h('rect', { x: 55, y: 12, width: 6, height: 6, fill: palette.sand }),
    h('circle', { cx: 58, cy: 7, r: 3, fill: palette.sky })
  );
};

// Seit 09.11.2026 zeigt die Schild-Kachel das Netz-Schild klein (Stebler Studios: «wir nehmen das Netz-Schild»);
// das alte Mini-Schild «Pflicht / Empfohlen» (36 px) war beim Umbau F7-K3-6 stehen geblieben.

// eingebettet: steht im Dashboard-Block «Was steht mir zu?» (seit 25.09.2026) —
// Titel dann in der Grösse der übrigen Zwischentitel dort, kein eigener Abstand nach unten.
export const InstrumentePanel = ({ palette, t, data, onNavigate, eingebettet = false, nur = null }) => {
  const h = React.createElement;
  const v = data?.versicherungen || {};
  // Dieselbe Rechnung wie das Netz-Schild im Kapitel: eingetragen = Summe der gefüllten Stufen über alle Teile.
  const netzOpts = { ...schildOptionen(data), finanzen: data?.finanzen, kanton: data?.basis?.canton };
  const netz = netzSchildTeile(v, netzOpts);
  const netzZahl = netz.teile.reduce((a, p) => ({ covered: a.covered + p.erreicht, total: a.total + p.n }), { covered: 0, total: 0 });
  const tank = reserveTankState({ savings: Number(data?.finanzen?.savingsAccount) || 0, monthlyExpenses: monthlyExpenses(data) });

  // Steuer: dieselbe Rechnung wie Steuerrechner und Finanz-Übersicht (E39: steuernFuerProfil).
  // F7-K5-1 (Stebler Studios 01.11.2026): die ganze Einkommenssteuer, dieselbe Zahl wie das Kapitel Finanzen, als grobe
  // Schätzung ausgewiesen. Fachprüfung 01.11.2026: nur für den gemessenen Fall (Lohn erfasst, unselbständig, nicht pensioniert).
  // Mögliche Quellensteuer sperrt die Rechnung selbst (quellensteuerMoeglich), hier nur der kurze Satz.
  // Sonst bleibt die Bundessteuer allein.
  let bundessteuer = null;
  let steuerGanz = null;
  let quellensteuer = false;
  try {
    if ((Number(data?.finanzen?.monthlyIncome) || 0) > 0 || (Number(data?.finanzen?.taxableIncome) || 0) > 0) {
      const eingaben = steuerEingabenAusDaten(data);
      const st = steuernFuerProfil(eingaben);
      bundessteuer = st?.bund ? Math.round(st.bund.steuer) : null;
      quellensteuer = String(st?.grund || '').startsWith('quellensteuer');
      if (st?.bund && st.kanton?.kantonal && (Number(data?.finanzen?.monthlyIncome) || 0) > 0) {
        // Kurz, die Kachel ist schmal; ausführlich in Finanzen (annahmenTexte).
        const annahmen = [['ohneDreizehnten', 'steuerOhne13'], ['alleinverdiener', 'steuerAllein'], ['einzeln', 'steuerEinzeln'], ['kinderabzugGanz', 'steuerKinder']]
          .filter(([k]) => st.annahmen?.[k]).map(([, k]) => t('instrumente.' + k));
        steuerGanz = { total: st.kanton.kantonal.total, bund: bundessteuer, annahmen };
      }
    }
  } catch { /* Orientierung, nie blockierend */ }

  // Franchise-Kreuz: erster Vorschlag statt der Frage — sobald die Prämien im Hintergrund
  // geladen sind (nur mit Kasse + PLZ). Bis dahin und ohne Kosten bleibt die Frage stehen.
  const [franchiseOpt, setFranchiseOpt] = useState(null);
  const plz = data?.wohnen?.postalCode, kasse = data?.versicherungen?.kkInsurer, geburt = data?.basis?.dateOfBirth;
  useEffect(() => {
    if (nur && !nur.includes('tacho')) return undefined;
    let aktiv = true;
    ladeFranchiseOpt(data).then((o) => { if (aktiv) setFranchiseOpt(o); }).catch(() => { if (aktiv) setFranchiseOpt(null); });
    return () => { aktiv = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plz, kasse, geburt]);
  const vorschlag = franchiseOpt ? franchiseVorschlag(franchiseOpt, {
    costs: gesundheitskostenBisher(data),
    eigeneFranchise: parseFranchise(data?.versicherungen?.franchise),
    ersparnisse: data?.finanzen?.savingsAccount,
  }) : { art: 'offen' };
  // Immer als Schätzung und mit dem Prämienjahr (Rechts-Prüfung 25.09.2026). Seit 26.10.2026 ist das in der
  // Wechselzeit (Ende September bis 31.12.) das Folgejahr — franchiseLaden.js rechnet dann mit dessen Prämien.
  const kreuzSub = vorschlag.art === 'passt' ? t(vorschlag.polster ? 'instrumente.kreuzPasstPolster' : 'instrumente.kreuzPasst')
    : vorschlag.art === 'wechsel' ? t(vorschlag.polster ? 'instrumente.kreuzWechselPolster' : 'instrumente.kreuzWechsel', { franchise: zahl(vorschlag.franchise), jahr: franchiseOpt?.praemienJahr || '' })
    : t('instrumente.tachoSub');

  const setup = t('instrumente.setup');
  // Eigene Zeile für die Frist: direkt neben dem Betrag läse sie sich als Zahlungstermin (Fachprüfung 01.11.2026).
  const frist = data?.behoerden?.taxFilingDeadline;
  const heute = heuteIso();
  const fristGilt = frist && (frist >= heute || steuerfristVorbei(data.behoerden, heute));
  const steuerSaetze = steuerGanz ? [
    t('instrumente.steuerGanz', { total: zahl(steuerGanz.total) }),
    t('instrumente.steuerDavon', { bund: zahl(steuerGanz.bund) }),
    ...steuerGanz.annahmen,
    ...(fristGilt ? [t('instrumente.steuerFrist', { datum: frist.split('-').reverse().join('.') })] : []),
  ] : [];

  // Wohnen (10.11.2026, «zwei Instrumente je Lebensbereich»): dieselben Rechnungen wie im Kapitel Wohnen.
  const wohnR = wohnkostenRechnung(data?.wohnen, data, null);
  const wohnFarbe = bereichFillColor('wohnen', palette.bg === DARK_PALETTE.bg) || palette.sage;
  const kantonW = data?.basis?.canton || '';
  const mietVergleich = kantonW && wohnR.netto > 0 && !wohnR.eigentum
    ? getRentComparison(kantonW, { rooms: data?.wohnen?.rooms, householdSize: (getHouseholdInfo(data) || {}).householdSize || 1 }) : null;
  const mietLage = mietVergleich ? lageZurRegion(wohnR.netto, mietVergleich.regional) : null;
  const mietHinweise = mietVergleich ? mietVorbehalte(t, mietVergleich) : [];

  // Sprache fürs Kalenderblatt (Monatsname) wie im Kapitel Behörden. useContext statt useT: Tests rendern ohne Provider.
  const lang = useContext(I18nContext)?.lang || 'de';
  const blattLocale = { de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en-GB', rm: 'de-CH' }[lang] || 'de-CH';
  // Behörden (10.11.2026): dieselben Regeln wie das Kapitel (BehoerdenInstrument, utils/behoerdenGaenge.js).
  const bh = data?.behoerden || {};
  const fristIso = bh.taxFilingDeadline ? String(bh.taxFilingDeadline).slice(0, 10) : null;
  const fristVorbei = !!fristIso && steuerfristVorbei(bh, heute);
  const fristAb = fristIso ? fristAbstand(fristIso) : null;
  // Zahl nur, wenn die Frist noch kommt oder verpasst ist und noch etwas offen sein kann — eine erledigte alte Frist ist Geschichte.
  const fristZeigen = fristAb && (!fristAb.vorbei || fristVorbei);
  const erledigteGaenge = GAENGE.filter((g) => gangErledigt(g.id, gespeicherteHaken(), bh)).length;
  const gaengeBegonnen = Object.keys(bh).length > 0;

  // Gesundheit (10.11.2026): Bereitschaft wie das Kapitel Notfall, Franchise-Stand wie die KVG-Seite (Reiter Franchise).
  const bereit = bereitschaft(data);
  const eigeneFr = parseFranchise(data?.versicherungen?.franchise);
  const frJahr = new Date().getFullYear();
  const frStand = eigeneFr != null ? berechneFranchise(eigeneFr, gesundheitskostenBisher(data)) : null;

  const tiles = [
    {
      key: 'tacho', name: t('instrumente.tacho'), sub: kreuzSub,
      // Gemeinsames System (10.11.2026): Bild · grosse Zahl · ein Satz. Betrag über betrag() → Sichtschutz greift.
      ...(vorschlag.art === 'passt' || vorschlag.art === 'wechsel' ? {
        zahl: { wert: chfBetrag(vorschlag.franchise), einheit: '' },
        satz: vorschlag.art === 'passt' ? kreuzSub
          : t(vorschlag.polster ? 'instrumente.kreuzWechselPolsterKurz' : 'instrumente.kreuzWechselKurz', { jahr: franchiseOpt?.praemienJahr || '' }),
      } : {}),
      glyph: miniKreuz(palette),
      onClick: () => onNavigate('praemien'),
    },
    {
      key: 'steuerfrist', name: t('instrumente.steuerfrist'),
      ...(fristZeigen ? {
        zahl: fristAb.tage === 0 ? { wert: t('behördenStatus.today'), einheit: '' }
          : { wert: String(fristAb.n), einheit: t('instrumente.' + fristAb.einheit + (fristAb.n === 1 ? 'Eins' : '')) },
        satz: t(fristVorbei ? 'instrumente.steuerfristVorbeiSatz' : 'instrumente.steuerfristSatz'),
      } : {}),
      sub: fristIso ? t('dashboard.glanceNoDeadline') : setup,
      glyph: fristZeigen ? h(Kalenderblatt, { iso: fristIso, palette, locale: blattLocale, vorbei: fristVorbei }) : null,
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('behoerden')),
    },
    {
      key: 'gaenge', name: t('instrumente.gaenge'),
      ...(gaengeBegonnen ? {
        zahl: { wert: erledigteGaenge + '/' + GAENGE.length, einheit: '' },
        satz: t('instrumente.gaengeSatz'),
      } : {}),
      sub: setup,
      glyph: h(GaengeKlein, { palette, erledigt: erledigteGaenge, total: GAENGE.length }),
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('behoerden')),
    },
    {
      key: 'bereit', name: t('instrumente.bereit'),
      zahl: { wert: bereit.erledigt + '/' + bereit.gesamt, einheit: '' },
      satz: t('instrumente.bereitSatz'),
      sub: setup,
      glyph: h(BereitRingKlein, { palette, erledigt: bereit.erledigt, gesamt: bereit.gesamt }),
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('notfall')),
    },
    {
      key: 'franchise', name: t('instrumente.franchise'),
      ...(frStand ? {
        zahl: frStand.franchiseOffen > 0
          ? { wert: chfBetrag(frStand.franchiseVerbraucht), einheit: t('instrumente.franchiseVon', { franchise: zahl(frStand.franchise) }) }
          : { wert: chfBetrag(frStand.franchise), einheit: '' },
        satz: t(frStand.franchiseOffen > 0 ? 'instrumente.franchiseSatz' : 'instrumente.franchiseErreichtSatz', { jahr: frJahr }),
      } : {}),
      sub: setup,
      glyph: frStand ? miniFranchise(palette, frStand.franchise > 0 ? frStand.franchiseVerbraucht / frStand.franchise : 0) : null,
      onClick: () => onNavigate('kvg', undefined, 'franchise'),
    },
    {
      // Bis 25.09.2026 stand hier der Leistungs-Kompass — er ist jetzt Kopf der Leistungsliste.
      key: 'steuer', name: t('instrumente.steuer'),
      ...(steuerGanz && !quellensteuer ? {
        zahl: { wert: '≈ ' + chfBetrag(steuerGanz.total), einheit: '' },
        satz: t('instrumente.steuerSatz'),
        mehr: steuerSaetze.slice(1),
      } : {}),
      sub: quellensteuer ? t('instrumente.steuerQuelle')
        : steuerGanz ? steuerSaetze.map((z, i) => h('span', { key: i, style: { display: 'block', marginTop: i ? '2px' : 0, color: i ? palette.soft : palette.mid } }, z))
          : bundessteuer != null ? t('instrumente.steuerBetrag', { value: zahl(bundessteuer) }) : setup,
      glyph: miniSaeule(palette, t, {
        betragJahr: quellensteuer ? null : bundessteuer, verheiratet: giltAlsVerheiratet(data?.basis?.maritalStatus),
        bundAnteil: steuerGanz ? steuerGanz.bund / steuerGanz.total : null, titelText: steuerGanz ? steuerSaetze.join(' ') : null,
      }),
      onClick: () => (steuerGanz ? onNavigate('chapter', CHAPTER_KEYS.indexOf('finanzen')) : onNavigate('tax')),
    },
    {
      key: 'tank', name: t('instrumente.tank'),
      // Seit 10.11.2026 die Monate gross (wie zuoberst auf der Übersicht), statt «4.7 Monate Reserve» klein.
      zahl: tank.mode === 'months' && tank.level !== 'empty'
        ? { wert: zahl(tank.months, { hoechstens: 1 }), einheit: t(tank.months === 1 ? 'instrumente.tankMonat' : 'instrumente.tankMonate') } : null,
      satz: t('instrumente.tankSatz'),
      sub: tank.mode === 'months' ? t('instrumente.tankMonths', { months: tank.months }) : setup,
      glyph: h(ReserveTank, { palette, t, savings: tank.savings, monthlyExpenses: tank.monthlyExpenses || 0, groesse: 'klein' }),
      onClick: () => onNavigate('finanzuebersicht'),
    },
    {
      key: 'wohnkosten', name: t('instrumente.wohnkosten'),
      ...(wohnR.anteil != null ? {
        zahl: { wert: zahl(wohnR.anteil, { hoechstens: wohnR.ueberDrittel && Math.round(wohnR.anteil) === 33 ? 1 : 0 }) + ' %', einheit: '' },
        satz: t(wohnkostenSatzKey(wohnR)),
        mehr: [t('instrumente.wohnkostenDrittel')],
      } : {}),
      sub: wohnR.kosten > 0 ? t('instrumente.wohnkostenOhneEinkommen') : setup,
      glyph: wohnR.kosten > 0 ? h(DrittelBalkenKlein, { palette, r: wohnR, fillColor: wohnFarbe }) : null,
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('wohnen')),
    },
    {
      key: 'miete', name: t('instrumente.miete'),
      ...(mietLage ? {
        zahl: { wert: mietLage.richtung === 'Equal' ? '≈ 0 %' : (mietLage.pct > 0 ? '+' : '−') + Math.abs(mietLage.pct) + ' %', einheit: '' },
        satz: t('instrumente.mieteSatz', { year: mietVergleich.year }),
        mehr: mietHinweise,
      } : {}),
      sub: wohnR.eigentum ? t('instrumente.mieteEigentum') : setup,
      glyph: mietVergleich ? h(RegionalBarometerKlein, { palette, comparison: mietVergleich, userValue: wohnR.netto, fillColor: wohnFarbe }) : null,
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('wohnen')),
    },
    {
      key: 'schild', name: t('instrumente.schild'),
      ...(netz.st.touched && netzZahl.total > 0 ? {
        zahl: { wert: netzZahl.covered + '/' + netzZahl.total, einheit: '' },
        satz: t('instrumente.schildSatz'),
      } : {}),
      sub: netz.st.touched ? t('instrumente.schildCount', { covered: netzZahl.covered, total: netzZahl.total }) : setup,
      glyph: netz.st.touched ? h(NetzSchild, { palette, t, versicherungen: v, ...netzOpts, groesse: 'klein' }) : null,
      onClick: () => onNavigate('chapter', 3),
    },
  ];

  // F7-D10: in der Kapitel-Zeile nur die Kacheln dieses Kapitels, ohne Titel.
  const kacheln = nur ? nur.map((k) => tiles.find((x) => x.key === k)).filter(Boolean) : tiles;
  const titel = h(PanelTitle, {
    palette,
    style: eingebettet
      ? { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text }
      : { margin: '0 0 ' + space.xs + 'px 0' },
  }, t('instrumente.title'));

  return h('div', { style: nur ? { padding: '4px 0 ' + space.sm + 'px' } : eingebettet ? { marginTop: space.lg + 'px' } : { marginBottom: space['2xl'] + 'px' } },
    // Eingebettet: Titel ohne Einleitung — die Finanz-Übersicht steht als Karte direkt darüber.
    nur ? null : eingebettet ? h('div', { style: { marginBottom: space.sm + 'px' } }, titel) : titel,
    !eingebettet && !nur && h('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', lineHeight: leading.relaxed } }, t('instrumente.intro')),
    // Festes 2-Spalten-Raster: bei genau vier Instrumenten ergibt das ein ruhiges
    // 2×2 statt eines verwaisten 3+1 (auto-fit liess bei ~570 px drei Kacheln zu).
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: space.sm + 'px' } },
      kacheln.map(tile => h('button', {
        key: tile.key,
        onClick: tile.onClick,
        ...(tile.zahl ? { 'aria-label': tile.name + ': ' + tile.zahl.wert + (tile.zahl.einheit ? ' ' + tile.zahl.einheit : '') + '. ' + tile.satz + (tile.mehr && tile.mehr.length ? '. ' + tile.mehr.join(' ') : ''), title: tile.name } : {}),
        style: {
          // Die Säule trägt mehrere Sätze: In der Finanzen-Zeile hat jede Kachel die ganze Breite, sonst brechen sie auf dem Handy in viele kurze Zeilen.
          ...(nur?.includes('steuer') ? { gridColumn: '1 / -1' } : {}),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          padding: space.md + 'px', background: 'transparent', color: palette.text,
          border: '1px solid ' + palette.border + '44', borderRadius: radius.md,
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
          transition: 'background ' + duration.normal + 'ms ' + ease + ', border-color ' + duration.normal + 'ms ' + ease,
        },
        onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; e.currentTarget.style.borderColor = palette.sage + '55'; },
        onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = palette.border + '44'; },
      },
        // Spiegel Startseite: ein Behälter, eine Breite für alle Instrumente (INSTRUMENT_GROESSE.klein, Brand Book «Instrumente»).
        h('div', { 'data-instrument-glyph': tile.key, style: { width: INSTRUMENT_GROESSE.klein + 'px', minHeight: INSTRUMENT_GROESSE.klein + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, tile.glyph),
        // Grosse Zahl (10.11.2026, zuerst beim Tank): eine Stufe unter der Karte zuoberst (2xl statt 3xl),
        // damit dort die lauteste Stelle bleibt. Mit Zahl entfällt der kleine Satz — er sagte dasselbe.
        tile.zahl && h('div', { 'data-instrument-zahl': tile.key, style: { display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: space.xs + 'px', flexWrap: 'wrap' } },
          h('span', { style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } }, tile.zahl.wert),
          tile.zahl.einheit && h('span', { style: { fontSize: text.sm, color: palette.mid } }, tile.zahl.einheit)),
        // Mit Zahl: ein Satz, was sie bedeutet, statt des Namens (Skizze 10.11.2026, «ja super genau so»).
        // Der Name bleibt im aria-label/title, damit das Instrument benannt ist.
        tile.zahl
          ? h('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, tile.satz)
          : h('div', { style: { fontSize: text.sm, fontWeight: weight.medium } }, tile.name),
        tile.zahl && tile.mehr && tile.mehr.length > 0 && h('div', { style: { fontSize: text.xs, color: palette.soft, lineHeight: leading.normal } },
          tile.mehr.map((z, i) => h('span', { key: i, style: { display: 'block', marginTop: i ? '2px' : 0 } }, z))),
        !tile.zahl && h('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal } }, tile.sub)
      ))
    )
  );
};

export default InstrumentePanel;
