import React, { useState, useLayoutEffect, useCallback } from 'react';
import { text, weight, radius, leading, space, fontFamily, ease, duration } from './config/tokens.js';

// ─── Tour ──────────────────────────────────────────────────
// Kleine, ruhige Tour nach dem Onboarding. Zwei Stationstypen:
//   • zentrierte Konzept-Karte (kein target) — erklärt eine Grundidee
//   • Spotlight-Station (target = data-tour-Wert) — hebt ein echtes
//     Dashboard-Element hervor (Box-Shadow-Cutout, kein aufdringliches
//     Popup) und setzt eine ruhige Bildunterschrift daneben.
// Immer skipbar UND „später zeigen" (verschiebbar). Jederzeit über das
// Menü wieder aufrufbar. Local-first, kein Tracking. Calm-Tech: ruhig,
// nicht aufdringlich, jederzeit wegklickbar.

const TOUR_KEY = 'or5_tour_done';

export const isTourDone = () => {
  try { return localStorage.getItem(TOUR_KEY) === 'true'; }
  catch { return false; }
};

export const markTourDone = () => {
  try { localStorage.setItem(TOUR_KEY, 'true'); } catch { /* localStorage n/a */ }
};

// steps: [{ key, target? }]. Sichtbare Texte in i18n unter tour.<key>.title/text.
export const Tour = ({ palette, t, steps, onFinish, onLater }) => {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null); // Bounding-Box des aktuellen Ziels (oder null = zentriert)
  const step = steps[i];
  const isLast = i === steps.length - 1;

  // Ziel-Element suchen, in den Blick scrollen und Position messen.
  const measure = useCallback(() => {
    if (!step || !step.target) { setRect(null); return; }
    const el = document.querySelector('[data-tour="' + step.target + '"]');
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [step]);

  useLayoutEffect(() => {
    if (step && step.target) {
      const el = document.querySelector('[data-tour="' + step.target + '"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Nach dem (smooth) Scrollen erneut messen.
    const t1 = setTimeout(measure, 60);
    const t2 = setTimeout(measure, 400);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true); };
  }, [measure, step]);

  const finish = () => { markTourDone(); onFinish && onFinish(); }; // erledigt → kommt nicht wieder
  const later = () => { onLater && onLater(); };                    // verschoben → beim nächsten Start wieder
  const next = () => { if (isLast) finish(); else setI(n => n + 1); };
  const back = () => setI(n => Math.max(0, n - 1));

  const hasSpot = !!(step && step.target && rect);
  const pad = 8; // Luft um das hervorgehobene Element

  // Bildunterschrift-Karte: bei Spotlight unter (oder über) dem Ziel, sonst zentriert.
  const cardBase = {
    width: 'min(360px, calc(100vw - 32px))', padding: space.lg,
    background: palette.surface, borderRadius: radius.lg,
    border: '1px solid ' + palette.border, boxSizing: 'border-box',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  };

  let cardPos;
  if (hasSpot) {
    const cardH = 240;      // Höhen-Schätzung fürs Klemmen (Karte ist kurz)
    const gap = pad + 12;
    const cardW = Math.min(360, window.innerWidth - 32);
    const belowTop = rect.top + rect.height + gap;
    const aboveTop = rect.top - gap - cardH;
    let top;
    if (belowTop + cardH <= window.innerHeight - 16) top = belowTop;         // passt unter das Ziel
    else if (aboveTop >= 16) top = aboveTop;                                 // sonst darüber
    else top = Math.max(16, (window.innerHeight - cardH) / 2);              // sonst mittig, geklemmt
    const left = Math.max(16, Math.min(rect.left, window.innerWidth - 16 - cardW));
    cardPos = { position: 'fixed', top, left, zIndex: 10002 };
  } else {
    cardPos = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10002 };
  }

  const btnPrimary = {
    padding: '11px 18px', background: palette.sand, color: palette.onSand,
    border: 'none', borderRadius: radius.sm, cursor: 'pointer',
    fontWeight: weight.semi, fontSize: text.sm, fontFamily,
  };
  const btnGhost = {
    padding: '11px 14px', background: 'transparent', color: palette.mid,
    border: 'none', borderRadius: radius.sm, cursor: 'pointer',
    fontSize: text.sm, fontFamily,
  };

  const dot = (on) => React.createElement('span', {
    style: { width: '7px', height: '7px', borderRadius: '50%', display: 'inline-block',
      background: on ? palette.sage : palette.border, transition: `background ${duration.normal}ms ${ease}` }
  });

  return React.createElement('div', {
    role: 'dialog', 'aria-modal': 'true', 'aria-label': t('tour.a11yLabel'),
    style: { position: 'fixed', inset: 0, zIndex: 10000 }
  },
    // Backdrop: bei Spotlight ein Cutout via grossem Box-Shadow, sonst flächig gedimmt.
    hasSpot
      ? React.createElement('div', {
          'aria-hidden': 'true',
          style: {
            position: 'fixed',
            top: rect.top - pad, left: rect.left - pad,
            width: rect.width + pad * 2, height: rect.height + pad * 2,
            borderRadius: radius.md, pointerEvents: 'none',
            boxShadow: '0 0 0 9999px rgba(20,24,28,0.55), 0 0 0 2px ' + palette.sage,
            transition: `all ${duration.normal}ms ${ease}`,
            zIndex: 10001,
          }
        })
      : React.createElement('div', {
          'aria-hidden': 'true', onClick: later,
          style: { position: 'fixed', inset: 0, background: 'rgba(20,24,28,0.55)', zIndex: 10001 }
        }),

    // Karte
    React.createElement('div', { style: { ...cardBase, ...cardPos, position: cardPos.position } },
      // „Später" (verschieben) — dezenter Schliessen-Knopf oben rechts
      React.createElement('button', {
        type: 'button', onClick: later, 'aria-label': t('tour.later'), title: t('tour.later'),
        style: { position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', borderRadius: radius.sm, cursor: 'pointer',
          color: palette.mid, fontSize: '18px', lineHeight: 1, fontFamily }
      }, '×'),
      React.createElement('h3', {
        style: { fontSize: text.body, fontWeight: weight.bold, color: palette.text, margin: '0 ' + space.lg + 'px ' + space.xs + 'px 0' }
      }, t('tour.' + step.key + '.title')),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', lineHeight: leading.relaxed }
      }, t('tour.' + step.key + '.text')),

      // Fortschritts-Punkte
      React.createElement('div', { style: { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: space.md } },
        steps.map((s, idx) => React.createElement(React.Fragment, { key: s.key }, dot(idx === i)))
      ),

      // Steuerung
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm } },
        React.createElement('button', { type: 'button', onClick: finish, style: btnGhost }, t('tour.skip')),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.xs + 'px' } },
          i > 0 && React.createElement('button', { type: 'button', onClick: back, style: btnGhost }, t('tour.back')),
          React.createElement('button', { type: 'button', onClick: next, style: btnPrimary },
            isLast ? t('tour.done') : t('tour.next') + ' →')
        )
      )
    )
  );
};

export default Tour;
