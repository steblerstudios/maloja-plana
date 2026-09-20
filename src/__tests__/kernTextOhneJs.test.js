import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// ─────────────────────────────────────────────────────────────
// SEO-Audit 20.09.2026, Massnahme B · docs/audits/seo-audit-2026-09-20.md
//
// Vor diesem Wächter enthielt der <noscript>-Block 18 Wörter, und die waren eine
// Fehlermeldung («Diese App benötigt JavaScript»). Weil Maloja clientseitig
// rendert, war das der EINZIGE Fliesstext der ganzen Domain — und damit die
// Grundlage, aus der KI-Crawler ohne JS-Ausführung (GPTBot, PerplexityBot,
// ClaudeBot) ihr Bild von Maloja Plana bauen.
//
// Dieser Test hält drei Dinge fest, die leicht wieder wegrutschen:
//   1. dass überhaupt Substanz drinsteht (Wortzahl)
//   2. dass die Wahrheits-Disziplin mitkommt — Orientierungs-Vorbehalt und der
//      Hinweis auf die geschlossene Beta. Ein Kern-Text, der mehr verspricht als
//      die App hält, wäre schlimmer als keiner.
//   3. dass die Seite ohne JavaScript überhaupt etwas zeigt: #root muss
//      eingeklappt sein (sonst steht der Text eine Bildschirmhöhe unter der
//      Kante), und die Farben müssen für hell UND dunkel sitzen — über
//      prefers-color-scheme, nicht über data-theme, denn theme-init.js ist
//      selbst ein Script und läuft ohne JavaScript nie.
// ─────────────────────────────────────────────────────────────

const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');

// HTML-Kommentare zuerst weg: sie nennen selbst «noscript» und würden eine
// naive Suche auf die falsche Stelle setzen (genau das ist beim Messen passiert).
const ohneKommentare = html.replace(/<!--[\s\S]*?-->/g, '');

// Es gibt ZWEI <noscript>-Blöcke: den Stilblock im <head> und den Kern-Text im
// <body>. Deshalb nach Inhalt auswählen, nicht nach Reihenfolge — die erste
// Fassung dieses Tests griff den Stilblock und meldete 44 Wörter.
const alleNoscript = [...ohneKommentare.matchAll(/<noscript>([\s\S]*?)<\/noscript>/g)].map((m) => m[1]);
const noscript = alleNoscript.find((b) => b.includes('kern-text') && !b.trim().startsWith('<style')) || '';
const kopfBlock = alleNoscript.find((b) => b.trim().startsWith('<style')) || '';
const text = noscript.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

describe('Kern-Text ohne JavaScript — was ein JS-loser Crawler liest', () => {
  it('der noscript-Block existiert und wurde gefunden', () => {
    expect(noscript.length).toBeGreaterThan(0);
  });

  it('enthält echten Fliesstext, nicht nur eine Fehlermeldung', () => {
    // 150 als Boden, nicht als Ziel: darunter ist es keine Beschreibung mehr.
    // Stand 20.09.2026: 316 Wörter.
    expect(text.split(' ').length).toBeGreaterThanOrEqual(150);
  });

  it('nennt, was die App tatsächlich kann', () => {
    for (const begriff of [
      'Lebensordner', 'Schweiz', 'Steuern', 'Prämienverbilligung',
      'Sozialhilfe', 'Mindestlohn', 'Notfallkarte',
    ]) {
      expect(text).toContain(begriff);
    }
  });

  it('trägt den Orientierungs-Vorbehalt — keine Beratung versprechen', () => {
    expect(text).toContain('keine Rechts- oder Finanzberatung');
    expect(text).toContain('zuständigen Stelle');
  });

  it('sagt ehrlich, dass die App in einer geschlossenen Beta ist', () => {
    expect(text).toMatch(/geschlossenen Beta/);
    expect(text).toMatch(/Zugangscode/);
  });

  it('sagt weiterhin, dass die Anwendung JavaScript braucht', () => {
    expect(text).toContain('JavaScript');
  });

  it('hat genau eine h1 im Block', () => {
    expect((noscript.match(/<h1[\s>]/g) || []).length).toBe(1);
  });

  it('lässt #root ohne JavaScript keinen Platz belegen', () => {
    // Sonst steht der Kern-Text eine volle Bildschirmhöhe unter der Kante und
    // die Seite wirkt leer — am 20.09.2026 im Browser gemessen (y=768 bei 768).
    expect(kopfBlock).toMatch(/#root\s*\{\s*display:\s*none/);
  });

  it('setzt die Farben für hell UND dunkel — ohne data-theme', () => {
    // Die Dark-Mode-Falle aus src/CLAUDE.md, mit einem Zusatz: theme-init.js ist
    // selbst ein Script und läuft ohne JavaScript nie. data-theme wird also nie
    // gesetzt, eine :root[data-theme=…]-Regel wäre hier tot. Nur
    // prefers-color-scheme greift.
    expect(kopfBlock).toMatch(/body\s*\{[^}]*color:/);
    expect(kopfBlock).toMatch(/@media \(prefers-color-scheme: dark\)/);
    expect(kopfBlock).not.toMatch(/data-theme/);
  });

  it('der Wächter würde den alten Zustand bemerken', () => {
    // Gegenprobe auf dem echten alten Block — sonst misst der Test nur sich
    // selbst (vgl. «eine Kennzahl muss unterscheiden»).
    const alt = `<div><h1>Maloja Plana</h1>
      <p>Diese App benötigt JavaScript. Bitte aktiviere JavaScript in deinen Browser-Einstellungen.</p>
      <p>This app requires JavaScript to run.</p></div>`;
    const altText = alt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    expect(altText.split(' ').length).toBeLessThan(150);
    expect(altText).not.toContain('Lebensordner');
  });
});
