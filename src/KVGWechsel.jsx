import React, { useState } from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { addReminder } from './utils/reminders.js';

// KVG-Wechsel — der erste geführte Ablauf ("Faden"). Verkettet die vorhandenen
// Bausteine zu einem ruhigen Weg: Vergleich → neue Kasse (zwei Wege, anklickbar)
// → Kündigung → Frist sichern. Keine Wizard-Hölle: eine editoriale Seite, von oben
// nach unten. Wird beim 2. Ablauf zur wiederverwendbaren Ablauf-Schale extrahiert.

// Nächster ordentlicher Kündigungstermin: 30. November (dieses Jahr, sonst nächstes).
const nextNov30 = () => {
  const now = new Date();
  const year = now.getFullYear();
  const nov30 = new Date(year, 10, 30);
  const y = now <= nov30 ? year : year + 1;
  return `${y}-11-30`;
};

export const KVGWechsel = ({ palette, t, data, onNavigate }) => {
  const [reminderSet, setReminderSet] = useState(false);
  const [chosenPath, setChosenPath] = useState(null); // null | '3a' | '3b'

  const currentInsurer = data?.versicherungen?.kkInsurer || '';
  const deadline = nextNov30();
  const deadlineYear = deadline.slice(0, 4);

  const s = {
    h2: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: space.lg + 'px' },
    stepTitle: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, margin: space.lg + 'px 0 ' + space.xs + 'px 0' },
    stepText: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed },
    link: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sand, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.sm + 'px' },
    pathWrap: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', marginTop: space.sm + 'px' },
    note: { fontSize: text.sm, color: palette.mid, marginTop: space.sm + 'px' },
    reassure: { fontSize: text.sm, color: palette.sage, fontWeight: weight.medium, marginTop: space.xs + 'px' },
    warn: { fontSize: text.sm, color: palette.gold, marginTop: space.xs + 'px' },
    primaryBtn: { background: palette.sand, color: palette.surface, border: 'none', cursor: 'pointer', padding: '10px 16px', fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.semi, borderRadius: radius.sm, marginTop: space.sm + 'px' },
    done: { fontSize: text.sm, color: palette.sage, fontWeight: weight.medium, marginTop: space.sm + 'px' },
    footer: { fontSize: text.xs, color: palette.soft, marginTop: space.xl + 'px', lineHeight: leading.normal },
    chosenBadge: { fontSize: text.xs, fontWeight: weight.semi, color: palette.sand, marginTop: '6px' },
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

  const handleSetReminder = () => {
    addReminder({
      title: t('kvgWechsel.reminderTitle'),
      dueDate: deadline,
      category: 'insurance',
      recurrence: 'yearly',
      notes: t('kvgWechsel.reminderNotes'),
    });
    setReminderSet(true);
  };

  return React.createElement('div', { style: { maxWidth: '560px' } },

    React.createElement('h2', { style: s.h2 },
      React.createElement(Icon, { name: 'insurance', size: 20 }), t('kvgWechsel.title')),
    React.createElement('p', { style: s.intro }, t('kvgWechsel.intro')),

    // ── Schritt 1 — Lohnt sich's? ──
    React.createElement('h3', { style: s.stepTitle }, t('kvgWechsel.step1Title')),
    React.createElement('p', { style: s.stepText },
      currentInsurer
        ? t('kvgWechsel.step1TextKnown', { insurer: currentInsurer })
        : t('kvgWechsel.step1Text')),
    onNavigate && React.createElement('button', { style: s.link, onClick: () => onNavigate('praemien') },
      '→ ' + t('kvgWechsel.step1Link')),

    // ── Schritt 2 — Neue Kasse, zwei ruhige Wege (anklickbar) ──
    React.createElement('h3', { style: s.stepTitle }, t('kvgWechsel.step2Title')),
    React.createElement('p', { style: s.stepText }, t('kvgWechsel.step2Intro')),
    React.createElement('div', { style: s.pathWrap },
      pathCard('3a', t('kvgWechsel.path3aTitle'), t('kvgWechsel.path3aText'),
        React.createElement('div', { style: s.warn }, '⚠ ' + t('kvgWechsel.path3aWarn'))),
      pathCard('3b', t('kvgWechsel.path3bTitle'), t('kvgWechsel.path3bText'),
        React.createElement('div', { style: s.reassure }, '✓ ' + t('kvgWechsel.path3bReassure')))
    ),
    React.createElement('div', { style: s.note }, 'ⓘ ' + t('kvgWechsel.uptakeReassure')),

    // ── Schritt 3 — Kündigung (passt sich dem gewählten Weg an) ──
    React.createElement('h3', { style: s.stepTitle }, t('kvgWechsel.step3Title')),
    chosenPath === '3b'
      ? React.createElement('p', { style: s.stepText }, t('kvgWechsel.step3Note3b'))
      : React.createElement('p', { style: s.stepText }, t('kvgWechsel.step3Text')),
    onNavigate && React.createElement('button', { style: s.link, onClick: () => onNavigate('briefe') },
      '→ ' + t('kvgWechsel.step3Link')),

    // ── Schritt 4 — Frist sichern ──
    React.createElement('h3', { style: s.stepTitle }, t('kvgWechsel.step4Title')),
    React.createElement('p', { style: s.stepText }, t('kvgWechsel.step4Text', { year: deadlineYear })),
    reminderSet
      ? React.createElement('div', null,
          React.createElement('div', { style: s.done }, '✓ ' + t('kvgWechsel.step4Done')),
          onNavigate && React.createElement('button', { style: s.link, onClick: () => onNavigate('calendar') },
            '→ ' + t('kvgWechsel.step4CalendarLink'))
        )
      : React.createElement('button', { style: s.primaryBtn, onClick: handleSetReminder },
          t('kvgWechsel.step4Button', { date: '30.11.' + deadlineYear })),
    onNavigate && React.createElement('button', { style: s.link, onClick: () => onNavigate('unterlagen') },
      '→ ' + t('kvgWechsel.policeLink')),

    // ── Fuss — Sonderkündigungsrecht + lokal-Hinweis ──
    React.createElement('div', { style: s.footer },
      'ⓘ ' + t('kvgWechsel.specialRight'),
      React.createElement('br'),
      'ⓘ ' + t('trust.localOnly')
    )
  );
};

export default KVGWechsel;
