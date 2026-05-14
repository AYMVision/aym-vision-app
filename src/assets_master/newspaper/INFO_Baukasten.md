# Baukasten-Anleitung: Artikel & Audio anlegen

Alles, was du brauchst, um in der Amy-App neue Zeitungsartikel oder Audio-Beiträge zu erstellen.

---

## Übersicht: Was gehört wohin?

| Was | Wo |
|---|---|
| Artikel-Text (Markdown) | `public/media/newspaper/articles/{bonusId}/article.de.md` |
| Quell-Bilder (PNG) | `src/assets_master/newspaper/articles/{bonusId}/` |
| Fertige Bilder (WebP/AVIF) | `public/media/newspaper/articles/{bonusId}/` (via Build-Script) |
| Audio-Datei | `public/media/newspaper/articles/{bonusId}/audio.mp3` |
| Eintrag für Freischaltung | `src/bonus/bonusIndex.ts` |
| Automatisch generierte Meta | `public/articles-meta.json` (via `npm run generate:meta`) |

---

## Schritt 1 – bonusId vergeben

Die `bonusId` ist der eindeutige Schlüssel. Konventionen:

| Typ | Muster | Beispiel |
|---|---|---|
| Chioma Weekly / aktuelle News | `chioma-news-{thema}` | `chioma-news-ki-hausaufgaben` |
| Story-gebundener Artikel | `tip-{charakter}-{thema}` | `tip-carlos-geodaten` |
| Story-gebundener Audio-Beitrag | `{charakter}-news-{thema}` | `chatrules-chioma-dominik` |
| Interview / Reportage | `article-{personen}-{thema}` | `article-jonas-tom-offline-inseln` |

**Wichtig:** `bonusId` muss einmalig sein und darf sich nie ändern (wird in Savegames gespeichert).

---

## Schritt 2 – Ordner anlegen

```
public/media/newspaper/articles/{bonusId}/
src/assets_master/newspaper/articles/{bonusId}/
```

In `assets_master` kommen die Quell-PNGs rein (werden nicht deployed, nur als Quelle für das Build-Script).

---

## Schritt 3 – Artikel schreiben (`article.de.md`)

### Frontmatter (Pflichtfelder)

```markdown
---
title: Der Titel des Artikels
description: Ein kurzer Teaser-Text (1–2 Sätze, erscheint in der Übersicht)
author: Chioma
date: 2026-05-14
topicTags: ["reflect", "infoCheck"]
---
```

### Verfügbare Topic-Tags

Wähle **mindestens einen**, maximal zwei bis drei:

| Tag | Bedeutung | Wann nutzen |
|---|---|---|
| `infoCheck` | Infos clever checken | Fake News, Quellen prüfen, Clickbait |
| `teamTalk` | Gemeinsam reden & handeln | Gruppenregeln, Streit klären, Respekt |
| `create` | Selbst kreativ werden | Podcast, Schülerzeitung, eigene Posts |
| `safe` | Sicher im Netz | Privatsphäre, Passwörter, Schutz |
| `solve` | Schlau Lösungen finden | Konflikte, Probleme im Netz |
| `reflect` | Nachdenken & verstehen | Eigene Gefühle, Medienwirkung |
| `fair` | Fair sein & Haltung zeigen | Respekt, Mobbing, Zivilcourage |

---

## Schritt 4 – Markdown-Baukasten

### Überschriften

```markdown
# Haupttitel (H1 – wird als Titelkarte gerendert)
## Abschnitt (H2 – mit Teal-Unterstrich)
```

### Absätze & Fettdruck

```markdown
Das ist ein normaler Absatz.

**Fett** funktioniert inline in Absätzen und Listenpunkten.
```

### Aufzählung (einfache Bullet-Liste)

```markdown
- Punkt 1
- Punkt 2
- **Fett in Listenpunkten** geht auch
```

Wird als `<ul>` mit Bullet-Punkten gerendert (NICHT als Merkliste).

### Merkliste / Checklist

```markdown
[[checklist title=Merkliste]]
- Erster Punkt
- Zweiter Punkt
[[/checklist]]
```

Wird als grün-gerahmte Box mit Häkchen gerendert.

### Callout-Box

```markdown
[[callout kind=info title=Info]]
Text hier
[[/callout]]

[[callout kind=tip title=Tipp]]
Text hier
[[/callout]]

[[callout kind=warn title=Aufgepasst]]
Text hier
[[/callout]]
```

`kind` bestimmt die Farbe: `info` = Blau, `tip` = Grün, `warn` = Amber/Orange.

### Zitat

```markdown
> Das ist ein Zitat.
```

Wird als teal-gerahmte Zitatbox gerendert.

### Bild einbinden

```markdown
[[img src=media/newspaper/articles/{bonusId}/mein-bild alt=Bildbeschreibung caption=Optionale Bildunterschrift]]
```

**Pfadkonvention für Bilder:** Ohne Größen-Suffix und ohne Dateiendung. Das Build-Script erzeugt `-512.webp`, `-512.avif`, `-1024.webp`, `-1024.avif`. Der Renderer sucht automatisch alle vier Varianten.

Beispiel:
```markdown
[[img src=media/newspaper/articles/tip-carlos-geodaten/geodaten-karte]]
```

### Galerie (mehrere Bilder)

```markdown
[[gallery]]
media/newspaper/articles/{bonusId}/bild-1 | Alt-Text | Bildunterschrift
media/newspaper/articles/{bonusId}/bild-2 | Alt-Text 2
[[/gallery]]
```

### Aufklappbarer Details-Block

```markdown
[[details title=Das steckt dahinter]]
Inhalt, der erst nach Antippen sichtbar wird.
[[/details]]
```

### Trennlinie (wird nur als Absatz-Flush genutzt, nicht sichtbar)

```markdown
---
```

---

## Schritt 5 – Bilder aufbereiten

1. Quell-PNGs in `src/assets_master/newspaper/articles/{bonusId}/` ablegen
2. Cover-Bild benennen als `cover.png` (mind. 1024×1024px)
3. Body-Bilder nach Thema benennen, z. B. `geodaten-karte.png`
4. Build-Script ausführen:

```bash
npm run build:images
```

Das Script erzeugt automatisch alle Größen (`-512`, `-1024`) in WebP und AVIF unter `public/media/...`.

---

## Schritt 6 – bonusIndex.ts eintragen

Datei: `src/bonus/bonusIndex.ts` → Block `OTHER_BONUS_ITEMS`

### Nur-Text-Artikel

```ts
{
  bonusId: 'mein-artikel',
  category: 'newspaper',
  mediaType: 'text',
  bodyKind: 'md',
  bodySrc: 'media/newspaper/articles/mein-artikel/article',
  coverImage: 'media/newspaper/articles/mein-artikel/cover-1024.webp',
  released: true,
  unlockedBy: { type: 'chapter', id: 's1e02c05' },
  order: 55,
},
```

### Artikel mit Audio

```ts
{
  bonusId: 'mein-audio-artikel',
  category: 'newspaper',
  mediaType: 'audio',
  bodyKind: 'md',
  bodySrc: 'media/newspaper/articles/mein-audio-artikel/article',
  coverImage: 'media/newspaper/articles/mein-audio-artikel/cover-1024.webp',
  audioSrc: 'media/newspaper/articles/mein-audio-artikel/audio.mp3',
  released: true,
  unlockedBy: { type: 'chapter', id: 's1e02c07' },
  order: 56,
},
```

### Nur Audio (ohne Artikel-Text)

```ts
{
  bonusId: 'mein-nur-audio',
  category: 'newspaper',
  mediaType: 'audio',
  coverImage: 'media/newspaper/articles/mein-nur-audio/cover-512.webp',
  audioSrc: 'media/newspaper/articles/mein-nur-audio/audio.mp3',
  released: true,
  unlockedBy: { type: 'chapter', id: 's1e01c07' },
  order: 43,
},
```

### Aktuelle News / Chioma Weekly (immer frei, keine Story-Bindung)

```ts
{
  bonusId: 'chioma-news-mein-thema',
  category: 'newspaper',
  released: true,
  order: 9,
  mediaType: 'text',            // oder 'audio' wenn Audio dabei
  coverImage: 'media/newspaper/articles/chioma-news-mein-thema/cover-1024.webp',
  bodySrc: 'media/newspaper/articles/chioma-news-mein-thema/article',
  bodyKind: 'md',
  unlockedBy: { type: 'chapter', id: 's1e01c01' },  // freigeschaltet ab Kapitel 1
},
```

> **Hinweis:** Artikel mit `bonusId` die `chioma-news-`, `current-news-` oder `weekly-news-` enthält, sind im Code **immer zugänglich** (Bypass in `NewspaperArticle.tsx`). Der `unlockedBy`-Eintrag schadet nicht, hat aber keine Wirkung.

---

## Schritt 7 – `unlockedBy` richtig wählen

| Wann freischalten | `unlockedBy` |
|---|---|
| Sofort / immer frei | `{ type: 'chapter', id: 's1e01c01' }` |
| Nach bestimmtem Kapitel | `{ type: 'chapter', id: 's1e02c05' }` |
| Nach einem Story-Marker | `{ type: 'marker', id: 's1e02c07-tip-carlos-audio-howto' }` |
| Nie freischalten (noch nicht fertig) | `{ type: 'chapter', id: '__never__' }` |

**Chapter vs. Marker:**
- `chapter` → freigeschaltet, sobald das Kapitel abgeschlossen ist
- `marker` → freigeschaltet, sobald der Marker im Story-Code gefeuert wird (kann innerhalb eines Kapitels passieren)

---

## Schritt 8 – `order` vergeben

| Bereich | Order-Nummern |
|---|---|
| Chioma Weekly / aktuelle News | 1–20 |
| Story-gebundene Audio-Beiträge | 40–49 |
| Story-gebundene Artikel (Tips) | 50–59 |
| Tagebücher | 60+ |

---

## Schritt 9 – articles-meta.json aktualisieren

Nach dem Anlegen eines neuen Artikels (oder nach Änderungen am Frontmatter):

```bash
node scripts/generate-articles-meta.js
```

Das Script liest alle `article.*.md` in `public/media/newspaper/articles/` und schreibt `public/articles-meta.json`. Diese Datei wird in der Zeitungsübersicht für Titel und Teaser genutzt.

---

## Checkliste: Neuen Artikel anlegen

- [ ] `bonusId` vergeben (einmalig, unveränderlich)
- [ ] Ordner in `public/media/newspaper/articles/{bonusId}/` anlegen
- [ ] Ordner in `src/assets_master/newspaper/articles/{bonusId}/` anlegen
- [ ] `article.de.md` mit Frontmatter + Inhalt erstellen
- [ ] Quell-PNG als `cover.png` in `assets_master` ablegen
- [ ] `npm run build:images` ausführen (erzeugt WebP/AVIF)
- [ ] Eintrag in `bonusIndex.ts` hinzufügen
- [ ] `node scripts/generate-articles-meta.js` ausführen
- [ ] Im AMY-DEV-Modus testen

## Checkliste: Audio-Beitrag hinzufügen

- [ ] MP3 als `audio.mp3` direkt in `public/media/newspaper/articles/{bonusId}/` ablegen (wird nicht über Build-Script verarbeitet)
- [ ] `mediaType: 'audio'` und `audioSrc` im bonusIndex setzen
- [ ] Artikel-Text ist optional – wenn vorhanden, zeigt die App Audio-Player + Text
- [ ] Ohne `bodySrc`: nur Audio-Player wird angezeigt
