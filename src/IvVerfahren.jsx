import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusTage } from './utils/fristen.js';
import { inDays, formatDE } from './utils/helpers.js';
import { HilflosenRechner } from './HilflosenRechner.jsx';

// Krankheit & IV — geführter Ablauf bei längerer Arbeitsunfähigkeit/Einschränkung.
// Mit reduzierter Energie lesbar: Lohn & Taggeld, IV früh anmelden (Eingliederung vor
// Rente), Existenz sichern (EL/IPV/Sozialhilfe = Anspruch, kein Almosen), Entlastung.
// Kein Rat — Orientierung, keine Rechts- oder Medizinberatung.

export const IvVerfahren = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const deadline = inDays(30); // IV-Anmeldung früh prüfen (Orientierung, kein fixes Datum)

  return React.createElement(AblaufContainer, {
    palette, t, onNavigate, ablauf: 'iv', icon: 'ereignisIv',
    title: t('iv.title'),
    intro: t('iv.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('iv.step1Title') },
      React.createElement('p', { style: s.stepText }, t('iv.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('iv.step1Link'), onClick: () => onNavigate('unfallkrankheit') })
    ),
    React.createElement(AblaufStep, { palette, title: t('iv.step2Title') },
      React.createElement('p', { style: s.stepText }, t('iv.step2Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('iv.step2Button', { date: formatDE(deadline) }),
        doneLabel: t('iv.step2Done'),
        calendarLabel: t('iv.step2CalendarLink'),
        onNavigate,
        reminder: { title: t('iv.reminderTitle'), dueDate: deadline, category: 'admin', recurrence: 'once' },
      })
    ),
    React.createElement(AblaufStep, { palette, title: t('iv.step3Title'), icon: 'ergaenzungsleistungen' },
      React.createElement('p', { style: s.stepText }, t('iv.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('iv.step3Link'), onClick: () => onNavigate('ergaenzungsleistungen') })
    ),
    // Hilflosenentschädigung — eigener Schritt mit Rechner (auf «iv» zeigen die HE-Hinweise der
    // Lebenssituationen; bis 26.10.2026 stand hier nichts dazu, die Links führten ins Leere).
    React.createElement(AblaufStep, { palette, title: t('iv.stepHeTitle'), icon: 'ergaenzungsleistungen' },
      React.createElement('p', { style: s.stepText }, t('iv.stepHeText')),
      React.createElement(HilflosenRechner, { palette, t })
    ),
    // Kapitel 7, L6 (10.11.2026): der Rechtsweg. Einwände zum Vorbescheid innert 30 Tagen (IVG Art. 57a Abs. 3),
    // gegen die Verfügung direkt Beschwerde ans kantonale Versicherungsgericht, keine Einsprache (IVG Art. 69 Abs. 1
    // Bst. a, ATSG Art. 60). Die Frist rechnet ab dem Tag, an dem der Vorbescheid ankam
    // (ATSG Art. 38 Abs. 1: Beginn am Folgetag, also Erhalt + 30); fällt das Ende auf ein Wochenende, gibt das Gesetz
    // mehr Zeit (Abs. 3) — angezeigt wird nie ein späterer Tag.
    React.createElement(AblaufStep, { palette, title: t('iv.stepRechtTitle') },
      React.createElement('p', { style: s.stepText }, t('iv.stepRechtText')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'iv-vorbescheid', frist: (d) => plusTage(d, 30),
        labelKey: 'iv.stepRechtLabel', hinweisKey: 'iv.stepRechtHinweis', vorbeiKey: 'iv.stepRechtVorbei',
        art: 'frist', buttonKey: 'iv.stepRechtButton', doneKey: 'iv.step2Done', calendarKey: 'iv.step2CalendarLink',
        reminderTitle: t('iv.stepRechtReminder'), category: 'admin',
      })
    ),
    React.createElement(AblaufStep, { palette, title: t('iv.step4Title') },
      React.createElement('p', { style: s.stepText }, t('iv.step4Text'))
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('iv.quelle'), notes: [t('iv.footerNote'), t('trust.localOnly')] })
  );
};

export default IvVerfahren;
