import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, space, radius, leading, fontFamilyDisplay } from './config/tokens.js';
import landschaft from './assets/berge/landschaft.webp?url';
import { erinnerungSichern, loadReminders, saveReminders } from './utils/reminders.js';
import { useVorlaeufig } from './hooks/vorlaeufigContext.js';
import { GlossarText } from './GlossarBegriff.jsx';
import { renderSource } from './utils/renderSource.js';
import { istVorbei } from './utils/fristen.js';
import { formatDE } from './utils/helpers.js';
import { parseHash } from './utils/hashRouter.js';
import { ablaufBereich } from './config/ansichtenRegister.js';
import { bereichColor } from './data/lebensbereiche.js';
import { kontrast, lesbareFarbe } from './utils/lebensbereichFruechte.js';
import PrimaryButton from './components/PrimaryButton.jsx';

// Wiederverwendbare Ablauf-Schale: die ruhigen, gemeinsamen Bausteine eines geführten
// Ablaufs (Titel, Schritte, Crosslinks, Frist-in-Kalender, Fuss-Hinweise). Erster Nutzer
// war der Zusatzversicherungs-Wechsel; heute bauen alle Abläufe ausser AsylView darauf (34 im Register, Stand 27.09.2026), auch der
// KVG-Wechsel (Stand 24.09.2026). Nur AsylView hat seine eigene Gliederung.
// Bewusst schlanke Primitiven statt einer config-getriebenen Engine (keine Über-Abstraktion).

const styles = (palette) => ({
  wrap: { maxWidth: '560px' },
  h2: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
  intro: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: space.lg + 'px' },
  stepTitle: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, margin: space.lg + 'px 0 ' + space.xs + 'px 0' },
  stepText: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed },
  // Querverweis: 44 px Tippziel (Seitenrundgang 27.09.2026 — vorher padding 0, rund 20 px
  // hoch); der Abstand nach oben entfällt dafür, die Zeilenhöhe trägt ihn.
  link: { display: 'flex', alignItems: 'center', minHeight: '44px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium },
  done: { fontSize: text.sm, color: palette.sageDeep, fontWeight: weight.medium, marginTop: space.sm + 'px' },
  warn: { fontSize: text.sm, color: palette.goldDeep, marginTop: space.xs + 'px' },
  note: { fontSize: text.sm, color: palette.mid, marginTop: space.sm + 'px' },
  footer: { fontSize: text.xs, color: palette.soft, marginTop: space.xl + 'px', lineHeight: leading.normal },
});

// Container mit Kopf (Icon + Titel + Intro) und beliebigen Schritt-Kindern.
// Farbe des Lebensbereichs für den offenen Ablauf (Entscheid Stebler Studios 27.09.2026):
// Balken oben und Zeichen im Kopf. Welcher Ablauf offen ist, sagt die Adresse — so muss
// keiner der 33 Abläufe etwas mitgeben; die Zuordnung steht im Register (ABLAEUFE.bereich).
const ablaufFarbe = (palette) => {
  // Ohne Browser (Server-Render in den Tests) gibt es keine Adresse — dann keine Farbe.
  let ansicht = null;
  try { ansicht = typeof window !== 'undefined' ? parseHash() : null; } catch { ansicht = null; }
  const key = ansicht && ablaufBereich(ansicht.view);
  if (!key) return null;
  const dunkel = kontrast(palette.bg, '#FFFFFF') > kontrast(palette.bg, '#000000');
  const farbe = bereichColor(key, dunkel);
  // Das Zeichen ist Grafik: 3:1 (WCAG 1.4.11) genügt.
  return farbe ? { balken: farbe, zeichen: lesbareFarbe(farbe, palette.surface || palette.bg, dunkel, 3) } : null;
};

// Schriftfarbe des Bereichs für kleinen Text («Schritt 2 von 4»): 4.5:1 statt 3:1 wie beim Zeichen.
export const ablaufTextFarbe = (palette) => {
  let ansicht = null;
  try { ansicht = typeof window !== 'undefined' ? parseHash() : null; } catch { ansicht = null; }
  const key = ansicht && ablaufBereich(ansicht.view);
  if (!key) return null;
  const dunkel = kontrast(palette.bg, '#FFFFFF') > kontrast(palette.bg, '#000000');
  const farbe = bereichColor(key, dunkel);
  return farbe ? lesbareFarbe(farbe, palette.bg, dunkel, 4.5) : null;
};

// Kopf wie im Mockup Fassung 5 (Entscheid Stebler Studios 23.10.2026, erster Nutzer: Umzug):
// Landschaftsband oben (Malojapass, halb durchsichtig, getönt in der Bereichsfarbe, läuft in den
// Grund aus), darauf die Brotkrume «Übersicht › Bereich › Ablauf» als Pille, darunter das
// Zeichen in einer Kachel neben dem Titel. Ersetzt Balken oben und «← Übersicht» (main.jsx
// lässt es für 'umzug' weg). Das Band hebt den Rand von <main> selbst auf (24 px oben, 20 px seitlich),
// damit main.jsx nichts dazulernen muss. `kopf`: { t, onNavigate, bereichTitel, zumBereich }.
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

export const AblaufContainer = ({ palette, icon, title, intro, kopf, children }) => {
  const s = styles(palette);
  const farbe = ablaufFarbe(palette);
  if (kopf) {
    return React.createElement('div', null,
      React.createElement(MockKopf, { palette, farbe, icon, title, kopf }),
      React.createElement('div', { style: s.wrap },
        intro ? React.createElement('p', { style: s.intro }, React.createElement(GlossarText, { palette }, intro)) : null,
        children)
    );
  }
  return React.createElement('div', { style: farbe ? { ...s.wrap, borderTop: '4px solid ' + farbe.balken, paddingTop: space.md + 'px' } : s.wrap },
    // Kein Rückfall-Zeichen mehr (bis 27.09.2026 'insurance'): ein Ablauf ohne Zeichen zeigt
    // keines, statt still das der Versicherung. Wächter: zeichenEineQuelle.test.js.
    React.createElement(PageTitle, { palette, icon: icon ? React.createElement('span', { style: { display: 'inline-flex', color: farbe ? farbe.zeichen : undefined } }, React.createElement(Icon, { name: icon, size: 22 })) : null, style: { marginBottom: space.sm + 'px' } }, title),
    intro ? React.createElement('p', { style: s.intro },
      React.createElement(GlossarText, { palette }, intro)) : null,
    children
  );
};

// Ein ruhiger Schritt: Titel + freier Inhalt.
// `titelStyle` (Fassung 5): der grössere Schritt-Titel im Schritt-für-Schritt.
export const AblaufStep = ({ palette, title, icon, titelStyle, children }) => {
  const stil = { margin: space.lg + 'px 0 ' + space.xs + 'px 0', ...titelStyle };
  return React.createElement(React.Fragment, null,
    icon
      ? React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: icon, size: 20 }), style: stil }, title)
      : React.createElement(PanelTitle, { palette, style: stil }, title),
    children
  );
};

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
// Der Frist-Knopf ist der Hauptknopf seines Schritts (PrimaryButton mit Kalender-Zeichen,
// Seitenrundgang 27.09.2026 — vorher ein nachgebauter Sand-Knopf). Zwei Fristen im selben
// Ablauf (Dienst, Wegzug, Zuzug, EL, Stelle verloren) gehören zu zwei Ereignissen und
// erscheinen erst mit dem eigenen Datum — darum bleiben beide Hauptknöpfe.
// Im Beispiel und beim Ausprobieren (`vorlaeufig`) schreibt der Knopf nichts (erinnerungSichern)
// und läuft auch kein onSaved. Wie GespeichertZeile sagt er dann «nur für jetzt».
// Rückgabe: 'gespeichert' | 'vorlaeufig' | null (Speichern gescheitert).
export const fristSichern = (reminder, { vorlaeufig, onSaved } = {}) => {
  const ergebnis = erinnerungSichern(reminder, vorlaeufig);
  if (ergebnis === 'gespeichert') fristDemAblaufZuordnen(reminder); // Band im Kalender endet an dieser Frist
  if (ergebnis === 'gespeichert' && onSaved) onSaved(); // nur nach echtem Speichern
  return ergebnis;
};

// `kompakt` (Fassung 5, Frist-Karte im Umzug): ruhiger Rahmen-Knopf statt Hauptknopf, weil
// er in einer Karte neben Titel und Datum steht und der Schritt schon einen Hauptknopf hat.
export const FristButton = ({ palette, t, buttonLabel, doneLabel, calendarLabel, reminder, onNavigate, onSaved, kompakt = false }) => {
  const s = styles(palette);
  const vorlaeufig = useVorlaeufig();
  const [done, setDone] = useState(null);
  const handle = () => setDone(fristSichern(reminder, { vorlaeufig, onSaved }));
  if (done === 'vorlaeufig') {
    return React.createElement('div', { role: 'status', style: s.done }, hinweisZeichen('check'), t('common.savedTemporary'));
  }
  if (done) {
    return React.createElement('div', null,
      React.createElement('div', { style: s.done }, hinweisZeichen('check'), doneLabel),
      onNavigate && calendarLabel
        ? React.createElement('button', { className: 'mp-link', style: s.link, onClick: () => onNavigate('calendar') }, calendarLabel)
        : null
    );
  }
  const zeichen = React.createElement(Icon, { name: 'calendar', size: 16 });
  if (kompakt) {
    return React.createElement('button', {
      type: 'button', onClick: handle,
      style: {
        display: 'inline-flex', alignItems: 'center', gap: space.xs + 'px', minHeight: '44px', boxSizing: 'border-box',
        padding: '0 ' + space.md + 'px', background: 'none', border: '1.5px solid ' + palette.sand, borderRadius: radius.sm,
        color: palette.sandDeep, fontSize: text.sm, fontWeight: weight.semi, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0,
      },
    }, zeichen, buttonLabel);
  }
  const basis = { minHeight: '44px', boxSizing: 'border-box', marginTop: space.sm + 'px', textAlign: 'left' };
  return React.createElement(PrimaryButton, { palette, onClick: handle, icon: zeichen, style: basis }, buttonLabel);
};

// Frist ab einem Ereignis, das die Person selbst angibt (Zustellung, Geburt,
// Vertragsende …). Ohne Datum: KEIN Termin. Ist die Frist schon vorbei: kein neuer
// Termin, sondern der ruhige Satz «vorbei — bei der Stelle nachfragen». Die
// Rechnung selbst (`frist`) kommt aus utils/fristen.js — nie später als das Gesetz.
// `wert`/`onWert` optional: wer das Datum auch anderswo braucht, hält es selbst.
export const EreignisFrist = ({ palette, t, id, labelKey, hinweisKey, vorbeiKey, buttonKey, doneKey, calendarKey,
  reminderTitle, reminderNotes, category = 'admin', frist, wert, onWert, onNavigate, ohneFeld = false, karte = null, ablauf = '' }) => {
  const s = styles(palette);
  const [eigen, setEigen] = useState(wert || '');
  const datum = onWert ? (wert || '') : eigen;
  const setze = onWert || setEigen;
  const ziel = frist(datum);
  const vorbei = istVorbei(ziel);
  const reminder = { title: reminderTitle, dueDate: ziel, category, recurrence: 'once', ...(reminderNotes ? { notes: reminderNotes } : {}), ...(ablauf ? { ablauf } : {}) };
  // `karte` (Fassung 5, bisher nur der Umzug): die Frist als Karte mit Datum —
  // «{titel} · bis {Datum}» und daneben ein ruhiger Knopf «In den Kalender». Danach wie
  // bisher «Im Kalender notiert.» + «Zum Kalender». Vorbei: dieselbe Karte, mit dem
  // ruhigen Satz statt Knopf. Form: { titelKey, bisKey, knopfKey }.
  const fristKarte = karte && ziel ? React.createElement('div', {
    'data-frist-karte': vorbei ? 'vorbei' : 'offen',
    style: {
      marginTop: space.sm + 'px', padding: space.sm + 'px ' + space.md + 'px', borderRadius: radius.sm,
      border: '1px solid ' + (vorbei ? palette.gold || palette.border : palette.border),
      background: palette.up, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px',
    },
  },
    vorbei
      ? React.createElement('p', { style: { ...s.stepText, color: palette.text, margin: 0 } }, t(vorbeiKey, { date: formatDE(ziel) }))
      : React.createElement(React.Fragment, null,
        React.createElement('div', { style: { minWidth: 0 } },
          React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t(karte.titelKey)),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t(karte.bisKey, { date: formatDE(ziel) }))),
        React.createElement(FristButton, {
          key: ziel, palette, t, onNavigate, kompakt: true, reminder,
          buttonLabel: t(karte.knopfKey),
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
    fristKarte,
    !karte && ziel && React.createElement('p', { style: { ...s.stepText, marginTop: space.sm + 'px' } },
      t(vorbei ? vorbeiKey : hinweisKey, { date: formatDE(ziel) })),
    !karte && ziel && !vorbei && React.createElement(FristButton, {
      // Ein neues Datum ist ein neuer Termin — der Knopf beginnt wieder unbestätigt.
      key: ziel, palette, t, onNavigate,
      buttonLabel: t(buttonKey, { date: formatDE(ziel) }),
      doneLabel: t(doneKey),
      calendarLabel: calendarKey ? t(calendarKey) : null,
      reminder,
    })
  );
};

// Passstrasse (Fassung 5, Entscheid Stebler Studios 23.10.2026, erster Nutzer: Umzug): die Schritte
// als Stationen auf einer Strasse in Kehren; der gefahrene Teil in der Farbe des Bereichs,
// erledigte Stationen mit Haken, die aktuelle etwas grösser. Reine Grafik (aria-hidden) —
// wo man steht, sagt die Zeile «Schritt n von N» darüber im Text.
// Die Strasse hat genau vier Stationen: Anfang, die zwei Kehren-Enden, Ziel (Anteile am
// Weg gemessen, 0 · 0.32 · 0.64 · 1). Für andere Schrittzahlen ist sie nicht gebaut.
const PASS_PFAD = 'M24 132 C 120 132, 150 104, 96 88 S 70 46, 170 52 S 300 40, 316 18';
const PASS_STATIONEN = [{ x: 24, y: 132, anteil: 0 }, { x: 96, y: 88, anteil: 0.321 }, { x: 170, y: 52, anteil: 0.644 }, { x: 316, y: 18, anteil: 1 }];
export const PASS_SCHRITTE = PASS_STATIONEN.length;

// `namen` (optional, vier kurze Wörter): die Stationen beschriftet wie im Mockup — unter dem
// Anfang, links der ersten Kehre, über der zweiten Kehre und links über dem Ziel.
const PASS_NAMEN_ORT = [{ x: 24, y: 154, anker: 'middle' }, { x: 80, y: 106, anker: 'end' }, { x: 170, y: 34, anker: 'middle' }, { x: 302, y: 4, anker: 'end' }];
export const AblaufPass = ({ palette, aktuell, fertig, namen }) => {
  const farbe = (ablaufFarbe(palette) || {}).zeichen || palette.sageDeep || palette.sage;
  const stand = fertig ? 1 : PASS_STATIONEN[Math.min(Math.max(aktuell, 0), PASS_SCHRITTE - 1)].anteil;
  return React.createElement('svg', {
    viewBox: namen ? '0 -10 340 172' : '0 0 340 150', 'aria-hidden': 'true', focusable: 'false', 'data-ablauf-pass': fertig ? 'fertig' : String(aktuell),
    style: { display: 'block', width: '100%', maxWidth: '340px', height: 'auto', margin: '0 0 ' + space.md + 'px' },
  },
    React.createElement('path', { d: PASS_PFAD, fill: 'none', stroke: palette.border, strokeWidth: 12, strokeLinecap: 'round' }),
    stand > 0 && React.createElement('path', { d: PASS_PFAD, fill: 'none', stroke: farbe, strokeWidth: 12, strokeLinecap: 'round', pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - stand }),
    React.createElement('path', { d: PASS_PFAD, fill: 'none', stroke: palette.bg, strokeWidth: 1.2, strokeDasharray: '5 6', opacity: 0.8 }),
    PASS_STATIONEN.map((p, i) => {
      const erledigt = fertig || i < aktuell;
      const jetzt = !fertig && i === aktuell;
      return React.createElement('g', { key: i },
        React.createElement('circle', { cx: p.x, cy: p.y, r: jetzt ? 11 : 9, fill: erledigt ? farbe : palette.bg, stroke: erledigt || jetzt ? farbe : palette.border, strokeWidth: 3 }),
        erledigt
          ? React.createElement('path', { d: `M${p.x - 4} ${p.y} l3 3 5-6`, stroke: palette.bg, strokeWidth: 2.2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
          : React.createElement('text', { x: p.x, y: p.y + 4, textAnchor: 'middle', style: { fontSize: '11px', fontWeight: 600, fill: jetzt ? farbe : palette.soft } }, String(i + 1)));
    }),
    namen && namen.map((n, i) => React.createElement('text', {
      key: 'n' + i, x: PASS_NAMEN_ORT[i].x, y: PASS_NAMEN_ORT[i].y, textAnchor: PASS_NAMEN_ORT[i].anker,
      style: { fontSize: '11px', fill: palette.mid, paintOrder: 'stroke', stroke: palette.bg, strokeWidth: '4px', strokeLinejoin: 'round' },
    }, n))
  );
};

// Fuss-Hinweise (Hinweis-Piktogramm je Zeile).
// `quelle`: die Zeile «Quellen: … · Stand …» (i18n-Text mit [[Wort|url]]-Markern,
// siehe utils/renderSource.js). Steht zuoberst im Fuss, weil sie für den ganzen
// Ablauf gilt. Seit 24.09.2026 trägt jeder Ablauf im Register eine (AsylView ohne
// diese Schale setzt sie selbst); vorher hatten zwei eine. Wache:
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
