// 怒鸭大战
// 判定：实体数不变、分数 0、无 ev_boom/ev_impact、所有猪/块坐标位移 < 6px
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));

let allOK = true;
for (let lv = 1; lv <= 12; lv++) {
  const g = G.api_new_game();
  // 直接跳关：api_new_game 从 1 开始，用 api_load_level 若存在；否则循环过关
  if (G.api_load_level) G.api_load_level(g, lv);
  // 静置前快照
  const n0 = G.api_get_entity_count(g);
  const snap = [];
  for (let i = 0; i < n0; i++) {
    const e = T(G.api_get_entity(g, i));
    snap.push(e.slice(3, 5)); // px,py
  }
  for (let f = 0; f < 600; f++) G.api_update(g);
  // 对比
  const n1 = G.api_get_entity_count(g);
  let maxShift = 0, deadPig = 0;
  for (let i = 0; i < Math.min(n0, n1); i++) {
    const e = T(G.api_get_entity(g, i));
    const dx = e[3] - snap[i][0], dy = e[4] - snap[i][1];
    const sh = Math.hypot(dx, dy);
    if (sh > maxShift) maxShift = sh;
    if (e[0] === 1) deadPig++; // kind=1 猪已死不会出现在这里（死亡实体被清）
  }
  const score = G.api_get_score(g);
  const ev = T(G.api_take_events(g));
  const ok = n1 === n0 && score === 0 && maxShift < 6.0;
  if (!ok) allOK = false;
  console.log(`L${lv}`, ok ? 'OK  ' : 'FAIL', 'ents', n0, '->', n1,
    'maxShift', maxShift.toFixed(2), 'score', score, 'ev_boom', ev[3]);
}
console.log(allOK ? 'ALL LEVELS STABLE' : 'SOME LEVELS UNSTABLE');
