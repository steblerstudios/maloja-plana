import React from 'react';
import { text, weight, space, radius, fontFamily } from './config/tokens.js';
import { Icon } from './IconSystem.jsx';
import {
  SAEULE3A_HOECHSTABZUG, SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR, saeule3aMaximum,
  einzahlungenImJahr, jahreMitEinzahlungen,
} from './data/saeule3a.js';

const fmt = (v) => Math.round(v).toLocaleString('de-CH');
const chf = (v) => 'CHF ' + fmt(v);

// Einzahlungs-Tracker der Säule 3a.
//
// 🛑 DER BALKEN MISST EIN JAHR, NICHT DIE LISTE. Bis zum 23.09.2026 summierte er alle
// erfassten Zeilen und verglich diese Summe mit dem JAHRESmaximum — wer den Tracker über
// mehrere Jahre weiterführte, wofür er gebaut ist, sah «Maximum erreicht», obwohl er es in
// keinem einzelnen Jahr ausgeschöpft hatte. Dieselbe Summe ging als `pension3a` in den
// Steuerrechner, in die Budget-Synchronisation und in die Prämienverbilligung.
//
// Frühere Jahre werden NICHT ausgeblendet — ihre Zeilen bleiben sicht- und änderbar, sonst
// liesse sich ein falsches Datum nicht mehr korrigieren. Sie zählen nur nicht mit, und das
// steht als Satz dabei statt als stille Lücke. Ein Balken je Jahr wäre die andere Lösung;
// dagegen spricht die Dichte: für die Frage «wie viel darf ich dieses Jahr noch einzahlen»
// ist jeder zusätzliche Balken Lärm.
export const Saeule3aTracker = ({ palette, t, deposits, jahr, max, onChange }) => {
  const list = Array.isArray(deposits) ? deposits : [];
  // Ohne ausdrückliches Jahr das laufende. Der Aufrufer gibt es mit (ChapterView tut es),
  // damit diese Anzeige selbst nicht von der Uhr abhängt und prüfbar bleibt.
  const jahrJetzt = Number(jahr) || new Date().getFullYear();
  // 🛑 Der Deckel kommt aus der Jahrestabelle, nicht aus `SAEULE3A_MAX`. Sonst zeigte die
  // App im Januar 2027 weiter das Maximum von 2026 — eine falsche Zahl in einer
  // Steuerangabe, und zwar genau dann, wenn niemand mehr hinsieht.
  const ceiling = Number(max) || saeule3aMaximum(jahrJetzt);
  const total = einzahlungenImJahr(list, jahrJetzt);
  const pct = ceiling ? Math.min(100, Math.round((total / ceiling) * 100)) : 0;
  const remaining = ceiling ? Math.max(0, ceiling - total) : 0;
  // Was in anderen Jahren liegt: für den Satz darunter, der erklärt, warum es nicht mitzählt.
  const frueher = jahreMitEinzahlungen(list, jahrJetzt)
    .filter((j) => j !== jahrJetzt)
    .reduce((s, j) => s + einzahlungenImJahr(list, j, jahrJetzt), 0);
  // Die Fussnote nennt die Höchstabzüge des angezeigten Jahres. Ist es nicht belegt, nennt
  // sie ausdrücklich das Jahr, für das die Werte gelten — statt sie als die aktuellen
  // auszugeben. Lieber ein sichtbar älteres Jahr als eine stillschweigend falsche Zahl.
  const notiz = SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR[jahrJetzt]
    ? { jahr: jahrJetzt, ...SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR[jahrJetzt] }
    : { jahr: SAEULE3A_HOECHSTABZUG.steuerjahr, ...SAEULE3A_HOECHSTABZUG };

  const addDeposit = () => onChange([...list, { date: '', amount: '' }]);
  const updateDeposit = (idx, patch) => onChange(list.map((d, i) => i === idx ? { ...d, ...patch } : d));
  const removeDeposit = (idx) => onChange(list.filter((_, i) => i !== idx));

  const inputStyle = {
    padding: (space.sm + 2) + 'px ' + space.sm + 'px',
    borderRadius: radius.sm, border: '1px solid ' + palette.border,
    background: palette.up, color: palette.text, boxSizing: 'border-box',
    fontSize: text.sm, fontFamily, cursor: 'text',
  };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.sm } },

    // Progress summary
    React.createElement('div', {
      style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border }
    },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.sm } },
        React.createElement('span', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text } }, chf(total)),
        // Das Jahr steht am Betrag, nicht im Kleingedruckten: ohne es liest sich die Zahl wie
        // «alles, was ich je eingezahlt habe», und genau diese Lesart war der Fehler.
        React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } },
          ceiling ? t('saeule3a.ofMax', { max: chf(ceiling), jahr: jahrJetzt }) : t('saeule3a.forYear', { jahr: jahrJetzt }))
      ),
      // calm progress bar — nur, wenn es ein belegtes Maximum gibt, gegen das sie misst
      ceiling && React.createElement('div', { style: { height: '6px', background: palette.border, borderRadius: '3px', overflow: 'hidden' } },
        React.createElement('div', { style: { height: '100%', width: pct + '%', background: pct >= 100 ? palette.sage : palette.sky, transition: 'width 300ms ease' } })
      ),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
        // Kein belegtes Maximum für dieses Jahr ⇒ lieber sagen, dass es fehlt, als das
        // Maximum des Vorjahres als dieses auszugeben.
        !ceiling ? t('saeule3a.maxUnknown', { jahr: jahrJetzt })
          : remaining > 0 ? t('saeule3a.remaining', { amount: chf(remaining) }) : t('saeule3a.maxReached')
      ),
      // Frühere Jahre bleiben in der Liste, zählen aber nicht mit. Der Satz erscheint nur,
      // wenn es sie gibt — sonst wäre er Lärm für alle, die den Tracker im ersten Jahr nutzen.
      frueher > 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs } },
        t('saeule3a.earlierYears', { amount: chf(frueher), jahr: jahrJetzt })
      )
    ),

    // Deposit rows
    list.length > 0 && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.xs } },
      list.map((dep, idx) =>
        React.createElement('div', {
          key: idx,
          style: { display: 'grid', gridTemplateColumns: '1fr 140px auto', gap: space.xs, alignItems: 'center' }
        },
          React.createElement('input', {
            type: 'date', value: dep.date || '',
            onChange: (e) => updateDeposit(idx, { date: e.target.value }),
            'aria-label': t('saeule3a.date'),
            style: { ...inputStyle, cursor: 'pointer' },
          }),
          // Betrag mit klarer CHF-Einheit (sonst unklar „250 was?" — Stebler Studios).
          React.createElement('div', { style: { display: 'flex', alignItems: 'stretch', border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.up, overflow: 'hidden' } },
            React.createElement('span', { style: { fontSize: text.xs, color: palette.mid, alignSelf: 'center', padding: '0 ' + space.xs + 'px 0 ' + space.sm + 'px', whiteSpace: 'nowrap' } }, 'CHF'),
            React.createElement('input', {
              type: 'number', inputMode: 'decimal', value: dep.amount || '',
              onChange: (e) => updateDeposit(idx, { amount: e.target.value }),
              placeholder: t('saeule3a.amount'),
              'aria-label': t('saeule3a.amount') + ' (CHF)',
              style: { ...inputStyle, border: 'none', borderRadius: 0, background: 'transparent', flex: 1, minWidth: 0 },
            })
          ),
          React.createElement('button', {
            onClick: () => removeDeposit(idx),
            'aria-label': t('common.delete') || 'Entfernen',
            style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.sm, fontFamily, padding: '6px 8px', minHeight: '24px' }
          }, React.createElement(Icon, { name: 'kreuz', size: 12 }))
        )
      )
    ),

    React.createElement('button', {
      onClick: addDeposit,
      style: {
        padding: space.sm + 'px ' + space.md + 'px',
        background: 'transparent', color: palette.mid,
        border: '1px dashed ' + palette.border, borderRadius: radius.sm,
        cursor: 'pointer', fontSize: text.sm, fontFamily,
        fontWeight: weight.medium, alignSelf: 'flex-start',
      }
    }, '+ ' + t('saeule3a.add')),

    // 🛑 Die beiden Beträge und das Jahr kommen aus der Jahrestabelle, nicht aus dem Satz.
    // Bis zum 23.09.2026 standen «Maximum 2026 … 7'258 … 36'288» in allen FÜNF
    // Sprachdateien ausgeschrieben — dieselbe Zahl an fünf weiteren Stellen von Hand, genau
    // das, wogegen src/data/saeule3a.js angelegt wurde. Beim nächsten Jahreswechsel wären
    // fünf Übersetzungen zu ändern gewesen, und vergessen wird davon mindestens eine.
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5 } },
      t('saeule3a.selfEmployedNote', {
        jahr: notiz.jahr, mit: chf(notiz.mitPensionskasse), ohne: chf(notiz.ohnePensionskasse),
        satz: Math.round(SAEULE3A_HOECHSTABZUG.satzOhnePensionskasse * 100),
      })
    ),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.sm + 'px', lineHeight: 1.5, fontStyle: 'italic' } },
      t('alpha.noAdviceHint')
    )
  );
};

export default Saeule3aTracker;
