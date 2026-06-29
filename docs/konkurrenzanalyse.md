# Konkurrenzanalyse — Maloja Plana

Stand: Juni 2026

## Positionierung

Maloja Plana ist ein **privacy-first, offline-fähiges Lebens-Organisationswerkzeug** speziell für Menschen in der Schweiz. Es gibt kein direkt vergleichbares Produkt, das alle drei Kernpfeiler vereint: (1) Schweiz-spezifisch, (2) 100% offline/lokal, (3) kostenlos & Open Source.

---

## Direkte Konkurrenz (Schweiz-spezifische Tools)

### ch.ch / EasyGov
- **Was:** Offizielle Portale des Bundes für Behördeninfos und Unternehmensgründung
- **Stärke:** Authoritative Quelle, aktuell, vollständig
- **Schwäche:** Kein persönliches Tool, keine Datenerfassung, keine Offline-Nutzung
- **Abgrenzung:** Maloja Plana ist *persönlich* — es geht um deine Situation, nicht um allgemeine Infos

### Comparis / moneyland.ch
- **Was:** Vergleichsportale (KK, Steuern, Hypotheken, Banken)
- **Stärke:** Umfassende Vergleichsdaten, grosse Nutzerbasis
- **Schwäche:** Werbefinanziert, Daten auf Servern, Tracking, kein Offline-Modus, Provisionsmodell
- **Abgrenzung:** Maloja Plana hat null Tracking, null Werbung, null Datenabfluss. Comparis verkauft Leads — Maloja Plana verkauft nichts.

### FinanzFuchs / Budget-Apps (CH)
- **Was:** Budgetierung, Ausgaben-Tracking
- **Stärke:** Detaillierte Kategorisierung, teils Bank-Anbindung
- **Schwäche:** Cloud-basiert, Abo-Modelle, oft nicht CH-spezifisch
- **Abgrenzung:** Maloja Plana kombiniert Budget mit Sozialversicherungen, Steuern, KVG — ein Gesamtbild, kein reines Budget-Tool

### Sozialberatung.ch / SKOS-Rechner
- **Was:** Online-Rechner für Sozialhilfe-Orientierung
- **Stärke:** SKOS-konform, kantonal differenziert
- **Schwäche:** Einzelrechner, keine Gesamtsicht, keine Offline-Funktion
- **Abgrenzung:** Maloja Plana integriert Sozialhilfe-Orientierung als *einen* Baustein in die Gesamtfinanzübersicht

---

## Indirekte Konkurrenz (Allgemeine Lebens-Organizer)

### Notion / Obsidian / Craft
- **Was:** Allgemeine Notiz-/Wissens-Apps
- **Stärke:** Flexibel, grosse Community, Plugins
- **Schwäche:** Nicht CH-spezifisch, erfordern Selbst-Setup, Notion ist Cloud-only
- **Abgrenzung:** Maloja Plana ist *vorkonfiguriert* für die Schweiz — Kapitel, Rechner, Behördenlinks sind eingebaut

### Google Sheets / Excel-Vorlagen
- **Was:** Selbstgebaute Budget- und Steuerplaner
- **Stärke:** Flexibel, kostenlos, bekannt
- **Schwäche:** Kein Schweiz-Kontext, erfordern Eigenwissen, Cloud (Google) oder Desktop-only (Excel)
- **Abgrenzung:** Maloja Plana erklärt und rechnet — es braucht kein Vorwissen über SKOS, KVG oder Tarmed

### YNAB / Mint / Budget-Apps (international)
- **Was:** Internationale Budgetierungs-Apps
- **Stärke:** Poliert, grosse Teams, Bank-Sync
- **Schwäche:** Nicht CH-angepasst (keine AHV, KVG, SKOS, Taxpunktwerte), Abo-Preise ($100+/Jahr), Cloud-only
- **Abgrenzung:** Maloja Plana ist *kostenlos*, *offline*, *Schweiz-nativ*

---

## Keine direkte Konkurrenz

Folgende Kombination bietet kein anderes Produkt:

| Eigenschaft | Comparis | ch.ch | Notion | YNAB | **Maloja Plana** |
|---|---|---|---|---|---|
| Schweiz-spezifisch | ✓ | ✓ | ✗ | ✗ | **✓** |
| 100% offline | ✗ | ✗ | ✗ | ✗ | **✓** |
| Kein Tracking | ✗ | ✗ | ✗ | ✗ | **✓** |
| Open Source | ✗ | ✗ | ✗ | ✗ | **✓** |
| Kostenlos | ✗ | ✓ | teilw. | ✗ | **✓** |
| Persönliches Tool | ✗ | ✗ | ✓ | ✓ | **✓** |
| KVG/Steuern/SKOS integriert | teilw. | Info | ✗ | ✗ | **✓** |
| 5 Landessprachen | ✗ | ✓ | ✗ | ✗ | **✓** |
| Behörden-Dossier/Export | ✗ | ✗ | ✗ | ✗ | **✓** |

---

## Risiken & Chancen

### Risiken
- **Bekanntheit:** Kein Marketing-Budget, organisches Wachstum nötig
- **Wartung:** Open Source braucht Community oder kontinuierliche Einzelpflege
- **Datenaktualität:** KVG-Tarife, Steuerdaten, SKOS-Richtlinien ändern sich jährlich
- **Browser-Limitierungen:** localStorage hat Speicherlimits (~5–10 MB)

### Chancen
- **Nische:** Kein Konkurrent in der Kombination offline + CH-spezifisch + kostenlos
- **Vertrauen:** Privacy-first-Ansatz als Differenzierungsmerkmal
- **Behörden-Kooperation:** Potenzial für Empfehlung durch Sozialberatungsstellen
- **Bildung:** Erklärt das CH-System (KVG, AHV, SKOS) — nützlich für Zugewanderte und junge Erwachsene

---

## App-Teardowns (UX-Lernen)

Detaillierte UX-Analysen einzelner Apps. Format: **positiv / Lernen / negativ.**
Die übertragbaren Lehren fliessen ins [UX-Playbook](UX_PLAYBOOK.md). Wächst mit
jeder weiteren analysierten App.

### Budgetberatung Schweiz
- **Positiv:** sehr klar, sehr wenig Ablenkung, Schritt für Schritt, ein Ziel pro Seite.
- **Lernen:** Progressive Disclosure · nur relevante Informationen zeigen · ein Problem gleichzeitig lösen.
- **Negativ:** Budget endet beim Budget — keine Verbindung zu Steuern, Sozialhilfe, Versicherungen, Wohnen, Familie.

### BlueBudget
- **Positiv:** sehr gutes Dashboard, alles wirkt ruhig, nicht verspielt, klare Typografie.
- **Lernen:** Dashboard zuerst, Details später.
- **Negativ:** alles dreht sich um Geld; keine Lebensereignisse.

### Coople (Job-Plattform)
- **Navigation** (Home / Jobs / Planung / Einsätze / Profil): in unter 10 Sekunden verständlich. → *Lernen: Navigation muss sofort verständlich sein.*
- **Home:** zeigt passende Jobs + Bewerbungen, mehr nicht — reicht, wirkt aber etwas leer. → *Lernen: Dashboard darf fokussiert sein, soll aber „Wie geht es MIR?" zeigen, nicht Werbung.*
- **Jobkarten:** Stundenlohn, Firma, Ort, Distanz, Datum — mehr braucht es nicht. → *Lernen: geringe Informationsdichte, Entscheidungen ermöglichen statt Texte schreiben.*
- **Bewerbung** als Zustand (Beworben → Angestellt → Abgeschlossen) statt „Bewerbungsverwaltung". → *Lernen: Menschen denken in Zuständen, nicht in Datenbanken.*
- **Einsatzplanung:** kein Universal-Kalender, nur „Wann arbeite ich?". → *Lernen: nur den Teil lösen, den der Nutzer braucht.*
- **Profil:** alles an einem Ort, sauber strukturiert, überall editierbar — aber extrem lang, man scrollt/sucht. → *Lernen: ein Profil ist eine Datenbank, keine Startseite.*
- **Grösstes Learning:** Coople denkt „ich verwalte deine Jobs", nicht „ich verwalte dein Leben". Maloja denkt vom **Lebensereignis** her (neuer Job → Vertrag, Budget, Pensionskasse, Krankentaggeld, Unfallversicherung, Steuerprognose, Ferienanspruch, Dokumente, Probezeit-Frist).

### Übergreifendes Muster
Fast alle analysierten Apps sind **horizontal** (in Funktionen) aufgebaut und zeigen
**Listen**. Maloja soll **vertikal** (in Lebensereignissen) denken und mit
**Fortschritt/Vollständigkeit** statt Listen arbeiten. Kern-Differenzierung: andere
Apps verwalten **Informationen**, Maloja verwaltet **Zusammenhänge**. (Ausführlich im
[UX-Playbook](UX_PLAYBOOK.md).)

---

## Fazit

Maloja Plana hat **keine direkte Konkurrenz** in seiner spezifischen Nische. Die grössten "Konkurrenten" sind Comparis (kommerziell, datensammelnd) und ch.ch (informativ, aber kein persönliches Tool). Die stärkste Differenzierung ist die Kombination aus Privatsphäre, Offline-Fähigkeit und Schweiz-Expertise in einem einzigen, kostenlosen Werkzeug.
