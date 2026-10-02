// 怒鸭大战
import { chromium } from 'playwright';

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// 找 canvas
const cv = page.locator('canvas');
const box = await cv.boundingBox();
console.log('canvas box', JSON.stringify(box));

// 读鸭子初始位置
const birdPos0 = await page.evaluate(() => {
  const g = window.__g(); const d = window.__dbg;
  return { dragging: window.__G.api_get_dragging(g) };
});

// 在弹弓锚点(世界180,390)按下并拖到左下(80,450)，再松开
const anchor = { x: box.x + 180 * (box.width / 1280), y: box.y + 390 * (box.height / 720) };
const target = { x: box.x + 80 * (box.width / 1280), y: box.y + 450 * (box.height / 720) };
await page.mouse.move(anchor.x, anchor.y);
await page.mouse.down();
// 分步拖动模拟真实手势
for (let i = 1; i <= 10; i++) {
  await page.mouse.move(anchor.x + (target.x - anchor.x) * i / 10, anchor.y + (target.y - anchor.y) * i / 10);
  await page.waitForTimeout(30);
}
const midState = await page.evaluate(() => {
  const g = window.__g();
  return { dragging: window.__G.api_get_dragging(g), dx: window.__G.api_get_drag_x(g), dy: window.__G.api_get_drag_y(g), phase: window.__G.api_get_phase(g) };
});
console.log('mid-drag', JSON.stringify(midState));
await page.mouse.up();

// 追踪飞行 3 秒，采样鸭子世界坐标
const frames = [];
for (let i = 0; i < 15; i++) {
  await page.waitForTimeout(200);
  const s = await page.evaluate(() => {
    const g = window.__g(); const G = window.__G; const T = t => Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]);
    let bird = null;
    for (let j = 0; j < G.api_get_entity_count(g); j++) {
      const e = T(G.api_get_entity(g, j));
      if (e[0] === 0) bird = [e[5].toFixed(0), e[6].toFixed(0)];
    }
    return { phase: G.api_get_phase(g), score: G.api_get_score(g), bird };
  });
  frames.push(s);
  if (i === 0 || i === 7 || i === 14) console.log(`t+${(i + 1) * 0.2}s`, JSON.stringify(s));
}

// 重开测试：按 R，鸭子应回到弹弓且不掉落
await page.keyboard.press('KeyR');
await page.waitForTimeout(1500);
const afterR = await page.evaluate(() => {
  const g = window.__g(); const G = window.__G; const T = t => Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]);
  let bird = null;
  for (let j = 0; j < G.api_get_entity_count(g); j++) {
    const e = T(G.api_get_entity(g, j));
    if (e[0] === 0) bird = [e[5].toFixed(0), e[6].toFixed(0)];
  }
  return { phase: G.api_get_phase(g), bird };
});
console.log('after R', JSON.stringify(afterR));

console.log('page errors:', errors.length ? errors : '无');
const flew = frames.some(f => f.bird && +f.bird[0] > 260);
console.log(flew ? '✅ 鸭子飞出去了' : '❌ 鸭子没飞出去（x 一直在 260 以内）');
console.log(afterR.phase === 0 && afterR.bird && Math.abs(afterR.bird[0] - 180) < 5 ? '✅ R 重开正常' : '❌ R 重开异常');
await b.close();
