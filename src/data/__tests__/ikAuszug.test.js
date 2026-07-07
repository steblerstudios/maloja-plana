import { describe, it, expect } from 'vitest';
import {
  berechneIKAuszug, vorbelegeIKAuszug, berechneAltersrente,
  IK_TYP, AHV_PARAMS,
} from '../ahvRechner.js';

// Kleiner Helfer: n Einträge eines Typs mit gleichem Einkommen.
const jahre = (n, typ, einkommen, startJahr = 1985) =>
  Array.from({ length: n }, (_, i) => ({ jahr: startJahr + i, alter: 21 + i, einkommen, typ }));

describe('berechneIKAuszug', () => {
  it('leerer Auszug → keine Beitragsjahre', () => {
    const r = berechneIKAuszug([]);
    expect(r.beitragsjahre).toBe(0);
    expect(r.durchschnittlichesJahreseinkommen).toBe(0);
    expect(r.vollstaendig).toBe(false);
  });

  it('44 volle Erwerbsjahre → volle Beitragsdauer + Ø-Einkommen', () => {
    const r = berechneIKAuszug(jahre(44, IK_TYP.ERWERB, 80000));
    expect(r.beitragsjahre).toBe(44);
    expect(r.durchschnittlichesJahreseinkommen).toBe(80000);
    expect(r.vollstaendig).toBe(true);
    expect(r.luecken).toBe(0);
  });

  it('deckelt Beitragsjahre bei 44 (Skala 44)', () => {
    const r = berechneIKAuszug(jahre(50, IK_TYP.ERWERB, 60000));
    expect(r.beitragsjahre).toBe(44);
    expect(r.vollstaendig).toBe(true);
  });

  it('Lücken senken die Beitragsjahre', () => {
    const entries = [...jahre(40, IK_TYP.ERWERB, 70000), ...jahre(4, IK_TYP.LUECKE, 0, 2025)];
    const r = berechneIKAuszug(entries);
    expect(r.erwerbsjahre).toBe(40);
    expect(r.luecken).toBe(4);
    expect(r.beitragsjahre).toBe(40); // ohne Jugendjahre nicht gefüllt
  });

  it('Jugendjahre füllen spätere Lücken (#6)', () => {
    const entries = [
      ...jahre(40, IK_TYP.ERWERB, 70000),
      ...jahre(4, IK_TYP.LUECKE, 0, 2025),
      // 3 Jugendjahre (17–19) mit Einkommen
      { jahr: 1980, alter: 17, einkommen: 20000, typ: IK_TYP.JUGEND },
      { jahr: 1981, alter: 18, einkommen: 20000, typ: IK_TYP.JUGEND },
      { jahr: 1982, alter: 19, einkommen: 20000, typ: IK_TYP.JUGEND },
    ];
    const r = berechneIKAuszug(entries);
    expect(r.jugendjahreTotal).toBe(3);
    expect(r.jugendjahreGenutzt).toBe(3);        // 3 von 4 Lücken gefüllt
    expect(r.beitragsjahre).toBe(43);            // 40 + 3
  });

  it('Jugendjahre helfen nur bei tatsächlichen Lücken', () => {
    const entries = [
      ...jahre(44, IK_TYP.ERWERB, 70000),
      { jahr: 1980, alter: 18, einkommen: 20000, typ: IK_TYP.JUGEND },
    ];
    const r = berechneIKAuszug(entries);
    expect(r.jugendjahreGenutzt).toBe(0);        // keine Lücke → ungenutzt
    expect(r.beitragsjahre).toBe(44);
  });

  it('ALV-Jahre zählen als AHV-Beitragsjahr, werden aber getrennt ausgewiesen (#7)', () => {
    const entries = [...jahre(38, IK_TYP.ERWERB, 75000), ...jahre(3, IK_TYP.ALV, 45000, 2023)];
    const r = berechneIKAuszug(entries);
    expect(r.alvJahre).toBe(3);
    expect(r.beitragsjahre).toBe(41);            // Erwerb + ALV zählen zur AHV
  });

  it('Ø-Einkommen mittelt über die angerechneten Jahre', () => {
    const entries = [
      ...jahre(2, IK_TYP.ERWERB, 100000),
      ...jahre(2, IK_TYP.ERWERB, 50000, 2000),
    ];
    const r = berechneIKAuszug(entries);
    expect(r.beitragsjahre).toBe(4);
    expect(r.durchschnittlichesJahreseinkommen).toBe(75000);
  });
});

describe('vorbelegeIKAuszug', () => {
  it('füllt ab Alter 21 bis heute mit dem aktuellen Einkommen', () => {
    const entries = vorbelegeIKAuszug({ geburtsjahr: 1994, aktuellesEinkommen: 65000, jetztJahr: 2026 });
    // Alter 21..32 = 12 Einträge
    expect(entries.length).toBe(12);
    expect(entries.every(e => e.typ === IK_TYP.ERWERB)).toBe(true);
    expect(entries[0]).toMatchObject({ jahr: 2015, alter: 21, einkommen: 65000 });
  });

  it('nimmt optional die Jugendjahre (17–20) mit', () => {
    const entries = vorbelegeIKAuszug({ geburtsjahr: 1994, aktuellesEinkommen: 40000, mitJugendjahren: true, jetztJahr: 2026 });
    const jugend = entries.filter(e => e.typ === IK_TYP.JUGEND);
    expect(jugend.length).toBe(4); // 17,18,19,20
    expect(jugend[0]).toMatchObject({ alter: 17 });
  });

  it('leitet Geburtsjahr aus dem Alter ab', () => {
    const entries = vorbelegeIKAuszug({ aktuellesAlter: 30, aktuellesEinkommen: 50000, jetztJahr: 2026 });
    expect(entries.length).toBe(10); // 21..30
    expect(entries[0].jahr).toBe(1996 + 21);
  });

  it('ohne Geburtsjahr/Alter → leer (kein Absturz)', () => {
    expect(vorbelegeIKAuszug({ aktuellesEinkommen: 50000 })).toEqual([]);
  });
});

describe('IK-Auszug → berechneAltersrente (Integration)', () => {
  it('speist echte Beitragsjahre + Ø-Einkommen in die Rente', () => {
    // Einkommen über der oberen Grenze (90'720) → Maximalrente bei Skala 44
    const ik = berechneIKAuszug(jahre(44, IK_TYP.ERWERB, 100000));
    const rente = berechneAltersrente({
      geburtsjahr: 1961,
      durchschnittlichesJahreseinkommen: ik.durchschnittlichesJahreseinkommen,
      beitragsjahre: ik.beitragsjahre,
      bezugAlter: 65,
    });
    expect(rente.skalenfaktor).toBe(1);            // volle Skala 44
    expect(rente.monatsrente).toBe(AHV_PARAMS.maxRente); // hohes Einkommen → Maximalrente
  });

  it('Betreuungsjahre zählen als Beitragsjahr und werden separat ausgewiesen', () => {
    const entries = [...jahre(30, IK_TYP.ERWERB, 60000), ...jahre(5, IK_TYP.BETREUUNG, 0, 2021)];
    const r = berechneIKAuszug(entries);
    expect(r.betreuungsjahre).toBe(5);
    expect(r.beitragsjahre).toBe(35); // Erwerb + Betreuung zählen zur AHV
  });

  it('Lücken ohne Jugendjahre-Deckung senken die Rente', () => {
    const mitLuecken = berechneIKAuszug([...jahre(33, IK_TYP.ERWERB, 90000), ...jahre(11, IK_TYP.LUECKE, 0, 2020)]);
    const voll = berechneIKAuszug(jahre(44, IK_TYP.ERWERB, 90000));
    const r1 = berechneAltersrente({ geburtsjahr: 1961, durchschnittlichesJahreseinkommen: mitLuecken.durchschnittlichesJahreseinkommen, beitragsjahre: mitLuecken.beitragsjahre, bezugAlter: 65 });
    const r2 = berechneAltersrente({ geburtsjahr: 1961, durchschnittlichesJahreseinkommen: voll.durchschnittlichesJahreseinkommen, beitragsjahre: voll.beitragsjahre, bezugAlter: 65 });
    expect(mitLuecken.beitragsjahre).toBe(33);
    expect(r1.monatsrente).toBeLessThan(r2.monatsrente);
  });
});

describe('Betreuungsgutschriften (Pflege naher Angehöriger)', () => {
  const basis = { geburtsjahr: 1965, durchschnittlichesJahreseinkommen: 30000, beitragsjahre: 44, bezugAlter: 65 };

  it('Betreuungsjahre heben die Rente wie Erziehungsjahre', () => {
    const ohne = berechneAltersrente(basis);
    const mitBetreuung = berechneAltersrente({ ...basis, betreuungsjahre: 5 });
    expect(mitBetreuung.monatsrente).toBeGreaterThan(ohne.monatsrente);
    expect(mitBetreuung.betreuungsjahre).toBe(5);
    expect(mitBetreuung.gutschriftJahre).toBe(5);
  });

  it('Erziehungs- und Betreuungsjahre addieren sich in der Aufwertung', () => {
    const nurErziehung = berechneAltersrente({ ...basis, erziehungsjahre: 5 });
    const beide = berechneAltersrente({ ...basis, erziehungsjahre: 5, betreuungsjahre: 5 });
    expect(beide.gutschriftJahre).toBe(10);
    expect(beide.erziehungsgutschrift).toBeGreaterThan(nurErziehung.erziehungsgutschrift);
  });

  it('gleicher Jahresbetrag wie Erziehungsgutschrift (identische Rente)', () => {
    const a = berechneAltersrente({ ...basis, erziehungsjahre: 4 });
    const b = berechneAltersrente({ ...basis, betreuungsjahre: 4 });
    expect(b.monatsrente).toBe(a.monatsrente);
  });
});
