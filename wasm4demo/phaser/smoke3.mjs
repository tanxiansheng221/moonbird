import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const dump = () => page.evaluate(() => {
  const G = window.__G, g = window.__g();
  const ents = [];
  for (let i = 0; i < G.api_get_entity_count(g); i++) ents.push(G.api_get_entity(g, i));
  return { phase: G.api_get_phase(g), score: G.api_get_score(g), ents };
});
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]));

const d0 = await dump();
console.log('init ents:', d0.ents.map(e => { const [k,,,,x,y] = T(e); return k + '@' + Math.round(x) + ',' + Math.round(y); }).join(' | '));

// 发射（大力度）
await page.mouse.move(180, 390);
await page.mouse.down();
await page.mouse.move(120, 450, { steps: 10 });
await page.mouse.up();

// 等回合结束（最多 15s）
let last = null;
for (let i = 0; i < 60; i++) {
  await page.waitForTimeout(250);
  last = await dump();
  if (last.phase !== 1) break;
}
console.log('settled phase', last.phase, 'score', last.score);
console.log('after ents:', last.ents.map(e => { const [k,,,,x,y] = T(e); return k + '@' + Math.round(x) + ',' + Math.round(y); }).join(' | '));

// R 重开
await page.keyboard.press('KeyR');
await page.waitForTimeout(500);
const d1 = await dump();
console.log('after restart phase', d1.phase, 'score', d1.score, 'ents', d1.ents.map(e => { const [k,,,,x,y] = T(e); return k + '@' + Math.round(x) + ',' + Math.round(y); }).join(' | '));

await page.screenshot({ path: 'smoke3.png' });
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
