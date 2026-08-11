import { describe, it, expect } from 'vitest';
import { pickQuizIndices, checkQuizAnswers } from '../backupQuiz';

describe('backupQuiz', () => {
  it('picks 3 distinct indices in 0..23', () => {
    const rng = (() => { let i = 0; const vals = [0.1, 0.5, 0.9, 0.3]; return () => vals[i++ % vals.length]; })();
    const indices = pickQuizIndices(rng);
    expect(indices).toHaveLength(3);
    expect(new Set(indices).size).toBe(3);
    indices.forEach(idx => { expect(idx).toBeGreaterThanOrEqual(0); expect(idx).toBeLessThan(24); });
  });

  it('accepts correct answers case/whitespace-insensitively', () => {
    const mnemonic = 'abandon ability able about above absent absorb abstract absurd abuse access accident';
    const words = mnemonic.split(' ');
    const indices = [0, 2, 4];
    expect(checkQuizAnswers(mnemonic, indices, [words[0], words[2], words[4]])).toBe(true);
    expect(checkQuizAnswers(mnemonic, indices, ['  Abandon  ', ' ABLE ', 'ABOVE'])).toBe(true);
  });

  it('rejects a wrong word', () => {
    const mnemonic = 'abandon ability able about above absent absorb abstract absurd abuse access accident';
    expect(checkQuizAnswers(mnemonic, [0, 2, 4], ['wrong', 'able', 'above'])).toBe(false);
  });
});
