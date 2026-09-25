// Der Lebensbaum — was aus den eigenen Angaben gewachsen ist.
//
// Stand bis 21.09.2026 als lokaler `DatenWirken`-Block in Dashboard.jsx. Umgezogen
// auf die Finanz-Übersicht (Entscheid Stebler Studios, 20.09.): fünf der sechs
// Früchte sind Geld — Steuer, Budget, Lohn, IPV, Sozialhilfe. Die Notfall-Frucht
// zieht bewusst mit; wer auf seine Finanzen schaut, soll am selben Baum sehen,
// dass sein Leben nicht nur Geld ist.
//
// Der Baum ist NICHT umgeschrieben, nur umgezogen: alle sieben Aeste bleiben.
// Die Masse (text/weight/space/radius) kommen bewusst als Props herein, so wie
// im Dashboard — damit der Umzug das Verhalten nicht anfasst.
import React, { useState } from 'react';
import FruchtStufe from './FruchtStufe.jsx';
import { PanelTitle } from './components/Heading.jsx';
import { anspruchSignale } from './data/anspruchSignale.js';
import { baumAnsichtLesen, baumAnsichtSchreiben } from './utils/baumAnsicht.js';

const Baum3D = React.lazy(() => import('./Baum3D.jsx'));

// K18: lange Woerter an den Mini-Beschriftungen silbentrennen statt clippen.
const hyphenStyle = { hyphens: 'auto', WebkitHyphens: 'auto', overflowWrap: 'break-word' };

export const Lebensbaum = ({ palette, t, data, text, weight, space, radius, onNavigate, bereiche, onSelectChapter, isMobile, lang, isDarkMode }) => {
  // Umschalter flach ↔ räumlich. Standard ist räumlich (Entscheid vom
  // 20.09.2026); wer umschaltet, bekommt seine Wahl gemerkt.
  const [raeumlich, setRaeumlich] = useState(() => baumAnsichtLesen());
  // Kann dieses Gerät gar kein 3D, fällt die Anzeige auf den flachen Baum
  // zurück — sonst stünde dort ein leeres Feld.
  const [kein3D, setKein3D] = useState(false);
  const zeigeRaeumlich = raeumlich && !kein3D;

  const umschalten = () => setRaeumlich((v) => {
    baumAnsichtSchreiben(!v);
    return !v;
  });
  // Each living leaf links to the view it stands for (was decorative-only before).
  const navMap = {
    tax: 'tax', ipv: 'premium', sozial: 'sozialhilfe',
    lohn: 'finanzuebersicht', notfall: 'notfalleinstieg', budget: 'sync',
  };
  // Anspruch-Signale (#4.4 „Schnellcheck wächst als Ast", Variante A): welche
  // Bereichs-Frucht einen gedeckten Anspruch trägt → ruhiger Ring um die Frucht.
  // Nur ehrlich berechenbare Ansprüche (IPV/Sozialhilfe/EL), Ast-genau zugeordnet.
  const signale = anspruchSignale(data);
  // Ein Baum statt zwei (Braindump #21): jedes Werkzeug hängt als kleinere Frucht
  // am selben Bereichs-Ast wie sein Lebensbereich — die Geld-Werkzeuge an der
  // Finanzen-Aprikose, die Prämienverbilligung an der Versicherungen-Heidelbeere,
  // die Notfall-Berechnung an der Notfall-Vogelbeere. `area` = Kapitel-Schlüssel,
  // damit die Frucht dieselbe Ast-Farbe erbt.
  // Zuordnung über die Äste ausbalanciert (max. 2 Werkzeug-Früchte je Ast), damit
  // der Baum ruhig bleibt: Geld-Werkzeuge an Finanzen, der Lohn-/Mindestlohn-Check
  // am Ausbildung-&-Arbeit-Ast, die Sozialhilfe-Orientierung am Behörden-Ast.
  const connections = [
    { key: 'tax', area: 'finanzen', label: t('datenWirken.tax'), short: t('datenWirken.short.tax'), active: !!(data.basis?.canton && data.finanzen?.monthlyIncome) },
    { key: 'budget', area: 'finanzen', label: t('datenWirken.budget'), short: t('datenWirken.short.budget'), active: !!(data.finanzen?.monthlyIncome && data.wohnen?.rentAmount) },
    { key: 'lohn', area: 'ausbildung', label: t('datenWirken.lohn'), short: t('datenWirken.short.lohn'), active: !!(data.basis?.canton && data.ausbildung?.jobTitle) },
    { key: 'ipv', area: 'versicherungen', label: t('datenWirken.ipv'), short: t('datenWirken.short.ipv'), active: !!(data.basis?.canton && data.finanzen?.monthlyIncome) },
    { key: 'sozial', area: 'behoerden', label: t('datenWirken.sozial'), short: t('datenWirken.short.sozial'), active: !!(data.finanzen?.monthlyIncome && data.basis?.canton) },
    { key: 'notfall', area: 'notfall', label: t('datenWirken.notfall'), short: t('datenWirken.short.notfall'), active: !!(data.notfall?.emergencyContact) },
  ];
  const active = connections.filter(c => c.active);

  // Aktive Werkzeuge nach Bereichs-Ast gruppieren (Schlüssel = Kapitel-Schlüssel
  // der Bereichs-Frucht, damit die Zuordnung Ast ↔ Werkzeug-Frucht stimmt).
  const toolsByArea = active.reduce((acc, c) => {
    (acc[c.area] = acc[c.area] || []).push(c);
    return acc;
  }, {});
  return React.createElement('div', {
    style: {
      margin: space.md + 'px 0',
      padding: space.md + 'px',
      background: palette.sage + '08',
      borderRadius: radius.md,
      border: '1px solid ' + palette.sage + '15',
    }
  },
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '0 0 6px 0' },
    },
      // PanelTitle statt div: kommt von main (#245, richtige Überschriften-
      // Semantik). Der Abstand sitzt jetzt an der Zeile, darum hier margin 0.
      React.createElement(PanelTitle, {
        palette,
        style: { fontSize: text.xs, color: palette.mid, margin: 0, fontWeight: weight.medium }
      }, t('datenWirken.treeCaption')),
      React.createElement('button', {
        type: 'button',
        onClick: umschalten,
        'aria-pressed': zeigeRaeumlich,
        style: {
          fontSize: text.xs, fontFamily: 'inherit', cursor: 'pointer',
          color: palette.mid, background: 'none',
          border: '1px solid ' + palette.sage + '40', borderRadius: radius.full,
          padding: '3px 12px', minHeight: '44px',
        },
      }, zeigeRaeumlich ? t('datenWirken.ansichtFlach') : t('datenWirken.ansichtRaeumlich')),
    ),
    zeigeRaeumlich ? React.createElement(React.Suspense, {
      fallback: React.createElement('div', {
        role: 'status', 'aria-live': 'polite',
        style: { height: '340px', display: 'grid', placeItems: 'center', fontSize: text.xs, color: palette.soft },
      }, t('datenWirken.baumLaedt')),
    }, React.createElement(Baum3D, {
      // Roh übergeben: das Aufbereiten passiert im nachgeladenen Baum, damit
      // es die Hauptdatei nicht belastet.
      bereiche, werkzeuge: active,
      onWerkzeugWaehlen: onNavigate ? (w) => { const ziel = navMap[w.key]; if (ziel) onNavigate(ziel); } : undefined,
      // Anspruchs-Ringe kommen später (Entscheid Oktober) — bis dahin trägt
      // nur der flache Baum sie.
      onKeinWebGL: () => setKein3D(true),
      // Der Weg ins Kapitel bleibt erhalten — das kann der flache Baum, und ohne
      // ihn wäre der räumliche hübscher, aber ärmer.
      onBereichWaehlen: onSelectChapter ? (b) => onSelectChapter(b.idx) : undefined,
      palette, isDarkMode,
      gesamtPct: bereiche && bereiche.length
        ? Math.round(bereiche.reduce((s, b) => s + b.pct, 0) / bereiche.length) : 0,
      hoehe: isMobile ? 300 : 380,
      ariaLabel: t('datenWirken.title'),
    })) : null,
    // Bereichs-Früchte am Baum — jede Frucht trägt das Bereichs-Icon als Negativ
    // in Ast-Farbe; sie reift mit dem Ausfüllstand (Deckkraft). Klick → Kapitel.
    // ── Lebensbaum v2 — die Bereichs-Früchte hängen an echten Ästen ──────────
    // Jede Frucht reift einzeln mit ihrem Ausfüllstand (Grösse + Deckkraft);
    // die Krone (Laubmasse) wächst mit dem Gesamtfortschritt (4 Wuchsstufen).
    // Frucht trägt weiterhin das Bereichs-Icon als Negativ. Klick → Kapitel.
    (!zeigeRaeumlich && bereiche && bereiche.length) ? (() => {
      const n = bereiche.length;
      const VB_W = 360, VB_H = 268;
      // Kurzer Stamm, damit der Baum gewachsen statt schirmartig wirkt.
      const forkX = 180, forkY = 182, groundY = 252;
      // Runder, höherer Kronenbogen (mehr Höhen-Abstand zwischen benachbarten Früchten).
      const cx = 180, rx = 150, cy = 120, ry = 92;
      // Früchte gleichmässig horizontal verteilen (statt gleicher Winkel). Bei gleichem
      // Winkel drängeln sich benachbarte Früchte an den flachen Flanken der Krone und die
      // Labels kollidieren; gleicher x-Abstand hält sie ruhig auseinander. Die Höhe folgt
      // dem Kronenbogen — Mitte hoch, Ränder sanft tiefer, wie an einem gewachsenen Baum.
      const anchor = (i) => {
        const tt = n === 1 ? 0.5 : i / (n - 1);
        const dx = (2 * tt - 1) * 0.99;
        return { x: cx + rx * dx, y: cy - ry * Math.sqrt(Math.max(0, 1 - dx * dx)) };
      };
      const avg = Math.round(bereiche.reduce((s, b) => s + b.pct, 0) / n);
      // 4 Wuchsstufen des ganzen Baums → Laubmasse.
      const stage = avg >= 70 ? 4 : avg >= 40 ? 3 : avg >= 15 ? 2 : 1;
      const foliageOp = [0, 0.06, 0.10, 0.13, 0.17][stage];
      return React.createElement('div', {
        style: { position: 'relative', width: '100%', maxWidth: '420px', margin: '0 auto', padding: '2px 0 4px' },
      },
        React.createElement('svg', {
          viewBox: '0 0 ' + VB_W + ' ' + VB_H, width: '100%',
          role: 'img', 'aria-label': t('datenWirken.title'),
          style: { display: 'block' },
        },
          // Boden — ruhiger Schatten
          React.createElement('ellipse', { cx: forkX, cy: groundY + 3, rx: 62, ry: 6, fill: palette.sage, opacity: 0.10 }),
          // Laubkrone — dichter, runder Körper, wächst mit der Wuchsstufe (4 Stufen).
          foliageOp > 0 ? React.createElement('ellipse', { cx: cx, cy: cy - 12, rx: rx * 0.94 + 22, ry: ry + 4, fill: palette.sage, opacity: foliageOp }) : null,
          stage >= 2 ? React.createElement('ellipse', { cx: cx - 56, cy: cy, rx: 64, ry: 54, fill: palette.sage, opacity: foliageOp * 0.78 }) : null,
          stage >= 2 ? React.createElement('ellipse', { cx: cx + 56, cy: cy, rx: 64, ry: 54, fill: palette.sage, opacity: foliageOp * 0.78 }) : null,
          stage >= 4 ? React.createElement('ellipse', { cx: cx, cy: cy + 26, rx: 80, ry: 46, fill: palette.sage, opacity: foliageOp * 0.6 }) : null,
          // Stamm — kurz und tragend; leichte Wurzel-Verbreiterung am Boden.
          React.createElement('path', {
            d: 'M ' + (forkX - 5) + ' ' + groundY + ' C ' + (forkX - 7) + ' ' + (groundY - 30) + ' ' + (forkX + 7) + ' ' + (forkY + 26) + ' ' + forkX + ' ' + forkY,
            fill: 'none', stroke: palette.sage, strokeWidth: 8, strokeLinecap: 'round', opacity: 0.5,
          }),
          // Äste — je ein Ast zum Frucht-Anker
          ...bereiche.map((b, i) => {
            const a = anchor(i);
            // Ast schwingt erst nach oben aus dem Stamm, dann zur Frucht — gewachsen,
            // nicht speichenartig (der Kontrollpunkt liegt näher am Stamm und höher).
            const mx = forkX + (a.x - forkX) * 0.30;
            const my = forkY - (forkY - a.y) * 0.58;
            // Verjüngter Ast: als gefüllte Form (dick am Stamm, dünn zur Frucht) statt
            // gleichdicker Linie — so wirkt er gewachsen, nicht gezeichnet. Die Breite wird
            // senkrecht zur Wuchsrichtung abgetragen und läuft zur Fruchtspitze aus.
            const dxB = a.x - forkX, dyB = a.y - forkY;
            const lenB = Math.hypot(dxB, dyB) || 1;
            const nx = -dyB / lenB, ny = dxB / lenB;
            const oL = (w, x, y) => (x + nx * w).toFixed(1) + ' ' + (y + ny * w).toFixed(1);
            const oR = (w, x, y) => (x - nx * w).toFixed(1) + ' ' + (y - ny * w).toFixed(1);
            const wB = 2.1, wM = 1.2, wT = 0.45;
            return React.createElement('path', {
              key: 'branch-' + b.key,
              d: 'M ' + oL(wB, forkX, forkY) + ' Q ' + oL(wM, mx, my) + ' ' + oL(wT, a.x, a.y) +
                 ' L ' + oR(wT, a.x, a.y) + ' Q ' + oR(wM, mx, my) + ' ' + oR(wB, forkX, forkY) + ' Z',
              fill: palette.sage, stroke: 'none',
              opacity: 0.32 + (b.pct / 100) * 0.28,
            });
          })
        ),
        // Früchte als klickbare Buttons über dem SVG, exakt am Ast-Ende.
        ...bereiche.map((b, i) => {
          const a = anchor(i);
          const areaTools = toolsByArea[b.key] || [];
          // Anspruch-Signal (Variante A): trägt dieser Ast einen gedeckten Anspruch,
          // bekommt die Frucht einen ruhigen Doppel-Ring — „hier ist etwas reif für dich".
          const sigList = signale[b.key] || [];
          const hasAnspruch = sigList.length > 0;
          const fs = isMobile ? 42 : 50;
          // Der Anspruch beim Namen (Variante B): Ring-Klick führt zum benannten
          // Anspruch — bei genau einem Signal direkt in sein Zuhause, sonst in die
          // Anspruchs-Landkarte. Ohne Anspruch bleibt die Frucht bei ihrem Kapitel.
          const anspruchLabel = hasAnspruch ? t('anspruch.items.' + sigList[0].key + '.label') : null;
          const anspruchGo = hasAnspruch
            ? () => (sigList.length === 1 && sigList[0].view ? onNavigate(sigList[0].view) : onNavigate('ansprueche'))
            : null;
          return React.createElement('div', { key: b.key, style: { display: 'contents' } },
            React.createElement('button', {
              onClick: hasAnspruch ? anspruchGo : (onSelectChapter ? () => onSelectChapter(b.idx) : undefined),
              'aria-label': b.title + ' — ' + b.pct + '%' + (hasAnspruch ? ' · ' + t('datenWirken.anspruchAria') + (anspruchLabel ? ': ' + anspruchLabel : '') : ''),
              title: hasAnspruch && anspruchLabel ? anspruchLabel : b.title,
              style: {
                position: 'absolute', left: (a.x / VB_W * 100) + '%', top: (a.y / VB_H * 100) + '%',
                // Frucht HÄNGT vom Ast: die Astspitze (Anker) sitzt am Stiel/Oberrand,
                // der Fruchtkörper baumelt darunter — nicht mittig auf dem Ast (Stebler Studios).
                transform: 'translate(-50%, -4%)',
                background: 'none', border: 'none', padding: 0,
                cursor: onSelectChapter ? 'pointer' : 'default',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontFamily: 'inherit',
              },
            },
              // Reife-Stufe statt reiner Deckkraft: Knospe → Blüte → junge → reife Frucht.
              React.createElement('span', { style: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: (isMobile ? 44 : 52) + 'px' } },
                hasAnspruch ? React.createElement('span', { key: 'ring-o', 'aria-hidden': true, style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: (fs + 24) + 'px', height: (fs + 24) + 'px', borderRadius: '50%', border: '1.5px solid ' + b.color, opacity: 0.22, pointerEvents: 'none' } }) : null,
                hasAnspruch ? React.createElement('span', { key: 'ring-i', 'aria-hidden': true, style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: (fs + 14) + 'px', height: (fs + 14) + 'px', borderRadius: '50%', border: '2px solid ' + b.color, opacity: 0.5, pointerEvents: 'none' } }) : null,
                React.createElement(FruchtStufe, { fruit: b.fruit, iconName: b.iconName, color: b.color, stage: b.stage, size: fs })
              ),
              // Schmal halten (nicht breiter als der Astabstand von ~58px), sonst kollidieren
              // Nachbar-Labels bei 13px — lieber zweizeilig/getrennt als überlappend.
              React.createElement('span', { lang, style: { fontSize: text.xs, color: palette.mid, maxWidth: (isMobile ? 38 : 50) + 'px', lineHeight: 1.15, textAlign: 'center', ...hyphenStyle } }, b.short || b.title.split(/[\s–—]/)[0])
            ),
            // Werkzeug-Früchte am selben Ast: kleinere Beeren, die unter der
            // Bereichs-Frucht baumeln. Jede reift nicht (binär aktiv), trägt die
            // Ast-Farbe und führt per Klick zum Werkzeug. Ein Baum statt zwei (#21).
            areaTools.length ? React.createElement('div', {
              style: {
                position: 'absolute', left: (a.x / VB_W * 100) + '%', top: (a.y / VB_H * 100) + '%',
                transform: 'translate(-50%, ' + (isMobile ? 60 : 72) + 'px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              },
            },
              ...areaTools.map((tool) => {
                const target = navMap[tool.key];
                const go = (target && onNavigate) ? () => onNavigate(target) : undefined;
                return React.createElement('button', {
                  key: tool.key,
                  onClick: go,
                  'aria-label': tool.label,
                  title: tool.label,
                  style: {
                    // Transparente, vergrösserte Tap-Fläche (~30px) — die sichtbare Pille
                    // bleibt klein (innerer span), damit der Baum ruhig bleibt.
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', padding: '7px 6px',
                    cursor: go ? 'pointer' : 'default', fontFamily: 'inherit',
                  },
                },
                  React.createElement('span', {
                    style: {
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      background: b.color + '14', border: '1px solid ' + b.color + '33',
                      borderRadius: radius.full, padding: '1px 7px 1px 3px',
                      whiteSpace: 'nowrap',
                    },
                  },
                    React.createElement('span', { style: { width: '7px', height: '7px', borderRadius: '50%', background: b.color, opacity: 0.85, flex: '0 0 auto' } }),
                    React.createElement('span', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.1 } }, tool.short || tool.label)
                  )
                );
              })
            ) : null
          );
        })
      );
    })() : null
  );
};

export default Lebensbaum;
