// Scrape a page whose results load as you scroll, using a headless browser (Playwright).
// Install: npm i playwright && npx playwright install chromium
// Run: SCRAPE_URL=https://example.com node media/scraping/dynamic_webpages_scraping.js

import { chromium } from 'playwright';

const url = process.env.SCRAPE_URL;
if (!url) throw new Error('Set SCRAPE_URL');
const itemSelector = process.env.SCRAPE_SELECTOR ?? 'a';

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  for (let i = 0; i < 5; i++) {
    const before = await page.locator(itemSelector).count();
    await page.mouse.wheel(0, 10_000);
    await page.waitForTimeout(1000);
    if ((await page.locator(itemSelector).count()) === before) break;
  }

  const items = await page.locator(itemSelector).allInnerTexts();
  console.log(items.map((t) => t.trim()).filter(Boolean));
} finally {
  await browser.close();
}
