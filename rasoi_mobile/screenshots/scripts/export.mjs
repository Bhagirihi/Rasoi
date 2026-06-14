#!/usr/bin/env node
/**
 * Export 1290×2796 App Store PNGs after design approval.
 * Usage: npm run build && npm run export
 */
import { copyFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '..', 'app-store-assets');
const CANVAS = { width: 1290, height: 2796 };

const EXPORTS = [
  { id: 'hero', file: '01-hero.png' },
  { id: 'todays-picks', file: '02-todays-picks.png' },
  { id: 'pantry-match', file: '03-pantry-match.png' },
  { id: 'indian-regions', file: '04-indian-region-recipes.png' },
  { id: 'smart-filters', file: '05-partners.png' },
  { id: 'cook-shop-order', file: '06-notifications.png' },
  { id: 'personalization', file: '07-fuel-kitchen.png' },
  { id: 'final', file: '08-recipes.png' },
];

async function waitForPreview(url, ms = 60000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Preview server not ready: ${url}`);
}

function startPreview() {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['vite', 'preview', '--port', '5198', '--strictPort'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, BROWSER: 'none' },
    });

    let resolved = false;
    const base = 'http://localhost:5198';

    const onData = (chunk) => {
      const text = chunk.toString();
      if (!resolved && text.includes('Local:')) {
        resolved = true;
        void waitForPreview(base).then(() => resolve({ kill: () => child.kill(), base }));
      }
    };

    child.stdout?.on('data', onData);
    child.stderr?.on('data', onData);
    child.on('error', reject);
    child.on('exit', (code) => {
      if (!resolved) reject(new Error(`Preview exited ${code}`));
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        void waitForPreview(base).then(() => resolve({ kill: () => child.kill(), base }));
      }
    }, 8000);
  });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const preview = await startPreview();
  const browser = await chromium.launch();

  try {
    for (const { id, file } of EXPORTS) {
      const page = await browser.newPage({ viewport: CANVAS, deviceScaleFactor: 1 });
      await page.goto(`${preview.base}/?screen=${id}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(2500);

      const outPath = path.join(OUT, file);
      await page.locator('#screenshot-canvas').screenshot({ path: outPath, type: 'png' });
      await page.close();
      console.log(`✓ ${file}`);
    }
  } finally {
    await browser.close();
    preview.kill();
  }

  console.log(`\nExported → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
