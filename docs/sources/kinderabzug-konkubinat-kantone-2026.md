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

## Offen (Stand Messung 1 — siehe Messung 2 unten)

- ~~Die übrigen 21 Kantone.~~ Gelesen, siehe Messung 2. BE, BS, JU, OW, UR, VD zeigen heute ohnehin keine Kantonszahl
  (`KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB`), für sie drängt die Frage weniger.
- Einbau: für «hälftig»-Kantone entweder mit halbem Abzug rechnen (die Stütztabellen sind mit
  ganzem Abzug gemessen → neu messen oder keine Zahl zeigen) oder den Annahme-Text je Kanton
  genau fassen. Entscheid Stebler Studios; danach `swiss-precision-pruefer`.

## Messung 2 — die übrigen 21 Kantone (24.09.2026 abends)

Gelesen von drei Helfern mit derselben Pflicht-Methode (Rohtext, Abschnitt drumherum, Gegenprobe
mit erfundener Adresse); jeder Eintrag meldet «Rohtext geprüft». **Selbst nachgeprüft:** ZH (keine
Einverdiener-Ausnahme in der ganzen Weisung), FR und GE (Ausnahme, die eine Zahl stehen lässt),
AI und VS von Hand im Rohtext, NW, SH, SO und TI maschinell (Zitat wörtlich in der Quelle).
**NE:** das Zitat des Helfers war eine Zusammenfassung, nicht wörtlich — der Rohtext nennt ein
Wahlrecht, darum «unsicher».

**Worauf es für die App ankommt:** Sie rechnet nur, wenn der Partner **kein Einkommen** hat. Mehrere
«hälftig»-Kantone nennen für genau diesen Fall eine Ausnahme (ganzer Abzug beim verdienenden
Elternteil). Entscheidend ist darum die Spalte «in der App».

| Kanton | Regel | in der App | Quelle — Wortlaut (gekürzt) | Stand | Adresse |
|---|---|---|---|---|---|
| **AI** | **hälftig** | keine Zahl (Liste) | Kanton Appenzell Innerrhoden, Kantonale Steuerverwaltung, Wegleitung zur Steuererklärung 2025, Ziff. 25.1/25.2 Sozialabzüge — «Stehen Kinder unter gemeinsamer elterlicher Sorge nicht gemeinsam besteuerter Eltern, kommt der Kinderabzug jenem Elternteil zu, der für das Kind Unterhaltsbeiträge erhält. Werden keine solchen geleistet, wird der Kinder…» | Wegleitung zur Steuererklärung 2025 (Steuerperiode 2025) | https://www.ai.ch/themen/steuern/steuerformulare/steuererklaerung-fuer-natuerliche-personen-2025/wegleitung-steuererklaerung-2025/@@download/file/Wegleitung_2025.pdf |
| **AR** | Kann-Vorschrift | Zahl bleibt, **unsicher**: «kann … hälftig aufgeteilt werden», Grundregel: wer den Unterhalt zur Hauptsache bestreitet | Steuergesetz Appenzell Ausserrhoden (bGS 621.11), Art. 38 Abs. 1bis; gleichlautend Wegleitung zur Steuererklärung 2025, Ziff. 23 — «1 bis Werden die Eltern getrennt besteuert, kann der Kinderabzug hälftig aufgeteilt werden, wenn das Kind unter gemeinsamer elterlicher Sorge steht und keine Unterhaltsbeiträge nach Art. 35 lit. c für das Kind geltend ge…» | StG: konsolidierte Fassung publiziert/in Kraft 01.01.2025 (a | https://bgs.ar.ch/api/de/texts_of_law/621.11/show_as_json |
| **BE** | hälftig, Ausnahme Einverdiener | ohnehin keine Zahl (`KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB`) | Steuerverwaltung Bern, Merkblatt 12 Familienbesteuerung (Natürliche Personen, ab 2025), Ziff. 3 und Ziff. 13.1 — «Bei Eltern, die getrennt veranlagt werden und in einem gemeinsamen Haushalt wohnen, steht der Kinderabzug dem Elternteil zu, der Kinderalimente versteuert. Werden keine Kinderalimente geleistet, steht der Kinderabzug bei…» | «ab 2025» (PDF erstellt/geändert 18.12.2025) | https://www.sv.fin.be.ch/content/dam/sv_fin/dokumente/de/merkblaetter/einkommens_vermoegenssteuer/aktuelles_steuerjahr/mb12_ev_familienbesteuerung_de.pdf |
| **BS** | hälftig | ohnehin keine Zahl | Gesetz über die direkten Steuern Basel-Stadt (SG 640.100), § 35 Abs. 1 lit. a — «werden die Eltern getrennt besteuert, so wird der Kinderabzug hälftig aufgeteilt, wenn das Kind unter gemeinsamer elterlicher Sorge steht und keine Unterhaltsbeiträge nach § 32 Abs. 1 lit. c für das Kind geltend gemacht …» | Konsolidierte Fassung publiziert/in Kraft 01.01.2026 | https://www.gesetzessammlung.bs.ch/api/de/texts_of_law/640.100/show_as_json |
| **FR** | hälftig, Ausnahme Einverdiener | Zahl bleibt: «Verfügt nur ein Elternteil über ein steuerbares Einkommen, kann dieser den ganzen Sozialabzug für Kinder vornehmen» (Ziff. 4, selbst im Rohtext nachgesehen) | KSTV Freiburg, Merkblatt: Familienbesteuerung (natürliche Personen ab 2023), Ziff. 4 und Tabelle Konkubinat (S. 9) — «Ohne Unterhaltsbeitrag a) gemeinsame elterliche Sorge / Sozialabzug für Kinder (KSt und DBSt) / Je hälftiger Abzug; für die Kantonssteuer können die Parteien eine andere Aufteilung vereinbaren.» | «natürliche Personen ab 2023» (kein neueres Merkblatt gefund | https://www.fr.ch/de/document/526971 |
| **GE** | hälftig, Ausnahme Einverdiener | Zahl bleibt: Tabelle Konkubinat ohne Unterhaltsbeitrag, Fussnote 2 «si l’un des conjoints ne dispose d’aucun revenu … en totalité à l’autre» (selbst nachgesehen) | AFC Genève, Guide de la déclaration d'impôts PP 2025, «Charge(s) de famille»; ergänzend ge.ch «Déductions pour vos enfants» (https://www.ge.ch/imposition-famille/deductions-vos-enfants) — «lorsqu'il n'y a pas de versement de pension alimentaire et que les deux parents assurent l'entretien de l'enfant, la déduction pour charge de famille est partagée entre eux de manière paritaire» | Guide 2025; die ge.ch-Seite trägt «Dernière mise à jour: 17  | https://www.getax.ch/support/guide/declaration2025/Chargesdefamille.html |
| **GL** | ganz (Hauptsache) | Zahl bleibt | Steuerverwaltung Glarus, Wegleitung zur Steuererklärung 2025 für natürliche Personen, Ziff. 19.3 — «Bei nicht gemeinsam besteuerten Eltern steht der Kinderabzug demjenigen Elternteil zu, der für den Unterhalt zur Hauptsache aufkommt.» | Wegleitung Steuererklärung 2025 (Verhältnisse am 31.12.2025) | https://www.gl.ch/public/upload/assets/59619/01%20Wegleitung%202025.pdf?fp=1 |
| **GR** | ganz (Hauptsache, vermutet höheres Einkommen) | Zahl bleibt | Steuerverwaltung GR, Praxisfestlegung 038-01 Sozialabzüge (StG 38 I), Ziff. 2.3; bestätigt durch Praxisfestlegung 039-03-01 Familienbesteuerung: Konkubinat, Beispiel 3 — «Leben unverheiratete Eltern mit gemeinsamen minderjährigen Kindern im gleichen Haushalt zusammen (Konkubinat) und erfolgen keine Unterhaltszahlungen, wird vermutet, dass der Konkubinatspartner mit dem höheren Reineinkomm…» | 038-01 datiert 25.2.2026 (Beträge der Steuerperiode 2025); 0 | https://www.gr.ch/DE/institutionen/verwaltung/dfg/stv/dokumentation/praxis/PraxisEinkommenVermgen/038-01.pdf |
| **JU** | hälftig | ohnehin keine Zahl | Service des contributions JU, Guide général 2025 (Tabelle S. 10; Code 620 S. 34–35) — «Concubins exerçant l'autorité parentale commune sur un enfant mineur commun, sans contribution d'entretien (1 ménage) … Déduction pour enfant (code 620) : Les parents reçoivent chacun la moitié de la déduction pour enfan…» | Guide général 2025 (Steuerperiode 2025) | https://www.jura.ch/Htdocs/Files/v/fbfe342f553cc9a6c6308a419f6b18321f83e406d5d9ef01bcacf5413207e4b7.pdf/Guide-general-2025.pdf?download=1 |
| **NE** | Wahlrecht | Zahl bleibt, **unsicher**: jeder «peut demander la moitié», sonst an wer verlangt bzw. höheres Einkommen; Quelle 2016 | Service des contributions NE, Notice 2 «Imposition des époux et de la famille» (S. 4 und Tabelle S. 7) — «Ainsi, chacun des concubins peut demander la moitié des déductions sociales pour enfant à charge. A défaut, elles sont attribuées au concubin qui les demande ou celui ayant le revenu imposable le plus élevé.» | Notice «Valable pour la période fiscale 2016», im Juli 2025  | https://www.ne.ch/sites/default/files/2025-07/SCCO_I766_Notice2_PP_2016.pdf |
| **NW** | **hälftig** | keine Zahl (Liste) | Kantonsblatt Nidwalden (ESTV), Art. 39 Abs. 1 Ziff. 1 StG NW; bestätigt durch Wegleitung 2025 Natürliche Personen NW, Ziff. Kinderabzug (Seite 25/26) — «werden die Eltern getrennt besteuert, so wird der Kinderabzug hälftig aufgeteilt, wenn das Kind unter gemeinsamer elterlicher Sorge steht und keine Abzüge gemäss Art. 35 Abs. 1 Ziff. 3 für das Kind geltend gemacht werden…» | Kantonsblatt Stand Februar 2026 (Betrag CHF 6'400 ab Steuerp | https://www.estv2.admin.ch/stp/kb/nw-de.pdf |
| **OW** | hälftig | ohnehin keine Zahl | Steuerverwaltung Obwalden, Wegleitung zur Steuererklärung 2025, Abschnitt Kinderabzug b) Konkubinatspaare; gesetzlich Art. 37 Abs. 1 Bst. b StG OW (Kantonsblatt ESTV) — «b) Kinderabzug bei Konkubinatspaaren ... Steht das Kind unter gemeinsamer elterlicher Sorge und erfolgen keine Unterhaltszahlungen wird der Kinderabzug beiden Elternteilen je zur Hälfte zugewiesen.» | Wegleitung zur Steuererklärung 2025; Kantonsblatt OW Stand F | https://www.ow.ch/_docn/447067/OW-%231819049-v2-Wegleitung_2025.PDF |
| **SH** | **hälftig** | keine Zahl (Liste) | Kantonsblatt Schaffhausen (ESTV), Art. 37 Abs. 1 lit. b StG SH; Wegleitung zur Steuererklärung 2022 Kanton Schaffhausen, Ziff. 25/26 und Randtext Teilsplitting — «werden die Eltern getrennt besteuert, so wird der Kinderabzug hälftig aufgeteilt, wenn das Kind unter gemeinsamer elterlicher Sorge steht und keine Unterhaltsbeiträge nach Art. 35 Abs. 1 lit. c für das Kind geltend gemac…» | Kantonsblatt Stand Februar 2026 (Kinderabzug CHF 8'400); Weg | https://www.estv2.admin.ch/stp/kb/sh-de.pdf |
| **SO** | **hälftig** | keine Zahl (Liste) | Steuerbuch Kanton Solothurn, § 14 Nr. 2 «Besteuerung von minderjährigen Kindern», Ziff. 5.1; gesetzlich § 43 Abs. 1 lit. a StG SO — «Werden bei gemeinsamer elterlicher Sorge keine Unterhaltsbeiträge für das Kind geltend gemacht, wird der Kinderabzug hälftig auf die beiden Elternteile aufgeteilt. [...] Dabei kommt es nicht darauf an, ob die Eltern im g…» | Steuerbuch-Seite ohne Datum (abgerufen 24.09.2026); § 43 Abs | https://steuerbuch.so.ch/steuern/einkommenssteuer/steuerpflicht/14-nr-2/ |
| **SZ** | ganz (Hauptsache) | Zahl bleibt | Kanton Schwyz, Wegleitung zur Steuererklärung 2025, Ziff. 6.2 «Für minderjährige Kinder» (Kantonssteuer) — «Bei Kindern unter gemeinsamer Sorge nicht gemeinsam besteuerter Eltern steht der Kinderabzug jenem Elternteil zu, der für das Kind Unterhaltsbeiträge erhält. Werden keine Unterhaltsbeiträge geleistet, kommt der Kinderabz…» | Wegleitung zur Steuererklärung 2025 | https://www.sz.ch/public/upload/assets/84900/Wegleitung_zur_Steuererklaerung_2025.pdf?fp=1 |
| **TG** | ganz (Hauptsache) | Zahl bleibt | Thurgauer Steuerpraxis StP 36 Nr. 6 «Kinder- und Ausbildungsabzüge bei getrennt besteuerten Eltern», Ziff. 2.3.3 (Staats- und Gemeindesteuern: Zuteilung bei gemeinsamem Sorgerecht) — «Beim gemeinsamen Kind eines Konkubinatspaares wird nicht von einer alternierenden Obhut im Sinne von § 12a Absatz 2 StV ausgegangen. Der Kinderabzug wird ungeteilt einem der beiden Elternteile zugesprochen. Besteht ein g…» | Steuerpraxis-Ausgabe 2026-09 | https://steuerpraxis.tg.ch/steuerpraxis/2026-09/stp-36-nr-6-kinder-und-ausbildungsabzuge-bei-getrennt-besteuerten-eltern |
| **TI** | **hälftig** | keine Zahl (Liste); Einverdiener-Ausnahme nur aus Urteil, nicht amtlich wiedergegeben | Kantonsblatt Tessin (ESTV, italienisch), Art. 34 cpv. 1 lett. a LT — «se i genitori sono tassati separatamente e se il figlio sottostà all’autorità parentale in comune e non sono versati alimenti secondo l’articolo 32 capoverso 1 lettera c, anche la deduzione per i figli è ripartita per me…» | Kantonsblatt «Stato febbraio 2026»; Betrag CHF 11'500 ab Ste | https://www.estv2.admin.ch/stp/kb/ti-it.pdf |
| **UR** | hälftig | ohnehin keine Zahl | Gesetz über die direkten Steuern im Kanton Uri (RB 3.2211), Art. 41 Abs. 1 lit. a — «werden die Eltern getrennt besteuert, so werden die Abzüge nach Buchstaben a bis c hälftig aufgeteilt, wenn das Kind unter gemeinsamer elterlicher Sorge steht und keine Unterhaltsbeiträge nach Artikel 38 Absatz 1 Buchsta…» | Konsolidierte Fassung publiziert/in Kraft 01.01.2026 (JSON d | https://rechtsbuch.ur.ch/api/de/texts_of_law/3.2211/show_as_json |
| **VD** | anderes (Tarif/Quotient) | ohnehin keine Zahl | Canton de Vaud, Instructions générales 2025, Code 810 (Quotient familial); ergänzend RIFam (BLV 642.11.3) Art. 11 und 12 — «les parents non mariés vivant en ménage commun avec leur enfant mineur sur lequel ils exercent conjointement l’autorité parentale, en l’absence de contributions d’entretien déductibles versées pour cet enfant ;» | Instructions générales 2025 (Steuerperiode 2025); RIFam in d | https://www.vd.ch/fileadmin/user_upload/organisation/dfin/aci/fichiers_pdf/21001_2025.pdf |
| **VS** | **hälftig** | keine Zahl (Liste); Quelle von 2018 | SCC Valais, Imposition des époux et de la famille (Circulaire no 30) – Tabelle explicative — «Un ménage / Concubinage avec autorité parentale commune / Cas no 14.8 / Sans contributions d'entretien / Déductions sociales 1/2 1/2 / Abattement/Fr. 300/enfant 1/2 1/2» | Tabelle mit Titel «Période 2018», Fusszeile 25.03.2024/SCC;  | https://www.vs.ch/documents/85485/98314/Circulaire+no+30+AFC+%E2%80%93+Tabelle+explicative.pdf/53414a63-e27b-4c5e-8a02-295045fcc241?t=1544097247639 |
| **ZG** | ganz (Hauptsache) | Zahl bleibt | Steuerbuch Zug, Erläuterung zu § 33, Ziff. 22.10.3 Tabellen Kinderabzug und anwendbarer Tarif Kantons- und Gemeindesteuern, Tabelle 1 (Bild) — «Besonderheit bei Konkubinat mit gemeinsamen Kindern ohne Unterhaltszahlungen: Dem Elternteil, welcher für den Unterhalt der Kinder zur Hauptsache aufkommt (i.d.R. Elternteil mit dem höheren Reineinkommen) steht der Verhe…» | Tabellenbild «Steuerverwaltung Zug / V08.2014», Steuerbuch-S | https://wissen-backend.webcloud7.ch/steuerbuch/erlaeuterung-zu-a733-sozialabzuege/aktueller-hinweis-ab-steuerperiode-2011/tabellen-kinderabzug-und-anwendbarer-tarif-kantons-und-gemeindesteuern-ab-steuerperiode-2011 |

**Ergebnis für `KINDERABZUG_KONKUBINAT_HAELFTIG`:** ZH, LU, AI, NW, SH, SO, TI, VS. Alle anderen Kantone
zeigen weiter eine Zahl oder zeigten schon vorher keine.
