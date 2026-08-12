// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createVouchers } from '../create-vouchers';

vi.mock('qrcode', () => ({
  default: { toBuffer: vi.fn().mockResolvedValue(Buffer.from('PNG')) },
}));

const MNEMONIC =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon ' +
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

describe('createVouchers', () => {
  const fetchCalls: Array<{ url: string; init: RequestInit }> = [];
  const writtenFiles: Array<{ path: string; data: Buffer | string }> = [];

  beforeEach(() => {
    fetchCalls.length = 0;
    writtenFiles.length = 0;
  });

  function mockFetch(nonce = 'nonce-abc', voucherIds = ['id-1', 'id-2', 'id-3']) {
    return async (url: string, init: RequestInit = {}) => {
      fetchCalls.push({ url, init });
      if ((url as string).includes('/challenge')) {
        return { ok: true, json: async () => ({ nonce }) } as Response;
      }
      return {
        ok: true,
        json: async () => ({ vouchers: voucherIds.map(id => ({ id, contentId: 's1e04' })) }),
      } as Response;
    };
  }

  function mockWrite() {
    return async (path: string, data: Buffer | string) => {
      writtenFiles.push({ path, data });
    };
  }

  it('calls challenge then voucher/create', async () => {
    await createVouchers({
      contentId: 's1e04',
      count: 3,
      mnemonic: MNEMONIC,
      backendUrl: 'http://localhost:9090',
      appUrl: 'https://app.example.com',
      fetch: mockFetch() as any,
      writeFile: mockWrite(),
    });

    expect(fetchCalls).toHaveLength(2);
    expect(fetchCalls[0].url).toContain('/api/v1/aym/challenge');
    expect(fetchCalls[1].url).toContain('/api/v1/aym/voucher/create');
  });

  it('sends handshake headers on create request', async () => {
    await createVouchers({
      contentId: 's1e04',
      count: 3,
      mnemonic: MNEMONIC,
      backendUrl: 'http://localhost:9090',
      appUrl: 'https://app.example.com',
      fetch: mockFetch('test-nonce') as any,
      writeFile: mockWrite(),
    });

    const headers = fetchCalls[1].init.headers as Record<string, string>;
    expect(headers['X-Aym-Public-Key']).toMatch(/^[0-9a-f]{64}$/);
    expect(headers['X-Aym-Nonce']).toBe('test-nonce');
    expect(headers['X-Aym-Signature']).toMatch(/^[0-9a-f]{128}$/);
  });

  it('canonical payload uses AYM1|POST|path|nonce|sha256(body) format — nonce flows from challenge', async () => {
    const nonce = 'n42';
    await createVouchers({
      contentId: 's1e04',
      count: 3,
      mnemonic: MNEMONIC,
      backendUrl: 'http://localhost:9090',
      appUrl: 'https://app.example.com',
      fetch: mockFetch(nonce) as any,
      writeFile: mockWrite(),
    });

    const headers = fetchCalls[1].init.headers as Record<string, string>;
    expect(headers['X-Aym-Nonce']).toBe(nonce);
    expect(JSON.parse(fetchCalls[1].init.body as string)).toEqual({ contentId: 's1e04', count: 3 });
  });

  it('writes CSV and one QR PNG per voucher', async () => {
    await createVouchers({
      contentId: 's1e04',
      count: 3,
      mnemonic: MNEMONIC,
      backendUrl: 'http://localhost:9090',
      appUrl: 'https://app.example.com',
      fetch: mockFetch('n1', ['aaa-1', 'bbb-2', 'ccc-3']) as any,
      writeFile: mockWrite(),
    });

    expect(writtenFiles).toHaveLength(4); // 3 QRs + 1 CSV
    const csv = writtenFiles.find(f => f.path.endsWith('vouchers-s1e04.csv'));
    expect(csv).toBeDefined();
    expect(csv!.data.toString()).toContain('aaa-1');
    expect(writtenFiles.filter(f => f.path.includes('qr-'))).toHaveLength(3);
  });

  it('redeem URLs use app base URL and /redeem-voucher path', async () => {
    const results = await createVouchers({
      contentId: 's1e04',
      count: 1,
      mnemonic: MNEMONIC,
      backendUrl: 'http://localhost:9090',
      appUrl: 'https://aym.vision',
      fetch: mockFetch('n1', ['my-uuid-001']) as any,
      writeFile: mockWrite(),
    });

    expect(results[0].redeemUrl).toBe('https://aym.vision/redeem-voucher?voucher=my-uuid-001');
  });
});
