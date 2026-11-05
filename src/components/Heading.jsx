import React from 'react';
import { text, weight, space, fontFamilyDisplay } from '../config/tokens.js';

// Drei klare Überschriften-Rollen (Konsistenz-Baustein aus dem Design-Audit).
// Das HTML-Tag folgt der BEDEUTUNG, nicht der Grösse — damit Screenreader die
// Dokumentstruktur korrekt lesen (vorher war <h2> alles von 13px bis 28px).
// Flex nur bei inline-Icon, sonst bleiben zentrierte Hero-Titel unberührt.

// Lange Wörter dürfen umbrechen (Messung 23.10.2026): «Arbeitslosenentschädigung» mass in
// 28 px 374 px und wurde auf 320-px-Handys rechts abgeschnitten (html: overflow-x clip).
// Trennung nach Sprache (html lang), Notumbruch nur, wenn ein Wort allein nicht passt.
const umbruch = { overflowWrap: 'break-word', hyphens: 'auto', WebkitHyphens: 'auto' };
// Mit Icon ist der Titel ein Flex-Behälter: der Text braucht einen eigenen Kasten mit
// min-width 0, sonst bleibt er so breit wie sein längstes Wort.
const titelText = (children) => React.createElement('span', { style: { minWidth: 0, ...umbruch } }, children);

// Seitentitel: genau einer pro Ansicht. Fassung 9 (F9-A1, 05.11.2026): EIN Rezept für alle
// Seiten — Hanken Grotesk 30 px wie Entwurf G (Stebler Studios 27.10.2026, «Kopf-Titel 30 px in
// der Display-Schrift»), Markenhandbuch §3 «Editoriale Headlines: Hanken». Vorher trugen
// Kapitel, Abläufe und «Was ansteht» das Rezept als Überschreibung, Rechner eine eigene Grösse
// und rund zwanzig Seiten Lexend 28 px. Wächter: kopfTitelGleich.test.js.
export const SEITENTITEL_STIL = { fontFamily: fontFamilyDisplay, fontSize: '30px', lineHeight: 1.1, letterSpacing: '-0.015em', fontWeight: weight.bold };
export const PageTitle = ({ palette, children, icon, style, ...rest }) =>
  React.createElement('h2', {
    style: {
      ...(icon ? { display: 'inline-flex', alignItems: 'center', gap: space.sm + 'px', maxWidth: '100%' } : {}),
      ...umbruch,
      ...SEITENTITEL_STIL, color: palette.text, margin: 0, ...style,
    }, ...rest,
  }, icon || null, icon ? titelText(children) : children);

// Karten-/Abschnittstitel (19px semi, optionales Icon). `as` setzt die Stufe, wo der Titel
// eine Seite ohne PageTitle eröffnet (h2) — das Aussehen bleibt gleich (F9-A3).
export const PanelTitle = ({ palette, children, icon, as = 'h3', style, ...rest }) =>
  React.createElement(as, {
    style: {
      ...(icon ? { display: 'inline-flex', alignItems: 'center', gap: space.sm + 'px', maxWidth: '100%' } : {}),
      ...umbruch,
      fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: 0, ...style,
    }, ...rest,
  }, icon || null, icon ? titelText(children) : children);

// Kleines Kicker-Label — standardmässig KEINE Überschrift (kein h*), damit die
// Screenreader-Struktur sauber bleibt (13px uppercase).
// `as` nur dort setzen, wo das Label tatsächlich einen Abschnitt betitelt und
// nicht bloss darüber steht (z. B. «Werkzeuge & Features»). Das Aussehen bleibt
// identisch — es ändert sich allein das Tag und damit die Sprungmarke.
export const Eyebrow = ({ palette, children, as = 'div', style, ...rest }) =>
  React.createElement(as, {
    style: {
      // `margin: 0` ist für das <div> ein Nulleffekt und hält das Aussehen
      // gleich, sobald `as` ein h* ist (h3 brächte sonst den Browser-Rand mit).
      fontSize: text.xs, fontWeight: weight.semi, textTransform: 'uppercase',
      letterSpacing: '0.5px', color: palette.mid, margin: 0, ...style,
    }, ...rest,
  }, children);
