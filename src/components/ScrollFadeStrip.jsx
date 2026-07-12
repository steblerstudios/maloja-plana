import React from 'react';

const { useRef, useState, useEffect, useCallback } = React;

// Rand-Verblendung für horizontal scrollbare Leisten (z. B. Reiter).
// Zeigt einen dezenten Verlauf am linken bzw. rechten Rand NUR dann, wenn dort
// wirklich mehr Inhalt liegt — signalisiert auf schmalen Geräten „hier geht's
// weiter". Additiv und pointerEvents:none: nimmt keine Interaktion weg.
//
// Der äussere Wrapper trägt Positions-/Sticky-Stile (containerStyle), das innere
// Scroll-Element die Flex-/Overflow-Stile (style). role/aria/data-Attribute für
// die Leiste werden via ...rest an das Scroll-Element durchgereicht, damit
// Fremd-Helfer (z. B. Aktiv-Reiter-in-Sicht-Scrollen) es weiterhin finden.
export const ScrollFadeStrip = ({ palette, containerStyle, style, fadeColor, fadeWidth, children, ...rest }) => {
  const ref = useRef(null);
  const [fade, setFade] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setFade(f => (f.left === left && f.right === right) ? f : { left, right });
  }, []);

  // Listener einmal aufsetzen: Scrollen der Leiste + Fensterbreite.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (ro) ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [update]);

  // Nach jedem Render neu messen: fängt Inhaltswechsel (andere/mehr Reiter bei
  // SPA-Navigation) ab, die scrollWidth ändern, ohne dass ein Event feuert.
  // Günstig, und der setFade-Vergleich bricht Re-Render-Schleifen ab.
  useEffect(() => { update(); });

  const col = fadeColor || (palette && (palette.surface || palette.up)) || '#ffffff';
  const w = (fadeWidth || 24) + 'px';
  const edge = (side) => ({
    position: 'absolute', top: 0, bottom: 0, [side]: 0, width: w,
    pointerEvents: 'none', zIndex: 1,
    background: 'linear-gradient(to ' + (side === 'left' ? 'right' : 'left') + ', ' + col + ', ' + col + '00)',
    opacity: fade[side] ? 1 : 0, transition: 'opacity 160ms ease',
  });

  return React.createElement('div', { style: { position: 'relative', ...containerStyle } },
    React.createElement('div', { ref, style, ...rest }, children),
    React.createElement('div', { 'aria-hidden': 'true', style: edge('left') }),
    React.createElement('div', { 'aria-hidden': 'true', style: edge('right') })
  );
};

export default ScrollFadeStrip;
