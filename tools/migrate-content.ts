// tools/migrate-content.ts
//
// Liest alle Episoden-TS-Dateien ein und schreibt bundle.json-Dateien
// für das private Content-Repo (https://github.com/AYMVision/aym-vision-stories).
//
// Ausführen (aus dem aym-vision-app-Verzeichnis):
//   npx tsx tools/migrate-content.ts
//
// Output: tools/bundles/s1e01/bundle.json  … s1e05/bundle.json
//
// Danach: alle Dateien aus tools/bundles/ ins private GitHub-Repo pushen.
// Dort wird erwartet: s1e01/bundle.json, s1e02/bundle.json usw.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..', 'src', 'story-v02', 'content');
const OUT = join(__dirname, 'bundles');

const EPISODES = ['s1e01', 's1e02', 's1e03', 's1e04', 's1e05'] as const;
const LANGS    = ['de', 'en'] as const;
const VERSION  = '1.0.0';

for (const episodeId of EPISODES) {
  const bundle: Record<string, string> = { version: VERSION };

  for (const lang of LANGS) {
    const filePath = join(SRC, lang, `${episodeId}.${lang}.ts`);
    const fileUrl  = pathToFileURL(filePath).href;

    const mod = await import(fileUrl) as { default: unknown };
    bundle[lang] = Buffer.from(JSON.stringify(mod.default)).toString('base64');
  }

  const outDir = join(OUT, episodeId);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'bundle.json'), JSON.stringify(bundle, null, 2));
  console.log(`✅  ${episodeId}/bundle.json erstellt`);
}

console.log(`\n📦 Alle Bundles in: ${OUT}`);
console.log('Nächster Schritt: Inhalt von tools/bundles/ ins private Repo pushen.');
