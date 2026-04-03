import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const logoDir = path.join(rootDir, "public", "media", "logo");
const fontPath = path.join(logoDir, "garet-bold.otf");
const iconPath = path.join(rootDir, "public", "media", "ip-logo.svg");

const width = 1100;
const height = 320;
const rasterSizes = [256, 512, 1024];

const variants = [
  {
    key: "clear-dark",
    background: null,
    wordmark: "#1B4D8E",
  },
  {
    key: "clear-light",
    background: null,
    wordmark: "#FFFFFF",
  },
  {
    key: "white-dark",
    background: "#FFFFFF",
    wordmark: "#1B4D8E",
  },
  {
    key: "blue-light",
    background: "#1B4D8E",
    wordmark: "#FFFFFF",
  },
];

function buildSvg({ background, wordmark }, iconBase64, fontBase64) {
  const iconX = 42;
  const iconY = 58;
  const iconSize = 204;
  const textX = 286;
  const centerY = iconY + iconSize / 2;
  const lineOffset = 38;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <style>
    @font-face {
      font-family: "Garet Logo";
      src: url("data:font/otf;base64,${fontBase64}") format("opentype");
      font-style: normal;
      font-weight: 700;
    }
    .wordmark-line {
      fill: ${wordmark};
      font-family: "Garet Logo", sans-serif;
      font-size: 72px;
      font-weight: 700;
      letter-spacing: -0.03em;
    }
  </style>
  ${background ? `<rect x="0" y="0" width="${width}" height="${height}" rx="28" fill="${background}" />` : ""}
  <image x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" href="data:image/svg+xml;base64,${iconBase64}" />
  <text x="${textX}" y="${centerY - lineOffset}" class="wordmark-line" dominant-baseline="middle">IRONCLAD</text>
  <text x="${textX}" y="${centerY + lineOffset}" class="wordmark-line" dominant-baseline="middle">PLUMBING</text>
</svg>`;
}

async function main() {
  await fs.mkdir(logoDir, { recursive: true });

  const [iconBuffer, fontBuffer] = await Promise.all([
    fs.readFile(iconPath),
    fs.readFile(fontPath),
  ]);

  const iconBase64 = iconBuffer.toString("base64");
  const fontBase64 = fontBuffer.toString("base64");

  for (const variant of variants) {
    const svg = buildSvg(variant, iconBase64, fontBase64);
    const svgPath = path.join(logoDir, `ironclad-logo-${variant.key}.svg`);
    await fs.writeFile(svgPath, svg, "utf8");

    for (const size of rasterSizes) {
      const pngPath = path.join(logoDir, `ironclad-logo-${variant.key}-${size}.png`);
      const webpPath = path.join(logoDir, `ironclad-logo-${variant.key}-${size}.webp`);

      await sharp(Buffer.from(svg))
        .resize({ width: size })
        .png()
        .toFile(pngPath);

      await sharp(Buffer.from(svg))
        .resize({ width: size })
        .webp({ quality: 92 })
        .toFile(webpPath);
    }
  }
}

await main();
