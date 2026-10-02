// 怒鸭大战
import { chromium } from 'playwright';

const url = process.env.GAME_URL || 'http://localhost:5199/';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1300, height: 760 } });
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(2000);
const canvas = page.locator('#game canvas');
const box = await canvas.boundingBox();
const scale = box.width / 1280;

async function state(tag) {
  const s = await page.evaluate(() => {
    const g = window.__dbg.g, G = window.__G;
    const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]));
    return {
      level: G.api_get_level(g), score: G.api_get_score(g), won: G.api_get_won(g),
      phase: G.api_get_phase(g), birds: G.api_get_bird_count(g),
      entities: G.api_get_entity_count(g), dragging: G.api_get_dragging(g),
      cam: G.api_get_cam_x(g), sprites: window.__dbg.sprites.size,
    };
  });
  console.log(tag, JSON.stringify(s));
  await page.screenshot({ path: `dbg_${tag}.png` });
  return s;
}

async function shoot(dx = -110, dy = 80) {
  const sx = box.x + 180 * scale, sy = box.y + 530 * scale;
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + dx * scale, sy + dy * scale, { steps: 10 });
  await page.mouse.up();
}

// 1. 初始
await state('t0_aim');
// 2. 第一次发射
await shoot();
await page.waitForTimeout(2500);
await state('t1_after_shot1');
// 3. R 重开
await page.keyboard.press('r');
await page.waitForTimeout(500);
await state('t2_after_R');
// 4. 重开后立刻再发射
await shoot();
await page.waitForTimeout(2500);
await state('t3_shot_after_R');
// 5. 连打两发看回合推进
await shoot(-80, 100);
await page.waitForTimeout(2000);
await state('t4_shot3');
await page.waitForTimeout(3000);
await state('t5_settle');

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'FLOW_DONE 0 errors');
await browser.close();
process.exit(0);
