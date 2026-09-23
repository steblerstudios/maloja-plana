# Gegenlese-Blatt — Glossar (i18n)

Deutsch = Referenz (Bedeutung). Bitte **fr/it/rm** prüfen, **en** mitlesen. **rm ist ein
Provisorium (Rumantsch Grischun)** und braucht am dringendsten eine Muttersprachler:in.

Umfang: die 16 Glossar-Erklärungen (`glossar.*`), die hinter den antippbaren Begriffen
stehen (gepunktete Unterstreichung + ⓘ). Stand `main` 24.09.2026. Automatisch aus
`src/i18n/*.js` extrahiert.

## 🛑 Warum dieses Blatt jetzt wichtiger ist als vorher

Seit 24.09.2026 (PR #298) erkennt die App die Begriffe **in jeder Sprache** — und zwar
über das **Kopfwort** der Erklärung: das Wort **vor « — »**.

- «**AVS** — assurance-vieillesse …» → die App markiert «AVS» in französischen Sätzen.
- «**IPV/RIP** — …» → zwei Formen, beide werden erkannt.
- «**Curatelle** (Beistandschaft) — …» → die Klammer ist nur Hinweis, erkannt wird «Curatelle».
- «**Franchise**» erkennt auch «franchise» klein mitten im Satz.

**Wer das Kopfwort ändert, ändert, was die App erkennt.** Darum steht in der dritten
Spalte, welches Wort erkannt wird und **in wie vielen Sätzen** dieser Sprache es vorkommt (alle Zahlen auf diesem Blatt sind Sätze, nicht Vorkommen)
(ohne das Glossar selbst). Eine **0** heisst: die Erklärung nennt ein Wort, das die übrigen
Texte dieser Sprache gar nicht verwenden — dann ist entweder das Kopfwort oder der
übrige Text uneinheitlich.

Gebeugte Formen («franchises», «franchigie») werden nicht erkannt, wie im Deutschen.

## Offene Fragen an die Gegenleserin

Gefunden beim Aufbereiten. **Nichts davon ist geändert** — das sind Sprachentscheide.

| # | Sprache | Begriff | Befund | Frage |
|---|---|---|---|---|
| 1 | rm | Unfallversicherung (`uvg`) | Glossar: «**LAA**» — 0 Sätze. Die rm-Texte sagen «**LAINF**» (7 Sätze, die italienische Abkürzung), «UVG» (3). | Welche Abkürzung ist im Rumantsch üblich? Glossar und Texte angleichen. |
| 2 | rm | SKOS (`skos`) | Glossar: «**SKOS**». Die rm-Texte sagen meist «**COSAS**» (13 Sätze), sonst «SKOS» (5). | Welche Form? Heute erkennt die App nur «SKOS». |
| 3 | rm | Selbstbehalt (`selbstbehalt`) | Glossar: «**Quota da participaziun**» — 1 Satz. Die Texte sagen «quota» (8 Sätze) oder deutsch «Selbstbehalt» (2). | Welcher rm-Ausdruck? |
| 4 | rm | Mietbeiträge (`mietbeitraege`) | Glossar: «**Contribuziuns** da fittanza» — 1 Satz. Die Texte auch «**contributs** da fittanza» (2). | Welche Form? |
| 5 | it | Mietbeiträge (`mietbeitraege`) | Glossar: «Contributi **d’**affitto» — 0 Sätze. Die Texte sagen «contributi **all’**affitto» (2). | Welche Form? |
| 6 | rm | IPV (`ipv`) | de/fr/it haben eine **Sie-** und eine **Du-**Fassung, rm nur eine — mit «tia» (Du). | Braucht rm hier beide Anreden? |
| 7 | fr/it/rm | Taxpunktwert (`taxpunktwert`) | Kopfwort mit «tarifaire / tariffale / da taxa» — 3–4 Sätze. Die Kurzform «valeur du point» / «valore del punto» / «valur dal punct» steht in 8 / 8 / 7 Sätzen. | Kopfwort kürzen, damit die App auch die Kurzform erkennt? |
| 8 | en | Selbstbehalt, Veranlagung | Am 24.09. geändert: «**Co-payment/Retention fee**» (war «Retention») und «**Tax assessment**» (war «Assessment») — die allgemeinen Wörter trafen «retention period» und «a binding assessment by your municipality». | Passt das als Englisch? |

## Die 16 Erklärungen

**`glossar.ipv`** — deutscher Begriff «IPV»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | **Sie:** IPV — Individuelle Prämienverbilligung: ein Zuschuss des Kantons an Ihre Krankenkassenprämie, wenn das Einkommen tief genug ist.<br>**Du:** IPV — Individuelle Prämienverbilligung: ein Zuschuss des Kantons an deine Krankenkassenprämie, wenn das Einkommen tief genug ist. | «IPV» 64 |
| 🇬🇧 EN | IPV — individual premium reduction: a cantonal subsidy toward your health-insurance premium when your income is low enough. | «IPV» 32 |
| 🇫🇷 FR | **Sie:** IPV/RIP — réduction individuelle des primes : une aide cantonale sur votre prime d’assurance-maladie si le revenu est assez bas.<br>**Du:** IPV/RIP — réduction individuelle des primes : une aide cantonale sur ta prime d’assurance-maladie si le revenu est assez bas. | «IPV» 10 · «RIP» 24 |
| 🇮🇹 IT | **Sie:** IPV/RIP — riduzione individuale dei premi: un contributo cantonale sul premio della cassa malati se il reddito è basso.<br>**Du:** IPV/RIP — riduzione individuale dei premi: un contributo cantonale sul premio della cassa malati se il reddito è basso. | «IPV» 11 · «RIP» 22 |
| RM | IPV — reducziun individuala da premias: in agid chantunal a tia premia da la cassa da malsauns sche l’entrada è bassa avunda. | «IPV» 39 |

**`glossar.skos`** — deutscher Begriff «SKOS»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | SKOS — Schweizerische Konferenz für Sozialhilfe: empfiehlt Richtlinien zur Sozialhilfe. Verbindlich sind sie erst, soweit ein Kanton sie übernimmt. | «SKOS» 18 |
| 🇬🇧 EN | SKOS — Swiss Conference for Social Assistance: recommends guidelines for social assistance. They are binding only where a canton adopts them. | «SKOS» 15 |
| 🇫🇷 FR | CSIAS — Conférence suisse des institutions d’action sociale : recommande des normes pour l’aide sociale. Elles ne lient qu’un canton qui les reprend. | «CSIAS» 18 |
| 🇮🇹 IT | COSAS — Conferenza svizzera dell’azione sociale: raccomanda le norme dell’aiuto sociale. Sono vincolanti solo se un cantone le recepisce. | «COSAS» 17 |
| RM | SKOS — Conferenza svizra per l’agid social: recumonda directivas per l’agid social. Ellas èn liantas mo sche in chantun las surpiglia. | «SKOS» 5 |

**`glossar.el`** — deutscher Begriff «EL»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | EL — Ergänzungsleistungen: Zuschuss zu AHV oder IV, wenn die Rente den Lebensbedarf nicht deckt. | «EL» 27 |
| 🇬🇧 EN | EL — supplementary benefits: a top-up to AHV or IV pensions when they do not cover living costs. | «EL» 23 |
| 🇫🇷 FR | PC — prestations complémentaires : complètent l’AVS ou l’AI quand la rente ne suffit pas. | «PC» 26 |
| 🇮🇹 IT | PC — prestazioni complementari: integrano AVS o AI quando la rendita non basta. | «PC» 26 |
| RM | PC — prestaziuns cumplementaras: cumpleteschan l’AVS u l’AI sche la renta na basta betg. | «PC» 27 |

**`glossar.mietbeitraege`** — deutscher Begriff «Mietbeiträge»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | Mietbeiträge — kantonale Zuschüsse an die Wohnungsmiete für Haushalte mit tiefem Einkommen. | «Mietbeiträge» 2 |
| 🇬🇧 EN | Rent subsidies — cantonal contributions toward housing rent for low-income households. | «Rent subsidies» 10 |
| 🇫🇷 FR | Aides au loyer — contributions cantonales au loyer pour les ménages à faible revenu. | «Aides au loyer» 12 |
| 🇮🇹 IT | Contributi d’affitto — contributi cantonali all’affitto per famiglie a basso reddito. | «Contributi d’affitto» 0 |
| RM | Contribuziuns da fittanza — contribuziuns chantunalas a la fittanza per chasadas cun bassa entrada. | «Contribuziuns da fittanza» 1 |

**`glossar.ahv`** — deutscher Begriff «AHV»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | AHV — Alters- und Hinterlassenenversicherung: die staatliche Grundrente im Alter oder beim Tod eines Elternteils. | «AHV» 118 |
| 🇬🇧 EN | AHV — old-age and survivors’ insurance: the state basic pension in old age or when a parent dies. | «AHV» 86 |
| 🇫🇷 FR | AVS — assurance-vieillesse et survivants : la rente de base de l’État à la retraite ou au décès d’un parent. | «AVS» 119 |
| 🇮🇹 IT | AVS — assicurazione vecchiaia e superstiti: la rendita di base statale in età avanzata o alla morte di un genitore. | «AVS» 119 |
| RM | AVS — assicuranza per vegls e survivents: la renta da basa statala en la vegliadetgna u tar la mort d’in genitur. | «AVS» 98 |

**`glossar.iv`** — deutscher Begriff «IV»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | IV — Invalidenversicherung: sichert das Einkommen, wenn Krankheit oder Behinderung das Arbeiten dauerhaft einschränkt. | «IV» 30 |
| 🇬🇧 EN | IV — disability insurance: protects income when illness or disability permanently limits the ability to work. | «IV» 26 |
| 🇫🇷 FR | AI — assurance-invalidité : protège le revenu quand une maladie ou un handicap limite durablement le travail. | «AI» 30 |
| 🇮🇹 IT | AI — assicurazione invalidità: protegge il reddito quando malattia o disabilità limitano durevolmente il lavoro. | «AI» 30 |
| RM | AI — assicuranza d’invaliditad: protegia l’entrada sche malsauna u impediment limiteschan durablamain il lavur. | «AI» 28 |

**`glossar.kvg`** — deutscher Begriff «KVG»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | KVG — Krankenversicherungsgesetz: regelt die obligatorische Grundversicherung, die alle in der Schweiz haben müssen. | «KVG» 28 |
| 🇬🇧 EN | KVG — Health Insurance Act: governs the compulsory basic insurance everyone in Switzerland must have. | «KVG» 17 |
| 🇫🇷 FR | LAMal — loi sur l’assurance-maladie : régit l’assurance de base obligatoire pour tous en Suisse. | «LAMal» 24 |
| 🇮🇹 IT | LAMal — legge sull’assicurazione malattie: regola l’assicurazione di base obbligatoria per tutti in Svizzera. | «LAMal» 24 |
| RM | LAMal — lescha davart l’assicuranza da malsauns: regla l’assicuranza da basa obligatorica per tuts en Svizra. | «LAMal» 21 |

**`glossar.bvg`** — deutscher Begriff «BVG»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | BVG — berufliche Vorsorge (Pensionskasse): die zweite Säule, die zusammen mit der AHV die Rente im Alter bildet. | «BVG» 38 |
| 🇬🇧 EN | BVG — occupational pension (pension fund): the second pillar that, together with AHV, forms the retirement pension. | «BVG» 26 |
| 🇫🇷 FR | LPP — prévoyance professionnelle (caisse de pension) : le deuxième pilier qui, avec l’AVS, forme la rente. | «LPP» 37 |
| 🇮🇹 IT | LPP — previdenza professionale (cassa pensioni): il secondo pilastro che, con l’AVS, forma la rendita. | «LPP» 37 |
| RM | LPP — prevenziun professiunala (cassa da pensiun): il segund pilaster che furma, cun l’AVS, la renta. | «LPP» 33 |

**`glossar.uvg`** — deutscher Begriff «UVG»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | UVG — Unfallversicherung: deckt die Kosten bei Berufs- und Freizeitunfällen. | «UVG» 13 |
| 🇬🇧 EN | UVG — accident insurance: covers the costs of occupational and non-occupational accidents. | «UVG» 8 |
| 🇫🇷 FR | LAA — assurance-accidents : couvre les frais des accidents professionnels et non professionnels. | «LAA» 13 |
| 🇮🇹 IT | LAINF — assicurazione infortuni: copre i costi degli infortuni professionali e non professionali. | «LAINF» 13 |
| RM | LAA — assicuranza cunter accidents: cuvra ils custs d’accidents professiunals e betg professiunals. | «LAA» 0 |

**`glossar.franchise`** — deutscher Begriff «Franchise»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | Franchise — der Anteil der Gesundheitskosten pro Jahr, der selbst getragen wird, bevor die Krankenkasse zahlt. | «Franchise» 92 |
| 🇬🇧 EN | Deductible (Franchise) — the share of health costs paid yourself each year before the health insurer pays. | «Deductible» 62 |
| 🇫🇷 FR | Franchise — la part des frais de santé payée soi-même chaque année avant que la caisse ne paie. | «Franchise» 111 |
| 🇮🇹 IT | Franchigia — la parte dei costi sanitari pagata da sé ogni anno prima che paghi la cassa malati. | «Franchigia» 111 |
| RM | Franchisa — la part dals custs da sanadad pajada sez mintga onn avant che la cassa da malsauns paja. | «Franchisa» 50 |

**`glossar.selbstbehalt`** — deutscher Begriff «Selbstbehalt»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | Selbstbehalt — der Eigenanteil (meist 10 %) an den Kosten über der Franchise, bis zu einem jährlichen Höchstbetrag. | «Selbstbehalt» 36 |
| 🇬🇧 EN | Co-payment/Retention fee (Selbstbehalt) — your share (usually 10%) of costs above the deductible, up to an annual maximum. | «Co-payment» 20 · «Retention fee» 2 |
| 🇫🇷 FR | Quote-part — la participation propre (souvent 10 %) aux frais au-dessus de la franchise, jusqu’à un plafond annuel. | «Quote-part» 32 |
| 🇮🇹 IT | Aliquota percentuale — la propria quota (di solito 10 %) sui costi oltre la franchigia, fino a un tetto annuo. | «Aliquota percentuale» 6 |
| RM | Quota da participaziun — la atgna part (per ordinari 10 %) dals custs sur la franchisa, fin in maximum annual. | «Quota da participaziun» 1 |

**`glossar.beistandschaft`** — deutscher Begriff «Beistandschaft»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | Beistandschaft — eine von der Kindes- und Erwachsenenschutzbehörde (KESB) angeordnete Unterstützung, wenn jemand bestimmte Angelegenheiten nicht mehr selbst regeln kann. So wenig wie nötig, abgestuft. Grundlage: ZGB Art. 390 ff. | «Beistandschaft» 3 |
| 🇬🇧 EN | Deputyship (Beistandschaft) — a support measure ordered by the child and adult protection authority (KESB) when a person can no longer handle certain matters on their own. As little as necessary, graduated. Basis: Civil Code Art. 390 ff. | «Deputyship» 2 |
| 🇫🇷 FR | Curatelle (Beistandschaft) — une mesure de soutien ordonnée par l’autorité de protection de l’enfant et de l’adulte (APEA) lorsqu’une personne ne peut plus régler seule certaines affaires. Aussi légère que possible, graduée. Base : CC art. 390 ss. | «Curatelle» 3 |
| 🇮🇹 IT | Curatela (Beistandschaft) — una misura di sostegno disposta dall’autorità di protezione dei minori e degli adulti quando una persona non è più in grado di gestire da sola determinate questioni. Il meno possibile, graduata. Base: CC art. 390 segg. | «Curatela» 3 |
| RM | Beistandschaft (assistenza) — ina mesira da sustegn ordinada da la KESB (autoritad da protecziun d’uffants e da creschids) sche insatgi na po betg pli reglar sez tschertas fatschentas. Uschè pauc sco necessari, graduà. Basa: ZGB art. 390 ss. | «Beistandschaft» 3 |

**`glossar.nettolohn`** — deutscher Begriff «Nettolohn»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | Nettolohn — der Lohn nach Abzug der Sozialversicherungsbeiträge (AHV/IV/EO, ALV, Pensionskasse, Unfallversicherung), aber vor den Steuern. Die Steuern werden in der Schweiz meist separat nach der Veranlagung bezahlt — ausser bei Quellensteuer. | «Nettolohn» 27 |
| 🇬🇧 EN | Net salary — pay after social insurance contributions (AHV/IV/EO, ALV, pension fund, accident insurance), but before tax. In Switzerland tax is usually paid separately after the assessment — except under withholding tax. | «Net salary» 14 |
| 🇫🇷 FR | Salaire net — le salaire après déduction des cotisations sociales (AVS/AI/APG, AC, caisse de pension, assurance-accidents), mais avant impôts. En Suisse, les impôts se paient en général séparément, après la taxation — sauf en cas d'impôt à la source. | «Salaire net» 27 |
| 🇮🇹 IT | Salario netto — il salario dopo la deduzione dei contributi sociali (AVS/AI/IPG, AD, cassa pensioni, assicurazione infortuni), ma prima delle imposte. In Svizzera le imposte si pagano di regola separatamente, dopo la tassazione — salvo imposta alla fonte. | «Salario netto» 29 |
| RM | Salari net — il salari suenter la deducziun da las contribuziuns socialas (AVS/AI/IPG, AD, cassa da pensiun, assicuranza d'accidents), ma avant las taglias. En Svizra vegnan las taglias pajadas per ordinari separadamain suenter la taxaziun — ordvart la taglia a la funtauna. | «Salari net» 16 |

**`glossar.taxpunktwert`** — deutscher Begriff «Taxpunktwert»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | Taxpunktwert — der Frankenbetrag je Taxpunkt einer ärztlichen Leistung. Er wird je Kanton vereinbart und genehmigt; dieselbe Behandlung kostet deshalb je nach Kanton unterschiedlich viel. Grundlage: KVG Art. 43 ff. | «Taxpunktwert» 8 |
| 🇬🇧 EN | Tax point value — the franc amount per tariff point of a medical service. It is agreed and approved canton by canton, so the same treatment costs a different amount depending on the canton. Basis: KVG Art. 43 ff. | «Tax point value» 8 |
| 🇫🇷 FR | Valeur du point tarifaire — le montant en francs par point tarifaire d'une prestation médicale. Il est convenu et approuvé canton par canton; un même traitement coûte donc plus ou moins selon le canton. Base: LAMal art. 43 ss. | «Valeur du point tarifaire» 3 |
| 🇮🇹 IT | Valore del punto tariffale — l'importo in franchi per punto tariffale di una prestazione medica. È concordato e approvato cantone per cantone; lo stesso trattamento costa quindi diversamente a seconda del cantone. Base: LAMal art. 43 segg. | «Valore del punto tariffale» 3 |
| RM | Valur dal punct da taxa — l'import en francs per punct da taxa d'ina prestaziun medicinala. El vegn concordà ed approvà per mintga chantun; il medem tractament custa perquai different tenor il chantun. Basa: LAMal art. 43 ss. | «Valur dal punct da taxa» 4 |

**`glossar.bundessteuer`** — deutscher Begriff «Bundessteuer»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | Bundessteuer — die direkte Bundessteuer auf dem Einkommen. Ein Tarif für die ganze Schweiz, unabhängig vom Wohnkanton; Kantons- und Gemeindesteuer kommen separat dazu. Grundlage: DBG Art. 36. | «Bundessteuer» 20 |
| 🇬🇧 EN | Federal tax — the direct federal tax on income. One tariff for the whole of Switzerland, regardless of canton of residence; cantonal and municipal tax come on top. Basis: DBG Art. 36. | «Federal tax» 16 |
| 🇫🇷 FR | Impôt fédéral — l'impôt fédéral direct sur le revenu. Un seul barème pour toute la Suisse, indépendamment du canton de domicile; l'impôt cantonal et communal s'y ajoute. Base: LIFD art. 36. | «Impôt fédéral» 20 |
| 🇮🇹 IT | Imposta federale — l'imposta federale diretta sul reddito. Una sola tariffa per tutta la Svizzera, indipendentemente dal cantone di domicilio; l'imposta cantonale e comunale si aggiunge. Base: LIFD art. 36. | «Imposta federale» 20 |
| RM | Taglia federala — la taglia federala directa sin il retgav. Ina tarifa per tut la Svizra, independentamain dal chantun da domicil; la taglia chantunala e communala vegn ultra da quai. Basa: LIFD art. 36. | «Taglia federala» 16 |

**`glossar.veranlagung`** — deutscher Begriff «Veranlagung»

| | Text | erkanntes Wort · Treffer |
|---|---|---|
| 🇩🇪 DE | Veranlagung — der Entscheid der Steuerbehörde für ein Steuerjahr. Darin stehen das steuerbare Einkommen und Vermögen und der geschuldete Betrag. | «Veranlagung» 17 |
| 🇬🇧 EN | Tax assessment (Veranlagung) — the tax authority's decision for a tax year. It states the taxable income and assets and the amount owed. | «Tax assessment» 3 |
| 🇫🇷 FR | Taxation — la décision de l'autorité fiscale pour une année fiscale. Elle indique le revenu et la fortune imposables ainsi que le montant dû. | «Taxation» 18 |
| 🇮🇹 IT | Tassazione — la decisione dell'autorità fiscale per un anno fiscale. Indica il reddito e la sostanza imponibili e l'importo dovuto. | «Tassazione» 21 |
| RM | Taxaziun — la decisiun da l'autoritad da taglia per in onn fiscal. Ella inditgescha il retgav e la facultad taxabla ed il import debità. | «Taxaziun» 17 |
