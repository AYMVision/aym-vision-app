// scripts/generate-articles-meta.js
// Reads all article.*.md frontmatter and generates public/articles-meta.json
// Run: node scripts/generate-articles-meta.js

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ARTICLES_DIR = 'public/media/newspaper/articles';
const OUTPUT = 'public/articles-meta.json';

function parseFrontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!match) return {};
  const meta = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon < 1) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    // parse arrays: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    }
    meta[key] = val;
  }
  return meta;
}

const result = {};

for (const folder of readdirSync(ARTICLES_DIR)) {
  const folderPath = join(ARTICLES_DIR, folder);
  if (!statSync(folderPath).isDirectory()) continue;

  result[folder] = {};

  for (const file of readdirSync(folderPath)) {
    const langMatch = /^article\.([a-z]+)\.md$/.exec(file);
    if (!langMatch) continue;
    const lang = langMatch[1];
    const text = readFileSync(join(folderPath, file), 'utf8');
    result[folder][lang] = parseFrontmatter(text);
  }
}

writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
console.log(`✓ articles-meta.json written (${Object.keys(result).length} articles)`);
