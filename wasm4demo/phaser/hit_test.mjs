// 怒鸭大战
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 760 } });
const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:5199/', { waitUntil: 'load' });
await p.waitForTimeout(2500);
console.log(await p.evaluate(() => JSON.stringify(window.__G.api_consts())));
const box = await p.locator('#game canvas').boundingBox();
const sc = box.width / 1280;
const st = async tag => {
  const s = await p.evaluate(() => {
    const g = window.__dbg.g, G = window.__G;
    const ev = i => { const e = G.api_get_entity(g, i); return Object.keys(e).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => e[k]); };
    let pigs = 0;
    for (let i = 0; i < G.api_get_entity_count(g); i++) { if (ev(i)[0] === 1) pigs++; }
    return { lv: G.api_get_level(g), sc: G.api_get_score(g), ph: G.api_get_phase(g), pigs, birds: G.api_get_bird_count(g) };
  });
  console.log(tag, JSON.stringify(s));
};
const sx = box.x + 180 * sc, sy = box.y + 530 * sc;
// 满力：向左下拉到拖拽半径上限（方向指向狐狸，稍向上打高弧）
await p.mouse.move(sx, sy); await p.mouse.down();
await p.mouse.move(sx - 140 * sc, sy + 95 * sc, { steps: 14 });
await p.waitForTimeout(250);
await st('dragging:');
await p.screenshot({ path: 'shot_full_drag.png' });
await p.mouse.up();
for (let t = 0; t < 10; t++) { await p.waitForTimeout(700); await st('t' + t + ':'); }
await p.screenshot({ path: 'shot_full_after.png' });
console.log(errs.length ? 'ERR:' + errs.join('|') : 'NO_ERRORS');
await b.close();
