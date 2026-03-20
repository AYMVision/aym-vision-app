# Artikel-Baukasten – Anleitung

So schreibe ich neue Artikel:

Ich kann ganz normal Markdown schreiben:
- Überschriften mit # oder ##
- Listen mit -
- Absätze einfach untereinander

---

Bilder einfügen:

[[img src="media/newspaper/articles/ARTIKEL-ID/bildname" alt="Beschreibung" caption="Optionaler Text"]]

Wichtig:
Ich schreibe nur den Basisnamen.
Die App lädt automatisch:
- bildname-512.webp
- bildname-1024.webp
(optional auch .avif)

---

Text ausklappbar machen:

[[details title="Titel hier"]]
Hier kommt der Text hinein.
Auch Listen sind möglich:
- Punkt 1
- Punkt 2
[[/details]]

---

Info-Box einfügen:

[[callout kind="info"]]
Neutraler Hinweis
[[/callout]]

[[callout kind="tip"]]
💡 Tipp
[[/callout]]

[[callout kind="warn"]]
⚠️ Warnung
[[/callout]]

---

Bilder-Galerie:

[[gallery]]
[[img src="media/newspaper/articles/ARTIKEL-ID/bild1" alt="..."]]
[[img src="media/newspaper/articles/ARTIKEL-ID/bild2" alt="..."]]
[[img src="media/newspaper/articles/ARTIKEL-ID/bild3" alt="..."]]
[[/gallery]]

---

Regeln:

- Artikelbilder brauchen nur 512 und 1024 Größe.
- 256 wird für Artikel nicht benötigt.
- Immer saubere Ordnerstruktur pro Artikel.
- Keine HTML-Tags verwenden.
- Keine Sonderzeichen in Dateinamen.

Das System funktioniert komplett ohne Backend.
Alles liegt nur in /public.
