// 怒鸭大战
import * as G from '../_build/js/debug/build/webgame/webgame.js';
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a,b)=>+a.slice(1)-+b.slice(1)).map(k=>t[k]));
const [NL, AX, AY, GY, WW, DR] = T(G.api_consts());
console.log('consts', NL, AX, AY, GY, WW, DR);

const g = G.api_new_game();
console.log('level', G.api_get_level(g), 'phase', G.api_get_phase(g), 'dragging', G.api_get_dragging(g), 'entities', G.api_get_entity_count(g));
console.log('entity0', T(G.api_get_entity(g,0)));

// 模拟拖拽：按下弹弓锚点附近，拖到左下，松手
G.api_pointer(g, AX, AY, true);
console.log('after down: dragging=', G.api_get_dragging(g));
for (let s=0;s<10;s++) G.api_pointer(g, AX-50, AY+40, true);
console.log('drag pos', G.api_get_drag_x(g), G.api_get_drag_y(g));
G.api_pointer(g, AX-50, AY+40, false);
console.log('after up: phase=', G.api_get_phase(g));

// 跑 300 帧
let last=null;
for (let f=0; f<300; f++) {
  G.api_update(g);
  const n = G.api_get_entity_count(g);
  if (f%50===0) {
    const e = T(G.api_get_entity(g,0));
    console.log('f'+f, 'phase', G.api_get_phase(g), 'ent0', e.slice(4));
  }
  last = G.api_get_phase(g);
}
console.log('final phase', last, 'score', G.api_get_score(g));
