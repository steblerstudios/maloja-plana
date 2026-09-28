import React, { useState, useRef } from 'react';
import { GespeichertZeile } from './components/GespeichertZeile.jsx';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { qrZeichnen, vcardBauen, QR_MAX_BYTES_VCARD } from './utils/qrSicher.js';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { LabeledField } from './components/LabeledField.jsx';
import { getFullName } from './config/constants.js';
import { text, weight, radius , leading , space } from './config/tokens.js';
import { blutgruppeLabel } from './utils/blutgruppe.js';
import { ExternerLink, visuallyHiddenStyle } from './components/ExternerLink.jsx';
import { ORGAN_ENTSCHEIDE, organEntscheid, organOptionen, organListe } from './utils/organspende.js';

// Die Etiketten-Liste lebt in utils/organspende.js (Dossier und Export brauchen sie auch).
export { organOptionen };

// Baut die Nutzlast des Organspende-QR als vCard — rein, ohne DOM, damit sie prüfbar ist.
//
// Gemessen 22.09.2026: die normale Kamera zeigt weder Klartext noch JSON an — sie liest den
// Code und meldet «no usable data found». Beim Nachmessen kam ein zweiter Befund dazu: das
// frühere JSON hatte NIRGENDS im Code einen Leser. Der Ausweis war von beiden Seiten
// unlesbar — von der Kamera einer Retterin und von Maloja selbst.
//
// Zwei stille Fehler von damals sind hier mitbehoben: die Organe standen als rohe Schlüssel
// im Code ('heart', 'kidneys') statt als Wörter, und das Freitextfeld erschien als das Wort
// «other» statt mit seinem Inhalt.
// Ein Wort je Entscheid — dieselben Wörter wie im Kapitel Notfall, damit Seite, Dossier und
// Export nie zweierlei sagen. Leer heisst «noch nicht festgehalten», nie ein Standardwert.
export const organEntscheidText = (t, status) => ORGAN_ENTSCHEIDE.includes(status)
  ? t('chapters.notfall.fields.organDonor.options.' + status)
  : t('organ.nichtFestgehalten');

export function organSpendeVcard({ t, data = {}, status, organs = {} }) {
  const statusText = organEntscheidText(t, status);

  // Organe nur bei «nur bestimmte» — bei «alle» oder «Ablehnung» wäre eine Liste ein Widerspruch.
  // Wörter statt Schlüssel, Freitext mit Inhalt, unbekannte Schlüssel bleiben (organListe).
  const gewaehlt = status === 'partial' ? organListe(t, organs) : [];

  const blutgruppe = blutgruppeLabel(data.notfall?.bloodType, t);

  const zeilen = [t('organ.title') + ':', '  ' + t('organ.status') + ': ' + statusText];
  const vertrauensperson = status === 'delegated' ? String(data.notfall?.organVertrauensperson ?? '').trim() : '';
  if (vertrauensperson) zeilen.push('  ' + t('organ.vertrauenspersonKurz') + ': ' + vertrauensperson);
  if (gewaehlt.length) zeilen.push('  ' + t('organ.organsAndTissue') + ': ' + gewaehlt.join(', '));
  if (blutgruppe) zeilen.push('  ' + t('notfallSummary.bloodType') + ': ' + blutgruppe);
  // K123 (Entscheid Stebler Studios 24.09.2026): keine AHV-Nummer im Organspende-QR — er trägt
  // Gesundheitsangaben, wird gezeigt und fotografiert und ist nicht widerrufbar.

  return vcardBauen({
    name: getFullName(data.basis) || t('organ.title'),
    tel: data.basis?.phone || '',
    notiz: zeilen.join('\n'),
  });
}

export const OrganDonation = ({ palette, t, data, onSave, vorlaeufig }) => {
  // Eine Wahrheit: notfall.organDonor (seit 27.09.2026). Ohne gespeicherten Entscheid ist
  // nichts vorausgewählt — früher stand hier 'registered', eine Aussage, die niemand gemacht hat.
  const [status, setStatus] = useState(() => organEntscheid(data));
  const [organs, setOrgans] = useState(data.organDonation || {
    heart: false, lungs: false, liver: false, kidneys: false,
    pancreas: false, corneas: false, bone: false, tissue: false, other: ''
  });
  // Wer entscheidet, wenn der Entscheid übertragen ist — ohne Namen hilft «Vertrauensperson»
  // im Notfall niemandem (Fachprüfung 27.09.2026). Lebt im Kapitel Notfall neben dem Entscheid.
  const [vertrauensperson, setVertrauensperson] = useState(data.notfall?.organVertrauensperson || '');
  const [qrGenerated, setQRGenerated] = useState(false);
  const [qrFehler, setQrFehler] = useState(false);
  const [qrAnsage, setQrAnsage] = useState('');
  const qrRef = useRef(null);

  const organOptions = organOptionen(t);

  const handleOrganToggle = (organ) => {
    setOrgans(prev => ({ ...prev, [organ]: !prev[organ] }));
  };

  const handleGenerateQR = () => {
    const qrData = organSpendeVcard({ t, data: { ...data, notfall: { ...(data.notfall || {}), organVertrauensperson: vertrauensperson } }, status, organs });

    setQrAnsage(''); // leeren, damit ein erneutes Erzeugen wieder angesagt wird
    setTimeout(() => {
      const cont = qrRef.current;
      // K80: vorher warf ein Name mit Umlaut hier unabgefangen → leere Fläche.
      if (!cont) return;
      const ok = qrZeichnen(cont, qrData, { maxBytes: QR_MAX_BYTES_VCARD, width: 200, height: 200, beschriftung: t('organ.generateQr') });
      setQrFehler(!ok);
      if (ok) setQrAnsage(t('common.qrErstellt'));
    }, 100);

    setQRGenerated(true);
  };

  // «Gespeichert» gilt, solange der Stand dem gespeicherten gleicht — ändert man danach
  // etwas, verschwindet es wieder. Bis 24.09.2026 speicherte der Knopf ohne ein Wort.
  const [gespeichertAls, setGespeichertAls] = useState(null);
  const stand = JSON.stringify({ organDonor: status, organDonation: organs, vertrauensperson });
  const handleSave = () => {
    // Der Entscheid gehört ins Kapitel Notfall; main.jsx legt die Teile obenauf, darum hier
    // das ganze Kapitel mitgeben (nachgeladene Komponente — das Startbündel bleibt unberührt).
    const notfall = { ...(data.notfall || {}) };
    if (status) notfall.organDonor = status; else delete notfall.organDonor;
    // Der Name gilt nur zusammen mit «Vertrauensperson» — sonst stünde er ohne Bedeutung im Dossier.
    const name = vertrauensperson.trim();
    if (status === 'delegated' && name) notfall.organVertrauensperson = name; else delete notfall.organVertrauensperson;
    const vorV5 = data._organspendeVorV5;
    onSave({ notfall, organDonation: organs, ...(vorV5?.bitteBestaetigen && status ? { _organspendeVorV5: { ...vorV5, bitteBestaetigen: false } } : {}) });
    setGespeichertAls(stand);
  };

  // Zweitknopf neben dem einen PrimaryButton (Speichern) — Seitenrundgang 27.09.2026:
  // der QR-Knopf stand in Salbei gefüllt genauso laut darunter.
  const zweitKnopf = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '44px', boxSizing: 'border-box', padding: '10px 16px', background: 'transparent', color: palette.text, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit', fontWeight: weight.medium, fontSize: text.sm };

  const statusButtonStyle = {
    // color explizit: Buttons erben color nicht (UA-Reset auf schwarz) → sonst war
    // der inaktive „Nicht registriert"-Status im Dark Mode schwarz auf palette.up.
    padding: '10px 16px', border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit', fontWeight: weight.semi, fontSize: text.sm, color: palette.text
  };

  return React.createElement('div', { style: { maxWidth: '720px' } },
   React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },
    // Left: Settings
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'health', size: 22 }), style: { marginBottom: space.md } }, t('organ.title')),

      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('organ.status')),
      // Nach der Migration v5: eine frühere Angabe liess den Umfang offen (oder widersprach
      // sich) — die Person wählt neu, statt dass Maloja für sie «alle Organe» einsetzt.
      data._organspendeVorV5?.bitteBestaetigen && !status && React.createElement('p', { style: { fontSize: text.sm, color: palette.text, background: palette.up, padding: '10px 12px', borderRadius: radius.sm, margin: '0 0 12px', lineHeight: leading.normal } }, hinweisZeichen(), t(data._organspendeVorV5.grund === 'widerspruch' ? 'organ.bitteBestaetigenWiderspruch' : 'organ.bitteBestaetigen')),
      // Ein Knopf je Möglichkeit, die das BAG nennt; der gewählte trägt Farbe, Häkchen UND aria-pressed.
      // Alle gleich ruhig gefärbt — eine Ablehnung ist kein Fehler.
      React.createElement('div', { role: 'group', 'aria-label': t('organ.status'), style: { display: 'grid', gap: space.sm, marginBottom: '20px' } },
        ORGAN_ENTSCHEIDE.map(wert => React.createElement('button', {
          key: wert, type: 'button', 'aria-pressed': status === wert,
          onClick: () => setStatus(wert),
          style: { ...statusButtonStyle, textAlign: 'left', background: status === wert ? palette.sageBtn : palette.up, color: status === wert ? '#fff' : palette.text }
        }, status === wert ? hinweisZeichen('check') : null, organEntscheidText(t, wert)))
      ),

      status === 'partial' && React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('organ.organsAndTissue')),
      status === 'partial' && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: space.sm, marginBottom: space.md } },
        organOptions.map(org => React.createElement('label', { key: org.key, style: { display: 'flex', alignItems: 'center', gap: space.sm, padding: '10px', background: organs[org.key] ? palette.sage + '33' : palette.up, borderRadius: radius.sm, cursor: 'pointer', border: '1px solid ' + (organs[org.key] ? palette.sage : palette.border), fontSize: text.sm } },
          React.createElement('input', { type: 'checkbox', checked: organs[org.key], onChange: () => handleOrganToggle(org.key), style: { cursor: 'pointer' } }),
          org.label
        ))
      ),

      status === 'partial' && React.createElement(LabeledField, { palette, label: t('organ.otherOrgans'), style: { marginBottom: 0 } },
        React.createElement('input', {
          type: 'text', value: organs.other,
          onChange: (e) => setOrgans(prev => ({ ...prev, other: e.target.value })),
          style: { width: '100%', padding: space.sm, marginBottom: space.md, borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: text.sm }
        })),

      status === 'delegated' && React.createElement(LabeledField, { palette, label: t('organ.vertrauensperson'), style: { marginBottom: 0 } },
        React.createElement('input', {
          // 80 Zeichen: der Organspende-QR bricht über 640 Byte ab, statt zu kürzen.
          type: 'text', value: vertrauensperson, autoComplete: 'off', maxLength: 80,
          onChange: (e) => setVertrauensperson(e.target.value),
          style: { width: '100%', padding: space.sm, marginBottom: space.xs, borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: text.sm }
        })),

      // Daten einer Drittperson in einem Ausweis, der gezeigt und fotografiert wird: vorher absprechen.
      status === 'delegated' && React.createElement('p', { style: { fontSize: text.xs, color: palette.mid, margin: '0 0 12px', lineHeight: leading.normal } }, t('organ.vertrauenspersonHinweis')),
      // «Nur bestimmte» ohne ein einziges Organ sagt niemandem, welche gemeint sind.
      status === 'partial' && organListe(t, organs).length === 0 && React.createElement('p', { style: { fontSize: text.sm, color: palette.text, background: palette.up, padding: '10px 12px', borderRadius: radius.sm, margin: '0 0 12px', lineHeight: leading.normal } }, hinweisZeichen(), t('organ.keineOrganeGewaehlt')),

      React.createElement(PrimaryButton, { palette, onClick: handleSave, style: { width: '100%', marginBottom: '12px' } }, hinweisZeichen('kaestchen'), t('organ.save')),
      React.createElement(GespeichertZeile, { palette, t, sichtbar: gespeichertAls === stand, vorlaeufig, style: { margin: gespeichertAls === stand ? '0 0 12px' : 0 } }),
      React.createElement('button', { type: 'button', onClick: handleGenerateQR, style: { ...zweitKnopf, width: '100%' } }, hinweisZeichen(), t('organ.generateQr')),
      // a11y (Deploy-Gate 0.1.37): höfliche Ansage «QR-Code erstellt» — ohne den Inhalt vorzulesen.
      // Eigene, immer vorhandene Region; der Hinweis über dem QR bleibt ohne Live-Region (0.1.36).
      React.createElement('div', { role: 'status', 'aria-live': 'polite', style: visuallyHiddenStyle }, qrAnsage)
    ),

    // Right: Info & QR
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: 'info', size: 22 }), style: { marginBottom: space.md } }, t('organ.info')),

      React.createElement('div', { style: { background: palette.up, padding: '12px', borderRadius: radius.sm, marginBottom: space.md, fontSize: text.sm } },
        React.createElement('strong', null, t('organ.status') + ': '),
        organEntscheidText(t, status)
      ),

      qrGenerated && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, textAlign: 'center', marginBottom: space.md } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '4px' } }, t('organ.generateQr')),
        // K101: derselbe ehrliche Hinweis wie am Notfall-QR (nicht verschlüsselt, für alle lesbar).
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }
        }, t('notfallDossier.qrHint')),
        React.createElement('div', { ref: qrRef, style: { display: qrFehler ? 'none' : 'flex', justifyContent: 'center', marginBottom: space.sm, minHeight: '220px' } }),
        qrFehler && React.createElement('p', { role: 'status', style: { fontSize: text.sm, color: palette.mid, margin: 0 } }, t('common.qrFehler'))
      ),

      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' } },
        // Rechtsstand mit Datum — laut Fedlex/BAG gilt am 27.09.2026 die Zustimmungsregelung.
        React.createElement('p', { style: { margin: '0 0 8px' } }, t('organ.rechtsstand')),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement(ExternerLink, { t, href: t('organ.bagUrl'), style: { color: palette.sandDeep, textDecoration: 'none', fontWeight: weight.semi } }, t('organ.bagQuelle'))
        ),
        React.createElement('p', { style: { margin: '0 0 12px' } }, t('organ.wirkung')),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('strong', { style: { color: palette.text } }, t('organ.swissOrganDonation')),
          React.createElement('div', { style: { marginTop: '6px' } },
            React.createElement(ExternerLink, { t, href: 'https://www.swisstransplant.org/de/organ-gewebespende/organspender-werden/organspende-karte-bestellen', style: { color: palette.sandDeep, textDecoration: 'none', fontWeight: weight.semi } }, 'swisstransplant.org')
          )
        )
      )
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, hinweisZeichen(), t('organ.speicherort'))
  ));
};

export default OrganDonation;
