// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));
const [NL, AX, AY, GY, WW, DR] = T(G.api_consts());

const g = G.api_new_game();
G.api_pointer(g, AX, AY, true);
for (let s = 0; s < 10; s++) G.api_pointer(g, AX - 90, AY + 50, true);
G.api_pointer(g, AX - 90, AY + 50, false);
for (let f = 0; f < 900; f++) {
  G.api_update(g);
  if (f % 15 === 0) {
    const b = T(G.api_get_entity(g, G.api_get_entity_count(g) - 1));
    console.log('f' + f, 'x', b[5].toFixed(0), 'y', b[6].toFixed(0), 'vx', b[0], 'kind', b[1]);
  }
  if (G.api_get_phase(g) === 0 && f > 5) { console.log('back to aiming f' + f); break; }
}
