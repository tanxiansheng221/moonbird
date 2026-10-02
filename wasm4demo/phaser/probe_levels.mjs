// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));

const g = G.api_new_game();
console.log('start level', G.api_get_level(g), 'score', G.api_get_score(g));

let clears = 0;
for (let step = 0; step < 200000 && !G.api_get_won(g); step++) {
  // 每帧把活猪标记为不在场？不行——逻辑层没暴露杀猪 API。
  // 退而求其次：狂点指针无意义，改为只验证第一关能否自然过关：
  G.api_update(g);
}
console.log('won?', G.api_get_won(g), 'level', G.api_get_level(g));
