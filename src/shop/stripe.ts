import { blake2b } from '@noble/hashes/blake2.js';
import { hexToBytes, bytesToHex } from '@noble/hashes/utils.js';

function getPaymentLinks(): Record<string, string> {
  try {
    const raw = import.meta.env.VITE_STRIPE_LINK_BASE;
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function computeProfileHash(publicKeyHex: string, profileId: string): string {
  const pubBytes = hexToBytes(publicKeyHex);
  const profileBytes = new TextEncoder().encode(profileId);
  const combined = new Uint8Array(pubBytes.length + profileBytes.length);
  combined.set(pubBytes);
  combined.set(profileBytes, pubBytes.length);
  return bytesToHex(blake2b(combined, { dkLen: 28 }));
}

export function paymentLinkFor(contentId: string, profileHash: string): string {
  const links = getPaymentLinks();
  const base = links[contentId];
  if (!base) throw new Error(`No payment link configured for contentId: ${contentId}`);
  return `${base}?client_reference_id=${profileHash}`;
}

export function extractSessionId(returnUrl: string): string | null {
  try {
    const url = new URL(returnUrl);
    return url.searchParams.get('session_id');
  } catch {
    return null;
  }
}
