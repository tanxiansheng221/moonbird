import * as G from "file:///e:/xiangmu2/wasm4demo/_build/js/debug/build/webgame/webgame.js";
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]));
const g = G.api_new_game();
const state = tag => {
  let s = `${tag} score=${G.api_get_score(g)} ph=${G.api_get_phase(g)}: `;
  for (let i = 0; i < G.api_get_entity_count(g); i++) {
    const [k, m, tg, a, b, x, y] = T(G.api_get_entity(g, i));
    s += `[k${k}m${m}@${x.toFixed(0)},${y.toFixed(0)}] `;
  }
  console.log(s);
};
state("init");
// 正确拖拽序列：按下→移动(down=true)→松开
G.api_pointer(g, 180, 390, true);   // 按住弹弓
G.api_pointer(g, 108, 390, true);    // 拖到左下
G.api_pointer(g, 108, 390, false);   // 松手发射
console.log("phase after launch", G.api_get_phase(g));
let prevScore = 0; const seen=new Set();
for (let f = 1; f <= 400; f++) {
  G.api_update(g);
  const sc = G.api_get_score(g);
  if (sc !== prevScore) { for(let i=0;i<G.api_get_entity_count(g);i++){const e=T(G.api_get_entity(g,i)); if(e[1]===1&&e[4])seen.add(`f${f}:hp${e[3].toFixed(0)}@${e[5].toFixed(0)},${e[6].toFixed(0)} v=${Math.hypot(e[2],e[3])|0}`);} console.log(`f${f} SCORE ${prevScore} -> ${sc}`); prevScore = sc; }
  if (f % 40 === 0) {
    let bd = "";
    for (let i = 0; i < G.api_get_entity_count(g); i++) {
      const [k,,,,, x, y] = T(G.api_get_entity(g, i));
      if (k === 0) bd += `bird@${x.toFixed(0)},${y.toFixed(0)} `;
    }
    console.log(`f${f} ph=${G.api_get_phase(g)} ${bd}`);
  }
}
state("final");
