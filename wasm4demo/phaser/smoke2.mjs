import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const snap = () => page.evaluate(() => {
  const g = window.__g();
  return {
    phase: window.__G.api_get_phase(g),
    ents: window.__G.api_get_entity_count(g),
    bird: window.__G.api_get_entity(g, 0),
    dragging: window.__G.api_get_dragging(g),
  };
});

console.log('initial', JSON.stringify(await snap()));
// 等 3 秒确认鸭不掉（Aiming 休眠修复）
await page.waitForTimeout(3000);
const a3 = await snap();
console.log('after3s', JSON.stringify(a3));

// 拖拽发射
await page.mouse.move(150, 430);
await page.mouse.down();
await page.mouse.move(110, 470, { steps: 10 });
await page.mouse.up();
await page.waitForTimeout(300);
console.log('dragging/flying', JSON.stringify(await snap()));
await page.waitForTimeout(4000);
const after = await snap();
console.log('after4s', JSON.stringify(after));

await page.screenshot({ path: 'smoke2.png' });
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
