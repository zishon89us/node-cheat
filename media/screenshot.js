//------------------------------------------------------
// Capture screenshots of a website at several viewport sizes (headless Chromium via Playwright)
// Web Link=> https://playwright.dev/docs/screenshots
// Setup: npx playwright install chromium
// Run: node screenshot.js [url]
//------------------------------------------------------

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium, devices } from 'playwright';

const url = process.argv[2] ?? 'https://github.com/zishon89us/node-cheat';
const outDir = path.join(import.meta.dirname, 'screenshot_dest');
const targets = [
  { name: '1920x1080', viewport: { width: 1920, height: 1080 } },
  { name: '1024x768', viewport: { width: 1024, height: 768 } },
  { name: 'iphone-15', ...devices['iPhone 15'] },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const { name, ...contextOptions } of targets) {
    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(outDir, `${name}.png`),
      fullPage: name !== 'iphone-15',
    });
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`Screenshots saved to ${outDir}`);
