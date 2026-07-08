import { describe, it, expect } from 'vitest';
import { generateCVTemplate, generateCVHTML } from '../cvGenerator.js';

// Minimaler t-Stub: gibt den Key zurück (reicht zum Struktur-Test).
const tStub = (k) => k;

describe('cvGenerator', () => {
  it('escaped Nutzerfelder, damit < > & im Lebenslauf keine HTML/Skripte einschleusen', () => {
    const data = {
      basis: {
        firstName: 'Anna', lastName: '<script>alert(1)</script>',
        phone: '079 & 080', email: 'a<b@example.ch',
        nationality: 'CH>DE', maritalStatus: 'ledig',
      },
      wohnen: { address: 'Weg <1>', postalCode: '4000', city: 'Basel & Umgebung' },
      ausbildung: {
        jobTitle: 'Köchin <b>', employer: 'Beiz & Co', employmentStart: '2020',
        educationLevel: 'EFZ', schoolName: 'BFS <X>', languages: 'DE, FR & IT',
      },
    };
    const cvData = generateCVTemplate(data, tStub);
    const html = generateCVHTML(cvData, tStub);

    // Roh eingeschleustes Markup darf nicht durchkommen …
    expect(html).not.toContain('<script>alert(1)</script>');
    // … sondern muss entschärft im Dokument stehen.
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('Beiz &amp; Co');
    expect(html).toContain('Basel &amp; Umgebung');
    // Gerüst bleibt intakt.
    expect(html).toContain('<!DOCTYPE html>');
  });
});
