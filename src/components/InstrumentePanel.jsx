import React, { useState, useEffect, useContext } from 'react';
import { I18nContext } from '../i18n/index.js';
import { schildOptionen } from '../data/schutzschild.js';
import { netzSchildTeile } from '../data/netzSchild.js';
import { NetzSchild } from './NetzSchild.jsx';
import { ReserveTank } from './ReserveTank.jsx';
import { wohnkostenRechnung, DrittelHaus, wohnkostenSatzKey } from './WohnkostenInstrument.jsx';
import { HaeuserzeileKlein, lageZurRegion, mietVorbehalte } from './RegionalBarometer.jsx';
import { Kalenderblatt } from './Kalenderblatt.jsx';
import { GaengeKlein } from './BehoerdenInstrument.jsx';
import { GAENGE, gangErledigt, gespeicherteHaken } from '../utils/behoerdenGaenge.js';
import { bereitschaft, BereitRingKlein } from './NotfallImKapitel.jsx';
import { lohnLage, LohnKlein, lohnLageWert } from './LohnEinordnung.jsx';
import { LOHN_REFERENZ } from '../data/lohnEinordnung.js';
import { LSE_VOLLZEIT_STUNDEN_WOCHE } from '../data/branchenLohn.js';
import { wochenstundenUnplausibel } from '../data/lohnCheck.js';
import { dienstLage } from '../utils/arbeitsverhaeltnis.js';
import { bisReferenzalter } from '../utils/referenzalterAbstand.js';
import { istLernend } from '../utils/anstellung.js';
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
    h('rect', { x: 2, y: 11, width: 54, height: 18, rx: 6, fill: palette.border }),
    anteil > 0 && h('rect', { x: 2, y: 11, width: Math.max(12, Math.min(1, anteil) * 54), height: 18, rx: 6, fill: palette.sky }),
    h('line', { x1: 57, y1: 4, x2: 57, y2: 36, stroke: palette.text, strokeWidth: 2.5 }));
};

// Dienstjahre klein (10.11.2026): Jahresringe wie im Baum — ein Ring je Dienstjahr, höchstens sechs. Nur das Bild.
const miniJahresringe = (palette, jahre) => {
  const h = React.createElement;
  const n = Math.max(1, Math.min(6, jahre + 1));
  return h('svg', { viewBox: '0 0 60 40', width: '100%', 'aria-hidden': true, 'data-dienst': 'klein', style: { maxWidth: INSTRUMENT_GROESSE.klein + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    Array.from({ length: n }, (_, i) => h('circle', { key: i, cx: 30, cy: 20, r: 3 + i * 3, fill: i === 0 ? palette.sand : 'none', stroke: palette.sand, strokeWidth: 1.5 })));
};

// Pensum klein (10.11.2026): Viertelkreis-Uhr, gefüllt im Verhältnis zur Vollzeit-Basis des Lohnvergleichs. Nur das Bild.
const miniPensum = (palette, anteil) => {
  const h = React.createElement;
  const a = Math.max(0, Math.min(1, anteil));
  const w = a * 2 * Math.PI, x = 30 + 15 * Math.sin(w), y = 20 - 15 * Math.cos(w);
  return h('svg', { viewBox: '0 0 60 40', width: '100%', 'aria-hidden': true, 'data-pensum': 'klein', style: { maxWidth: INSTRUMENT_GROESSE.klein + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    h('circle', { cx: 30, cy: 20, r: 15, fill: palette.border }),
    a >= 1 ? h('circle', { cx: 30, cy: 20, r: 15, fill: palette.sand })
      : a > 0 && h('path', { d: 'M30 20 L30 5 A15 15 0 ' + (a > 0.5 ? 1 : 0) + ' 1 ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' Z', fill: palette.sand }));
};

// Ferien klein (10.11.2026): Sonne mit Strahlen, gefüllt im Verhältnis der offenen Tage zum Anspruch. Nur das Bild.
const miniFerien = (palette, anteil) => {
  const h = React.createElement;
  const a = Math.max(0, Math.min(1, anteil));
  const strahlen = Array.from({ length: 8 }, (_, i) => {
    const w = i * Math.PI / 4, c = Math.cos(w), sn = Math.sin(w);
    return h('line', { key: 's' + i, x1: 30 + 13 * c, y1: 20 + 13 * sn, x2: 30 + 17 * c, y2: 20 + 17 * sn, stroke: palette.sand, strokeWidth: 1.8, strokeLinecap: 'round' });
  });
  return h('svg', { viewBox: '0 0 60 40', width: '100%', 'aria-hidden': true, 'data-ferien': 'klein', style: { maxWidth: INSTRUMENT_GROESSE.klein + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    ...strahlen,
    h('circle', { cx: 30, cy: 20, r: 9, fill: palette.border }),
    a > 0 && h('circle', { cx: 30, cy: 20, r: 9 * Math.sqrt(a), fill: palette.sand }));
};

// Referenzalter klein (10.11.2026): ein Lebensweg von der Geburt bis zum Referenzalter, Punkt = heute, Fahne am Ziel.
const miniLebensweg = (palette, anteil) => {
  const h = React.createElement;
  const x = 5 + Math.max(0, Math.min(1, anteil)) * 44;
  return h('svg', { viewBox: '0 0 60 40', width: '100%', 'aria-hidden': true, 'data-referenz': 'klein', style: { maxWidth: INSTRUMENT_GROESSE.klein + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    h('line', { x1: 5, y1: 27, x2: 49, y2: 27, stroke: palette.border, strokeWidth: 9, strokeLinecap: 'round' }),
    h('line', { x1: 5, y1: 27, x2: x, y2: 27, stroke: palette.sand, strokeWidth: 9, strokeLinecap: 'round' }),
    h('line', { x1: 54, y1: 33, x2: 54, y2: 4, stroke: palette.text, strokeWidth: 2.2 }),
    h('path', { d: 'M54 4 L60 8 L54 12 Z', fill: palette.text }),
    h('circle', { cx: x, cy: 27, r: 6, fill: palette.surface, stroke: palette.text, strokeWidth: 2.5 }));
};

// Grundordnung klein (10.11.2026): eine Grundmauer, ein Stein je Grundordnungs-Angabe, gesetzte gefüllt. Nur das Bild.
const miniGrundmauer = (palette, gesetzt, gesamt) => {
  const h = React.createElement;
  const proReihe = 5, reihen = Math.max(1, Math.ceil(gesamt / proReihe)), w = 9.6, hoch = 9, gap = 2;
  const y0 = 20 - (reihen * hoch + (reihen - 1) * gap) / 2;
  return h('svg', { viewBox: '0 0 60 40', width: '100%', 'aria-hidden': true, 'data-grundordnung': 'klein', style: { maxWidth: INSTRUMENT_GROESSE.klein + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    Array.from({ length: gesamt }, (_, i) => {
      const r = reihen - 1 - Math.floor(i / proReihe), c = i % proReihe, versatz = r % 2 ? w / 2 : 0;
      return h('rect', { key: i, x: 2 + versatz + c * (w + gap) - (r % 2 ? w / 4 : 0), y: y0 + r * (hoch + gap), width: w, height: hoch, rx: 1,
        fill: i < gesetzt ? palette.sand : palette.surface, stroke: i < gesetzt ? palette.sand : palette.mid, strokeWidth: 1 });
    }));
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
export const InstrumentePanel = ({ palette, t, data, onNavigate, eingebettet = false, nur = null, dokumente = [], grundordnungStand = null }) => {
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

  // Arbeit (10.11.2026): dieselbe Lage wie das Lohn-Barometer (lohnLage) — Zahl nur, wenn auch der Balken eine Lage zeigt.
  const lohn = lohnLage(data);
  const ls = lohn.state;
  const lohnHinweise = lohn.vergleichbar ? [
    ls.geschaetzt ? t('instrumente.lohnGeschaetzt') : null,
    ls.partTime ? t('lohnEinordnung.fulltimeNote') : null,
    ls.mlBreached ? t('instrumente.lohnUnterMindestlohn') : null,
  ].filter(Boolean) : [];

  // Arbeit — Dienstjahre (OR 335b/335c, utils/arbeitsverhaeltnis.js) und Pensum (Wochenstunden wie das Lohn-Barometer).
  const arbeit = data?.ausbildung || {};
  const dienst = dienstLage(arbeit.employmentStart);
  const stunden = Number(String(arbeit.workHoursPerWeek ?? '').replace(',', '.'));
  const stundenOk = stunden > 0 && !wochenstundenUnplausibel(stunden);
  // Ferien (neue Felder 10.11.2026): Anspruch pro Jahr und im laufenden Jahr bezogen.
  const tageZahl = (v) => { const n = Number(String(v ?? '').replace(',', '.').trim()); return String(v ?? '').trim() !== '' && Number.isFinite(n) && n >= 0 ? n : null; };
  const ferienJahr = tageZahl(arbeit.ferienTageJahr);
  const ferienBezogen = tageZahl(arbeit.ferienTageBezogen);
  const ferienOffen = ferienJahr > 0 && ferienBezogen != null ? Math.max(0, ferienJahr - ferienBezogen) : null;

  // Basis (10.11.2026, Stebler Studios «alle drei»): Ausweis aus dem Lebensordner (Dokument type 'id' mit Ablaufdatum),
  // Referenzalter aus dem Geburtsdatum (referenzalterMonate, AHV 21), Grundordnung wie die Fortschritts-Karte (grundordnung).
  const ausweise = (Array.isArray(dokumente) ? dokumente : []).filter((d) => d && d.type === 'id' && /^\d{4}-\d{2}-\d{2}/.test(String(d.expiryDate || '')));
  const ausweis = ausweise.map((d) => String(d.expiryDate).slice(0, 10)).sort()[0] || null;
  const ausweisAb = ausweis ? fristAbstand(ausweis) : null;
  const referenz = bisReferenzalter(data?.basis);
  const refAlter = referenz ? (referenz.referenzMonate % 12
    ? t('instrumente.referenzAlterMonate', { jahre: Math.floor(referenz.referenzMonate / 12), monate: referenz.referenzMonate % 12 })
    : String(referenz.referenzMonate / 12)) : '';

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
      key: 'lohn', name: t('instrumente.lohn'),
      ...(lohn.vergleichbar ? {
        zahl: { wert: lohnLageWert(ls), einheit: '' },
        satz: t('instrumente.lohnSatz', { jahr: LOHN_REFERENZ.jahr }),
        mehr: lohnHinweise,
      } : {}),
      sub: lohn.sperre ? t('instrumente.lohnKeinVergleich') : setup,
      glyph: lohn.vergleichbar ? h(LohnKlein, { palette, state: ls, fillColor: bereichFillColor('arbeit', palette.bg === DARK_PALETTE.bg) || palette.sand }) : null,
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('ausbildung')),
    },
    {
      key: 'dienst', name: t('instrumente.dienst'),
      ...(dienst ? {
        zahl: dienst.jahre >= 1
          ? { wert: String(dienst.jahre), einheit: t(dienst.jahre === 1 ? 'instrumente.jahrEins' : 'instrumente.jahre') }
          : { wert: String(dienst.monate), einheit: t('instrumente.' + (dienst.monate === 1 ? 'monateEins' : 'monate')) },
        satz: arbeit.employer ? t('instrumente.dienstSatzBei', { employer: String(arbeit.employer) }) : t('instrumente.dienstSatz'),
        // Fachprüfung 10.11.2026: Lehrvertrag hat eigene Regeln (OR 344a, 346); eine vertraglich längere Probezeit
        // (bis 3 Monate, OR 335b Abs. 2) braucht in Monat 2 und 3 einen Hinweis.
        mehr: istLernend(data?.finanzen) ? [t('instrumente.dienstLehre')]
          : dienst.inProbezeit ? [t('instrumente.dienstProbezeit')]
          : [t(dienst.kuendigungsfristMonate === 1 ? 'instrumente.dienstFristEins' : 'instrumente.dienstFrist', { n: dienst.kuendigungsfristMonate }),
            ...(dienst.monate < 3 ? [t('instrumente.dienstProbezeitLaenger')] : [])],
      } : {}),
      sub: setup,
      glyph: dienst ? miniJahresringe(palette, dienst.jahre) : null,
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('ausbildung')),
    },
    {
      key: 'pensum', name: t('instrumente.pensum'),
      ...(stundenOk ? {
        zahl: { wert: zahl(stunden, { hoechstens: 1 }), einheit: t('instrumente.stunden') },
        satz: t('instrumente.pensumSatz'),
        // Fachprüfung 10.11.2026: 40 Std. ist die Rechenbasis des Lohnvergleichs (BFS), nicht «die» Vollzeit — ab 100 % «Vollzeit».
        mehr: [stunden >= LSE_VOLLZEIT_STUNDEN_WOCHE
          ? t('instrumente.pensumVollzeit', { basis: LSE_VOLLZEIT_STUNDEN_WOCHE })
          : t('instrumente.pensumAnteil', { pct: Math.round(stunden / LSE_VOLLZEIT_STUNDEN_WOCHE * 100), basis: LSE_VOLLZEIT_STUNDEN_WOCHE })],
      } : {}),
      sub: setup,
      glyph: stundenOk ? miniPensum(palette, stunden / LSE_VOLLZEIT_STUNDEN_WOCHE) : null,
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('ausbildung')),
    },
    {
      key: 'ferien', name: t('instrumente.ferien'),
      ...(ferienJahr > 0 ? {
        zahl: ferienOffen != null
          ? { wert: zahl(ferienOffen, { hoechstens: 1 }), einheit: t(ferienOffen === 1 ? 'instrumente.tageEins' : 'instrumente.tage') }
          : { wert: zahl(ferienJahr, { hoechstens: 1 }), einheit: t('instrumente.tage') },
        satz: t(ferienOffen != null ? 'instrumente.ferienOffenSatz' : 'instrumente.ferienJahrSatz'),
        mehr: [t('instrumente.ferienMinimum')],
      } : {}),
      sub: setup,
      glyph: ferienJahr > 0 ? miniFerien(palette, ferienOffen != null ? ferienOffen / ferienJahr : 1) : null,
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('ausbildung')),
    },
    {
      key: 'ausweis', name: t('instrumente.ausweis'),
      ...(ausweisAb ? {
        zahl: ausweisAb.tage === 0 ? { wert: t('behördenStatus.today'), einheit: '' }
          : { wert: String(ausweisAb.n), einheit: t('instrumente.' + ausweisAb.einheit + (ausweisAb.n === 1 ? 'Eins' : '')) },
        satz: t(ausweisAb.vorbei ? 'instrumente.ausweisAbgelaufenSatz' : 'instrumente.ausweisSatz'),
      } : {}),
      sub: setup,
      glyph: ausweisAb ? h(Kalenderblatt, { iso: ausweis, palette, locale: blattLocale, vorbei: ausweisAb.vorbei }) : null,
      onClick: () => onNavigate('tresor'),
    },
    {
      key: 'referenz', name: t('instrumente.referenz'),
      ...(referenz && !referenz.erreicht ? {
        zahl: referenz.jahre >= 1
          ? { wert: String(referenz.jahre), einheit: t(referenz.jahre === 1 ? 'instrumente.jahrEins' : 'instrumente.jahre') }
          : { wert: String(referenz.restMonate), einheit: t('instrumente.' + (referenz.restMonate === 1 ? 'monateEins' : 'monate')) },
        satz: t('instrumente.referenzSatz', { alter: refAlter }),
        mehr: data?.basis?.gender ? [] : [t('instrumente.referenzOhneGeschlecht')],
      } : {}),
      sub: referenz?.erreicht ? t('instrumente.referenzErreicht') : setup,
      glyph: referenz && !referenz.erreicht ? miniLebensweg(palette, 1 - referenz.monate / referenz.referenzMonate) : null,
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('basis')),
    },
    {
      key: 'grundordnung', name: t('instrumente.grundordnung'),
      ...(grundordnungStand && grundordnungStand.total > 0 ? {
        zahl: { wert: grundordnungStand.filled + '/' + grundordnungStand.total, einheit: '' },
        satz: t('instrumente.grundordnungSatz'),
      } : {}),
      sub: setup,
      glyph: grundordnungStand && grundordnungStand.total > 0 ? miniGrundmauer(palette, grundordnungStand.filled, grundordnungStand.total) : null,
      onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('basis')),
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
      glyph: wohnR.kosten > 0 ? h(DrittelHaus, { palette, anteil: wohnR.anteil, ueberDrittel: wohnR.ueberDrittel, mitPartner: wohnR.mitPartner, fuell: wohnFarbe, groesse: 'klein' }) : null,
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
      glyph: mietVergleich ? h(HaeuserzeileKlein, { palette, comparison: mietVergleich, userValue: wohnR.netto, fillColor: wohnFarbe, drittel: wohnR }) : null,
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
