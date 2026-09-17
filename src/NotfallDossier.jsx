import React, { useRef, useEffect, useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { qrKuerzen, qrZeichnen } from './utils/qrSicher.js';
import { Icon } from './IconSystem.jsx';
import { getNotfallDossierPreview, generateNotfallDossier } from './dossierGenerator.js';
import { text, weight, radius , leading , space } from './config/tokens.js';
import { openPrintWindow } from './utils/helpers.js';
import { PrimaryButton } from './components/PrimaryButton.jsx';

export const NotfallDossier = ({ palette, t, data, chapters, onNavigate }) => {

  const preview = getNotfallDossierPreview(data, chapters, t);
  const hasSections = preview.sections.length > 0;

  // Compact, offline emergency payload for the QR (first responders scan → read plain text).
  // K80: in UTF-8-Bytes gekürzt (ein Umlaut zählt doppelt), an Zeilengrenzen, mit «…» am Ende.
  const qrVoll = preview.sections
    .map(s => s.title + ':\n' + s.rows.map(r => '  ' + r.label + ': ' + r.value).join('\n'))
    .join('\n');
  const { text: qrText, gekuerzt: qrGekuerzt } = qrKuerzen(qrVoll);

  const qrRef = useRef(null);
  // 'ok' | 'fehler' — bei 'fehler' bleibt die Fläche weg und ein Hinweis steht da.
  const [qrStatus, setQrStatus] = useState('ok');
  useEffect(() => {
    if (!hasSections || !qrRef.current) return;
    const gezeichnet = qrZeichnen(qrRef.current, qrText, {
      width: 180, height: 180,
      colorDark: '#1a1a1a', colorLight: '#ffffff',
    });
    setQrStatus(gezeichnet ? 'ok' : 'fehler');
  }, [qrText, hasSections]);

  // Export-Vorschau (K3): erst zeigen, was im Dokument steht, dann öffnen.
  const [vorschau, setVorschau] = useState(false);

  const handlePrint = () => {
    const html = generateNotfallDossier(data, chapters, t);
    openPrintWindow(html);
  };

  const renderSection = (section) =>
    React.createElement('div', {
      key: section.key,
      style: {
        padding: '14px 16px',
        background: palette.up,
        borderRadius: radius.sm,
        marginBottom: space.sm,
      }
    },
      React.createElement('div', {
        style: {
          fontSize: text.sm, fontWeight: weight.semi, color: palette.text,
          marginBottom: space.sm, letterSpacing: '0.2px',
        }
      }, section.title),
      ...section.rows.map((row, i) =>
        React.createElement('div', {
          key: i,
          style: {
            display: 'flex', justifyContent: 'space-between',
            padding: '3px 0', fontSize: text.sm,
            borderBottom: i < section.rows.length - 1 ? '1px solid ' + palette.border : 'none',
          }
        },
          React.createElement('span', { style: { color: palette.mid } }, row.label),
          React.createElement('span', { style: { fontWeight: weight.medium, textAlign: 'right', maxWidth: '55%' } }, row.value)
        )
      )
    );

  const renderEmpty = () =>
    React.createElement('div', {
      style: {
        padding: '32px 20px', textAlign: 'center',
        background: palette.up, borderRadius: radius.sm,
        border: '1px solid ' + palette.border,
      }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' }
      }, t('notfallDossier.empty'))
    );

  return React.createElement('div', {
    style: { maxWidth: '520px' }
  },

    React.createElement('button', {
      onClick: () => onNavigate('unterlagen'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        color: palette.mid, fontSize: text.sm, padding: '0 0 16px 0',
        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: space.xs,
      }
    }, '← ' + t('notfallDossier.back')),

    React.createElement('div', {
      style: {
        background: palette.surface, padding: '24px 20px', borderRadius: radius.sm,
        border: '1px solid ' + palette.border, marginBottom: '20px',
      }
    },
      React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'emergency', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('notfallDossier.title')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: '14px' }
      }, t('notfallDossier.subtitle')),

      hasSections && React.createElement('div', {
        style: { display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: text.sm, color: palette.soft }
      },
        React.createElement('span', null, t('notfallDossier.sectionsIncluded', { count: preview.sections.length })),
        preview.emptySections.length > 0 &&
          React.createElement('span', null, t('notfallDossier.sectionsMissing', { count: preview.emptySections.length }))
      )
    ),

    React.createElement('div', {
      style: {
        padding: '10px 14px', marginBottom: space.md,
        background: palette.up, borderRadius: radius.sm,
        fontSize: text.sm, color: palette.mid, lineHeight: leading.normal,
      }
    }, 'ⓘ ' + t('notfallDossier.privacyNote')),

    hasSections && React.createElement(PrimaryButton, {
      palette, onClick: () => setVorschau(true),
      style: { width: '100%', padding: '12px', marginBottom: vorschau ? 0 : '20px' },
    }, t('notfallDossier.printAction')),
    hasSections && vorschau && React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement(ExportVorschau, {
        palette, t, art: 'dossier',
        quelle: { abschnitte: preview.sections.map(s => ({ titel: s.title, felder: s.rows.filter(r => !r.platzhalter).map(r => r.label) })) },
        onWeiter: () => { setVorschau(false); handlePrint(); },
        onZurueck: () => setVorschau(false),
      })
    ),

    hasSections && React.createElement('div', {
      style: {
        background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm,
        padding: '16px', marginBottom: '20px', textAlign: 'center',
      }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' }
      }, t('notfallDossier.qrTitle')),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }
      }, t('notfallDossier.qrHint')),
      React.createElement('div', {
        ref: qrRef,
        style: {
          display: qrStatus === 'fehler' ? 'none' : 'inline-block',
          padding: '10px', background: '#ffffff', borderRadius: radius.sm,
        },
      }),
      (qrStatus === 'fehler' || qrGekuerzt) && React.createElement('p', {
        role: 'status',
        style: {
          fontSize: text.xs, color: palette.mid, lineHeight: leading.normal,
          margin: qrStatus === 'fehler' ? '0' : '10px 0 0',
        }
      }, t(qrStatus === 'fehler' ? 'notfallDossier.qrFehler' : 'notfallDossier.qrGekuerzt'))
    ),

    hasSections && React.createElement('div', {
      style: { fontSize: text.sm, color: palette.soft, marginBottom: '12px' }
    }, t('notfallDossier.previewNote')),

    hasSections
      ? preview.sections.map(renderSection)
      : renderEmpty(),

    React.createElement('div', {
      style: {
        marginTop: space.md, fontSize: text.xs, color: palette.soft, lineHeight: '1.4',
      }
    }, 'ⓘ ' + t('notfallDossier.footerPrivacy'))
  );
};

export default NotfallDossier;
