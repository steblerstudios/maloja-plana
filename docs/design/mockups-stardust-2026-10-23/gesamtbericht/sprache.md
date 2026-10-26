# Sprache und Ton, Zwischenstand (23.10.2026, aa94f3d6)

Umbenennung (eine Seite = ein Name) liegt NICHT auf main. Betroffene Stellen:
- de.js:1407 nav.anspruch 'Anspruch' (fr 'Droits', it 'Diritti', en 'Rights'); Soll: dashboard.anspruchTitle 'Was steht mir zu?'
- de.js:1588 anspruch.pageTitle 'Ansprüche im Überblick'; gefuehrtLink 'Geführter Anspruch-Check'
- de.js:35 lebenszustaende.pageTitle 'Lebenssituationen' (+ pageSub 'Versteckte Ansprüche entdecken'); step5LinkSituation 'Passende Lebenssituationen ansehen' (~534)
- de.js:5883 gepaeck.title 'Wanderrucksack', gepaeck.link 'Wanderrucksack'; nav.rucksack-Kommentar nennt 'Wanderrucksack' (1407, in allen Sprachen)
- de.js:32 nav.calendar 'Kalender' (fr Calendrier, it Calendario, en Calendar); calendar.title ist bereits 'Was ansteht'. Kommentar 1409: nav.calendar speist Boden-Anker, Gepäck und «Zurück zu …»
- Schrittlinks 'Zum Kalender' / 'Im Kalender ansehen' (de.js:201, 237, 318, 342 u. a.): Seitenname, nicht Funktion
- en nav.wasAnsteht 'Coming up' vs calendar.title: noch zu prüfen

## Stand 2 (belegt per Skript über de/en/fr/it/rm)
- Schlüssel-Parität: en/it/rm ohne fehlende Schlüssel; fr hat 1 überzähligen: dashboard.detailProgress (fr.js, in de fehlt er). rm: 125 Schlüssel mehr als de, 942x TODO(rm) (nur gezählt).
- ß: 0 Treffer in allen Sprachen. Gut.
- Währung de: 217x «CHF 123», 2x «123 CHF» (de.js:2394 tierLow, :2397 medianNote), 16x «Fr. 100.–» (u. a. de.js:4115, 4121, 4213, 4220, 4229), ~100x «123 Franken». Vier Schreibweisen, teils in derselben Seite (Prämienverbilligung-Kantonstexte). Fr./Franken/CHF vereinheitlichen. Vorschlag: «CHF 123» für Beträge, «Franken» im Fliesstext.
- sie/du: 918 sie vs 919 du in de.js — Paar nicht ausgeglichen, Stelle noch zu finden.
- de du-Variante mit grossgeschriebenem Du/Dein/Dich (uneinheitlich zum übrigen «du»): legal.privacy.sensitive2 (de.js), orientation.bvg, orientation.patientenverfuegung, edu.pathsHow ⚠️
- fr/it: je 17/20 Schlüssel sind in de ein String, in fr/it ein {sie,du}-Objekt (z. B. fr+it: mahnung.zins.ohne, nav.sub.cv, emergencyCardEntry.title, chapters.*.emptyState; it zusätzlich error.tryAgain/reload/report, tour.welcome.title). Heisst: de ohne Anrede-Paar, fr/it mit. Prüfen, ob de dort beim Neutral-String bleiben darf.
- en: kein sie/du (Englisch hat nur 4–5 Paare). Ton-Parität der Anrede de/en bewusst anders, kein Befund.

## Stand 3: Umbenennung, belegt am Code (alles noch auf altem Stand)
- view 'situationen' hat 3 Namen: Leiste main.jsx:419 nav.anspruch «Anspruch» (fr Droits / it Diritti / en Rights); Menü MobileNav.jsx:169 dashboard.anspruchTitle «Was steht mir zu?»; Seitentitel + Werkzeugliste Dashboard.jsx:867, werkzeugRegister.js:76, ansichtenRegister.js:102 lebenszustaende.pageTitle «Lebenssituationen» (de.js:34). Dazu Dashboard.jsx:623 lebenszustaende.dashboardLink «Trifft eine Situation auf Sie zu?».
- view 'ansprueche'/'schnellcheck' (ansichtenRegister.js:101, 103) heisst anspruch.pageTitle «Ansprüche im Überblick» (de.js:1589), fr/it «Aperçu/Panoramica delle prestazioni»: weiterer Name für dasselbe Thema, fr/it sagen «prestazioni», nicht «droits».
- view 'gepaeck': Leiste main.jsx:406 + Menü MobileNav.jsx:168 «Rucksack»; Seitentitel Gepaeck.jsx:331 + ansichtenRegister.js:109 gepaeck.title «Wanderrucksack»; Dashboard.jsx:368 gepaeck.link «Wanderrucksack»; fr «Sac à dos de randonnée», it «Zaino da escursione», en «Hiking backpack» (en.js:5832). Interne Kommentare nennen noch «Gepäck» (Gepaeck.jsx, Dashboard.jsx:519/799, miniRucksack.js:14).
- view 'calendar': Menü MobileNav.jsx:167 nav.wasAnsteht; Seitentitel calendar.title «Was ansteht» (de.js:4922, ok); aber nav.calendar «Kalender» noch in MerklisteView.jsx:27, Dashboard.jsx:891, werkzeugRegister.js:67 (Werkzeugliste, Merkliste-Tabs). Und nav.zurueckZu {name} main.jsx:1520 bekommt je nach Quelle «Kalender» oder «Was ansteht». Funktions-Wörter «in den Kalender», «Zum Kalender», «Im Kalender ansehen» (~30 Stellen in Abläufen, Wortlaut in de.js:199–600) sind Aktion, nicht Seitenname, aber lesen sich wie der alte Name.
- Übersetzungs-Abweichung: calendar.title en «Coming up», fr «À venir», it «In arrivo»; rm «Tge ch'è proxim». «Was ansteht» ist zeitlich, «Coming up» eher Ankündigung. 💡

## Stand 4 (Rest, siehe Antwort für die Tabelle)
- Fehlende Schlüssel (in allen Sprachen): budgetImport.importFailed (BudgetImport.jsx:33, Fallback deutsch), calendar.nicelyDone (CalendarReminders.jsx:250, Fallback «Erledigt»), common.clear (MobileNav.jsx:320, Fallback englisch «Clear» als aria-label).
- Gender: 3 Systeme in de.js: Doppelpunkt (Nutzer:innen 2516/2521, Ausländer:innen 6469, Bürger:innen 6470), Schrägstrich (Partner/in 2805, 3048, Angestellte/r 1255, Erwachsene/r 6405, Sachbearbeiter/in 6390), Paarform (Schweizerin oder Schweizer 731, Ärztin oder Arzt). Generisch: «für Schweizer» 1002, «Jeder Schweizer» 1012, «Ombudsman» 2556.
- Flyer (de.js:6629 ff.): nur Sie, keine du-Variante.
- Druck: «sofort» in Fristen/Titeln (de.js:335 «Beim RAV anmelden — sofort», fristVorbei-Texte in umzug, zuzug, bewilligung, wegzug, ausweis), «Achtung» in ipv.* (de.js:4106, 4110, 4199, 4202, 4275).
- Schreibweise: Selbständig 14x vs Selbstständig 6x (de.js:2019); Franken/Fr./CHF; Krankenkassenprämie vs Krankenkassen-Prämie.
