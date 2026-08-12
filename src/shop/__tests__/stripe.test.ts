import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { paymentLinkFor, extractSessionId, computeProfileHash } from '../stripe';

const PAYMENT_LINKS = JSON.stringify({
  s1e01: 'https://buy.stripe.com/test123',
  s1e02: 'https://buy.stripe.com/test456',
});

describe('stripe', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_STRIPE_LINK_BASE', PAYMENT_LINKS);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('paymentLinkFor', () => {
    it('builds payment link with client_reference_id', () => {
      const link = paymentLinkFor('s1e01', 'abc123');
      expect(link).toBe('https://buy.stripe.com/test123?client_reference_id=abc123');
    });

    it('throws for unknown contentId', () => {
      expect(() => paymentLinkFor('unknown', 'abc123')).toThrow();
    });

    it('includes profile hash verbatim in the URL', () => {
      const hash = 'deadbeef00112233445566778899aabbccddeeff00112233445566778899aabb';
      const link = paymentLinkFor('s1e02', hash);
      expect(link).toContain(`client_reference_id=${hash}`);
    });
  });

  describe('extractSessionId', () => {
    it('parses session_id from return URL', () => {
      expect(extractSessionId('https://app.aym.de/shop/return?session_id=cs_test_abc123')).toBe('cs_test_abc123');
    });

    it('returns null when session_id is missing', () => {
      expect(extractSessionId('https://app.aym.de/shop/return')).toBeNull();
    });

    it('returns null for invalid URL', () => {
      expect(extractSessionId('not-a-url')).toBeNull();
    });
  });

  describe('computeProfileHash', () => {
    it('produces a 56-hex-char (28-byte) blake2b hash', () => {
      const hash = computeProfileHash('a'.repeat(64), 'aym_p_testprofile');
      expect(hash).toMatch(/^[0-9a-f]{56}$/);
    });

    it('is deterministic for same inputs', () => {
      const h1 = computeProfileHash('a'.repeat(64), 'profile1');
      const h2 = computeProfileHash('a'.repeat(64), 'profile1');
      expect(h1).toBe(h2);
    });

    it('differs for different profileIds', () => {
      const h1 = computeProfileHash('a'.repeat(64), 'profile1');
      const h2 = computeProfileHash('a'.repeat(64), 'profile2');
      expect(h1).not.toBe(h2);
    });

    it('differs for different publicKeys', () => {
      const h1 = computeProfileHash('a'.repeat(64), 'profile1');
      const h2 = computeProfileHash('b'.repeat(64), 'profile1');
      expect(h1).not.toBe(h2);
    });
  });
});
