// Der Rest jeder Sprache, nachgeladen nach dem ersten Bild (scripts/i18nKern.mjs). Eigenes
// Modul, damit weder die Rest-Dateien noch das Zusammenfügen im Startbündel liegen (65-kB-Deckel).
const rest = {
  en: () => import('virtual:sprache/en-rest'),
  de: () => import('virtual:sprache/de-rest'),
  fr: () => import('virtual:sprache/fr-rest'),
  it: () => import('virtual:sprache/it-rest'),
  rm: () => import('virtual:sprache/rm-rest'),
};

// Exportiert für Unit-Tests. Blätter (auch { sie, du } und Listen) stehen ganz in einem Teil.
export function zusammenfuegen(a, b) {
  const ziel = { ...a };
  for (const [name, wert] of Object.entries(b)) {
    const beide = wert && typeof wert === 'object' && !Array.isArray(wert) && ziel[name] && typeof ziel[name] === 'object';
    ziel[name] = beide ? zusammenfuegen(ziel[name], wert) : wert;
  }
  return ziel;
}

export async function mitRest(kern, lang) {
  return zusammenfuegen(kern, (await rest[lang]()).default);
}
