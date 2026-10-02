// 怒鸭大战
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1300, height: 760 } });
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
await page.goto('http://localhost:5199/', { waitUntil: 'load' });
await page.waitForTimeout(2500);
const canvas = page.locator('#game canvas');
const box = await canvas.boundingBox();
const scale = box.width / 1280;
const snap = async tag => {
  const s = await page.evaluate(() => {
    const g = window.__dbg.g, G = window.__G;
    const out = { phase: G.api_get_phase(g), score: G.api_get_score(g), cam: Math.round(G.api_get_cam_x(g)), ents: [] };
    for (let i = 0; i < G.api_get_entity_count(g); i++) {
      const e = G.api_get_entity(g, i);
      const a = Object.keys(e).sort((x, y) => +x.slice(1) - +y.slice(1)).map(k => e[k]);
      out.ents.push([a[0], Math.round(a[5]), Math.round(a[6])]);
    }
    return out;
  });
  console.log(tag, JSON.stringify(s));
};
await snap('t0_load:');
const sx = box.x + 180 * scale, sy = box.y + 530 * scale;
await page.mouse.move(sx, sy); await page.mouse.down();
await page.mouse.move(sx - 90 * scale, sy + 60 * scale, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(4000);
await snap('t1_fly:');
await page.keyboard.press('KeyR');
await page.waitForTimeout(3000);
await snap('t2_afterR:');
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO_ERRORS');
await browser.close();
process.exit(errors.length ? 1 : 0);
