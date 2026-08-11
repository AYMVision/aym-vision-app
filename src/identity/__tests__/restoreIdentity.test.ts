import { describe, it, expect, beforeEach } from 'vitest';
import { generateIdentity, restoreIdentity } from '../keys';
import { ensureIdentity, loadIdentity } from '../storage';

describe('restore identity', () => {
  beforeEach(() => localStorage.clear());

  it('restores the same public key from the original mnemonic', async () => {
    const original = await generateIdentity();
    const restored = await restoreIdentity(original.mnemonic);
    expect(restored.publicKeyHex).toBe(original.publicKeyHex);
  });

  it('throws on an invalid mnemonic input', async () => {
    await expect(restoreIdentity('eins zwei drei')).rejects.toThrow();
  });

  it('after restore, loadIdentity returns the restored public key', async () => {
    await ensureIdentity();
    const other = await generateIdentity();
    localStorage.setItem(
      'aym_identity',
      JSON.stringify({ ...other, backupConfirmedAt: Date.now(), createdAt: Date.now() })
    );
    expect(loadIdentity()!.publicKeyHex).toBe(other.publicKeyHex);
  });
});
