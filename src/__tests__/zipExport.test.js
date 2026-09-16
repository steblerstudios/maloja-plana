import { describe, it, expect } from 'vitest';
import { escapeCsvFormula, prepareDownloadFiles } from '../zipExport.js';

// Bau-Liste E14/O2 (MP-089): CSV-Export gegen Formel-Injection schützen.
// OWASP «CSV Injection»: https://owasp.org/www-community/attacks/CSV_Injection
// (abgerufen 16.09.2026) — Zellen mit gefährlichem Anfangszeichen bekommen ein
// vorangestelltes `'`, echte Zahlen bleiben unverändert.

describe('escapeCsvFormula — Formelschutz', () => {
  it.each(['=', '+', '-', '@', '\t', '\r'])(
    'stellt Zellen, die mit %j beginnen, ein \' voran',
    (trigger) => {
      const gefaehrlich = `${trigger}SUMME(A1:A9)`;
      expect(escapeCsvFormula(gefaehrlich)).toBe(`'${gefaehrlich}`);
    }
  );

  it('lässt eine kombinierte Formel-Zelle nicht durch (Gross-/Kleinschreibung, verschachtelt)', () => {
    expect(escapeCsvFormula('=cmd|\'/c calc\'!A1')).toBe('\'=cmd|\'/c calc\'!A1');
  });

  it('lässt positive und negative Zahlen unverändert (echte Beträge, kein Formelschutz nötig)', () => {
    for (const zahl of ['120.5', '-120.5', '0', '-0.01', '2400', '+120']) {
      expect(escapeCsvFormula(zahl)).toBe(zahl);
    }
  });

  it('lässt normale Texte unverändert', () => {
    for (const text of ['Musterstrasse 1', 'Basel', 'Kasse X', 'Anna Muster', '']) {
      expect(escapeCsvFormula(text)).toBe(text);
    }
  });

  it('behandelt null/undefined wie eine leere Zeichenkette', () => {
    expect(escapeCsvFormula(null)).toBe('');
    expect(escapeCsvFormula(undefined)).toBe('');
  });

  it('schützt eine Zahl-ähnliche, aber nicht rein numerische Zeichenkette (z. B. Schweizer Tausendertrennzeichen)', () => {
    // "-60'000" beginnt mit "-" und ist keine reine Zahl im Sinn der Export-Schreibweise
    // (String(zahl) ohne Tausendertrennzeichen) — sie wird darum vorsichtshalber geschützt.
    expect(escapeCsvFormula("-60'000")).toBe("'-60'000");
  });
});

describe('generateCSVBackup (über prepareDownloadFiles) — Formelschutz im echten Export', () => {
  const daten = {
    basis: {
      firstName: 'Anna',
      lastName: 'Muster',
      notiz: '=HYPERLINK("http://böse.example","Klick")',
      plusFeld: '+1+1',
      minusText: '-Miete nicht bezahlt',
      atFeld: '@SUM(1+1)',
      betrag: -120.5,
      anzahl: 3,
      adresse: 'Musterweg 1',
      zitat: 'Sagt "Hallo"',
    },
  };

  const csvZeilen = () => prepareDownloadFiles(daten).csv.content.split('\n');

  it('schützt gefährliche Feldwerte mit vorangestelltem \'', () => {
    const zeilen = csvZeilen();
    expect(zeilen.some(z => z.includes('"\'=HYPERLINK'))).toBe(true);
    expect(zeilen.some(z => z.includes('"\'+1+1"'))).toBe(true);
    expect(zeilen.some(z => z.includes('"\'-Miete nicht bezahlt"'))).toBe(true);
    expect(zeilen.some(z => z.includes('"\'@SUM(1+1)"'))).toBe(true);
  });

  it('lässt eine negative Zahl im echten Export unverändert (kein \' davor)', () => {
    const zeilen = csvZeilen();
    expect(zeilen.some(z => z.endsWith('"-120.5"'))).toBe(true);
    expect(zeilen.some(z => z.includes('"\'-120.5"'))).toBe(false);
  });

  it('lässt normalen Text und Anführungszeichen-Escaping unverändert korrekt', () => {
    const zeilen = csvZeilen();
    expect(zeilen.some(z => z.includes('"Musterweg 1"'))).toBe(true);
    // Anführungszeichen werden verdoppelt, nicht durch den Formelschutz verändert.
    expect(zeilen.some(z => z.includes('"Sagt ""Hallo"""'))).toBe(true);
  });

  it('header-Zeile bleibt unverändert (keine gefährlichen Anfangszeichen)', () => {
    const [header] = csvZeilen();
    expect(header).not.toMatch(/^"'/);
  });
});
