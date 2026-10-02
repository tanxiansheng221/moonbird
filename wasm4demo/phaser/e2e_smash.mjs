import { chromium } from 'playwright';
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
page.on('pageerror', e => errs.push(String(e)));
await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const box = await page.locator('canvas').boundingBox();
const ax = box.x + 180, ay = box.y + 390;
const st = () => page.evaluate(() => { const g = window.__g(), G = window.__G; return { lv: G.api_get_level(g), ph: G.api_get_phase(g), sc: G.api_get_score(g) }; });
const shoot = async (dx, dy) => {
  await page.mouse.move(ax, ay); await page.mouse.down();
  await page.mouse.move(ax - dx, ay + dy); await page.waitForTimeout(30);
  await page.mouse.up();
  for (let t = 0; t < 60; t++) { await page.waitForTimeout(200); if ((await st()).ph === 0) return true; }
  return false;
};
console.log('start', await st());
// 多角度多力度连射 12 次，验证「撞击即时碎裂+得分」
for (let s = 1; s <= 12; s++) {
  const dx = 60 + (s % 4) * 12, dy = (s % 2) * 20;
  const ok = await shoot(dx, dy);
  const w = await st();
  console.log(`shot${s} d=(${dx},${dy}) ok=${ok}`, w);
  if (errs.length) break;
  if (w.lv > 1) break;
  if (!ok) break;
}
console.log('final', await st(), 'errors:', errs.length ? errs : '无');
await b.close();
