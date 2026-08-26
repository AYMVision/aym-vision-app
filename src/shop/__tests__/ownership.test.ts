import { describe, it, expect, beforeEach, vi } from 'vitest';
import { refreshOwnership, isOwnedLocally } from '../ownership';

vi.mock('../../identity/handshake', () => ({
  aymFetch: vi.fn(),
}));

vi.mock('../../gating/entitlements', () => ({
  unlockEpisodePaywallOnly: vi.fn(),
  setBypassUntil: vi.fn(),
}));

vi.mock('../../identity/storage', () => ({
  loadIdentity: vi.fn().mockReturnValue({
    mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    publicKeyHex: 'test-pubkey',
    backupConfirmedAt: null,
    createdAt: 0,
  }),
}));

vi.mock('../../identity/keys', async (importOriginal) => {
  const original = await importOriginal() as Record<string, unknown>;
  return { ...original, deriveBackendProfileId: vi.fn(() => 'backend-profile-123') };
});

const mockGetActiveProfileId = vi.fn().mockReturnValue('p1');
vi.mock('../../profile/profileStorage', () => ({
  getActiveProfileId: () => mockGetActiveProfileId(),
  pStorage: { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() },
}));

import { aymFetch } from '../../identity/handshake';
import { unlockEpisodePaywallOnly } from '../../gating/entitlements';

describe('ownership', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockGetActiveProfileId.mockReturnValue('p1');
  });

  it('404 → returns empty list and writes no entitlements', async () => {
    vi.mocked(aymFetch).mockResolvedValueOnce(new Response(null, { status: 404 }));
    const result = await refreshOwnership();
    expect(result).toEqual([]);
    expect(unlockEpisodePaywallOnly).not.toHaveBeenCalled();
    expect(localStorage.getItem('aym_p_p1__aym_owned_content')).toBeNull();
  });

  it('owned list → updates entitlements and caches under active profileId', async () => {
    vi.mocked(aymFetch).mockResolvedValueOnce(
      new Response(JSON.stringify([{ contentId: 's1e01' }, { contentId: 's1e02' }]), { status: 200 })
    );
    const result = await refreshOwnership();
    expect(result).toEqual(['s1e01', 's1e02']);
    expect(unlockEpisodePaywallOnly).toHaveBeenCalledWith('s1e01');
    expect(unlockEpisodePaywallOnly).toHaveBeenCalledWith('s1e02');
    const cached = JSON.parse(localStorage.getItem('aym_p_p1__aym_owned_content')!);
    expect(cached).toEqual(['s1e01', 's1e02']);
  });

  it('offline (fetch throws) → falls back to cached list', async () => {
    localStorage.setItem('aym_p_p1__aym_owned_content', JSON.stringify(['s1e01']));
    vi.mocked(aymFetch).mockRejectedValueOnce(new Error('Network error'));
    const result = await refreshOwnership();
    expect(result).toEqual(['s1e01']);
  });

  it('offline with no cache → returns empty list', async () => {
    vi.mocked(aymFetch).mockRejectedValueOnce(new Error('Network error'));
    const result = await refreshOwnership();
    expect(result).toEqual([]);
  });

  it('isOwnedLocally reads from profile-scoped cache', () => {
    localStorage.setItem('aym_p_p1__aym_owned_content', JSON.stringify(['s1e01']));
    expect(isOwnedLocally('p1', 's1e01')).toBe(true);
    expect(isOwnedLocally('p1', 's1e02')).toBe(false);
    expect(isOwnedLocally('p2', 's1e01')).toBe(false);
  });

  it('two active profiles have independent caches', async () => {
    mockGetActiveProfileId.mockReturnValue('profil-A');
    vi.mocked(aymFetch).mockResolvedValueOnce(
      new Response(JSON.stringify([{ contentId: 's1e01' }]), { status: 200 })
    );
    await refreshOwnership();

    mockGetActiveProfileId.mockReturnValue('profil-B');
    vi.mocked(aymFetch).mockResolvedValueOnce(
      new Response(JSON.stringify([{ contentId: 's1e02' }]), { status: 200 })
    );
    await refreshOwnership();

    expect(isOwnedLocally('profil-A', 's1e01')).toBe(true);
    expect(isOwnedLocally('profil-A', 's1e02')).toBe(false);
    expect(isOwnedLocally('profil-B', 's1e01')).toBe(false);
    expect(isOwnedLocally('profil-B', 's1e02')).toBe(true);
  });
});
