// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));
const [NL, AX, AY, GY, WW, DR] = T(G.api_consts());

function idleSpawn(label) {
  const g = G.api_new_game();
  const n0 = G.api_get_entity_count(g);
  const s0 = G.api_get_score(g);
  for (let f = 0; f < 300; f++) G.api_update(g); // 静置 5 秒
  const n1 = G.api_get_entity_count(g);
  const s1 = G.api_get_score(g);
  console.log(label, 'entities', n0, '->', n1, 'score', s0, '->', s1,
    n1 === n0 && s1 === s0 ? 'OK' : 'SELF_EXPLODE!!');
  return g;
}

// 每关静置 5 秒不得自爆
for (let lv = 1; lv <= NL; lv++) {
  idleSpawn('L' + lv);
}

// 鸭撞仍碎：发射后应有得分与实体减少
const g = idleSpawn('shoot-pre');
G.api_pointer(g, AX, AY, true);
G.api_pointer(g, AX - 120, AY + 90, true);
G.api_pointer(g, AX - 120, AY + 90, false);
let smashes = 0;
for (let f = 0; f < 400; f++) {
  G.api_update(g);
  smashes = Math.max(smashes, G.api_get_score(g));
}
console.log('duck-smash score after launch:', smashes, smashes > 0 ? 'OK' : 'FAIL');
