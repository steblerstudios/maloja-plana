import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { SEITEN, SONDERSEITEN, QUELLEN, BASIS, GEPRUEFT } from '../../scripts/seiten-inhalt.mjs';
import { SPRACHEN } from '../../scripts/seiten-sprachen.mjs';

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
      //
      // EINE benannte Ausnahme: das sichtbare Prüfdatum («Inhaltlich geprüft:
      // September 2026»). Es kam auf Empfehlung der Rechtsprüfung dazu, weil die
      // Seiten Recht erklären, das jährlich ändert. Die Ausnahme ist der exakte
      // String, nicht ein aufgeweichtes Muster — sonst wäre die Regel offen für
      // jede Jahreszahl.
      const ausnahme = `Inhaltlich geprüft: ${GEPRUEFT}.`;
      expect(text, 'Prüfdatum fehlt — dann darf auch die Ausnahme nicht gelten')
        .toContain(ausnahme);
      const zuPruefen = text.split(ausnahme).join(' ');
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
        expect(zuPruefen, `Muster ${muster} im sichtbaren Text von /${pfad}/`).not.toMatch(muster);
      }
    });

    it('verlinkt Impressum und Datenschutz — echter Link, nicht nur ein Satz', () => {
      // Blocker der Rechtsprüfung vom 20.09.2026: vorher stand dort nur «steht in
      // der App». Das war wahr, aber nicht adressierbar — BetaGate läuft vor dem
      // Hash-Router, /#/legal zeigt die Code-Wand. Art. 19 DSG verlangt, dass bei
      // der Beschaffung angemessen informiert wird; ein Satz ohne Link reicht nicht.
      expect(html).toContain('href="/rechtliches/"');
    });

    it('trägt den Orientierungs-Vorbehalt', () => {
      expect(text).toContain('keine Rechts- oder Finanzberatung');
      expect(text).toContain('zuständigen Stelle');
      // Und zwar auch WEIT OBEN: der ausführliche Vorbehalt steht nach dem FAQ und
      // der Werbekarte. Die Rechtsprüfung wollte eine kurze Zeile direkt unter dem
      // Vorspann — sonst liest ihn kaum jemand.
      const oben = text.slice(0, 700);
      expect(oben).toContain('keine Rechts- oder Finanzberatung');
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
      const pfade = [...SEITEN, ...SONDERSEITEN].map((s) => s.pfad);
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

  // ─── Die Rechtliches-Seite ───────────────────────────────────────────────
  // Sie ist keine Erklärseite: kein FAQ, keine Werbekarte, kein Quellen-Block.
  // Sie ist die Antwort auf den Blocker der Rechtsprüfung — eine öffentlich
  // erreichbare, adressierbare Stelle mit Impressum und Datenschutz.
  describe('/rechtliches/', () => {
    const html = lies('rechtliches');
    const text = sichtbar(html);

    it('nennt die Anbieterin, eine Kontaktadresse und das anwendbare Recht', () => {
      expect(text).toContain('Stebler Studios');
      expect(text).toContain('Basel');
      expect(html).toContain('mailto:info@malojaplana.ch');
      expect(text).toContain('Gerichtsstand ist Basel-Stadt');
      // 23.09.2026: Hier stand `toContain('Art. 3 Abs. 1 lit. s UWG')` — das
      // pinnte EINE Schreibweise der Fundstelle («lit.»), nicht die Zusage.
      // Die amtliche Sammlung schreibt «Bst.», und genau darauf zeigt die Seite
      // jetzt. Geprüft wird deshalb die Sache: der Artikel ist genannt UND
      // belegt. Die Ausformulierung hütet `impressumAdresse.test.js`.
      expect(text).toMatch(/Art\. 3 Abs\. 1 (lit|Bst)\. s/);
      expect(html).toContain('fedlex.admin.ch/eli/cc/1988/223_223_223');
    });

    it('sagt, welche Daten beim blossen Aufruf anfallen', () => {
      // Art. 19 DSG: bei der Beschaffung angemessen informieren. Beim Abruf fallen
      // Server-Logs beim Hoster an — das muss dastehen, sonst ist die Seite zwar
      // vorhanden, aber inhaltlich leer an genau der Stelle, für die es sie gibt.
      expect(text).toContain('Infomaniak');
      expect(text).toContain('IP-Adresse');
      expect(text).toContain('Server-Logs');
    });

    it('trägt den Haftungsausschluss im Volltext', () => {
      expect(text).toContain('ersetzt keine Rechts-, Steuer-, Versicherungs- oder Finanzberatung');
    });

    it('ist keine Erklärseite — kein FAQ-Schema, keine Werbekarte', () => {
      const typen = jsonLd(html)['@graph'].map((k) => k['@type']);
      expect(typen).not.toContain('FAQPage'); // leeres Schema wäre eine Behauptung
      expect(typen).toContain('WebPage');
      expect(html).not.toContain('class="karte"');
    });

    it('kommt ohne JavaScript aus und hat genau eine h1', () => {
      const skripte = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
      for (const attr of skripte) expect(attr).toContain('application/ld+json');
      expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
    });

    it('führt zurück zu den Erklärseiten', () => {
      for (const s of SEITEN) expect(html).toContain(`href="/${s.pfad}/"`);
    });
  });

  describe('sitemap.xml', () => {
    const xml = fs.readFileSync(path.resolve(WURZEL, 'public', 'sitemap.xml'), 'utf8');
    // Ohne den erklaerenden Kommentar: der nennt '?lang=' selbst, um zu sagen,
    // warum es raus ist. Die Pruefung gilt den Eintraegen, nicht der Erklaerung.
    const eintraege = xml.replace(/<!--[\s\S]*?-->/g, '');

    it('führt die Startseite und jede Erklärseite', () => {
      expect(xml).toContain(`<loc>${BASIS}/</loc>`);
      for (const s of [...SEITEN, ...SONDERSEITEN]) expect(xml).toContain(`<loc>${BASIS}/${s.pfad}/</loc>`);
    });

    it('führt keine nicht-kanonischen URLs mehr', () => {
      expect(eintraege).not.toContain('?lang=');
    });

    it('enthält genau so viele Einträge wie es Seiten gibt, plus die Startseite', () => {
      // Seit 21.09.2026 mal die FREIGEGEBENEN Sprachen. Die Zahl stand hier
      // fest auf «Seiten + 1»; sie wäre gebrochen, sobald eine zweite Sprache
      // freigegeben wird — und zwar aus dem falschen Grund. Dass nur
      // freigegebene Sprachen drinstehen dürfen, prüft
      // src/__tests__/erklaerseitenSprachen.test.js.
      const freie = SPRACHEN.filter((s) => s.freigegeben).length;
      expect((xml.match(/<loc>/g) || []).length)
        .toBe((SEITEN.length + SONDERSEITEN.length) * freie + 1);
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
