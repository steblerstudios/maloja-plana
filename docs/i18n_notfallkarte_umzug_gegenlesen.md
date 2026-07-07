# Gegenlese-Blatt — Notruf-Vorlesekarte + Umzug-Checkliste (i18n)

Deutsch = Referenz (Bedeutung). Bitte **fr/it/rm** prüfen. **rm ist ein Provisorium (Rumantsch Grischun)** und braucht am dringendsten eine Muttersprachler:in.

Umfang: die in der Session 2026-07-06 neu hinzugefügten Texte — Notruf-Vorlesekarte (Ernstfall-Karte, Route `notfallkarte`), opt-in Standort und die abhakbare Umzug-Adress-Checkliste. Automatisch aus src/i18n/*.js extrahiert (scratchpad/gen_notfallkarte_gegenlese.mjs).

> Hinweis: `locAccuracy` enthält den Platzhalter `{m}` (Zahl der Metergenauigkeit) — beim Übersetzen stehen lassen. Die Notrufnummern selbst (144/117/118/145/1414/112) sind fix; nur die Labels dahinter übersetzen.

## § ☎ Notruf-Vorlesekarte (`notfallkarte`)

**`title`**

| | Text |
|---|---|
| 🇩🇪 DE | Notruf-Vorlesekarte |
| 🇫🇷 FR | Carte d’appel d’urgence |
| 🇮🇹 IT | Scheda per la chiamata d’emergenza |
| RM | Carta da clamada d’urgenza |

**`intro`**

| | Text |
|---|---|
| 🇩🇪 DE | Wenn etwas passiert, musst du dir nichts merken. Diese Karte sagt dir, was du sagst — und liest deine hinterlegten Angaben ab. |
| 🇫🇷 FR | Si quelque chose arrive, vous n’avez rien à retenir. Cette carte vous dit quoi dire — et affiche les informations que vous avez enregistrées. |
| 🇮🇹 IT | Se succede qualcosa, non devi ricordare nulla. Questa scheda ti dice cosa dire — e mostra i dati che hai salvato. |
| RM | Sche insatge capita, na stos ti betg tegnair endament nagut. Questa carta ti di tge dir — e mussa las indicaziuns che ti has memorisà. |

**`step1Title`**

| | Text |
|---|---|
| 🇩🇪 DE | Nummer wählen |
| 🇫🇷 FR | Composer le numéro |
| 🇮🇹 IT | Comporre il numero |
| RM | Tscherner il numer |

**`step1Text`**

| | Text |
|---|---|
| 🇩🇪 DE | Tippe auf eine Nummer, um anzurufen. 112 funktioniert auch ohne Guthaben oder SIM-Karte. |
| 🇫🇷 FR | Touchez un numéro pour appeler. Le 112 fonctionne même sans crédit ni carte SIM. |
| 🇮🇹 IT | Tocca un numero per chiamare. Il 112 funziona anche senza credito o scheda SIM. |
| RM | Tutga sin in numer per telefonar. Il 112 funcziunescha era senza credit u carta SIM. |

**`step1Note`**

| | Text |
|---|---|
| 🇩🇪 DE | Unsicher, welche? Ruf 144 — sie verbinden dich weiter. |
| 🇫🇷 FR | Vous ne savez pas lequel ? Appelez le 144 — ils vous transféreront. |
| 🇮🇹 IT | Non sai quale? Chiama il 144 — ti metteranno in contatto. |
| RM | Betg segir tge? Telefonescha 144 — els ta collieschan vinavant. |

**`num_sani`**

| | Text |
|---|---|
| 🇩🇪 DE | Sanität |
| 🇫🇷 FR | Ambulance |
| 🇮🇹 IT | Ambulanza |
| RM | Ambulanza |

**`num_police`**

| | Text |
|---|---|
| 🇩🇪 DE | Polizei |
| 🇫🇷 FR | Police |
| 🇮🇹 IT | Polizia |
| RM | Polizia |

**`num_fire`**

| | Text |
|---|---|
| 🇩🇪 DE | Feuerwehr |
| 🇫🇷 FR | Pompiers |
| 🇮🇹 IT | Pompieri |
| RM | Pumpiers |

**`num_tox`**

| | Text |
|---|---|
| 🇩🇪 DE | Vergiftungen (Tox Info) |
| 🇫🇷 FR | Intoxications (Tox Info) |
| 🇮🇹 IT | Avvelenamenti (Tox Info) |
| RM | Intoxicaziuns (Tox Info) |

**`num_rega`**

| | Text |
|---|---|
| 🇩🇪 DE | Luftrettung (Rega) |
| 🇫🇷 FR | Sauvetage aérien (Rega) |
| 🇮🇹 IT | Soccorso aereo (Rega) |
| RM | Salvament ord l’aria (Rega) |

**`num_euro`**

| | Text |
|---|---|
| 🇩🇪 DE | Europäischer Notruf |
| 🇫🇷 FR | Numéro d’urgence européen |
| 🇮🇹 IT | Numero d’emergenza europeo |
| RM | Numer d’urgenza europeic |

**`step2Title`**

| | Text |
|---|---|
| 🇩🇪 DE | Was du sagst |
| 🇫🇷 FR | Que dire |
| 🇮🇹 IT | Cosa dire |
| RM | Tge che ti dis |

**`step2Text`**

| | Text |
|---|---|
| 🇩🇪 DE | Bleib ruhig. Sag es der Reihe nach: |
| 🇫🇷 FR | Restez calme. Dites-le dans cet ordre : |
| 🇮🇹 IT | Resta calmo. Dillo in quest’ordine: |
| RM | Resta calm. Di el en questa successiun: |

**`sayWhere`**

| | Text |
|---|---|
| 🇩🇪 DE | Wo bist du? |
| 🇫🇷 FR | Où êtes-vous ? |
| 🇮🇹 IT | Dove sei? |
| RM | Nua es ti? |

**`sayWhereEmpty`**

| | Text |
|---|---|
| 🇩🇪 DE | sag, wo du bist |
| 🇫🇷 FR | dites où vous êtes |
| 🇮🇹 IT | di’ dove ti trovi |
| RM | di nua che ti es |

**`sayWhat`**

| | Text |
|---|---|
| 🇩🇪 DE | Was ist passiert? |
| 🇫🇷 FR | Que s’est-il passé ? |
| 🇮🇹 IT | Cosa è successo? |
| RM | Tge è capità? |

**`sayHowMany`**

| | Text |
|---|---|
| 🇩🇪 DE | Wie viele Personen sind betroffen? |
| 🇫🇷 FR | Combien de personnes sont concernées ? |
| 🇮🇹 IT | Quante persone sono coinvolte? |
| RM | Quantas persunas èn pertutgadas? |

**`sayWho`**

| | Text |
|---|---|
| 🇩🇪 DE | Wer bist du? |
| 🇫🇷 FR | Qui êtes-vous ? |
| 🇮🇹 IT | Chi sei? |
| RM | Tgi es ti? |

**`sayWhoEmpty`**

| | Text |
|---|---|
| 🇩🇪 DE | nenn deinen Namen und deine Nummer |
| 🇫🇷 FR | donnez votre nom et votre numéro |
| 🇮🇹 IT | di’ il tuo nome e il tuo numero |
| RM | di tes num e tes numer |

**`step2Stay`**

| | Text |
|---|---|
| 🇩🇪 DE | Bleib am Telefon. Leg erst auf, wenn die Leitstelle es sagt. |
| 🇫🇷 FR | Restez en ligne. Ne raccrochez que lorsque la centrale vous le dit. |
| 🇮🇹 IT | Resta al telefono. Riaggancia solo quando te lo dice la centrale. |
| RM | Resta al telefon. Serra pir giu, cur che la centrala di. |

**`locBtn`**

| | Text |
|---|---|
| 🇩🇪 DE | Adresse unsicher? Meinen Standort zeigen |
| 🇫🇷 FR | Adresse incertaine ? Afficher ma position |
| 🇮🇹 IT | Indirizzo incerto? Mostra la mia posizione |
| RM | Adressa nunsegira? Mussar mia posiziun |

**`locLoading`**

| | Text |
|---|---|
| 🇩🇪 DE | Standort wird ermittelt … |
| 🇫🇷 FR | Localisation en cours … |
| 🇮🇹 IT | Rilevamento della posizione … |
| RM | Determinar la posiziun … |

**`locAccuracy`**

| | Text |
|---|---|
| 🇩🇪 DE | Genauigkeit ±{m} m |
| 🇫🇷 FR | Précision ±{m} m |
| 🇮🇹 IT | Precisione ±{m} m |
| RM | Precisiun ±{m} m |

**`locMapLink`**

| | Text |
|---|---|
| 🇩🇪 DE | In Karten-App öffnen |
| 🇫🇷 FR | Ouvrir dans l’app cartes |
| 🇮🇹 IT | Apri nell’app mappe |
| RM | Avrir en l’app da cartas |

**`locNotStored`**

| | Text |
|---|---|
| 🇩🇪 DE | Wird nur jetzt geholt und nirgends gespeichert. |
| 🇫🇷 FR | Récupérée seulement maintenant et enregistrée nulle part. |
| 🇮🇹 IT | Recuperata solo ora e salvata da nessuna parte. |
| RM | Vegn tratg mo ussa e memorisà ennagliur. |

**`loc_denied`**

| | Text |
|---|---|
| 🇩🇪 DE | Standort-Freigabe abgelehnt — das ist ok. Sag einfach, wo du bist. |
| 🇫🇷 FR | Accès à la position refusé — pas de souci. Dites simplement où vous êtes. |
| 🇮🇹 IT | Accesso alla posizione negato — va bene. Di’ semplicemente dove ti trovi. |
| RM | Access a la posiziun refusà — quai è ok. Di simplamain nua che ti es. |

**`loc_error`**

| | Text |
|---|---|
| 🇩🇪 DE | Standort liess sich nicht ermitteln. Sag einfach, wo du bist. |
| 🇫🇷 FR | Impossible d’obtenir votre position. Dites simplement où vous êtes. |
| 🇮🇹 IT | Impossibile ottenere la posizione. Di’ semplicemente dove ti trovi. |
| RM | La posiziun na sa lascha betg determinar. Di simplamain nua che ti es. |

**`loc_unsupported`**

| | Text |
|---|---|
| 🇩🇪 DE | Dieses Gerät kann den Standort hier nicht ermitteln. Sag einfach, wo du bist. |
| 🇫🇷 FR | Cet appareil ne peut pas obtenir la position ici. Dites simplement où vous êtes. |
| 🇮🇹 IT | Questo dispositivo non può rilevare la posizione qui. Di’ semplicemente dove ti trovi. |
| RM | Quest apparat na po betg determinar la posiziun qua. Di simplamain nua che ti es. |

**`step3Title`**

| | Text |
|---|---|
| 🇩🇪 DE | Deine Angaben zum Ablesen |
| 🇫🇷 FR | Vos informations à lire |
| 🇮🇹 IT | I tuoi dati da leggere |
| RM | Tias indicaziuns per leger |

**`step3Text`**

| | Text |
|---|---|
| 🇩🇪 DE | Du musst sie dir nicht merken — lies sie ab, wenn du gefragt wirst: |
| 🇫🇷 FR | Vous n’avez pas à les retenir — lisez-les si on vous le demande : |
| 🇮🇹 IT | Non devi ricordarli — leggili se te li chiedono: |
| RM | Ti na stos betg tegnair endament — legia las, sche ins ta dumonda: |

**`step3Empty`**

| | Text |
|---|---|
| 🇩🇪 DE | Noch keine Notfall-Angaben hinterlegt. Schon Blutgruppe und ein Kontakt helfen. |
| 🇫🇷 FR | Aucune information d’urgence enregistrée. Même votre groupe sanguin et un contact aident. |
| 🇮🇹 IT | Nessun dato d’emergenza salvato. Anche il gruppo sanguigno e un contatto aiutano. |
| RM | Anc naginas indicaziuns d’urgenza memorisadas. Gia il gruppa da sang ed in contact gidan. |

**`step3EmptyLink`**

| | Text |
|---|---|
| 🇩🇪 DE | Notfall-Angaben ergänzen → |
| 🇫🇷 FR | Ajouter des informations d’urgence → |
| 🇮🇹 IT | Aggiungi dati d’emergenza → |
| RM | Agiuntar indicaziuns d’urgenza → |

**`dossierLink`**

| | Text |
|---|---|
| 🇩🇪 DE | Ganzes Notfall-Dossier (zum Ausdrucken) → |
| 🇫🇷 FR | Dossier d’urgence complet (à imprimer) → |
| 🇮🇹 IT | Dossier d’emergenza completo (da stampare) → |
| RM | Dossier d’urgenza cumplet (per stampar) → |

**`footerCalm`**

| | Text |
|---|---|
| 🇩🇪 DE | Diese Karte liegt nur auf deinem Gerät — niemand sonst sieht sie. |
| 🇫🇷 FR | Cette carte reste uniquement sur votre appareil — personne d’autre ne la voit. |
| 🇮🇹 IT | Questa scheda resta solo sul tuo dispositivo — nessun altro la vede. |
| RM | Questa carta resta mo sin tes apparat — nagin auter la vesa. |

## § Einstieg Notfall (`notfallEinstieg`)

**`vorlesekarteTitle`**

| | Text |
|---|---|
| 🇩🇪 DE | Im Ernstfall: was du am Telefon sagst |
| 🇫🇷 FR | En cas d’urgence : que dire au téléphone |
| 🇮🇹 IT | In caso di emergenza: cosa dire al telefono |
| RM | En cas d’urgenza: tge dir al telefon |

**`vorlesekarteSub`**

| | Text |
|---|---|
| 🇩🇪 DE | Die Vorlesekarte führt dich durch den Anruf und zeigt deine wichtigsten Angaben |
| 🇫🇷 FR | La carte à lire vous guide pendant l’appel et affiche vos informations essentielles |
| 🇮🇹 IT | La scheda da leggere ti guida durante la chiamata e mostra i tuoi dati essenziali |
| RM | La carta da leger ta maina tras la telefonada e mussa tias indicaziuns pli impurtantas |

## § Umzug — Adress-Checkliste (`umzug`)

**`step3Add`**

| | Text |
|---|---|
| 🇩🇪 DE | merken |
| 🇫🇷 FR | noter |
| 🇮🇹 IT | annota |
| RM | notar |

**`step3Added`**

| | Text |
|---|---|
| 🇩🇪 DE | gemerkt |
| 🇫🇷 FR | noté |
| 🇮🇹 IT | annotato |
| RM | notà |

**`step3AddAll`**

| | Text |
|---|---|
| 🇩🇪 DE | Alle in die Merkliste |
| 🇫🇷 FR | Tout ajouter à ma liste |
| 🇮🇹 IT | Aggiungi tutto alla lista |
| RM | Agiuntar tut a la glista |

**`step3TodoPrefix`**

| | Text |
|---|---|
| 🇩🇪 DE | Adresse ändern: |
| 🇫🇷 FR | Changer l’adresse : |
| 🇮🇹 IT | Cambiare indirizzo: |
| RM | Midar adressa: |

---

_3 Bereiche, 40 Textstellen._
