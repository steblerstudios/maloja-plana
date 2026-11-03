// Der Kanton rechnet einen Anspruch, zahlt ihn unter dem Mindestbetrag aber nicht aus: Dort stimmt «kein Anspruch»
// nicht (Rechtsprüfung 02.11.2026). Elf Kantonsmodule melden das über einen Schlüssel `ipv.*UnterMindestbetrag`.
export const ipvUnterMindestbetrag = (ipv) => !!ipv?.noteKey?.endsWith('UnterMindestbetrag');
