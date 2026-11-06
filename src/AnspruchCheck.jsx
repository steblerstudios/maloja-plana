import React, { useState, useEffect } from 'react';
import { einnahmenErfasst } from './utils/unterstuetzungseinheit.js';
import { Schnellcheck } from './Schnellcheck.jsx';
import { LebenslagenAuswahl } from './Lebenssituationen.jsx';
import { PrimaryButton, knopfStil, linkStil, auswahlStil } from './components/PrimaryButton.jsx';
import { calculateIPV, calculateSozialhilfe, checkELEligibility } from './config/cantonalData.js';
import { LEBENSZUSTAENDE } from './data/lebenszustaende.js';
import { uebergabeAusProbe } from './data/schnellcheckUebergabe.js';
import { text, weight, leading, space, radius, duration, ease } from './config/tokens.js';
import { zurueckZeichen } from './IconSystem.jsx';
import { PanelTitle } from './components/Heading.jsx';

// Anspruch-Check, geführt (#4.4.2 „Brücke"): webt die zwei bestehenden Checks zu
// EINEM Fluss — Schritt 1 = Zahlen (Schnellcheck), Schritt 2 = Lebenslage
// (Lebenssituationen) — ohne Zurück-Navigieren. Beide Bausteine unverändert
// wiederverwendet; der Wrapper fügt nur einen ruhigen Schritt-Indikator und die
// Weiter/Zurück-Führung hinzu. Keim des späteren Wizards (#4.4.3).
// Seit 27.10.2026 (Entscheid O): eigener Ablauf, nur von «Was steht mir zu?» erreichbar
// («Lieber Schritt für Schritt?»); Schritt 2 ist dieselbe Auswahl wie dort (LebenslagenAuswahl),
// «Fertig» führt dorthin zurück.
export const AnspruchCheck = ({ palette, t, data, onNavigate }) => {
  const [step, setStep] = useState(1);
  // Die in Schritt 1 (Schnellcheck) frei angepassten Zahlen — anfangs das Profil,
  // dann laufend von Schnellcheck gemeldet. Schritt 3 rechnet damit, nicht mit dem
  // rohen Profil, damit „in Schritt 1 eintragen → erscheint hier" auch hält.
  const [probe, setProbe] = useState(data);

  // Bei Schrittwechsel sanft nach oben — der neue Schritt beginnt am Anfang.
  // Das Dokument scrollt, nicht mehr <main> (dessen overflow ist weg).
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const steps = [
    { n: 1, label: t('anspruchCheck.stepIncome') },
    { n: 2, label: t('anspruchCheck.stepSituation') },
    { n: 3, label: t('anspruchCheck.stepOverview') },
  ];

  // Schritt 3 — vereintes Ergebnis: einkommensbasierte Leistungen (aus den in
  // Schritt 1 angepassten Zahlen `probe`, dieselbe Engine wie der Schnellcheck,
  // mit denselben Ehrlichkeits-Gates) + die in Schritt 2 gewählten Lebenslagen.
  // Nur POSITIV, jede Zeile verlinkt ins bestehende Zuhause. Keine erfundenen
  // Beträge, kein Verdikt. Kanton bleibt profilgebunden (kein Feld in Schritt 1).
  const renderResult = () => {
    const incomeBenefits = [];
    try {
      const canton = probe?.basis?.canton || '';
      const erfasst = einnahmenErfasst(probe?.finanzen); // Lohn oder Rente, wie die Wege
      const rent = Number(probe?.wohnen?.rentAmount) || 0;
      // anspruchMoeglich: auch bei unbelegtem Kanton (E9) ein Weg — ohne Betrag.
      if (erfasst && canton && calculateIPV(probe)?.anspruchMoeglich) {
        // B-1/E22: die Zahlen aus Schritt 1 gehen an den IPV-Rechner mit (nicht ins Profil).
        incomeBenefits.push({ key: 'ipv', label: t('anspruch.items.ipv.label'), view: 'premium', uebergabe: uebergabeAusProbe(probe) });
      }
      // Wie bei der IPV: Schritt 1 macht aus einem leeren Feld eine 0 (F8-S4), darum Lohn oder Rente über 0.
      if (erfasst && rent > 0) {
        const sh = calculateSozialhilfe(probe);
        if (sh?.einkommenFehlt) {
          // Rente oder Einkommen nicht erfasst: der Weg mit dem Grund, wie in data/anspruchWege.js.
          if (sh.wegOhneBetrag) incomeBenefits.push({ key: 'soz', view: 'sozialhilfe',
            label: t('anspruch.items.sozialhilfe.label') + ' · ' + t(sh.renteFehlt ? 'sozialhilfe.renteNichtErfasst' : 'sozialhilfe.einkommenNichtErfasst') });
        } else if (sh?.eligible && (sh?.vermoegenUeberFreibetrag || 0) === 0) {
          // Ganze Miete eingerechnet (keine Mietzins-Limite bekannt) — der «Anspruch» sagt es.
          incomeBenefits.push({ key: 'soz', view: 'sozialhilfe',
            label: t('anspruch.items.sozialhilfe.label') + (sh.mitGanzerMiete ? ' (' + t('sozialhilfe.mitGanzerMiete') + ')' : '') + (sh.hinweise?.length ? ' · ' + t('pegel.rechnungOffen') : '') });
        }
      }
      // EL ohne Rechnung: ein Rentenbezug führt hin, ein «Möglicher Anspruch» wird nicht mehr errechnet (F8-Prüfer).
      if (checkELEligibility(probe)?.elPruefen) {
        incomeBenefits.push({ key: 'el', label: t('anspruch.items.el.label'), view: 'finanzuebersicht' });
      }
    } catch { /* Orientierung, nie blockierend */ }

    let selected = [];
    try { selected = JSON.parse(localStorage.getItem('or5_lebenszustaende') || '[]'); } catch { selected = []; }
    const chosen = LEBENSZUSTAENDE.filter((z) => selected.includes(z.key));

    const row = (key, label, onClick) => React.createElement('button', {
      key, type: 'button', onClick,
      style: {
        display: 'block', width: '100%', textAlign: 'left', boxSizing: 'border-box',
        padding: '12px 12px', marginBottom: space.xs + 'px',
        background: palette.surface, color: palette.text,
        border: '1px solid ' + palette.border + '44', borderRadius: radius.md,
        cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium,
        transition: `border-color ${duration.normal}ms ${ease}`,
      },
      onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sage + '55'; },
      onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border + '44'; },
    }, label);

    const emptyLine = (txt) => React.createElement('p', {
      style: { fontSize: text.xs, color: palette.soft, fontStyle: 'italic', lineHeight: leading.relaxed, margin: '0 0 ' + space.sm + 'px 0' }
    }, txt);

    const sectionHeader = (txt) => React.createElement('h3', {
      style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text, letterSpacing: '0.3px', margin: space.md + 'px 0 ' + space.sm + 'px 0' }
    }, txt);

    return React.createElement('div', null,
      React.createElement('h2', {
        style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.xs + 'px 0' }
      }, t('anspruchCheck.stepOverview')),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.sm + 'px 0', lineHeight: leading.relaxed }
      }, t('anspruchCheck.resultIntro')),

      sectionHeader(t('anspruchCheck.resultIncomeHeader')),
      incomeBenefits.length
        ? incomeBenefits.map((b) => row(b.key, b.label, () => (b.uebergabe ? onNavigate(b.view, undefined, b.uebergabe) : onNavigate(b.view))))
        : emptyLine(t('anspruchCheck.resultEmptyIncome')),

      sectionHeader(t('anspruchCheck.resultSituationHeader')),
      chosen.length
        ? chosen.map((z) => row(z.key, t('lebenszustaende.' + z.key + '.label'), () => onNavigate('situationen')))
        : emptyLine(t('anspruchCheck.resultEmptySituation')),

      React.createElement('button', {
        type: 'button', onClick: () => onNavigate('situationen'),
        style: { ...linkStil(palette), display: 'block', marginTop: space.md + 'px', fontSize: text.sm, fontWeight: weight.medium }
      }, t('anspruchCheck.resultToLandkarte'))
    );
  };

  const indicator = React.createElement('div', {
    style: { display: 'flex', gap: space.xs + 'px', marginBottom: space.lg + 'px', flexWrap: 'wrap' }
  },
    steps.map((s) => {
      const on = step === s.n;
      return React.createElement('button', {
        key: s.n,
        type: 'button',
        onClick: () => setStep(s.n),
        'aria-current': on ? 'step' : undefined,
        style: {
          ...auswahlStil(palette, on),
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px',
          fontSize: text.xs, fontWeight: on ? weight.semi : weight.normal,
          transition: `background ${duration.normal}ms ${ease}, border-color ${duration.normal}ms ${ease}`,
        },
      },
        React.createElement('span', {
          'aria-hidden': 'true',
          style: {
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '18px', height: '18px', borderRadius: '50%',
            background: on ? palette.onSand : palette.border + '55',
            color: on ? palette.sand : palette.mid, fontSize: '11px', fontWeight: weight.semi, flexShrink: 0,
          }
        }, String(s.n)),
        t('anspruchCheck.stepWord') + ' ' + s.n + ' · ' + s.label
      );
    })
  );

  // Sekundär-Aktion (Zurück): ruhiger Umriss-Button, kein Primär-Gewicht.
  // Zeichen und Text als zwei Argumente: bis 27.09.2026 wurde die Funktion mit drei
  // aufgerufen (Zeichen, Text, Handler) — der Text landete als onClick, der Knopf zeigte
  // nur den Pfeil und tat nichts.
  const secondaryBtn = (zeichen, label, onClick) => React.createElement('button', {
    type: 'button', onClick,
    style: knopfStil(palette, 'neben'),
  }, zeichen, label);

  return React.createElement('div', { style: { maxWidth: '640px' } },
    indicator,

    step === 1 && React.createElement(Schnellcheck, { palette, t, data, onNavigate, onProbeChange: setProbe }),
    step === 2 && React.createElement('div', null,
      React.createElement(PanelTitle, { palette, as: 'h2', style: { margin: '0 0 ' + space.xs + 'px 0' } }, t('anspruchCheck.stepSituation')),
      React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.lg + 'px 0', lineHeight: leading.relaxed } }, t('lebenszustaende.sectionIntro')),
      React.createElement(LebenslagenAuswahl, { palette, t, data, onNavigate })),
    step === 3 && renderResult(),

    React.createElement('div', {
      style: {
        display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap', alignItems: 'center',
        marginTop: space['2xl'] + 'px', paddingTop: space.lg + 'px', borderTop: '1px solid ' + palette.border + '33',
      }
    },
      step === 1 && React.createElement(PrimaryButton, { palette, onClick: () => setStep(2) }, t('anspruchCheck.weiter')),
      step === 2 && React.createElement(React.Fragment, null,
        secondaryBtn(zurueckZeichen(), t('anspruchCheck.zurueck'), () => setStep(1)),
        React.createElement(PrimaryButton, { palette, onClick: () => setStep(3) }, t('anspruchCheck.weiterOverview'))
      ),
      step === 3 && React.createElement(React.Fragment, null,
        secondaryBtn(zurueckZeichen(), t('anspruchCheck.zurueck'), () => setStep(2)),
        React.createElement(PrimaryButton, { palette, onClick: () => onNavigate('situationen') }, t('anspruchCheck.fertig'))
      )
    )
  );
};

export default AnspruchCheck;
