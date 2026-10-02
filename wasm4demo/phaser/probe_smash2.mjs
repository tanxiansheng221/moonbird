// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));
const [NL, AX, AY, GY, WW, DR] = T(G.api_consts());

const g = G.api_new_game();
const n0 = G.api_get_entity_count(g);
G.api_pointer(g, AX, AY, true);
for (let s = 0; s < 10; s++) G.api_pointer(g, AX - 90, AY + 40, true);
G.api_pointer(g, AX - 90, AY + 40, false);
console.log('phase after release:', G.api_get_phase(g), 'n0', n0);
let maxScore = 0, prevN = n0, deaths = 0, maxSp = 0;
for (let f = 0; f < 600; f++) {
  G.api_update(g);
  maxScore = Math.max(maxScore, G.api_get_score(g));
  const n = G.api_get_entity_count(g);
  if (n < prevN) { deaths += prevN - n; console.log('f' + f, 'deaths', deaths, 'score', G.api_get_score(g)); }
  prevN = n;
}
console.log('FINAL score', maxScore, 'deaths', deaths, maxScore > 0 ? 'OK' : 'FAIL');
