import { describe, it, expect } from 'vitest';
import { grundbedarfNachWohnform, berechneSozialhilfe } from '../sozialhilfeRechner.js';

// Gegen die Beträge im Merkblatt «Grundbedarf in Wohngemeinschaften» (Kantonales Sozialamt GR,
// V6.0, 7.1.2025; SKOS-RL C.3.1/C.3.2): familienähnlich 2 Pers. 812, 3 Pers. 658, 4 Pers. 568,
// 5 Pers. 514 je Person; Zweck-WG 955 je Person (1061 − 10 %).
describe('Grundbedarf nach Wohnform', () => {
  it.each([[1, 812], [2, 658], [3, 568], [4, 514]])('familienähnlich, 1 unterstützt + %i weitere → %i', (weitere, erwartet) => {
    expect(grundbedarfNachWohnform(1, weitere, 'familienaehnlich')).toBe(erwartet);
  });
  it.each([1, 2, 4])('Zweck-WG mit %i weiteren → 955, unabhängig von der Haushaltsgrösse', (weitere) => {
    expect(grundbedarfNachWohnform(1, weitere, 'zweckWg')).toBe(955);
  });
  it('Zweck-WG, Paar als Einheit → GBL 2 Personen − 10 %', () => {
    expect(grundbedarfNachWohnform(2, 1, 'zweckWg')).toBe(Math.round(1624 * 0.9));
  });
  it('familienähnlich, Paar-Einheit + 1 weitere → 2/3 des 3-Personen-GBL', () => {
    expect(grundbedarfNachWohnform(2, 1, 'familienaehnlich')).toBe(Math.round(1974 / 3 * 2));
  });
  it('ohne weitere Personen zählt die Wohnform nicht', () => {
    expect(grundbedarfNachWohnform(1, 0, 'zweckWg')).toBe(1061);
    expect(grundbedarfNachWohnform(1, 0, 'familienaehnlich')).toBe(1061);
    expect(grundbedarfNachWohnform(3, 0, 'allein')).toBe(1974);
  });
  it('allein + weitere Personen: Wohnform «allein» rechnet wie bisher', () => {
    expect(grundbedarfNachWohnform(1, 2, 'allein')).toBe(1061);
  });
  it('die Rechnung übernimmt den Grundbedarf und meldet die Wohnform zurück', () => {
    const r = berechneSozialhilfe({ adults: 1, miete: 600, krankenkassePraemie: 400, wohnform: 'zweckWg', weiterePersonen: 2 });
    expect(r.gbl).toBe(955);
    expect(r.bedarf).toBe(955 + 600 + 400);
    expect(r.wohnform).toBe('zweckWg');
    expect(berechneSozialhilfe({ adults: 1, miete: 600, wohnform: 'zweckWg', weiterePersonen: 0 }).wohnform).toBe('allein');
  });
});
