// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));

const g = G.api_new_game();
const n0 = G.api_get_entity_count(g);
console.log('L4 n0', n0);
G.api_pointer(g, 180, 390, true);
for (let s = 0; s < 10; s++) G.api_pointer(g, 180 - 96, 390, true);
G.api_pointer(g, 180 - 96, 390, false);
let prevScore = 0, prevN = n0;
for (let f = 0; f < 900; f++) {
  G.api_update(g);
  const score = G.api_get_score(g);
  const n = G.api_get_entity_count(g);
  if (score !== prevScore) { console.log('f' + f, 'score', score); prevScore = score; }
  if (n !== prevN) { console.log('f' + f, 'deaths', prevN - n, 'score', score); prevN = n; }
}
console.log('FINAL score', G.api_get_score(g), 'phase', G.api_get_phase(g));
