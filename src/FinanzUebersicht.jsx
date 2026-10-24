import React from 'react';
import PrimaryButton from './components/PrimaryButton.jsx';
import { PageTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { getCantonName } from './config/cantonalData.js';
import { text, weight, radius, leading, space } from './config/tokens.js';
import { Lebensbaum } from './Lebensbaum.jsx';
import { astFarben, bereichsFruechte } from './utils/lebensbereichFruechte.js';
import { MietVergleich } from './components/MietVergleich.jsx';
import { ReserveTank } from './components/ReserveTank.jsx';
import { finanzWerte, formatCHF, LohnStandort, auswertungsKarten, UebersichtDrucken, auswertungsHinweis } from './components/FinanzAuswertung.jsx';

// Die Rechnung, die Karten und der Druck stehen seit 24.10.2026 in components/FinanzAuswertung.jsx
// (Zusammenlegung mit dem Kapitel Finanzen, Bauschritt 2). Hier bleibt, was nur die Übersicht
// zeigt — bis sie im Kapitel aufgeht (docs/entscheide/finanzen-fusion.md).
export { druckAbschnitte } from './components/FinanzAuswertung.jsx';

export const FinanzUebersicht = ({ palette, t, data, onNavigate, isDarkMode, chapters = [], onSelectChapter, isMobile, lang = 'de' }) => {
  const vorlesen = useVorlesenContext();
  const w = finanzWerte(data, t);
  const { income, canton, hh, hasData, hasExpenses, bruttoDabei, freeAmount, totalIncome, totalExpenses, einnahmen, savingsAccount } = w;

  // Fruechte des Lebensbaums — dieselbe Ableitung wie im Dashboard, geteilt ueber
  // utils/lebensbereichFruechte.js. `chapters` und `lang` kommen aus main.jsx.
  // KEIN useT() hier: mehrere Tests rendern diese Ansicht bewusst ohne
  // I18nProvider, und der Hook wirft dort — deshalb kommt lang als Prop.
  const fruechte = chapters.length
    ? bereichsFruechte(chapters, data, astFarben(chapters, palette, isDarkMode))
    : [];

  const wegKnopf = {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '12px', background: palette.up, border: '1px solid ' + palette.border,
    borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, color: palette.text,
    fontFamily: 'inherit', textAlign: 'left',
  };

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
      React.createElement(PrimaryButton, {
        palette, onClick: () => onNavigate('chapter', 2), style: { minHeight: '44px' },
      }, t('finanzUebersicht.enterIncome'), ' ›')
    ),

    hasData && React.createElement('div', {
      style: {
        padding: '16px', background: palette.sand + '10', borderRadius: radius.sm,
        border: '1px solid ' + palette.sand + '25', marginBottom: '16px',
      }
    },
      // Mit der erfassten Art im Namen (Nettoeinkommen / Bruttolohn / Lohn) — wie im Monatsbudget.
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } },
        t(einnahmen[0] ? einnahmen[0].key : 'finanzUebersicht.monthlyIncome')
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

    hasData && React.createElement(LohnStandort, { palette, t, data, isDarkMode, onNavigate, w }),

    // Und direkt darunter die Miete — dasselbe Instrument, andere Domäne. Zusammen
    // beantworten sie die zwei Fragen, die den Monat bestimmen: was kommt rein, was geht
    // fürs Wohnen raus. Erscheint nur mit Kanton + erfasster Miete (sonst return null).
    hasData && React.createElement('div', { key: 'miet-vergleich', style: { marginBottom: '16px' } },
      React.createElement(MietVergleich, { palette, t, data, isDarkMode })
    ),

    hasData && auswertungsKarten({ palette, t, data, onNavigate, w }),

    hasData && hasExpenses && React.createElement('div', {
      style: {
        // Brutto: kein Saldo, also auch keine Saldo-Farbe.
        padding: '16px', background: bruttoDabei ? palette.up : freeAmount >= 0 ? palette.sage + '12' : palette.rose + '12',
        borderRadius: radius.sm, border: '1px solid ' + (bruttoDabei ? palette.border : freeAmount >= 0 ? palette.sage + '30' : palette.rose + '30'),
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
      // Aufschlüsselung, sobald mehr als der eigene Lohn zählt — sichtbar, was mitgerechnet ist.
      einnahmen.length > 1 && React.createElement('div', { style: { margin: '-4px 0 8px', paddingLeft: space.sm + 'px' } },
        einnahmen.map(z => React.createElement('div', {
          key: z.key,
          style: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal },
        },
          React.createElement('span', null, t(z.key)),
          React.createElement('span', null, formatCHF(z.betrag))
        ))
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
        React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('finanzUebersicht.freeAmount')),
        !bruttoDabei && React.createElement('span', {
          style: { fontSize: text.lg, fontWeight: weight.semi, color: freeAmount >= 0 ? (palette.sageDeep || palette.sage) : (palette.roseDeep || palette.rose) }
        }, formatCHF(freeAmount))
      ),
      bruttoDabei && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginTop: space.xs + 'px' } },
        t('budgetSync.availableNeedsNetto'))
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
      React.createElement('button', { onClick: () => onNavigate('sync'), style: wegKnopf },
        React.createElement(Icon, { name: 'rechner', size: 16 }), t('finanzUebersicht.toBudget')),
      React.createElement('button', { onClick: () => onNavigate('behoerdendossier'), style: wegKnopf },
        React.createElement(Icon, { name: 'mappe', size: 16 }), t('finanzUebersicht.toDossier')),
    ),
    // Drucken über die volle Breite unter den zwei Wegen — wie vorher als dritte Zeile im Raster.
    hasData && React.createElement('div', { style: { marginTop: space.sm } },
      React.createElement(UebersichtDrucken, { palette, t, data, w })
    ),

    auswertungsHinweis({ palette, t })
  );
};

export default FinanzUebersicht;
