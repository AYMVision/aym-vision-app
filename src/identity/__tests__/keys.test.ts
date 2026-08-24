import { describe, it, expect } from 'vitest';
import { generateIdentity, restoreIdentity, signPayload, publicKeyHash } from '../keys';

describe('identity keys', () => {
  it('generates a 24-word mnemonic and 32-byte public key', async () => {
    const id = await generateIdentity();
    expect(id.mnemonic.split(' ')).toHaveLength(24);
    expect(id.publicKeyHex).toMatch(/^[0-9a-f]{64}$/);
  });

  it('restores the same public key from the same mnemonic', async () => {
    const id = await generateIdentity();
    expect((await restoreIdentity(id.mnemonic)).publicKeyHex).toBe(id.publicKeyHex);
  });

  it('throws on an invalid mnemonic', async () => {
    await expect(restoreIdentity('foo bar baz')).rejects.toThrow();
  });

  it('produces deterministic 64-byte signatures', async () => {
    const id = await generateIdentity();
    const sig = await signPayload(id.mnemonic, 'AYM1|GET|/api/v1/extension/aym-vision/content|abc|d41d8c');
    expect(sig).toMatch(/^[0-9a-f]{128}$/);
    expect(await signPayload(id.mnemonic, 'AYM1|GET|/api/v1/extension/aym-vision/content|abc|d41d8c')).toBe(sig);
  });

  it('computes a 28-byte blake2b public key hash', async () => {
    const id = await generateIdentity();
    expect(publicKeyHash(id.publicKeyHex)).toMatch(/^[0-9a-f]{56}$/);
  });
});
