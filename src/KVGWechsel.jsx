import React, { useState } from 'react';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { addTodo } from './utils/merkliste.js';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// KVG-Wechsel — der erste geführte Ablauf ("Faden"), jetzt auf der wiederverwendbaren
// Ablauf-Schale. Verkettet die vorhandenen Bausteine zu einem ruhigen Weg: Vergleich →
// neue Kasse (zwei Wege, anklickbar) → Kündigung → Frist sichern. Eine editoriale Seite
// von oben nach unten, keine Wizard-Hölle.

// Nächster ordentlicher Kündigungstermin: 30. November (dieses Jahr, sonst nächstes).
const nextNov30 = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Datum, nicht Uhrzeit vergleichen → der 30.11. selbst zählt noch
  const year = now.getFullYear();
  const nov30 = new Date(year, 10, 30);
  const y = now <= nov30 ? year : year + 1;
  return `${y}-11-30`;
};

export const KVGWechsel = ({ palette, t, data, onNavigate }) => {
  const [chosenPath, setChosenPath] = useState(null); // null | '3a' | '3b'
  const [wunschKasse, setWunschKasse] = useState(data?.versicherungen?.targetInsurer || ''); // Ziel-Kasse, vorbelegt aus dem Vergleich

  const currentInsurer = data?.versicherungen?.kkInsurer || '';
  const deadline = nextNov30();
  const deadlineYear = deadline.slice(0, 4);

  // Geteilte Schalen-Styles + KVG-eigene Extras (Wege-Karten, Wunsch-Kasse-Input).
  const s = {
    ...ablaufStyles(palette),
    pathWrap: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', marginTop: space.sm + 'px' },
    reassure: { fontSize: text.sm, color: palette.sageDeep, fontWeight: weight.medium, marginTop: space.xs + 'px' },
    chosenBadge: { fontSize: text.xs, fontWeight: weight.semi, color: palette.sandDeep, marginTop: '6px' },
    inputLabel: { display: 'block', fontSize: text.sm, color: palette.mid, marginTop: space.sm + 'px' },
    input: { display: 'block', width: '100%', maxWidth: '280px', marginTop: '4px', padding: '8px 10px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit' },
  };

  // Ruhige Karte für einen der beiden Wege — anklickbar, hebt den gewählten hervor.
  const pathCard = (id, title, body, footer) => {
    const isChosen = chosenPath === id;
    const isDimmed = chosenPath && !isChosen;
    return React.createElement('button', {
      type: 'button',
      onClick: () => setChosenPath(id),
      'aria-pressed': isChosen,
      style: {
        flex: '1 1 240px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        padding: space.md + 'px',
        background: isChosen ? palette.surface : palette.up,
        borderRadius: radius.sm,
        border: '1.5px solid ' + (isChosen ? palette.sand : palette.border),
        opacity: isDimmed ? 0.55 : 1,
        transition: 'opacity 120ms, border-color 120ms',
      },
    },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } }, title),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, body),
      footer,
      isChosen && React.createElement('div', { style: s.chosenBadge }, '✓ ' + t('kvgWechsel.chosen'))
    );
  };

  const target = wunschKasse.trim();

  return React.createElement(AblaufContainer, {
    palette, icon: 'insurance',
    title: t('kvgWechsel.title'),
    intro: t('kvgWechsel.intro'),
  },
    // ── Schritt 1 — Lohnt sich's? ──
    React.createElement(AblaufStep, { palette, title: t('kvgWechsel.step1Title') },
      React.createElement('p', { style: s.stepText },
        currentInsurer
          ? t('kvgWechsel.step1TextKnown', { insurer: currentInsurer })
          : t('kvgWechsel.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kvgWechsel.step1Link'), onClick: () => onNavigate('praemien') })
    ),

    // ── Schritt 2 — Neue Kasse, zwei ruhige Wege (anklickbar) ──
    React.createElement(AblaufStep, { palette, title: t('kvgWechsel.step2Title') },
      React.createElement('p', { style: s.stepText }, t('kvgWechsel.step2Intro')),
      React.createElement('label', { style: s.inputLabel },
        t('kvgWechsel.wunschKasseLabel'),
        React.createElement('input', {
          type: 'text', value: wunschKasse,
          onChange: (e) => setWunschKasse(e.target.value),
          placeholder: t('kvgWechsel.wunschKassePlaceholder'),
          style: s.input,
        })
      ),
      React.createElement('div', { style: s.pathWrap },
        pathCard('3a', t('kvgWechsel.path3aTitle'), t('kvgWechsel.path3aText'),
          React.createElement('div', { style: s.warn }, '⚠ ' + t('kvgWechsel.path3aWarn'))),
        pathCard('3b', t('kvgWechsel.path3bTitle'), t('kvgWechsel.path3bText'),
          React.createElement(React.Fragment, null,
            React.createElement('div', { style: s.reassure }, '✓ ' + t('kvgWechsel.path3bReassure')),
            React.createElement('div', { style: s.warn }, '⚠ ' + t('kvgWechsel.path3bCaveat'))
          ))
      ),
      React.createElement('div', { style: s.note }, 'ⓘ ' + t('kvgWechsel.uptakeReassure')),
      React.createElement('div', { style: s.note }, 'ⓘ ' + t('kvgWechsel.debtNote'))
    ),

    // ── Schritt 3 — Kündigung (passt sich dem gewählten Weg an) ──
    React.createElement(AblaufStep, { palette, title: t('kvgWechsel.step3Title') },
      chosenPath === '3b'
        ? React.createElement('p', { style: s.stepText }, t('kvgWechsel.step3Note3b'))
        : React.createElement('p', { style: s.stepText }, t('kvgWechsel.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kvgWechsel.step3Link'), onClick: () => onNavigate('briefe') })
    ),

    // ── Schritt 4 — Frist sichern ──
    React.createElement(AblaufStep, { palette, title: t('kvgWechsel.step4Title') },
      React.createElement('p', { style: s.stepText }, t('kvgWechsel.step4Text', { year: deadlineYear })),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('kvgWechsel.step4Button', { date: '30.11.' + deadlineYear }),
        doneLabel: t('kvgWechsel.step4Done'),
        calendarLabel: t('kvgWechsel.step4CalendarLink'),
        onNavigate,
        reminder: {
          title: target ? t('kvgWechsel.reminderTitleTo', { insurer: target }) : t('kvgWechsel.reminderTitle'),
          dueDate: deadline,
          category: 'insurance',
          recurrence: 'yearly',
          notes: t('kvgWechsel.reminderNotes'),
        },
        // Rücklink zum Vergleich in die Merkliste — damit man die Wunsch-Kasse wiederfindet.
        onSaved: () => addTodo({ text: t('kvgWechsel.todoText'), link: 'praemien' }),
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kvgWechsel.policeLink'), onClick: () => onNavigate('unterlagen') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusatzWechsel.title'), onClick: () => onNavigate('zusatzwechsel') })
    ),

    // ── Fuss — Sonderkündigungsrecht + lokal-Hinweis ──
    React.createElement(AblaufFooter, { palette, notes: [t('kvgWechsel.specialRight'), t('trust.localOnly')] })
  );
};

export default KVGWechsel;
