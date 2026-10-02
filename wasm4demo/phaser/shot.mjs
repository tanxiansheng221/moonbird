import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 760 } });
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('http://localhost:5199/', { waitUntil: 'load' });
await page.waitForTimeout(4000);
// 拖拽弹弓：从弹弓锚点(屏幕坐标≈锚点-镜头)向左下拖后释放
const start = { x: 130, y: 400 };
await page.mouse.move(start.x, start.y);
await page.mouse.down();
await page.mouse.move(start.x - 100, start.y + 40, { steps: 20 });
await page.waitForTimeout(300);
await page.screenshot({ path: 'shot_drag.png' });
await page.mouse.up();
await page.waitForTimeout(2500);
await page.screenshot({ path: 'shot_after.png' });
const errs = [];
console.log('SMOKE_DONE');
await browser.close();
