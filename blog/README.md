# Amy Surfwing Blog

Astro-Blog für Eltern und Pädagogen. Läuft unabhängig von der React-App.

---

## Lokal starten

```bash
cd blog
npm install
npm run dev
```

Dann im Browser: **http://localhost:4321**

---

## Neuen Artikel schreiben

1. Neue Datei in `src/content/posts/` anlegen:
   ```
   YYYY-MM-DD-kurzer-titel.md
   ```
   Beispiel: `2026-06-01-screen-time-tipps.md`

2. Datei mit diesem Kopf beginnen:
   ```markdown
   ---
   title: "Dein Artikel-Titel"
   description: "Kurze Beschreibung, 1–2 Sätze. Wird auf der Übersichtsseite und bei Google angezeigt."
   date: 2026-06-01
   author: "Dein Name"
   tags: ["Für Eltern", "Digitale Kompetenz"]
   image: "/bilder/mein-artikel.webp"   ← optional
   draft: false                          ← auf true setzen = Entwurf, nicht sichtbar
   ---

   Hier beginnt dein Artikeltext...
   ```

3. Artikel schreiben in **Markdown** (wie dieser Text hier).

---

## Bilder einbinden

Bilder in `blog/public/bilder/` ablegen, dann im Frontmatter:
```markdown
image: "/bilder/dateiname.webp"
```

Im Artikeltext:
```markdown
![Alt-Text](/bilder/dateiname.webp)
```

---

## Markdown-Grundregeln

```markdown
## Großer Abschnitt
### Kleinerer Abschnitt

Normaler Absatz. Einfach schreiben.

**Fett**  _Kursiv_

- Aufzählung
- Punkt 2

> Zitat oder Hervorhebung

[Linktext](https://amysurfwing.de)
```

---

## Entwurf vs. veröffentlicht

Im Frontmatter `draft: true` → Artikel erscheint nicht auf der Seite, nur lokal sichtbar.  
Auf `draft: false` setzen (oder ganz weglassen) → Artikel ist sichtbar.

---

## Blog live schalten (wenn du so weit bist)

In `astro.config.mjs` die auskommentierte Zeile aktivieren:
```js
base: '/blog',
```

Dann in der Deploy-Config (Netlify/Vercel) den `blog/`-Ordner als zweites Projekt hinzufügen.  
Frag einfach, ich erkläre die genauen Schritte wenn du bereit bist.
