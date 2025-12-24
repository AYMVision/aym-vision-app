// /src/ai/amyReply.ts
import type { AmyDecisionResult } from './amyDecision';

type Relation = 'copied' | 'partial' | 'off-topic-meaningful' | 'off-topic';
type QType = AmyDecisionResult['questionType'];

// --------------------------------------------------
// Utils
// --------------------------------------------------
function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(s: string, max = 180) {
  const t = (s || '').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

function oneLine(s: string) {
  return clamp(String(s ?? '').replace(/\s+/g, ' ').trim(), 180);
}

// --------------------------------------------------
// Text-Buckets (Variation & Didaktik)
// --------------------------------------------------
const A_INTROS = ['Stark. 🦉', 'Das ist gut überlegt. 🦉', 'Sehr reflektiert. 🦉', 'Das klingt durchdacht. 🦉'];
const A_OUTROS = ['Weiter geht’s.', 'Du kannst ins nächste Kapitel.', 'Passt. Weiter.', 'Nächste Frage.'];

const B_INTROS = ['Danke dir. 🦉', 'Okay, verstanden. 🦉', 'Passt. 🦉', 'Alles klar. 🦉'];
const B_OUTROS = ['Weiter.', 'Kurz reicht — weiter.', 'Nächste Frage.', 'Weiter geht’s.'];

const RETRY_GENERIC = ['Das war noch keine echte Antwort.', 'Das hilft mir noch nicht.', 'Da fehlt noch deine eigene Antwort.'];

// ✅ TS-safe: Record<QType, string[]>
const RETRY_TASK: Record<QType, string[]> = {
  FEELING: [
    'Welches Gefühl passt dazu?',
    'Wie würdest du dich dabei fühlen?',
    'Welches Gefühl hättest du?',
  ],
  ACTION: [
    'Was würdest du konkret tun?',
    'Was machst du als Nächstes?',
    'Welche Handlung wäre sinnvoll?',
  ],
  PERSPECTIVE: [
    'Wie würdest du das erklären?',
    'Was bedeutet das für dich?',
    'Wie würdest du es beschreiben?',
  ],
  CHALLENGE: [
    'Welche kleine Übung könntest du machen?',
    'Was würdest du ausprobieren?',
    'Welche Mini-Challenge passt?',
  ],
  GENERAL: [
    'Was fällt dir dazu ein?',
    'Wie würdest du antworten?',
    'Was meinst du?',
  ],
};

const UNSICHER_INTROS = ['Kein Stress. 🦉', 'Alles okay — das ist nicht leicht. 🦉', 'Schon gut. 🦉', 'Kann passieren. 🦉'];
const STEER_BACK = ['Schau nochmal auf die Frage.', 'Bleib kurz bei der Frage.', 'Nimm dir die Frage oben.'];
const OWN_WORDS = ['Schreib es in deinen Worten.', 'Ein Satz in deinen Worten reicht.', 'Formulier es einmal selbst.'];

const COPIED_HINT = ['Das klingt sehr nah am Tipp.', 'Das ist fast wie abgeschrieben.', 'Das ist sehr ähnlich zum Tipp.'];

const OFFTOPIC_MEANINGFUL_HINT = [
  'Das ist ein guter Gedanke, aber nicht zur Frage.',
  'Sinnvoll — nur gerade am Thema vorbei.',
  'Klingt gut, passt aber nicht zur Frage.',
];

// --------------------------------------------------
// Helper (TS-sicher)
// --------------------------------------------------
function getRetryTasks(qt: QType): string[] {
  return RETRY_TASK[qt];
}

// --------------------------------------------------
// Public API
// --------------------------------------------------
export function buildAmyReply(
  decision: AmyDecisionResult,
  tipText: string,
  keyIdea: string,
  relation: Relation
): string {
  const tip = oneLine(tipText);
  const key = oneLine(keyIdea) || extractKeyFallback(tip);

  switch (decision.mode) {
    case 'encourage':
      return buildA();

    case 'motivate':
      return buildB();

    case 'retry':
      return buildRetry(decision.questionType);

    case 'tip-key':
      return buildTipKey(decision, key, relation);

    case 'tip-full':
      return buildTipFull(decision, tip, relation);

    default:
      return 'Okay. 🦉';
  }
}

// --------------------------------------------------
// Builders
// --------------------------------------------------
function buildA() {
  return `${pick(A_INTROS)} ${pick(A_OUTROS)}`;
}

function buildB() {
  return `${pick(B_INTROS)} ${pick(B_OUTROS)}`;
}

function buildRetry(qt: QType) {
  const generic = pick(RETRY_GENERIC);
  const task = pick(getRetryTasks(qt));
  return `🦉 ${generic} ${task}`;
}

function buildTipKey(decision: AmyDecisionResult, keyIdea: string, relation: Relation) {
  const qt = decision.questionType;
  const attempt = decision.attemptCount;

  // attempt 1
  if (attempt === 1) {
    const intro = pick(UNSICHER_INTROS);
    const own = pick(OWN_WORDS);

    if (relation === 'off-topic') {
      return `🦉 ${intro} ${pick(STEER_BACK)} ${pick(getRetryTasks(qt))}`;
    }

    // off-topic-meaningful: kurz zurück zur Frage + Hinweis
    if (relation === 'off-topic-meaningful') {
      return `🦉 ${pick(OFFTOPIC_MEANINGFUL_HINT)} ${pick(STEER_BACK)} Hinweis: **${keyIdea}** ${own}`;
    }

    return `🦉 ${intro} Hinweis: **${keyIdea}** ${own}`;
  }

  // attempt 2
  if (attempt === 2) {
    const micro = microTaskForType(qt);
    const copiedAddon =
      relation === 'copied' ? ` ${pick(COPIED_HINT)} ${pick(OWN_WORDS)}` : '';
    return `🦉 Kleiner Schritt: **${keyIdea}** ${micro}${copiedAddon}`;
  }

  return `🦉 Hinweis: **${keyIdea}** ${pick(OWN_WORDS)}`;
}

function buildTipFull(decision: AmyDecisionResult, tipText: string, relation: Relation) {
  const qt = decision.questionType;

  if (!tipText) {
    return `🦉 ${pick(UNSICHER_INTROS)} ${pick(getRetryTasks(qt))}`;
  }

  const copied =
    relation === 'copied'
      ? ` ${pick(COPIED_HINT)} ${pick(OWN_WORDS)}`
      : ` ${pick(OWN_WORDS)}`;

  return `🦉 Lies das kurz und schreib dann **einen Satz** in eigenen Worten:\n\n${tipText}${copied}`;
}

function microTaskForType(qt: QType) {
  switch (qt) {
    case 'FEELING':
      return ' Nenn ein Gefühl + warum.';
    case 'ACTION':
      return ' Schreib eine konkrete Handlung.';
    case 'PERSPECTIVE':
      return ' Erklär es wie einem Freund.';
    case 'CHALLENGE':
      return ' Nenn eine realistische Mini-Übung.';
    default:
      return ' Schreib einen Satz dazu.';
  }
}

function extractKeyFallback(tip: string) {
  if (!tip) return 'den wichtigsten Gedanken dazu';
  return clamp(tip, 120);
}
