import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]));
const [N, AX, AY] = T(G.api_consts());

function birdPos(g) {
  for (let i = 0; i < G.api_get_entity_count(g); i++) {
    const e = T(G.api_get_entity(g, i));
    if (e[0] === 0) return [e[5], e[6]]; // kind 0=鸟, (px,py)
  }
  return null;
}

let fail = 0;
for (let lv = 1; lv <= N; lv++) {
  const g = G.api_new_game();
  G.api_load_level(g, lv);
  const log = [];
  let ok = true;
  for (let shot = 1; shot <= 12; shot++) {
    if (G.api_get_won(g)) break;
    G.api_pointer(g, AX, AY + 30, true);
    G.api_pointer(g, AX - 60, AY + 70, true);
    G.api_pointer(g, AX - 60, AY + 70, false);
    if (G.api_get_phase(g) !== 1) { ok = false; log.push(`shot${shot}: not flying after release`); break; }
    let frames = 0;
    while (G.api_get_phase(g) === 1 && frames < 1500) { G.api_update(g); frames++; }
    while (G.api_get_phase(g) === 2 && frames < 3000) { G.api_update(g); frames++; }
    const ph = G.api_get_phase(g);
    if (ph !== 0 && !G.api_get_won(g)) { ok = false; log.push(`shot${shot}: stuck phase=${ph} after ${frames}f`); break; }
    if (ph === 0) {
      const p = birdPos(g);
      // 装填 = 鸟回到弹弓锚点（容差 2px）
      if (!p || Math.abs(p[0] - AX) > 2 || Math.abs(p[1] - AY) > 2) {
        ok = false; log.push(`shot${shot}: no bird reloaded at anchor (pos=${p})`); break;
      }
    }
  }
  console.log(`L${lv} ${ok ? 'OK' : 'FAIL'} ${log.join('; ')}`);
  if (!ok) fail++;
}
console.log(fail === 0 ? 'ALL LEVELS PASS' : `${fail} LEVELS FAIL`);
process.exit(fail === 0 ? 0 : 1);
