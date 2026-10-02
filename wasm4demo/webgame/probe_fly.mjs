import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]));
const [, AX, AY] = T(G.api_consts());
const g = G.api_new_game();
G.api_pointer(g, AX, AY + 30, true);
G.api_pointer(g, AX - 60, AY + 70, true);
G.api_pointer(g, AX - 60, AY + 70, false);
console.log('phase', G.api_get_phase(g));
const pos = () => { for (let i = 0; i < G.api_get_entity_count(g); i++) { const e = T(G.api_get_entity(g, i)); if (e[0] === 0) return [Math.round(e[5]), Math.round(e[6])]; } return null; };
console.log('bird t0', pos());
for (let s = 1; s <= 12; s++) {
  for (let i = 0; i < 60; i++) G.api_update(g);
  console.log(`t=${s}s phase=${G.api_get_phase(g)} bird=${pos()} ents=${G.api_get_entity_count(g)} birds=${G.api_get_bird_count(g)} score=${G.api_get_score(g)}`);
}
