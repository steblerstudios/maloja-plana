import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { SEITEN, QUELLEN, BASIS } from '../../scripts/seiten-inhalt.mjs';

// ─────────────────────────────────────────────────────────────
// Öffentliche Erklärseiten · Entscheid Stebler Studios 20.09.2026
// docs/audits/seo-audit-2026-09-20.md — Massnahme A, E, G
//
// Die Seiten liegen VOR dem Beta-Gate und sind der erste indexierbare Inhalt,
// den Maloja Plana überhaupt hat. Sie sind erzeugt (scripts/build-seiten.mjs)
// und committet. Dieser Wächter hält zusammen, was leicht auseinanderläuft:
//
//   • Quelle und erzeugte Datei (sonst geht live etwas anderes als im Diff steht)
//   • KEINE ZAHLEN — die wichtigste Regel. Beträge, Grenzen und Fristen sind
//     kantonal verschieden und ändern jährlich. Eine Zahl auf einer statischen
//     Seite ist in zwölf Monaten falsch, und niemand merkt es. Die Zahlen leben
//     in der App, wo sie versioniert, belegt und getestet sind.
//   • FAQPage-JSON-LD nur mit sichtbaren Antworten — Google verlangt genau das,
//     und die Wahrheits-Disziplin ohnehin.
//   • Nur geprüfte amtliche Links.
// ─────────────────────────────────────────────────────────────

const WURZEL = process.cwd();
const lies = (pfad) => fs.readFileSync(path.resolve(WURZEL, 'public', pfad, 'index.html'), 'utf8');

// Sichtbarer Text: Skripte (JSON-LD!) und Stil raus, dann Tags.
const sichtbar = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const jsonLd = (html) => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return m ? JSON.parse(m[1]) : null;
};

describe('Öffentliche Erklärseiten', () => {
  it('Quelle und erzeugte Dateien stimmen überein', () => {
    // Ruft den Generator im Prüfmodus. Schlägt fehl, wenn jemand eine erzeugte
    // Datei von Hand bearbeitet oder den Inhalt geändert, aber nicht neu gebaut hat.
    execFileSync('node', ['scripts/build-seiten.mjs', '--pruefen'], { cwd: WURZEL });
  });

  it('es gibt mindestens die vier Seiten aus dem Entscheid', () => {
    const pfade = SEITEN.map((s) => s.pfad);
    for (const p of ['was-steht-mir-zu', 'praemienverbilligung', 'sozialhilfe', 'steuern']) {
      expect(pfade).toContain(p);
    }
  });

  describe.each(SEITEN.map((s) => [s.pfad, s]))('/%s/', (pfad, seite) => {
    const html = lies(pfad);
    const text = sichtbar(html);

    it('trägt Titel und Beschreibung in brauchbarer Länge', () => {
      const titel = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
      expect(titel).toContain(seite.titel);
      expect(titel.length).toBeLessThanOrEqual(65); // Schwelle aus scripts/check-seo.sh
      expect(seite.beschreibung.length).toBeGreaterThanOrEqual(70);
      expect(seite.beschreibung.length).toBeLessThanOrEqual(160);
    });

    it('zeigt auf sich selbst als kanonische Adresse', () => {
      expect(html).toContain(`<link rel="canonical" href="${BASIS}/${pfad}/">`);
      expect(html).toContain(`<meta property="og:url" content="${BASIS}/${pfad}/">`);
    });

    it('hat genau eine h1 und ist auf Deutsch ausgezeichnet', () => {
      expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
      expect(html).toContain('<html lang="de">');
    });

    it('darf indexiert werden', () => {
      expect(html).toContain('content="index, follow"');
    });

    it('nennt KEINE Beträge, Prozentsätze oder Einkommensgrenzen', () => {
      // Die Kernregel. Solche Angaben sind kantonal verschieden und ändern
      // jährlich — auf einer statischen Seite veralten sie unbemerkt.
      const verboten = [
        /\bCHF\b/i,
        /\bFr\.\s*\d/,
        /\bFranken\b/i,
        /\d+\s*%/,
        /\d[\d'’.]*\s*(Franken|CHF)/i,
        /\b\d{4,}\b/,          // 1000er-Beträge und Jahreszahlen
        /\b\d{1,3}['’]\d{3}\b/, // Schweizer Tausendertrennung: 50'000
      ];
      for (const muster of verboten) {
        expect(text, `Muster ${muster} im sichtbaren Text von /${pfad}/`).not.toMatch(muster);
      }
    });

    it('trägt den Orientierungs-Vorbehalt', () => {
      expect(text).toContain('keine Rechts- oder Finanzberatung');
      expect(text).toContain('zuständigen Stelle');
    });

    it('sagt, dass die App in einer geschlossenen Beta ist', () => {
      expect(text).toContain('geschlossenen Beta');
    });

    it('verlinkt nur geprüfte amtliche Quellen nach aussen', () => {
      const erlaubt = new Set([
        ...Object.values(QUELLEN).map((s) => s.url),
        'https://www.gnu.org/licenses/agpl-3.0.html',
        'https://github.com/steblerstudios/maloja-plana',
      ]);
      // Die eigene Domain ist kein externer Link — canonical und og:url zeigen
      // absolut auf die Seite selbst.
      const extern = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)]
        .map((m) => m[1])
        .filter((u) => !u.startsWith(BASIS));
      for (const url of extern) {
        expect(erlaubt, `nicht geprüfter externer Link: ${url}`).toContain(url);
      }
      expect(extern.length).toBeGreaterThan(0);
    });

    it('verlinkt intern nur auf Seiten, die es gibt', () => {
      const intern = [...html.matchAll(/href="\/([a-z0-9-]+)\/"/g)].map((m) => m[1]);
      const pfade = SEITEN.map((s) => s.pfad);
      for (const ziel of intern) expect(pfade).toContain(ziel);
      // Jede Seite führt zurück in die App und weiter zu den anderen.
      expect(html).toContain('href="/"');
      expect(intern.length).toBeGreaterThan(0);
    });

    it('das FAQ-Schema enthält nur Antworten, die auch sichtbar dastehen', () => {
      // Google verlangt für FAQPage, dass Frage und Antwort auf der Seite
      // sichtbar sind. Ohne diese Prüfung wäre das Schema eine Behauptung.
      const ld = jsonLd(html);
      const faq = ld['@graph'].find((k) => k['@type'] === 'FAQPage');
      expect(faq.mainEntity.length).toBe(seite.faq.length);
      expect(faq.mainEntity.length).toBeGreaterThanOrEqual(3);
      for (const frage of faq.mainEntity) {
        expect(text).toContain(frage.name);
        expect(text).toContain(frage.acceptedAnswer.text);
      }
    });

    it('hat gültiges JSON-LD mit Brotkrume und Seiten-Knoten', () => {
      const ld = jsonLd(html);
      const typen = ld['@graph'].map((k) => k['@type']);
      expect(typen).toContain('WebPage');
      expect(typen).toContain('BreadcrumbList');
      expect(typen).toContain('FAQPage');
    });

    it('kommt ohne JavaScript aus', () => {
      // Der ganze Zweck dieser Seiten. Ein <script> hier wäre nur dann in
      // Ordnung, wenn es application/ld+json ist.
      const skripte = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
      for (const attr of skripte) expect(attr).toContain('application/ld+json');
    });

    it('setzt Farben für hell und dunkel', () => {
      expect(html).toMatch(/@media \(prefers-color-scheme: dark\)/);
    });
  });

  describe('sitemap.xml', () => {
    const xml = fs.readFileSync(path.resolve(WURZEL, 'public', 'sitemap.xml'), 'utf8');
    // Ohne den erklaerenden Kommentar: der nennt '?lang=' selbst, um zu sagen,
    // warum es raus ist. Die Pruefung gilt den Eintraegen, nicht der Erklaerung.
    const eintraege = xml.replace(/<!--[\s\S]*?-->/g, '');

    it('führt die Startseite und jede Erklärseite', () => {
      expect(xml).toContain(`<loc>${BASIS}/</loc>`);
      for (const s of SEITEN) expect(xml).toContain(`<loc>${BASIS}/${s.pfad}/</loc>`);
    });

    it('führt keine nicht-kanonischen URLs mehr', () => {
      expect(eintraege).not.toContain('?lang=');
    });

    it('enthält genau so viele Einträge wie es Seiten gibt, plus die Startseite', () => {
      expect((xml.match(/<loc>/g) || []).length).toBe(SEITEN.length + 1);
    });
  });

  it('der Wächter würde eine Zahl auf einer Seite bemerken', () => {
    // Gegenprobe: die Zahlen-Regel muss für einen Text mit Betrag anschlagen,
    // sonst misst sie nur sich selbst.
    const mitBetrag = sichtbar('<p>Der Grundbedarf beträgt CHF 1’031 pro Monat.</p>');
    expect(mitBetrag).toMatch(/\bCHF\b/i);
    expect(mitBetrag).toMatch(/\b\d{1,3}['’]\d{3}\b/);
  });
});
