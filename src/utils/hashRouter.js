// ─── Hash-Based Router ──────────────────────────────────────
// Syncs app view state with URL hash for browser back/forward.
// Format: #/view or #/chapter/0
//
// Design:
//   - Does NOT replace the existing view state system
//   - Simply syncs hash ↔ view bidirectionally
//   - Falls back gracefully if hash is malformed
//   - No external dependencies
//
// Valid hashes:
//   #/dashboard        → view='dashboard'
//   #/chapter/2        → view='chapter', activeChapter=2
//   #/tresor           → view='tresor'
//   #/kk               → view='kk'
//   etc. for all 18 views

// All known view names (must match the view === 'x' checks in main.jsx).
// Exported so a guard test can assert every main.jsx view is deep-linkable.
export const VALID_VIEWS = new Set([
  'dashboard', 'chapter', 'tresor', 'kk', 'budget', 'schulden',
  'tax', 'organ', 'sync', 'premium', 'praemien', 'mietzins', 'vorsorge', 'eo', 'cv', 'charts',
  'sozialhilfe', 'direktlinks', 'unterlagen', 'lebensmappe', 'notfalldossier', 'behoerdendossier', 'finanzuebersicht', 'export', 'calendar', 'notifications',
  'notfalleinstieg', 'notfallkarte', 'gesundheit', 'briefe', 'stipendien', 'schnellcheck', 'situationen', 'alv', 'asyl', 'kvg', 'kvgwechsel', 'zusatzwechsel', 'umzug', 'unfallkrankheit', 'neuerjob', 'stelleverloren', 'kkerst', 'pensionierung', 'betreibung', 'selbstaendigkeit', 'heirat', 'kind', 'trennung', 'bewilligung', 'todesfall', 'iv', 'pflege', 'flyer', 'merkliste', 'search', 'obstgarten',
  'settings', 'taxImport', 'legal',
]);

/**
 * Parse the current URL hash into a view state.
 * Returns { view, chapterIndex } or null if hash is empty/invalid.
 */
export function parseHash() {
  const hash = window.location.hash;
  if (!hash || hash === '#' || hash === '#/') {
    return null; // no hash → use default (dashboard)
  }

  // Remove leading #/ or #
  const path = hash.replace(/^#\/?/, '');
  const parts = path.split('/');

  const view = parts[0];
  if (!VALID_VIEWS.has(view)) {
    return null; // unknown view → ignore
  }

  if (view === 'chapter' && parts[1] !== undefined) {
    const idx = parseInt(parts[1], 10);
    if (!isNaN(idx) && idx >= 0 && idx <= 20) { // reasonable bounds
      return { view: 'chapter', chapterIndex: idx };
    }
    return null; // malformed chapter index
  }

  return { view, chapterIndex: null };
}

/**
 * Update the URL hash to reflect the current view state.
 * Uses replaceState to avoid flooding browser history with every auto-save cycle.
 * For user-initiated navigation, use pushHash instead.
 */
export function setHash(view, chapterIndex) {
  let hash;
  if (view === 'chapter' && chapterIndex !== null && chapterIndex !== undefined) {
    hash = '#/' + view + '/' + chapterIndex;
  } else {
    hash = '#/' + view;
  }

  if (window.location.hash !== hash) {
    window.history.pushState(null, '', hash);
  }
}

/**
 * Replace hash without creating a history entry.
 * Used for initial sync on load (don't pollute history).
 */
export function replaceHash(view, chapterIndex) {
  let hash;
  if (view === 'chapter' && chapterIndex !== null && chapterIndex !== undefined) {
    hash = '#/' + view + '/' + chapterIndex;
  } else {
    hash = '#/' + view;
  }

  if (window.location.hash !== hash) {
    window.history.replaceState(null, '', hash);
  }
}

/**
 * Register a listener for hash changes (browser back/forward).
 * Returns a cleanup function to remove the listener.
 *
 * @param {Function} onNavigate - Called with { view, chapterIndex } when hash changes
 */
export function onHashChange(onNavigate) {
  const handler = () => {
    const parsed = parseHash();
    if (parsed) {
      onNavigate(parsed);
    }
  };

  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}
