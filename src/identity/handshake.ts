import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { loadIdentity } from './storage';
import { signPayload } from './keys';

export function canonicalPayload(method: string, path: string, nonce: string, body?: string): string {
  const bodyBytes = body ? new TextEncoder().encode(body) : new Uint8Array(0);
  const bodyHash = bytesToHex(sha256(bodyBytes));
  return `AYM1|${method}|${path}|${nonce}|${bodyHash}`;
}

export async function aymFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const identity = loadIdentity();
  if (!identity) throw new Error('No identity — call ensureIdentity() first');

  const base = (import.meta.env.VITE_AYM_BACKEND_URL ?? '').replace(/\/$/, '');
  const method = (init.method ?? 'GET').toUpperCase();
  const body = init.body as string | undefined;

  const challengeRes = await fetch(`${base}/api/v1/aym/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey: identity.publicKeyHex }),
  });
  if (!challengeRes.ok) throw new Error(`Challenge failed: ${challengeRes.status}`);
  const { nonce } = await challengeRes.json() as { nonce: string };

  const payload = canonicalPayload(method, path, nonce, body);
  const signature = await signPayload(identity.mnemonic, payload);

  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string> | undefined),
      'X-Aym-Public-Key': identity.publicKeyHex,
      'X-Aym-Nonce': nonce,
      'X-Aym-Signature': signature,
    },
  });
}
