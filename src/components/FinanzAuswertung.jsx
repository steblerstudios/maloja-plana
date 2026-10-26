import React from 'react';
import { Icon, hinweisZeichen, erledigtZeichen } from '../IconSystem.jsx';
import { calculateSozialhilfe, calculateIPV, checkELEligibility, getCantonName, getHouseholdInfo } from '../config/cantonalData.js';
import { ipvAbzug, IPV_ABZUG_GRUND } from '../data/ipvAbzug.js';
import { steuernFuerProfil, steuerEingabenAusDaten, KANTONAL_DATA_VERSION } from '../data/kantonaleSteuerdaten.js';
import { KantonssteuerOrientierung, bundOhneZahlText, ERKLAERT_IN_ORIENTIERUNG } from './KantonssteuerOrientierung.jsx';
import { annahmenTexte } from '../utils/steuerTexte.js';
import { text, weight, radius, leading, space } from '../config/tokens.js';
import { openPrintWindow, escapeHtml } from '../utils/helpers.js';
import { ExportVorschau } from './ExportVorschau.jsx';
import { BRANCHENLOHN, getBranchenvergleich } from '../data/branchenLohn.js';
import { berechneArmutsgrenze } from '../data/sozialhilfeRechner.js';
import { nettoZuBruttoRichtwert, AHV_FREIBETRAG_RENTNER_MONAT } from '../data/ahvRechner.js';
import { LohnEinordnung } from './LohnEinordnung.jsx';
import { lohnBandState } from '../data/lohnEinordnung.js';
import { alterUndRentenalter } from '../utils/nettoAusProfil.js';
import { KKLastCard } from '../KKLastCard.jsx';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { einnahmenZeilen } from '../data/haushaltsEinnahmen.js';
import { renderSource } from '../utils/renderSource.js';
import { steuerkantonVorbelegung } from '../utils/steuerkanton.js';
import { GlossarText } from '../GlossarBegriff.jsx';
import { betrag } from '../utils/geld.js';
import { ReserveTank } from './ReserveTank.jsx';
import { Lebensbaum } from '../Lebensbaum.jsx';
import { astFarben, bereichsFruechte } from '../utils/lebensbereichFruechte.js';
import { GeldflussImKapitel } from './Geldfluss.jsx';
import { KuchenImKapitel } from './Kuchen.jsx';

// Die Auswertung der Finanzen — bis 24.10.2026 nur in FinanzUebersicht.jsx, seit der
// Zusammenlegung mit dem Kapitel Finanzen (docs/entscheide/finanzen-fusion.md, Bauschritt 2)
// eigene Bausteine, die Übersicht und Kapitel teilen: eine Rechnung (finanzWerte), ein Druck
// (druckAbschnitte), dieselben Karten.
//
// Bausteine ohne eigenen Zustand sind Funktionen, die Elemente liefern (auswertungsKarten,
// auswertungsHinweis) — Tests, die den Element-Baum ohne React-Renderer abgehen (K33), sehen so
// weiter jede Karte. Bausteine mit Zustand sind Komponenten (LohnStandort, UebersichtDrucken).
// KEIN useT() hier: mehrere Tests rendern die Übersicht bewusst ohne I18nProvider.

// IPV-Annahmen hinter einem geschätzten Betrag (cantonalData.js calculateIPV), in fester Reihenfolge.
const ipvAnnahmenTexte = (t, a) => [
  a?.ohneDreizehnten && t('ipv.annahmeOhneDreizehnten'),
  a?.partnerOhneDreizehnten && t('ipv.annahmePartnerOhneDreizehnten'),
].filter(Boolean);

export function formatCHF(value) {
  const n = Math.round(value);
  if (n === 0) return 'CHF 0';
  return betrag(n); // utils/geld.js — eine Quelle
}

export const StatusCard = ({ palette, icon, title, status, statusColor, detail, onClick }) =>
  React.createElement('div', {
    onClick,
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined,
    onKeyDown: onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined,
    style: {
      padding: '16px', background: palette.up, borderRadius: radius.sm,
      border: '1px solid ' + palette.border, marginBottom: space.sm,
      cursor: onClick ? 'pointer' : 'default',
    }
  },
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: '6px' }
    },
      React.createElement(Icon, { name: icon, size: 16 }),
      React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi } }, title),
    ),
    React.createElement('div', {
      style: { fontSize: text.body, fontWeight: weight.semi, color: statusColor || palette.text, marginBottom: detail ? '4px' : 0 }
    }, status),
    detail && React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal }
    }, detail)
  );

// Alle Werte der Auswertung aus einem Profil — eine Rechnung für Karten, Druck und Export-Vorschau.
export const finanzWerte = (data, t) => {
  const income = Number(data.finanzen?.monthlyIncome || 0);
  const canton = data.basis?.canton || '';
  // K33/E23: Für die Steuerschätzung zählt der Steuerkanton — kann vom Wohnkanton
  // abweichen (z. B. Wochenaufenthalt). Dasselbe Vorbelegungsmuster wie im
  // Steuerrechner (TaxCalculator.jsx, PR #165: behoerden.cantoneOfTaxation → alter
  // Schlüssel canton → basis.canton). Überall sonst in dieser Auswertung bleibt
  // `canton` der Wohnkanton (Lohn-Barometer, Miete, IPV, gedruckte „Kanton"-Zeile).
  const steuerkanton = steuerkantonVorbelegung(data);
  const hh = getHouseholdInfo(data);

  const sozialhilfe = calculateSozialhilfe(data);
  const ipv = calculateIPV(data);
  // Luzern nach der Anmeldefrist (SRL 866 § 12 Abs. 3): die Kachel zeigt den Anspruch weiter, sagt
  // aber dazu, dass er nicht mehr ganz ankommt. Die Regel steht in data/ipvAbzug.js.
  // Eine gültige Verfügung (Jahr + Kanton) zeigt die Kachel mit ihrem Betrag, «laut Verfügung» —
  // denselben, den Budget, KK-Last-Karte und Prämien-Beleg abziehen.
  const ipvAbzugWert = ipvAbzug(data, ipv);
  const ipvFristVorbei = ipvAbzugWert.grund === IPV_ABZUG_GRUND.FRIST_VORBEI;
  const ipvVerfuegung = ipvAbzugWert.grund === IPV_ABZUG_GRUND.BESTAETIGT ? ipvAbzugWert.betrag : null;
  // Altbestand ohne Kanton/Jahr (data/ipvAbzug.js): die Kachel zeigt den Betrag, der abgezogen
  // wird — höchstens die Verfügung —, nicht die ungedeckelte Schätzung.
  const ipvOhneJahr = ipvAbzugWert.grund === IPV_ABZUG_GRUND.VERFUEGUNG_UNZUGEORDNET ? ipvAbzugWert.betrag : null;
  const el = checkELEligibility(data);
  // E38/E39: dieselbe Regel wie im Steuerrechner — ein steuerbares Einkommen (Standardabzüge der
  // ESTV) für Bund und Kanton; Kantonszahl nur, wo die ESTV-Tabelle trägt.
  // K33: gerechnet wird im Steuerkanton (nicht zwingend der Wohnkanton).
  const steuern = income > 0 ? steuernFuerProfil(steuerEingabenAusDaten(data)) : null;
  const taxResult = steuern ? steuern.bund : null;
  // Lohn erfasst, aber keine Bundessteuer-Schätzung (Bruttolohn, Ehe mit zwei Einkommen …).
  const steuerOhneZahl = steuern && !taxResult ? steuern.grund : null;
  const kantonsSchaetzung = steuern ? steuern.kanton : null;
  const kantonal = kantonsSchaetzung ? kantonsSchaetzung.kantonal : null;
  // R4: Annahmen hinter der Zahl (13. Monatslohn offen, Alleinverdiener-Ehepaar).
  const annahmen = steuern ? steuern.annahmen : null;
  const annahmenSatz = taxResult ? annahmenTexte(t, annahmen).join(' ') : '';
  // Die Budget-Bilanz zieht die EIGENE Angabe ab (`finanzen.monthlyTax`), die Karte
  // schätzt — die Karte nennt darum beide (Entscheid 28.09.2026, Variante A). Den Monatswert
  // der Schätzung nur mit Kantonszahl: eine reine Bundessteuer neben der vollen eigenen
  // Steuer läse sich wie eine Abweichung, die keine ist.
  const eigeneSteuer = Number(data.finanzen?.monthlyTax || 0);
  const steuerAngabeSatz = eigeneSteuer <= 0 ? ''
    : kantonal
      ? t('finanzUebersicht.taxMonthlyCompare', { estimate: formatCHF(Math.round(kantonal.total / 12)), angabe: formatCHF(eigeneSteuer) })
      : t('finanzUebersicht.taxOwnFigure', { angabe: formatCHF(eigeneSteuer) });

  // Slice B: bezahlte KK-Belege dieses Jahres als Gesundheitskosten spiegeln
  // (Crosslink KVG-Tracker → Finanzen, kein zweites Eingeben). Offene separat.
  const currentYear = new Date().getFullYear();
  const kkBelege = Array.isArray(data.versicherungen?.kkBelege) ? data.versicherungen.kkBelege : [];
  const belegeThisYear = kkBelege.filter(b => !b.datum || String(b.datum).slice(0, 4) === String(currentYear));
  // Reale Gesundheitsausgabe = gedeckter Betrag + nicht-gedeckter Anteil.
  const belegTotal = (b) => (Number(b.betrag) || 0) + (Number(b.nichtGedeckt) || 0);
  const gesundheitskosten = belegeThisYear.filter(b => b.status !== 'offen').reduce((s, b) => s + belegTotal(b), 0);
  // Als Forderung übernommene Belege (forderungId) stehen im Schuldenmanager — hier nicht ein zweites Mal.
  const gesundheitskostenOffen = belegeThisYear.filter(b => b.status === 'offen' && !b.forderungId).reduce((s, b) => s + belegTotal(b), 0);

  // Vermögen (Wertschriften + übriges Vermögen + Ersparnisse) — Steuerwert, ohne gebundenes 3a
  const savingsAccount = Number(data.finanzen?.savingsAccount || 0);
  const totalAssets = Number(data.finanzen?.securitiesValue || 0) + Number(data.finanzen?.otherAssets || 0) + savingsAccount;

  // Monatsbudget: dieselben Zahlen wie die Budget-Seite (budgetSync.js) — Einnahmen des ganzen
  // Haushalts, Ausgaben inkl. Hypothek, Gebäudeversicherung und 3a. Bis 28.09.2026 rechnete die
  // Übersicht selbst: nur der eigene Lohn, und ohne diese drei Ausgaben (data/haushaltskosten.js).
  const budget = calculateMonthlyBudget(data, t);

  return {
    income, canton, steuerkanton, hh, hasData: income > 0,
    sozialhilfe, ipv, ipvAbzug: ipvAbzugWert, ipvFristVorbei, ipvVerfuegung, ipvOhneJahr, el,
    taxResult, steuerOhneZahl, kantonsSchaetzung, kantonal, annahmen, annahmenSatz, steuerAngabeSatz,
    currentYear, gesundheitskosten, gesundheitskostenOffen, hasGesundheitskosten: (gesundheitskosten + gesundheitskostenOffen) > 0,
    savingsAccount, totalAssets, hasAssets: totalAssets > 0,
    totalExpenses: budget.totalExpenses, totalIncome: budget.income, freeAmount: budget.remaining,
    hasExpenses: budget.totalExpenses > 0,
    // Ein Lohn ist brutto erfasst → kein «frei verfügbar», sondern die Frage nach dem Netto.
    bruttoDabei: budget.bruttoDabei,
    einnahmen: einnahmenZeilen(budget.einnahmen),
  };
};

// Die gedruckte Übersicht als Abschnitte: je Zeile der Feldname UND das Druck-HTML.
// Eine Quelle für den Druck und die Export-Vorschau (K20) — die Vorschau nennt genau
// diese Feldnamen, nie die Beträge. Wird eine Zeile nicht gedruckt, fehlt sie auch dort.
export const druckAbschnitte = (t, w) => {
  const fmt = (v) => formatCHF(v);
  const abschnitte = [];
  const zeilen = [];

  zeilen.push({ label: t('finanzUebersicht.monthlyIncome'), html: '<tr><td>' + t('finanzUebersicht.monthlyIncome') + '</td><td class="r">' + fmt(w.income) + ' ' + t('common.perMonth') + '</td></tr>' });
  if (w.canton) zeilen.push({ label: t('finanzUebersicht.canton'), html: '<tr><td>' + t('finanzUebersicht.canton') + '</td><td class="r">' + escapeHtml(getCantonName(w.canton, t)) + '</td></tr>' });

  if (w.kantonal) {
    zeilen.push({ label: t('finanzUebersicht.taxes'), html: '<tr class="sep"><td>' + t('finanzUebersicht.taxes') + ' (' + t('tax.roughEstimateBadge') + ')</td><td class="r">~ ' + fmt(w.kantonal.total) + ' ' + t('common.perYear') + '</td></tr>'
      + '<tr><td colspan="2" style="font-size:12px;color:#888">' + escapeHtml(t('tax.basedOnHauptort', { year: KANTONAL_DATA_VERSION })) + '</td></tr>' });
  } else if (w.taxResult) {
    zeilen.push({ label: t('finanzUebersicht.taxes'), html: '<tr class="sep"><td>' + t('finanzUebersicht.taxes') + ' (' + t('tax.federalOnly') + ')</td><td class="r">~ ' + fmt(w.taxResult.steuer) + ' ' + t('common.perYear') + '</td></tr>' });
  } else if (w.steuerOhneZahl) {
    zeilen.push({ label: t('finanzUebersicht.taxes'), html: '<tr class="sep"><td>' + t('finanzUebersicht.taxes') + '</td><td class="r">' + escapeHtml(t('tax.noTaxFigure')) + '</td></tr>' });
  }
  // R4: die Annahmen hinter der Zahl (13. Monatslohn offen, Alleinverdiener-Ehepaar).
  const annahmen = (w.kantonal || w.taxResult) ? annahmenTexte(t, w.annahmen) : [];
  if (annahmen.length) {
    zeilen.push({ label: t('tax.annahmenLabel'), html: '<tr><td colspan="2" style="font-size:12px;color:#6B6560">' + annahmen.map(escapeHtml).join('<br>') + '</td></tr>' });
  }

  // Eine gültige Verfügung (data/ipvAbzug.js) steht vor der Schätzung — wie in Budget, KK-Last-Karte
  // und Prämien-Beleg, die ihren Betrag abziehen.
  // Altbestand ohne Kanton/Jahr: der Betrag, der abgezogen wird (höchstens die Verfügung).
  const ipvVerfuegt = w.ipvAbzug && w.ipvAbzug.grund === IPV_ABZUG_GRUND.BESTAETIGT;
  const ipvOhneJahr = w.ipvAbzug && w.ipvAbzug.grund === IPV_ABZUG_GRUND.VERFUEGUNG_UNZUGEORDNET;
  const ipvBetragText = ipvVerfuegt || ipvOhneJahr
    ? fmt(w.ipvAbzug.betrag) + ' ' + t('common.perMonth') + ' (' + t(ipvVerfuegt ? 'finanzUebersicht.ipvLautVerfuegung' : 'finanzUebersicht.ipvVerfuegungOhneJahr') + ')'
    : w.ipv.eligible ? fmt(w.ipv.amount) + ' ' + t('common.perMonth') : null;
  zeilen.push({ label: t('finanzUebersicht.ipv'), html: '<tr><td>' + t('finanzUebersicht.ipv') + '</td><td class="r">' + (ipvBetragText ? '✓ ' + ipvBetragText : w.ipv.belegt === false ? t('ipv.statusOffen') : t('finanzUebersicht.notEligible')) + '</td></tr>' });
  // Geschätzter Betrag bei offener Frage nach dem 13. Monatslohn: die Annahme gehört dazu (wie bei der Steuer).
  const ipvAnnahmen = !ipvVerfuegt && !ipvOhneJahr && w.ipv.eligible ? ipvAnnahmenTexte(t, w.ipv.annahmen) : [];
  if (ipvAnnahmen.length) {
    zeilen.push({ label: t('tax.annahmenLabel'), html: '<tr><td colspan="2" style="font-size:12px;color:#6B6560">' + ipvAnnahmen.map(escapeHtml).join('<br>') + '</td></tr>' });
  }
  zeilen.push({ label: t('finanzUebersicht.sozialhilfe'), html: '<tr><td>' + t('finanzUebersicht.sozialhilfe') + '</td><td class="r">' + (w.sozialhilfe.eligible ? fmt(w.sozialhilfe.deficit) + ' ' + t('common.perMonth') + (w.sozialhilfe.effectiveRent > 0 ? ' (' + t('sozialhilfe.mitGanzerMiete') + ')' : '') : w.sozialhilfe.efbEntscheidet ? t('dashboard.anspruchMoeglich') : t('sozialhilfe.notEntitled')) + '</td></tr>' });
  zeilen.push({ label: t('finanzUebersicht.el'), html: '<tr><td>' + t('finanzUebersicht.el') + '</td><td class="r">' + (w.el.eligible ? fmt(w.el.deficit) + ' ' + t('common.perMonth') : t('finanzUebersicht.notApplicable')) + '</td></tr>' });

  if (w.hasAssets) {
    zeilen.push({ label: t('finanzUebersicht.assets'), html: '<tr class="sep"><td>' + t('finanzUebersicht.assets') + '</td><td class="r">' + fmt(w.totalAssets) + '</td></tr>' });
  }

  if (w.gesundheitskosten > 0) {
    zeilen.push({ label: t('finanzUebersicht.healthCosts'), html: '<tr><td>' + t('finanzUebersicht.healthCosts') + '</td><td class="r">' + fmt(w.gesundheitskosten) + ' ' + t('common.perYear') + '</td></tr>' });
  }

  abschnitte.push({ titel: t('finanzUebersicht.title'), zeilen });

  if (w.hasExpenses) {
    abschnitte.push({
      titel: t('finanzUebersicht.budgetBalance'),
      kopfHtml: '<tr class="sep"><td colspan="2" style="font-weight:600;padding-top:12px">' + t('finanzUebersicht.budgetBalance') + '</td></tr>',
      zeilen: [
        { label: t('finanzUebersicht.totalIncome'), html: '<tr><td>' + t('finanzUebersicht.totalIncome') + '</td><td class="r">' + fmt(w.totalIncome) + '</td></tr>' },
        { label: t('finanzUebersicht.totalExpenses'), html: '<tr><td>' + t('finanzUebersicht.totalExpenses') + '</td><td class="r">− ' + fmt(w.totalExpenses) + '</td></tr>' },
        w.bruttoDabei
          ? { label: t('finanzUebersicht.freeAmount'), html: '<tr class="total"><td colspan="2" style="font-weight:400;font-size:12px;color:#6B6560">' + escapeHtml(t('budgetSync.availableNeedsNetto')) + '</td></tr>' }
          : { label: t('finanzUebersicht.freeAmount'), html: '<tr class="total"><td>' + t('finanzUebersicht.freeAmount') + '</td><td class="r ' + (w.freeAmount >= 0 ? 'pos' : 'neg') + '">' + fmt(w.freeAmount) + '</td></tr>' },
      ],
    });
  }

  return abschnitte;
};

const generatePrintHTML = (t, data, w) => {
  const name = [data.basis?.firstName, data.basis?.lastName].filter(Boolean).join(' ') || '';
  const date = new Date().toLocaleDateString('de-CH');
  const rows = druckAbschnitte(t, w).flatMap(a => [...(a.kopfHtml ? [a.kopfHtml] : []), ...a.zeilen.map(z => z.html)]);

  return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + t('finanzUebersicht.title') + '</title><style>'
    + 'body{font-family:system-ui,sans-serif;max-width:600px;margin:40px auto;color:#333;padding:0 20px}'
    + 'h1{font-size:20px;margin-bottom:4px}'
    + '.sub{color:#888;font-size:13px;margin-bottom:24px}'
    + 'table{width:100%;border-collapse:collapse}'
    + 'td{padding:7px 0;border-bottom:1px solid #eee;font-size:14px}'
    + '.r{text-align:right;font-weight:500}'
    + '.sep td{border-top:2px solid #ddd}'
    + '.total td{border-top:2px solid #333;font-weight:600}'
    + '.pos{color:#5a7a5a}.neg{color:#a85454}'
    + '.footer{margin-top:32px;font-size:11px;color:#aaa;border-top:1px solid #eee;padding-top:12px}'
    + '@media print{body{margin:20px}}'
    + '</style></head><body>'
    + '<h1>' + t('finanzUebersicht.title') + (name ? ' — ' + escapeHtml(name) : '') + '</h1>'
    + '<div class="sub">' + t('finanzUebersicht.subtitle') + ' · ' + date + '</div>'
    + '<table>' + rows.join('') + '</table>'
    + '<div class="footer">ⓘ ' + t('finanzUebersicht.disclaimer') + '<br>Maloja Plana · malojaplana.ch</div>'
    + '</body></html>';
};

// Wo steht der Lohn: Armutsgrenzen-Befund, Lohn-Barometer, Branchen-Chips. Nur mit erfasstem Lohn.
// `aktuellesKapitel` (im Kapitel Finanzen): der «fehlt noch …»-Hinweis des Barometers springt
// nicht ins eigene Kapitel — die Einkommensart liegt dort (LohnEinordnung).
export const LohnStandort = ({ palette, t, data, isDarkMode, onNavigate, w, aktuellesKapitel }) => {
  // Angetippte Branche → ihr Median als neutrale Marke auf dem Lohn-Barometer. `null` = keine.
  const [selBranche, setSelBranche] = React.useState(null);
  const { income, sozialhilfe, hh, totalIncome, bruttoDabei } = w;
  if (!(income > 0)) return null;
  // Das Lohn-Barometer trägt die Lohnniveau-Einordnung — belegt (LSE 2024:
  // p10/Median/p90), auf Vollzeit-Äquivalent gerechnet, mit dem kantonalen
  // Mindestlohn-Boden als „!". Es braucht ein BRUTTO-Einkommen.
  //
  // Daneben (nicht doppelt) steht der belegte Armutsgrenzen-Befund für die ANDERE
  // Frage: «bin ich unter dem Existenzminimum?». Das frühere rohe Text-Band
  // (2279/4000 auf ROH-Einkommen) war unbelegt UND mass die falsche Grösse; hier
  // stattdessen die BFS-Methodik — verfügbares NETTO-Einkommen (netto − Steuern,
  // Prämien, Abzüge) gegen die haushaltsgenaue Armutsgrenze (SKOS-Grundbedarf +
  // effektive Wohnkosten + CHF 100/Person ab 16). Erscheint nur bei tragfähiger
  // Basis (Netto erfasst + Miete bekannt); fehlende Abzüge überschätzen das
  // Einkommen (sichere Richtung, kein Fehlalarm). Brutto-Nutzerinnen sehen das
  // Barometer, Netto-Nutzerinnen diesen Befund — sie schliessen einander praktisch
  // aus (ein incomeType), darum kein Gedränge.
  const f = data.finanzen || {};
  const rentKnown = Number(data.wohnen?.rentAmount || 0) > 0;
  // Eine Regel mit Barometer und Netto-Richtwert: im Rentenalter ohne ALV/PK (alterUndRentenalter).
  const { alter, rentenalter, beitragsfrei } = alterUndRentenalter(data.basis);
  const personenAb16 = hh.adults + (hh.children || []).filter(c => (Number(c.age) || 0) >= 16).length;
  const armutsgrenze = berechneArmutsgrenze({
    grundbedarf: sozialhilfe.grundbedarf,
    effektiveWohnkosten: sozialhilfe.effectiveRent,
    personenAb16,
  });
  // Einnahmen des Haushalts = dieselbe Summe wie das Monatsbudget (budgetSync.js →
  // data/haushaltsEinnahmen.js). Bis 28.09.2026 rechnete der Befund eine eigene Summe und
  // verstummte bei jedem Nebenerwerb ohne Angabe der Art; jetzt sperrt nur ein ausdrückliches
  // «brutto» (bruttoDabei), wie im Budget — ohne Art zählt der Betrag, was das Einkommen eher
  // über- als unterschätzt (sichere Richtung, kein Fehlalarm).
  const verfuegbar = Math.max(0, totalIncome - Number(f.monthlyTax || 0)
    - Number(data.versicherungen?.kkPremium || 0) - Number(f.alimentePaid || 0));
  const unterArmutsgrenze = f.incomeType === 'netto' && !bruttoDabei && rentKnown
    && armutsgrenze > 0 && verfuegbar < armutsgrenze;
  return React.createElement('div', {
    style: { padding: '12px 16px', background: palette.up, borderRadius: radius.sm, marginBottom: '16px', fontSize: text.xs, color: palette.mid, lineHeight: '1.6' }
  },
    // Belegter Armutsgrenzen-Befund (nur Netto + unter der Grenze) — VOR dem
    // Barometer, weil er für Netto-Nutzerinnen das primäre Signal ist.
    unterArmutsgrenze && React.createElement('div', {
      style: { marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid ' + palette.border }
    },
      React.createElement('div', { style: { fontWeight: weight.medium, color: palette.goldDeep || '#c47a20', marginBottom: '2px' } },
        t('finanzUebersicht.belowPoverty')),
      React.createElement('div', { style: { fontSize: '10px', color: palette.soft, lineHeight: '1.5' } },
        // Link führt zur BFS-Methodik (Erhebung Armutsstatistik), nicht zu einer
        // publizierten Zahl — der Betrag hier ist haushaltsindividuell gerechnet.
        renderSource(t('finanzUebersicht.povertyLineNote', { amount: formatCHF(Math.round(armutsgrenze)) }), null, t)),
      // Phase 1: grober Brutto-Anhaltspunkt (nur AHV/ALV) — hilft, das Netto
      // einzuordnen und zum Lohn-Barometer (das Brutto braucht) zu überbrücken.
      // Vor der Beitragspflicht (AHVG Art. 3 Abs. 2 lit. a) keine AHV/ALV/PK-Abzüge — dann kein Brutto-Hinweis.
      !beitragsfrei && React.createElement('div', { style: { fontSize: '10px', color: palette.soft, lineHeight: '1.5', marginTop: '3px' } },
        // Im Rentenalter eine eigene Begründung: dort rechnet der Richtwert ohne ALV/PK (lohnAbzuege.js).
        t(rentenalter ? 'finanzUebersicht.povertyBruttoHintRente' : 'finanzUebersicht.povertyBruttoHint', {
          brutto: formatCHF(nettoZuBruttoRichtwert(income, alter, rentenalter)),
          freibetrag: formatCHF(AHV_FREIBETRAG_RENTNER_MONAT),
        }))
    ),
    React.createElement(LohnEinordnung, { palette, t, data, isDarkMode, embedded: true, branchMark: selBranche, onNavigate, aktuellesKapitel }),
    (() => {
      const vgl = getBranchenvergleich(income);
      if (!vgl) return null;
      // Chips gegen DENSELBEN Wert färben wie das Barometer (Vollzeit-/13.-normiert),
      // sonst widersprechen sich grüner Chip und Marker-Position (roh 5200 vs. FTE 4952).
      const vergleichsLohn = lohnBandState({
        income: data.finanzen?.monthlyIncome, canton: data.basis?.canton,
        hoursPerWeek: data.ausbildung?.workHoursPerWeek,
        incomeType: data.finanzen?.incomeType, dreizehnter: data.finanzen?.dreizehnter,
        // Wie das Barometer (LohnEinordnung): sonst färbten die Chips gegen ein Brutto ohne PK-Anteil.
        alter, rentenalter, beitragsfrei,
      }).incomeVergleich || income;
      return React.createElement('div', { style: { marginTop: '10px', paddingTop: '8px', borderTop: '1px solid ' + palette.border } },
        React.createElement('div', { style: { fontSize: text.xs, marginBottom: '6px' } },
          t('finanzUebersicht.branchenvergleich')
        ),
        React.createElement('div', {
          style: { display: 'flex', flexWrap: 'wrap', gap: '4px' }
        },
          BRANCHENLOHN.filter(b => b.key !== 'gesamt').sort((a, b) => a.lohn - b.lohn).map(b => {
            const sel = selBranche && selBranche.key === b.key;
            const reached = vergleichsLohn >= b.lohn;
            const toggle = () => setSelBranche(sel ? null : b);
            return React.createElement('span', {
              key: b.key,
              onClick: toggle,
              role: 'button',
              tabIndex: 0,
              'aria-pressed': sel,
              onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } },
              style: {
                // padding vertikal 6px: 10px-Text (~12px Zeile) + 12px → ~24px hoch,
                // damit das Tipp-Ziel WCAG 2.5.8 (24×24) trifft, nicht nur ~16px.
                fontSize: '10px', padding: '6px 8px', borderRadius: radius.hair,
                cursor: 'pointer',
                // Inaktiver Chip: Alpha '40' statt '60' — der weniger aufgehellte
                // Hintergrund hebt `mid` auch im Dunkelmodus sicher über AA (bei '60'
                // lag es dort mit 4.49:1 knapp darunter). Ausgewählt: gold gerahmt.
                background: sel ? (palette.gold + '55') : reached ? (palette.sage + '30') : (palette.border + '40'),
                color: (sel || reached) ? palette.text : palette.mid,
                border: '1px solid ' + (sel ? palette.goldDeep : 'transparent'),
                whiteSpace: 'nowrap',
              }
            }, t('branche.' + b.key) + ' ’' + String(b.jahr).slice(2));
          })
        ),
        React.createElement('div', { style: { fontSize: '10px', color: palette.soft, marginTop: '6px' } },
          t('finanzUebersicht.branchenQuelle')
        )
      );
    })()
  );
};

// Was daraus folgt: je Karte eine Funktion (siehe oben), alle mit ({ palette, t, data, onNavigate, w }).
// Die Übersicht zeigt sie in ihrer Reihenfolge (auswertungsKarten), das Kapitel Finanzen in seiner.
// `imKapitel` (Abnahme F6, Sophie 25.10.2026): im Kapitel Finanzen kürzer — eine Zeile Bund · Kanton und
// Gemeinde mit «grobe Schätzung, Hauptort, ohne Kirchensteuer»; die ganze Herleitung steht auf der Seite
// Steuern, zu der die Karte führt. Und der 13. Monatslohn verweist nicht «ins Kapitel Finanzen & Geld»,
// in dem man schon ist, sondern auf «Einkommen» oben.
export const steuerKarte = ({ palette, t, onNavigate, w, imKapitel }) => {
  if (imKapitel && w.kantonal && w.taxResult) {
    const annahmen = annahmenTexte(t, w.annahmen).map((s) => (s === t('tax.annahmeOhneDreizehnten') ? t('tax.annahmeOhneDreizehntenHier') : s));
    return React.createElement(StatusCard, {
      palette, icon: 'money',
      title: t('finanzUebersicht.taxes'),
      status: '~ ' + formatCHF(w.kantonal.total) + ' ' + t('common.perYear'),
      statusColor: palette.text,
      detail: [w.steuerAngabeSatz, t('tax.kapitelZeile', { bund: formatCHF(w.taxResult.steuer), kanton: formatCHF(w.kantonal.kantonalUndGemeinde) }), ...annahmen].filter(Boolean).join(' '),
      onClick: () => onNavigate('tax'),
    });
  }
  const { kantonal, taxResult, steuerOhneZahl, steuerkanton, annahmenSatz, steuerAngabeSatz } = w;
  return React.createElement(StatusCard, {
    palette, icon: 'money',
    title: t('finanzUebersicht.taxes'),
    status: kantonal
      ? '~ ' + formatCHF(kantonal.total) + ' ' + t('common.perYear')
      : taxResult
        ? '~ ' + formatCHF(taxResult.steuer) + ' ' + t('common.perYear') + ' (' + t('tax.federalOnly') + ')'
        : steuerOhneZahl ? t('tax.noTaxFigure') : t('finanzUebersicht.noIncome'),
    statusColor: palette.text,
    detail: [steuerAngabeSatz, kantonal
      ? t('tax.federalTax') + ': ' + formatCHF(taxResult.steuer) + ' + ' + t('tax.cantonalAndMunicipal') + ' (' + t('tax.roughEstimateBadge') + '): ' + formatCHF(kantonal.kantonalUndGemeinde) + '. ' + t('tax.basedOnHauptort', { year: KANTONAL_DATA_VERSION }) + (annahmenSatz ? ' ' + annahmenSatz : '')
      : steuerOhneZahl ? (steuerkanton && ERKLAERT_IN_ORIENTIERUNG.includes(steuerOhneZahl) ? null : bundOhneZahlText(t, steuerOhneZahl))
        : [!steuerkanton ? t('finanzUebersicht.selectCanton') : '', annahmenSatz].filter(Boolean).join(' ') || null,
    ].filter(Boolean).join(' ') || null,
    onClick: () => onNavigate('tax'),
  });
};

// E38: keine Kantonszahl → ruhige Orientierung mit den amtlichen Wegen (ausserhalb der Karte,
// weil die Karte selbst ein Knopf ist und keine Links enthalten darf).
export const steuerOrientierung = ({ palette, t, w }) =>
  w.steuerkanton && w.kantonsSchaetzung && !w.kantonal && React.createElement(KantonssteuerOrientierung, {
    palette, t, canton: w.steuerkanton, schaetzung: w.kantonsSchaetzung, jahr: KANTONAL_DATA_VERSION, style: { marginTop: '-4px' },
  });

export const ipvKarte = ({ palette, t, onNavigate, w }) => {
  const { ipv, ipvVerfuegung, ipvOhneJahr, ipvFristVorbei } = w;
  return React.createElement(StatusCard, {
    palette, icon: 'insurance',
    title: t('finanzUebersicht.ipv'),
    // E9: ohne amtlich belegten Kanton weder Betrag noch Grenze, nur die Orientierung.
    status: ipvVerfuegung != null || ipvOhneJahr != null
      ? erledigtZeichen(true, formatCHF(ipvVerfuegung != null ? ipvVerfuegung : ipvOhneJahr) + ' ' + t('common.perMonth'))
      : ipv.eligible
      ? erledigtZeichen(true, formatCHF(ipv.amount) + ' ' + t('common.perMonth'))
      : ipv.belegt === false
        ? t('ipv.statusOffen')
        : t('finanzUebersicht.notEligible'),
    statusColor: ipvVerfuegung != null || ipvOhneJahr != null || ipv.eligible ? (palette.sageDeep || palette.sage) : palette.mid,
    // Kein Jahresbetrag aus der Verfügung: sie kann unterjährig beginnen, «× 12» wäre geraten.
    detail: ipvVerfuegung != null
      ? t('finanzUebersicht.ipvLautVerfuegung')
      : ipvOhneJahr != null
      ? t('finanzUebersicht.ipvVerfuegungOhneJahr')
      : ipv.eligible
      ? formatCHF(ipv.annual) + ' ' + t('common.perYear') + (ipvFristVorbei ? '. ' + t(ipv.noteKey, ipv.noteParams) : '')
        + ipvAnnahmenTexte(t, ipv.annahmen).map((x) => '. ' + x).join('')
      : ipv.belegt === false
        ? t(ipv.noteKey, ipv.noteParams)
        // Ohne amtlich publizierte Grenze (AG) darf hier keine behauptet werden — sonst steht
        // in der Kachel «Einkommen über Grenze (CHF )», eine Grenze ohne Zahl. Dann sagt der
        // Kanton selbst, warum es keinen Anspruch gibt (Befund Fachprüfung 20.09.2026).
        : ipv.canton
          ? (ipv.cantonData?.maxIncome != null
            ? t('ipv.incomeAboveLimit', { value: ipv.cantonData.maxIncome })
            : t(ipv.noteKey, ipv.noteParams))
          : t('finanzUebersicht.selectCanton'),
    onClick: () => onNavigate('premium'),
  });
};

export const sozialhilfeKarte = ({ palette, t, onNavigate, w }) => {
  const { sozialhilfe } = w;
  return React.createElement(StatusCard, {
    palette, icon: 'home',
    title: t('finanzUebersicht.sozialhilfe'),
    status: sozialhilfe.eligible
      ? t('sozialhilfe.entitled') + ': ~ ' + formatCHF(sozialhilfe.deficit) + ' ' + t('common.perMonth')
        // Ohne Mietzins-Limite gerechnet (config/cantonalData.js) — bei hoher Miete eher zu hoch.
        + (sozialhilfe.effectiveRent > 0 ? ' (' + t('sozialhilfe.mitGanzerMiete') + ')' : '')
      // Freibetrag-Fall (Predeploy 25.09.2026): offen, nicht «Einkommen reicht aus».
      : sozialhilfe.efbEntscheidet ? t('dashboard.anspruchMoeglich') : t('sozialhilfe.notEntitled'),
    statusColor: sozialhilfe.eligible ? (palette.goldDeep || palette.gold) : (palette.sageDeep || palette.sage),
    detail: t('sozialhilfe.basicNeeds') + ': ' + formatCHF(sozialhilfe.grundbedarf) + ' | ' + t('sozialhilfe.totalNeeds') + ': ' + formatCHF(sozialhilfe.totalBedarf),
    onClick: () => onNavigate('sozialhilfe'),
  });
};

export const elKarte = ({ palette, t, onNavigate, w }) => {
  const { el } = w;
  return React.createElement(StatusCard, {
    palette, icon: 'legal',
    title: t('finanzUebersicht.el'),
    // checkELEligibility (config/cantonalData.js) liefert `elCalc.onlyAhvIv`; bis 28.09.2026
    // verglich die Karte mit `el.onlyAhvIv` und zeigte darum immer «Nicht anwendbar» — ohne
    // den Grund. Und sie war die einzige Karte ohne Weg: die EL-Seite gibt es (main.jsx).
    status: el.eligible
      ? t('sozialhilfe.elPossible')
      : el.noteKey === 'elCalc.onlyAhvIv'
        ? t('sozialhilfe.elOnlyAhvIv')
        : t('finanzUebersicht.notApplicable'),
    statusColor: el.eligible ? (palette.goldDeep || palette.gold) : palette.mid,
    detail: el.eligible ? formatCHF(el.deficit) + ' ' + t('common.perMonth') : null,
    onClick: () => onNavigate('ergaenzungsleistungen'),
  });
};

export const vermoegenKarte = ({ palette, t, onNavigate, w }) =>
  w.hasAssets && React.createElement(StatusCard, {
    palette, icon: 'budget',
    title: t('finanzUebersicht.assets'),
    status: formatCHF(w.totalAssets),
    statusColor: palette.text,
    detail: t('finanzUebersicht.assetsDetail'),
    onClick: () => onNavigate('chapter', 2),
  });

export const gesundheitKarte = ({ palette, t, onNavigate, w }) =>
  w.hasGesundheitskosten && React.createElement(StatusCard, {
    palette, icon: 'health',
    title: t('finanzUebersicht.healthCosts'),
    status: formatCHF(w.gesundheitskosten),
    statusColor: palette.text,
    detail: t('finanzUebersicht.healthCostsDetail', { year: w.currentYear })
      + (w.gesundheitskostenOffen > 0 ? ' · ' + t('finanzUebersicht.healthCostsOpen', { amount: formatCHF(w.gesundheitskostenOffen) }) : ''),
    onClick: () => onNavigate('kvg', undefined, 'franchise'),
  });

// Faden 3 / 3-I: KK-Last als % des Einkommens gegen WHO-10%-Richtwert
export const kkLastKarte = ({ palette, t, data, onNavigate }) => React.createElement(KKLastCard, { palette, t, data, onNavigate });

// Die Karten in der Reihenfolge der Übersicht — ein Fragment.
export const auswertungsKarten = (p) => React.createElement(React.Fragment, null,
  steuerKarte(p), steuerOrientierung(p), ipvKarte(p), sozialhilfeKarte(p), elKarte(p),
  vermoegenKarte(p), gesundheitKarte(p), kkLastKarte(p));

// «Übersicht drucken» mit Export-Vorschau (K20): erst zeigen, was auf dem Ausdruck steht, dann drucken.
export const UebersichtDrucken = ({ palette, t, data, w, style }) => {
  const [druckVorschau, setDruckVorschau] = React.useState(false);
  return React.createElement(React.Fragment, null,
    React.createElement('button', {
      onClick: () => setDruckVorschau(true),
      style: {
        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
        padding: '12px', background: palette.up, border: '1px solid ' + palette.border,
        borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, color: palette.text,
        fontFamily: 'inherit', textAlign: 'left', ...style,
      }
    }, React.createElement(Icon, { name: 'drucker', size: 16 }), t('finanzUebersicht.printAction')),

    // Export-Vorschau (K20) direkt unter dem Knopf, der sie geöffnet hat.
    druckVorschau && React.createElement(ExportVorschau, {
      palette, t, art: 'dossier',
      quelle: {
        // Der Ausdruck trägt den Namen im Titel — darum eigens genannt.
        name: !!(data.basis?.firstName || data.basis?.lastName),
        abschnitte: druckAbschnitte(t, w).map(a => ({ titel: a.titel, felder: a.zeilen.map(z => z.label) })),
      },
      onWeiter: () => { setDruckVorschau(false); openPrintWindow(generatePrintHTML(t, data, w)); },
      onZurueck: () => setDruckVorschau(false),
    })
  );
};

// Der Hinweis zur Schätzung, mit Glossar.
export const auswertungsHinweis = ({ palette, t }) =>
  React.createElement('div', {
    style: { marginTop: space.md, fontSize: text.xs, color: palette.soft, lineHeight: '1.4' }
  }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('finanzUebersicht.disclaimer')));

// ─── Im Kapitel Finanzen (Bauschritt 3, docs/entscheide/finanzen-fusion.md §3) ──────────────
// ChapterView lädt diesen Teil erst bei Bedarf (React.lazy), damit die anderen Kapitel ihn nicht
// mittragen. Zwei Teile, weil «Passend zu diesem Bereich» (ChapterView) dazwischen steht:
//   'oben'  — Lebensbaum (Entscheid 2: nach den Angaben, vor der Rechnung), Lohn, «Was daraus
//             folgt», «Weitere Ansprüche» (Entscheid 3: eingeklappt, offen bei Anspruch)
//   'unten' — Übersicht drucken, Hinweis zur Schätzung
// `data` ist das ganze Profil (allData), nicht nur das Kapitel.
// `onEnterSandbox` (nur oben, nur ausserhalb von Beispiel und laufendem Probiermodus — main.jsx):
// der Knopf «neben dem eigenen Stand rechnen», der bis 24.10.2026 auf der Finanz-Übersicht stand.
export const FinanzenImKapitel = ({ teil, palette, t, data, onNavigate, isDarkMode, chapters = [], onSelectChapter, isMobile, lang = 'de', onEnterSandbox }) => {
  const w = finanzWerte(data, t);
  const p = { palette, t, data, onNavigate, w };
  if (teil === 'unten') {
    if (!w.hasData) return null;
    return React.createElement('div', { 'data-teil': 'auswertung-unten', style: { marginTop: space.xl + 'px' } },
      React.createElement(UebersichtDrucken, { palette, t, data, w }),
      auswertungsHinweis({ palette, t })
    );
  }
  const fruechte = chapters.length ? bereichsFruechte(chapters, data, astFarben(chapters, palette, isDarkMode)) : [];
  // Offen, sobald ein Anspruch möglich ist — dieselben Signale wie die Karten selbst.
  const anspruch = !!(w.sozialhilfe.eligible || w.sozialhilfe.efbEntscheidet || w.el.eligible);
  const titel = { margin: '0 0 ' + space.sm + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };
  return React.createElement('div', { id: 'mp-finanz-auswertung', 'data-teil': 'auswertung', style: { marginTop: space.xl + 'px', scrollMarginTop: 'var(--mp-sprungabstand)' } },
    // Gleiches Aussehen wie der Knopf über den Rechnern (main.jsx, SANDBOX_VIEWS).
    onEnterSandbox && React.createElement('button', {
      type: 'button', 'data-weg': 'probieren', onClick: onEnterSandbox,
      style: {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        margin: '0 0 ' + space.md + 'px 0', padding: '6px 12px', minHeight: '32px',
        background: palette.sage + '12', border: '1px solid ' + palette.sage + '30',
        borderRadius: radius.sm, cursor: 'pointer', fontSize: text.xs, fontWeight: weight.medium,
        // sageDeep statt sage: sage trägt als 13px-Text nur 4.34:1 auf bg (wie main.jsx).
        color: palette.sageDeep, fontFamily: 'inherit',
      },
    }, t('sandbox.footerLink')),
    fruechte.length > 0 && React.createElement('div', { 'data-teil': 'lebensbaum' },
      React.createElement(Lebensbaum, {
        palette, t, data, text, weight, space, radius,
        onNavigate, bereiche: fruechte, onSelectChapter, isMobile, lang, isDarkMode,
      })
    ),
    // Fassung 6 (VERGLEICH.md «nachentschieden», 24.10.2026 abends): nach dem Baum erst der Kuchen
    // («Wofür geht es weg?»), dann der Geldfluss («Woher, wohin?») — dieser nur mit zwei oder mehr
    // Einnahmequellen (GeldflussImKapitel). Beide rechnen wie «Jeden Monat bleiben».
    w.hasData && React.createElement(KuchenImKapitel, { data, t, palette }),
    w.hasData && React.createElement('div', { 'data-teil': 'geldfluss' },
      React.createElement(GeldflussImKapitel, { data, t, palette })
    ),
    w.hasData && React.createElement(LohnStandort, { palette, t, data, isDarkMode, onNavigate, w, aktuellesKapitel: 'finanzen' }),
    w.hasData && React.createElement('section', { 'data-teil': 'folgt', 'aria-labelledby': 'mp-folgt-titel', style: { marginBottom: space.md + 'px' } },
      React.createElement('h3', { id: 'mp-folgt-titel', style: titel }, t('chapters.finanzen.folgt.titel')),
      steuerKarte({ ...p, imKapitel: true }), steuerOrientierung(p), ipvKarte(p), kkLastKarte(p), gesundheitKarte(p), vermoegenKarte(p),
      // Reserve-Tankanzeige: wie viele Monate trägt der Notgroschen? Nur wenn etwas erfasst ist.
      (w.savingsAccount > 0 || w.totalExpenses > 0) && React.createElement(ReserveTank, {
        palette, t, savings: w.savingsAccount, monthlyExpenses: w.totalExpenses,
      })
    ),
    w.hasData && React.createElement('details', {
      'data-ansprueche': anspruch ? 'moeglich' : 'keiner', open: anspruch || undefined,
      style: { borderTop: '1px solid ' + palette.border + '88', borderBottom: '1px solid ' + palette.border + '88', marginBottom: space.md + 'px' },
    },
      React.createElement('summary', {
        style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', gap: space.sm + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text },
      },
        t('chapters.finanzen.weitereAnsprueche.titel'),
        React.createElement('span', { style: { fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } }, t('chapters.finanzen.weitereAnsprueche.sub'))
      ),
      React.createElement('div', { style: { paddingTop: space.sm + 'px' } }, sozialhilfeKarte(p), elKarte(p))
    )
  );
};
