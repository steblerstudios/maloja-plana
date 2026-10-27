import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { Icon, HinweisZeichen, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, space, radius, leading, fontFamilyDisplay } from './config/tokens.js';
import landschaft from './assets/berge/landschaft.webp?url';
import { erinnerungSichern, loadReminders, saveReminders } from './utils/reminders.js';
import { useVorlaeufig } from './hooks/vorlaeufigContext.js';
import { GlossarText } from './GlossarBegriff.jsx';
import { renderSource } from './utils/renderSource.js';
import { istVorbei } from './utils/fristen.js';
import { formatDE } from './utils/helpers.js';
import { parseHash } from './utils/hashRouter.js';
import { ablaufBereich, ansichtName } from './config/ansichtenRegister.js';
import { VERWANDTE } from './config/ablaufVerwandte.js';
import { CHAPTER_KEYS } from './config/constants.js';
import { bereichColor, getBereich } from './data/lebensbereiche.js';
import { kontrast, lesbareFarbe } from './utils/lebensbereichFruechte.js';
import { ablaufStandLaden, ablaufStandSichern } from './utils/ablaufStand.js';
import PrimaryButton from './components/PrimaryButton.jsx';

// Wiederverwendbare Ablauf-Schale: die ruhigen, gemeinsamen Bausteine eines geführten
// Ablaufs (Titel, Schritte, Crosslinks, Frist-in-Kalender, Fuss-Hinweise). Erster Nutzer
// war der Zusatzversicherungs-Wechsel; heute bauen alle Abläufe im Register darauf.
// Bewusst schlanke Primitiven statt einer config-getriebenen Engine (keine Über-Abstraktion).
//
// Ablauf-Schale (W), Entscheid Stebler Studios 24.10.2026, gebaut 27.10.2026 (F7-A1): der Container
// zeigt seine `AblaufStep` einen nach dem anderen auf der Passstrasse — so, wie bis dahin nur der
// Umzug (UmzugAblauf.jsx hatte das selbst gebaut; jetzt nutzt er dieselbe Schale). Eine Änderung
// hier, alle Abläufe. VERGLEICH.md «Runde 7 · Ablauf-Schale (W)».

const styles = (palette) => ({
  wrap: { maxWidth: '560px' },
  h2: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
  intro: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: space.lg + 'px' },
  stepTitle: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, margin: space.lg + 'px 0 ' + space.xs + 'px 0' },
  stepText: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed },
  // Querverweis: 44 px Tippziel (Seitenrundgang 27.09.2026 — vorher padding 0, rund 20 px
  // hoch); der Abstand nach oben entfällt dafür, die Zeilenhöhe trägt ihn.
  link: { display: 'flex', alignItems: 'center', minHeight: '44px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium },
  done: { fontSize: text.sm, color: palette.sageDeep, fontWeight: weight.medium, marginTop: space.sm + 'px', outline: 'none' },
  warn: { fontSize: text.sm, color: palette.goldDeep, marginTop: space.xs + 'px' },
  note: { fontSize: text.sm, color: palette.mid, marginTop: space.sm + 'px' },
  footer: { fontSize: text.xs, color: palette.soft, marginTop: space.xl + 'px', lineHeight: leading.normal },
});

// Welcher Ablauf offen ist: ausdrücklich (`ablauf`, z. B. 'umzug') oder aus der Adresse, aber
// nur, wenn die Ansicht im Register steht. Seiten, die die Schale ohne Ablauf nutzen (Notfallkarte,
// Notfallpass), bekommen null — dort bleibt alles untereinander wie bisher.
const ablaufAusAdresse = () => {
  try {
    const ansicht = typeof window !== 'undefined' ? parseHash() : null;
    return ansicht && ablaufBereich(ansicht.view) ? ansicht.view : null;
  } catch { return null; }
};
const ablaufName = (ablauf) => (ablauf && ablaufBereich(ablauf) ? ablauf : null) || ablaufAusAdresse();

// Der Name des offenen Ablaufs für die Frist-Knöpfe darin (Kalender-Band, utils/laufendeAblaeufe.js).
const AblaufNameContext = createContext(null);

// Farbe des Lebensbereichs für den offenen Ablauf (Entscheid Stebler Studios 27.09.2026):
// Passstrasse, Zeichen im Kopf. Welcher Ablauf offen ist, sagt die Adresse oder `ablauf`;
// die Zuordnung steht im Register (ABLAEUFE.bereich).
// Ohne Hex-Grundfarbe (Tests mit sparsamer Palette) keine Bereichsfarbe — rechnen ginge nicht.
const hexGrund = (palette) => /^#[0-9a-f]{6}$/i.test(palette.bg || '');
const dunkelGrund = (palette) => kontrast(palette.bg, '#FFFFFF') > kontrast(palette.bg, '#000000');
const ablaufFarbe = (palette, name = ablaufAusAdresse()) => {
  const key = name && ablaufBereich(name);
  if (!key || !hexGrund(palette)) return null;
  const dunkel = dunkelGrund(palette);
  const farbe = bereichColor(key, dunkel);
  // Das Zeichen ist Grafik: 3:1 (WCAG 1.4.11) genügt.
  return farbe ? { balken: farbe, zeichen: lesbareFarbe(farbe, palette.surface || palette.bg, dunkel, 3) } : null;
};

// Schriftfarbe des Bereichs für kleinen Text («Schritt 2 von 4»): 4.5:1 statt 3:1 wie beim Zeichen.
export const ablaufTextFarbe = (palette, name = ablaufAusAdresse()) => {
  const key = name && ablaufBereich(name);
  if (!key || !hexGrund(palette)) return null;
  const dunkel = dunkelGrund(palette);
  const farbe = bereichColor(key, dunkel);
  return farbe ? lesbareFarbe(farbe, palette.bg, dunkel, 4.5) : null;
};

// Kapitel eines Ablaufs (Brotkrume und Link «Zum Kapitel …», F7-A4): der Bereich aus dem Register.
// Bereiche ohne eigenes Kapitel wie bei Kalender und Merkliste festgelegt (Stebler Studios 23.10.2026,
// data/aufgabenBereiche.js): Gesundheit und Vorsorge → Versicherungen & Vorsorge, Arbeit → Ausbildung
// & Arbeit, Familie → Persönliche Basis.
const KAPITEL_OHNE_EIGENES = { gesundheit: 'versicherungen', vorsorge: 'versicherungen', arbeit: 'ausbildung', familie: 'basis' };
export const ablaufKapitel = (name) => {
  const b = ablaufBereich(name);
  if (!b) return null;
  const l = getBereich(b);
  return (l && l.chapterKey) || KAPITEL_OHNE_EIGENES[b] || null;
};

// Kopf wie im Mockup Fassung 5 (Entscheid Stebler Studios 23.10.2026, erster Nutzer: Umzug; seit
// Entwurf W alle Abläufe): Landschaftsband oben (Malojapass, halb durchsichtig, getönt in der
// Bereichsfarbe, läuft in den Grund aus), darauf die Brotkrume «Übersicht › Kapitel › Ablauf» als
// Pille, darunter das Zeichen in einer Kachel neben dem Titel. Ersetzt Balken oben und «← Übersicht»
// (main.jsx lässt es für alle Abläufe im Register weg). Das Band hebt den Rand von <main> selbst auf
// (24 px oben, 20 px seitlich). `kopf`: { t, onNavigate, bereichTitel, zumBereich }.
const BAND_HOEHE = 112;
const MockKopf = ({ palette, farbe, icon, title, kopf }) => {
  const { t, onNavigate, bereichTitel, zumBereich } = kopf;
  const stufe = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs, color: palette.mid, padding: 0, minHeight: '44px' };
  const pfeil = (k) => React.createElement('span', { key: k, 'aria-hidden': 'true', style: { color: palette.soft } }, '›');
  const balken = farbe ? farbe.balken : palette.sage;
  return React.createElement(React.Fragment, null,
    React.createElement('div', { 'aria-hidden': 'true', 'data-ablauf-band': '', style: { position: 'relative', height: BAND_HOEHE + 'px', overflow: 'hidden', margin: '-24px -20px 0' } },
      React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'url(' + landschaft + ') center 72% / cover', opacity: 0.5 } }),
      React.createElement('div', { style: { position: 'absolute', inset: '0 0 -1px 0', background: 'linear-gradient(to bottom, ' + balken + '38 0%, transparent 45%, ' + palette.bg + ' 100%)' } })
    ),
    React.createElement('div', { style: { position: 'relative', marginTop: '-52px' } },
      React.createElement('nav', { 'aria-label': t('nav.pfad'), style: { marginBottom: space.md + 'px' } },
        React.createElement('div', { style: { display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 8px', padding: '0 12px', borderRadius: radius.full + 'px', background: palette.bg + 'B8', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' } },
          React.createElement('button', { type: 'button', className: 'mp-link', style: stufe, onClick: () => onNavigate && onNavigate('dashboard') }, t('nav.backToDashboard')),
          bereichTitel && pfeil('p1'),
          bereichTitel && React.createElement('button', { type: 'button', className: 'mp-link', style: stufe, onClick: zumBereich }, bereichTitel),
          pfeil('p2'),
          React.createElement('span', { 'aria-current': 'page', style: { fontSize: text.xs, color: palette.text } }, title)
        )
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: space.sm + 'px' } },
        icon && React.createElement('span', { 'aria-hidden': 'true', style: { width: '52px', height: '52px', borderRadius: radius.lg + 'px', flexShrink: 0, display: 'grid', placeItems: 'center', background: balken + '2E', boxShadow: 'inset 0 0 0 1px ' + balken + '4D', color: farbe ? farbe.zeichen : palette.text } },
          React.createElement(Icon, { name: icon, size: 26 })),
        React.createElement(PageTitle, { palette, style: { fontFamily: fontFamilyDisplay, fontSize: '30px', lineHeight: 1.05, letterSpacing: '-.015em', minWidth: 0 } }, title)
      )
    )
  );
};

// Die Schritt-Titel tragen ihre Nummer («2 · …»); im Schritt-für-Schritt steht die Nummer
// schon in «Schritt 2 von 4» darüber — darum dort ohne.
export const ohneNummer = (titel) => String(titel).replace(/^\s*\d+\s*·\s*/, '');

// Kinder flach machen: Fragmente (z. B. MahnungTeil) und Listen zählen wie direkte Kinder.
const flach = (kinder) => React.Children.toArray(kinder).flatMap((k) => (k && k.type === React.Fragment ? flach(k.props.children) : [k]));

// «Reiner Info-Schritt» (Entwurf W, Stebler Studios: «Weiter ›» statt «Erledigt, weiter ›»): ein Schritt
// ohne etwas zum Tun — kein Knopf, Link, Feld, keine Frist. Erkannt am Inhalt: jedes Bauteil ausser
// Glossar-Text und Zeichen zählt als Aktion, dazu Knöpfe, Links, Felder und Aufklapp-Zeilen. `info`
// am AblaufStep setzt es ausdrücklich.
const OHNE_AKTION = new Set(['p', 'div', 'span', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br', 'small', 'h4']);
const hatAktion = (k) => {
  if (Array.isArray(k)) return k.some(hatAktion);
  if (!k || typeof k !== 'object' || !k.type) return false;
  if (typeof k.type === 'string') return !OHNE_AKTION.has(k.type) || !!k.props.onClick || hatAktion(k.props.children);
  if (k.type === GlossarText || k.type === Icon || k.type === HinweisZeichen) return false;
  if (k.type === React.Fragment) return hatAktion(k.props.children);
  return true;
};
export const istInfoSchritt = (schritt) => (schritt.props.info !== undefined ? !!schritt.props.info : !hatAktion(schritt.props.children));

// Stand je Ablauf (utils/ablaufStand.js): gespeichert, im Beispiel/Ausprobieren nur für jetzt.
export const useAblaufStand = (name, total) => {
  const vorlaeufig = useVorlaeufig();
  const [stand, setRoh] = useState(() => (name ? ablaufStandLaden(name, total, vorlaeufig) : { schritt: 0, fertig: false }));
  const setStand = (next) => { setRoh(next); if (name) ablaufStandSichern(name, next, vorlaeufig); };
  return [stand, setStand];
};

// Ruhige Marke für einen erledigten Schritt (Entwurf W): Haken + Kurzname.
const Marke = ({ palette, farbe, children }) => React.createElement('li', {
  style: { fontSize: text.xs, color: palette.mid, border: '1px solid ' + palette.border, borderRadius: radius.full + 'px', padding: '4px 10px 4px 8px', display: 'inline-flex', gap: '5px', alignItems: 'center' },
}, React.createElement('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: farbe } }, React.createElement(Icon, { name: 'check', size: 12 })), children);

// Der Schritt-für-Schritt-Teil. Alle Schritte bleiben im DOM (die übrigen `hidden`), damit Eingaben
// beim Blättern bleiben (ein Datum in einer Frist, ein gewählter Weg) und Sprungmarken sie finden.
// Fokus nach dem Blättern auf die Schrittfläche — sie ist darum NICHT zugleich aria-live (a11y-Befund
// Entwurf W: beim Umzug wurde der Schritt doppelt angesagt).
const Schritte = ({ palette, t, onNavigate, name, schritte, stand, setStand, passNamen, abschlussText }) => {
  const s = styles(palette);
  const textFarbe = ablaufTextFarbe(palette, name) || palette.sageDeep || palette.mid;
  const markenFarbe = (ablaufFarbe(palette, name) || {}).zeichen || palette.sageDeep;
  const total = schritte.length;
  const nr = Math.min(stand.schritt, total - 1);
  const letzter = nr === total - 1;
  const flaeche = useRef(null);
  const gewechselt = useRef(false);
  useEffect(() => {
    if (gewechselt.current && flaeche.current) flaeche.current.focus();
  }, [stand.schritt, stand.fertig]);
  const geheZu = (next) => { gewechselt.current = true; setStand(next); };
  const ruhigerKnopf = { minHeight: '44px', background: 'none', border: 'none', padding: '0 ' + space.sm + 'px', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.mid };
  const titelStil = { marginTop: space.xs + 'px', fontFamily: fontFamilyDisplay, fontSize: '22px', lineHeight: 1.2 };
  const info = istInfoSchritt(schritte[nr]);

  return React.createElement(React.Fragment, null,
    React.createElement(AblaufPass, { palette, name, total, aktuell: nr, fertig: stand.fertig, namen: passNamen }),
    React.createElement('div', { ref: flaeche, tabIndex: -1, 'data-ablauf-flaeche': '', style: { outline: 'none' } },
      stand.fertig && React.createElement('div', { 'data-ablauf-schritt': 'fertig' },
        React.createElement('span', { style: { display: 'inline-flex', color: markenFarbe } }, React.createElement(Icon, { name: 'check', size: 28 })),
        React.createElement(PanelTitle, { palette, style: { margin: space.sm + 'px 0 ' + space.xs + 'px' } }, t('ablauf.fertigTitel', { n: String(total) })),
        abschlussText && React.createElement('p', { style: s.stepText }, abschlussText),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm + 'px', marginTop: space.md + 'px' } },
          onNavigate && React.createElement(PrimaryButton, { palette, style: { minHeight: '44px' }, onClick: () => onNavigate('dashboard') }, t('ablauf.zurUebersicht')),
          React.createElement('button', { type: 'button', style: ruhigerKnopf, onClick: () => geheZu({ schritt: 0, fertig: false }) }, t('ablauf.nochmals')))
      ),
      schritte.map((schritt, i) => React.createElement('div', { key: 'schritt' + i, 'data-ablauf-schritt': String(i + 1), hidden: stand.fertig || i !== nr },
        React.createElement('div', { style: { fontSize: text.xs, color: textFarbe, fontWeight: weight.semi } }, t('onboarding.stepOf', { current: i + 1, total })),
        React.cloneElement(schritt, { title: ohneNummer(schritt.props.title), titelStyle: { ...titelStil, ...schritt.props.titelStyle } })
      )),
      !stand.fertig && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm + 'px', marginTop: space.lg + 'px' } },
        React.createElement(PrimaryButton, {
          palette, style: { minHeight: '44px' }, 'data-ablauf-weiter': letzter ? 'abschliessen' : info ? 'info' : 'erledigt',
          onClick: () => geheZu(letzter ? { schritt: nr, fertig: true } : { schritt: nr + 1, fertig: false }),
        }, letzter ? t('ablauf.abschliessen') : info ? t('ablauf.weiterInfo') : t('ablauf.weiter')),
        nr > 0 && React.createElement('button', { type: 'button', style: ruhigerKnopf, onClick: () => geheZu({ schritt: nr - 1, fertig: false }) },
          React.createElement('span', { 'aria-hidden': 'true', style: { marginInlineEnd: '4px' } }, '‹'), t('common.back'))
      ),
      // Erledigte Schritte als Marken (Entwurf W), nur unterwegs — beim Abschluss sagt es der Satz.
      !stand.fertig && nr > 0 && React.createElement('ul', { 'aria-label': t('ablauf.erledigt'), 'data-ablauf-marken': '', style: { display: 'flex', flexWrap: 'wrap', gap: '6px', listStyle: 'none', padding: 0, margin: space.md + 'px 0 0' } },
        schritte.slice(0, nr).map((schritt, i) => React.createElement(Marke, { key: i, palette, farbe: markenFarbe }, ohneNummer(schritt.props.title))))
    )
  );
};

// Container mit Kopf (Icon + Titel + Intro) und beliebigen Kindern.
// Für einen Ablauf im Register (`ablauf` oder Adresse) Schritt für Schritt: Kopf mit Brotkrume,
// Passstrasse, ein Schritt nach dem anderen; was vor dem ersten Schritt steht, bleibt oben, was
// danach steht (z. B. «Wenn das Taggeld endet»), «Verwandte Ereignisse» und der Fuss immer unten
// — keine Stationen. Ohne Ablauf-Namen (Notfallkarte, Notfallpass) alles untereinander wie bisher.
// `t`/`onNavigate` braucht der Kopf; `passNamen` (kurze Wörter je Station) und `abschlussText`
// (Satz unter «Alle N Schritte sind erledigt») sind freiwillig; `stand`/`setStand` nur, wenn der
// Ablauf selbst springen muss (KVG-Wechsel: Wahl in Schritt 1 → zurück an den Anfang).
export const AblaufContainer = ({ palette, t, onNavigate, ablauf, icon, title, intro, kopf, passNamen, abschlussText, stand: standVon, setStand: setStandVon, children }) => {
  const s = styles(palette);
  const name = ablaufName(ablauf);
  const kinder = flach(children);
  const schritte = kinder.filter((k) => k.type === AblaufStep);
  const schrittweise = !!(name && t && schritte.length);
  const [standEigen, setStandEigen] = useAblaufStand(schrittweise && !standVon ? name : null, schritte.length || 1);
  const stand = standVon || standEigen;
  const setStand = setStandVon || setStandEigen;
  const farbe = ablaufFarbe(palette, name);

  if (!schrittweise) {
    if (kopf) {
      return React.createElement('div', null,
        React.createElement(MockKopf, { palette, farbe, icon, title, kopf }),
        React.createElement('div', { style: s.wrap },
          intro ? React.createElement('p', { style: s.intro }, React.createElement(GlossarText, { palette }, intro)) : null,
          children));
    }
    return React.createElement('div', { style: farbe ? { ...s.wrap, borderTop: '4px solid ' + farbe.balken, paddingTop: space.md + 'px' } : s.wrap },
      // Kein Rückfall-Zeichen mehr (bis 27.09.2026 'insurance'): ein Ablauf ohne Zeichen zeigt
      // keines, statt still das der Versicherung. Wächter: zeichenEineQuelle.test.js.
      React.createElement(PageTitle, { palette, icon: icon ? React.createElement('span', { style: { display: 'inline-flex', color: farbe ? farbe.zeichen : undefined } }, React.createElement(Icon, { name: icon, size: 22 })) : null, style: { marginBottom: space.sm + 'px' } }, title),
      intro ? React.createElement('p', { style: s.intro },
        React.createElement(GlossarText, { palette }, intro)) : null,
      children
    );
  }

  const erster = kinder.findIndex((k) => k.type === AblaufStep);
  const unten = (k) => k.type === AblaufFooter || k.type === AblaufVerwandt;
  const vorne = kinder.slice(0, erster).filter((k) => !unten(k));
  const hinten = kinder.slice(erster).filter((k) => k.type !== AblaufStep && !unten(k));
  const kapitel = ablaufKapitel(name);
  const kapitelIdx = kapitel ? CHAPTER_KEYS.indexOf(kapitel) : -1;
  const kopfDaten = kopf || {
    t, onNavigate,
    bereichTitel: kapitelIdx >= 0 ? t('chapters.' + kapitel + '.title') : null,
    zumBereich: () => onNavigate && kapitelIdx >= 0 && onNavigate('chapter', kapitelIdx),
  };
  return React.createElement(AblaufNameContext.Provider, { value: name },
    React.createElement('div', { 'data-ablauf': name },
      React.createElement(MockKopf, { palette, farbe, icon, title, kopf: kopfDaten }),
      React.createElement('div', { style: s.wrap },
        intro ? React.createElement('p', { style: s.intro }, React.createElement(GlossarText, { palette }, intro)) : null,
        ...vorne,
        React.createElement(Schritte, { palette, t, onNavigate, name, schritte, stand, setStand, passNamen, abschlussText }),
        ...hinten,
        // «Verwandte Ereignisse» und der Weg ins Kapitel (F7-A4): in jedem Ablauf, aus config/ablaufVerwandte.js.
        // Ein Ablauf kann eigene mitgeben (AblaufVerwandt als Kind) — dann gelten die.
        ...(kinder.some((k) => k.type === AblaufVerwandt) ? kinder.filter((k) => k.type === AblaufVerwandt) : [
          React.createElement(AblaufVerwandt, { key: 'verwandt', palette, title: t('ablauf.verwandtTitel') },
            onNavigate && (VERWANDTE[name] || []).map((v) => React.createElement(AblaufLink, { key: v, palette, label: t(ansichtName(v)), onClick: () => onNavigate(v) })),
            onNavigate && kapitelIdx >= 0 && React.createElement(AblaufLink, { key: 'kapitel', palette, label: t('ablauf.kapitelLink', { name: t('chapters.' + kapitel + '.title') }), onClick: () => onNavigate('chapter', kapitelIdx) })),
        ]),
        ...kinder.filter((k) => k.type === AblaufFooter))
    )
  );
};

// Ein ruhiger Schritt: Titel + freier Inhalt.
// `titelStyle` (Fassung 5): der grössere Schritt-Titel im Schritt-für-Schritt.
// `info` (freiwillig): reiner Info-Schritt ja/nein, sonst am Inhalt erkannt (istInfoSchritt).
export const AblaufStep = ({ palette, title, icon, titelStyle, children }) => {
  const stil = { margin: space.lg + 'px 0 ' + space.xs + 'px 0', ...titelStyle };
  return React.createElement(React.Fragment, null,
    icon
      ? React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: icon, size: 20 }), style: stil }, title)
      : React.createElement(PanelTitle, { palette, style: stil }, title),
    children
  );
};

// «Verwandte Ereignisse» (Entwurf W): keine Station, steht immer unten über dem Fuss.
export const AblaufVerwandt = ({ palette, title, children }) => React.createElement('div', { 'data-ablauf-verwandt': '', style: { marginTop: space.xl + 'px', borderTop: '1px solid ' + palette.border, paddingTop: space.md + 'px' } },
  React.createElement(PanelTitle, { palette, style: { fontSize: text.body, margin: '0 0 ' + space.xs + 'px' } }, title),
  children);

// Crosslink-Knopf „→ Label" → onNavigate-Ziel.
export const AblaufLink = ({ palette, label, onClick }) => {
  const s = styles(palette);
  return React.createElement('button', { type: 'button', className: 'mp-link', style: s.link, onClick }, label,
    React.createElement('span', { 'aria-hidden': 'true', style: { marginInlineStart: '4px' } }, '›'));
};

// Nach dem Speichern einer Frist aus einem Ablauf (`reminder.ablauf`, z. B. 'umzug'): die gespeicherte
// Erinnerung — offen, gleicher Titel und gleiches Datum, wie addReminder sie findet — trägt danach
// `ablauf`. Der Kalender lässt das grüne Band des Ablaufs an ihr enden (utils/laufendeAblaeufe.js).
// Bewusst hier und nicht in addReminder: das liegt im Startbündel, die Ablauf-Schale nicht (27.10.2026).
export const fristDemAblaufZuordnen = (reminder) => {
  if (!reminder || !reminder.ablauf) return;
  let geaendert = false;
  const neu = loadReminders().map((r) => {
    if (r.done || r.title !== reminder.title || r.dueDate !== reminder.dueDate || r.ablauf === reminder.ablauf) return r;
    geaendert = true;
    return { ...r, ablauf: reminder.ablauf };
  });
  if (geaendert) saveReminders(neu);
};

// Frist-in-Kalender-Knopf: legt beim Klick eine Erinnerung an, zeigt danach Bestätigung.
// onSaved (optional): wird nach erfolgreichem Speichern aufgerufen — z.B. um zusätzlich
// ein Merkliste-Todo anzulegen (KVG-Faden).
// Im Beispiel und beim Ausprobieren (`vorlaeufig`) schreibt der Knopf nichts (erinnerungSichern)
// und läuft auch kein onSaved. Wie GespeichertZeile sagt er dann «nur für jetzt».
// Rückgabe: 'gespeichert' | 'vorlaeufig' | null (Speichern gescheitert).
export const fristSichern = (reminder, { vorlaeufig, onSaved } = {}) => {
  const ergebnis = erinnerungSichern(reminder, vorlaeufig);
  if (ergebnis === 'gespeichert') fristDemAblaufZuordnen(reminder); // Band im Kalender endet an dieser Frist
  if (ergebnis === 'gespeichert' && onSaved) onSaved(); // nur nach echtem Speichern
  return ergebnis;
};

// Die Frist als Karte (Entwurf W: «Frist als Karte in jedem Ablauf»): Titel der Erinnerung, darunter
// das Datum, daneben ein ruhiger Knopf «In den Kalender». Vorher stand bei allen Abläufen ausser dem
// Umzug ein Hauptknopf «Frist «…» in den Kalender (Datum)». `kompakt`: nur der ruhige Knopf (für
// eine Karte, die EreignisFrist selbst zeichnet).
// `art` ('frist' | sonst Erinnerung, Entscheid 27.09.2026 «Frist oder Erinnerung»): rechtliche Frist →
// «bis Datum», Erinnerung → «Erinnerung am Datum». `buttonLabel` (der bisherige ausführliche Knopftext,
// «Frist «…» in den Kalender (Datum)») bleibt als zugänglicher Name des Knopfs — was in den Kalender geht.
// a11y (Entwurf W): nach «In den Kalender» verschwindet der Knopf; der Fokus geht auf die Bestätigung
// (Live-Region), statt verloren zu gehen.
const kartenStil = (palette, vorbei) => ({
  marginTop: space.sm + 'px', padding: space.sm + 'px ' + space.md + 'px', borderRadius: radius.sm,
  border: '1px solid ' + (vorbei ? palette.gold || palette.border : palette.border),
  background: palette.up, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px',
});
export const FristButton = ({ palette, t, art, buttonLabel, doneLabel, calendarLabel, reminder: reminderRoh, onNavigate, onSaved, kompakt = false }) => {
  const s = styles(palette);
  const vorlaeufig = useVorlaeufig();
  const ablauf = useContext(AblaufNameContext);
  const reminder = ablauf && !reminderRoh.ablauf ? { ...reminderRoh, ablauf } : reminderRoh;
  const [done, setDone] = useState(null);
  const bestaetigung = useRef(null);
  useEffect(() => { if (done && bestaetigung.current) bestaetigung.current.focus(); }, [done]);
  const handle = () => setDone(fristSichern(reminder, { vorlaeufig, onSaved }));
  const zeichen = React.createElement(Icon, { name: 'calendar', size: 16 });
  const inhalt = done
    ? React.createElement('div', null,
      React.createElement('div', { ref: bestaetigung, tabIndex: -1, role: 'status', style: s.done }, hinweisZeichen('check'), done === 'vorlaeufig' ? t('common.savedTemporary') : doneLabel),
      done !== 'vorlaeufig' && onNavigate && calendarLabel
        ? React.createElement('button', { type: 'button', className: 'mp-link', style: s.link, onClick: () => onNavigate('calendar') }, calendarLabel)
        : null)
    : React.createElement('button', {
      type: 'button', onClick: handle, 'aria-label': buttonLabel || undefined,
      style: {
        display: 'inline-flex', alignItems: 'center', gap: space.xs + 'px', minHeight: '44px', boxSizing: 'border-box',
        padding: '0 ' + space.md + 'px', background: 'none', border: '1.5px solid ' + palette.sand, borderRadius: radius.sm,
        color: palette.sandDeep, fontSize: text.sm, fontWeight: weight.semi, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0,
      },
    }, zeichen, t('kvg.addToCalendar'));
  if (kompakt) return inhalt;
  return React.createElement('div', { 'data-frist-karte': 'offen', style: kartenStil(palette, false) },
    React.createElement('div', { style: { minWidth: 0 } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, reminder.title),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t(art === 'frist' ? 'ablauf.fristBis' : 'ablauf.fristErinnerung', { date: formatDE(reminder.dueDate) }))),
    inhalt);
};

// Frist ab einem Ereignis, das die Person selbst angibt (Zustellung, Geburt,
// Vertragsende …). Ohne Datum: KEIN Termin. Ist die Frist schon vorbei: kein neuer
// Termin, sondern der ruhige Satz «vorbei — bei der Stelle nachfragen». Die
// Rechnung selbst (`frist`) kommt aus utils/fristen.js — nie später als das Gesetz.
// `wert`/`onWert` optional: wer das Datum auch anderswo braucht, hält es selbst.
// Seit Entwurf W (F7-A1) immer als Karte: «{Titel der Erinnerung} · bis {Datum}» (bzw. «Erinnerung am …»,
// wenn `art` nicht 'frist' ist) mit «In den Kalender»,
// darüber der Satz mit Gesetzesartikel (`hinweisKey`) wie bisher. `karte` (Umzug, Fassung 5) setzt
// eigene Texte: { titelKey, bisKey, knopfKey }. Vorbei: dieselbe Karte mit dem ruhigen Satz statt Knopf.
export const EreignisFrist = ({ palette, t, art, id, labelKey, hinweisKey, vorbeiKey, buttonKey, doneKey, calendarKey,
  reminderTitle, reminderNotes, category = 'admin', frist, wert, onWert, onNavigate, ohneFeld = false, karte = null, ablauf = '' }) => {
  const s = styles(palette);
  const [eigen, setEigen] = useState(wert || '');
  const datum = onWert ? (wert || '') : eigen;
  const setze = onWert || setEigen;
  const ziel = frist(datum);
  const vorbei = istVorbei(ziel);
  const reminder = { title: reminderTitle, dueDate: ziel, category, recurrence: 'once', ...(reminderNotes ? { notes: reminderNotes } : {}), ...(ablauf ? { ablauf } : {}) };
  const fristKarte = ziel ? React.createElement('div', { 'data-frist-karte': vorbei ? 'vorbei' : 'offen', style: kartenStil(palette, vorbei) },
    vorbei
      ? React.createElement('p', { style: { ...s.stepText, color: palette.text, margin: 0 } }, t(vorbeiKey, { date: formatDE(ziel) }))
      : React.createElement(React.Fragment, null,
        React.createElement('div', { style: { minWidth: 0 } },
          React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, karte ? t(karte.titelKey) : reminderTitle),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t(karte ? karte.bisKey : art === 'frist' ? 'ablauf.fristBis' : 'ablauf.fristErinnerung', { date: formatDE(ziel) }))),
        React.createElement(FristButton, {
          // Ein neues Datum ist ein neuer Termin — der Knopf beginnt wieder unbestätigt.
          key: ziel, palette, t, onNavigate, kompakt: true, reminder,
          buttonLabel: buttonKey ? t(buttonKey, { date: formatDE(ziel) }) : null,
          doneLabel: t(doneKey),
          calendarLabel: calendarKey ? t(calendarKey) : null,
        }))
  ) : null;
  // `ohneFeld`: das Datum kommt aus einem Feld weiter oben im selben Ablauf (ein
  // Ereignis, zwei Fristen — z.B. Einreise → Gemeinde und Führerausweis). Dann kein
  // zweites Eingabefeld, das dieselbe Frage noch einmal stellt.
  return React.createElement('div', null,
    !ohneFeld && React.createElement('label', { htmlFor: id, style: { fontSize: text.sm, color: palette.mid, display: 'block', margin: space.sm + 'px 0 ' + space.xs + 'px' } }, t(labelKey)),
    !ohneFeld && React.createElement('input', {
      id, type: 'date', value: datum, onChange: (e) => setze(e.target.value),
      style: { padding: '10px 12px', minHeight: '44px', boxSizing: 'border-box', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.up, color: palette.text, fontSize: text.sm, fontFamily: 'inherit' },
    }),
    !karte && ziel && !vorbei && React.createElement('p', { style: { ...s.stepText, marginTop: space.sm + 'px' } }, t(hinweisKey, { date: formatDE(ziel) })),
    fristKarte
  );
};

// Passstrasse mit n Kehren (Entwurf W, Entscheid Stebler Studios 24.10.2026; vorher fest vier Stationen
// für den Umzug): aus der Zahl der Schritte gerechnet — die Strasse steigt in Kehren von unten links nach
// oben rechts, eine Station je Kehre (abwechselnd links/rechts, Kehren leicht unterschiedlich weit), die
// Höhe wächst mit N (40 px je Kehre, damit sich die Fahrbahnen nie berühren). Geometrie aus dem Entwurf
// (seiten-v5.html?nur=w). Der gefahrene Teil in der Farbe des Bereichs, erledigte Stationen mit Haken,
// die aktuelle etwas grösser. Reine Grafik (aria-hidden) — wo man steht, sagt «Schritt n von N».
export const passHoehe = (n) => Math.max(150, 36 + (n - 1) * 40);
export const passPunkte = (n) => {
  const H = passHoehe(n);
  return Array.from({ length: n }, (_, i) => ({
    x: n === 1 ? 170 : (i % 2 === 0 ? [40, 74, 52, 88][(i / 2) % 4] : [300, 262, 284, 248][((i - 1) / 2) % 4]),
    y: H - 18 - (n === 1 ? 0 : i * ((H - 36) / (n - 1))),
  }));
};
// Serpentine: in jeder Kehre senkrechte Tangente (die Station sitzt im Scheitel), dazwischen ein weicher Bogen.
export const passPfad = (pts) => pts.reduce((d, p, i) => {
  if (!i) return `M${p.x} ${p.y}`;
  const q = pts[i - 1], h = q.y - p.y;
  return d + ` C${q.x} ${q.y - h * 0.55}, ${p.x} ${p.y + h * 0.55}, ${p.x} ${p.y}`;
}, '');

// `namen` (optional, kurze Wörter): die Stationen beschriftet, neben der Station zur Mitte hin.
export const AblaufPass = ({ palette, name, total, aktuell, fertig, namen }) => {
  const farbe = (ablaufFarbe(palette, name) || {}).zeichen || palette.sageDeep || palette.sage;
  const n = Math.max(1, total);
  const pts = passPunkte(n);
  const d = passPfad(pts);
  const bis = fertig ? n - 1 : Math.min(Math.max(aktuell, 0), n - 1);
  return React.createElement('svg', {
    viewBox: '0 0 340 ' + passHoehe(n), 'aria-hidden': 'true', focusable: 'false', 'data-ablauf-pass': fertig ? 'fertig' : String(aktuell), 'data-kehren': String(n),
    style: { display: 'block', width: '100%', maxWidth: '340px', height: 'auto', margin: '0 0 ' + space.md + 'px' },
  },
    React.createElement('path', { d, fill: 'none', stroke: palette.border, strokeWidth: 12, strokeLinecap: 'round' }),
    // Der gefahrene Teil als eigener Weg bis zur aktuellen Station — genau, auch wenn die Kehren ungleich lang sind.
    bis > 0 && React.createElement('path', { d: passPfad(pts.slice(0, bis + 1)), fill: 'none', stroke: farbe, strokeWidth: 12, strokeLinecap: 'round' }),
    React.createElement('path', { d, fill: 'none', stroke: palette.bg, strokeWidth: 1.2, strokeDasharray: '5 6', opacity: 0.8 }),
    pts.map((p, i) => {
      const erledigt = fertig || i < aktuell;
      const jetzt = !fertig && i === aktuell;
      return React.createElement('g', { key: i },
        React.createElement('circle', { cx: p.x, cy: p.y, r: jetzt ? 11 : 9, fill: erledigt ? farbe : palette.bg, stroke: erledigt || jetzt ? farbe : palette.border, strokeWidth: 3 }),
        erledigt
          ? React.createElement('path', { d: `M${p.x - 4} ${p.y} l3 3 5-6`, stroke: palette.bg, strokeWidth: 2.2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
          : React.createElement('text', { x: p.x, y: p.y + 4, textAnchor: 'middle', style: { fontSize: '11px', fontWeight: 600, fill: jetzt ? farbe : palette.soft } }, String(i + 1)),
        namen && namen[i] && React.createElement('text', {
          x: p.x + (p.x < 170 ? 16 : -16), y: p.y + 4, textAnchor: p.x < 170 ? 'start' : 'end',
          style: { fontSize: '11px', fill: palette.mid, paintOrder: 'stroke', stroke: palette.bg, strokeWidth: '4px', strokeLinejoin: 'round' },
        }, namen[i]));
    })
  );
};

// Fuss-Hinweise (Hinweis-Piktogramm je Zeile).
// `quelle`: die Zeile «Quellen: … · Stand …» (i18n-Text mit [[Wort|url]]-Markern,
// siehe utils/renderSource.js). Steht zuoberst im Fuss, weil sie für den ganzen
// Ablauf gilt. Seit 24.09.2026 trägt jeder Ablauf im Register eine. Wache:
// src/__tests__/ablaufQuellen.test.js.
export const AblaufFooter = ({ palette, notes, quelle, t }) => {
  const s = styles(palette);
  return React.createElement('div', { style: s.footer },
    quelle ? React.createElement('div', { key: 'quelle', style: { marginBottom: '6px' } }, renderSource(quelle, null, t)) : null,
    (notes || []).flatMap((n, i) => [
      i > 0 ? React.createElement('br', { key: 'br' + i }) : null,
      hinweisZeichen(undefined, undefined, 'z' + i), n,
    ])
  );
};

export { styles as ablaufStyles };
