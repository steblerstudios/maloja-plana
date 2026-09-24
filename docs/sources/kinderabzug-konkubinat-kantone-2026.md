# Kinderabzug im Konkubinat mit gemeinsamer Sorge — wie teilen die Kantone? (K125, Messung 1)

Frage (Bauliste K125): Die App rechnet eine Person im Konkubinat **mit Kindern** und **Partner ohne
Einkommen** mit dem **ganzen** Kinderabzug (so bildet der ESTV-Rechner es ab, siehe
`konkubinat-kinder-kantonssteuer-2026.md`). Für den Bund ist belegt, dass der Abzug bei gemeinsamer
elterlicher Sorge ohne Unterhaltsbeiträge **hälftig** geteilt wird (ESTV KS 30, Ziff. 14.8.1); die App
sagt das als Annahme. Für den **Kanton** steht dort «nicht geprüft». Diese Messung prüft fünf Kantone.

**Stand:** gelesen am 24.09.2026, Stebler Studios/Claude. Jede Stelle unten ist im **Rohtext** der
Quelle nachgesehen (`curl` bzw. PDF → `pdftotext`, dann Volltextsuche), nicht aus einer
Zusammenfassung übernommen. Gegenprobe je Website mit einer erfundenen Adresse: ZH → 404, AG → 404
(die Seiten liefern also echten Inhalt, keine SPA-Hülle wie Fedlex).

## Ergebnis: zwei verschiedene Regeln

| Kanton | Regel bei gemeinsamer Sorge, ohne Unterhaltsbeiträge | Quelle (wörtlich nachgesehen) | Stand der Quelle |
|---|---|---|---|
| **ZH** | **hälftig** | Weisung der Finanzdirektion über Sozialabzüge und Steuertarife (ab Steuerperiode 2026), Rz. 19: «…wird der Kinderabzug unter den Eltern hälftig aufgeteilt (§ 34 Abs. 1 lit. a al. 2 StG)». Im Rohtext zudem: «Bei nicht gemeinsam besteuerten Eltern wird der Kinderabzug hälftig aufgeteilt, wenn das Kind unter gemeinsamer elterlicher Sorge steht…» — zh.ch, Zürcher Steuerbuch ZStB 34.1 | Weisung vom 17.03.2026, ab StP 2026 |
| **LU** | **hälftig** | Luzerner Steuerbuch Bd. 1, Weisungen StG § 42 Nr. 2, Ziff. 1.3 «Unverheiratete Eltern mit gemeinsamem Haushalt»: Kinderabzug «beiden Elternteilen je zur Hälfte zum Abzug zuzuweisen, falls keine Unterhaltsbeiträge für das Kind gemäss § 40 Abs. 1c StG geltend gemacht werden (§ 42 Abs. 2 StG)». Ebenso Merkblatt Familienbesteuerung, **Fall 11** (Konkubinat, gemeinsame Sorge, ohne Alimente): «Kinderabzug – jeder Elternteil je ½-Abzug» | Steuerbuch 01.01.2026; Merkblatt Stand 01.01.2025 |
| **AG** | **ganz** beim Elternteil, der überwiegend für den Unterhalt aufkommt | Wegleitung zur Steuererklärung, 22.1 Kinderabzug: «Üben nicht gemeinsam veranlagte Eltern die elterliche Sorge gemeinsam aus, hat derjenige Elternteil, der überwiegend für den Unterhalt des Kindes aufkommt, Anspruch auf den Abzug.» — «Der Kinderabzug kann pro Kind nur einmal gewährt werden.» Das Wort «hälftig» kommt auf der Seite nicht vor | publiziert 20.01.2026; Steuerjahr auf der Seite **nicht genannt**, §-Grundlage **nicht genannt** |
| **SG** | **ganz** beim Elternteil, der zur Hauptsache für den Unterhalt aufkommt | Steuerbuch StB 48 Nr. 1, Ziff. 2.3.3: «…steht der Kinderabzug gemäss Art. 48 Abs. 1 Bst. a al. 2 StG dem Elternteil zu, welcher zur Hauptsache für den Kindesunterhalt aufkommt» | 01.01.2021 |
| **BL** | **ganz** beim Elternteil mit dem höheren Einkommen | Baselbieter Steuerbuch Bd. 1, 34 Nr. 1, Ziff. 7: «Haben die Eltern das gemeinsame Sorgerecht vereinbart, so erhält der Elternteil mit dem höheren Einkommen den Kinderabzug.» — «Bei der Staatssteuer gibt es bei gemeinsamem Sorgerecht keinen je hälftigen Kinderabzug.» BL gewährt den Kinderabzug als **Ermässigung vom Steuerbetrag** (ESTV-Dossier Familienbesteuerung, Ziff. 4.4) | letzte Änderung 29.02.2020 — **älteste Quelle, vor einem Einbau neu prüfen** |

Quellen-Adressen:
- ZH: https://www.zh.ch/de/steuern-finanzen/steuern/treuhaender/steuerbuch/steuerbuch-definition/zstb-34-1.html
- LU: https://steuerbuch.lu.ch/-/media/Steuerbuch/Dokumente/Archiv/01_01_2026/LUStB_Band1_2026_01_01.pdf · https://steuern.lu.ch/-/media/Steuern/Dokumente/Kalkulatoren/familienbesteuerung_2025.pdf
- AG: https://www.ag.ch/de/themen/steuern-finanzen/steuern/steuererklaerung-einreichen/wegleitung/abzuege/22-steuerfreibetraege-(sozialabzuege)/22-1-kinderabzug
- SG: https://www.sg.ch/content/dam/sgch/steuern-finanzen/steuern/steuerbuch/art-29-52-stg/048_1.pdf
- BL: https://kanton.baselland.ch/finanz-und-kirchendirektion/steuerverwaltung-steuerbuch/band-1/einkommen/downloads-1/band1_034_01.pdf
- Übersicht gesucht, nicht gefunden: ESTV-Dossier «Familienbesteuerung (Stand der Gesetzgebung:
  1. Januar 2026)», https://www.estv2.admin.ch/stp/ds/f-familienbesteuerung-de.pdf — Ziff. 4.4 verweist
  für die Kantone auf die Tabelle «Kinderabzug» der Steuermäppchen; eine Aufteilungsregel je Kanton
  steht im Dossier **nicht**.

## Was das für die App heisst (Befund, noch keine Änderung)

Im Fall der App (gemeinsamer Haushalt, **Partner ohne Einkommen**):
- **AG, SG, BL:** Der verdienende Elternteil trägt den Unterhalt zur Hauptsache → **ganzer Abzug**.
  Die Rechnung der App passt; der Satz «Wie der Kanton den Abzug aufteilt, ist nicht geprüft» könnte
  für diese Kantone durch die Regel ersetzt werden. *Vorbehalt:* ob die Veranlagung im Einzelfall
  tatsächlich so entscheidet, hängt an den Umständen (Unterhalt «zur Hauptsache» — SG Ziff. 2.2.2).
- **ZH, LU:** Das Gesetz teilt **hälftig**, unabhängig davon, wer verdient. Die App rechnet mit dem
  ganzen Abzug → steuerbares Einkommen **zu tief**, Kantonssteuer **zu tief**. Grössenordnung ZH:
  der kantonale Kinderabzug, den der ESTV-Rechner ansetzt, beträgt 9 400 je Kind
  (`konkubinat-kinder-kantonssteuer-2026.md`, Abzugsposten Brutto 80 000); hälftig wären es 4 700
  weniger Abzug je Kind. Die Steuerdifferenz ist **nicht gerechnet**.

## Stolperstein dieser Messung

Eine Websuche fasste Luzern so zusammen: Hat der Elternteil mit elterlicher Sorge kein Einkommen,
erhält der andere «aus Billigkeitsgründen» die Kinderabzüge. Der Satz steht wörtlich im Luzerner
Merkblatt — aber bei **Fall 9, Konkubinat *ohne* gemeinsame elterliche Sorge**. Für gemeinsame Sorge
(Fall 11) gilt hälftig. Ohne den Rohtext wäre LU falsch in die Spalte «ganz» geraten.

## Offen

- Die übrigen 21 Kantone. BE, BS, JU, OW, UR, VD zeigen heute ohnehin keine Kantonszahl
  (`KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB`), für sie drängt die Frage weniger.
- Einbau: für «hälftig»-Kantone entweder mit halbem Abzug rechnen (die Stütztabellen sind mit
  ganzem Abzug gemessen → neu messen oder keine Zahl zeigen) oder den Annahme-Text je Kanton
  genau fassen. Entscheid Stebler Studios; danach `swiss-precision-pruefer`.
