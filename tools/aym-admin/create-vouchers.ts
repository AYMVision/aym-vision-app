import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { mnemonicToEntropy } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { Bip32PrivateKey } from '@stricahq/bip32ed25519';
import { Buffer } from 'buffer';
import QRCode from 'qrcode';
import { promises as fsPromises } from 'node:fs';

// CIP-1852 key derivation — mirrors src/identity/keys.ts#deriveKey
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

// Canonical payload — mirrors src/identity/handshake.ts#canonicalPayload
function canonicalPayload(method: string, path: string, nonce: string, body: string): string {
  const bodyHash = bytesToHex(sha256(new TextEncoder().encode(body)));
  return `AYM1|${method}|${path}|${nonce}|${bodyHash}`;
}

export interface VoucherResult {
  id: string;
  redeemUrl: string;
  qrPath: string;
}

export interface RunOptions {
  contentId: string;
  count: number;
  mnemonic: string;
  backendUrl: string;
  appUrl: string;
  outDir?: string;
  fetch?: typeof globalThis.fetch;
  writeFile?: (path: string, data: Buffer | string) => Promise<void>;
}

export async function createVouchers(options: RunOptions): Promise<VoucherResult[]> {
  const {
    contentId,
    count,
    mnemonic,
    backendUrl,
    appUrl,
    outDir = '.',
    fetch: fetchFn = globalThis.fetch,
    writeFile: writeFn = (p, d) => fsPromises.writeFile(p, d as Parameters<typeof fsPromises.writeFile>[1]),
  } = options;

  const key = await deriveKey(mnemonic);
  const publicKey = bytesToHex(new Uint8Array(key.toPublicKey().toBytes()));

  // 1. Request nonce via challenge
  const base = backendUrl.replace(/\/$/, '');
  const challengeRes = await fetchFn(`${base}/api/v1/aym/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey }),
  });
  if (!challengeRes.ok) throw new Error(`Challenge failed: ${challengeRes.status}`);
  const { nonce } = (await challengeRes.json()) as { nonce: string };

  // 2. Create vouchers — master-key signature
  const body = JSON.stringify({ contentId, count });
  const payload = canonicalPayload('POST', '/api/v1/aym/voucher/create', nonce, body);
  const signature = bytesToHex(new Uint8Array(key.sign(Buffer.from(payload, 'utf8'))));

  const createRes = await fetchFn(`${base}/api/v1/aym/voucher/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Aym-Public-Key': publicKey,
      'X-Aym-Nonce': nonce,
      'X-Aym-Signature': signature,
    },
    body,
  });
  if (!createRes.ok) throw new Error(`Create failed: ${createRes.status}`);
  const { vouchers } = (await createRes.json()) as { vouchers: Array<{ id: string; contentId: string }> };

  // 3. Write QR PNGs + CSV
  const appBase = appUrl.replace(/\/$/, '');
  const csvLines = ['id,redeemUrl'];
  const results: VoucherResult[] = [];

  for (const v of vouchers) {
    const redeemUrl = `${appBase}/redeem-voucher?voucher=${v.id}`;
    const qrPath = `${outDir}/qr-${v.id}.png`;
    const png = await QRCode.toBuffer(redeemUrl, { type: 'png' });
    await writeFn(qrPath, png);
    csvLines.push(`${v.id},${redeemUrl}`);
    console.log(redeemUrl);
    results.push({ id: v.id, redeemUrl, qrPath });
  }

  const csvPath = `${outDir}/vouchers-${contentId}.csv`;
  await writeFn(csvPath, csvLines.join('\n'));
  return results;
}

// CLI entrypoint — skipped when imported as a module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined; };

  const contentId = get('--content');
  const count = parseInt(get('--count') ?? '1', 10);
  if (!contentId) { console.error('Error: --content <id> is required'); process.exit(1); }

  const mnemonic = process.env.AYM_MASTER_MNEMONIC ?? '';
  if (!mnemonic) { console.error('Error: AYM_MASTER_MNEMONIC env is required (never a file)'); process.exit(1); }
  const backendUrl = process.env.AYM_BACKEND_URL ?? '';
  if (!backendUrl) { console.error('Error: AYM_BACKEND_URL env is required'); process.exit(1); }
  const appUrl = process.env.AYM_APP_URL ?? '';
  if (!appUrl) { console.error('Error: AYM_APP_URL env is required'); process.exit(1); }
  const outDir = get('--out') ?? '.';

  createVouchers({ contentId, count, mnemonic, backendUrl, appUrl, outDir })
    .then(results => {
      console.log(`\nCreated ${results.length} voucher(s) for "${contentId}"`);
      console.log(`CSV: ${outDir}/vouchers-${contentId}.csv`);
      process.exit(0);
    })
    .catch(e => { console.error(e.message); process.exit(1); });
}
