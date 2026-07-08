# Backend für mich — der ruhige Spickzettel

Kein Fachchinesisch. Nur das Bild im Kopf, damit wir zusammen sicher weiterbauen können.
Nichts hier ist gefährlich.

Zwei Dinge vorweg, damit du dich orientierst:

- Die **live geschaltete App** (malojaplana.ch) hat **kein** Backend. Sie ist ein Heft in
  deiner eigenen Schublade zuhause — die Daten verlassen dein Gerät nicht.
- Das **Haus selbst haben wir aber schon im Rohbau gebaut** (Sessions #28–#29): Login +
  verschlüsseltes Backup, „Phase 1". Es liegt fertig-verkabelt in einem **privaten Repo
  `maloja-server`** auf GitHub — aber es ist noch **nicht an die App angeschlossen** und
  **nicht live**. Es wartet.

## Das Bild im Kopf

Stell dir ein kleines Haus vor, das du beim Hoster mietest. Darin stehen vier Dinge:

- **der Hauswart** = `Node.js` — der Angestellte, der Anfragen entgegennimmt, Sachen
  holt und bringt. Er spricht dieselbe Sprache wie deine App (JavaScript).
- **der Aktenschrank** = `MariaDB` — der ordentliche Schrank mit beschrifteten
  Schubladen, wo die Daten liegen. Der Hauswart redet mit ihm in der Ordnungssprache `SQL`
  („gib mir Annas Ordner", „leg das in Annas Schublade").
- **die Tür mit Schloss** = der **Login** — hier wird geprüft, wer rein darf.
- **der Bauplatz** = `Jelastic` (bei Infomaniak) — das Grundstück samt Strom und Wasser,
  wo das Haus wirklich steht und läuft. Jelastic stellt dir den Server-Rechner und die
  MariaDB bereit; du stellst nur den Hauswart (deinen Code) rein.

## Die vier Möbelstücke

| Wort | In einfach | Wozu |
|---|---|---|
| **Node.js** | der Hauswart | nimmt Anfragen an, antwortet |
| **MariaDB** | der Aktenschrank | speichert die Daten dauerhaft |
| **Login** | Tür mit Schloss | lässt nur die richtige Person rein |
| **Jelastic** | der Bauplatz beim Hoster | wo Haus + Schrank echt laufen |

**Nicht verwechseln:** *Jelastic* (Bauplatz, brauchst du) ist nicht *Elasticsearch*
(ein superschneller Such-Bibliothekar). Elasticsearch braucht Maloja fast sicher nie —
jede Person sieht nur ihre paar Ordner, da reicht der normale Schrank. Nicht kaufen, was
man nicht braucht.

## Die zwei Fragen am Schloss (das Herzstück)

Am Login passieren **zwei** Fragen. Fast alle können die erste, viele vergessen die zweite:

1. **„Bist du wirklich du?"** — *Authentication*. Der Schlüssel passt (Passwort, SwissID,
   Fingerabdruck).
2. **„Und was darfst du hier drin?"** — *Authorization*. Auch wenn du im Haus bist:
   du darfst **nur deine eigene Schublade** öffnen, nicht die vom Nachbarn.

Das `Bestellung 42 → 43`-Beispiel: reingekommen bist du, aber niemand prüft, ob
Schublade 43 *dir* gehört. Diese Prüfung muss **von der ersten Wand an** eingebaut sein,
nicht nachträglich. (Ausführlich: `docs/security/CHECKLISTE.md`.)

## Wo ist die Werkbank?

Ganz wichtige Frage — und zuerst ein Wort geradegerückt, damit nichts durcheinandergeht:

> **Werkbank** = der `dev`-Branch, die Arbeitsstation *innerhalb eines* Projekts
> (so steht's im Git-Spickzettel). Das bleibt so.

Neu ist: Du hast jetzt **zwei Projekte** — und *jedes* hat seine eigene Werkbank (`dev`),
Reinversion (`main`) und seinen Platz im Cloud-Safe. Wie zwei Rezeptbücher.

- **Projekt 1: die App (Frontend)** = dieses Repo (`maloja plana`). Steht auf deinem
  Computer, hier arbeiten wir. Werkbank = `dev`.
- **Projekt 2: der Server (Backend)** = das private Repo `steblerstudios/maloja-server`
  auf GitHub. Dort liegt der fertige Rohbau (Phase 1). **Aber:** dieses Projekt ist gerade
  **nicht auf deinen Computer geholt** — es liegt nur im Cloud-Safe. Auf deiner Platte
  steht bloss ein leerer `server/`-Ordner (nur `.env` + `node_modules`, kein Code —
  Überbleibsel vom Umzug). Der ist nicht die Werkstatt; er ist eine leere Hülle.

Also: Der Rohbau existiert, steht aber im Cloud-Safe, nicht auf deinem Schreibtisch.
Wenn wir weiterbauen, ist der **allererste Schritt**, das Server-Projekt auf deinen
Computer zu holen — `maloja-server` in einen eigenen Ordner *neben* die App klonen.
Erst dann hat auch dieses Projekt seine eigene Werkbank (`dev`) bei dir.

Was am Rohbau noch fehlt, bis das Haus wirklich benutzbar ist: (1) die App ans Backend
**anschliessen** (Frontend-Verkabelung), (2) ein **Sicherheits-Review**, (3) der Bauplatz
`Jelastic` bei Infomaniak **einrichten** (machst du selbst, wie beim FTP-Deploy). Erst
dann geht es live.

## Was heute schon sicher ist

- **Geheimnisse** (Passwörter, Schlüssel) stehen **nie** im Code — nur lokal in `.env`
  (nicht im Git), in Jelastic und in GitHub-Secrets. Geprüft: kein `.env` im Git.
- Der öffentliche Code ist **nur die App**. Das Backend lebt privat in `maloja-server`.
  Beim Umzug ins private Repo wurde geprüft: es wurde nie ein Geheimnis committet.
- Solange die App nicht ans Haus angeschlossen ist, verlassen deine Daten dein Gerät
  nicht — das ist die Seele von Maloja und der stärkste Datenschutz, den es gibt.
- Der Rohbau ist bewusst so gebaut, dass der Server **nur Chiffrat** sieht
  (Zero-Knowledge): selbst wer ins Haus einbräche, fände nur unlesbare Kisten.

## Zum Ruhigbleiben

- Ein Backend live zu schalten ist ein **Grundsatzentscheid**, kein schneller Klick. Der
  Rohbau steht, aber nichts geht live ohne bewussten gemeinsamen Schritt + Sicherheits-Review.
- Wir bauen **Stück für Stück** und immer mit der Nachbar-Schublade-Regel im Kopf.
- Keine Frage ist dumm. Zu fragen „wo ist die Werkbank?" ist genau richtig, bevor man
  anfängt zu schrauben.
