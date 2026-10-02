// 怒鸭大战
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 760 } });
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
await page.goto('http://localhost:5199/', { waitUntil: 'load' });
await page.waitForTimeout(2000);
const box = await page.locator('#game canvas').boundingBox();
const scale = box.width / 1280;
const consts = await page.evaluate(() => window.__G.api_consts());
console.log('consts raw:', JSON.stringify(consts));
const keys = Object.keys(consts).sort();
const vals = keys.map(k => consts[k]);
// (NUM_LEVELS, ANCHOR_X, ANCHOR_Y, GROUND_Y, WORLD_W, DRAG_R)
const [NL, AX, AY, GY, WW, DR] = vals;
console.log(`anchor=(${AX},${AY}) dragR=${DR} ground=${GY} world=${WW} levels=${NL}`);

async function shoot(dx, dy) {
  const sx = box.x + AX * scale, sy = box.y + AY * scale;
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + dx * scale, sy + dy * scale, { steps: 12 });
  await page.mouse.up();
}
async function st(tag) {
  const s = await page.evaluate(() => {
    const g = window.__dbg.g, G = window.__G;
    const duckIdx = [...Array(G.api_get_entity_count(g)).keys()].map(i => G.api_get_entity(g, i)).findIndex(e => e[0] === 0);
    const duck = duckIdx >= 0 ? G.api_get_entity(g, duckIdx) : null;
    return { lv: G.api_get_level(g), sc: G.api_get_score(g), ph: G.api_get_phase(g), won: G.api_get_won(g),
      duck: duck ? [+duck[5].toFixed(1), +duck[6].toFixed(1)] : null, n: G.api_get_entity_count(g) };
  });
  console.log(tag, JSON.stringify(s));
  await page.screenshot({ path: `p2_${tag}.png` });
  return s;
}
await st('aim');
await shoot(-120, 90);
await page.waitForTimeout(800);
await st('flying');
await page.waitForTimeout(2500);
await st('settled');
// R 重开后立即再发射
await page.keyboard.press('r');
await page.waitForTimeout(600);
await st('after_R');
await shoot(-120, 90);
await page.waitForTimeout(3000);
await st('after_R_shot');
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK 0 errors');
await browser.close();
