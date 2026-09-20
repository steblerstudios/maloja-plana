import { describe, it, expect } from 'vitest';
import { fruchtDurchmesser, ECHT_CM, ECHT_CM_DOLDE } from '../baumFruechte3d.js';

// Diese Tests halten die Proportionen fest, die am 20.09.2026 nachgemessen
// wurden. Vorher war die Bestückung schief: der Apfel 2,9-fach zu gross, die
// Heidelbeere 9,5-fach — eine Beere sah damit fast aus wie ein Apfel.
describe('Fruchtgrössen im Raum', () => {
  it('hält die Reihenfolge der echten Früchte ein', () => {
    const sorten = Object.keys(ECHT_CM).filter((k) => !ECHT_CM_DOLDE[k]);
    const nachEcht = [...sorten].sort((a, b) => ECHT_CM[a] - ECHT_CM[b]);
    const nachAnzeige = [...sorten].sort((a, b) => fruchtDurchmesser(a) - fruchtDurchmesser(b));
    expect(nachAnzeige).toEqual(nachEcht);
  });

  it('staucht die Spanne, statt sie linear zu übernehmen', () => {
    const echtesVerhaeltnis = ECHT_CM.apfel / ECHT_CM.heidelbeere;          // 6,67
    const gezeigt = fruchtDurchmesser('apfel') / fruchtDurchmesser('heidelbeere');
    expect(echtesVerhaeltnis).toBeGreaterThan(6);
    expect(gezeigt).toBeGreaterThan(1.5); // die Beere bleibt erkennbar kleiner
    expect(gezeigt).toBeLessThan(echtesVerhaeltnis); // aber nicht unsichtbar
  });

  it('bleibt in einer Grössenordnung, die an einen 4,3-m-Baum passt', () => {
    // Welteinheit = 1 m. Untergrenze 2 cm (darunter sieht man nichts),
    // Obergrenze 18 cm — eine Traubendolde misst real 12–20 cm und darf
    // deshalb deutlich grösser sein als jede Einzelfrucht.
    Object.keys(ECHT_CM).forEach((sorte) => {
      const cm = fruchtDurchmesser(sorte) * 100;
      expect(cm, sorte).toBeGreaterThan(2);
      expect(cm, sorte).toBeLessThan(18);
    });
  });

  it('misst bei Traube und Vogelbeere die Dolde, nicht die einzelne Beere', () => {
    expect(fruchtDurchmesser('traube')).toBeGreaterThan(fruchtDurchmesser('heidelbeere'));
    expect(fruchtDurchmesser('vogelbeere')).toBeGreaterThan(fruchtDurchmesser('haselnuss'));
  });
});
