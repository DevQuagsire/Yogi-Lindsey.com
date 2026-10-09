import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const photosDir = path.join(root, "photos");
const outDir = path.join(root, "public", "images");

/** Curated carousel sources (sound healing, portraits, teaching). */
const heroSources = [
  "IMG_5657.JPG",
  "Tezza-1692_Original.jpeg",
  "Facetune_07-04-2026-09-39-09_Original.jpg",
  "01348_judithrae_240626_08807.JPG",
  "IMG_4649.jpeg",
];

/** Extra gallery-ready stills (optimized for possible future use / about accents). */
const extraSources = [
  "IMG_4340.jpeg",
  "IMG_4628.jpeg",
  "IMG_4634.jpeg",
  "IMG_5546.jpeg",
  "IMG_5550.jpeg",
  "IMG_5557.jpeg",
  "IMG_5594.jpeg",
  "Tezza-8895_Original.jpeg",
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeOne(srcName, outName, width = 1920) {
  const input = path.join(photosDir, srcName);
  const output = path.join(outDir, outName);

  try {
    await fs.access(input);
  } catch {
    console.warn(`Skip missing: ${srcName}`);
    return;
  }

  const ext = path.extname(srcName).toLowerCase();
  let pipeline = sharp(input, { failOn: "none" }).rotate();

  if (ext === ".heic" || ext === ".heif") {
    // sharp may or may not decode HEIC depending on libvips build
    try {
      pipeline = sharp(input, { failOn: "none" }).rotate();
    } catch (err) {
      console.warn(`HEIC unsupported for ${srcName}: ${err.message}`);
      return;
    }
  }

  await pipeline
    .resize({ width, height: Math.round(width * 0.75), fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(output);

  const stat = await fs.stat(output);
  console.log(`Wrote ${outName} (${(stat.size / 1024).toFixed(0)} KB)`);
}

async function main() {
  await ensureDir(outDir);

  for (let i = 0; i < heroSources.length; i++) {
    await optimizeOne(heroSources[i], `hero-${i + 1}.jpg`, 1920);
  }

  for (let i = 0; i < extraSources.length; i++) {
    await optimizeOne(extraSources[i], `extra-${i + 1}.jpg`, 1400);
  }

  // HEIC needs a platform HEIF decoder; skip gracefully if unsupported
  const heics = ["01576_judithrae_240626_09035.HEIC", "01597_judithrae_240626_09056.HEIC"];
  for (const name of heics) {
    const input = path.join(photosDir, name);
    const outName = name.replace(/\.heic$/i, ".jpg");
    const output = path.join(outDir, outName);
    try {
      await sharp(input, { failOn: "none" })
        .rotate()
        .resize({ width: 1400, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(output);
      const stat = await fs.stat(output);
      if (stat.size < 1024) {
        await fs.unlink(output);
        console.warn(`Skipped empty HEIC output: ${name}`);
      } else {
        console.log(`Wrote ${outName} (${(stat.size / 1024).toFixed(0)} KB)`);
      }
    } catch (err) {
      console.warn(`Could not convert ${name}: ${err.message}`);
      try {
        await fs.unlink(output);
      } catch {
        /* ignore */
      }
    }
  }

  console.log("Image optimization complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
