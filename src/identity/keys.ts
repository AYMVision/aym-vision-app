import { generateMnemonic, mnemonicToEntropy, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { Bip32PrivateKey } from '@stricahq/bip32ed25519';
import { blake2b } from '@noble/hashes/blake2.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { Buffer } from 'buffer';

export type AymIdentity = { mnemonic: string; publicKeyHex: string };

async function deriveKey(mnemonic: string) {
  const entropy = mnemonicToEntropy(mnemonic, wordlist);
  const root = await Bip32PrivateKey.fromEntropy(Buffer.from(entropy));
  return root
    .deriveHardened(1852)
    .deriveHardened(1815)
    .deriveHardened(0)
    .derive(0)
    .derive(0)
    .toPrivateKey();
}

export async function generateIdentity(): Promise<AymIdentity> {
  const mnemonic = generateMnemonic(wordlist, 256);
  return restoreIdentity(mnemonic);
}

export async function restoreIdentity(mnemonic: string): Promise<AymIdentity> {
  if (!validateMnemonic(mnemonic.trim(), wordlist)) throw new Error('Invalid mnemonic');
  const key = await deriveKey(mnemonic.trim());
  const pubBytes = new Uint8Array(key.toPublicKey().toBytes());
  return { mnemonic: mnemonic.trim(), publicKeyHex: bytesToHex(pubBytes) };
}

export async function signPayload(mnemonic: string, payload: string): Promise<string> {
  const key = await deriveKey(mnemonic);
  return bytesToHex(new Uint8Array(key.sign(Buffer.from(payload, 'utf8'))));
}

export function publicKeyHash(publicKeyHex: string): string {
  return bytesToHex(blake2b(hexToBytes(publicKeyHex), { dkLen: 28 }));
}

export function deriveLinkEncryptionKey(mnemonic: string): Uint8Array {
  const entropy = mnemonicToEntropy(mnemonic.trim(), wordlist);
  return hkdf(sha256, entropy, undefined, new TextEncoder().encode('aym-link-encryption'), 32);
}

export function deriveBackupEncryptionKey(mnemonic: string): Uint8Array {
  const entropy = mnemonicToEntropy(mnemonic.trim(), wordlist);
  return hkdf(sha256, entropy, undefined, new TextEncoder().encode('aym-backup-encryption'), 32);
}

export function deriveBackendProfileId(mnemonic: string): string {
  const entropy = mnemonicToEntropy(mnemonic.trim(), wordlist);
  const derived = hkdf(sha256, entropy, undefined, new TextEncoder().encode('aym-backend-profile-id'), 32);
  return bytesToHex(derived);
}
