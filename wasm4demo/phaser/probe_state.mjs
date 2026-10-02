import { chromium } from 'playwright';
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1300, height: 800 } });
let errs = 0;
pg.on('pageerror', e => { errs++; console.log('PAGEERROR:', e.message); });
pg.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) { errs++; console.log('CONSOLE:', m.text()); } });
await pg.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await pg.waitForTimeout(1500);

const hud = async () => await pg.evaluate(() => window.__dbg.hud.text);

console.log('HUD 初始:', await hud());
// 1. 拖拽发射
await pg.mouse.move(180, 400); await pg.mouse.down();
await pg.mouse.move(120, 470, { steps: 8 }); await pg.waitForTimeout(150);
await pg.mouse.up();
await pg.waitForTimeout(2500);
console.log('发射后 HUD:', await hud());
// 2. 技能键
await pg.keyboard.press('Space');
await pg.waitForTimeout(500);
console.log('技能后 HUD:', await hud());
// 3. 跳过/重开
await pg.keyboard.press('s'); await pg.waitForTimeout(800);
await pg.keyboard.press('r'); await pg.waitForTimeout(800);
console.log('跳过+重开后 HUD:', await hud());
// 4. 连续快速点击不崩
for (let i = 0; i < 5; i++) { await pg.mouse.move(180, 400); await pg.mouse.down(); await pg.mouse.move(140, 450); await pg.mouse.up(); await pg.waitForTimeout(120); }
await pg.waitForTimeout(1500);
const st = await pg.evaluate(() => ({ phase: window.__G.api_get_phase(window.__dbg.g), score: window.__G.api_get_score(window.__dbg.g), level: window.__G.api_get_level(window.__dbg.g), sprites: window.__dbg.sprites.size }));
console.log('连点后状态:', JSON.stringify(st));
await pg.screenshot({ path: 'shot_final.png' });
console.log('总错误数:', errs);
await b.close();
