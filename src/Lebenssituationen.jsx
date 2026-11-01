import React, { useState, useRef, useEffect } from 'react';
import { text, weight, leading, space, radius, ease, duration } from './config/tokens.js';
import { getCantonName, getHouseholdInfo, calculateSozialhilfe, ladeIPVModelle } from './config/cantonalData.js';
import { wegeAusProbe, ipvAnzeige, sozialhilfeAnzeige } from './data/anspruchWege.js';
import { uebergabeAusProbe } from './data/schnellcheckUebergabe.js';
import { ANSPRUCH_GRUPPEN } from './data/anspruchLandkarte.js';
import { useEinkommen, EinkommenFeld, istKnapp } from './components/EinkommenFeld.jsx';
import { Pegel } from './components/Pegel.jsx';
import { LandkarteGruppen } from './AnspruchLandkarte.jsx';
import { aufklappZeichen } from './IconSystem.jsx';
import { betrag } from './utils/geld.js';
import { LEBENSZUSTAENDE } from './data/lebenszustaende.js';
import { getRegionaleVerguenstigungen } from './data/regionaleVerguenstigungen.js';
import { getFamilienEL } from './data/familienEL.js';
import { getMutterschaftsbeihilfe } from './data/mutterschaftsbeihilfe.js';
import { lookupPLZ } from './data/plzGemeinde.js';
import { GlossarText } from './GlossarBegriff.jsx';
import { ExternerLink } from './components/ExternerLink.jsx';

// ─── Lebenslagen (Auswahl) ─────────────────────────────────
// Lebenszustände — andauernde Situationen, die versteckte Berechtigungen
// aufdecken. Selbst gewählt (kein Auto-Erkennen, keine Etikettierung),
// lokal gespeichert (or5_-Prefix). Reine Daten aus data/lebenszustaende.js.
// Seit 27.10.2026 der zweite Teil von «Was steht mir zu?» (unten) und Schritt 2 des
// geführten Anspruch-Checks (AnspruchCheck.jsx) — dieselbe Auswahl an beiden Orten.
export const LebenslagenAuswahl = ({ palette, t, data, onNavigate }) => {
  const storageKey = 'or5_lebenszustaende';

  // Wohnkanton für kanton-bewusste Angebote — aus der PLZ abgeleitet (wie in UmzugAblauf),
  // Fallback auf ein explizit erfasstes basis.canton. Kein Auto-Erkennen von Anspruch, nur Ort.
  const userCanton = (() => {
    const plz = (data?.wohnen?.postalCode || '').trim();
    if (plz.length >= 4) {
      const gem = lookupPLZ(plz);
      if (gem && gem.length) return gem[0].kanton;
    }
    return (data?.basis?.canton || '').trim() || null;
  })();

  // „Hat Kinder?" — für Berechtigungen, die nur mit Kindern relevant sind (z. B.
  // Betreuungsgutscheine). Aus dem Haushalt-Modell (children[]), Fallback Legacy-dependents.
  const hatKinder = (() => {
    const hh = data?.basis?.household;
    if (hh && Array.isArray(hh.children)) return hh.children.length > 0;
    return Number(data?.basis?.dependents || 0) > 0;
  })();
  const [active, setActive] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  // Auf schmalen Bildschirmen erscheint das aufgedeckte Panel unterhalb aller Chips,
  // ausserhalb des Sichtfelds. Beim Anwählen ruhig dorthin blicken (nur beim Aktivieren,
  // nur auf dem Handy, Reduce-Motion respektiert) — sonst wirkt es, als passiere nichts.
  const panelRefs = useRef({});
  const [scrollTarget, setScrollTarget] = useState(null);
  useEffect(() => {
    if (!scrollTarget) return;
    const el = panelRefs.current[scrollTarget];
    setScrollTarget(null);
    if (!el || window.innerWidth > 700) return;
    let gespeichert = false;
    try { gespeichert = localStorage.getItem('or5_reducemotion') === '1'; } catch { /* Speicher gesperrt → Systemeinstellung */ }
    const reduce = gespeichert || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [scrollTarget]);
  const toggle = (key) => {
    const turningOn = !active.includes(key);
    setActive((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* localStorage nicht verfügbar */ }
      return next;
    });
    if (turningOn) setScrollTarget(key);
  };

  // Externe ↗-Karte (gleicher Stil wie die Berechtigungs-Karten), für regionale Angebote.
  const extCard = (key, url, titel, textStr) =>
    React.createElement(ExternerLink, {
      key, t, href: url,
      style: {
        display: 'block', width: '100%', textAlign: 'left', boxSizing: 'border-box',
        padding: '10px 12px', marginBottom: space.xs + 'px',
        background: palette.surface, color: palette.text, textDecoration: 'none',
        border: '1px solid ' + palette.border + '44', borderRadius: radius.sm,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: `border-color ${duration.normal}ms ${ease}`,
      },
      onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sage + '55'; },
      onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border + '44'; },
    },
      React.createElement('div', { key: 't', style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, titel),
      React.createElement('div', { key: 'x', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.relaxed } }, textStr)
    );

  // Kanton-bewusster Regional-Block: zeigt konkrete Angebote ('has'), einen ruhigen
  // Verweis auf die regionale KulturLegi ('check') oder würdevoll die Lücke ('none').
  const renderRegionalAngebote = () => {
    const regio = getRegionaleVerguenstigungen(userCanton);
    const kids = [
      React.createElement('div', {
        key: 'h',
        style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.text, margin: space.sm + 'px 0 ' + space.xs + 'px 0' }
      }, t('lebenszustaende.regio.title')),
    ];
    if (regio.state === 'has') {
      kids.push(extCard('kulturlegiRegion', regio.kulturlegiUrl, t('lebenszustaende.regio.kulturlegiRegion'), t('lebenszustaende.regio.kulturlegiRegionText')));
      regio.offers.forEach(o =>
        kids.push(extCard(o.key, o.url, t('lebenszustaende.regio.offers.' + o.key + '.titel'), t('lebenszustaende.regio.offers.' + o.key + '.text'))));
    } else if (regio.state === 'none') {
      kids.push(React.createElement('div', {
        key: 'none',
        style: { fontSize: text.xs, color: palette.soft, fontStyle: 'italic', lineHeight: leading.relaxed, padding: '4px 2px' }
      }, t('lebenszustaende.regio.noneNote')));
    } else {
      kids.push(extCard('kulturlegiRegion', regio.kulturlegiUrl, t('lebenszustaende.regio.checkTitle'), t('lebenszustaende.regio.checkText')));
    }
    return React.createElement('div', { key: 'regio' }, kids);
  };

  return React.createElement('div', null,
    // Situations-Chips (ruhig, selbst wählbar)
    React.createElement('div', {
      role: 'group', 'aria-label': t('wasStehtMirZu.lebenslage'),
      style: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px' }
    },
      LEBENSZUSTAENDE.map((z) => {
        const on = active.includes(z.key);
        return React.createElement('button', {
          key: z.key,
          onClick: () => toggle(z.key),
          'aria-pressed': on,
          style: {
            padding: '12px 14px', borderRadius: radius.md,
            border: '1px solid ' + (on ? palette.sage + '88' : palette.border + '66'),
            background: on ? palette.sage + '18' : 'transparent',
            color: on ? (palette.sageDeep || palette.text) : palette.mid,
            fontSize: text.sm, fontWeight: on ? weight.medium : weight.normal,
            textAlign: 'left',
            fontFamily: 'inherit', cursor: 'pointer',
            transition: `background ${duration.normal}ms ${ease}, border-color ${duration.normal}ms ${ease}`,
          },
        }, t('lebenszustaende.' + z.key + '.label'));
      })
    ),
    active.length === 0 && React.createElement('p', {
      style: { fontSize: text.xs, color: palette.mid, margin: space.sm + 'px 0 0', lineHeight: leading.relaxed }
    }, t('lebenszustaende.selectHint')),

    // Aufgedeckte Berechtigungen je gewähltem Zustand
    LEBENSZUSTAENDE.filter((z) => active.includes(z.key)).map((z) =>
      React.createElement('div', {
        key: z.key,
        ref: (el) => { panelRefs.current[z.key] = el; },
        // Sprungziel: hält beim scrollIntoView Abstand zur klebenden Kopfzeile (tokens.css).
        className: 'mp-sprungziel',
        style: {
          marginTop: space.sm, padding: '16px 18px',
          background: palette.up, borderRadius: radius.md,
          // Eine Quelle für den Sprungabstand (tokens.css), vorher 72 px inline.
          scrollMarginTop: 'var(--mp-sprungabstand)',
        }
      },
        React.createElement('p', {
          style: { fontSize: text.xs, color: palette.mid, margin: '0 0 ' + space.sm + 'px 0', lineHeight: leading.relaxed }
        }, React.createElement(GlossarText, { t, palette }, t('lebenszustaende.' + z.key + '.intro'))),
        z.berechtigungen
          .filter((b) => !b.nurMitKindern || hatKinder)
          // Familien-EL: nur zeigen, wenn der Wohnkanton sie tatsächlich anbietet
          // (kein falsches Versprechen; Eintrag verschwindet in anderen Kantonen).
          .filter((b) => !b.familienEL || getFamilienEL(userCanton).has)
          // Mutterschaftsbeihilfe: gleiches kanton-bewusste Muster.
          .filter((b) => !b.mutterschaftsbeihilfe || getMutterschaftsbeihilfe(userCanton).has)
          .map((b) => {
          // Familien-EL / Mutterschaftsbeihilfe tragen keine statische URL — sie kommt kanton-abhängig dazu.
          const felUrl = b.familienEL ? getFamilienEL(userCanton).url : null;
          const msbUrl = b.mutterschaftsbeihilfe ? getMutterschaftsbeihilfe(userCanton).url : null;
          const cardUrl = b.url || felUrl || msbUrl;
          const isExternal = !!cardUrl;
          const baseKey = 'lebenszustaende.' + z.key + '.berechtigungen.' + b.key;
          const cardStyle = {
            display: 'block', width: '100%', textAlign: 'left', boxSizing: 'border-box',
            padding: '10px 12px', marginBottom: space.xs + 'px',
            background: palette.surface, color: palette.text, textDecoration: 'none',
            border: '1px solid ' + palette.border + '44', borderRadius: radius.sm,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: `border-color ${duration.normal}ms ${ease}`,
          };
          const hover = {
            onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sage + '55'; },
            onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border + '44'; },
          };
          const inner = [
            React.createElement('div', {
              key: 'titel',
              style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text }
            }, t(baseKey + '.titel')),
            React.createElement('div', {
              key: 'text',
              style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.relaxed }
            }, t(baseKey + '.text')),
            React.createElement('div', {
              key: 'quelle',
              style: { fontSize: text.xs - 1, color: palette.soft, marginTop: space.xs + 'px' }
            }, t('lebenszustaende.quelleLabel') + ': ' + b.quelle + ' · ' + t('lebenszustaende.standLabel') + ' ' + b.stand)
          ];
          return isExternal
            ? React.createElement(ExternerLink, { key: b.key, t, href: cardUrl, style: cardStyle, ...hover }, inner)
            : React.createElement('button', { key: b.key, type: 'button', onClick: () => onNavigate(b.view), style: cardStyle, ...hover }, inner);
        }),
        // Kanton-bewusste regionale Vergünstigungen (nur bei markierten Zuständen).
        z.zeigeRegionaleAngebote && renderRegionalAngebote()
      )
    )
  );
};

// ─── Was steht mir zu? (Entscheid O, 24.10.2026 · gebaut 27.10.2026, F7-A3) ──────
// EIN Ort für die Frage, ein Name. Reihenfolge: (1) Mit Ihren Angaben — Einkommen, Miete,
// KK, Kanton/Haushalt als Marken, zum Durchspielen aufklappbar; Ergebnis als zwei Pegel
// (IPV «luft», Sozialhilfe «aufstockung») in einer Live-Region, darunter ein Satz.
// (2) Nach Ihrer Lebenslage — die elf Situationen. (3) Weitere Wege, zugeklappt — die
// Landkarte ohne IPV und Sozialhilfe (die stehen oben als Pegel).
// #/schnellcheck und #/ansprueche führen hierher (utils/hashRouter.js UMLEITUNGEN, Sprungmarke
// MIT_ANGABEN_ANKER). Rechnung: dieselben Aufrufe wie Schritt 1 des geführten Checks
// (data/anspruchWege.js) — keine eigene. Der Leistungs-Kompass und der Prämien-Beleg fallen hier
// weg (VERGLEICH.md «Was steht mir zu? (O)»).
export const MIT_ANGABEN_ANKER = 'mp-mit-angaben';

const Lebenssituationen = ({ palette, t, data, onNavigate }) => {
  const h = React.createElement;
  const canton = data?.basis?.canton || '';
  const hh = getHouseholdInfo(data);
  // Brutto oder netto (EinkommenFeld, wie bisher im Schnellcheck); gerechnet wird mit netto.
  const e = useEinkommen(data);
  const [rent, setRent] = useState(data?.wohnen?.rentAmount ? String(data.wohnen.rentAmount) : '');
  const [kk, setKk] = useState(data?.versicherungen?.kkPremium ? String(data.versicherungen.kkPremium) : '');
  // Aufklapp-Zustände (für das Zeichen ▸/▾). «Angaben anpassen» ist ohne Einkommen offen — sonst gäbe
  // es nichts zu sehen und nichts einzutragen.
  const [anpassenOffen, setAnpassenOffen] = useState(() => !(e.nettoMonat > 0));
  const [wegeOffen, setWegeOffen] = useState(false);

  // Die Kantonsmodelle der IPV laden nach (ZH, BE …). Bis dahin sagt calculateIPV «laden» — danach
  // einmal neu zeichnen (Muster PraemienOrientierung.jsx). Sonst zeigte der Pegel beim ersten Öffnen
  // «prüfen», nach dem Neuladen etwas anderes (beobachtet bei Maria, VERGLEICH.md).
  const [, setIpvGeladen] = useState(0);
  useEffect(() => {
    let aktiv = true;
    ladeIPVModelle().then(() => { if (aktiv) setIpvGeladen((n) => n + 1); }).catch(() => {});
    return () => { aktiv = false; };
  }, []);

  const numIncome = e.nettoMonat;
  const numRent = Number(rent) || 0;
  const numKk = Number(kk) || 0;
  const probe = {
    ...data,
    // incomeType 'netto': das Feld hat schon umgerechnet — nicht nochmals (calculateSozialhilfe).
    finanzen: { ...(data?.finanzen || {}), monthlyIncome: numIncome, incomeType: 'netto' },
    wohnen: { ...(data?.wohnen || {}), rentAmount: numRent },
    versicherungen: { ...(data?.versicherungen || {}), kkPremium: numKk },
  };

  // Dieselben Ehrlichkeits-/Crash-Gates wie bisher im Schnellcheck: wirft eine Rechnung, bleibt
  // die Seite stehen und sagt weniger, statt leer zu werden.
  let w = { wege: [], ipvSubsumed: false, ipvAmount: 0 }, ipvA = { art: 'leer' }, sozPegel = null, knappSoz = false;
  try {
    w = wegeAusProbe(probe);
    ipvA = ipvAnzeige(probe);
    sozPegel = sozialhilfeAnzeige(probe);
    if (e.geschaetzt && numRent > 0) knappSoz = istKnapp(calculateSozialhilfe(probe), e.ohneAlter);
  } catch { /* Orientierung, nie blockierend */ }

  const fmt = (n) => betrag(n || 0);
  const wegLabel = { ipv: t('schnellcheck.ipv'), soz: t('nav.sozialhilfe'), el: t('schnellcheck.el') };
  const wegView = { ipv: 'premium', soz: 'sozialhilfe', el: 'ergaenzungsleistungen' };
  // B-1/E22: eingetippte Zahlen gehen an den IPV-Rechner mit — eine aus brutto GESCHÄTZTE nicht.
  const uebergabe = uebergabeAusProbe(e.geschaetzt ? { ...probe, finanzen: { ...probe.finanzen, monthlyIncome: 0 } } : probe);

  const s = {
    h2: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: space.xl + 'px 0 ' + space.sm + 'px 0' },
    marke: { display: 'inline-block', padding: '4px 10px', borderRadius: radius.full + 'px', background: palette.up, border: '1px solid ' + palette.border, color: palette.text, fontSize: text.xs, fontVariantNumeric: 'tabular-nums' },
    summary: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '6px', color: palette.text, fontSize: text.sm, fontWeight: weight.medium, listStyle: 'none' },
    label: { fontSize: text.xs, color: palette.mid, display: 'block', marginBottom: space.xs + 'px' },
    input: { width: '100%', padding: '10px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
    satz: { fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed, margin: space.sm + 'px 0 0' },
    fuss: { fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed, margin: space.sm + 'px 0 0' },
    link: { display: 'flex', alignItems: 'center', minHeight: '44px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium, color: palette.skyDeep, textAlign: 'left' },
  };

  const feld = (labelText, value, setter, placeholder) => h('label', { style: { flex: '1 1 150px', minWidth: '130px' } },
    h('span', { style: s.label }, labelText),
    h('input', { type: 'number', inputMode: 'numeric', placeholder, value, onChange: (ev) => setter(ev.target.value), style: s.input }));

  // Marken: was gerade gerechnet wird — dieselben Zahlen wie die Felder darunter.
  const marken = [
    numIncome > 0 && (e.geschaetzt ? t('wasStehtMirZu.markeNettoGeschaetzt', { betrag: fmt(numIncome) }) : t('wasStehtMirZu.markeNetto', { betrag: fmt(numIncome) })),
    numRent > 0 && t('wasStehtMirZu.markeMiete', { betrag: fmt(numRent) }),
    numKk > 0 && t('wasStehtMirZu.markeKK', { betrag: fmt(numKk) }),
    canton && t('wasStehtMirZu.markeHaushalt', { canton: getCantonName(canton, t) || canton, size: hh.householdSize }),
  ].filter(Boolean);

  // Eine Ablesung ohne Glas — gleiche Form wie der Pegel (Kasten), für die Fälle, in denen ein
  // Wasserstand nicht ehrlich wäre (data/anspruchWege.js ipvAnzeige).
  const ablesung = (titel, zeilen) => h('div', {
    style: { padding: space.md + 'px', marginTop: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', border: '1px solid ' + palette.border },
  },
    h('div', { style: { fontSize: text.xs, color: palette.mid, fontWeight: weight.medium, marginBottom: '4px' } }, titel),
    ...zeilen.filter(Boolean).map((z, i) => h('div', { key: i, style: { fontSize: i === 0 ? text.sm : text.xs, color: i === 0 ? palette.text : palette.soft, lineHeight: leading.normal, marginTop: i ? '4px' : 0 } }, z)));

  const ipvTitel = t('schnellcheck.ipv');
  const { ipv } = ipvA;
  const fristSatz = ipvA.fristVorbei && h('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginTop: space.xs + 'px' } }, t(ipv.noteKey, ipv.noteParams));
  const ipvTeil = ipvA.art === 'pegel' ? h(React.Fragment, null, h(Pegel, { palette, t, state: ipvA.pegel }), fristSatz)
    : ipvA.art === 'verfuegung' ? ablesung(ipvTitel, [fmt(ipvA.betrag) + ' / ' + t('schnellcheck.monat') + ' (' + t(ipvA.bestaetigt ? 'finanzUebersicht.ipvLautVerfuegung' : 'finanzUebersicht.ipvVerfuegungOhneJahr') + ')'])
    : ipvA.art === 'laden' ? ablesung(ipvTitel, [t('common.loading')])
    : ipvA.art === 'offen' ? ablesung(ipvTitel, [t(ipv.noteKey, ipv.noteParams)])
    : ipvA.art === 'ohneGlas' ? ablesung(ipvTitel, ipv.eligible
      ? [t('pegel.perMonthPossible', { amount: fmt(ipv.amount) }), t('beleg.geschaetzt'), ipvA.fristVorbei && t(ipv.noteKey, ipv.noteParams)]
      : [ipv.cantonData?.maxIncome != null ? t('ipv.incomeAboveLimit', { value: ipv.cantonData.maxIncome }) : t(ipv.noteKey, ipv.noteParams)])
    : null;

  // Der Ergebnis-Satz: «Mit diesen Angaben zeigt sich …» — nur positive Wege, nie ein Verdikt.
  const labels = w.wege.map((x) => wegLabel[x.key]);
  const satz = numIncome <= 0 ? t('schnellcheck.enterIncome')
    : !canton ? t('schnellcheck.noResultNoCanton')
    : labels.length === 0 ? t('wasStehtMirZu.ergebnisKeiner')
    : labels.length === 1 ? t('wasStehtMirZu.ergebnisEiner', { weg: labels[0] })
    : t('wasStehtMirZu.ergebnisMehrere', { wege: labels.join(', ') });

  const zaehlbar = ANSPRUCH_GRUPPEN.flatMap((g) => g.items).filter((i) => i.key !== 'ipv' && i.key !== 'sozialhilfe').length;

  return h('div', { style: { maxWidth: '640px' } },
    // Kopf links (Fassung 5): Titel und ein Satz für beides.
    h('h1', { style: { fontSize: text.xl, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.xs + 'px 0', letterSpacing: '-0.3px' } }, t('dashboard.anspruchTitle')),
    h('p', { style: { fontSize: text.sm, color: palette.mid, margin: 0, lineHeight: leading.relaxed } }, t('wasStehtMirZu.intro')),

    // (1) Mit Ihren Angaben
    h('h2', { id: MIT_ANGABEN_ANKER, className: 'mp-sprungziel', style: { ...s.h2, marginTop: space.lg + 'px' } }, t('wasStehtMirZu.mitAngaben')),
    marken.length > 0 && h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: space.xs + 'px' } },
      marken.map((m) => h('span', { key: m, style: s.marke }, m))),
    h('details', { open: anpassenOffen || undefined, onToggle: (ev) => { const auf = ev.currentTarget.open; if (auf !== anpassenOffen) setAnpassenOffen(auf); } },
      h('summary', { className: 'mp-summary', style: s.summary }, aufklappZeichen(anpassenOffen), t('wasStehtMirZu.anpassen')),
      h('div', { style: { padding: space.sm + 'px 0 ' + space.md + 'px' } },
        h('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap' } },
          h(EinkommenFeld, { palette, t, e }),
          feld(t('schnellcheck.rent'), rent, setRent, '1500'),
          feld(t('schnellcheck.kk'), kk, setKk, '350')),
        h('div', { style: s.fuss },
          canton ? t('schnellcheck.contextCanton', { canton: getCantonName(canton, t) || canton, size: hh.householdSize }) : t('schnellcheck.contextNoCanton'),
          ' ',
          h('button', { type: 'button', onClick: () => onNavigate && onNavigate('chapter', 0), style: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs, color: palette.skyDeep } }, t('schnellcheck.adjustProfile'))))),

    // Ergebnis als Live-Region (a11y-Befund M3): beide Pegel und der Satz.
    h('div', { role: 'status', 'aria-live': 'polite', 'data-ergebnis': 'anspruch' },
      ipvTeil,
      sozPegel && h(Pegel, { palette, t, state: sozPegel }),
      knappSoz && h('div', { style: { fontSize: text.xs, color: palette.sandDeep, marginTop: space.xs + 'px' } }, t('einkommensfeld.knapp')),
      h('p', { style: s.satz }, satz),
      w.ipvSubsumed && w.ipvAmount > 0 && h('p', { style: s.fuss }, t('schnellcheck.ipvSubsumed', { amount: fmt(w.ipvAmount) }))),
    // Wege zu den Rechnern — ausserhalb der Live-Region, damit sie nicht bei jeder Eingabe vorgelesen werden.
    w.wege.length > 0 && numIncome > 0 && canton && h('div', { style: { marginTop: space.xs + 'px' } },
      w.wege.map((x) => h('button', {
        key: x.key, type: 'button', className: 'mp-link', style: s.link,
        onClick: () => onNavigate && (x.key === 'ipv' ? onNavigate(wegView.ipv, undefined, uebergabe) : onNavigate(wegView[x.key])),
      }, wegLabel[x.key] + ' ›'))),

    // (2) Nach Ihrer Lebenslage
    h('h2', { style: s.h2 }, t('wasStehtMirZu.lebenslage')),
    h(LebenslagenAuswahl, { palette, t, data, onNavigate }),

    // (3) Weitere Wege — zugeklappt, die Landkarte ohne das, was oben als Pegel steht.
    h('details', { open: wegeOffen || undefined, onToggle: (ev) => { const auf = ev.currentTarget.open; if (auf !== wegeOffen) setWegeOffen(auf); }, style: { marginTop: space.xl + 'px', borderTop: '1px solid ' + palette.border + '88' } },
      h('summary', { className: 'mp-summary', style: { ...s.summary, justifyContent: 'space-between', paddingTop: space.xs + 'px' } },
        h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: palette.text, fontWeight: weight.semi } }, aufklappZeichen(wegeOffen), t('schnellcheck.moreWays')),
        h('span', { style: { fontSize: text.xs, color: palette.mid } }, String(zaehlbar))),
      h('div', { style: { paddingTop: space.sm + 'px' } },
        h(LandkarteGruppen, { palette, t, onNavigate, ohne: ['ipv', 'sozialhilfe'], mitFuss: false }))),

    // Der geführte Anspruch-Check bleibt eigener Ablauf — nur von hier erreichbar.
    h('button', {
      type: 'button', className: 'mp-link', onClick: () => onNavigate && onNavigate('anspruchcheck'),
      style: { display: 'block', width: '100%', minHeight: '56px', marginTop: space.md + 'px', padding: space.sm + 'px 0', background: 'none', border: 'none', borderTop: '1px solid ' + palette.border + '88', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
    },
      h('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text } }, t('wasStehtMirZu.schrittTitel') + ' ›'),
      h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, t('wasStehtMirZu.schrittSub'))),

    // Hinweise unten (Fassung 5): bewertet nichts · grobe Orientierung · bleibt auf dem Gerät.
    h('p', { style: { ...s.fuss, marginTop: space.lg + 'px', fontStyle: 'italic' } }, t('anspruch.footNote')),
    h('p', { style: s.fuss }, t('schnellcheck.disclaimer')),
    h('p', { style: s.fuss }, t('dashboard.highlightPrivacy'))
  );
};

export default Lebenssituationen;
