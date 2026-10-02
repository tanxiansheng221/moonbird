// 怒鸭大战
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__dbg && window.__G);

const birdInfo = () => page.evaluate(() => {
  const d = window.__dbg, G = window.__G;
  const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]));
  const n = G.api_get_entity_count(d.g);
  const out = [];
  for (let i = 0; i < n; i++) {
    const e = T(G.api_get_entity(d.g, i));
    if (e[0] === 0) out.push({ i, x: +e[5].toFixed(1), y: +e[6].toFixed(1) });
  }
  return { phase: G.api_get_phase(d.g), birds: out, score: G.api_get_score(d.g) };
});

const AX = 180, AY = 390;
await page.mouse.move(AX, AY);
await page.mouse.down();
await page.mouse.move(AX - 70, AY - 30, { steps: 8 });
await page.mouse.up();
for (let t = 0; t <= 10; t++) {
  await page.waitForTimeout(1000);
  const s = await birdInfo();
  console.log(`t=${t}s phase=${s.phase} score=${s.score} birds=`, JSON.stringify(s.birds));
}
await browser.close();
