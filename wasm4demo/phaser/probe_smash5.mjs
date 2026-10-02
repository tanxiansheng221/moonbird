// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));
const [NL, AX, AY] = T(G.api_consts());

const g = G.api_new_game();
const snap = () => {
  const n = G.api_get_entity_count(g), arr = [];
  for (let i = 0; i < n; i++) {
    const [kind, mat, tag, a, b, px, py] = T(G.api_get_entity(g, i));
    arr.push(kind + ':' + mat + '@' + Math.round(px) + ',' + Math.round(py));
  }
  return arr;
};
let prev = snap();
const birdPos = () => {
  const n = G.api_get_entity_count(g);
  for (let i = 0; i < n; i++) {
    const e = T(G.api_get_entity(g, i));
    if (e[0] === 0) return e[5].toFixed(0) + ',' + e[6].toFixed(0);
  }
  return 'none';
};

G.api_pointer(g, AX, AY, true);
for (let s = 0; s < 10; s++) G.api_pointer(g, AX - 96, AY + 14, true);
G.api_pointer(g, AX - 96, AY + 14, false);

for (let f = 0; f < 900; f++) {
  G.api_update(g);
  const cur = snap();
  if (cur.length !== prev.length) {
    const [shot, blast, clear, boom, impact, scEv] = T(G.api_take_events(g));
    console.log('f' + f, 'Δn=' + (cur.length - prev.length),
      'bird@' + birdPos(), 'phase=' + G.api_get_phase(g),
      'blast=' + blast, 'impact=' + impact, 'boom=' + boom,
      'score=' + G.api_get_score(g));
    const diff = cur.filter(x => !prev.includes(x));
    if (diff.length) console.log('  new:', diff.join(' | '));
  }
  prev = cur;
  if (f % 15 === 0 && G.api_get_phase(g) === 1) console.log('f' + f, 'fly bird@' + birdPos());
}
console.log('FINAL score=' + G.api_get_score(g), 'won=' + G.api_get_won(g));
