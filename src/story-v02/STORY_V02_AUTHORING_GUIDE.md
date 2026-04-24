# Story V02 – Authoring- und Code-Regeln

Diese Anleitung ist die verbindliche Grundlage für neue Story-Episoden in der neuen Step-Architektur.

---

## 1. Grundprinzip

Neue Storys werden **nicht** mehr als reine `messages[]` mit Frage-/Tipp-/Stop-Logik gebaut.

Neue Storys bestehen aus:

- `chapters[]`
- jedes Chapter hat `steps[]`

Ein Step ist eine eigenständige fachliche Einheit.

---

## 2. Zulässige Step-Typen

### `story`
Normale Story-Nachrichten.
Nutzen für:
- Klassenchat
- Privatchat
- Systemnachrichten
- Bilder
- Audio
- Bonus-Link-Nachrichten

### `input`
Leichte Beteiligung ohne Messung.
Nutzen für:
- freie kurze Eingaben
- optionale Antworten
- einfache Choice-Eingaben ohne Bewertung

### `item`
Verdeckte Wirkungsmessung (Standard).
Pflicht:
- genau 4 Optionen
- jede Option hat `score: 0 | 1 | 2 | 3`
- Step braucht `dimension`
- Step braucht `indicatorId`

#### Variante: `item` mit `selectionMode: 'multiple'` — Unbewertete Mehrfachwahl

Für didaktische Fragen ohne Wirkungsmessung: Nutzer wählt mehrere Optionen, sieht nach dem Abschicken welche richtig/falsch waren.

Pflicht bei `selectionMode: 'multiple'`:
- `selectionMode: 'multiple'`
- `dimension` und `indicatorId` (Pflichtfelder bleiben, aber werden **nicht** für Scoring genutzt)
- 2–8 Optionen (keine Tuple-Einschränkung)
- jede Option hat `score: 0 | 1` (1 = richtig, 0 = falsch)

Optional:
- `minSelections` (Default: 1) — Mindestanzahl Auswahl vor Abschicken
- `maxSelections` (Default: alle) — maximale Anzahl Auswahl
- `helperText` — kurzer Hinweis unter dem Prompt (z. B. "Du kannst mehrere auswählen.")

Empfohlene Kombination:
```
story -> item (selectionMode: 'multiple') -> amy_feedback -> story
```

Beispiel:
```ts
{
  id: 's1e01c07_item_outdated_tip',
  type: 'item',
  topicIds: ['info-check'],
  prompt: 'Woran hätte Yasmin merken können, dass der Tipp nicht mehr stimmt?',
  dimension: 'judgement',
  indicatorId: 'information_classify',
  selectionMode: 'multiple',
  minSelections: 1,
  maxSelections: 6,
  helperText: 'Du kannst mehrere Antwortoptionen auswählen.',
  options: [
    { id: 'a', text: 'Sie hätte das Datum des Artikels prüfen können.', score: 1 },
    { id: 'b', text: 'Sie hätte weitere Quellen prüfen können.', score: 1 },
    { id: 'c', text: 'Sie hätte einfach vertraut.', score: 0 },
  ],
},
{
  id: 's1e01c07_amy_feedback',
  type: 'amy_feedback',
  sourceStepId: 's1e01c07_item_outdated_tip',
},
```

Verhalten in der App:
- Nutzer wählt per Checkbox, klickt "Abschicken"
- Jede gewählte Option zeigt grün (richtig) oder rot (falsch)
- "Weiter" führt zum nächsten Step
- Im Transkript bleibt die Auswahl mit Richtig/Falsch-Markierung sichtbar

**Wichtig:** Unbewertete Mehrfachwahl speichert keinen Score im Profil. Die `dimension`/`indicatorId` sind Pflichtfelder (TypeScript), haben aber bei `selectionMode: 'multiple'` keine Auswirkung auf die Wirkungsmessung.

### `amy_feedback`
Sichtbare Reaktion auf ein `item`.
Kein eigener Score.

### `reflection`
Reflexion ohne Messung.
Varianten:
- `guided_choice`
- `open_text`

Keine Scores, keine Dimension, kein Indikator.

### `amy_reaction`
Sichtbare Reaktion auf eine Reflection.
Kann statisch oder später generiert sein.

### `challenge`
Kurzer Impuls für Alltag oder Weiterdenken.
Keine Bewertung.

---

## 3. Wichtige Trennung

### `item`
ist **immer** Messung.

### `reflection`
ist **nie** Messung.

### `input`
ist **nie** Messung.

---

## 4. i18n-Regel

Alle sichtbaren Texte müssen über Keys laufen.

Erlaubt:
- `promptKey`
- `textKey`
- `titleKey`
- `labelKey`
- `descriptionKey`
- `placeholderKey`

Nicht erlaubt:
- sichtbare neue UI-Texte direkt hart in Story-Dateien
- sichtbare neue Labels direkt hart in Meta-Dateien

Technische IDs dürfen hart sein:
- `perspective`
- `take_responsibility`
- `s1e01c01_item_yasmin_feeling`

---

## 5. Pflichtregeln für `item`

### Standard-`item` (Wirkungsmessung)

Ist nur gültig, wenn:

- `id` vorhanden
- `type: 'item'`
- `promptKey` oder `prompt` vorhanden
- `dimension` vorhanden
- `indicatorId` vorhanden
- genau 4 Optionen vorhanden
- jede Option hat:
  - `id`
  - `textKey` oder `text`
  - `score` (0 | 1 | 2 | 3)

Optional:
- `reaction`

### Mehrfachwahl-`item` (`selectionMode: 'multiple'`)

Ist nur gültig, wenn:

- `id` vorhanden
- `type: 'item'`
- `selectionMode: 'multiple'`
- `promptKey` oder `prompt` vorhanden
- `dimension` vorhanden (Pflichtfeld, kein Scoring-Effekt)
- `indicatorId` vorhanden (Pflichtfeld, kein Scoring-Effekt)
- 2–8 Optionen vorhanden
- jede Option hat:
  - `id`
  - `textKey` oder `text`
  - `score` (0 = falsch, 1 = richtig)

Optional:
- `minSelections`
- `maxSelections`
- `helperText`

---

## 6. Pflichtregeln für `reflection`

Eine `reflection` ist nur gültig, wenn:

- `id` vorhanden
- `type: 'reflection'`
- `promptKey` vorhanden
- `reflectionKind` vorhanden
- `storeResponse: true`

Bei `guided_choice`:
- `choices` vorhanden

Bei `open_text`:
- optional `placeholderKey`
- optional `maxLength`
- optional `useRunAmy: true`

Nie erlaubt:
- `score`
- `dimension`
- `indicatorId`

---

## 7. Pflichtregeln für `input`

Ein `input` ist nur gültig, wenn:

- `id` vorhanden
- `type: 'input'`
- `promptKey` vorhanden
- `mode` vorhanden
- `storeResponse: true`

Optional:
- `required`
- `emptySubmitsAllowed`
- `choices`
- `placeholderKey`
- `maxLength`

Nie erlaubt:
- `score`
- `dimension`
- `indicatorId`

---

## 8. Resume-Regel

Nach Resume dürfen bereits abgeschlossene Interaktionen **nicht** wieder als offene Karten erscheinen.

Sichtbar bleiben:
- Story-Verlauf
- Input-Antworten
- abgeschlossene Item-Auswahl
- Amy-Feedback
- Reflection-Antworten
- Amy-Reaktionen
- Challenge
- Bonus-Link-Nachrichten

Nicht wieder offen erscheinen:
- alte Input-Felder
- alte Item-Buttons
- alte Reflection-Formulare

---

## 9. Wann `runAmy` genutzt wird

`runAmy` ist **nicht** der Kern der Step-Engine.

`runAmy` wird nur genutzt, wenn es fachlich passt, zum Beispiel für:

- freie Reflection (`reflectionKind: 'open_text'`)
- spätere generierte `amy_reaction`

`runAmy` wird **nicht** als Pflicht für `item` genutzt.

---

## 10. Themen und Messung nicht vermischen

### Themen (`topicIds`)
Dienen:
- Lernhistorie
- thematischer Sichtbarkeit
- späterer Auswertung

### Messung (`dimension`, `indicatorId`, `score`)
Dient:
- verdeckter Wirkungsmessung

Diese beiden Ebenen dürfen nicht vermischt werden.

---

## 11. Empfohlene Step-Reihenfolge

Beispiele:

- `story -> input -> story`
- `story -> item -> amy_feedback -> story`
- `story -> item (selectionMode: 'multiple') -> amy_feedback -> story`
- `story -> reflection -> amy_reaction -> story`
- `story -> challenge -> story`

Nicht nötig:
- jeder Chapter braucht alle Step-Typen

---

## 12. Dateistruktur

Neue Inhalte liegen nur in der neuen Story-V02-Struktur.

Beispiel:

- `src/story-v02/content/s1e01/s1e01.c01.ts`
- `src/story-v02/content/s1e01/index.ts`

Nicht in alte `s1e01.ts` zurückbauen.

---

## 13. Namensregeln

### Chapter-ID
Beispiel:
- `s1e01c01`

### Step-ID
Beispiele:
- `s1e01c01_story_intro_private`
- `s1e01c01_input_intro_reply`
- `s1e01c01_item_yasmin_feeling`
- `s1e01c01_reflection_chat_reply`
- `s1e01c01_challenge_small_step`

IDs müssen stabil bleiben.

---

## 14. Content-Regel für sichtbare Amy-Texte

Wenn sichtbare Amy-Texte fest vorgegeben sind:
- per `textKey`

Wenn sichtbare Amy-Texte später generiert werden:
- nur über dafür vorgesehene `reflection` / `amy_reaction`-Logik

Nicht:
- freie Mischlogik direkt in der Story-Seite

---

## 15. Wichtigster Merksatz

Story V02 bedeutet:

- UI weiterverwenden
- Runtime neu ordnen
- Story, Reflexion, Messung, Resume und Rewards sauber trennen
- keine alte Frage-/Tipp-/Stop-Logik mehr mitschleppen