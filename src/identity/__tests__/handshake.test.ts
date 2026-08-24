import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { canonicalPayload } from '../handshake';

describe('canonicalPayload', () => {
  it('builds the correct canonical string', () => {
    const body = JSON.stringify({ voucherId: 'x' });
    const expected =
      'AYM1|POST|/api/v1/extension/aym-vision/voucher/redeem|n1|b48e8e341e25dd70936fb23d8e4129bf27658ea2bc462ca204547a9a747f043a';
    expect(canonicalPayload('POST', '/api/v1/extension/aym-vision/voucher/redeem', 'n1', body)).toBe(expected);
  });

  it('uses sha256 of empty string when no body', () => {
    const emptyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    expect(canonicalPayload('GET', '/api/v1/extension/aym-vision/content', 'n2')).toBe(
      `AYM1|GET|/api/v1/extension/aym-vision/content|n2|${emptyHash}`
    );
  });
});

describe('aymFetch', () => {
  beforeEach(() => {
    localStorage.setItem(
      'aym_identity',
      JSON.stringify({
        mnemonic:
          'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art',
        publicKeyHex: 'placeholder',
        backupConfirmedAt: null,
        createdAt: 0,
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('calls challenge then the real endpoint with the right headers', async () => {
    const { aymFetch } = await import('../handshake');
    const fetchCalls: { url: string; init: RequestInit }[] = [];

    vi.stubGlobal('fetch', async (url: string, init: RequestInit = {}) => {
      fetchCalls.push({ url, init });
      if (url.includes('/challenge')) {
        return new Response(JSON.stringify({ nonce: 'test-nonce-123' }), { status: 200 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });

    import.meta.env.VITE_AYM_BACKEND_URL = 'http://localhost:9090';

    const res = await aymFetch('/api/v1/extension/aym-vision/content?profileId=p1');
    expect(res.ok).toBe(true);
    expect(fetchCalls).toHaveLength(2);
    expect(fetchCalls[0].url).toContain('/challenge');
    const headers = fetchCalls[1].init.headers as Record<string, string>;
    expect(headers['X-Aym-Public-Key']).toBeTruthy();
    expect(headers['X-Aym-Nonce']).toBe('test-nonce-123');
    expect(headers['X-Aym-Signature']).toMatch(/^[0-9a-f]{128}$/);
  });
});
