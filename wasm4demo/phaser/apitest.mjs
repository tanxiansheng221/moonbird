import * as G from '../_build/js/debug/build/webgame/webgame.js';
console.log('keys:', Object.keys(G).join(','));
const c = G.api_consts();
console.log('consts:', Array.isArray(c), JSON.stringify(c));
const g = G.api_new_game();
console.log('game:', typeof g, g && Object.keys(g).slice(0, 8));
G.api_update(g);
const n = G.api_get_entity_count(g);
console.log('entityCount:', n);
if (n > 0) {
  const e = G.api_get_entity(g, 0);
  console.log('entity0:', Array.isArray(e), JSON.stringify(e));
}
console.log('cam:', G.api_get_cam_x(g), 'phase:', G.api_get_phase(g), 'lvl:', G.api_get_level(g));
