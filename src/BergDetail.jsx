import React, { useState } from 'react';
import Icons, { aufklappZeichen, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, leading, space, radius, shadow, ease, duration } from './config/tokens.js';
import { linkStil } from './components/PrimaryButton.jsx';

// ─── Berg-Detail — Fortschritt & Grundordnung (Schicht 1) ───────────────────
//
// Die Fortschritts-Karte auf dem Dashboard (Kapitel-Fortschritt + Grundordnung).
// Ausgelagert am 24.09.2026 (E36, 65-kB-Deckel), damals als Inhalt eines zugeklappten
// Abschnitts. Seit 25.09.2026 steht die Karte offen; sie bleibt trotzdem ein eigenes
// Stück hinter `Suspense`, wie die Instrumente: gemessen 2,0 kB gzip, die das
// Hauptbundle (61,14 von 65 kB) nicht tragen muss.

const hyphenStyle = { hyphens: 'auto', WebkitHyphens: 'auto', overflowWrap: 'break-word' };

// Die Grundordnungs-Felder EINES Kapitels, als Liste unter seiner aufgeklappten Zeile.
// Jedes Feld führt ins Kapitel. Eine eigene Kapitel-Kopfzeile gibt es hier nicht mehr:
// die Kapitelzeile darüber ist der Kopf (Tester-Feedback 25.09.2026, s. u.).
export const GrundordnungFelder = ({ palette, fields, onSelectChapter }) =>
  fields.map((f) => React.createElement('button', {
    key: f.key,
    type: 'button',
    onClick: () => onSelectChapter(f.chapterIdx),
    style: {
      display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
      padding: '5px 8px', background: 'none', border: 'none', borderRadius: radius.md,
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
  ));

// Eine Kapitelzeile samt aufgeklappter Grundordnung. Ohne eigenen Zustand — ob sie
// offen ist, hält BergDetail; so lässt sie sich ohne DOM prüfen (vitest ohne jsdom).
export const KapitelZeile = ({ palette, t, ch, idx, pct, status, accent, statusLabels, lang, istOffen, onUmschalten, felder, onSelectChapter, zusammenfassung = null, instrument = null }) => {
  // Das Filtern gehört hierher, nicht an die Aufrufstelle: so prüft der Test es mit.
  const kapitelFelder = felder.filter((f) => f.chapterIdx === idx);
  const panelId = 'fortschritt-kapitel-' + ch.key;
  const IconFn = Icons[ch.key];
  return React.createElement('div', null,
    React.createElement('div', { style: { display: 'flex', alignItems: 'stretch', gap: '2px' } },
    // F7-D1: Die Zeile führt ins Kapitel, wie die Kapitel-Liste vorher. Der Pfeil daneben klappt die Grundordnung auf.
    React.createElement('button', {
      type: 'button',
      onClick: () => onSelectChapter(idx),
      'aria-label': ch.title + ' — ' + pct + '%' + (zusammenfassung ? '. ' + zusammenfassung : ''),
      style: {
        display: 'flex', alignItems: 'center', gap: space.sm + 2, flex: '1 1 0', minWidth: 0,
        padding: '10px 8px', background: istOffen ? palette.up : 'transparent', border: 'none',
        borderRadius: radius.md, cursor: 'pointer', fontFamily: 'inherit',
        color: palette.text, textAlign: 'left',
        transition: `background ${duration.fast}ms ${ease}`,
      },
      onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
      onMouseLeave: (e) => { e.currentTarget.style.background = istOffen ? palette.up : 'transparent'; },
    },
      // Icon (Chalet etc.) in der Ast-Farbe des Bereichs — Frucht nur am Baum.
      React.createElement('span', {
        'aria-hidden': 'true',
        style: { width: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: pct === 100 ? palette.sage : accent }
      }, IconFn ? React.createElement('span', { style: { display: 'block', width: '18px', height: '18px' } }, IconFn()) : null),
      // Titel, Balken und Status stehen untereinander, nicht nebeneinander: mit dem
      // Aufklapp-Pfeil passte die Zeile sonst am Handy (375 px) nicht mehr — die Seite
      // lief 97 px zu breit, danach brach «Versicherun-gen» mitten im Wort.
      React.createElement('span', { style: { flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', ...hyphenStyle } },
        React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, ch.title),
        // span statt div: im Knopf ist nur Phrasing-Inhalt gültig.
        React.createElement('span', {
          style: { display: 'block', height: '6px', background: palette.border + '80', borderRadius: radius.hair, overflow: 'hidden', margin: '5px 0 3px' }
        },
          React.createElement('span', {
            style: {
              display: 'block', height: '100%', width: pct + '%', borderRadius: radius.hair,
              background: pct === 100 ? palette.sage : pct > 0 ? accent : 'transparent',
              transition: `width ${duration.cinematic}ms ${ease}`,
            }
          })
        ),
        pct > 0 && statusLabels[status] && React.createElement('span', {
          lang,
          style: { fontSize: text.xs, color: palette.soft, marginTop: '1px' }
        }, statusLabels[status]),
        zusammenfassung && React.createElement('span', { style: { fontSize: text.xs, color: palette.sageDeep || palette.sage, lineHeight: leading.normal, marginTop: '2px' } }, zusammenfassung)
      ),
      React.createElement('span', {
        style: { fontSize: text.xs, color: pct === 100 ? (palette.sageDeep || palette.sage) : palette.mid, fontWeight: weight.medium, width: '32px', textAlign: 'right', flexShrink: 0 }
      }, pct + '%'),
    ),
    React.createElement('button', {
      type: 'button',
      onClick: onUmschalten,
      'aria-expanded': istOffen,
      // aria-controls nur, solange das Ziel im DOM steht (zugeklappt wird es nicht gerendert).
      'aria-controls': istOffen ? panelId : undefined,
      'aria-label': t('mvo.title') + ': ' + ch.title,
      style: { width: '44px', minHeight: '44px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: radius.md, cursor: 'pointer', color: palette.mid, fontFamily: 'inherit' },
    },
      React.createElement('span', { 'aria-hidden': 'true', style: { display: 'inline-flex' } }, aufklappZeichen(istOffen)))
    ),
    instrument,
    istOffen && React.createElement('div', {
      id: panelId,
      style: { display: 'flex', flexDirection: 'column', gap: '3px', padding: '4px 0 ' + space.sm + 'px 32px' }
    },
      React.createElement(GrundordnungFelder, { palette, fields: kapitelFelder, onSelectChapter }),
      React.createElement('button', {
        type: 'button',
        onClick: () => onSelectChapter(idx),
        'aria-label': ch.title + ': ' + t('dashboard.openChapter'),
        // Führt nur ins Kapitel: Link (Fassung 9, M2).
        style: { ...linkStil(palette), alignSelf: 'flex-start', marginTop: '4px', minHeight: '32px', fontSize: text.xs }
      }, t('dashboard.openChapter'))
    )
  );
};

// ─── Fortschritt + Grundordnung — eine Karte ────────────────────────────────
//
// Tester-Feedback 25.09.2026: «Ihr Fortschritt» und «Ihre Grundordnung» standen als
// zwei Karten übereinander, beide im zugeklappten Abschnitt «Detaillierter Fortschritt».
// Gewünscht: eine Karte, von Anfang an sichtbar, jedes Kapitel einzeln aufklappbar —
// und darin seine Grundordnungs-Felder. So ist es jetzt gebaut:
//   · Kopf: Gesamt-Fortschritt, darunter die Grundordnung als eine Zeile (x/15).
//   · Je Kapitel eine Zeile; ein Tipp klappt sie auf (aria-expanded).
//   · Aufgeklappt: die Grundordnungs-Felder dieses Kapitels, dann «Öffnen».
export const BergDetail = ({ palette, t, chapters, chapterCompletions, chapterStatuses, chapterAccentColor, onSelectChapter, lang, mvo, simpleView = false, zusammenfassung = () => null, instrumentFuer = () => null, gruppen = null }) => {
  const [offen, setOffen] = useState(() => new Set());
  const umschalten = (key) => setOffen((alt) => {
    const neu = new Set(alt);
    if (neu.has(key)) neu.delete(key); else neu.add(key);
    return neu;
  });
  // K18: Kurzlabels statt der ausgeschriebenen Status — die Spalte ist schmal, 13px braucht Platz.
  const statusLabels = { leer: t('chapterStatus.leerShort'), begonnen: t('chapterStatus.begonnenShort'), grundordnung: t('chapterStatus.grundordnungShort'), vertieft: t('chapterStatus.vertieftShort') };
  const totalPct = chapters.length > 0 ? Math.round(chapterCompletions.reduce((a, b) => a + b, 0) / chapters.length) : 0;
  const felder = mvo.fields || [];
  return React.createElement('div', {
    style: {
      marginBottom: space.xl, background: palette.surface,
      borderRadius: radius.lg, border: '1px solid ' + palette.border + '88',
      boxShadow: shadow.sm, padding: '20px',
    }
  },
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.md }
    },
      // h3 wie die übrigen Dashboard-Abschnitte — der Seitentitel darüber ist h2.
      React.createElement('h3', { style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
        t('fortschritt.title')
      ),
      React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } },
        totalPct + '%'
      )
    ),
    React.createElement('div', {
      style: { height: '4px', background: palette.border, borderRadius: radius.hair, marginBottom: space.md, overflow: 'hidden' }
    },
      React.createElement('div', {
        style: { height: '100%', width: totalPct + '%', background: palette.sage, borderRadius: radius.hair, transition: `width ${duration.cinematic}ms ${ease}` }
      })
    ),
    // Die Grundordnung als eine Zeile — vorher eine eigene Karte mit eigenem Balken.
    mvo.total > 0 && React.createElement('div', {
      style: { marginBottom: space.md, fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed }
    },
      React.createElement('span', { style: { fontWeight: weight.semi, color: palette.text } }, t('mvo.title')),
      ' ',
      React.createElement('span', {
        // sage ist eine Flächenfarbe — als Text zu schwach; sageDeep ist die Vordergrund-Variante.
        style: { fontWeight: weight.medium, color: mvo.pct === 100 ? (palette.sageDeep || palette.sage) : palette.mid }
      }, mvo.filled + '/' + mvo.total),
      React.createElement('div', null,
        mvo.pct === 100 ? t('mvo.complete') : mvo.pct === 0 ? t('mvo.empty') : t('mvo.progress'))
    ),
    // Die Gruppen der früheren Kapitel-Liste (Stebler Studios 01.11.2026). Ohne `gruppen` eine einzige Liste.
    (gruppen || [{ kapitel: chapters.map((_, i) => i) }]).map((g, gi) => React.createElement('div', { key: gi, style: { marginTop: gi ? space.lg + 'px' : 0 } },
    g.titel && React.createElement('h4', { style: { margin: '0 0 ' + space.xs + 'px', padding: '0 8px', fontSize: text.xs, fontWeight: weight.medium, color: palette.mid, letterSpacing: '0.4px' } }, g.titel),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
      g.kapitel.filter((idx) => chapters[idx]).map((idx) => { const ch = chapters[idx]; return React.createElement(KapitelZeile, {
        key: ch.key, palette, t, ch, idx, lang, statusLabels, onSelectChapter,
        pct: chapterCompletions[idx],
        status: chapterStatuses[idx],
        accent: chapterAccentColor[ch.key] || palette.sage,
        istOffen: offen.has(ch.key),
        onUmschalten: () => umschalten(ch.key),
        felder,
        zusammenfassung: !simpleView && chapterStatuses[idx] !== 'leer' ? zusammenfassung(ch.key) : null,
        instrument: simpleView ? null : instrumentFuer(ch.key),
      }); })
    )))
  );
};

export default BergDetail;
