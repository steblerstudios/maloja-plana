import React, { useState } from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { openPrintWindow } from './utils/helpers.js';
import { FragenAblauf } from './components/FragenAblauf.jsx';
import { FRAGEN_VA, vorlage, vorlageHtml, abweichendeVertretung } from './data/vorsorgeauftrag.js';

// Vorsorgeauftrag und Patientenverfügung — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

// 27.09.2026: dazu die Vorlage zum Abschreiben (data/vorsorgeauftrag.js, geprüft 27.09.) und der
// Testament-Wegweiser (Schritt 6) — Grundlage docs/design/vorsorge-dokumente-2026-09-27.md.
// Antworten unter notfall.vaAntworten.
export const Vorsorgeauftrag = ({ palette, t, chapters, onNavigate, data, onUpdateData, lang }) => {
  const [vorlageOffen, setVorlageOffen] = useState(false);
  const [antworten, setAntworten] = useState(() => data?.notfall?.vaAntworten || {});
  const setzen = (patch) => {
    const next = { ...antworten, ...patch };
    setAntworten(next);
    if (onUpdateData) onUpdateData('notfall', 'vaAntworten', next);
  };

  if (vorlageOffen) {
    const kopf = React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, margin: '0 0 ' + space.md + 'px' } }, t('va.ui.intro'));
    const vorschau = ({ zumAnfang, knopf }) => {
      const v = vorlage(antworten, data, t);
      const abweichend = abweichendeVertretung(antworten, data?.notfall?.pvAntworten);
      return React.createElement('div', null,
        React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.sm + 'px' } }, t('va.ui.vorschauTitel')),
        abweichend && React.createElement('p', { role: 'note', style: { fontSize: text.sm, color: palette.text, background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.sm, padding: '10px 12px', margin: '0 0 ' + space.sm + 'px', lineHeight: leading.normal } },
          hinweisZeichen(), t('va.ui.abweichend')),
        // C — Warnsatz, abgesetzt und als «nicht abschreiben» markiert
        React.createElement('div', { style: { border: '2px dashed ' + (palette.goldDeep || palette.sandDeep), borderRadius: radius.sm, padding: '10px 12px', margin: '0 0 ' + space.sm + 'px', fontSize: text.sm, color: palette.text, lineHeight: leading.normal } },
          React.createElement('strong', { style: { color: palette.text } }, t('va.vorlage.nichtAbschreiben')), ' ', t('va.vorlage.warnung')),
        // D — der Text zum Abschreiben
        React.createElement('div', { style: { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.sm, fontSize: text.body, color: palette.text, lineHeight: leading.relaxed } },
          React.createElement('div', { style: { fontSize: text.lg, marginBottom: space.sm + 'px', color: palette.text } }, t('va.doc.titel')),
          v.saetze.map((z, i) => React.createElement('p', { key: i, style: { margin: '0 0 ' + space.sm + 'px' } }, z))),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', marginTop: space.md + 'px' } },
          React.createElement('button', { type: 'button', style: knopf(true), onClick: () => openPrintWindow(vorlageHtml(antworten, data, t, lang)) },
            React.createElement(Icon, { name: 'document', size: 16, style: { verticalAlign: '-3px', marginRight: '6px' } }), t('va.ui.drucken')),
          React.createElement('button', { type: 'button', style: knopf(false), onClick: zumAnfang }, t('va.ui.aendern')),
          React.createElement('button', { type: 'button', style: knopf(false), onClick: () => setVorlageOffen(false) }, t('va.ui.zurueckZumWegweiser'))
        )
      );
    };
    return React.createElement(FragenAblauf, { palette, t, ns: 'va', fragen: FRAGEN_VA, antworten, setzen, titel: t('va.ui.title'), hinweis: t('va.ui.hinweis'), kopf, vorschau });
  }

  const s = ablaufStyles(palette);
  const chapterIdx = (key) => (chapters ? chapters.findIndex((ch) => ch.key === key) : -1);
  return React.createElement(AblaufContainer, {
    palette, icon: 'document',
    title: t('vorsorgeauftrag.title'),
    intro: t('vorsorgeauftrag.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step1Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step1Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step2Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step2Text')),
      React.createElement('p', { style: s.warn }, t('vorsorgeauftrag.step2Warn')),
      React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.vorlageLink'), onClick: () => setVorlageOffen(true) }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step2Link'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step3Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step4Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step4LinkPv'), onClick: () => onNavigate('patientenverfuegung') })
    ),
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step5Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step5LinkNotfall'), onClick: () => onNavigate('chapter', chapterIdx('notfall')) }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step5LinkPass'), onClick: () => onNavigate('notfallpass') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step5LinkDossier'), onClick: () => onNavigate('notfalldossier') })
    ),
    // Testament — nur Wegweiser, kein Generator (Rechtsprüfung 27.09.2026).
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step6Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step6Text')),
      React.createElement('p', { style: s.warn }, t('vorsorgeauftrag.step6Warn')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step6LinkBw'), onClick: () => onNavigate('bestattung') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('vorsorgeauftrag.quelle'), notes: [t('vorsorgeauftrag.footerNote'), t('trust.localOnly')] })
  );
};

export default Vorsorgeauftrag;
