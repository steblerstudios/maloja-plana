// Sprache eines erzeugten HTML-Dokuments (Brief, Dossier) für <html lang="…"> — aus dem
// Übersetzer, mit dem es geschrieben wurde, nicht fest «de» (Bugsuche B-16). Vorlese-Programme
// sprechen sonst einen französischen Brief mit deutscher Aussprache, und die Silbentrennung im
// Druck folgt deutschen Regeln. Briefe, die bei Rumantsch bewusst deutsch bleiben, bekommen
// einen deutschen Übersetzer (briefUebersetzer) und damit richtig «de».
export const htmlSprache = (t) => {
  const locale = typeof t === 'function' ? t('calendar.locale') : '';
  return typeof locale === 'string' && /^[a-z]{2}-[A-Z]{2}$/.test(locale) ? locale.slice(0, 2) : 'de';
};
