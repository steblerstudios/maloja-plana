// Schulden R2 Teil 2, Fix-Welle 13.10.2026 (C): Rollen fr/it, «Schuld» statt «Forderung» (de/rm), it Lei-Grossschreibung.
import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

describe('C · Sprache', () => {
  it('Rollen fr/it nennen das Geld', () => {
    expect(fr.schulden.verlustschein.rolle.schulde).toBe('Je dois de l’argent');
    expect(fr.schulden.verlustschein.rolle.geschuldet).toBe('On me doit de l’argent');
    expect(it_.schulden.verlustschein.rolle.schulde).toBe('Devo del denaro');
    expect(it_.schulden.verlustschein.rolle.geschuldet).toBe('Mi devono del denaro');
  });
  it('de/rm Betreibung: «Schuld» statt «Forderung»', () => {
    for (const l of [de, rm]) {
      const b = l.schulden.betreibung;
      expect(b.verbindenKeine).toBe('Keine Schuld');
      expect(b.keineVerbindung).toBe('Die verbundene Schuld gibt es nicht mehr.');
      expect(b.verbundenMit).toBe('Verbunden mit: {name}');
      expect(b.verbinden).toBe('Verbunden mit');
      expect(JSON.stringify(b)).not.toContain('Forderung');
    }
  });
  it('it: Lei gross, ufficio d’esecuzione, chiusura del procedimento', () => {
    const v = it_.schulden.verlustschein, a = it_.schulden.betreibung.auszugRegel;
    expect(v.rolle.hilfe.schulde.sie).toContain('a Suo carico');
    expect(v.rolle.hilfe.geschuldet.sie).toContain('chi Le deve');
    expect(a.sie).toContain('dirLe');
    expect(a.sie).toContain('il Suo procedimento');
    for (const s of [a.sie, a.du]) {
      expect(s).toContain('chiusura del procedimento');
      expect(s).not.toContain('conclusione della procedura');
      expect(s).not.toContain('ufficio di esecuzione');
      expect(s).toContain('ufficio d’esecuzione');
    }
  });
});
