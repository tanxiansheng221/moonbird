// 怒鸭大战
import { chromium } from 'playwright';
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const box = await page.locator('canvas').boundingBox();
const state = () => page.evaluate(() => {
  const g = window.__g(); const G = window.__G;
  return { lv: G.api_get_level(g), ph: G.api_get_phase(g), sc: G.api_get_score(g), won: G.api_get_won(g), birds: G.api_get_bird_count(g) };
});
console.log('start', JSON.stringify(await state()));
for (let shot = 0; shot < 30; shot++) {
  const s = await state();
  if (s.won || s.lv > 4) break;
  if (s.ph !== 0) { await page.waitForTimeout(400); continue; }
  // 拉弓发射（瞄向右侧 45 度）
  const ax = box.x + 180, ay = box.y + 390;
  await page.mouse.move(ax, ay); await page.mouse.down();
  for (let i = 1; i <= 6; i++) { await page.mouse.move(ax - i * 12, ay + i * 8); await page.waitForTimeout(20); }
  await page.mouse.up();
  // 等这回合结算完（最多 8 秒）
  for (let t = 0; t < 40; t++) { await page.waitForTimeout(200); if ((await state()).ph === 0) break; }
  const s2 = await state();
  console.log(`shot${shot + 1} -> lv${s2.lv} score${s2.sc} birds${s2.birds}`);
}
console.log('final', JSON.stringify(await state()), 'errors:', errors.length ? errors : '无');
await b.close();
