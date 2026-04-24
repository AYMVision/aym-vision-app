# Neue Episode anlegen – Vollständige Anleitung

Alles, was du für eine neue Story-Episode brauchst: Dateistruktur, Builder-API, Step-Typen, Regeln und vollständige Beispiele.

---

## 1. Datei anlegen

### Pfad
```
src/story-v02/content/de/s1e02_de.ts   ← neue Datei (Beispiel für Episode 2)
```

### Datei-Grundstruktur
```ts
import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, audio, typing, divider, amyTip, bonusLink, sysMsg,
  privateChat, classChat, amyChat,
  opt, optSegs, rc,
  S, inp, IT, MIT, AF, GR, OR, AR, CH, C,
} from '../storyBuilder';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

// Kapitel
const c01 = C('s1e02c01', 0, 'Titel', 'Untertitel', [ /* Steps */ ]);
const c02 = C('s1e02c02', 1, 'Titel', 'Untertitel', [ /* Steps */ ]);
// … weitere Kapitel

// Episode-Export
const s1e02De: StoryEpisodeV02 = {
  id: 's1e02',
  seasonId: 's1',
  episodeId: 's1e02',
  courseId: 's1e02',
  chapters: [c01, c02],
};

export default s1e02De;
```

### Episode registrieren
Die neue Episode muss noch in den Content-Index eingetragen werden (dort, wo s1e01 bereits registriert ist).

---

## 2. ID-Namensregeln

Alle IDs müssen **stabil** bleiben – sie werden für Speicherung, Transcript und Resume verwendet.

| Was | Schema | Beispiel |
|---|---|---|
| Episode | `s{season}e{episode}` | `s1e02` |
| Kapitel | `s1e02c01` | `s1e02c01` |
| Step | `{kapitelId}_{typ}_{beschreibung}` | `s1e02c01_story_intro_private` |
| Step (input) | `{kapitelId}_input_{beschreibung}` | `s1e02c01_input_name_reply` |
| Step (item) | `{kapitelId}_item_{beschreibung}` | `s1e02c01_item_yasmin_feeling` |
| Step (amy_feedback) | `{kapitelId}_amy_feedback_{beschreibung}` | `s1e02c01_amy_feedback_yasmin` |
| Step (reflection) | `{kapitelId}_reflection_{beschreibung}` | `s1e02c01_reflection_choice` |
| Step (amy_reaction) | `{kapitelId}_amy_reaction_{beschreibung}` | `s1e02c01_amy_reaction_choice` |
| Step (challenge) | `{kapitelId}_challenge_{beschreibung}` | `s1e02c01_challenge_small_step` |
| Bonus-ID | frei wählbar, global eindeutig | `char-yasmin`, `diary-yasmin-entry1` |

**Wichtig:** IDs nie im Nachhinein umbenennen. Sie sind Teil des gespeicherten Nutzerprofils.

---

## 3. Verfügbare Charaktere

```ts
ch.amy      ch.yasmin   ch.lisa     ch.chioma
ch.igor     ch.lukas    ch.carlos   ch.aylin
ch.finn     ch.dominik  ch.tom      ch.jonas
ch.markus   ch.elsa     ch.alvarez  ch.mia
```

---

## 4. Builder-Referenz: Nachrichten

Alle Nachrichten-Helfer geben ein `Raw`-Objekt zurück, das der `S()`-Step-Builder automatisch in ein vollständiges `Message`-Objekt übersetzt. IDs werden automatisch als `${stepId}#${index}` generiert.

### Normale Nachricht
```ts
m(ch.yasmin, 'Hi 👋', '10:05')
m(ch.lisa, 'Sieht mega aus 😍', '13:15', { reactions: [R('❤️')] })
m(ch.finn, 'du warst in schottland?', '11:15', {
  replyTo: { speakerName: 'Yasmin', text: 'Ja, in Schottland.' },
})
```
- Amy als Speaker → `type: 'main'` (blaue Blase)
- Alle anderen → `type: 'other'`

### Bild-Nachricht
```ts
img(ch.lukas, '/media/story/episodes/s1e02/s1e02c01-512.webp', '13:12')
img(ch.lukas, '/media/story/episodes/s1e02/s1e02c01-512.webp', '13:12', {
  reactions: [R('🔥')],
})
img(ch.lisa, '/media/.../foto.webp', '14:19', { content: 'Weitergeleitet:' })
img(ch.igor, '/media/.../foto.webp', '16:56', { content: 'Entwarnung!' })
```

### Audio / Sprachnachricht
```ts
audio(ch.chioma, '/media/story/episodes/s1e02/chioma-nachricht.mp3', '13:14')
audio(ch.chioma, '/media/story/episodes/s1e02/chioma-nachricht.mp3', '13:14', 'Sprachnachricht')
```

### System-Nachrichten
```ts
typing('Yasmin tippt ...')      // Tipp-Indikator
typing('Yasmin löscht')
divider('Zeitlich später')      // Zeitlicher Trenner im Chat
amyTip('Du kannst deinen Namen jederzeit im Profil ändern.')  // Amy-Hinweis-Karte
sysMsg('Lisa hinzugefügt.', '20:08')  // Einfache System-Info (kein Icon)
```

### Bonus-Link-Karten
```ts
bonusLink('char-yasmin', 'Charakterkarte Yasmin', '/cards/char-yasmin', 'Karte ansehen →')
bonusLink('diary-yasmin-entry1', 'Tagebucheintrag Yasmin – 1. Eintrag',
  '/diaries/diary_yasmin?entry=s1e02c01_0001', 'Eintrag öffnen →')
bonusLink('tip-amy-staunen', 'Artikel: Staunen', '/newspaper/tip-amy-staunen', 'Artikel öffnen →')
```
- `bonusId` muss **global eindeutig** sein
- Dritter Parameter: interner App-Link zum Inhalt
- Vierter Parameter: Linktext (Standard: `'Öffnen →'`)

---

## 5. Builder-Referenz: Szenen-Wechsel

Ein Szenen-Wechsel (chat-switch) steht immer als **erstes Element** in einem Story-Step-Messages-Array. Mehrere Szenen-Wechsel innerhalb eines Steps sind erlaubt.

```ts
privateChat('Du', 'Yasmin')           // Privatchat zwischen zwei Personen
privateChat('Igor', 'Lukas', 'Yasmin') // Gruppenchat (private tone)
classChat()                            // Klassenchat "Klasse 7b"
classChat('Klasse 8a')                 // Klassenchat mit eigenem Titel
amyChat()                              // Abkürzung für privateChat('Du', 'Amy')
```

---

## 6. Builder-Referenz: Step-Typen

### S — Story-Step
```ts
S(id, messages, topics?)
```
- `id`: stabiler Step-ID-String
- `messages`: Array aus Nachrichten-/Szenen-Helfern
- `topics`: optionales Array aus `ThemeId[]` (Standard: `[]`)

```ts
S('s1e02c01_story_intro', [
  privateChat('Du', 'Yasmin'),
  m(ch.yasmin, 'Hi 👋', '10:05'),
  m(ch.yasmin, 'Bist du neu hier in der Klasse?', '10:06'),
], ['reflect-understand', 'talk-act'])
```

Gültige `ThemeId`-Werte:
- `'info-check'`
- `'talk-act'`
- `'reflect-understand'`
- `'problem-solving'`
- `'creative'`
- `'safe-online'`
- `'fairness'`

---

### inp — Input-Step
Leichte Beteiligung ohne Messung. Für kurze Freitexteingaben oder optionale Antworten.

```ts
inp(id, promptKey, opts?)
```

```ts
inp('s1e02c01_input_reply', 'stories:s1e02.c01.input.reply', {
  topics: ['talk-act'],
  promptSpeakerId: 'yasmin',     // wessen Bubble der Prompt zeigt
})

inp('s1e02c01_input_name', 'stories:s1e02.c01.input.name', {
  required: true,
  emptySubmitsAllowed: false,
  placeholderKey: 'stories:common.chatNamePlaceholder',
  maxLength: 40,
  topics: ['talk-act'],
  promptSpeakerId: 'yasmin',
})
```

Defaults:
- `required: false`
- `emptySubmitsAllowed: true`
- `placeholderKey: 'stories:common.replyPlaceholder'`
- `maxLength: 120`

**Kein Score, keine Dimension, kein Indikator.**

---

### IT — Item-Step (Wirkungsmessung)
Verdeckte Messung. Nutzer wählt eine von genau **4 Optionen**.

```ts
IT(id, prompt, dimension, indicatorId, options, topics?)
```

```ts
IT('s1e02c01_item_yasmin_feeling',
  'Wie könnte sich Yasmin gerade fühlen?',
  'perspective',
  'perspectives_recognize',
  [
    optSegs('a', 'Sie fühlt sich ausgeschlossen.', 3,
      'Yasmin merkt, dass sie bei der Gruppe nicht dabei ist.',
      '👉 Das fühlt sich unangenehm an, ist aber normal.',
      '💡 Solche Gefühle zeigen, wie wichtig Zugehörigkeit ist.',
    ),
    optSegs('b', 'Sie ist neidisch auf Lisa.', 2,
      'Yasmin vergleicht sich mit Lisa.',
      '👉 Vergleiche können anspornend oder belastend sein.',
      '💡 Es hilft, sich zu fragen: Was will ich eigentlich selbst?',
    ),
    opt('c', 'Sie ist einfach gelangweilt.', 1),
    opt('d', 'Sie will einfach mitspielen.', 0),
  ],
  ['reflect-understand'],
)
```

Gültige `dimension`-Werte:
- `'perspective'`
- `'judgement'`
- `'self_regulation'`
- `'responsibility'`

Gültige `indicatorId`-Werte:
- `'perspectives_recognize'` · `'perspectives_distinguish'` · `'media_effect_understand'` · `'roles_understand'`
- `'credibility_assess'` · `'manipulation_recognize'` · `'information_classify'` · `'judgement_explain'`
- `'interrupt_impulse'` · `'keep_limits'` · `'steer_attention'` · `'pursue_goal'`
- `'do_not_harm'` · `'intervene'` · `'take_responsibility'` · `'privacy_protect'`

---

### MIT — Multi-Select-Item (unbewertete Mehrfachwahl)
Didaktische Frage ohne Wirkungsmessung. Nutzer kann mehrere Optionen wählen.

```ts
MIT(id, prompt, dimension, indicatorId, options, opts?)
```

```ts
MIT('s1e02c03_item_check_source',
  'Woran erkennst du eine zuverlässige Quelle?',
  'judgement',
  'credibility_assess',
  [
    opt('a', 'Das Datum des Artikels prüfen.', 1),
    opt('b', 'Den Autor recherchieren.', 1),
    opt('c', 'Einfach vertrauen.', 0),
    opt('d', 'Andere Quellen vergleichen.', 1),
  ],
  {
    minSelections: 1,
    maxSelections: 4,
    helperText: 'Du kannst mehrere Antwortoptionen auswählen.',
    topics: ['info-check'],
  },
)
```

- `score: 1` = richtige Antwort (grün), `score: 0` = falsche Antwort (rot)
- `dimension` und `indicatorId` sind Pflichtfelder, haben aber **keinen Einfluss auf die Wirkungsmessung**
- 2–8 Optionen erlaubt

---

### AF — Amy-Feedback
Sichtbare Reaktion auf ein `item` oder `MIT`. Immer direkt nach dem zugehörigen Item.

```ts
AF(id, sourceStepId)
```

```ts
AF('s1e02c01_amy_feedback_yasmin', 's1e02c01_item_yasmin_feeling')
```

---

### GR — Geführte Reflexion (guided_choice)
Reflexion ohne Messung. Nutzer wählt eine vorgegebene Antwort.

```ts
GR(id, prompt, choices, opts?)
```

```ts
GR('s1e02c01_reflection_reply',
  'Was würdest du an Yasmins Stelle schreiben?',
  [
    rc('a', '„Ne, alles gut."',
      'Das wirkt nach außen ruhig.',
      '👉 Yasmins echte Gefühle bleiben dabei verborgen.',
      '💡 Manchmal hilft ein privates Gespräch mehr.',
    ),
    rc('b', '„Ich bin gerade ein bisschen neidisch 😅"',
      'Yasmin spricht offen aus, wie sie sich fühlt.',
      '👉 Das kann sich ungewohnt anfühlen, nimmt aber Druck raus.',
      '💡 Ehrlichkeit stärkt oft das Vertrauen.',
    ),
    rc('c', '„Freu mich so für dich 😍."',
      'Das wirkt freundlich.',
      '👉 Yasmins echte Gefühle bleiben im Hintergrund.',
    ),
  ],
  { topics: ['talk-act', 'reflect-understand'] },
)
```

**Kein Score, keine Dimension, kein Indikator.**

---

### OR — Offene Reflexion (open_text)
Reflexion ohne Messung. Nutzer schreibt frei.

```ts
OR(id, prompt, opts?)
```

```ts
OR('s1e02c04_reflection_ai_image',
  'Wenn du selbst ein Bild mit KI erstellst: Was wäre dir wichtig?',
  { topics: ['reflect-understand', 'talk-act'] },
)
```

Defaults:
- `maxLength: 280`
- `placeholderKey: 'stories:common.replyPlaceholder'`
- `category: 'ACTION'`

Gültige `category`-Werte: `'FEELING'` · `'ACTION'` · `'PERSPECTIVE'` · `'KNOWLEDGE'` · `'CHALLENGE'` · `'GENERAL'`

**Kein Score, keine Dimension, kein Indikator.**

#### ⚠️ KI-Validierung überspringen: `bypassAi`

Standardmäßig bewertet Amy jede Antwort per KI (A/B = weiter, C = Retry). Bei zwei Fragetypen ist das kontraproduktiv:

| Fragetyp | Problem | Lösung |
|---|---|---|
| **Perspektiv-Frage** (über jemand anderen) | Kurze empathische Antworten werden als C bewertet | `bypassAi: true` |
| **Kreativ-Frage** (Titel, Idee, freie Eingabe) | Kurze kreative Antworten werden als C bewertet | `bypassAi: true` |

```ts
// Perspektiv-Frage: Warum fühlt sich jemand anderes so?
OR('s1e02c03_reflection_belonging',
  'Warum fühlt es sich für Chioma mies an, nicht mehr im Klassenchat zu sein – obwohl dort viel Streit ist?',
  {
    topics: ['reflect-understand'],
    category: 'PERSPECTIVE',
    bypassAi: true,
    fixedAmyReply: 'Dazugehören ist für die meisten Menschen wichtig – auch wenn es dort Streit gibt. Das zeigt, wie stark dieses Gefühl ist.',
  },
)

// Kreativ-Frage: Was würdest du machen?
OR('s1e02c04_reflection_own_contribution',
  'Was für einen Beitrag würdest du gern mal machen?',
  {
    topics: ['creative'],
    category: 'ACTION',
    bypassAi: true,
    fixedAmyReply: 'Tolle Idee! Solche Beiträge machen eine Schülerzeitung lebendig.',
  },
)
```

**Regeln für `bypassAi: true`:**
- Immer `fixedAmyReply` angeben — sonst zeigt der nachfolgende `AR`-Step nichts an
- `fixedAmyReply` ist unabhängig von der Antwort des Kindes (generischer Bestätigungstext)
- Nur für Fragen verwenden, bei denen **jede ehrliche Antwort richtig ist**
- Für Selbstreflexionsfragen (z.B. "Wie hättest du reagiert?") weiterhin Standard-OR ohne `bypassAi` nutzen

---

### AR — Amy-Reaktion
Sichtbare Reaktion auf eine Reflexion. Immer direkt nach dem zugehörigen OR/GR.

```ts
AR(id, sourceStepId)
```

```ts
AR('s1e02c04_amy_reaction_ai_image', 's1e02c04_reflection_ai_image')
```

---

### CH — Challenge
Kurzer Impuls für den Alltag. Keine Bewertung.

```ts
CH(id, prompt)
```

```ts
CH('s1e02c02_challenge_video',
  '👉 Schaffst du es heute, einmal ein Video NICHT zu schauen, obwohl du draufklicken willst?',
)
```

---

### C — Kapitel
```ts
C(id, index0, title, subtitle, steps, opts?)
```

```ts
C('s1e02c01', 0, 'Amic 1', 'Der erste Tag', [
  // … Steps
])

// Epilog-Kapitel (kein Coin, aber normale Episode-Belohnungen)
C('s1e02c09', 8, 'Epilog', '', [
  // … Steps
], { isEpilogue: true })
```

---

## 7. Optionen-Helfer

### opt — einfache Option (ohne Feedback-Text)
```ts
opt(id, text, score)
```
```ts
opt('a', 'Sie fühlt sich ausgeschlossen.', 3)
opt('b', 'Sie ist neidisch.', 2)
opt('c', 'Sie ist gelangweilt.', 1)
opt('d', 'Sie will mitspielen.', 0)
```

### optSegs — Option mit Segment-Feedback
```ts
optSegs(id, text, score, ...segments)
```
```ts
optSegs('a', 'Sie fühlt sich ausgeschlossen.', 3,
  'Yasmin merkt, dass sie nicht dabei ist.',      // Segment 1
  '👉 Das fühlt sich unangenehm an.',             // Segment 2
  '💡 Zugehörigkeit ist ein normales Bedürfnis.', // Segment 3
)
```
- Scores für Standard-Items: `0` (falsch) · `1` (schwach) · `2` (teilweise) · `3` (richtig)
- Empfohlen: 3 Segmente pro Option (Kontext → Konsequenz → Tipp)

### rc — Reflexions-Choice
```ts
rc(id, text, ...segments)
```
```ts
rc('a', '„Ne, alles gut."',
  'Das wirkt nach außen ruhig.',
  '👉 Yasmins echte Gefühle bleiben dabei verborgen.',
  '💡 Manchmal hilft ein privates Gespräch mehr.',
)
```

---

## 8. Empfohlene Step-Reihenfolgen

```
story → input → story
story → item → amy_feedback → story
story → MIT → amy_feedback → story
story → reflection → amy_reaction → story
story → challenge → story
```

Typisches Kapitel-Muster:
```
S(classChat, Nachrichten)          ← Situationsaufbau
S(amyChat)                         ← Wechsel zu Amy
IT(...)                            ← Messung
AF(...)                            ← Amy-Feedback
S(amyChat, m(amy, 'Fazit...'))     ← Amy-Abschluss
```

---

## 9. Trennlinie: item vs. reflection vs. input

| | Messung? | Score? | Dimension? | Nutzer-Input |
|---|---|---|---|---|
| `IT` | ✅ ja | 0–3 | Pflicht | Auswahl (1 von 4) |
| `MIT` | ❌ nein | 0/1 | formal Pflicht | Mehrfachwahl |
| `GR` | ❌ nein | — | — | Auswahl aus Choices |
| `OR` | ❌ nein | — | — | Freitext |
| `inp` | ❌ nein | — | — | Freitext/Choice |

---

## 10. Resume-Verhalten

Nach einem Neustart der Episode dürfen bereits abgeschlossene Interaktionen **nicht wieder als offen** erscheinen.

Sichtbar bleiben (abgeschlossen):
- Story-Verlauf (Nachrichten)
- Input-Antworten
- Item-Auswahl + Amy-Feedback
- Reflexions-Antworten + Amy-Reaktionen
- Challenges
- Bonus-Link-Karten

Nicht wieder offen erscheinen:
- alte Input-Felder
- alte Item-Buttons
- alte Reflexions-Formulare

Dies wird vom Runtime automatisch gehandhabt, solange alle Step-IDs stabil bleiben.

---

## 11. Vollständiges Minimal-Beispiel (eine Episode, zwei Kapitel)

```ts
import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, typing, amyTip, bonusLink,
  privateChat, classChat, amyChat,
  opt, optSegs, rc,
  S, inp, IT, AF, GR, AR, C,
} from '../storyBuilder';

const R = (emoji: string): Reaction => ({ emoji });

// ── Kapitel 1 ────────────────────────────────────────────────────────────────

const c01 = C('s1e02c01', 0, 'Amic 1', 'Der erste Tag', [

  S('s1e02c01_story_intro', [
    privateChat('Du', 'Yasmin'),
    m(ch.yasmin, 'Hi 👋 Alles gut bei dir?', '10:05'),
  ]),

  inp('s1e02c01_input_reply', 'stories:s1e02.c01.input.reply', {
    topics: ['talk-act'], promptSpeakerId: 'yasmin',
  }),

  S('s1e02c01_story_after_reply', [
    m(ch.yasmin, 'Cool! Schau mal, was gerade im Klassenchat los ist.', '10:07'),
    classChat(),
    m(ch.igor, 'Hat jemand schon das neue Video gesehen? 🔥', '10:08', { reactions: [R('👍')] }),
    m(ch.lisa, 'Ja!! Mega krass.', '10:08'),
    typing('Yasmin tippt ...'),
    typing('Yasmin löscht'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e02c01_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand']),

  IT('s1e02c01_item_yasmin_feeling',
    'Was könnte Yasmin gerade denken?',
    'perspective', 'perspectives_recognize',
    [
      optSegs('a', 'Sie fühlt sich außen vor.', 3,
        'Yasmin ist nicht Teil des Gesprächs.',
        '👉 Das kann sich unangenehm anfühlen.',
        '💡 Solche Momente sind normal und vergehen.',
      ),
      optSegs('b', 'Sie ist neidisch auf Igor.', 2,
        'Yasmin vergleicht sich mit Igor.',
        '👉 Vergleiche können belasten.',
        '💡 Was will sie selbst eigentlich?',
      ),
      opt('c', 'Sie ist einfach müde.', 1),
      opt('d', 'Sie denkt gar nichts.', 0),
    ],
    ['reflect-understand'],
  ),

  AF('s1e02c01_amy_feedback_feeling', 's1e02c01_item_yasmin_feeling'),

  GR('s1e02c01_reflection_reply',
    'Was würdest du an Yasmins Stelle in den Chat schreiben?',
    [
      rc('a', '„Ja, sehr cool 👍"',
        'Das wirkt freundlich und unverbindlich.',
        '👉 Yasmins echte Stimmung bleibt unsichtbar.',
        '💡 Kurze Antworten halten oft Abstand.',
      ),
      rc('b', '„Ich habe das noch nicht gesehen 🙈"',
        'Yasmin gibt ehrlich zu, was sie nicht weiß.',
        '👉 Das fühlt sich vielleicht unsicher an, wirkt aber authentisch.',
        '💡 Nicht immer mitreden müssen ist auch okay.',
      ),
    ],
    { topics: ['talk-act', 'reflect-understand'] },
  ),

  AR('s1e02c01_amy_reaction_reply', 's1e02c01_reflection_reply'),
]);

// ── Kapitel 2 ────────────────────────────────────────────────────────────────

const c02 = C('s1e02c02', 1, 'Amic 2', 'Der Plan', [

  S('s1e02c02_story_classChat', [
    classChat(),
    img(ch.igor, '/media/story/episodes/s1e02/s1e02c02-512.webp', '13:12', { reactions: [R('🔥')] }),
    m(ch.lisa, 'Sieht mega aus 😍', '13:13'),
    m(ch.yasmin, 'Wo ist das?', '13:14'),
    bonusLink('tip-igor-location', 'Artikel: Orte im Netz', '/newspaper/tip-igor-location', 'Artikel öffnen →'),
  ], ['info-check', 'talk-act']),

  S('s1e02c02_story_switch_to_amy', [
    amyChat(),
    m(ch.amy, 'Schau dir das Bild genau an.'),
  ], ['info-check']),

  AF('s1e02c02_amy_feedback_feeling', 's1e02c01_item_yasmin_feeling'), // referenziert c01-Item
]);

// ── Episode ──────────────────────────────────────────────────────────────────

const s1e02De: StoryEpisodeV02 = {
  id: 's1e02',
  seasonId: 's1',
  episodeId: 's1e02',
  courseId: 's1e02',
  chapters: [c01, c02],
};

export default s1e02De;
```

---

## 12. Häufige Fehler

| Fehler | Ursache | Lösung |
|---|---|---|
| Input-Antwort erscheint nicht im Chat | Step-ID doppelt verwendet | Jede Step-ID muss global eindeutig sein |
| Klassenchat startet visuell neu | `chat-switch` als erste Nachricht eines Folge-Steps | Folge-Steps ohne neuen `classChat()` beginnen lassen |
| Resume öffnet alte Eingabefelder wieder | Step-ID wurde geändert | IDs nie umbenennen nach Rollout |
| TypeScript-Fehler bei `IT` | Weniger oder mehr als 4 Optionen | Genau 4 Optionen angeben |
| Bonus wird nicht als gesehen markiert | `bonusId` nicht eindeutig | Jeden Bonus mit eindeutiger `bonusId` versehen |

---

## 13. Datei-Referenzen

| Datei | Inhalt |
|---|---|
| `src/story-v02/content/storyBuilder.ts` | Alle Builder-Funktionen |
| `src/story-v02/types/storyTypes.ts` | TypeScript-Typen für Steps |
| `src/story-v02/types/measurementTypes.ts` | Dimensionen und IndicatorIds |
| `src/competencies/themeMeta.ts` | Gültige ThemeId-Werte |
| `src/content/characters.ts` | Alle Charaktere |
| `src/story-v02/content/de/s1e01.de.ts` | Referenz-Episode (vollständig) |
| `src/story-v02/STORY_V02_AUTHORING_GUIDE.md` | Fachliche Regeln und Hintergründe |
