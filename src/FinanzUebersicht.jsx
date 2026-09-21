import React from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon, hinweisZeichen, erledigtZeichen } from './IconSystem.jsx';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { calculateSozialhilfe, calculateIPV, checkELEligibility, getCantonName, getHouseholdInfo } from './config/cantonalData.js';
import { steuernFuerProfil, steuerEingabenAusDaten, KANTONAL_DATA_VERSION } from './data/kantonaleSteuerdaten.js';
import { KantonssteuerOrientierung, bundOhneZahlText, ERKLAERT_IN_ORIENTIERUNG } from './components/KantonssteuerOrientierung.jsx';
import { annahmenTexte } from './utils/steuerTexte.js';
import { text, weight, radius, leading, space } from './config/tokens.js';
import { Lebensbaum } from './Lebensbaum.jsx';
import { astFarben, bereichsFruechte } from './utils/lebensbereichFruechte.js';
import { openPrintWindow, escapeHtml } from './utils/helpers.js';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { BRANCHENLOHN, getBranchenvergleich } from './data/branchenLohn.js';
import { berechneArmutsgrenze } from './data/sozialhilfeRechner.js';
import { nettoZuBruttoRichtwert } from './data/ahvRechner.js';
import { LohnEinordnung } from './components/LohnEinordnung.jsx';
import { lohnBandState } from './data/lohnEinordnung.js';
import { MietVergleich } from './components/MietVergleich.jsx';
import { KKLastCard } from './KKLastCard.jsx';
import { ReserveTank } from './components/ReserveTank.jsx';
import { monthlyExpenses } from './data/haushaltskosten.js';
import { renderSource } from './utils/renderSource.js';
import { steuerkantonVorbelegung } from './utils/steuerkanton.js';
import { GlossarText } from './GlossarBegriff.jsx';

function formatCHF(value) {
  const n = Math.round(value);
  if (n === 0) return 'CHF 0';
  const abs = Math.abs(n);
  const formatted = abs >= 1000
    ? abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’')
    : abs.toString();
  return (n < 0 ? '− ' : '') + 'CHF ' + formatted;
}

const StatusCard = ({ palette, icon, title, status, statusColor, detail, onClick }) =>
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

  zeilen.push({ label: t('finanzUebersicht.ipv'), html: '<tr><td>' + t('finanzUebersicht.ipv') + '</td><td class="r">' + (w.ipv.eligible ? '✓ ' + fmt(w.ipv.amount) + ' ' + t('common.perMonth') : w.ipv.belegt === false ? t('ipv.statusOffen') : t('finanzUebersicht.notEligible')) + '</td></tr>' });
  zeilen.push({ label: t('finanzUebersicht.sozialhilfe'), html: '<tr><td>' + t('finanzUebersicht.sozialhilfe') + '</td><td class="r">' + (w.sozialhilfe.eligible ? fmt(w.sozialhilfe.deficit) + ' ' + t('common.perMonth') : t('sozialhilfe.notEntitled')) + '</td></tr>' });
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
        { label: t('finanzUebersicht.freeAmount'), html: '<tr class="total"><td>' + t('finanzUebersicht.freeAmount') + '</td><td class="r ' + (w.freeAmount >= 0 ? 'pos' : 'neg') + '">' + fmt(w.freeAmount) + '</td></tr>' },
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

export const FinanzUebersicht = ({ palette, t, data, onNavigate, isDarkMode, chapters = [], onSelectChapter, isMobile, lang = 'de' }) => {
  // Angetippte Branche → ihr Median als neutrale Marke auf dem Lohn-Barometer. `null` = keine.
  const [selBranche, setSelBranche] = React.useState(null);
  // Export-Vorschau (K20): erst zeigen, was auf dem Ausdruck steht, dann drucken.
  const [druckVorschau, setDruckVorschau] = React.useState(false);
  const vorlesen = useVorlesenContext();
  const income = Number(data.finanzen?.monthlyIncome || 0);
  const canton = data.basis?.canton || '';
  // K33/E23: Für die Steuerschätzung zählt der Steuerkanton — kann vom Wohnkanton
  // abweichen (z. B. Wochenaufenthalt). Dasselbe Vorbelegungsmuster wie im
  // Steuerrechner (TaxCalculator.jsx, PR #165: behoerden.cantoneOfTaxation → alter
  // Schlüssel canton → basis.canton). Überall sonst in dieser Übersicht bleibt
  // `canton` der Wohnkanton (Lohn-Barometer, Miete, IPV, gedruckte „Kanton"-Zeile).
  const steuerkanton = steuerkantonVorbelegung(data);
  const hh = getHouseholdInfo(data);

  const sozialhilfe = calculateSozialhilfe(data);
  const ipv = calculateIPV(data);
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

  const hasData = income > 0;

  // Slice B: bezahlte KK-Belege dieses Jahres als Gesundheitskosten spiegeln
  // (Crosslink KVG-Tracker → Finanzen, kein zweites Eingeben). Offene separat.
  const currentYear = new Date().getFullYear();
  const kkBelege = Array.isArray(data.versicherungen?.kkBelege) ? data.versicherungen.kkBelege : [];
  const belegeThisYear = kkBelege.filter(b => !b.datum || String(b.datum).slice(0, 4) === String(currentYear));
  // Reale Gesundheitsausgabe = gedeckter Betrag + nicht-gedeckter Anteil.
  const belegTotal = (b) => (Number(b.betrag) || 0) + (Number(b.nichtGedeckt) || 0);
  const gesundheitskosten = belegeThisYear.filter(b => b.status !== 'offen').reduce((s, b) => s + belegTotal(b), 0);
  const gesundheitskostenOffen = belegeThisYear.filter(b => b.status === 'offen').reduce((s, b) => s + belegTotal(b), 0);
  const hasGesundheitskosten = (gesundheitskosten + gesundheitskostenOffen) > 0;

  // Vermögen (Wertschriften + übriges Vermögen + Ersparnisse) — Steuerwert, ohne gebundenes 3a
  const securitiesValue = Number(data.finanzen?.securitiesValue || 0);
  const otherAssets = Number(data.finanzen?.otherAssets || 0);
  const savingsAccount = Number(data.finanzen?.savingsAccount || 0);
  const totalAssets = securitiesValue + otherAssets + savingsAccount;
  const hasAssets = totalAssets > 0;

  const totalExpenses = monthlyExpenses(data);
  const totalIncome = income + Number(data.finanzen?.familienzulagen || 0) + Number(data.finanzen?.alimenteReceived || 0);
  const freeAmount = totalIncome - totalExpenses;
  const hasExpenses = totalExpenses > 0;

  // Die Werte, die gedruckt werden — auch die Quelle der Export-Vorschau (K20).
  const druckWerte = {
    income, canton, taxResult, steuerOhneZahl, kantonal, annahmen, ipv, sozialhilfe, el,
    totalIncome, totalExpenses, freeAmount, hasExpenses, totalAssets, hasAssets, gesundheitskosten,
  };

  const handlePrint = () => {
    openPrintWindow(generatePrintHTML(t, data, druckWerte));
  };

  // Fruechte des Lebensbaums — dieselbe Ableitung wie im Dashboard, geteilt ueber
  // utils/lebensbereichFruechte.js. `chapters` und `lang` kommen aus main.jsx.
  // KEIN useT() hier: mehrere Tests rendern diese Ansicht bewusst ohne
  // I18nProvider, und der Hook wirft dort — deshalb kommt lang als Prop.
  const fruechte = chapters.length
    ? bereichsFruechte(chapters, data, astFarben(chapters, palette, isDarkMode))
    : [];

  return React.createElement('div', { style: { maxWidth: '520px' } },

    // Der Lebensbaum steht vor den Zahlen (Entscheid 20.09.): zuerst, was aus den
    // eigenen Angaben gewachsen ist — dann die Rechnung. Aus einer Tabelle wird
    // ein Ort. Ohne Kapitel (z. B. im Aufruf ohne Profil) faellt er still weg.
    fruechte.length > 0 && React.createElement(Lebensbaum, {
      palette, t, data, text, weight, space, radius,
      onNavigate, bereiche: fruechte, onSelectChapter, isMobile, lang, isDarkMode,
    }),

    React.createElement('div', {
      style: {
        background: palette.surface, padding: '24px 20px', borderRadius: radius.sm,
        border: '1px solid ' + palette.border, marginBottom: '20px',
      }
    },
      React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'budget', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('finanzUebersicht.title')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal }
      }, t('finanzUebersicht.subtitle'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('finanzUebersicht.subtitle'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') }))
    ),

    !hasData && React.createElement('div', {
      style: {
        padding: '24px 20px', textAlign: 'center', background: palette.up,
        borderRadius: radius.sm, border: '1px solid ' + palette.border,
      }
    },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm } },
        t('finanzUebersicht.noData')
      ),
      React.createElement('button', {
        onClick: () => onNavigate('chapter', 2),
        style: {
          padding: '8px 16px', background: palette.sand, color: palette.onSand,
          border: 'none', borderRadius: radius.sm, cursor: 'pointer',
          fontSize: text.sm, fontWeight: weight.medium, fontFamily: 'inherit',
        }
      }, t('finanzUebersicht.enterIncome'))
    ),

    hasData && React.createElement('div', {
      style: {
        padding: '16px', background: palette.sand + '10', borderRadius: radius.sm,
        border: '1px solid ' + palette.sand + '25', marginBottom: '16px',
      }
    },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } },
        t('finanzUebersicht.monthlyIncome')
      ),
      React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi } },
        formatCHF(income) + ' ' + t('common.perMonth')
      ),
      canton && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '4px' } },
        t('finanzUebersicht.canton') + ': ' + getCantonName(canton, t)
      ),
      hh.householdSize > 1 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } },
        t('finanzUebersicht.household') + ': ' + (
          hh.childrenCount > 0
            ? t('finanzUebersicht.householdDetail', { adults: hh.adults, children: hh.childrenCount })
            : hh.adults + ' ' + t('finanzUebersicht.adults')
        )
      )
    ),

    hasData && income > 0 && (() => {
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
      const sideIncome = Number(f.sideIncome || 0);
      const sideNettoOk = sideIncome <= 0 || f.sideIncomeType === 'netto';
      const rentKnown = Number(data.wohnen?.rentAmount || 0) > 0;
      const geb = data.basis?.dateOfBirth ? new Date(data.basis.dateOfBirth) : null;
      const alter = geb && !isNaN(geb.getTime()) ? Math.floor((Date.now() - geb.getTime()) / 31557600000) : undefined;
      const personenAb16 = hh.adults + (hh.children || []).filter(c => (Number(c.age) || 0) >= 16).length;
      const armutsgrenze = berechneArmutsgrenze({
        grundbedarf: sozialhilfe.grundbedarf,
        effektiveWohnkosten: sozialhilfe.effectiveRent,
        personenAb16,
      });
      const nettoHaushalt = income + (sideNettoOk ? sideIncome : 0) + (hh.partnerIncome || 0)
        + Number(f.familienzulagen || 0) + Number(f.alimenteReceived || 0);
      const verfuegbar = Math.max(0, nettoHaushalt - Number(f.monthlyTax || 0)
        - Number(data.versicherungen?.kkPremium || 0) - Number(f.alimentePaid || 0));
      const unterArmutsgrenze = f.incomeType === 'netto' && sideNettoOk && rentKnown
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
          React.createElement('div', { style: { fontSize: '10px', color: palette.soft, lineHeight: '1.5', marginTop: '3px' } },
            t('finanzUebersicht.povertyBruttoHint', { brutto: formatCHF(nettoZuBruttoRichtwert(income, alter)) }))
        ),
        React.createElement(LohnEinordnung, { palette, t, data, isDarkMode, embedded: true, branchMark: selBranche, onNavigate }),
        (() => {
          const vgl = getBranchenvergleich(income);
          if (!vgl) return null;
          // Chips gegen DENSELBEN Wert färben wie das Barometer (Vollzeit-/13.-normiert),
          // sonst widersprechen sich grüner Chip und Marker-Position (roh 5200 vs. FTE 4952).
          const vergleichsLohn = lohnBandState({
            income: data.finanzen?.monthlyIncome, canton: data.basis?.canton,
            hoursPerWeek: data.ausbildung?.workHoursPerWeek,
            incomeType: data.finanzen?.incomeType, dreizehnter: data.finanzen?.dreizehnter,
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
                    fontSize: '10px', padding: '6px 8px', borderRadius: '3px',
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
    })(),

    // Und direkt darunter die Miete — dasselbe Instrument, andere Domäne. Zusammen
    // beantworten sie die zwei Fragen, die den Monat bestimmen: was kommt rein, was geht
    // fürs Wohnen raus. Erscheint nur mit Kanton + erfasster Miete (sonst return null).
    hasData && React.createElement('div', { key: 'miet-vergleich', style: { marginBottom: '16px' } },
      React.createElement(MietVergleich, { palette, t, data, isDarkMode })
    ),

    hasData && React.createElement(StatusCard, {
      palette, icon: 'money',
      title: t('finanzUebersicht.taxes'),
      status: kantonal
        ? '~ ' + formatCHF(kantonal.total) + ' ' + t('common.perYear')
        : taxResult
          ? '~ ' + formatCHF(taxResult.steuer) + ' ' + t('common.perYear') + ' (' + t('tax.federalOnly') + ')'
          : steuerOhneZahl ? t('tax.noTaxFigure') : t('finanzUebersicht.noIncome'),
      statusColor: palette.text,
      detail: kantonal
        ? t('tax.federalTax') + ': ' + formatCHF(taxResult.steuer) + ' + ' + t('tax.cantonalAndMunicipal') + ' (' + t('tax.roughEstimateBadge') + '): ' + formatCHF(kantonal.kantonalUndGemeinde) + '. ' + t('tax.basedOnHauptort', { year: KANTONAL_DATA_VERSION }) + (annahmenSatz ? ' ' + annahmenSatz : '')
        : steuerOhneZahl ? (steuerkanton && ERKLAERT_IN_ORIENTIERUNG.includes(steuerOhneZahl) ? null : bundOhneZahlText(t, steuerOhneZahl))
          : [!steuerkanton ? t('finanzUebersicht.selectCanton') : '', annahmenSatz].filter(Boolean).join(' ') || null,
      onClick: () => onNavigate('tax'),
    }),
    // E38: keine Kantonszahl → ruhige Orientierung mit den amtlichen Wegen (ausserhalb der Karte,
    // weil die Karte selbst ein Knopf ist und keine Links enthalten darf).
    hasData && steuerkanton && kantonsSchaetzung && !kantonal && React.createElement(KantonssteuerOrientierung, {
      palette, t, canton: steuerkanton, schaetzung: kantonsSchaetzung, jahr: KANTONAL_DATA_VERSION, style: { marginTop: '-4px' },
    }),

    hasData && React.createElement(StatusCard, {
      palette, icon: 'insurance',
      title: t('finanzUebersicht.ipv'),
      // E9: ohne amtlich belegten Kanton weder Betrag noch Grenze, nur die Orientierung.
      status: ipv.eligible
        ? erledigtZeichen(true, formatCHF(ipv.amount) + ' ' + t('common.perMonth'))
        : ipv.belegt === false
          ? t('ipv.statusOffen')
          : t('finanzUebersicht.notEligible'),
      statusColor: ipv.eligible ? palette.sage : palette.mid,
      detail: ipv.eligible
        ? formatCHF(ipv.annual) + ' ' + t('common.perYear')
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
    }),

    hasData && React.createElement(StatusCard, {
      palette, icon: 'home',
      title: t('finanzUebersicht.sozialhilfe'),
      status: sozialhilfe.eligible
        ? t('sozialhilfe.entitled') + ': ~ ' + formatCHF(sozialhilfe.deficit) + ' ' + t('common.perMonth')
        : t('sozialhilfe.notEntitled'),
      statusColor: sozialhilfe.eligible ? palette.gold : palette.sage,
      detail: t('sozialhilfe.basicNeeds') + ': ' + formatCHF(sozialhilfe.grundbedarf) + ' | ' + t('sozialhilfe.totalNeeds') + ': ' + formatCHF(sozialhilfe.totalBedarf),
      onClick: () => onNavigate('sozialhilfe'),
    }),

    hasData && React.createElement(StatusCard, {
      palette, icon: 'legal',
      title: t('finanzUebersicht.el'),
      status: el.eligible
        ? t('sozialhilfe.elPossible')
        : el.noteKey === 'el.onlyAhvIv'
          ? t('sozialhilfe.elOnlyAhvIv')
          : t('finanzUebersicht.notApplicable'),
      statusColor: el.eligible ? palette.gold : palette.mid,
      detail: el.eligible ? formatCHF(el.deficit) + ' ' + t('common.perMonth') : null,
    }),

    hasData && hasAssets && React.createElement(StatusCard, {
      palette, icon: 'budget',
      title: t('finanzUebersicht.assets'),
      status: formatCHF(totalAssets),
      statusColor: palette.text,
      detail: t('finanzUebersicht.assetsDetail'),
      onClick: () => onNavigate('chapter', 2),
    }),

    hasData && hasGesundheitskosten && React.createElement(StatusCard, {
      palette, icon: 'health',
      title: t('finanzUebersicht.healthCosts'),
      status: formatCHF(gesundheitskosten),
      statusColor: palette.text,
      detail: t('finanzUebersicht.healthCostsDetail', { year: currentYear })
        + (gesundheitskostenOffen > 0 ? ' · ' + t('finanzUebersicht.healthCostsOpen', { amount: formatCHF(gesundheitskostenOffen) }) : ''),
      onClick: () => onNavigate('kvg', undefined, 'franchise'),
    }),

    // Faden 3 / 3-I: KK-Last als % des Einkommens gegen WHO-10%-Richtwert
    hasData && React.createElement(KKLastCard, { palette, t, data, onNavigate }),

    hasData && hasExpenses && React.createElement('div', {
      style: {
        padding: '16px', background: freeAmount >= 0 ? palette.sage + '12' : palette.rose + '12',
        borderRadius: radius.sm, border: '1px solid ' + (freeAmount >= 0 ? palette.sage + '30' : palette.rose + '30'),
        marginBottom: '16px',
      }
    },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } },
        t('finanzUebersicht.budgetBalance')
      ),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }
      },
        React.createElement('span', { style: { fontSize: text.sm } }, t('finanzUebersicht.totalIncome')),
        React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.sm } }, formatCHF(totalIncome))
      ),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }
      },
        React.createElement('span', { style: { fontSize: text.sm } }, t('finanzUebersicht.totalExpenses')),
        React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.sm } }, '− ' + formatCHF(totalExpenses))
      ),
      React.createElement('div', {
        style: { borderTop: '1px solid ' + palette.border, paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }
      },
        React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi } }, t('finanzUebersicht.freeAmount')),
        React.createElement('span', {
          style: { fontSize: text.lg, fontWeight: weight.semi, color: freeAmount >= 0 ? palette.sage : (palette.roseDeep || palette.rose) }
        }, formatCHF(freeAmount))
      )
    ),

    // Reserve-Tankanzeige: wie viele Monate trägt der Notgroschen? (Instrument über
    // savingsAccount ÷ totalExpenses). Nur wenn überhaupt etwas erfasst ist.
    hasData && (savingsAccount > 0 || totalExpenses > 0) && React.createElement(ReserveTank, {
      palette, t, savings: savingsAccount, monthlyExpenses: totalExpenses,
    }),

    hasData && React.createElement('div', {
      style: { borderTop: '1px solid ' + palette.border, margin: '16px 0' }
    }),

    hasData && React.createElement('div', {
      style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.sm }
    },
      React.createElement('button', {
        onClick: () => onNavigate('sync'),
        style: {
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px', background: palette.up, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, color: palette.text,
          fontFamily: 'inherit', textAlign: 'left',
        }
      }, React.createElement(Icon, { name: 'rechner', size: 16 }), t('finanzUebersicht.toBudget')),
      React.createElement('button', {
        onClick: () => onNavigate('behoerdendossier'),
        style: {
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px', background: palette.up, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, color: palette.text,
          fontFamily: 'inherit', textAlign: 'left',
        }
      }, React.createElement(Icon, { name: 'mappe', size: 16 }), t('finanzUebersicht.toDossier')),
      React.createElement('button', {
        onClick: () => setDruckVorschau(true),
        style: {
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px', background: palette.up, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, color: palette.text,
          fontFamily: 'inherit', textAlign: 'left', gridColumn: '1 / -1',
        }
      }, React.createElement(Icon, { name: 'drucker', size: 16 }), t('finanzUebersicht.printAction'))
    ),

    // Export-Vorschau (K20) direkt unter dem Knopf, der sie geöffnet hat.
    druckVorschau && React.createElement(ExportVorschau, {
      palette, t, art: 'dossier',
      quelle: {
        // Der Ausdruck trägt den Namen im Titel — darum eigens genannt.
        name: !!(data.basis?.firstName || data.basis?.lastName),
        abschnitte: druckAbschnitte(t, druckWerte).map(a => ({ titel: a.titel, felder: a.zeilen.map(z => z.label) })),
      },
      onWeiter: () => { setDruckVorschau(false); handlePrint(); },
      onZurueck: () => setDruckVorschau(false),
    }),

    React.createElement('div', {
      style: { marginTop: space.md, fontSize: text.xs, color: palette.soft, lineHeight: '1.4' }
    }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('finanzUebersicht.disclaimer')))
  );
};

export default FinanzUebersicht;
