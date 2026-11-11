// Kapitel 5, C — «Noch nötig: Beitragsmonate» mit Sprung zum Feld (app-weit).
//
// Die Rechner melden fehlende Angaben als stabile Namen (`fehlend`, siehe ergebnisArt.js). Hier steht je
// Ansicht, welches Eingabefeld zu welchem Namen gehört — als Element-ID im DOM. Die Anzeige
// (components/ErgebnisArt.jsx) macht aus einem Namen nur dann einen Sprung, wenn sie hier eine ID findet
// UND das Element auf der Seite steht. Sonst bleibt der Name Text: kein Knopf, der ins Leere führt.
//
// Ein Name ohne Eintrag ist kein Fehler. Er heisst: das Feld liegt nicht im Rechner selbst (z. B. das
// Einkommen der Lohn-Einordnung kommt aus dem Profil, der Kanton der Sozialhilfe ebenso).
// Der Test `angabeZiele.test.jsx` rendert die Rechner und prüft, dass jede ID hier auch wirklich steht.

export const ANGABE_ZIELE = Object.freeze({
  alv: Object.freeze({ bruttolohn: 'alv-brutto', beitragsmonate: 'alv-monate', geburtsdatum: 'alv-alter' }),
  eo: Object.freeze({ bruttolohn: 'eo-einkommen' }),
  stipendien: Object.freeze({ status: 'stip-status', scope: 'stip-scope' }),
  stundenlohn: Object.freeze({ stundenlohn: 'sl-betrag', wochenstunden: 'sl-wochenstunden', kanton: 'sl-kanton', ferienform: 'sl-ferienForm' }),
  sozialhilfe: Object.freeze({ miete: 'sh-miete', kvgPraemie: 'sh-kvg', erwerbseinkommen: 'sh-einkommen', vermoegen: 'sh-vermoegen', erwerbsunkosten: 'sh-erwerbsunkosten' }),
});

export function angabeZiele(view) {
  return (view && ANGABE_ZIELE[view]) || null;
}

// Der Sprung selbst: Feld sichtbar machen und fokussieren. Liegt das Feld in einem zugeklappten
// <details>, wird es aufgeklappt. Ist das Ziel kein Eingabeelement (Einzelwahl: eine Gruppe), bekommt
// das erste fokussierbare Element darin den Fokus — bei der Einzelwahl die gewählte Option.
const FOKUSSIERBAR = 'input:not([type="hidden"]), select, textarea, [tabindex="0"], button';
export function springeZuAngabe(id, doc = typeof document !== 'undefined' ? document : null) {
  if (!doc || !id) return false;
  const ziel = doc.getElementById(id);
  if (!ziel) return false;
  for (let el = ziel.parentElement; el; el = el.parentElement) {
    if (el.tagName === 'DETAILS' && !el.open) el.open = true;
  }
  const feld = ziel.matches && ziel.matches(FOKUSSIERBAR) ? ziel : (ziel.querySelector && ziel.querySelector(FOKUSSIERBAR)) || ziel;
  if (typeof feld.scrollIntoView === 'function') feld.scrollIntoView({ block: 'center' });
  if (typeof feld.focus === 'function') feld.focus({ preventScroll: true });
  return true;
}
