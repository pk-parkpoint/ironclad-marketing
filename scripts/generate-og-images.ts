import { chromium } from "playwright";
import { readFile, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const OUTPUT_FILES = [
  "ironclad-default.png",
  "ironclad-service.png",
  "ironclad-location.png",
  "ironclad-blog.png",
] as const;

function buildHtml({ logoSvg, title }: { logoSvg: string; title: string }): string {
  // Note: Keep this self-contained and deterministic (no external fonts/assets).
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=${OG_WIDTH}, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root {
        --bg: #ffffff;
        --text: #0b1220;
      }
      html, body {
        width: ${OG_WIDTH}px;
        height: ${OG_HEIGHT}px;
        margin: 0;
        padding: 0;
        background: var(--bg);
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        color: var(--text);
      }
      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
      }
      .logo {
        width: 220px;
        height: 220px;
        display: grid;
        place-items: center;
      }
      .logo svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      h1 {
        margin: 0;
        font-size: 84px;
        line-height: 1.05;
        font-weight: 800;
        letter-spacing: -0.03em;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="logo" aria-hidden="true">
        ${logoSvg}
      </div>
      <h1>${title}</h1>
    </div>
  </body>
</html>`;
}

async function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const logoPath = path.join(repoRoot, "public", "media", "ip-logo.svg");
  const outputDir = path.join(repoRoot, "public", "og");
  const outputPrimary = path.join(outputDir, OUTPUT_FILES[0]);

  await mkdir(outputDir, { recursive: true });
  const logoSvgRaw = await readFile(logoPath, "utf8");

  const html = buildHtml({ logoSvg: logoSvgRaw, title: "Ironclad Plumbing" });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: OG_WIDTH, height: OG_HEIGHT },
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "load" });
    await page.screenshot({ path: outputPrimary, type: "png" });

    // Keep all OG templates consistent (and iMessage-friendly).
    for (const file of OUTPUT_FILES.slice(1)) {
      await copyFile(outputPrimary, path.join(outputDir, file));
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
