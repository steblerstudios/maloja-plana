import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { getLetterTemplates, generateLetter } from './briefGenerator.js';
import { Icon } from './IconSystem.jsx';
import { text as textTokens, weight, radius , leading , space, ease, duration } from './config/tokens.js';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { openPrintWindow } from './utils/helpers.js';

// ISO-Datum → TT.MM.JJJJ für die Anzeige in der Beleg-Auswahl.
const fmtDate = (iso) => {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(iso);
};
const fmtAmount = (n) => {
  const num = Number(n);
  return isFinite(num) ? num.toLocaleString('de-CH') : String(n);
};

const BriefGenerator = ({ palette, t, data, onNavigate }) => {
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(false);
  const [printed, setPrinted] = useState(false);
  // Für den Reklamationsbrief: vom Nutzer gewählte Belege (kein Auto-Raten).
  const [belegIds, setBelegIds] = useState([]);
  // Geführter „was stimmt nicht"-Schritt: gewählte Beanstandungsgründe.
  const [reasons, setReasons] = useState([]);
  const REKLAMATION_GRUENDE = ['nichtErhalten', 'doppelt', 'falscherBetrag', 'franchiseSelbstbehalt', 'nichtGedeckt', 'falschePerson'];

  const templates = getLetterTemplates(t);
  const selectedTmpl = templates.find(tmpl => tmpl.key === selected);

  const kkBelege = Array.isArray(data?.versicherungen?.kkBelege) ? data.versicherungen.kkBelege : [];
  const reklamationBelege = selected === 'kkReklamation' ? kkBelege.filter(b => belegIds.includes(b.id)) : [];

  const handlePrint = () => {
    if (!selected) return;
    const html = generateLetter(selected, data, t, { belege: reklamationBelege, reasons });
    openPrintWindow(html);
    // Loop-Closure: nach dem Drucken ruhig zum Ablegen im Lebensordner führen
    setPrinted(true);
  };

  const previewHtml = selected ? generateLetter(selected, data, t, { belege: reklamationBelege, reasons }) : '';

  return React.createElement('div', {
    style: { maxWidth: '720px', margin: '0 auto' }
  },
    // Back button
    React.createElement('button', {
      onClick: () => onNavigate('unterlagen'),
      style: {
        background: 'none', border: 'none', color: palette.mid,
        fontSize: textTokens.sm, cursor: 'pointer', padding: '8px 0',
        marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px',
      }
    }, '← ' + t('briefe.backToUnterlagen')),

    // Title
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'document', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('briefe.title')),

    React.createElement('p', {
      style: { fontSize: textTokens.sm, color: palette.mid, marginBottom: '20px', lineHeight: '1.6' }
    }, t('briefe.intro')),

    // Template cards
    React.createElement('div', {
      style: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }
    },
      templates.map(tmpl => React.createElement('button', {
        key: tmpl.key,
        onClick: () => { setSelected(tmpl.key); setPreview(false); setPrinted(false); setBelegIds([]); setReasons([]); },
        style: {
          padding: '14px 16px', background: selected === tmpl.key ? palette.up : palette.surface,
          border: '1px solid ' + (selected === tmpl.key ? palette.sage : palette.border),
          borderRadius: radius.sm, cursor: 'pointer', textAlign: 'left',
          // Buttons erben color NICHT (UA-Reset auf schwarz) → im Dark Mode war der
          // Vorlagen-Titel unlesbar schwarz. Explizit auf palette.text setzen.
          color: palette.text,
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          transition: `border-color ${duration.normal}ms ${ease}`,
        }
      },
        React.createElement(Icon, { name: tmpl.icon, size: 20, color: selected === tmpl.key ? palette.sage : palette.mid }),
        React.createElement('div', null,
          React.createElement('div', {
            style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
          }, tmpl.title),
          React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal }
          }, tmpl.description),
          tmpl.legalRef && React.createElement('div', {
            style: { fontSize: textTokens.xs, color: palette.soft, marginTop: space.xs }
          }, tmpl.legalRef)
        )
      ))
    ),

    // Grund-Auswahl — geführter „was stimmt nicht"-Schritt: die gewählten Gründe
    // werden im Brief als klare Beanstandung ausformuliert (statt Platzhalter).
    selected === 'kkReklamation' && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.up, border: '1px solid ' + palette.border,
        borderRadius: radius.sm, marginBottom: space.md,
      }
    },
      React.createElement('div', {
        style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
      }, t('briefe.kkReasonPicker.title')),
      React.createElement('div', {
        style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.sm }
      }, t('briefe.kkReasonPicker.intro')),
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '8px' }
      },
        REKLAMATION_GRUENDE.map(g => React.createElement('label', {
          key: g,
          style: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: textTokens.sm, cursor: 'pointer', color: palette.text }
        },
          React.createElement('input', {
            type: 'checkbox',
            checked: reasons.includes(g),
            onChange: () => setReasons(rs => rs.includes(g) ? rs.filter(x => x !== g) : [...rs, g]),
            style: { marginTop: '3px', flexShrink: 0 },
          }),
          React.createElement('span', null, t('briefe.kkReklamation.reasons.' + g))
        ))
      )
    ),

    // Beleg-Auswahl — nur für den Reklamationsbrief: du wählst die strittigen
    // Belege, Datum + Betrag fliessen in den Brief (Fallback: leeres Gerüst).
    selected === 'kkReklamation' && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.up, border: '1px solid ' + palette.border,
        borderRadius: radius.sm, marginBottom: space.md,
      }
    },
      React.createElement('div', {
        style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
      }, t('briefe.kkBelegPicker.title')),
      React.createElement('div', {
        style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.sm }
      }, t('briefe.kkBelegPicker.intro')),
      kkBelege.length === 0
        ? React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, fontStyle: 'italic' }
          }, t('briefe.kkBelegPicker.empty'))
        : React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '8px' }
          },
            kkBelege.map(b => React.createElement('label', {
              key: b.id,
              style: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: textTokens.sm, cursor: 'pointer' }
            },
              React.createElement('input', {
                type: 'checkbox',
                checked: belegIds.includes(b.id),
                onChange: () => setBelegIds(ids => ids.includes(b.id) ? ids.filter(x => x !== b.id) : [...ids, b.id]),
              }),
              React.createElement('span', null,
                (fmtDate(b.datum) || t('briefe.kkBelegPicker.undated')) + ' · CHF ' + fmtAmount(b.betrag))
            ))
          )
    ),

    // Actions
    selected && React.createElement('div', {
      style: { display: 'flex', gap: space.sm, marginBottom: space.md }
    },
      React.createElement('button', {
        onClick: () => setPreview(!preview),
        style: {
          padding: '10px 16px', background: palette.up, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: textTokens.sm, fontWeight: weight.medium,
        }
      }, preview ? t('briefe.hidePreview') : t('briefe.showPreview')),
      React.createElement(PrimaryButton, { palette, onClick: handlePrint }, t('briefe.printLetter'))
    ),

    // Data status
    selected && React.createElement('div', {
      style: {
        padding: '10px 14px', background: palette.up, borderRadius: radius.sm,
        fontSize: textTokens.sm, color: palette.mid, lineHeight: '1.6',
        marginBottom: space.md,
      }
    }, 'ⓘ ' + t('briefe.dataNote')),

    // Loop-Closure: nach dem Drucken ruhig zum Ablegen im Lebensordner führen
    printed && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.sage + '14',
        border: '1px solid ' + palette.sage + '44', borderRadius: radius.sm,
        marginBottom: space.md, display: 'flex', flexDirection: 'column', gap: space.sm,
      }
    },
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'flex-start', gap: '10px' }
      },
        React.createElement(Icon, { name: 'document', size: 18, color: palette.sage }),
        React.createElement('div', null,
          React.createElement('div', {
            style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
          }, t('briefe.afterPrint.title')),
          React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal }
          }, t('briefe.afterPrint.text'))
        )
      ),
      React.createElement('button', {
        onClick: () => onNavigate('tresor', undefined, selectedTmpl?.chapter || 'all'),
        style: {
          alignSelf: 'flex-start', padding: '8px 14px', background: palette.surface,
          border: '1px solid ' + palette.sage + '66', borderRadius: radius.sm,
          cursor: 'pointer', fontSize: textTokens.sm, fontWeight: weight.medium,
          color: palette.text,
        }
      }, t('briefe.afterPrint.toTresor') + ' →')
    ),

    // Preview
    preview && previewHtml && React.createElement('div', {
      style: {
        border: '1px solid ' + palette.border, borderRadius: radius.sm,
        overflow: 'hidden', background: '#fff',
      }
    },
      React.createElement('iframe', {
        srcDoc: previewHtml,
        style: { width: '100%', height: '700px', border: 'none' },
        title: t('backup.letterPreview'),
      })
    ),
  );
};

export default BriefGenerator;
