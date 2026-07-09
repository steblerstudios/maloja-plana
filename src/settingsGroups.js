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
};

// Barrierefreiheits-Schalter zusammen; alles Übrige = Anzeige & Sprache.
export const A11Y_KEYS = ['voice', 'readable', 'simpleview', 'grayscale', 'colorblind', 'reducemotion'];

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
