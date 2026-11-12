// Geteilte Gruppierung der Bedien-Bausteine: Barrierefreiheit vs. Anzeige & Sprache.
// Eine Quelle der Wahrheit für SettingsView (ganze Seite) UND die Einstellungs-
// Schublade (MobileNav) — beide zeigen dieselbe ruhige, beschriftete Hierarchie.

export const CONTROL_LABELS = {
  voice: 'vorlesen.toggle',
  readable: 'common.readable',
  anrede: 'common.settingsAnrede',
  lang: 'common.selectLanguage',
  theme: 'common.settingsTheme',
  simpleview: 'common.simpleView',
  grayscale: 'common.grayscale',
  colorblind: 'common.colorBlind',
  reducemotion: 'common.reduceMotion',
  lefthand: 'common.leftHand',
};

// Gruppe C, Gestaltung A (11.11.2026): In der Einstellungsseite und der Schublade wird jedes
// An/Aus-Bedienelement als beschrifteter Schalter mit Zustandswort gezeigt. Die Kopfzeile behält
// ihre Symbol-Knöpfe (Startbündel). Die Elemente kommen fertig aus main.jsx; hier lesen wir nur
// ihren Zustand und ihre Handlung aus den Props ab — eine Quelle der Wahrheit bleibt main.jsx.
// Ohne An/Aus (Anrede, Sprache) → null, dann bleibt das Element, wie es ist.
// Erscheinungsbild: der Knopf zeigt die Handlung («Hell» im Dunkelmodus); als Schalter heisst
// die Zeile «Dunkle Darstellung» und zeigt den Zustand.
export const SCHALTER_LABELS = { theme: 'common.settingsDunkel' };

export function alsSchalter(ctrl) {
  const p = (ctrl && ctrl.props) || {};
  if (ctrl && ctrl.key === 'voice' && p.vorlesen) {
    return { an: !!p.vorlesen.enabled, umschalten: () => p.vorlesen.toggle() };
  }
  if (ctrl && ctrl.key === 'theme' && typeof p.onToggle === 'function') {
    return { an: !!p.isDarkMode, umschalten: () => p.onToggle() };
  }
  if (typeof p['aria-pressed'] === 'boolean' && typeof p.onClick === 'function') {
    return { an: p['aria-pressed'], umschalten: () => p.onClick() };
  }
  return null;
}

// Name der Zeile: beim Schalter ggf. ein eigener (Erscheinungsbild → Dunkle Darstellung).
export function zeilenLabelKey(ctrl, istSchalter) {
  if (istSchalter && SCHALTER_LABELS[ctrl.key]) return SCHALTER_LABELS[ctrl.key];
  return CONTROL_LABELS[ctrl.key];
}

// Barrierefreiheits-Schalter zusammen; alles Übrige = Anzeige & Sprache.
export const A11Y_KEYS = ['voice', 'readable', 'simpleview', 'grayscale', 'colorblind', 'reducemotion', 'lefthand'];

// Teilt eine Liste von Bedienelementen (React-Elemente mit .key) in beschriftete
// Gruppen. Leere Gruppen fallen weg. Reihenfolge: erst Anzeige, dann Barrierefreiheit.
export function groupSettingsControls(list) {
  const src = (list || []).filter(Boolean);
  const a11y = src.filter(c => A11Y_KEYS.includes(c.key));
  const display = src.filter(c => !A11Y_KEYS.includes(c.key));
  return [
    { key: 'display', labelKey: 'common.settingsDisplay', controls: display },
    { key: 'a11y', labelKey: 'common.settingsAccessibility', controls: a11y },
  ].filter(g => g.controls.length);
}
