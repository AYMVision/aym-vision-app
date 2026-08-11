import { describe, it, expect, beforeEach } from 'vitest';
import { ensureIdentity, loadIdentity, markBackupConfirmed } from '../storage';

describe('identity storage', () => {
  beforeEach(() => localStorage.clear());

  it('creates once and is stable across calls', async () => {
    const a = await ensureIdentity();
    const b = await ensureIdentity();
    expect(b.publicKeyHex).toBe(a.publicKeyHex);
    expect(JSON.parse(localStorage.getItem('aym_identity')!)).toMatchObject({ publicKeyHex: a.publicKeyHex });
  });

  it('starts without backup confirmation and can confirm it', async () => {
    expect((await ensureIdentity()).backupConfirmedAt).toBeNull();
    expect(markBackupConfirmed().backupConfirmedAt).toBeTypeOf('number');
  });

  it('recovers from corrupted storage', async () => {
    localStorage.setItem('aym_identity', '{not json');
    expect(loadIdentity()).toBeNull();
    await expect(ensureIdentity()).resolves.toBeDefined();
  });
});
