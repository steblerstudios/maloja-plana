# GREEN + BEIGE DESIGN DIRECTION — Maloja Plana

> Erstellt: 2026-06-08
> Konkrete Analyse der Farbbalance und Designrichtung.
> Keine Implementierung. Nur Richtung.

---

## 1. Wo ist aktuell Beige dominant?

### Messung: Beige-Farbfamilie im Code

| Token | Hex | Verwendung | Vorkommen |
|-------|-----|------------|-----------|
| `palette.bg` | `#F5F2EE` | Haupthintergrund | 5× (bg der ganzen App) |
| `palette.up` | `#F0EDE8` | Erhöhte Flächen | **83× als Background** |
| `palette.surface` | `#FFFFFF` | Karten | 42× als Background |
| `palette.top` | `#EAE5DD` | Höchste Ebene | **0× verwendet** |
| `palette.border` | `#DDD8D0` | Rahmen | 21× |
| `palette.mid` | `#6B6560` | Text | **156× als Textfarbe** |
| `palette.soft` | `#A89F94` | Deaktiviert | 5× |

### Wo Beige dominiert

**Überall.** Die App besteht visuell aus drei Farben:
1. `#F5F2EE` / `#F0EDE8` — beiger Hintergrund (flächig)
2. `#FFFFFF` — weisse Karten (flächig)
3. `#6B6560` — grauer Text (überall)

Das sind ~95% der sichtbaren Fläche. Die restlichen 5% sind punktuelle Akzente.

### Bereiche mit reiner Beige-Dominanz (kein anderer Farbton)
- Alle ChapterView-Formulare
- MirrorCards
- Navigation (MobileNav)
- Settings/Einstellungen
- CalendarReminders
- BudgetSync
- LegalView
- DocumentTresor (Listenansicht)
- ErrorBoundary

---

## 2. Wo sollte Grün stärker sichtbar sein?

### Priorisierte Liste

| Bereich | Warum Grün hier wirken würde | Intensität |
|---------|------------------------------|------------|
| **Kapitelheader** | Erste Fläche die man sieht — definiert die Atmosphäre | Mittel — subtiler Sage-Hintergrund |
| **Sektions-Trennungen** | Zwischen Formulargruppen — gliedern und beruhigen | Leicht — Sage-Linie oder -Verlauf |
| **MirrorCards** | "Das bist du" — sollte sich anders anfühlen als Formulare | Mittel — Sage als Accent-Border oder Background-Tint |
| **Orientierungssätze** | Helvetia-Layer — sollte nicht aussehen wie Systemhinweis | Leicht — Sage-Background statt nur Sage-Text |
| **Dashboard Tier-Labels** | Core/Supporting/Protective — könnten farbcodiert sein | Leicht — Sage für Core, Sand für Supporting, Rose für Protective |
| **Navigation (aktiver Zustand)** | Zeigt "Du bist hier" | Mittel — Sage-Unterlegung oder Sage-Akzent |
| **Empty States** | "Noch nichts hinterlegt" — einladend statt leer | Leicht — Sage-Tönung im Hintergrund |
| **Erfolgs-Zustände** | Bereits teilweise vorhanden, aber zu klein | Bestehend erweitern |
| **Kapitel-Fortschrittsbalken** | Grün = gewachsen, nicht nur "erledigt" | Sage statt Sand für höhere Fortschritte |

### Wo Grün NICHT hingehört
- Error States (Rose bleibt)
- Warnungen (Gold bleibt)
- Informationshinweise (Sky bleibt)
- Haupttext (Text bleibt dunkel)
- CTA-Buttons (Gold/Sand bleibt für primäre Actions)

---

## 3. Welche Grüntöne existieren bereits?

### Im Code

| Token | Hex | RGB | Charakter |
|-------|-----|-----|-----------|
| `sage` | `#7B9E8C` | 123, 158, 140 | Salbei — mittel, gedämpft, natürlich |

Das ist der einzige Grünton. Er wird in zwei Rollen verwendet:
1. **Funktional:** Erfolgsfarbe (✓, Save-Buttons, Eligibility)
2. **Atmosphärisch:** Malojapass-Berge (3 Schichten, subtil)

### Abgeleitete Sage-Töne (bereits im Code als Hex-Suffix)

| Variante | Wie erzeugt | Vorkommen | Wirkung |
|----------|------------|-----------|---------|
| `palette.sage + '10'` | 6% Opacity | 2× | Kaum sichtbar |
| `palette.sage + '15'` | 8% Opacity | 1× | Sehr subtil |
| `palette.sage + '20'` | 12% Opacity | 1× | Hauch von Grün |
| `palette.sage + '22'` | 13% Opacity | 3× | Leichtes Grün |
| `palette.sage + '30'` | 19% Opacity | 2× | Erkennbar grün |

---

## 4. Welche alten Ordnung-&-Ruhe-Grüntöne sollten zurückgeholt werden?

### Vorschlag: Eine Sage-Familie definieren

Die aktuelle Palette hat einen einzigen Sage-Ton. Für atmosphärische Flächen braucht es eine Familie — wie bei den Beige-Tönen (bg → up → surface → top).

| Neuer Token | Hex | Charakter | Verwendung |
|-------------|-----|-----------|------------|
| `sage-mist` | `#E8F0EC` | Nebel über Alpwiese — fast weiss, Grün nur erahnbar | Grosse Flächen: Kapitelheader, Sektionshintergründe |
| `sage-dew` | `#D4E5DB` | Morgentau auf Gras — zarter als Sage, flächentauglich | Mittlere Flächen: MirrorCards, Empty States |
| `sage` | `#7B9E8C` | Salbei — bleibt wie er ist | Akzente, Icons, Linien, kleine Texte |
| `sage-deep` | `#5C7D6C` | Tannenschatten — dunkler, für Text auf hellen Flächen | Text auf sage-mist/sage-dew Hintergründen |
| `sage-dark` | `#3D5C4C` | Moosiger Wald — für Dark Mode Varianten | Dark Mode Sage-Flächen |

### Wie sich das anfühlen würde

**Heute:** Beiger Hintergrund → weisse Karte → beiger Hintergrund → weisse Karte
**Morgen:** Beiger Hintergrund → sage-mist Kapitelheader → weisse Karte auf sage-dew → beiger Übergang

Das Grün würde kommen und gehen wie die Landschaft auf einer Passwanderung. Nicht überall gleich. Nicht überall gleich stark. Sondern rhythmisch — wie Wiese, Fels, Wiese, Wald.

---

## 5. Wie kann Grün eingesetzt werden, ohne dass es laut wird?

### Drei Regeln

**Regel 1: Grün als Atmosphäre, nicht als Signal**

Sage ist heute eine Signalfarbe (✓ = Erfolg). Das muss bleiben. Aber die neuen sage-mist und sage-dew Töne sind keine Signale — sie sind Atmosphäre. Wie die Farbe der Luft auf einer Alp. Man bemerkt sie, ohne sie zu benennen.

**Regel 2: Opacity statt Sättigung**

Niemals `#00FF00`. Niemals gesättigtes Grün. Stattdessen: `sage` bei sehr niedriger Opacity (5-15%) für Flächen. Das erzeugt einen Grünschimmer, kein Grünschreien.

**Regel 3: Nur in Kombination mit Beige**

Grün allein wirkt wie ein anderes Produkt. Grün auf Beige wirkt wie Natur. Die Flächen-Grüntöne (sage-mist, sage-dew) sind bewusst so warm gemischt, dass sie zum Beige passen — sie haben einen Gelbanteil, der sie erdig hält.

### Dosierung nach Bereich

| Bereich | Grün-Intensität | Metapher |
|---------|----------------|----------|
| Dashboard | Leicht (Berge sind schon grün) | Die weite Sicht |
| Kapitelheader | Mittel — sage-mist | Die Station auf dem Weg |
| Formular-Sektionen | Sehr leicht — Hauch | Die Alpwiese zwischen den Felsen |
| MirrorCards | Leicht — sage-dew Border oder Tint | Der Spiegel im Bergsee |
| Empty States | Leicht — sage-mist | Die offene Wiese |
| Erfolg | Mittel — sage (wie bisher) | Das Edelweiss |
| Navigation | Sehr leicht — sage-mist für aktiv | Der Wegweiser |

---

## 6. Welche Bereiche brauchen Naturgefühl?

### Die drei Ebenen von "Natur" in Maloja

**Ebene 1: Farbe**
- Sage-Familie einführen (mist, dew, sage, deep)
- Beige bleibt Basis, Sage wird Gegengewicht
- Rhythmischer Wechsel zwischen Beige und Sage

**Ebene 2: Materialität**
- Schatten aktivieren → Tiefe wie in einem Tal
- Subtile Transparenzen → Nebel-Qualität
- Weichere Übergänge zwischen Bereichen → keine harten Kanten

**Ebene 3: Metapher**
- Kapitelheader: kleiner Bezug zum Pass (wo bin ich auf dem Weg?)
- Sektionen: wie Stationen einer Wanderung — Rast, Aussicht, Weg
- Fortschritt: wie Vegetation — erst karg, dann grüner, dann blühend

### Bereiche nach Naturgefühl-Dringlichkeit

| Dringlichkeit | Bereich | Was fehlt |
|---------------|---------|-----------|
| **Hoch** | Kapitelheader | Kein Bezug zum Pass, kein Grün, kein Atemraum |
| **Hoch** | Schwere Kapitel (Schulden, Sozialhilfe, Behörden) | Kälteste Bereiche der App — brauchen am meisten Wärme |
| **Mittel** | Formular-Sektionen | Zu dicht, zu uniform, kein Rhythmus |
| **Mittel** | MirrorCards | Sollten sich "grüner" anfühlen — sie zeigen dein Leben |
| **Niedrig** | Navigation | Kleiner Sage-Akzent für aktiven Zustand genügt |
| **Niedrig** | Footer/Legal | Funktional, braucht wenig Atmosphäre |

---

## 7. Wie bleiben die Berge zentral?

### Die Berge sind das Herz — sie dürfen nie verdrängt werden

**Aktueller Zustand:** Die Berge existieren nur auf dem Dashboard. Drei SVG-Schichten, Trail, 7 Stationen, Easter Eggs. Das ist das emotional stärkste Element der gesamten App.

### Strategie: Die Berge nicht kopieren — sie ausstrahlen lassen

Die Berge sollen nicht in jedem Kapitel wiederholt werden. Stattdessen soll ihre Wirkung in die Kapitel ausstrahlen:

**1. Farb-Echo**
Die Sage-Töne der Berge (opacity 0.07-0.30) tauchen als Kapitelheader-Hintergrund wieder auf. Gleiche Farbe, gleiche Subtilität. Man erkennt unbewusst: das gehört zum selben Ort.

**2. Höhen-Metapher**
Ein subtiles Element im Kapitelheader (oder als Mini-Breadcrumb) zeigt: "Du bist bei Station 3 auf dem Pass." Kein volles SVG — nur eine zarte Linie oder ein Punkt auf einer schematischen Passkurve.

**3. Die Berge als Rückkehr**
Wenn man ein Kapitel schliesst und zum Dashboard zurückkehrt, sieht man die Berge wieder. Dieser Moment — "Ich bin zurück auf dem Pass, mit weiter Sicht" — ist der emotionale Anker. Er wird stärker, wenn die Kapitel selbst anders aussehen als das Dashboard. Der Kontrast macht die Berge wertvoller.

### Was die Berge NICHT brauchen
- Nicht in Kapitel dupliziert werden (dann verlieren sie ihre Besonderheit)
- Nicht animiert werden (sie sind ruhig wie echte Berge)
- Nicht mit Badges/Zahlen versehen werden (Anti-Gamification)
- Nicht ersetzt werden durch andere Metaphern

---

## Zusammenfassung: Die Grün-Beige-Formel

```
Maloja Plana Farbwelt =
  Beige-Basis (bg, up, surface)         → 70% der Fläche
  + Sage-Atmosphäre (mist, dew)         → 20% der Fläche
  + Akzente (sage, gold, sand, rose)    → 10% der Fläche
  + Berge als Sage-Silhouette           → Dashboard-Anker
```

**Heute:** 95% Beige, 4% Weiss, 1% Akzent
**Ziel:** 70% Beige, 20% Sage-Atmosphäre, 10% Akzent

Der Unterschied klingt klein. Visuell wäre er fundamental.

### Die Grüntöne, die zu Maloja passen

| Natur-Referenz | Hex-Bereich | Charakter |
|----------------|-------------|-----------|
| Alpwiese im Juni | `#E8F0EC` | Hell, frisch, weich |
| Salbei | `#7B9E8C` | Gedämpft, aromatisch, warm |
| Moos auf Fels | `#5C7D6C` | Dunkel, feucht, erdverbunden |
| Tannenschatten | `#3D5C4C` | Tief, still, schützend |
| Engadiner See | `#7B9E8C` bei 15% | Transparent, spiegelnd |

### Was NICHT zu Maloja passt

| Vermeiden | Warum |
|-----------|-------|
| Neon-Grün (#00FF00) | Schreierisch, digital, kalt |
| Mint (#98FB98) | Zu süss, zu "App", nicht schweizerisch |
| Lime (#32CD32) | Zu sauer, zu energetisch |
| Teal (#008080) | Zu korporativ, zu tech |
| Forest (#228B22) | Zu gesättigt, zu laut |
| Emerald (#50C878) | Zu edelstein-haft, zu poliert |

**Maloja-Grün ist niemals rein. Es hat immer Grau, Braun oder Gold beigemischt. Wie echtes Gras auf 1800 Metern Höhe.**
