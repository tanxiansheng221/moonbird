// 怒鸭大战
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 760 } });
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('http://localhost:5199/', { waitUntil: 'load' });
await page.waitForTimeout(2000);
const box = await page.locator('#game canvas').boundingBox();
const scale = box.width / 1280;

const probe = async tag => {
  const s = await page.evaluate(() => {
    const g = window.__dbg.g, G = window.__G;
    const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]));
    const ents = [];
    for (let i = 0; i < G.api_get_entity_count(g); i++) ents.push(T(G.api_get_entity(g, i)).slice(3, 5).map(v => Math.round(v)));
    return { phase: G.api_get_phase(g), drag: G.api_get_dragging(g), dx: Math.round(G.api_get_drag_x(g)), dy: Math.round(G.api_get_drag_y(g)), ents };
  });
  console.log(tag, JSON.stringify(s));
};

await probe('idle');
const sx = box.x + 180 * scale, sy = box.y + 530 * scale;
await page.mouse.move(sx, sy);
await page.mouse.down();
await probe('down@180,530');
await page.mouse.move(sx - 60 * scale, sy + 40 * scale, { steps: 5 });
await probe('dragged');
await page.mouse.up();
await page.waitForTimeout(300);
await probe('after_up');
await page.waitForTimeout(2000);
await probe('t+2s');
await browser.close();
