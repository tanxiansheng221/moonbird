// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));
const [NL, AX, AY, GY, WW, DR] = T(G.api_consts());

const g = G.api_new_game();
console.log('--- level1 layout ---');
for (let i = 0; i < G.api_get_entity_count(g); i++) {
  console.log(i, T(G.api_get_entity(g, i)));
}
G.api_pointer(g, AX, AY, true);
for (let s = 0; s < 10; s++) G.api_pointer(g, AX - 90, AY + 40, true);
G.api_pointer(g, AX - 90, AY + 40, false);
console.log('--- trajectory ---');
for (let f = 0; f < 600; f++) {
  G.api_update(g);
  if (f % 20 === 0) console.log('f' + f, 'score', G.api_get_score(g), 'n', G.api_get_entity_count(g));
  if (G.api_get_phase(g) === 0 && f > 5) { console.log('phase back to aiming at f' + f, 'score', G.api_get_score(g)); break; }
}
console.log('--- final layout ---');
for (let i = 0; i < G.api_get_entity_count(g); i++) {
  console.log(i, T(G.api_get_entity(g, i)));
}
