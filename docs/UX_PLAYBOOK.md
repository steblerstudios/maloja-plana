# UX-Playbook — Maloja Plana

> Das „Grundgesetz" von Maloja Plana. Ein **lebendes** Dokument: Es wächst mit
> jeder analysierten App und jeder gebauten Funktion. Bei jeder grösseren
> Design- oder Entwicklungsentscheidung ist dies der erste Referenzpunkt.

Stand: 2026-06-29 · Pflege: bei jeder neuen App-Analyse (siehe [konkurrenzanalyse.md](konkurrenzanalyse.md)) und jedem neuen Ablauf ergänzen.

Dieses Playbook **bündelt und priorisiert**. Die Tiefe steht in den verlinkten
Dokumenten — hier steht, was übergeordnet gilt und warum.

---

## Die eine Erkenntnis aus allen App-Analysen

Andere Apps **verwalten Informationen**. Maloja **verwaltet Zusammenhänge.**

- Ein **neuer Job** beeinflusst Budget, Pensionskasse, Krankentaggeld, Unfallversicherung, Steuerprognose, Ferienanspruch, Dokumente, Probezeit-Frist.
- Ein **Umzug** beeinflusst Adresse, Gemeinde, Hausratversicherung, Strom, Mietvertrag.
- Eine **Krankheit** beeinflusst Krankentaggeld, Arztkosten, Unfallversicherung, Arbeitgeber.

Diese Verbindungen zeigt heute kaum eine App zentral. **Genau dort liegt Malojas
Alleinstellungsmerkmal.** Alles Weitere in diesem Playbook dient diesem einen Satz.

---

## 1 · Produktphilosophie

Maloja ist **keine Fach-App.** Nicht Budget, nicht Krankenkasse, nicht Jobs, nicht
Steuern — sondern **die Infrastruktur fürs Leben**, in der das alles zusammenhängt.

- **Ruhe vor Engagement.** Das Ziel ist nicht Nutzungsdauer, sondern dass jemand
  sein Leben geordnet hat und beruhigt weggehen kann.
- **Orientierung vor Produktivitätsdruck.** Wir sagen, was sinnvoll ist — wir
  treiben nicht an, werten nicht, verlangen nichts.
- **Vertrauen vor Wachstum.** 100% lokal, kein Tracking, kein Datenabfluss.
- **Würde zuerst.** Die App begegnet Menschen in verletzlichen Situationen
  (Sozialhilfe, Krankheit, Schulden, Migration) — nie belehrend, nie beschämend.

Tiefer: [product/mission.md](product/mission.md) · [product/principles.md](product/principles.md) · [product/emotional-goals.md](product/emotional-goals.md)

---

## 2 · Designprinzipien

Aus **Budgetberatung Schweiz** (sehr klar, sehr wenig Ablenkung) und **BlueBudget**
(ruhig, nicht verspielt, klare Typografie):

- **Progressive Disclosure** — nur zeigen, was jetzt relevant ist.
- **Ein Ziel pro Seite.** Ein Problem gleichzeitig lösen.
- **Geringe Informationsdichte.** Entscheidungen ermöglichen statt Texte schreiben.
- **Ruhig statt verspielt.** Klare Typografie, viel Luft, keine Effekthascherei.

Grenze gegenüber den Vorbildern: Bei Budgetberatung **endet das Budget beim Budget** —
keine Brücke zu Steuern, Versicherungen, Wohnen, Familie. Maloja baut genau diese
Brücken (→ Kapitel 5).

Tiefer: [ux/calm-ux-principles.md](ux/calm-ux-principles.md) · [ux/accessibility-philosophy.md](ux/accessibility-philosophy.md) · [brand/brand-guidelines.md](brand/brand-guidelines.md)

---

## 3 · Navigation

Aus **Coople**: Navigation muss in **unter 10 Sekunden** verstanden sein. Und:
**Menschen denken in Zuständen, nicht in Datenbanken** (Coople-Bewerbungen:
„Beworben → Angestellt → Abgeschlossen" statt „Bewerbungsverwaltung").

- Wenige, selbsterklärende Einstiege. In Maloja: **Übersicht** (Dashboard) +
  **Lebensbereiche/Kapitel** + **Werkzeuge**.
- Von überall sauber zurück (globales „← Übersicht").
- Zustände statt Verwaltungs-Vokabular: „Frist gesichert", „im Lebensordner
  abgelegt", nicht „Datensatz angelegt".

Tiefer: [architecture/A-027-calm-navigation-review.md](architecture/A-027-calm-navigation-review.md) · [product/dashboard-flow-analyse.md](product/dashboard-flow-analyse.md)

---

## 4 · Dashboard

Aus **BlueBudget**: **Dashboard zuerst, Details später.** Aus **Coople**: ein
Dashboard darf fokussiert sein — aber es soll zeigen **„Wie geht es MIR?"**, nicht
Werbung, und es darf nicht **leer** wirken.

- Die Übersicht beantwortet: *Wo stehe ich? Was wäre jetzt sinnvoll? Was steht mir zu?*
- Fortschritt ruhig zeigen (der wachsende Baum, Berge) — **ohne** Prozent-Angst,
  ohne Streaks, ohne rote Mahn-Badges.
- Keine Funktions-Kachel-Wüste als Startseite; Werkzeuge sind gruppiert und
  zweitrangig hinter der Lebens-Orientierung.

Tiefer: [product/dashboard-flow-analyse.md](product/dashboard-flow-analyse.md) · [design/emotional-temperature-map.md](design/emotional-temperature-map.md)

---

## 5 · Lebensereignisse statt Funktionen

**Das Herzstück.** Fast alle Apps sind **horizontal** aufgebaut — sie denken in
Funktionen (Budget → Konten → Ausgaben → Diagramme). Maloja denkt **vertikal**:
nicht „Welche Funktion willst du?", sondern **„Was passiert gerade in deinem Leben?"**

🏠 Umzug · 💼 Neuer Job · 👶 Kind · ❤️ Krankheit · 👵 Pension — und **alles, was dazugehört**,
an einem Faden, statt über fünf Apps und sieben Webseiten verstreut.

**So bauen wir das:** die wiederverwendbare **Ablauf-Schale**
([`AblaufSchale.jsx`](../src/AblaufSchale.jsx)) — ruhige Primitiven (Container, Schritt,
Crosslink, Frist-in-Kalender, Fuss-Hinweise). Ein Ablauf verkettet vorhandene
Bausteine zu einem Weg, statt neue Insel-Tools zu bauen. Gebaut:

- **Krankenkasse wechseln** ([`KVGWechsel.jsx`](../src/KVGWechsel.jsx))
- **Zusatzversicherung kündigen** ([`ZusatzWechsel.jsx`](../src/ZusatzWechsel.jsx))
- **Umzug** ([`UmzugAblauf.jsx`](../src/UmzugAblauf.jsx))

Prinzipien für Abläufe: ruhige **Orientierung statt Rechner**; mehrere Wege ruhig
nebeneinander zeigen, keinen vorschreiben; Fristen automatisch in Kalender/Merkliste
speisen; am Ende den Kreis schliessen (z.B. Brief → scannen → im Lebensordner ablegen).

Tiefer: [ABLAEUFE.md](ABLAEUFE.md) · [product/life-areas.md](product/life-areas.md) · [product/household-dependencies.md](product/household-dependencies.md)

---

## 6 · Informationsarchitektur

Fast jede App zeigt **Listen** (Jobs, Verträge, Ausgaben, Dokumente). Listen helfen
kaum zu verstehen, **ob etwas erledigt ist**. Maloja arbeitet stärker mit
**Fortschritt und Vollständigkeit** — pro Lebensbereich sichtbar:

```
💼 Arbeit          🏠 Wohnen                     ❤️ Gesundheit
✅ Arbeitsvertrag   ✅ Mietvertrag                ✅ Krankenkasse
⚠ Arbeitszeugnis   ⚠ Übergabe-Protokoll fehlt    ⚠ Patientenverfügung fehlt
✅ Unfallvers.      ✅ Hausratversicherung        ⚠ Notfallkontakt fehlt
⚠ Probezeit 10 T.  ✅ Stromanbieter
```

Der Nutzer muss nicht überlegen, was fehlt — **die App zeigt es**. Wichtig (Kapitel 10):
Vollständigkeit ruhig markieren, **nie** als Prozent-Scham oder roten Mahnfinger.

Tiefer: [data-model/relationships.md](data-model/relationships.md) · [product/life-areas.md](product/life-areas.md)

---

## 7 · Formulare & Eingaben

- **Progressive Disclosure**, ein Problem gleichzeitig (siehe Kapitel 2).
- **Würde-zuerst:** keine Annahmen über Familienform, Geschlecht, Herkunft, Finanz-
  oder Rechtswissen. Bedingte/einklappbare Abschnitte statt erschlagender Formulare.
- **Daten nur einmal erfassen** und kontextübergreifend wiederverwenden (eine Adresse
  speist Umzug, Briefe, Dossiers).
- Fehlende Angaben **markieren, nicht anklagen**; grosse, gut lesbare Felder.

Tiefer: [architecture/field-governance-review.md](architecture/field-governance-review.md) · [data-model/field-trust-matrix.md](data-model/field-trust-matrix.md)

---

## 8 · Dokumentenverwaltung

Aus **Coople** (Profil): alles an einem Ort ist gut — aber ein **Profil ist eine
Datenbank, keine Startseite** (Coople-Profil: endloses Scrollen). Lehre: Dokumente
zentral sammeln, aber **kontextuell** dorthin führen, wo man sie gerade braucht.

- **Ein Ort** für Dokumente (Dokumenten-Tresor, [`DocumentTresor.jsx`](../src/DocumentTresor.jsx)),
  nach Lebensbereich gegliedert, lokal/verschlüsselt.
- **Kreis schliessen:** nach dem Erstellen eines Briefs ruhig zum Ablegen führen
  (Loop-Closure Brief → unterschreiben → scannen → im richtigen Register ablegen).
- Klare Rollen, keine Überlappung: Tresor (Speicher) · Unterlagen (Hub) ·
  Lebensmappe (Druck-Dossier).

Tiefer: [product/export-dossier-concept.md](product/export-dossier-concept.md) · [security/backup-strategy.md](security/backup-strategy.md)

---

## 9 · Benachrichtigungen

- **Ruhig und nützlich:** echte Fristen (Kündigung, Probezeit, Gemeinde-Anmeldung)
  in Kalender/Merkliste — als Orientierung, nicht als Druck.
- **Keine** „du warst X Tage nicht da", keine roten Zähler, keine Countdown-Panik,
  keine Schuld-Sprache bei verpassten Terminen.
- Bestätigungen ruhig und ehrlich („Im Kalender notiert."), nur wenn wirklich
  gespeichert wurde.

Tiefer: [product/anti-patterns.md](product/anti-patterns.md) · [ux/calm-ux-principles.md](ux/calm-ux-principles.md)

---

## 10 · Was wir bewusst NICHT bauen

Design-Grenzen, die **nie** überschritten werden (vollständig in
[product/anti-patterns.md](product/anti-patterns.md)):

- **Keine Engagement-Mechanik:** keine Streaks, Login-Belohnungen, Badges,
  Gamification, Prozent-Angst, „du hast X verpasst"-Nachrichten.
- **Keine Scham-Mechanik:** kein „du hast dein Budget verfehlt", kein Vergleich mit
  „Durchschnitts-Nutzern", keine anklagenden Leerzustände.
- **Keine Daten-Ausbeutung:** kein Tracking, keine Telemetrie, keine Werbung, kein
  Profiling, kein Datenverkauf, keine stillen Datenabflüsse.
- **Keine Universal-Werkzeuge** (Coople-Lehre): keinen Universal-Kalender, keine
  „Bewerbungsverwaltung", kein Profil als Startseite. **Nur den Teil lösen, den der
  Nutzer wirklich braucht.**
- **Kein Finanzdruck:** keine aggressiven Sparziele, keine Anlageberatung, keine
  „du solltest X% sparen"-Urteile.

---

## Anhang · So wächst dieses Dokument

1. Neue App analysieren → Teardown nach **konkurrenzanalyse.md** (positiv / Lernen / negativ).
2. Übertragbare Lehre destillieren → ins passende Kapitel hier eintragen (mit Quelle der App).
3. Wenn eine Lehre zu einer gebauten Funktion wird → hier auf die echte Datei/den Ablauf verweisen.

Bisher eingeflossen: Budgetberatung Schweiz, BlueBudget, Coople (Juni 2026).
