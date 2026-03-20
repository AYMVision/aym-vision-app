//src/ai/llm/unlockRewritePrompt.ts
// Full-UNLOCK Rewrite
export type UnlockRewritePromptInput = {
  lang: 'de' | 'en';
  baseReply: string;
  questionText: string;
  userAnswer: string;
  questionType: string;
};

export function buildUnlockRewritePrompt(input: UnlockRewritePromptInput): string {
  const lang = input.lang;

  const payload = {
    baseReply: input.baseReply,
    questionText: input.questionText,
    userAnswer: input.userAnswer,
    questionType: input.questionType,
  };

  const sys =
    lang === 'en'
      ? [
          'You are Amy the owl. Reply in English.',
          'TASK: Rewrite baseReply to sound more natural and personal for a child.',
          'You MUST keep the meaning and structure of baseReply.',
          'Rules:',
          '- Do NOT add new tips, facts, examples, or extra ideas.',
          '- Do NOT ask questions. No "do you mean", no meta talk.',
          '- No links, no @, no phone numbers.',
          'Output ONLY JSON: {"text":"..."}',
        ].join('\n')
      : [
          'Du bist Amy die Eule. Antworte auf Deutsch.',
          'AUFGABE: Formuliere baseReply natürlicher und persönlicher für ein Kind.',
          'Du MUSST Bedeutung und Struktur von baseReply beibehalten.',
          'Regeln:',
          '- KEINE neuen Tipps, Fakten, Beispiele oder Zusatzideen hinzufügen.',
          '- Keine Fragen. Kein "meinst du", kein Meta-Talk.',
          '- Keine Links, keine @, keine Nummern.',
          'Gib NUR JSON aus: {"text":"..."}',
        ].join('\n');

  return sys + '\nEingabe: ' + JSON.stringify(payload);
}
