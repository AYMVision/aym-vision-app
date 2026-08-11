export function pickQuizIndices(rng: () => number, count = 3): number[] {
  const indices: number[] = [];
  while (indices.length < count) {
    const candidate = Math.floor(rng() * 24);
    if (!indices.includes(candidate)) indices.push(candidate);
  }
  return indices;
}

export function checkQuizAnswers(mnemonic: string, indices: number[], answers: string[]): boolean {
  const words = mnemonic.trim().split(/\s+/);
  return indices.every((idx, i) => words[idx]?.toLowerCase() === answers[i]?.trim().toLowerCase());
}
