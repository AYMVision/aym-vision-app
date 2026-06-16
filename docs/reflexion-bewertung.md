# Reflexionsfragen — Bewertungslogik (Stand Juni 2026)

Dieses Dokument beschreibt, wie offene Reflexionsfragen (OR-Schritte) in Amy Surfwing bewertet werden.

---

## Für alle OR-Schritte (offene Reflexionsfragen)

### Schritt 1 — Sicherheit (immer, Code)
Regex-basierte Erkennung läuft vor allem anderen.
- Selbstverletzung, Gewalt, sexuelle Inhalte → Erwachsenen-Gate
- Mobbing-Zustimmung, Hasssprache → Stopp mit Erklärung

### Schritt 2 — Engagement-Gate (Code)
- Weniger als 3 Wörter → einmal freundlicher Nudge: „Schreib einfach, was dir gerade durch den Kopf geht." Danach immer weiter.
- 3+ Wörter → sofort weiter.
- Enthält die Antwort einen Begründungsmarker (weil, deshalb, because) → Amy antwortet wärmer (Label A statt B).

### Schritt 3 — Amy antwortet (Code + MiniLM)
- Der questionType kommt jetzt direkt vom Content-Author (`category: 'PERSPECTIVE'` etc.) statt aus fehleranfälliger Texterkennung.
- Das MiniLM-Modell (`all-MiniLM-L6-v2`) läuft für OR-Schritte und analysiert den Fragetext.
- Amy antwortet mit dem zum Fragetyp passenden Ton.

### Schritt 4 — Forcierter Durchlass (Code)
Nach 2 Versuchen immer weiter — kein Kind wird dauerhaft blockiert.

---

## bypassAi-Schritte (persönliche/kreative Fragen)
Kein Engagement-Gate. Nur Trivialcheck (1 Wort / bekannte Nicht-Antworten) → Nudge. Danach sofort weiter mit kontextspezifischer Amy-Antwort aus dem Content.

---

## Was ist Code, was ist KI

| Komponente | Art |
|---|---|
| Sicherheitserkennung (contentFlags) | Code (Regex) |
| Engagement-Check (3 Wörter) | Code |
| MiniLM-Analyse der Fraginhalte | Echte KI, aktiv |
| Amy-Phrasenauswahl | Code (Phrasenbanken) |
| Forcierter Durchlass nach 2 Versuchen | Code |

---

## Dateien

| Datei | Rolle |
|---|---|
| `src/ai/core/contentFlags.ts` | Sicherheitserkennung |
| `src/ai/orchestrator/runAmy.ts` | Engagement-Gate + Orchestrierung |
| `src/ai/core/extractKeyIdea.ts` | MiniLM-Analyse (Xenova all-MiniLM-L6-v2) |
| `src/story-v02/components/ReflectionStepCard.tsx` | UI + runAmy-Aufruf |
| `src/story-v02/content/storyBuilder.ts` | OR() Builder (bypassAi, category, fixedAmyReply) |
