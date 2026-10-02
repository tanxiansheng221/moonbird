import { chromium } from 'playwright';
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const box = await page.locator('canvas').boundingBox();
// 第一发正常打出去
const ax = box.x + 180, ay = box.y + 390;
await page.mouse.move(ax, ay); await page.mouse.down();
for (let i = 1; i <= 6; i++) { await page.mouse.move(ax - i * 12, ay + i * 8); await page.waitForTimeout(20); }
await page.mouse.up();
// 等回到 Aiming
for (let t = 0; t < 40; t++) { await page.waitForTimeout(200); if ((await page.evaluate(() => window.__G.api_get_phase(window.__g()))) === 0) break; }
console.log('back to aiming');
// 第二发
await page.mouse.move(ax, ay); await page.mouse.down();
for (let i = 1; i <= 6; i++) { await page.mouse.move(ax - i * 12, ay + i * 8); await page.waitForTimeout(20); }
await page.mouse.up();
// 详细监控 15 秒
for (let t = 0; t < 15; t++) {
  await page.waitForTimeout(1000);
  const s = await page.evaluate(() => {
    const g = window.__g(); const G = window.__G;
    const T = a => Array.isArray(a) ? a : Object.keys(a).sort((x, y) => +x.slice(1) - +y.slice(1)).map(k => a[k]);
    const out = [];
    for (let j = 0; j < G.api_get_entity_count(g); j++) {
      const e = T(G.api_get_entity(g, j));
      out.push(`k${e[0]}@${e[5].toFixed(0)},${e[6].toFixed(0)}`);
    }
    return { ph: G.api_get_phase(g), n: G.api_get_entity_count(g), ents: out.join(' ') };
  });
  console.log(`t+${t + 1}s ph=${s.ph} n=${s.n} ${s.ents}`);
}
await b.close();
