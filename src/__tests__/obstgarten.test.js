import { describe, it, expect } from 'vitest';
import { gardenStage, gardenTrees, fruitForm } from '../data/obstgarten.js';

describe('fruitForm: natürliche Wuchsform je (fest entschiedener) Frucht', () => {
  it('ordnet jede der 11 Schweizer Früchte einer Form zu', () => {
    expect(fruitForm('apfel')).toBe('rund');
    expect(fruitForm('birne')).toBe('hoch');
    expect(fruitForm('kirsche')).toBe('breit');
    expect(fruitForm('baumnuss')).toBe('gross');
    expect(fruitForm('heidelbeere')).toBe('busch');
    expect(fruitForm('traube')).toBe('rebe');
  });
  it('fällt für Unbekanntes ruhig auf einen runden Baum zurück', () => {
    expect(fruitForm('xyz')).toBe('rund');
  });
});

describe('gardenStage: Ausfüllstand → Wuchsstufe', () => {
  it('bildet vier Stufen an denselben Schwellen wie der Einzelbaum ab', () => {
    expect(gardenStage(0)).toBe(1);
    expect(gardenStage(14)).toBe(1);
    expect(gardenStage(15)).toBe(2);
    expect(gardenStage(39)).toBe(2);
    expect(gardenStage(40)).toBe(3);
    expect(gardenStage(69)).toBe(3);
    expect(gardenStage(70)).toBe(4);
    expect(gardenStage(100)).toBe(4);
  });
});

describe('gardenTrees: ein Bäumchen pro Lebensbereich', () => {
  const chapters = ['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'notfall', 'behoerden']
    .map(k => ({ key: k, title: 'T-' + k, fields: [{ k: 'f1' }, { k: 'f2' }] }));

  it('liefert alle 11 Bereiche, davon 4 ohne Kapitel als Setzling/Zukunft', () => {
    const trees = gardenTrees({}, chapters);
    expect(trees).toHaveLength(11);
    const future = trees.filter(t => t.future);
    expect(future.map(t => t.key).sort()).toEqual(['arbeit', 'familie', 'gesundheit', 'vorsorge']);
    expect(future.every(t => t.stage === 1)).toBe(true);
  });

  it('reift ein Bereich mit seinem Ausfüllstand (Person voll, Wohnen halb)', () => {
    const data = { basis: { f1: 'x', f2: 'y' }, wohnen: { f1: 'x' } };
    const trees = gardenTrees(data, chapters);
    const person = trees.find(t => t.key === 'person');
    const wohnen = trees.find(t => t.key === 'wohnen');
    expect(person.future).toBe(false);
    expect(person.pct).toBe(100);
    expect(person.stage).toBe(4);
    expect(person.chapterKey).toBe('basis');
    expect(wohnen.pct).toBe(50);
    expect(wohnen.stage).toBe(3);
  });

  it('jedes Bäumchen trägt seine Schweizer Frucht', () => {
    const trees = gardenTrees({}, chapters);
    const byKey = Object.fromEntries(trees.map(t => [t.key, t.fruit]));
    expect(byKey.finanzen).toBe('aprikose');
    expect(byKey.person).toBe('apfel');
    expect(byKey.familie).toBe('kirsche');
  });
});
