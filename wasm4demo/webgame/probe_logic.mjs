import * as G from "file:///e:/xiangmu2/wasm4demo/_build/js/debug/build/webgame/webgame.js";
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]));
const g = G.api_new_game();
const dump = tag => {
  let s = tag + ": ";
  for (let i = 0; i < G.api_get_entity_count(g); i++) {
    const [k, m, tg, a, b, x, y] = T(G.api_get_entity(g, i));
    s += `[k${k}m${m} ${x.toFixed(0)},${y.toFixed(0)}] `;
  }
  console.log(s);
};
dump("init");
// 模拟满力拖拽：从锚点往左下拖
G.api_pointer(g, 180, 390, true);
G.api_pointer(g, 80, 450, false);
console.log("phase after launch", G.api_get_phase(g));
for (let f = 1; f <= 300; f++) {
  G.api_update(g);
  if (f % 30 === 0) {
    // 找第一只鸟
    let bd = "";
    for (let i = 0; i < G.api_get_entity_count(g); i++) {
      const [k,,,,, x, y] = T(G.api_get_entity(g, i));
      if (k === 0) { bd += `bird@${x.toFixed(0)},${y.toFixed(0)} `; }
    }
    console.log(`f${f} phase=${G.api_get_phase(g)} ${bd}`);
  }
}
dump("final");
