export function normalizeText(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[\n\r]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '') // Buchstaben/Zahlen behalten
    .replace(/\s+/g, ' ')
    .trim();
}

export function looksLikeRephrase(a: string, b: string): boolean {
  const A = normalizeText(a);
  const B = normalizeText(b);
  if (!A || !B) return false;

  // sehr simple Heuristik:
  // wenn 70% der Wörter gleich sind -> ziemlich sicher "gleiche Aussage"
  const aWords = new Set(A.split(' '));
  const bWords = new Set(B.split(' '));

  let common = 0;
  for (const w of aWords) if (bWords.has(w)) common++;

  const overlap = common / Math.max(1, Math.min(aWords.size, bWords.size));
  return overlap >= 0.7;
}
