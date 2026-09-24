import React, { useState } from 'react';
import Icons, { aufklappZeichen, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, leading, space, radius, shadow, ease, duration } from './config/tokens.js';

// ─── Berg-Detail — Fortschritt & Grundordnung (Schicht 1) ───────────────────
//
// Der Inhalt des zugeklappten Abschnitts «Fortschritt im Detail» auf dem Dashboard.
// Ausgelagert am 24.09.2026 (E36, 65-kB-Deckel): der Abschnitt ist beim ersten Bild
// geschlossen, sein Inhalt also nicht zu sehen — er muss darum nicht in der
// Startdatei liegen. Das Dashboard hängt ihn wie bisher sofort ein (nur hinter
// `Suspense`), das Stück lädt also gleich nach dem ersten Bild und liegt damit auch
// im Offline-Speicher. Inhalt und Verhalten unverändert aus Dashboard.jsx übernommen.

const hyphenStyle = { hyphens: 'auto', WebkitHyphens: 'auto', overflowWrap: 'break-word' };

// Die aufgeklappte «Ihre Grundordnung»: Pflicht-Felder, gruppiert nach Kapitel.
// Die Kapitel-Kopfzeile trägt das Kapitel-Icon als eigenes Kind (aria-hidden) —
// bis 24.09.2026 stand hier `f.chapterIcon + ' ' + f.chapterTitle`, und weil die
// Kapitel kein `icon`-Feld haben, las man «undefined Persönliche Basis».
export const GrundordnungFelder = ({ palette, fields, onSelectChapter }) => {
  let lastChapter = null;
  return fields.map((f, i) => {
    const showHeader = f.chapterTitle !== lastChapter;
    lastChapter = f.chapterTitle;
    const IconFn = Icons[f.chapterKey];
    return React.createElement(React.Fragment, { key: f.key },
      showHeader && React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: text.xs, color: palette.mid, fontWeight: weight.medium, marginTop: i > 0 ? '8px' : '2px', marginBottom: '2px' }
      },
        IconFn && React.createElement('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', width: '14px', height: '14px', flexShrink: 0 } }, IconFn()),
        React.createElement('span', null, f.chapterTitle)
      ),
      React.createElement('button', {
        onClick: () => onSelectChapter(f.chapterIdx),
        style: {
          display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
          padding: '5px 8px', background: 'none', border: 'none', borderRadius: radius.sm,
          cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs, color: palette.text,
          textAlign: 'left', transition: `background ${duration.fast}ms ${ease}`,
        },
        onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
        onMouseLeave: (e) => { e.currentTarget.style.background = 'none'; },
      },
        React.createElement('span', {
          style: { width: '16px', textAlign: 'center', color: f.done ? palette.sage : palette.soft, fontSize: '13px' }
        }, f.na ? '–' : hinweisZeichen(f.done ? 'check' : 'kaestchen', 12)),
        React.createElement('span', {
          style: { color: f.done ? palette.mid : palette.text }
        }, f.label)
      )
    );
  });
};

const FortschrittsKarte = ({ palette, t, chapters, chapterCompletions, chapterStatuses, chapterAccentColor, onSelectChapter, text, weight, space, radius, shadow, lang }) => {
  // K18: Kurzlabels statt der ausgeschriebenen Status — die Spalte ist schmal, 13px braucht Platz.
  const statusLabels = { leer: t('chapterStatus.leerShort'), begonnen: t('chapterStatus.begonnenShort'), grundordnung: t('chapterStatus.grundordnungShort'), vertieft: t('chapterStatus.vertieftShort') };
  const totalPct = chapters.length > 0 ? Math.round(chapterCompletions.reduce((a, b) => a + b, 0) / chapters.length) : 0;
  return React.createElement('div', {
    style: {
      marginBottom: space.xl, background: palette.surface,
      borderRadius: radius.md, border: '1px solid ' + palette.border + '88',
      boxShadow: shadow.sm, padding: '20px',
    }
  },
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.md }
    },
      React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
        t('fortschritt.title')
      ),
      React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } },
        totalPct + '%'
      )
    ),
    React.createElement('div', {
      style: { height: '4px', background: palette.border, borderRadius: '2px', marginBottom: space.lg, overflow: 'hidden' }
    },
      React.createElement('div', {
        style: { height: '100%', width: totalPct + '%', background: palette.sage, borderRadius: '2px', transition: `width ${duration.cinematic}ms ${ease}` }
      })
    ),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
      chapters.map((ch, idx) => {
        const pct = chapterCompletions[idx];
        const status = chapterStatuses[idx];
        const accent = chapterAccentColor[ch.key] || palette.sage;
        return React.createElement('button', {
          key: ch.key,
          onClick: () => onSelectChapter(idx),
          'aria-label': ch.title + ' — ' + pct + '%',
          style: {
            display: 'flex', alignItems: 'center', gap: space.sm + 2,
            padding: '10px 8px', background: 'transparent', border: 'none',
            borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit',
            color: palette.text, width: '100%', textAlign: 'left',
            transition: `background ${duration.fast}ms ${ease}`,
          },
          onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
          onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
        },
          (() => {
            // Icon (Chalet etc.) in der Ast-Farbe des Bereichs — Frucht nur am Baum.
            const IconFn = Icons[ch.key];
            return React.createElement('span', {
              style: { width: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: pct === 100 ? palette.sage : accent }
            }, IconFn ? React.createElement('div', { style: { width: '18px', height: '18px' } }, IconFn()) : React.createElement('span', { style: { fontSize: text.sm } }, ch.icon));
          })(),
          React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.medium, flex: '0 0 auto', minWidth: '90px' } }, ch.title),
          React.createElement('div', {
            style: { flex: 1, height: '6px', background: palette.border + '80', borderRadius: '3px', overflow: 'hidden', margin: '0 4px' }
          },
            React.createElement('div', {
              style: {
                height: '100%', width: pct + '%', borderRadius: '3px',
                background: pct === 100 ? palette.sage : pct > 0 ? accent : 'transparent',
                transition: `width ${duration.cinematic}ms ${ease}`,
              }
            })
          ),
          React.createElement('span', {
            style: { fontSize: text.xs, color: pct === 100 ? (palette.sageDeep || palette.sage) : palette.mid, fontWeight: weight.medium, width: '32px', textAlign: 'right', flexShrink: 0 }
          }, pct + '%'),
          React.createElement('span', {
            lang,
            style: { fontSize: text.xs, color: palette.soft, width: '92px', textAlign: 'right', flexShrink: 0, display: pct === 0 ? 'none' : 'block', ...hyphenStyle }
          }, statusLabels[status] || '')
        );
      })
    )
  );
};

export const BergDetail = ({ palette, t, chapters, chapterCompletions, chapterStatuses, chapterAccentColor, onSelectChapter, lang, mvo }) => {
  const [mvoExpanded, setMvoExpanded] = useState(false);
  return React.createElement(React.Fragment, null,
    React.createElement(FortschrittsKarte, { palette, t, chapters, chapterCompletions, chapterStatuses, chapterAccentColor, onSelectChapter, text, weight, space, radius, shadow, lang }),
      mvo.total > 0 && React.createElement('div', {
        style: {
          marginBottom: '28px', padding: '20px 24px',
          background: mvo.pct === 100 ? palette.sage + '12' : palette.surface,
          borderRadius: radius.md,
          border: '1px solid ' + (mvo.pct === 100 ? palette.sage + '40' : palette.border + '88'),
          boxShadow: shadow.sm,
          transition: `background ${duration.cinematic}ms ${ease}, border-color ${duration.cinematic}ms ${ease}`,
        }
      },
        React.createElement('button', {
          type: 'button',
          onClick: () => setMvoExpanded(!mvoExpanded),
          'aria-expanded': mvoExpanded,
          // aria-controls nur, solange das Ziel im DOM steht (es wird eingeklappt nicht gerendert).
          'aria-controls': mvoExpanded ? 'mvo-felder' : undefined,
          style: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
            // Polsterung statt padding:0 — die Zeile war 19 px hoch und lag damit unter
            // dem WCAG-2.2-AA-Mindestziel (2.5.8, 24x24). marginBottom ist um dieselben
            // 8 px gekürzt, damit der Rhythmus unverändert bleibt.
            background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', fontFamily: 'inherit',
            marginBottom: space.xs, color: palette.text,
          }
        },
          React.createElement('span', {
            style: { fontSize: text.sm, fontWeight: weight.semi }
          }, t('mvo.title')),
          React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            React.createElement('span', {
              // sage ist eine Flächenfarbe — als Text auf sage+'12' nur 4.0:1. sageDeep
              // ist die dafür gebaute Vordergrund-Variante (siehe constants.js).
              style: { fontSize: text.sm, fontWeight: weight.medium, color: mvo.pct === 100 ? (palette.sageDeep || palette.sage) : palette.mid }
            }, mvo.filled + '/' + mvo.total),
            React.createElement('span', {
              style: { fontSize: '10px', color: palette.mid, transition: `transform ${duration.fast}ms ${ease}`, transform: mvoExpanded ? 'rotate(180deg)' : 'rotate(0)' }
            }, aufklappZeichen(true))
          )
        ),
        React.createElement('div', {
          style: { width: '100%', height: '4px', background: palette.up, borderRadius: '2px', overflow: 'hidden', marginBottom: space.sm }
        },
          React.createElement('div', {
            style: {
              width: mvo.pct + '%', height: '100%',
              background: mvo.pct === 100 ? palette.sage : palette.sand,
              borderRadius: '2px',
              transition: `width ${duration.cinematic}ms ${ease}`,
            }
          })
        ),
        React.createElement('div', {
          style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
        }, mvo.pct === 100 ? t('mvo.complete') : mvo.pct === 0 ? t('mvo.empty') : t('mvo.progress')),

        mvoExpanded && React.createElement('div', {
          id: 'mvo-felder',
          style: { marginTop: space.md + 'px', display: 'flex', flexDirection: 'column', gap: '3px' }
        },
          React.createElement(GrundordnungFelder, { palette, fields: mvo.fields, onSelectChapter })
        )
      )
  );
};

export default BergDetail;
