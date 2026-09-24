// K119 · Der Melde-Entwurf des Absturz-Schirms trägt keine mitzitierten Eingaben.
//
// Die Meldungen unten sind ECHT, nicht ausgedacht: die V8-Texte (Chrome, Edge, Node) am
// 24.09.2026 mit `JSON.parse` in Node erzeugt; die Safari-Form nach dem Muster von
// JavaScriptCore («JSON Parse error: Unexpected identifier "…"»), nicht selbst erzeugt.
import { describe, it, expect } from 'vitest';
import { meldungOhneEingaben } from '../utils/meldungOhneEingaben.js';
import { ErrorBoundary } from '../ErrorBoundary.jsx';

const V8_DIAGNOSE = 'Unexpected token \'D\', "Diabetes T"... is not valid JSON';
const V8_NAME = 'Unexpected token \'M\', "Muster" is not valid JSON';
const V8_POSITION = 'Unexpected non-whitespace character after JSON at position 8 (line 1 column 9)';
const SAFARI_AHV = 'JSON Parse error: Unexpected identifier "756.1234.5678.97"';

describe('meldungOhneEingaben', () => {
  it('Chrome zitiert die Eingabe — sie fällt weg, die Art des Fehlers bleibt', () => {
    const m = meldungOhneEingaben(V8_DIAGNOSE);
    expect(m).not.toMatch(/Diabetes/);
    expect(m).toContain('is not valid JSON');
    expect(meldungOhneEingaben(V8_NAME)).not.toMatch(/Muster/);
  });

  it('Safari: eine AHV-Nummer in Anführungszeichen fällt weg', () => {
    expect(meldungOhneEingaben(SAFARI_AHV)).not.toMatch(/756|5678/);
  });

  it('Ziffernfolgen ohne Anführungszeichen (AHV, Telefon) werden zu #', () => {
    const m = meldungOhneEingaben('Fehler bei 756.1234.5678.97 und 079 123 45 67');
    expect(m).not.toMatch(/756|1234|079|123 45/);
    expect(m).toContain('#');
  });

  // Gate 24.09.2026 (0.1.40-beta): deutsche Anführungszeichen und offene Zitate.
  it('deutsche Anführungszeichen „…“ fallen weg', () => {
    const m = meldungOhneEingaben('Ungültiger Wert „Diabetes Typ 2“ im Feld');
    expect(m).not.toMatch(/Diabetes|Typ/);
    expect(m).toContain('im Feld');
    expect(meldungOhneEingaben('Wert „Muster” ungültig')).not.toMatch(/Muster/);
  });

  it('ein offenes Zitat ohne Schluss fällt bis zum Zeilenende weg, die nächste Zeile bleibt', () => {
    const m = meldungOhneEingaben('Unexpected end of JSON input near "Diabetes Typ\nZeile zwei');
    expect(m).not.toMatch(/Diabetes/);
    expect(m).toContain('Unexpected end of JSON input near');
    expect(m).toContain('Zeile zwei');
    expect(meldungOhneEingaben('Wert „Muster ohne Schluss')).not.toMatch(/Muster/);
    expect(meldungOhneEingaben('Wert «Muster ohne Schluss')).not.toMatch(/Muster/);
  });

  it('Gegenprobe: ein Apostroph mitten im Wort öffnet kein Zitat', () => {
    expect(meldungOhneEingaben("Cannot read properties of undefined")).toBe('Cannot read properties of undefined');
    expect(meldungOhneEingaben("doesn't work here")).toBe("doesn't work here");
  });

  it('kurze Positionsangaben bleiben lesbar (zum Nachstellen)', () => {
    expect(meldungOhneEingaben(V8_POSITION)).toBe(V8_POSITION);
  });

  it('leer und fehlend → leer; lang → höchstens 200 Zeichen', () => {
    expect(meldungOhneEingaben(undefined)).toBe('');
    expect(meldungOhneEingaben('x'.repeat(500))).toHaveLength(200);
  });
});

describe('an der Aufrufstelle: ErrorBoundary.meldeHref', () => {
  it('der Mail-Entwurf enthält die Diagnose und die AHV-Nummer nicht', () => {
    for (const message of [V8_DIAGNOSE, SAFARI_AHV]) {
      const eb = new ErrorBoundary({});
      eb.state = { hasError: true, error: new SyntaxError(message) };
      const body = decodeURIComponent(eb.meldeHref((k, f) => f).split('&body=')[1]);
      expect(body).toContain('Fehler: ');
      expect(body).not.toMatch(/Diabetes|756\.1234/);
    }
  });
});
