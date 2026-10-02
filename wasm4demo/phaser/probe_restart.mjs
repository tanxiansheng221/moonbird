// 怒鸭大战
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 760 } });
const errs = [];
page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });

await page.goto('http://localhost:5199/', { waitUntil: 'load' });
await page.waitForTimeout(1200);

const state = () => page.evaluate(() => {
  const d = window.__dbg, G = window.__G;
  return {
    level: G.api_get_level(d.g), score: G.api_get_score(g_ok()),
    ents: G.api_get_entity_count(d.g), phase: G.api_get_phase(d.g),
    sprites: d.sprites.size, won: G.api_get_won(d.g),
  };
  function g_ok() { return d.g; }
});

console.log('初始', await state());

// 模拟拖拽发射（世界坐标 ANCHOR=(180,390)）→ 页面坐标
async function shot(dx = -60, dy = 70) {
  const cx = 180 + dx - (await page.evaluate(() => window.__dbg.camScroll || 0)) + 10; // canvas 偏移近似 0（FIT 居中）
  // 直接用 canvas bounding box
  const box = await page.locator('canvas').boundingBox();
  const sx = box.x + box.width * ((180 + dx) / 1280), sy = box.y + box.height * ((390 + dy) / 720);
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx - 30, sy + 30, { steps: 5 });
  await page.mouse.up();
}

await shot();
await page.waitForTimeout(2500);
console.log('发射后', await state());
await page.screenshot({ path: 'rs1_fly.png' });

// 按 R 重开
await page.keyboard.press('r');
await page.waitForTimeout(600);
console.log('按R后', await state());
await page.screenshot({ path: 'rs2_after_R.png' });

// 再发射验证 R 后游戏仍可玩
await shot();
await page.waitForTimeout(2500);
console.log('R后再发射', await state());
await page.screenshot({ path: 'rs3_after_R_shot.png' });

console.log('页面错误数:', errs.length);
errs.slice(0, 5).forEach(e => console.log(e));
await browser.close();
