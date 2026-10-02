import { chromium } from 'playwright';
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1300, height: 800 } });
pg.on('pageerror', e => console.log('PAGEERROR:', e.message));
await pg.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await pg.waitForTimeout(1200);

// 直接在页面里逐帧采样 MoonBit 世界状态（L11 = level 11）
const out = await pg.evaluate(() => {
  const G = window.__G, dbg = window.__dbg;
  let g = dbg.g;
  G.api_load_level(g, 11);
  return new Promise(res => {
    const log = [];
    let f = 0;
    const iv = setInterval(() => {
      f++;
      const n = G.api_get_entity_count(g);
      const snap = [];
      for (let i = 0; i < n; i++) {
        const e = G.api_get_entity(g, i);
        const t = Array.isArray(e) ? e : Object.keys(e).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => e[k]);
        snap.push('k' + t[0] + ':' + t[5].toFixed(1) + ',' + t[6].toFixed(1));
      }
      if (f % 15 === 0) log.push('f' + f + ' ' + snap.join(' | '));
      if (f >= 300) { clearInterval(iv); res(log); }
    }, 16);
  });
});
console.log(out.join('\n'));
await b.close();
