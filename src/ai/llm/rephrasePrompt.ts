// src/ai/llm/rephrasePrompt.ts

export function buildRephraseQuestionPrompt(input: { lang: string; questionText: string }): string {
  const lang = (input.lang || 'de').toLowerCase().startsWith('en') ? 'en' : 'de';
  const q = String(input.questionText ?? '').trim();

  if (lang === 'de') {
    return [
      'AUFGABE: Schreibe die Frage einfacher für 5.-7. Klasse um.',
      'Regeln:',
      '- Bedeutung bleibt gleich.',
      '- GENAU 1 Frage (mit ? am Ende).',
      '- Max 140 Zeichen.',
      '- Keine Erklärungen, keine Beispiele, keine Extrasätze.',
      '- Gib NUR die umformulierte Frage aus.',
      '',
      'FRAGE:',
      q,
      '',
      'AUSGABE:',
    ].join('\n');
  }

  return [
    'TASK: Rephrase the question for 5th-7th graders.',
    'Rules:',
    '- Same meaning.',
    '- EXACTLY 1 question (end with ?).',
    '- Max 140 characters.',
    '- No explanations, no examples, no extra sentences.',
    '- Output ONLY the rephrased question.',
    '',
    'QUESTION:',
    q,
    '',
    'OUTPUT:',
  ].join('\n');
}

