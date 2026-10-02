// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));
const [NL, AX, AY, GY, WW, DR] = T(G.api_consts());

function shot(dx, dy, label) {
  const g = G.api_new_game();
  G.api_pointer(g, AX, AY, true);
  for (let s = 0; s < 10; s++) G.api_pointer(g, AX - dx, AY + dy, true);
  G.api_pointer(g, AX - dx, AY + dy, false);
  let maxScore = 0, prevN = G.api_get_entity_count(g), deaths = 0;
  for (let f = 0; f < 900; f++) {
    G.api_update(g);
    maxScore = Math.max(maxScore, G.api_get_score(g));
    const n = G.api_get_entity_count(g);
    if (n < prevN) deaths += prevN - n;
    prevN = n;
  }
  console.log(label, 'score', maxScore, 'deaths', deaths, maxScore > 0 ? 'OK' : 'FAIL');
}
shot(90, 0, 'flat(dy=0)   ');
shot(90, 20, 'dy=20       ');
shot(90, 50, 'dy=50       ');
shot(90, 90, 'lob(dy=90)  ');
