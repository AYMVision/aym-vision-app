// scripts/build-images.mjs
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const INPUT_ROOT = path.join(ROOT, "src", "assets_master");
const OUTPUT_ROOT = path.join(ROOT, "public", "media");

// Qualität/Encoding
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 50;

// Regeln pro Bereich
const RULES = [
  {
    match: (rel) => rel.startsWith("avatars/base/") && rel.endsWith(".png"),
    sizes: [256, 512],
  },
  {
    match: (rel) => rel.startsWith("avatars/full/") && rel.endsWith(".png"),
    sizes: [384, 768],
  },
  {
    match: (rel) => rel.startsWith("items/") && rel.endsWith(".png"),
    sizes: [512],
  },
  {
    match: (rel) => rel.startsWith("story/characters/") && rel.endsWith(".png"),
    sizes: [256, 512],
  },
  {
    match: (rel) => rel.startsWith("story/episodes/") && rel.endsWith(".png"),
    sizes: [512, 1024],
  },
  {
    match: (rel) => rel.startsWith("story/ui/") && rel.endsWith(".png"),
    sizes: [128, 256, 512],
  },

  // UI: welcome banner (groß)
  {
    match: (rel) => rel.startsWith("ui/welcome/") && (rel.endsWith(".png") || rel.endsWith(".jpg") || rel.endsWith(".jpeg")),
    sizes: [768, 1024, 1536],
  },

  // UI: stories/about/notfound (mittlere Motive)
  {
    match: (rel) =>
      (rel.startsWith("ui/stories/") || rel.startsWith("ui/about/") || rel.startsWith("ui/concept/") || rel.startsWith("ui/notfound/")) &&
      (rel.endsWith(".png") || rel.endsWith(".jpg") || rel.endsWith(".jpeg")),
    sizes: [512, 1024],
  },

  // UI: brand/icons (kleiner)
  {
    match: (rel) => rel.startsWith("ui/brand/") && (rel.endsWith(".png") || rel.endsWith(".jpg") || rel.endsWith(".jpeg")),
    sizes: [256, 512],
  },

    // UI: Bonus (kleiner)
  {
    match: (rel) => rel.startsWith("newspaper/") && (rel.endsWith(".png") || rel.endsWith(".jpg") || rel.endsWith(".jpeg")),
    sizes: [512, 1024],
  },



      // Stickers (kleiner)
  {
    match: (rel) => rel.startsWith("stickers/") && (rel.endsWith(".png") || rel.endsWith(".jpg") || rel.endsWith(".jpeg")),
    sizes: [256, 512],
  },

];


// ---------- Helpers ----------
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function pickRule(rel) {
  return RULES.find((r) => r.match(rel));
}

function outBasePath(relNoExt) {
  // relNoExt like: avatars/base/kid_01
  return path.join(OUTPUT_ROOT, relNoExt);
}

async function buildOne(inFile, rel) {
  const rule = pickRule(rel);
  console.log("rule:", rule ? rule.sizes : "NONE", "for", rel);
  if (!rule) return { skipped: true };

  const relNoExt = rel.replace(/\.(png|jpg|jpeg)$/i, "");
  const outDir = path.dirname(outBasePath(relNoExt));
  await ensureDir(outDir);

  // sharp pipeline
  // NOTE: keep alpha (transparent) automatically
  const input = sharp(inFile, { failOnError: false });

  // Für PNG mit Transparenz ist das ok — keine Hintergrundfarbe setzen!
  const tasks = [];

  for (const w of rule.sizes) {
    // WebP
    tasks.push(
      input
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(`${outBasePath(relNoExt)}-${w}.webp`)
    );

    // AVIF
    tasks.push(
      input
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .avif({ quality: AVIF_QUALITY })
        .toFile(`${outBasePath(relNoExt)}-${w}.avif`)
    );
  }

  await Promise.all(tasks);
  return { skipped: false };
}

async function main() {
  console.log("🧩 build-images: input =", INPUT_ROOT);
  console.log("🧩 build-images: output=", OUTPUT_ROOT);

  // Output root sicherstellen
  await ensureDir(OUTPUT_ROOT);

  let processed = 0;
  let skipped = 0;

for await (const file of walk(INPUT_ROOT)) {
  const rel = toPosix(path.relative(INPUT_ROOT, file)); // ✅ rel ist erst HIER definiert
  console.log("found:", rel); // ✅ Debug: zeigt alle gefundenen Dateien
  

  const low = rel.toLowerCase();
  if (!(low.endsWith(".png") || low.endsWith(".jpg") || low.endsWith(".jpeg"))) continue;

  const res = await buildOne(file, rel);
  if (res.skipped) skipped++;
  else processed++;
}

  console.log(`✅ done. processed=${processed}, skipped=${skipped}`);
}

main().catch((e) => {
  console.error("❌ build-images failed:", e);
  process.exit(1);
});
