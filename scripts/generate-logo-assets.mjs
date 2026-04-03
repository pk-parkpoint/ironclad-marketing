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
    primary: "#10243B",
    secondary: "#2563EB",
  },
  {
    key: "clear-light",
    background: null,
    primary: "#FFFFFF",
    secondary: "#D9E9FF",
  },
  {
    key: "white-dark",
    background: "#FFFFFF",
    primary: "#10243B",
    secondary: "#2563EB",
  },
  {
    key: "blue-light",
    background: "#0F2744",
    primary: "#FFFFFF",
    secondary: "#D9E9FF",
  },
];

function buildSvg({ background, primary, secondary }, iconBase64, fontBase64) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <style>
    @font-face {
      font-family: "Garet Logo";
      src: url("data:font/otf;base64,${fontBase64}") format("opentype");
      font-style: normal;
      font-weight: 700;
    }
    .wordmark-main {
      fill: ${primary};
      font-family: "Garet Logo", sans-serif;
      font-size: 124px;
      font-weight: 700;
      letter-spacing: -0.055em;
    }
    .wordmark-sub {
      fill: ${secondary};
      font-family: "Garet Logo", sans-serif;
      font-size: 54px;
      font-weight: 700;
      letter-spacing: 0.16em;
    }
  </style>
  ${background ? `<rect x="0" y="0" width="${width}" height="${height}" rx="28" fill="${background}" />` : ""}
  <image x="42" y="58" width="204" height="204" href="data:image/svg+xml;base64,${iconBase64}" />
  <text x="286" y="152" class="wordmark-main">Ironclad</text>
  <text x="293" y="226" class="wordmark-sub">PLUMBING</text>
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
