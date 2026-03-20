// src/ai/core/amyQuestionType.ts
// ✅ Bilingual (DE/EN) Question-Type detection (no LLM)
// ✅ Single source of truth for AmyQuestionType used across orchestrator/decision/reply

export type AmyQuestionType =
  | 'FEELING'
  | 'ACTION'
  | 'PERSPECTIVE'
  | 'KNOWLEDGE'
  | 'CHALLENGE'
  | 'GENERAL';

type DetectParams = {
  questionText?: string; // Frage
  tipText?: string;      // optional: Impuls/Hint
};

export function detectQuestionType({
  questionText = '',
  tipText = '',
}: DetectParams): AmyQuestionType {
  const q = normalize(questionText);
  const tip = normalize(tipText);
  const text = `${q} ${tip}`.trim();

  if (!text) return 'GENERAL';

  // exakt gleiche Formulierungen wie in deinem ai.json:
  const perspectiveOverride = [
    "für wen",
    "fuer wen",
    "bei wem",
    "für welche person",
    "for whom",
    "who is",
    "to whom",
    "which person"
  ];

  const feeling = [
    "wie fühlst du",
    "wie würdest du dich fühlen",
    "wie geht es dir",
    "wie wäre das für dich",
    "welches gefühl",
    "warum fühlt",
    "was fühlst du",
    "fühlt sich",
    "wie fühlt sich",
      "wie könnten sich",
  "wie koennten sich",
  "könnten sich",
  "koennten sich",
  "wie könnte sich",
  "wie koennte sich",
  "sich fühlen",
  "sich fuehlen",
  "fühlen sich",
  "fuehlen sich",
    "angst",
    "unsicher",
    "peinlich",
    "unwohl",
    "traurig",
    "wütend",
    "genervt",
    "gestresst",
    "how do you feel",
    "how would you feel",
    "how are you feeling",
    "what do you feel",
    "which feeling",
    "how does it feel",
    "feels like",
    "scared",
    "afraid",
    "unsafe",
    "embarrassed",
    "uncomfortable",
    "sad",
    "angry",
    "stressed"
  ];

  const action = [
    "was würdest du machen",
    "was machst du",
    "wie würdest du reagieren",
    "wie reagierst du",
    "was tust du",
    "was würdest du tun",
    "was kannst du tun",
    "was könnte man tun",
    "was könntest du tun",
    "was sollte man tun",
    "what would you do",
    "what do you do",
    "what should you do",
    "what can you do",
    "how would you react",
    "how do you react",
    "what could you do",
    "what should someone do"
  ];

  const perspective = [
    "deiner meinung nach",
    "warum glaubst du",
    "warum meinst du",
    "wieso",
    "weshalb",
    "wie erklärst du",
    "warum ist",
    "warum wäre",
    "eigene meinung",
    "in your opinion",
    "why do you think",
    "why do you believe",
    "why is",
    "why does",
    "why would",
    "how do you explain",
    "your own opinion",
    "perspective"
  ];

  const challenge = [
    "notiere",
    "überlege dir",
    "suche",
    "schreibe eine regel",
    "erstelle eine regel",
    "deine aufgabe",
    "aufgabe",
    "übung",
    "challenge",
    "welche ideen",
    "ideen hättest du",
    "was für ideen",
    "write down",
    "note down",
    "think of",
    "come up with",
    "your task",
    "task",
    "exercise",
    "practice",
    "challenge",
    "which ideas",
    "what ideas do you have",
    "ideas would you have"
  ];

  const knowledge = [
    "was ist",
    "worum geht es",
    "wofür",
    "wozu",
    "warum gibt es",
    "warum braucht man",
    "warum sind regeln",
    "regeln",
    "regel",
    "veröffentlichen",
    "fake nachrichten",
    "fake-nachrichten",
    "fakenachrichten",
    "falschmeldungen",
    "what is",
    "what are",
    "what does",
    "what is it about",
    "what is it for",
    "why are there",
    "why do we have",
    "why do we need",
    "rules",
    "rule",
    "publishing",
    "publish",
    "fake news",
    "false news",
    "misinformation"
  ];

  // 0) PERSPECTIVE override
  if (includesAny(text, perspectiveOverride)) return 'PERSPECTIVE';

  // 1) FEELING
  if (includesAny(text, feeling)) return 'FEELING';

  // 2) ACTION
  if (includesAny(text, action)) return 'ACTION';

  // 3) PERSPECTIVE
  if (includesAny(text, perspective)) return 'PERSPECTIVE';

  // 4) CHALLENGE
  if (includesAny(text, challenge)) return 'CHALLENGE';

  // 5) KNOWLEDGE
  if (includesAny(text, knowledge)) return 'KNOWLEDGE';

  return 'GENERAL';
}

// --------------------
// Helpers
// --------------------
function normalize(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[“”„"]/g, '"')
    .trim();
}

function includesAny(text: string, needles: string[]) {
  return needles.some((n) => text.includes(n));
}
