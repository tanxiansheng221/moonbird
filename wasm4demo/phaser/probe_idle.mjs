// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));
const g = G.api_new_game();
console.log('t0: level', G.api_get_level(g), 'phase', G.api_get_phase(g), 'score', G.api_get_score(g), 'ents', G.api_get_entity_count(g));
for (let f = 1; f <= 900; f++) {
  G.api_update(g);
  if (f % 60 === 0) {
    const n = G.api_get_entity_count(g);
    let bird = null;
    for (let i = 0; i < n; i++) { const e = T(G.api_get_entity(g, i)); if (e[0] === 0) bird = e; }
    const ev = T(G.api_take_events(g));
    console.log(`f${f}`, 'phase', G.api_get_phase(g), 'score', G.api_get_score(g), 'ents', n,
      'bird', bird ? bird.slice(4).map(v => v.toFixed(1)).join(',') : 'none',
      'events', ev.join('/'));
  }
}
console.log('END score', G.api_get_score(g), 'phase', G.api_get_phase(g));
