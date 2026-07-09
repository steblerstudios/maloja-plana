import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Pensionierung — geführter Ablauf für den Übergang in den Ruhestand. Ruhige Orientierung
// mit den Dingen, die NICHT automatisch laufen: AHV anmelden (Rente kommt nicht von selbst),
// Pensionskasse Rente/Kapital entscheiden, 3. Säule gestaffelt beziehen, EL prüfen +
// leise Brücke zum Lebenszustand „Pensioniert / im AHV-Alter" (bündelt IPV, HE, SERAFE,
// Steuerabzüge). Kein Rat — Orientierung. Wenn das Geburtsdatum erfasst ist, rechnen wir
// die AHV-Anmelde-Erinnerung ~6 Monate vor dem Referenzalter 65 (nur wenn noch in der Zukunft).

export const Pensionierung = ({ palette, t, data, onNavigate }) => {
  const s = ablaufStyles(palette);
  const dob = (data?.basis?.dateOfBirth || '').trim();
  let ahvReminder = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    const r = new Date(dob + 'T00:00:00');
    r.setFullYear(r.getFullYear() + 65);   // Referenzalter 65
    r.setDate(r.getDate() - 180);          // ~6 Monate vorher anmelden
    const iso = `${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, '0')}-${String(r.getDate()).padStart(2, '0')}`;
    if (iso >= inDays(0)) ahvReminder = iso;
  }

  return React.createElement(AblaufContainer, {
    palette, icon: 'vorsorge',
    title: t('pensionierung.title'),
    intro: t('pensionierung.intro'),
  },
    // Schritt 1 — AHV-Altersrente anmelden (kommt nicht automatisch)
    React.createElement(AblaufStep, { palette, title: t('pensionierung.step1Title') },
      React.createElement('p', { style: s.stepText }, t('pensionierung.step1Text')),
      ahvReminder && React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('pensionierung.step1Button', { date: formatDE(ahvReminder) }),
        doneLabel: t('pensionierung.step1Done'),
        calendarLabel: t('pensionierung.step1CalendarLink'),
        onNavigate,
        reminder: {
          title: t('pensionierung.reminderTitle'),
          dueDate: ahvReminder,
          category: 'admin',
          recurrence: 'once',
        },
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pensionierung.step1Link'), onClick: () => onNavigate('vorsorge') })
    ),

    // Schritt 2 — Pensionskasse: Rente oder Kapital
    React.createElement(AblaufStep, { palette, title: t('pensionierung.step2Title') },
      React.createElement('p', { style: s.stepText }, t('pensionierung.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pensionierung.step2Link'), onClick: () => onNavigate('vorsorge') })
    ),

    // Schritt 3 — 3. Säule beziehen (gestaffelt = Steuern sparen)
    React.createElement(AblaufStep, { palette, title: t('pensionierung.step3Title') },
      React.createElement('p', { style: s.stepText }, t('pensionierung.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pensionierung.step3Link'), onClick: () => onNavigate('vorsorge') })
    ),

    // Schritt 4 — Ergänzungsleistungen prüfen (Anspruch, kein Almosen) + Brücke zum
    // andauernden Lebenszustand „Pensioniert / im AHV-Alter" (bündelt IPV, HE, SERAFE …)
    React.createElement(AblaufStep, { palette, title: t('pensionierung.step4Title'), icon: 'ergaenzungsleistungen' },
      React.createElement('p', { style: s.stepText }, t('pensionierung.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pensionierung.step4Link'), onClick: () => onNavigate('sozialhilfe') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pensionierung.step4LinkSituation'), onClick: () => onNavigate('situationen') })
    ),

    // Schritt 5 — Kosten im Alter (Orientierung, kein Rechner): wer zahlt was bei
    // Pflege zu Hause/Heim + Auffangnetze (EL, Hilflosenentschädigung, Hilfsmittel);
    // Pro Senectute als kostenlose Beratung. Bewusst OHNE EL-Icon (das bleibt dem
    // EL-Schwerpunkt-Schritt 4 vorbehalten).
    React.createElement(AblaufStep, { palette, title: t('pensionierung.step5Title') },
      React.createElement('p', { style: s.stepText }, t('pensionierung.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pensionierung.step5Link'), onClick: () => onNavigate('vorsorge') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pensionierung.step5LinkSituation'), onClick: () => onNavigate('situationen') }),
      React.createElement('a', { href: 'https://www.prosenectute.ch/', target: '_blank', rel: 'noopener noreferrer', style: { ...s.link, textDecoration: 'none' } }, '→ ' + t('pensionierung.step5LinkProSenectute') + ' ↗')
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('pensionierung.footerEarly'), t('trust.localOnly')] })
  );
};

export default Pensionierung;
