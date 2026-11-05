import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { HINTERGRUND, KRANKENKASSE } from '../../scripts/seiten/krankenkasse.mjs';
import { KANTONE_IM_VERGLEICH } from '../../scripts/seiten/kantone-im-vergleich.mjs';
import { KANTONE, EBENEN, PAARE, korrelation, rangkorrelation, staerke, KITA_NICHT_VERGLICHEN, KITA_BUND_2027 } from '../../scripts/seiten-vergleich.mjs';
import de from '../i18n/de.js';
import { kantonsPraemien, einsetzen, zahlen, PRAEMIENJAHR, BEWEGT, ATLAS_PRAEMIEN } from '../../scripts/seiten-figuren.mjs';
import { BASIS } from '../../scripts/seiten-inhalt.mjs';
import { PRAEMIEN, GEMEINDEN } from '../data/praemienRegionenDaten.js';
import { NATIONAL_AVG_PREMIUM_JE_JAHR } from '../data/praemienRegionen.js';
import { FRANCHISE_STUFEN, SELBSTBEHALT_MAX } from '../data/kvgLeistungen.js';

// ─────────────────────────────────────────────────────────────
// Hintergrundseiten · Entscheid Stebler Studios 04.11.2026 («Weg A»)
//
// Anders als die Erklärseiten DÜRFEN diese Seiten Zahlen nennen (Begründung:
// scripts/seiten/krankenkasse.mjs, Kopf). Dafür hält dieser Wächter drei Riegel:
//
//   • Was Maloja führt, steht so auf der Seite, wie es in src/data steht —
//     Prämien je Kantonsregion, Schweizer Mittel, Franchise und Dach.
//   • Der Stand ist sichtbar, und nach `pruefenBis` wird dieser Test rot, bis
//     jemand den Text gegen die neuen BAG-Zahlen gelesen hat.
//   • Kein Skript, nur Deutsch, keine Übersetzung, auf die verwiesen würde.
// ─────────────────────────────────────────────────────────────

const WURZEL = process.cwd();
const lies = (pfad) => fs.readFileSync(path.resolve(WURZEL, 'public', pfad, 'index.html'), 'utf8');
const sichtbar = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const rp = (n) => Number(n).toFixed(2);

describe('Hintergrundseiten', () => {
  it('kennt die Krankenkassen-Seite', () => {
    expect(HINTERGRUND.map((h) => h.pfad)).toContain('krankenkasse');
  });

  describe.each(HINTERGRUND.map((h) => [h.pfad, h]))('/%s/', (pfad, seite) => {
    const html = lies(pfad);
    const text = sichtbar(html);

    it('ist noch nicht über ihr Prüfdatum hinaus', () => {
      // Absichtlich ein Datum: die Zahlen veralten jedes Jahr Ende September.
      // Wird das rot, Text gegen die neuen BAG-Zahlen lesen, dann `pruefenBis`
      // und `stand` in scripts/seiten/<pfad>.mjs nachführen.
      expect(seite.pruefenBis).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const heute = new Date().toISOString().slice(0, 10);
      expect(heute <= seite.pruefenBis,
        `${pfad}: Prüfdatum ${seite.pruefenBis} überschritten — Zahlen und Text gegen das neue Prämienjahr lesen`).toBe(true);
    });

    it('zeigt sichtbar, welchen Stand die Zahlen haben', () => {
      expect(text).toContain('Stand der Zahlen:');
      expect(text).toContain(`Prämien ${PRAEMIENJAHR}`);
    });

    it('lässt keinen Platzhalter und keinen Figur-Block stehen', () => {
      expect(html).not.toMatch(/\{\{|\}\}/);
      expect(html).not.toMatch(/<!--(FIG|TAB):/);
    });

    it('sagt nicht «nennt bewusst keine Beträge» — das gilt hier nicht', () => {
      expect(text).not.toMatch(/nennt bewusst keine Beträge/);
      expect(text).toContain('keine Rechts-, Versicherungs- oder Finanzberatung');
    });

    it('nennt im Quellen-Hinweis keine Stelle, die gar nicht verlinkt ist', () => {
      // Rechtsprüfung 04.11.2026: der Rahmentext der Erklärseiten nennt die SKOS.
      expect(text).toContain(seite.quellenHinweis);
      if (!seite.quellen.some((q) => /skos/i.test(q.url))) expect(text).not.toContain('SKOS');
    });

    it('ist indexierbar, auf Deutsch, mit sich selbst als kanonischer Adresse', () => {
      expect(html).toContain('<html lang="de">');
      expect(html).toContain('<meta name="robots" content="index, follow">');
      expect(html).toContain(`<link rel="canonical" href="${BASIS}/${pfad}/">`);
      expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
    });

    it('kommt ohne JavaScript aus', () => {
      const skripte = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
      for (const attr of skripte) expect(attr).toContain('application/ld+json');
      expect(html).toContain("default-src 'none'");
    });

    it('gibt es nur auf Deutsch — kein hreflang, keine Übersetzung, kein Link darauf', () => {
      expect(html).not.toContain('hreflang=');
      for (const code of ['fr', 'it', 'en', 'rm']) {
        expect(fs.existsSync(path.resolve(WURZEL, 'public', code, pfad, 'index.html'))).toBe(false);
      }
      expect(text).toContain('diese Seite gibt es bisher nur auf Deutsch');
    });

    it('jede Figur ist ein beschriftetes Bild mit Titel und Beschreibung', () => {
      const svgs = [...html.matchAll(/<svg [^>]*>([\s\S]*?)<\/svg>/g)];
      if (pfad === 'krankenkasse') expect(svgs.length).toBe(5);
      for (const [ganz, innen] of svgs) {
        expect(ganz).toMatch(/role="img"/);
        expect(ganz).toMatch(/aria-labelledby="[^"]+-t [^"]+-d"/);
        expect(innen).toMatch(/<title id="[^"]+">[^<]{10,}<\/title>/);
        expect(innen).toMatch(/<desc id="[^"]+">[^<]{20,}<\/desc>/);
      }
    });

    it('verlinkt nach aussen nur die eingetragenen Quellen', () => {
      const erlaubt = new Set([
        ...seite.quellen.flatMap((q) => [q.url, q.auch?.url].filter(Boolean)),
        'https://www.gnu.org/licenses/agpl-3.0.html',
        'https://github.com/steblerstudios/maloja-plana',
      ]);
      const extern = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'))
        .filter((u) => !u.startsWith(BASIS));
      for (const u of extern) expect(erlaubt, `nicht eingetragener Link: ${u}`).toContain(u);
      for (const q of seite.quellen) expect(q.url).toMatch(/^https:\/\//);
    });

    it('steht einmal in der Sitemap, ohne Sprach-Alternativen', () => {
      const xml = fs.readFileSync(path.resolve(WURZEL, 'public', 'sitemap.xml'), 'utf8');
      const loc = `<loc>${BASIS}/${pfad}/</loc>`;
      expect(xml.split(loc).length - 1).toBe(1);
      const eintrag = xml.slice(xml.indexOf(loc), xml.indexOf('</url>', xml.indexOf(loc)));
      expect(eintrag).not.toContain('xhtml:link');
    });
  });

  // ─── Die Zahlen kommen aus Malojas Daten ─────────────────────────────────
  describe('/krankenkasse/ · Zahlen aus src/data', () => {
    const html = lies('krankenkasse');
    const text = sichtbar(html);
    // Die Zahlenansicht unter dem Kantonsbild trägt die Kantonsmittel, aufklappbar
    // darunter die Werte je Region; das Bild zeigt nur die Verhältnisse.
    const zahlenansicht = html.match(/<div class="tabelle zahlen"[^>]*>[\s\S]*?<\/details>/)[0];

    it('die Kantonsatlas-Kopie passt 2027 zur Prämienregionen-Datei', () => {
      // Eine Quelle, zwei Dateien: bei einer Region gleich, sonst dazwischen.
      for (const k of Object.keys(ATLAS_PRAEMIEN).filter((x) => x !== 'CH')) {
        const regionen = Object.entries(PRAEMIEN[PRAEMIENJAHR]).filter(([key]) => key.slice(0, 2) === k);
        expect(regionen.length, k).toBeGreaterThan(0);
        ['kind', 'jung', 'erw'].forEach((g, i) => {
          const werte = regionen.map(([, w]) => w[i]);
          const a = ATLAS_PRAEMIEN[k][g][`y${PRAEMIENJAHR.slice(2)}`];
          if (werte.length === 1) expect(a, `${k} ${g}`).toBe(werte[0]);
          else {
            expect(a, `${k} ${g}`).toBeGreaterThanOrEqual(Math.min(...werte));
            expect(a, `${k} ${g}`).toBeLessThanOrEqual(Math.max(...werte));
          }
        });
      }
      // Das Schweizer Mittel des Atlas ist dasselbe wie in praemienRegionen.js.
      const m = NATIONAL_AVG_PREMIUM_JE_JAHR[PRAEMIENJAHR];
      expect(ATLAS_PRAEMIEN.CH.erw.y27).toBe(m.erwachsene);
      expect(ATLAS_PRAEMIEN.CH.alle.y27).toBe(m.gesamt);
    });

    it('die Zahlenansicht zeigt jeden Kanton mit seinem Kantonsmittel, aufsteigend', () => {
      const kantone = kantonsPraemien();
      expect(kantone.length).toBe(26);
      const zeilen = [...zahlenansicht.matchAll(/<tr><th scope="row">([^<]+)<\/th><td class="balken"[^>]*><span style="width:[\d.]+%"><\/span><\/td><td class="n">([\d.]+)<\/td>/g)];
      expect(zeilen.length).toBe(26);
      const werte = zeilen.map((z) => Number(z[2]));
      expect(werte).toEqual([...werte].sort((x, y) => x - y));
      for (const k of kantone) expect(zahlenansicht).toContain(`<th scope="row">${k.name}</th>`);
      for (const k of kantone) expect(werte).toContain(ATLAS_PRAEMIEN[k.kanton].erw.y27);
    });

    it('nennt für Kantone mit mehreren Regionen jede Region, aufklappbar', () => {
      const mehrere = kantonsPraemien().filter((k) => !k.eineRegion);
      expect(mehrere.map((k) => k.kanton).sort()).toEqual(
        ['BE', 'BL', 'FR', 'GR', 'LU', 'SG', 'SH', 'TI', 'VD', 'VS', 'ZH']);
      for (const k of mehrere) for (const r of k.regionen) expect(zahlenansicht).toContain(`Region ${r.region}: ${rp(r.erwachsene)}`);
      // Die Zürcher Tabellenzeile: Kantonsmittel, dahinter die Spanne der Regionen.
      expect(text).toContain(`Zürich ${rp(ATLAS_PRAEMIEN.ZH.erw.y27)} (Regionen ${rp(PRAEMIEN[PRAEMIENJAHR].ZH3[2])} bis ${rp(PRAEMIEN[PRAEMIENJAHR].ZH1[2])})`);
    });

    it('der tiefste und der höchste Kanton im Text sind die aus den Daten', () => {
      const mittel = Object.entries(ATLAS_PRAEMIEN).filter(([k]) => k !== 'CH').map(([k, v]) => [k, v.erw.y27]);
      const tief = mittel.reduce((a, b) => (b[1] < a[1] ? b : a));
      const hoch = mittel.reduce((a, b) => (b[1] > a[1] ? b : a));
      expect(text).toContain(`im Schnitt in Zug ${rp(tief[1])} Franken, in Genf ${rp(hoch[1])} Franken`);
      expect(tief[0]).toBe('ZG');
      expect(hoch[0]).toBe('GE');
    });

    it('das Schweizer Mittel stammt aus praemienRegionen.js', () => {
      const m = NATIONAL_AVG_PREMIUM_JE_JAHR[PRAEMIENJAHR];
      for (const v of [m.erwachsene, m.junge, m.kinder, m.gesamt]) expect(text).toContain(rp(v));
    });

    it('Franchise und Dach stammen aus kvgLeistungen.js', () => {
      const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
      const min = Math.min(...FRANCHISE_STUFEN), max = Math.max(...FRANCHISE_STUFEN);
      expect(text).toContain(`zwischen ${fmt(min)} und ${fmt(max)} Franken`);
      expect(text).toContain(`höchstens ${fmt(min + SELBSTBEHALT_MAX)} bis ${fmt(max + SELBSTBEHALT_MAX)} Franken`);
    });

    it('das Zürcher Beispiel zu den Prämienregionen stimmt mit der Gemeindeliste', () => {
      const zh = Object.values(GEMEINDEN).filter((g) => g[0] === 'ZH');
      const region = (name) => zh.find((g) => g[1] === name)?.[2];
      expect(zh.filter((g) => g[2] === 1).map((g) => g[1])).toEqual(['Zürich']);
      for (const n of ['Winterthur', 'Uster', 'Dietikon']) expect(region(n)).toBe(2);
      for (const n of ['Bülach', 'Andelfingen']) expect(region(n)).toBe(3);
      expect(text).toContain('Winterthur, Uster und Dietikon sind in Region 2, Bülach und Andelfingen in Region 3');
    });
  });

  // ─── Kantone im Vergleich: Zahlen aus dem Kantonsatlas, ohne Rangliste ────
  describe('/kantone-im-vergleich/', () => {
    const html = lies('kantone-im-vergleich');
    const text = sichtbar(html);

    it('ordnet die Kantone nicht: keine Platzziffer, kein Rang, keine Wertungsfarben', () => {
      // «Rangfolge» (die Kontrollrechnung) ist erlaubt, eine Platzierung nicht.
      expect(text).not.toMatch(/\b(Rang \d|\d+\. Rang|Rang(liste)?:|Platz \d|\d+\. Platz|bester Kanton|schlechtester|Spitzenreiter|Schlusslicht)/i);
      expect(html).not.toMatch(/class="[^"]*(gut|schlecht|rot|gruen)[^"]*"/);
    });

    it('jede Ebene stammt aus dem Kantonsatlas — für jeden Kanton', () => {
      const nebeneinander = html.match(/<div class="tabelle breit"[\s\S]*?<\/table>/)[0];
      for (const k of KANTONE) {
        const zeile = nebeneinander.match(new RegExp(`<tr><th scope="row">${de.cantons[k]}</th>(.*?)</tr>`))[1];
        for (const key of ['praemie', 'lastNachIpv', 'steuer', 'miete', 'leer', 'sozialhilfe', 'el', 'alq', 'kinderzulage']) {
          expect(zeile, `${k} ${key}`).toContain(`>${EBENEN[key].fmt(EBENEN[key].wert(k))}<`);
        }
      }
      expect((nebeneinander.match(/<tr><th scope="row">/g) || []).length).toBe(26);
    });

    it('die Zusammenhänge sind aus den Daten gerechnet, nicht abgetippt', () => {
      for (const [, a, b, t] of PAARE) {
        const r = korrelation(a, b).toFixed(2).replace('.', ',').replace('-', '−');
        expect(html).toContain(`<th scope="row">${t.paar}</th>`);
        expect(html).toContain(`<td class="n">${r}</td>`);
      }
      expect(text).toContain('Ein Zusammenhang ist keine Erklärung, und er gilt für Kantone, nicht für Menschen');
      // Der Beispielsatz im Merkkasten muss von den Daten getragen sein.
      expect(staerke('praemie', 'sozialhilfe')).toBe('deutlich');
      expect(korrelation('praemie', 'sozialhilfe')).toBeGreaterThan(0);
    });

    it('nimmt die schwächere Stufe, wenn Pearson und Rangfolge auseinandergehen', () => {
      // Miete–Leerwohnungen: Pearson −0,70, Rangfolge −0,58 → «teilweise», nicht «deutlich».
      expect(Math.abs(korrelation('miete', 'leer'))).toBeGreaterThanOrEqual(0.6);
      expect(Math.abs(rangkorrelation('miete', 'leer'))).toBeLessThan(0.6);
      expect(staerke('miete', 'leer')).toBe('teilweise');
    });

    it('nennt den Kita-Abzug des Bundes mit seinem Steuerjahr, nicht dem Prämienjahr', () => {
      expect(text).toMatch(/Bei der direkten Bundessteuer liegt die Grenze im Steuerjahr 2026 bei 25'800 Franken je Kind/);
      expect(text).toMatch(/Ab 2027 sind es 25'900 Franken/);
      expect(html).toContain('/eli/cc/1991/1184_1184_1184/20260101/de');
    });

    it('nennt für den Kita-Abzug des Bundes die richtige Fundstelle (Rechtsprüfung 05.11.2026)', () => {
      // 25'800 Fr. gelten seit 1.1.2025 (AS 2024 479, Fussnote zu DBG Art. 33 Abs. 3);
      // AS 2025 579 ändert Art. 33 Abs. 3 nicht. 25'900 Fr. ab 2027 nur im Erlass AS 2026 486.
      expect(html).toContain('AS 2024 479');
      expect(html).not.toContain('AS 2025 579');
      expect(html).toContain('https://www.fedlex.admin.ch/eli/oc/2026/486/de');
      expect(KITA_BUND_2027).toBe(25900);
      expect(text).not.toMatch(/1\.1\.2027 am Volltext gelesen/);
      // Bedingungen des Gesetzes: belegte Kosten, gleicher Haushalt, Person, die für das Kind sorgt.
      expect(text).toContain('die belegten Kosten abziehen');
      expect(text).toContain('im gleichen Haushalt leben wie die Person, die für ihren Unterhalt sorgt');
    });

    it('zählt Kantone ohne festen Kita-Höchstbetrag nicht beim Vergleich mit dem Bund mit', () => {
      expect(KITA_NICHT_VERGLICHEN).toEqual(['NE']);
      const mitGrenze = KANTONE.filter((k) => !KITA_NICHT_VERGLICHEN.includes(k));
      const unter = mitGrenze.filter((k) => EBENEN.kita.wert(k) < 25800).length;
      expect(mitGrenze.length).toBe(25);
      expect(text).toContain(`${unter} Kantone liegen im Steuerjahr 2026 darunter, ${25 - unter} auf oder über dem Bund.`);
      expect(text).toContain('Neuenburg ist nicht mitgezählt');
      expect(text).not.toContain('keinen festen Höchstbetrag');
      expect(html).toContain('Wert 2025, auf Elternbeiträge begrenzt');
      expect(html).toContain('drittbetreuungskosten-de-fr.pdf');
    });

    it('nennt bei jeder Ebene, woher die Zahl kommt, und die Vorbehalte des Atlas', () => {
      for (const key of Object.keys(EBENEN)) {
        expect(KANTONE_IM_VERGLEICH.quellen.map((q) => q.key), key).toContain(EBENEN[key].quelle);
      }
      expect(text).toContain('Median-Reineinkommen 2022');
      expect(text).toContain('Grossregionen');
      expect(text).toContain('nicht, wer Anspruch hätte');
    });

    it('ist aus «Was steht mir zu?», «Prämienverbilligung» und der Krankenkassen-Seite verlinkt', () => {
      for (const p of ['was-steht-mir-zu', 'praemienverbilligung', 'krankenkasse']) expect(lies(p)).toContain('href="/kantone-im-vergleich/"');
    });
  });

  // ─── Belege und Standbilder ──────────────────────────────────────────────
  describe('/krankenkasse/ · Belege und Bilder', () => {
    const html = lies('krankenkasse');

    it('jeder Beleg im Text führt zu einer Quelle, und jede Quelle führt zurück', () => {
      const belege = [...html.matchAll(/<sup class="beleg"><a href="#quelle-([a-zA-Z0-9]+)" id="(beleg-[a-zA-Z0-9]+-\d+)"/g)];
      expect(belege.length).toBeGreaterThan(30);
      for (const [, key, id] of belege) {
        expect(html, `Quelle ${key} fehlt`).toContain(`<li id="quelle-${key}">`);
        expect(html, `Rücksprung ${id} fehlt`).toContain(`href="#${id}"`);
      }
      // Jede eingetragene Quelle wird im Text gebraucht.
      for (const q of KRANKENKASSE.quellen) expect(html).toContain(`href="#quelle-${q.key}"`);
      // Nummern laufen ab 1 lückenlos in der Reihenfolge des ersten Auftretens.
      const erste = [];
      for (const [, key] of belege) if (!erste.includes(key)) erste.push(key);
      const nummern = [...html.matchAll(/<li id="quelle-([a-zA-Z0-9]+)">\s*<span class="q-nr">(\d+)<\/span>/g)];
      expect(nummern.map(([, k]) => k)).toEqual(erste);
      expect(nummern.map(([, , n]) => Number(n))).toEqual(erste.map((_, i) => i + 1));
    });

    it('nicht amtliche Quellen sind als solche gekennzeichnet', () => {
      for (const q of KRANKENKASSE.quellen.filter((x) => !x.amtlich)) {
        const eintrag = html.slice(html.indexOf(`<li id="quelle-${q.key}">`), html.indexOf('</li>', html.indexOf(`<li id="quelle-${q.key}">`)));
        expect(eintrag).toContain('keine Behörde');
      }
    });

    it('die Standbilder sind eingesetzt: Strichfiguren und die isometrische Prämien-Maschine', () => {
      for (const id of ['abb-dorf', 'abb-alter', 'abb-kostenteil', 'abb-praemie', 'abb-kantone']) {
        expect(html).toContain(`<figure class="abb" id="${id}">`);
      }
      expect((html.match(/class="abb-bild hl"/g) || []).length).toBe(4);
      expect((html.match(/class="abb-bild iso"/g) || []).length).toBe(1);
      // Kein Text im Bild, kein Skript, keine fremde Adresse.
      for (const [, innen] of html.matchAll(/<svg [^>]*>([\s\S]*?)<\/svg>/g)) {
        expect(innen).not.toMatch(/<text|<script|<foreignObject|<image|https?:/);
      }
      // Abbildungen sind fortlaufend nummeriert.
      expect([...html.matchAll(/<strong>Abb\. (\d+)\.<\/strong>/g)].map((m) => Number(m[1]))).toEqual([1, 2, 3, 4, 5]);
    });

    it('das Dach je Franchise kommt aus berechneFranchise', () => {
      const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
      for (const f of FRANCHISE_STUFEN) expect(html).toContain(`<td class="n">${fmt(f)}</td><td class="n">${fmt(f + SELBSTBEHALT_MAX)}</td>`);
    });
  });

  // ─── Bewegte Fassungen ───────────────────────────────────────────────────
  // Die einzigen öffentlichen Seiten mit Skript. Riegel: Skripte nur als Dateien
  // von der eigenen Adresse (script-src 'self', wie der Server-Header es ohnehin
  // verlangt), kein eingebettetes Skript, nichts von aussen; die Hauptseite
  // verlinkt sie nur und bleibt ohne Skript und ohne Rahmen.
  describe('/krankenkasse/bewegt/', () => {
    const haupt = lies('krankenkasse');
    const namen = Object.keys(BEWEGT);
    const cspVon = (h) => h.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
    const datei = (pf) => fs.readFileSync(path.resolve(WURZEL, 'public', 'krankenkasse', 'bewegt', ...pf.split('/')), 'utf8');

    it('die Hauptseite klappt jede bewegte Fassung auf oder verlinkt sie — selbst ohne Skript', () => {
      expect(cspVon(haupt)).not.toMatch(/script-src/);
      expect(haupt).not.toMatch(/<script(?![^>]*application\/ld\+json)/);
      for (const n of namen) {
        // Der Link ist immer da: als Ausweg, falls der Rahmen leer bleibt.
        expect(haupt).toContain(`<a href="/krankenkasse/bewegt/${n}/">`);
        if (KRANKENKASSE.bewegtEinbetten) {
          expect(haupt).toMatch(new RegExp(`<details class="bewegt [a-z]+">\\s*<summary>[^<]+</summary>\\s*<iframe src="/krankenkasse/bewegt/${n}/" title="[^"]+" loading="lazy">`));
        }
      }
      if (KRANKENKASSE.bewegtEinbetten) expect(cspVon(haupt)).toContain("frame-src 'self'");
      else { expect(haupt).not.toContain('<iframe'); expect(cspVon(haupt)).not.toContain('frame-src'); }
    });

    it('wer aufklappt, hat den Server-Block vorbereitet und die Deploy-Prüfung scharf', () => {
      // Der Server-Header verbietet Rahmen (frame-ancestors 'none'). Ohne den Block
      // für /krankenkasse/bewegt/ bleiben die Rahmen live leer; check-deploy.sh merkt es.
      if (!KRANKENKASSE.bewegtEinbetten) return;
      const ht = fs.readFileSync(path.resolve(WURZEL, 'public', '.htaccess'), 'utf8');
      expect(ht).toMatch(/<If "%\{REQUEST_URI\} =~ m#\^\/krankenkasse\/bewegt\/#">/);
      expect(ht).toMatch(/frame-ancestors 'self'/);
      const check = fs.readFileSync(path.resolve(WURZEL, 'scripts', 'check-deploy.sh'), 'utf8');
      expect(check).toContain("frame-ancestors 'self'");
      expect(check).toContain('/krankenkasse/bewegt/dorf/');
    });

    it.each(namen)('%s: Skripte nur als Dateien von der eigenen Adresse', (n) => {
      const html = lies(`krankenkasse/bewegt/${n}`);
      const csp = cspVon(html);
      expect(csp).toContain("default-src 'none'");
      expect(csp).toContain("script-src 'self';");
      expect(csp).not.toMatch(/unsafe-eval|https?:|sha256/);
      expect(html).not.toMatch(/<script>|<script(?![^>]*\ssrc=)[^>]*>/);
      const quellen = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
      expect(quellen.length).toBeGreaterThan(0);
      expect(quellen[0]).toBe('/krankenkasse/bewegt/rahmen.js');
      for (const q of quellen) {
        expect(q).toMatch(/^\/krankenkasse\/bewegt\/[a-z/-]+\.js$/);
        expect(() => datei(q.replace('/krankenkasse/bewegt/', ''))).not.toThrow();
      }
      expect(html).toContain('<meta name="robots" content="noindex, follow">');
      expect(html).toContain(`href="/krankenkasse/#abb-${n}"`);
    });

    it('die Strichfiguren sind per Tastatur bedienbar und die Anzeige spricht nur bei Auswahl', () => {
      const buehne = datei('buehne.js');
      expect(buehne).toMatch(/setAttribute\('role', 'slider'\)/);
      expect(buehne).toMatch(/ArrowRight/);
      expect(buehne).toMatch(/aria-valuetext/);
      for (const n of namen.filter((x) => BEWEGT[x].art === 'hl')) {
        expect(datei(`${n}/figur.js`)).toMatch(/anzahl: [^,]+,\s*waehle: /);
        const html = lies(`krankenkasse/bewegt/${n}`);
        expect(html).toContain('<span id="anzeige" aria-live="polite"></span><span class="ruhe" aria-hidden="true">');
      }
    });

    it('die Prämien-Maschine bewegt sich nicht von selbst', () => {
      const skript = datei('anatomy-praemie.js');
      expect(skript).toContain('touring = false');
      expect(skript).not.toMatch(/touring = !still\.matches/);
    });

    it('Fremdcode nennt seinen mitgelieferten Lizenztext', () => {
      expect(datei('hairline-kernel.js')).toMatch(/^\/\*! Hairline[^\n]*\/licenses\/hairline-LICENSE\.txt/);
      expect(datei('anatomy-praemie.js')).toMatch(/^\/\*! Anatomy-Kit[^\n]*\/licenses\/anatomy-LICENSE\.txt/);
      for (const l of ['hairline', 'anatomy']) {
        expect(fs.existsSync(path.resolve(WURZEL, 'public', 'licenses', `${l}-LICENSE.txt`))).toBe(true);
      }
    });

    it('die bewegten Seiten stehen nicht in der Sitemap', () => {
      const xml = fs.readFileSync(path.resolve(WURZEL, 'public', 'sitemap.xml'), 'utf8');
      expect(xml).not.toContain('/bewegt/');
    });

    it('die Zahlen der bewegten Strichfiguren kommen aus src/data', () => {
      const kantone = datei('kantone/figur.js');
      for (const [, werte] of Object.entries(PRAEMIEN[PRAEMIENJAHR])) expect(kantone).toContain(`,${werte[2]},`);
      expect(kantone).toContain('"Zürich, Region 1"');
      expect(kantone.match(/const CANTONS = (.*);/)[1]).not.toContain('<');
      const kosten = datei('kostenteil/figur.js');
      expect(kosten).toContain(`const REGEL = ${JSON.stringify({ stufen: FRANCHISE_STUFEN, satz: 0.1, dach: SELBSTBEHALT_MAX })};`);
      for (const n of ['dorf', 'alter', 'kostenteil', 'kantone']) expect(datei(`${n}/figur.js`)).not.toContain('/*DATEN*/');
    });

    it('die Prämien-Maschine zeigt für 2027 die mittlere Prämie aus praemienRegionen.js', () => {
      const m = datei('anatomy-praemie.js').match(/\{ year: 2027, grow: [^,]+, premium: ([\d.]+) \}/);
      expect(m, 'Modellzeile 2027 nicht gefunden').toBeTruthy();
      expect(Number(m[1])).toBe(NATIONAL_AVG_PREMIUM_JE_JAHR[PRAEMIENJAHR].gesamt);
    });
  });

  // ─── Verweise aus den Erklärseiten ───────────────────────────────────────
  it('ist aus «Was steht mir zu?» und «Prämienverbilligung» verlinkt — nur auf Deutsch', () => {
    for (const p of ['was-steht-mir-zu', 'praemienverbilligung']) {
      expect(lies(p)).toContain(`<a href="/krankenkasse/">${KRANKENKASSE.titel}</a>`);
    }
    for (const p of ['fr/praemienverbilligung', 'it/was-steht-mir-zu', 'en/praemienverbilligung', 'rm/praemienverbilligung']) {
      expect(lies(p)).not.toContain('/krankenkasse/');
    }
  });

  // ─── Gegenproben: die Riegel schlagen an ─────────────────────────────────
  it('ein unbekannter Platzhalter bricht den Bau ab, statt leer durchzurutschen', () => {
    expect(() => einsetzen('{{gibtsnicht}}', zahlen())).toThrow(/Unbekannte Zahl/);
    expect(() => einsetzen('<!--FIG:gibtsnicht-->', zahlen(), {})).toThrow(/Unbekannter Block/);
  });

  it('der Prüfdatum-Riegel würde ein vergangenes Datum bemerken', () => {
    const heute = new Date().toISOString().slice(0, 10);
    expect(heute <= '2000-01-01').toBe(false);
  });
});
