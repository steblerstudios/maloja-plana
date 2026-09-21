# Die 113 Hinweis-Stellen, sortiert — 20.09.2026

| Gruppe | Anzahl | Was damit geschehen soll |
|---|---:|---|
| **A · Etikett / Status / Überschrift** | 29 | Zeichen gehört da NICHT hin — weg oder passendes Piktogramm |
| **B · Vertrauens- und Datenschutzzeile** | 18 | Schloss/Schild statt ⓘ (`TrustLockIcon` gibt es bereits) |
| **C · Haftungshinweis** | 10 | bleibt sichtbar — nie hinter ein Antippen |
| **D · Echte Erklärung** | 24 | → Kandidaten für `IPVⓘ` |
| **E · Führung** | 6 | bleibt sichtbar — es ist der nächste Schritt |
| **F · Text kommt aus Daten** | 26 | je Fall zu prüfen, Text steht nicht im i18n |

## A · Etikett / Status / Überschrift — 29

- `BudgetImport.jsx:70` · `budgetImport.importing`
  > Importieren...
- `BudgetSync.jsx:50` · `common.loading`
  > Laden...
- `CVGenerator.jsx:31` · `cv.phone`
  > Telefon
- `ChapterView.jsx:458` · `beistand.wegweiserTitle`
  > Wenn Sie einmal nicht mehr selbst entscheiden können
- `ChapterView.jsx:1944` · `alimentInfo.title`
  > Alimente / Unterhalt
- `ChapterView.jsx:2106` · `wohnen.umzugGemeinde`
  > Wohngemeinde: Anmeldung innert 14 Tagen
- `ChapterView.jsx:2107` · `wohnen.umzugKK`
  > Krankenkasse: Adressänderung melden
- `ChapterView.jsx:2108` · `wohnen.umzugPost`
  > Post: Nachsendeauftrag einrichten
- `KKScanner.jsx:131` · `kkScanner.scanning`
  > Scanning...
- `KKScanner.jsx:164` · `kkScanner.conflictTitle`
  > Abweichungen erkannt
- `KKScanner.jsx:213` · `kkScanner.qrBarcode`
  > QR, Barcode oder Kartenfoto
- `OrganDonation.jsx:88` · `organ.notRegistered`
  > Nicht registriert
- `OrganDonation.jsx:111` · `organ.generateQr`
  > QR-Code generieren
- `PraemienOrientierung.jsx:236` · `po.noInsurer`
  > Kein Versicherer hinterlegt
- `PraemienOrientierung.jsx:243` · `po.insurerNotFound`
  > «{name}» nicht erkannt
- `PremiumSubsidy.jsx:207` · `premium.permitTitle`
  > Anspruch & Aufenthaltsbewilligung
- `PremiumSubsidy.jsx:224` · `premium.permitTitle`
  > Anspruch & Aufenthaltsbewilligung
- `PremiumSubsidy.jsx:231` · `premium.canton`
  > Kanton: {name}
- `PremiumSubsidy.jsx:263` · `premium.weeklyResidence`
  > Wochenaufenthalt erkannt
- `PremiumSubsidy.jsx:299` · `premium.notEligible`
  > Nicht berechtigt
- `SozialhilfeView.jsx:65` · `premium.canton`
  > Kanton: {name}
- `SozialhilfeView.jsx:76` · `sozialhilfe.weeklyResidence`
  > Wochenaufenthalt
- `SozialhilfeView.jsx:103` · `sozialhilfe.entitled`
  > Unterstützung möglich
- `SozialhilfeView.jsx:106` · `sozialhilfe.notEntitled`
  > Einkommen reicht aus
- `SozialhilfeView.jsx:113` · `sozialhilfe.assetLimitTitle`
  > Vermögen über dem Freibetrag
- `SozialhilfeView.jsx:125` · `sozialhilfe.repaymentTitle`
  > Rückzahlung von Sozialhilfe
- `TaxCalculator.jsx:408` · `tax.federalTax`
  > Bundessteuer
- `TaxCalculator.jsx:409` · `tax.cantonalAndMunicipal`
  > Kantons- und Gemeindesteuer
- `TaxImport.jsx:74` · `taxImport.importing`
  > Datei wird gelesen…

## B · Vertrauens- und Datenschutzzeile — 18

- `BehoerdenDossier.jsx:193` · `behoerdenDossier.footerPrivacy`
  > Dieses Dokument wurde lokal erstellt. Keine Daten wurden übermittelt.
- `BudgetImport.jsx:117` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `CVGenerator.jsx:75` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `ChartsAdvanced.jsx:151` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `DocumentTresor.jsx:368` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `KKScanner.jsx:192` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `Lebensmappe.jsx:157` · `lebensmappe.footerPrivacy`
  > Dieses Dokument wurde lokal erstellt. Keine Daten wurden übermittelt.
- `MeineUnterlagen.jsx:165` · `unterlagen.note`
  > Alle Unterlagen bleiben auf Ihrem Gerät. Nichts wird hochgeladen.
- `MietzinsOrientierung.jsx:113` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `NotfallDossier.jsx:132` · `notfallDossier.privacyNote`
  > Dieses Dossier enthält persönliche Gesundheitsinformationen.
- `NotfallDossier.jsx:189` · `notfallDossier.footerPrivacy`
  > Dieses Dossier enthält persönliche Gesundheitsinformationen. Bitte sorgfältig aufbewahren.
- `NotificationSettings.jsx:148` · `notifications.privacyNote`
  > Benachrichtigungen werden lokal auf Ihrem Gerät verarbeitet. Es werden keine Daten an Server gesendet.
- `OrganDonation.jsx:146` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `PremiumSubsidy.jsx:418` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `SchuldenManager.jsx:328` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `SozialhilfeView.jsx:235` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `TaxCalculator.jsx:412` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.
- `TaxImport.jsx:114` · `trust.localOnly`
  > Ihre Daten bleiben auf diesem Gerät.

## C · Haftungshinweis — 10

- `CalendarReminders.jsx:571` · `calendar.disclaimer`
  > Diese Erinnerungen dienen nur zur Information. Bitte kontaktieren Sie die zuständige Behörde oder Fachperson für offizielle Auskün
- `FinanzUebersicht.jsx:558` · `finanzUebersicht.disclaimer`
  > Alle Werte sind Orientierungshilfen. Für verbindliche Auskünfte wenden Sie sich an die zuständige Stelle.
- `KVGLeistungen.jsx:922` · `kvg.tpwNote`
  > Taxpunktwert variiert je nach Kanton. In den meisten Kantonen sind die Werte 2026 provisorisch festgesetzt — sie ändern sich, soba
- `KVGLeistungen.jsx:1050` · `kvg.disclaimer`
  > Orientierungshilfe basierend auf KVG/KLV. Für verbindliche Auskünfte: Ihre Krankenkasse.
- `PremiumSubsidy.jsx:293` · `ipv.youngAdultsNote`
  > Junge Erwachsene (19–25) in Ausbildung haben oft eine eigene, höhere Verbilligung. Bitte separat prüfen.
- `PremiumSubsidy.jsx:297` · `ipv.youngAdultsNote`
  > Junge Erwachsene (19–25) in Ausbildung haben oft eine eigene, höhere Verbilligung. Bitte separat prüfen.
- `SozialhilfeView.jsx:120` · `sozialhilfe.assetLimitUnconfirmedUnder`
  > Das erfasste Vermögen liegt unter dem Freibetrag von {freibetrag}. Dieser Freibetrag ist kantonal nicht bestätigt — bitte beim Soz
- `SozialhilfeView.jsx:188` · `sozialhilfe.orientationNote`
  > Diese Berechnung dient der Orientierung. Für eine verbindliche Einschätzung wenden Sie sich bitte an Ihre Gemeinde oder eine Fachs
- `TaxCalculator.jsx:405` · `tax.disclaimer`
  > Diese Orientierung zeigt die geschätzte Steuerbelastung (Bund, Kanton, Gemeinde). Kantonale Werte basieren auf dem Hauptort. Die g
- `UnfallKrankheit.jsx:45` · `unfallKrankheit.step1Note`
  > Diese App ist Orientierung, kein Ersatz für den Notruf.

## D · Echte Erklärung — 24

- `BriefGenerator.jsx:263` · `briefe.dataNote`
  > Ihre gespeicherten Daten werden automatisch eingesetzt. Fehlende Angaben sind markiert.
- `BudgetSync.jsx:350` · `budgetSync.bvgReferenceNote`
  > BVG und AHV sind bereits vom Nettolohn abgezogen — hier nur zur Übersicht.
- `BudgetSync.jsx:484` · `budgetSync.autoUpdateNote`
  > Wird automatisch aktualisiert, wenn Sie in anderen Kapiteln Daten ändern.
- `ChapterView.jsx:930` · `uvgHint.fieldSuggest`
  > Als Angestellte sind Sie meist über den Arbeitgeber unfallversichert — „Über Arbeitgeber" passt dann, und die Unfalldeckung bei de
- `ChapterView.jsx:1527` · `orientation.contextIpv`
  > Je nach Einkommen haben Sie möglicherweise Anspruch auf eine Vergünstigung bei der Krankenkasse. Erkundigen Sie sich bei Ihrer Gem
- `ChapterView.jsx:1568` · `orientation.contextFamilienzulagen`
  > Für Ihre Kinder stehen Ihnen Familienzulagen zu. Die Höhe hängt vom Kanton ab. Ihr Arbeitgeber kann Ihnen weiterhelfen.
- `ChapterView.jsx:1779` · `edu.pathsTitle`
  > Kein Berufsabschluss? So holen Sie ihn als Erwachsene/r nach
- `ChapterView.jsx:1891` · `wohnen.nkEstimate`
  > Nebenkosten: CHF {monthly}/Mt. → ca. CHF {annual}/Jahr. Bei Genossenschaften kommt oft eine jährliche Abrechnung hinzu.
- `KVGLeistungen.jsx:595` · `kvg.tpwOhneKantonProfil`
  > Ohne Wohnkanton im Profil rechnet die App hier nicht — der Taxpunktwert ist je Kanton verschieden.
- `KVGLeistungen.jsx:757` · `kvg.belegRueckwirkend`
  > Belege können Sie bis zu 5 Jahre rückwirkend bei der Krankenkasse einreichen.
- `KVGLeistungen.jsx:894` · `kvg.tpwOhneKanton`
  > Ohne Kanton rechnet die App nicht — der Taxpunktwert ist je Kanton verschieden.
- `KVGWechsel.jsx:113` · `kvgWechsel.uptakeReassure`
  > In der Grundversicherung gilt Aufnahmepflicht — keine Kasse darf Sie ablehnen.
- `KVGWechsel.jsx:114` · `kvgWechsel.debtNote`
  > Wechseln können Sie nur, wenn Sie bei Ihrer aktuellen Kasse keine offenen Prämien oder Ausstände haben — sonst kann sie den Wechse
- `NotfallVorlesekarte.jsx:131` · `notfallkarte.step1Note`
  > Unsicher, welche? Rufen Sie 144 an — dort verbindet man Sie weiter.
- `PremiumSubsidy.jsx:270` · `premium.enterIncome`
  > Ihr Kanton ist übernommen. Geben Sie jetzt Ihr monatliches Einkommen unter "Finanzen" ein, um Ihren IPV-Anspruch zu berechnen.
- `StipendienView.jsx:107` · `stip.notEligible`
  > Nicht berechtigt ist, wer sich ausschliesslich für die Ausbildung in der Schweiz aufhält.
- `TaxCalculator.jsx:234` · `tax.elterntarifHint`
  > Trifft das zu, gilt der Elterntarif (DBG Art. 36 Abs. 2bis): der Tarif für Verheiratete, abzüglich CHF {value} je Kind. Ohne Bestä
- `TaxCalculator.jsx:239` · `budgetSync.bvgReferenceNote`
  > BVG und AHV sind bereits vom Nettolohn abgezogen — hier nur zur Übersicht.
- `TaxCalculator.jsx:341` · `tax.gemeinsamDirektHinweis`
  > Maloja nimmt an, dass der eingetragene Wert das gemeinsame steuerbare Einkommen des Ehepaars aus der Veranlagung ist. Die Zeile mi
- `TaxCalculator.jsx:395` · `tax.saeulen.abzuegeNote`
  > Je Zivilstand mit den passenden Abzügen gerechnet — steuerbares Einkommen ledig CHF {ledig}, verheiratet CHF {verheiratet} (Allein
- `UnfallKrankheit.jsx:62` · `unfallKrankheit.step2Note`
  > Der Unterschied zählt: Bei einem anerkannten Unfall über die UVG gibt es keine Franchise.
- `ZipExport.jsx:343` · `zipExport.whatIsExported`
  > Was wird exportiert?
- `SteuerSaeulen.jsx:105` · `tax.saeulen.einzelnPending`
  > Verheiratet, einzeln (Individualbesteuerung): am 8. März 2026 angenommen, soll 2032 in Kraft treten (Entscheid des Bundesrats vom 
- `SteuerSaeulen.jsx:107` · `tax.saeulen.scope`
  > Nur direkte Bundessteuer (DBG Art. 36). Kanton und Gemeinde sind hier nicht enthalten.

## E · Führung — 6

- `KKScanner.jsx:124` · `kkScanner.scanRequiresInternet`
  > Scannen benötigt eine Internetverbindung. Sie können die Daten auch manuell eingeben.
- `MietzinsOrientierung.jsx:58` · `mietzinsView.enterCanton`
  > Erfassen Sie Ihre Postleitzahl, dann zeigen wir, ob Ihr Kanton Mietzinsbeiträge kennt.
- `PremiumSubsidy.jsx:212` · `premium.enterCanton`
  > Bitte geben Sie Ihren Kanton unter "Persönliche Basis" oder Ihre PLZ unter "Wohnen" ein.
- `SozialhilfeView.jsx:49` · `sozialhilfe.enterCanton`
  > Bitte Kanton eingeben für kantonale Berechnung.
- `TaxCalculator.jsx:256` · `tax.taxableIncomeDirectHint`
  > Bekannt aus der Steuerveranlagung? Direkt eintragen — dann rechnet die Übersicht damit statt aus dem Nettolohn. Gemeint ist der We
- `VorsorgeRechner.jsx:940` · `vr.saeule3aHint`
  > Erfassen Sie Ihr 3a-Guthaben und die jährliche Einzahlung unter Finanzen → Vorsorge.

## F · Text kommt aus Daten — 26

- `AblaufSchale.jsx:78` · `«dynamisch» n`
- `BudgetSync.jsx:460` · `«dynamisch» showAnnual`
- `CalendarReminders.jsx:519` · `«dynamisch» tmpl.coverage`
- `ChapterView.jsx:430` · `«dynamisch» field.orientation`
- `ChapterView.jsx:596` · `«dynamisch» field.hint`
- `ChapterView.jsx:653` · `«dynamisch» field.hint`
- `ChapterView.jsx:674` · `«dynamisch» field.hint`
- `ChapterView.jsx:853` · `«dynamisch» field.hint`
- `ChapterView.jsx:926` · `«dynamisch» field.hint`
- `ChapterView.jsx:2274` · `«dynamisch» getFileExpiryHint`
- `KVGLeistungen.jsx:118` · `kvg.`
- `KVGLeistungen.jsx:770` · `«dynamisch» statusMsg.text`
- `KVGLeistungen.jsx:950` · `«dynamisch» gruppe`
- `KVGLeistungen.jsx:951` · `«dynamisch» stand`
- `KVGLeistungen.jsx:1052` · `«dynamisch» renderSource`
- `Lebensmappe.jsx:148` · `«dynamisch» doc.name`
- `MietzinsOrientierung.jsx:65` · `«dynamisch» t`
- `MietzinsOrientierung.jsx:85` · `mietzinsView.result_`
- `MietzinsOrientierung.jsx:88` · `«dynamisch» t`
- `PremiumSubsidy.jsx:288` · `«dynamisch» t`
- `SozialhilfeView.jsx:167` · `«dynamisch» t`
- `SozialhilfeView.jsx:177` · `«dynamisch» `
- `StipendienView.jsx:152` · `«dynamisch» renderSource`
- `TaxCalculator.jsx:240` · `«dynamisch» t`
- `TaxCalculator.jsx:312` · `«dynamisch» a`
- `UmzugAblauf.jsx:93` · `umzug.changes_`
