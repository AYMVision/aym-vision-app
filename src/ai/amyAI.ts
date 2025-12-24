// /src/ai/amyAI.ts
import type { AmyQuestionType } from './amyQuestionType';

export type AmyLabel = 'A' | 'B' | 'C' | 'UNSICHER';

const UNSICHER_PATTERNS = [
  'weiß nicht',
  'keine ahnung',
  'kp',
  'kA'.toLowerCase(),
  'bin mir nicht sicher',
  'keine idee',
  'verstehe ich nicht',
  'keinen plan',
];

const C_PATTERNS = [
  'lol',
  'egal',
  'asdf',
  '😂',
  '🤪',
  'pizza',
  'keine lust',
  'test',
];

const ACTION_NOTHING_PATTERNS = [
  'gar nichts',
  'mache nichts',
  'mach nichts',
  'ich mache nichts',
  'ich mach nichts',
  'nichts tun',
  'ignorier',
  'ignoriere',
  'egal',
];

function normalize(t: string) {
  return (t || '').trim().toLowerCase();
}

function isEmojiOnlyOrGibberish(t: string) {
  const s = normalize(t);
  if (!s) return true;

  // nur Emojis/Zeichen, kaum Buchstaben
  const hasLetters = /[a-zäöüß]/i.test(s);
  if (!hasLetters && s.length <= 6) return true;

  // sehr kurze Zufallsstrings
  if (s.length < 3) return true;

  return false;
}

function looksMeaningfulShort(t: string) {
  // kurze sinnvolle Wörter, die oft echte Antworten sind
  const s = normalize(t);
  const ok = ['respekt', 'privat', 'freundlich', 'blockieren', 'melden', 'hilfe', 'eltern', 'lehrer', 'stop', 'nein'];
  return ok.some((w) => s.includes(w));
}

export class AmyAI {
  /**
   * Kontext-sensitiv: nutzt questionType optional.
   * => Du kannst das in Story.tsx aufrufen, ohne dein Decision-System zu ändern.
   */
  async classifyAnswer(
    text: string,
    ctx?: { questionType?: AmyQuestionType }
  ): Promise<AmyLabel> {
    const t = normalize(text);
    const qt = ctx?.questionType;

    if (isEmojiOnlyOrGibberish(t)) return 'C';

    // ❌ Unsinn / Spam
    if (C_PATTERNS.some((p) => t.includes(p))) return 'C';

    // ❓ Unsicherheit
    if (UNSICHER_PATTERNS.some((p) => t.includes(p))) return 'UNSICHER';

    // ✅ Kontext-Regel: ACTION + "nichts tun" => UNSICHER (nicht durchwinken)
    if (qt === 'ACTION' && ACTION_NOTHING_PATTERNS.some((p) => t.includes(p))) {
      return 'UNSICHER';
    }

    // ✅ Heuristik: sehr kurze, aber sinnvolle Antworten nicht als C bestrafen
    if (t.length < 20 && looksMeaningfulShort(t)) {
      return 'B';
    }

    // ✅ Länge als grobe Heuristik
    if (t.length >= 70) return 'A';
    if (t.length >= 20) return 'B';

    // sonst: zu kurz / zu wenig
    return 'C';
  }
}
