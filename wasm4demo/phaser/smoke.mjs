// 怒鸭大战
import { chromium } from 'playwright';

const url = process.env.GAME_URL || 'http://localhost:5199/';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const page = await browser.newPage({ viewport: { width: 1300, height: 760 } });
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.screenshot({ path: 'shot_aim.png' });

// 模拟拉弓：从弹弓位置向后拖拽并松手
const canvas = page.locator('#game canvas');
const box = await canvas.boundingBox();
const scale = box.width / 1280;
const sx = box.x + 180 * scale, sy = box.y + 530 * scale;
await page.mouse.move(sx, sy);
await page.mouse.down();
await page.mouse.move(sx - 80 * scale, sy + 70 * scale, { steps: 12 });
await page.waitForTimeout(300);
await page.screenshot({ path: 'shot_drag.png' });
await page.mouse.up();
await page.waitForTimeout(700);
await page.screenshot({ path: 'shot_fly.png' });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'shot_after.png' });

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'SMOKE_OK 0 errors');
await browser.close();
process.exit(errors.length ? 1 : 0);
