import React, { useState } from 'react';
import { text, weight, space, radius } from './config/tokens.js';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';
import { MietzinsHinweis } from './components/MietzinsHinweis.jsx';
import { lookupPLZ } from './data/plzGemeinde.js';
import { addTodo } from './utils/merkliste.js';

// Umzug — der 3. geführte Ablauf, gebaut auf der Ablauf-Schale. Bewusst ruhige
// Orientierung statt Rechner: An-/Abmeldung bei der Gemeinde (CH: innert 14 Tagen),
// Adresse überall nachführen, alte Wohnung fristgerecht kündigen.

// Die Stellen, die die neue Adresse brauchen — stabile Schlüssel für Label + Merkliste.
const CHECKLIST = ['Post', 'Kk', 'Employer', 'Ahv', 'Tax', 'Insurance', 'Bank', 'Subs'];

// Orientierungs-Frist: In der Schweiz meldet man sich innert 14 Tagen nach dem Umzug
// bei der neuen Gemeinde an. Wir kennen das Umzugsdatum nicht → ruhige Erinnerung
// 14 Tage ab heute (verschiebbar), bewusst Orientierung, kein Verdikt.

export const UmzugAblauf = ({ palette, t, data, chapters, onNavigate }) => {
  const s = ablaufStyles(palette);
  const currentAddress = [data?.wohnen?.address, [data?.wohnen?.postalCode, data?.wohnen?.city].filter(Boolean).join(' ')]
    .filter(Boolean).join(', ');
  const deadline = inDays(14);
  // Kapitel-Index über den Schlüssel auflösen (nicht hartkodieren) — robust gegen Umsortierung.
  const chapterIdx = (key) => (chapters ? chapters.findIndex(ch => ch.key === key) : -1);

  // Umzugs-Typ: bestimmt, was sich ändert (Gemeinde/Kanton/Steuern/KK-Prämienregion).
  // gemeinde = gleiche Gemeinde · kanton = andere Gemeinde, gleicher Kanton · extra = anderer Kanton.
  const [umzugType, setUmzugType] = useState(null);
  // Kanton aus der (neuen) PLZ ableiten — für den Mietzinsbeitrags-Hinweis beim Gemeinde-/Kantonswechsel.
  const userCanton = (() => {
    const plz = (data?.wohnen?.postalCode || '').trim();
    if (plz.length < 4) return null;
    const gem = lookupPLZ(plz);
    return gem && gem.length ? gem[0].kanton : null;
  })();
  const typeCard = (id, label) => {
    const isChosen = umzugType === id;
    const isDimmed = umzugType && !isChosen;
    return React.createElement('button', {
      type: 'button', key: id, onClick: () => setUmzugType(id), 'aria-pressed': isChosen,
      style: {
        flex: '1 1 160px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.text,
        background: isChosen ? palette.surface : palette.up, borderRadius: radius.sm,
        border: '1.5px solid ' + (isChosen ? palette.sand : palette.border),
        opacity: isDimmed ? 0.55 : 1, transition: 'opacity 120ms, border-color 120ms',
      },
    }, (isChosen ? '✓ ' : '') + label);
  };

  // Adress-Checkliste: jede Stelle lässt sich als offener Punkt in die Merkliste legen
  // (idempotent, kein Doppel). Der Link führt jeweils zum Adressänderungs-Brief.
  const [added, setAdded] = useState({});
  const addOne = (k) => {
    addTodo({ text: t('umzug.step3TodoPrefix') + ' ' + t('umzug.step3' + k), link: 'briefe' });
    setAdded(a => ({ ...a, [k]: true }));
  };
  const addAll = () => {
    const next = {};
    CHECKLIST.forEach(k => { addTodo({ text: t('umzug.step3TodoPrefix') + ' ' + t('umzug.step3' + k), link: 'briefe' }); next[k] = true; });
    setAdded(next);
  };

  return React.createElement(AblaufContainer, {
    palette, icon: 'home',
    title: t('umzug.title'),
    intro: t('umzug.intro'),
  },
    // Schritt 1 — Neue Adresse (anzeigen was erfasst ist, sonst zum Erfassen führen)
    React.createElement(AblaufStep, { palette, title: t('umzug.step1Title') },
      React.createElement('p', { style: s.stepText },
        currentAddress
          ? t('umzug.step1Known', { address: currentAddress })
          : t('umzug.step1Note')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.step1Link'), onClick: () => onNavigate('chapter', chapterIdx('wohnen')) })
    ),

    // Schritt 2 — An-/Abmelden bei der Gemeinde (14-Tage-Frist), je nach Umzugs-Typ
    React.createElement(AblaufStep, { palette, title: t('umzug.step2Title') },
      // Typ-Wähler: was sich ändert, hängt davon ab, wie weit der Umzug geht.
      React.createElement('p', { style: { ...s.stepText, marginBottom: '6px' } }, t('umzug.typeLabel')),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', marginBottom: space.sm + 'px' } },
        typeCard('gemeinde', t('umzug.typeGemeinde')),
        typeCard('kanton', t('umzug.typeKanton')),
        typeCard('extra', t('umzug.typeExtra'))
      ),
      React.createElement('p', { style: s.stepText }, t(umzugType ? 'umzug.step2Text_' + umzugType : 'umzug.step2Text')),
      // „Das ändert sich" — ruhiger Hinweis je Typ, mit Crosslinks zu Prämie/Steuern wo relevant.
      umzugType && React.createElement('div', { style: { ...s.note, marginTop: space.sm + 'px' } },
        'ⓘ ' + t('umzug.changes_' + umzugType)),
      umzugType !== 'gemeinde' && onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.changesLinkPraemien'), onClick: () => onNavigate('praemien') }),
      umzugType === 'extra' && onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.changesLinkTax'), onClick: () => onNavigate('tax') }),
      // Neue Gemeinde/Kanton kann einen Mietzinsbeitrags-Anspruch bedeuten — Hinweis genau hier,
      // wo das Lebensereignis ihn auslöst (bestehende Komponente, kanton-bewusst).
      umzugType !== 'gemeinde' && React.createElement(MietzinsHinweis, { palette, t, canton: userCanton }),
      // Voller Mietzinsbeiträge-Schnellcheck (mit echten Beträgen), nicht nur der Hinweis.
      umzugType !== 'gemeinde' && onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.linkMietzins'), onClick: () => onNavigate('mietzins') }),
      // Zuzug aus dem Ausland: erstmalige Krankenkassen-Anmeldung (selbst-selektierend formuliert).
      umzugType === 'extra' && onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.linkKkErst'), onClick: () => onNavigate('kkerst') }),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('umzug.step2Button', { date: formatDE(deadline) }),
        doneLabel: t('umzug.step2Done'),
        calendarLabel: t('umzug.step2CalendarLink'),
        onNavigate,
        reminder: {
          title: t('umzug.reminderTitle'),
          dueDate: deadline,
          category: 'admin',
          recurrence: 'once',
          notes: t('umzug.reminderNotes'),
        },
      })
    ),

    // Schritt 3 — Adresse überall nachführen (ruhige Checkliste)
    React.createElement(AblaufStep, { palette, title: t('umzug.step3Title') },
      React.createElement('p', { style: s.stepText }, t('umzug.step3Text')),
      // Jede Stelle als Zeile mit „merken"-Knopf → landet als offener Punkt in der Merkliste.
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', margin: space.sm + 'px 0' } },
        CHECKLIST.map((k) => {
          const isAdded = !!added[k];
          return React.createElement('div', {
            key: k,
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', fontSize: text.sm, color: palette.text },
          },
            React.createElement('span', null, t('umzug.step3' + k)),
            React.createElement('button', {
              onClick: () => addOne(k),
              disabled: isAdded,
              'aria-pressed': isAdded,
              style: {
                flexShrink: 0, cursor: isAdded ? 'default' : 'pointer', fontFamily: 'inherit',
                background: 'none', border: '1px solid ' + (isAdded ? palette.sage : palette.border),
                borderRadius: radius.sm, padding: '2px 10px', fontSize: text.xs,
                color: isAdded ? palette.sage : palette.mid,
              },
            }, isAdded ? '✓ ' + t('umzug.step3Added') : t('umzug.step3Add'))
          );
        })
      ),
      React.createElement('button', {
        onClick: addAll,
        style: { cursor: 'pointer', fontFamily: 'inherit', background: 'none', border: 'none', padding: '2px 0', fontSize: text.sm, color: palette.sandDeep, fontWeight: weight.semi },
      }, '+ ' + t('umzug.step3AddAll')),
      // Für jede Stelle der Liste den gleichen Adressänderungs-Brief (ein Dokument, wiederverwendbar).
      onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.linkAddressChange'), onClick: () => onNavigate('briefe') })
    ),

    // Schritt 4 — Alte Wohnung kündigen (→ Briefvorlage)
    React.createElement(AblaufStep, { palette, title: t('umzug.step4Title') },
      React.createElement('p', { style: s.stepText }, t('umzug.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.step4Link'), onClick: () => onNavigate('briefe') })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('umzug.footerFrist'), t('trust.localOnly')] })
  );
};

export default UmzugAblauf;
