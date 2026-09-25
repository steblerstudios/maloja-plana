import React, { useRef, useEffect, useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { qrNotfallVcard, qrZeichnen, QR_MAX_BYTES_VCARD } from './utils/qrSicher.js';
import { getFullName } from './config/constants.js';
import { Icon, hinweisZeichen, zurueckZeichen } from './IconSystem.jsx';
import { getNotfallDossierPreview, generateNotfallDossier, notfallQrAbschnitte } from './dossierGenerator.js';
import { text, weight, radius , leading , space } from './config/tokens.js';
import { openPrintWindow } from './utils/helpers.js';
import { PrimaryButton } from './components/PrimaryButton.jsx';

export const NotfallDossier = ({ palette, t, data, chapters, onNavigate }) => {

  const preview = getNotfallDossierPreview(data, chapters, t);
  const hasSections = preview.sections.length > 0;

  // Offline-Nutzlast für den QR — als vCard, nicht als Klartext.
  //
  // Gemessen am 22.09.2026 an zwei Versuchsreihen: die normale iPhone-Kamera LIEST den
  // Klartext-Code und meldet «no usable data found» — sie kann mit einer Nutzlast ohne
  // Handlung nichts anfangen. Drei Klartext-Codes scheiterten, zwei Adress-Codes gingen;
  // Dichte und Fläche sind als Ursache ausgeschieden. Eine vCard zeigt dieselbe Kamera mit
  // allen Angaben an — ohne Netz, ohne Server, die Daten bleiben auf dem Gerät.
  //
  // K80: in UTF-8-Bytes gekürzt (ein Umlaut zählt doppelt). Reihenfolge im Code: Medizin zuerst
  // (Entscheid Stebler Studios, 17.09.2026) — das gedruckte Dossier bleibt in seiner Reihenfolge.
  // Was nicht hineinpasst, nennt der Code am Ende selbst.
  // K123: nur Felder aus NOTFALL_QR_FELDER — die AHV-Nummer bleibt auf dem Papier, nicht im Code.
  const qrAbschnitte = notfallQrAbschnitte(preview.sections);

  // Die Notfallnummer steht zusätzlich in einem eigenen TEL-Feld: auf der Kontaktkarte ist
  // sie damit WÄHLBAR statt abzutippen.
  // 🛑 Die Zeile bleibt trotzdem in der Notiz (Vorab-Prüfung 24.09.2026): N/FN tragen den
  // Namen der Person, TEL aber die Nummer der KONTAKTPERSON. Ohne die Zeile «Telefon Notfall:
  // …» neben «Notfall-Kontaktperson: …» stünde die Nummer unbeschriftet unter dem falschen
  // Namen — in einem Notfallausweis eine falsche Zuordnung. Kostet rund 30 Byte; die
  // Medizin steht zuerst, und was nicht mehr passt, nennt der Code am Ende selbst.
  const notfallNummer = String(data?.notfall?.emergencyPhone ?? '').trim();

  const { text: qrText, gekuerzt: qrGekuerzt } = qrNotfallVcard(qrAbschnitte, {
    fehltTitel: t('notfallDossier.qrNichtEnthalten'),
    name: getFullName(data?.basis) || t('notfallDossier.qrTitle'),
    tel: notfallNummer,
  });

  const qrBeschriftung = t('notfallDossier.qrTitle');
  const qrRef = useRef(null);
  // 'ok' | 'fehler' — bei 'fehler' bleibt die Fläche weg und ein Hinweis steht da.
  const [qrStatus, setQrStatus] = useState('ok');
  useEffect(() => {
    if (!hasSections || !qrRef.current) return;
    const gezeichnet = qrZeichnen(qrRef.current, qrText, {
      maxBytes: QR_MAX_BYTES_VCARD,
      width: 180, height: 180,
      colorDark: '#1a1a1a', colorLight: '#ffffff',
      beschriftung: qrBeschriftung,
    });
    setQrStatus(gezeichnet ? 'ok' : 'fehler');
  }, [qrText, hasSections, qrBeschriftung]);

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
    }, zurueckZeichen(), t('notfallDossier.back')),

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
    }, hinweisZeichen(), t('notfallDossier.privacyNote')),

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
      // Fehler entsteht erst nach dem ersten Render → Live-Region. Die Kürzung steht schon beim
      // ersten Render da und würde nicht angesagt → normaler Absatz (Deploy-Gate 0.1.36, a11y).
      qrStatus === 'fehler' && React.createElement('p', {
        role: 'status',
        style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: '0' }
      }, t('notfallDossier.qrFehler')),
      qrStatus !== 'fehler' && qrGekuerzt && React.createElement('p', {
        style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: '10px 0 0' }
      }, t('notfallDossier.qrGekuerzt')),
      // Zweiter Ausgang derselben Angaben: der Notfallpass auf dem Telefon (Entscheid 22.09.2026).
      React.createElement('button', {
        type: 'button',
        onClick: () => onNavigate('notfallpass'),
        style: {
          background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: '12px 0 0',
          fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium,
        },
      }, t('notfallpass.dossierVerweis'))
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
    }, hinweisZeichen(), t('notfallDossier.footerPrivacy'))
  );
};

export default NotfallDossier;
