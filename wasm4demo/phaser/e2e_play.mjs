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
const shoot = async (pow) => {
  await page.mouse.move(ax, ay); await page.mouse.down();
  await page.mouse.move(ax - 70, ay + 8); await page.waitForTimeout(30);
  await page.mouse.up();
  for (let t = 0; t < 60; t++) { await page.waitForTimeout(200); if ((await st()).ph === 0) return true; }
  return false;
};
console.log('start', await st());
let ok = await shoot(14).catch(e => 'ERR:' + e.message.slice(0, 120)); console.log('shot1 ok=' + ok, await st());
// 中途强制重开
await page.keyboard.press('KeyR'); await page.waitForTimeout(500);
console.log('after restart', await st(), 'bird pos:', await page.evaluate(() => {
  const g = window.__g(), G = window.__G; const T = a => Array.isArray(a) ? a : Object.keys(a).sort((x, y) => +x.slice(1) - +y.slice(1)).map(k => a[k]);
  for (let j = 0; j < G.api_get_entity_count(g); j++) { const e = T(G.api_get_entity(g, j)); if (e[0] === 0) return [e[5].toFixed(0), e[6].toFixed(0)]; } return null;
}));
for (let s = 2; s <= 8; s++) {
  ok = await shoot(14); const w = await st();
  console.log(`shot${s} ok=${ok}`, w);
  if (w.lv > 1 || w.won) break;
}
// 等待关卡推进稳定
for (let t = 0; t < 20; t++) { await page.waitForTimeout(500); const w = await st(); if (w.lv > 1) break; }
console.log('final', await st(), 'errors:', errs.length ? errs : '无');
await b.close();
