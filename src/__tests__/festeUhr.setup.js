// Feste Test-Uhr: «heute» steht auf dem 22.10.2026, schon beim Laden der Testdatei
// und vor wie nach jedem Test.
//
// Warum: Mindestlohn (lohnCheck) und Prämienverbilligung (IPV) sind jahresgebunden.
// Liegt «heute» nicht im Jahr der hinterlegten Werte, zeigt die App bewusst keine
// Zahl («Jahr nicht belegt»). Die meisten Tests nehmen still an, dass «heute» 2026
// ist. Ohne feste Uhr waren am 1.1.2027 57 Testdateien rot (712 Tests, gemessen
// 22.10.2026 mit verschobener Uhr), und der Commit-Hook hätte jeden Commit blockiert.
//
// Warum auch beim Laden und nach jedem Test, nicht nur davor: Manche Tests rechnen
// schon beim Sammeln (`const html = generateLetter(...)` direkt im describe) oder in
// beforeAll, und manche Module lesen das Jahr beim Import. Beides läuft vor dem
// ersten beforeEach.
//
// Tests, die den Riegel selbst prüfen, setzen ihre Zeit weiter selbst
// (vi.setSystemTime) und dürfen danach vi.useRealTimers() rufen: das afterEach hier
// setzt die feste Uhr gleich wieder.
//
// Wenn die Werte 2027 eingebaut sind: dieses Datum ins Jahr 2027 schieben.
import { beforeEach, afterEach, vi } from 'vitest';

export const TEST_HEUTE = new Date('2026-10-22T10:00:00Z');

function festeUhr() {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(TEST_HEUTE);
}

festeUhr();
beforeEach(festeUhr);
afterEach(festeUhr);
