# Zielarchitektur & verlässlicher Betrieb (Zielbild 2026)

**Status: ZIELBILD — nicht Ist-Zustand.** Extrahiert und angepasst aus dem
maloja-c-Stand (Codex-Sitzungen, 18.07.2026, `Ideen Kiste/maloja c/`).
Heute ist Maloja eine Local-first-React-SPA ohne eigenes Backend (Governance-Level
L0–L1, siehe [governance/](../governance/)). Dieses Dokument beschreibt, **wohin**
die Infrastruktur wächst, wenn Cloud-Sync, Partner und Betrieb dazukommen —
damit wir heute keine Entscheide treffen, die diesen Weg verbauen.

Kein Vertrag, keine Rechtsberatung, keine technische Abnahme.

---

## 1. Die ehrliche Garantie

Niemand kann seriös garantieren, dass Software immer fehlerfrei läuft.
Maloja kann aber überprüfbar zusagen:

- Fehler möglichst zu verhindern;
- verbleibende Fehler schnell zu erkennen;
- ihre Wirkung sicher zu begrenzen;
- Nutzer und Partner verständlich zu informieren;
- Datenintegrität zu prüfen;
- den Betrieb nach getesteten Verfahren wiederherzustellen;
- Verantwortlichkeiten und Nachweise offenzulegen.

> Maloja garantiert keinen perfekten Betrieb, sondern einen kontrollierten,
> messbaren und transparenten Umgang mit Betrieb und Risiken.

Das passt zur bestehenden Trust-Haltung (kein Sicherheitstheater, keine
vorgetäuschte Perfektion).

## 2. Architekturprinzipien

1. **Local-first:** Persönliche Kernfunktionen bleiben ohne Cloud erreichbar. *(gilt heute schon)*
2. **Datensparsamkeit:** Nur Daten für einen konkreten Zweck erfassen. *(gilt heute schon)*
3. **Getrennte Datenzonen:** Lebensdaten, Partnerdaten, Analytics und Abrechnung technisch trennen.
4. **Zero Trust:** Jede Anfrage authentisieren, autorisieren und protokollieren.
5. **Least Privilege:** Minimale, zeitlich begrenzte Rechte.
6. **Fail safe:** Bei Unsicherheit keine riskante Aktion ausführen.
7. **Idempotenz:** Keine Doppelbuchung, Doppelmail oder Doppelbestätigung.
8. **Versionierung:** Regeln, Quellen, Einwilligungen und Übergaben sind nachvollziehbar.
9. **Portabilität:** Verständlicher Export und sauberer Exit. *(gilt heute schon)*
10. **Reversible Releases:** Feature Flags, Canary Releases und Rollback.

## 3. Startform: modularer Monolith

Wenn ein Backend entsteht, dann **nicht** als Microservice-Landschaft:

- eine kontrollierbare Deployment-Einheit;
- klare fachliche Module mit getrennten Datenzugriffsschichten;
- transaktionale Konsistenz, wenig Betriebsaufwand;
- Auslagerung einzelner Module erst bei realem Skalierungs- oder
  Isolationserfordernis.

Früh getrennte Worker nur für: Integrationsadapter, E-Mail/Benachrichtigung,
Datei-/Malware-Verarbeitung, Analytics.

Fachliche Module (Zielbild, als Modulgrenzen im Monolith): Journey ·
Rules & Evidence · Consent · Document · Partner Directory · Demand ·
Handover · Notification · Metering & Entitlements · Billing (ohne
Lebensinhalte) · Index · Verification · Audit (unveränderbar).

## 4. Datenarchitektur (Zielbild)

- relationale Hauptdatenbank mit Point-in-Time-Recovery;
- getrennte Schemas/DBs für persönliche, institutionelle, Abrechnungs- und Auditdaten;
- verschlüsselte Objektablage mit Versionierung und Malware-Scan;
- Queue/Event-Bus + Transactional Outbox gegen verlorene Ereignisse;
- Analytics nur mit minimierten, pseudonymisierten Ereignissen;
- keine Produktionsdaten in Entwicklung oder Demo;
- Aufbewahrungs- und Löschregeln pro Datenklasse;
- Verschlüsselung in Übertragung und Speicherung, Schlüssel getrennt von Daten.

## 5. Local-first + freiwillige Cloud

- lokale verschlüsselte Datenbank auf dem Gerät → **das ist Tresor-Lock**,
  siehe [design/tresor-lock.md](../design/tresor-lock.md) (Level 1) und
  ADR-011 (Level 2);
- Cloud-Synchronisation freiwillig, E2E-verschlüsselt soweit fachlich möglich;
- Konfliktregeln pro Datentyp statt pauschal «letzter Schreibvorgang gewinnt»;
- getestete Abläufe für Geräteverlust, Widerruf, Schlüsselrotation, Recovery;
- Sicherheits-/Komfort-Trade-off wird der Person verständlich erklärt.

## 6. Datei-Uploads: Quarantäne-Pipeline (sobald Uploads serverseitig existieren)

```text
Upload → Grössen-/Typprüfung (Signatur, nicht Endung) → Quarantäne
      → Malware-Scan → sichere Neuverarbeitung (Bild dekodieren/neu speichern,
        Metadaten entfernen) → erst danach freigeben
```

- Dateistatus: `pending_scan` · `clean` · `rejected` · `scan_failed` · `quarantined`.
  **`scan_failed` wird nie wie `clean` behandelt** — Scanner-Ausfall heisst gesperrt
  bleiben und später erneut prüfen.
- Interne Zufallsnamen statt Nutzer-Dateinamen; nie Nutzereingaben als Serverpfad.
- Archive (ZIP): Limits für Verschachtelung, Dateizahl, Entpackgrösse, Zeit;
  passwortgeschützte Archive ablehnen, wenn nicht prüfbar (ZIP-Bombs, `../`-Pfade).
- Auslieferung: separater Datei-Speicher, korrekter Content-Type,
  `Content-Disposition: attachment`, kurzlebige autorisierte Links.
- Ein Scan-Ergebnis bedeutet «keine bekannte Bedrohung erkannt», nie «garantiert
  ungefährlich» — darum Kombination aus Scan, erlaubten Typen, Quarantäne,
  Neuverarbeitung, minimalen Rechten und isolierter Speicherung.

## 7. Messbare Betriebsziele (Hypothesen, keine SLA)

| Fähigkeit | interner Zielwert |
|---|---:|
| persönliche Cloud-Funktionen | 99,9 % / Monat |
| Partnerportal | 99,9 % / Monat |
| kritische Übergabeannahme | 99,95 % / Monat |
| öffentliche Website | 99,95 % / Monat |
| p95-Antwortzeit Kern-API | < 500 ms |
| kritische Alarmierung | < 5 min |
| erste P1-Statusmeldung | < 30 min |
| RTO | 4 h |
| RPO (Cloud) | 15 min |

Diese Werte werden erst als SLA verkauft, wenn sie über längere Zeit real
erreicht und organisatorisch abgesichert sind.

## 8. Releaseprozess (Zielbild — heutiger Kern existiert schon)

Heute: Tests + `/maloja-predeploy` (9-Prüfer-Batterie) + `deploy.sh` mit Gates
(SEO-Check, predeploy-ok-Marke). Zielbild ergänzt: Schema-/Contract-Tests,
Secret-/Dependency-/Container-Scans, SAST, IaC-Prüfung, Migrationstest +
Backup-Prüfpunkt, Stage-Abnahme, Canary/Blue-Green, Health-Check mit
Auto-Rollback. Regeln, Scoremethodik, Berechtigungen, Abrechnung und
Datenweitergabe brauchen eine **höhere Freigabe** als visuelle Änderungen.

## 9. Monitoring ohne Überwachung der Menschen

Verfügbarkeit, Latenz, Fehler, Kapazität messen; strukturierte Logs **ohne**
sensible Inhalte (nie: Dokumentinhalte, Gesundheitsdaten, Kontodaten,
Passwörter, Tokens, vollständige Nachrichten); synthetische E2E-Tests;
externe Statusseite; monatliche SLO-/Fehlerbudget-Auswertung.

## 10. Backup & Disaster Recovery

Verschlüsselte Backups in getrenntem Konto; unveränderbare Kopie gegen
Ransomware; Point-in-Time-Recovery; getrennte Schlüsselkontrolle;
**monatlicher Restore-Test** — ein Backup gilt erst als vertrauenswürdig,
wenn die Wiederherstellung erfolgreich getestet wurde.

## 11. Incident Response

P1 (Gefahr für Menschen, grosse Datenverletzung, Ausfall kritischer Übergaben)
bis P4 (kleine Abweichung). Ablauf: erkennen → einstufen → Incident Commander →
Wirkung begrenzen → Beweise sichern → informieren → wiederherstellen →
Datenintegrität abgleichen → Postmortem → Massnahmen nachprüfen.
Für Fristen und Ansprüche existiert ein **manueller Fallback**; eine nicht
übertragene Übergabe darf nie als erfolgreich erscheinen.

## 12. Standards & Verantwortlichkeiten

- NIST CSF 2.0 · ISO/IEC 27001:2022 (Zielbild) · OWASP ASVS 5.0 ·
  WCAG 2.2 AA + manuelle AT-Tests · CH-Datenschutzrecht inkl. DSFA ·
  unabhängiger Pentest vor sensibler öffentlicher Beta.
- Benannte Verantwortliche (auch wenn anfangs eine Person mehrere Rollen hält):
  Produkt · Fachinhalte je Lebenslage · Security · Datenschutz · Plattform/SRE ·
  Incident · Partnerintegration · Quellen/Content · Accessibility · Releases ·
  unabhängige Freigaben. Für Hochrisikoänderungen gilt Vier-Augen-Prinzip.

## 13. Umsetzung in vier Stufen

1. **Jetzt:** Datenklassifikation, Threat Model, Architekturentscheide,
   synthetische Daten, CI-Grundlagen — keine sensiblen Echtdaten.
2. **Vor kontrolliertem Pilot:** produktive Identität + MFA, Consent- und
   Audit-Service, Monitoring/Statusseite, erfolgreicher Restore-Test,
   Incident-/Supportprozess, DSFA-Vorprüfung, externer Review, manuelle Fallbacks.
3. **Vor öffentlicher Beta:** unabhängiger Pentest, volle WCAG-Prüfung mit
   Assistenztechnologien, Last-/Failover-Tests, SLOs + Bereitschaft,
   Vulnerability Disclosure, produktionsreife Löschung/Export/Rotation, Trust Center.
4. **Vor grossem institutionellem Betrieb:** SLAs aus realen Messwerten,
   reife SRE-Funktion, ISO-27001-Readiness, Red-Team-/Recovery-Übungen,
   Partnerzertifizierung, unabhängige Governance für Index und kritische Regeln.

## 14. Architekturentscheidung (eine Zeile)

> Local-first Clients + modularer Monolith + streng getrennte Datenzonen +
> asynchrone Integrationsworker + versionierte Regeln und Einwilligungen +
> unabhängiges Audit/Event-System + messbare SLOs + getestete Wiederherstellung.

Cloud-Anbieter, Sprache, Datenbank und Mobile-Technologie werden erst anhand
von Teamkompetenz, Budget, Datenschutz, CH-Datenstandort und Betriebsmodell
gewählt — nicht in diesem Dokument.
