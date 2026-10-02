// 怒鸭大战
// 全部运行时 Canvas 生成，无外部图片；造型/配色为原创 IP，不参照任何现有游戏角色
function tex(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) return;
  const c = scene.textures.createCanvas(key, w, h);
  draw(c.getContext());
  c.refresh();
}

// ---- 通用部件：怒眉 + 圆眼（组合出“生气但可爱”） ----
function eyes(ctx, lx, ly, rx, r) {
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(lx, ly, r, 0, 7); ctx.arc(rx, ly, r, 0, 7); ctx.fill();
  ctx.fillStyle = '#16213e';
  ctx.beginPath(); ctx.arc(lx + r * .25, ly, r * .42, 0, 7); ctx.arc(rx + r * .25, ly, r * .42, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(lx + r * .45, ly - r * .3, r * .18, 0, 7); ctx.arc(rx + r * .45, ly - r * .3, r * .18, 0, 7); ctx.fill();
}
function angryBrows(ctx, cx, y, span, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - span, y - 7); ctx.lineTo(cx - 5, y + 1);
  ctx.moveTo(cx + span, y - 7); ctx.lineTo(cx + 5, y + 1);
  ctx.stroke();
}
// 鸭嘴（宽扁两瓣）
function duckBill(ctx, cx, cy, w, h) {
  ctx.fillStyle = '#f79d2a';
  ctx.beginPath(); ctx.ellipse(cx, cy, w, h, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#d97f10'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(cx - w, cy); ctx.lineTo(cx + w, cy); ctx.stroke();
}

// 在运行中的场景里直接生成贴图（无需无头 Game 实例）
export function buildTextures(s) {
      // ===== 天空背景 1280x720：黄昏湖面风格（区别于 AB 的正午草原）=====
      tex(s, 'sky', 1280, 720, ctx => {
        const grd = ctx.createLinearGradient(0, 0, 0, 720);
        grd.addColorStop(0, '#2e5eaa'); grd.addColorStop(.45, '#7fb2e5');
        grd.addColorStop(.75, '#ffd9a0'); grd.addColorStop(1, '#7ec8a8');
        ctx.fillStyle = grd; ctx.fillRect(0, 0, 1280, 720);
        // 太阳
        ctx.fillStyle = 'rgba(255,236,180,.9)';
        ctx.beginPath(); ctx.arc(1060, 200, 70, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(255,236,180,.25)';
        ctx.beginPath(); ctx.arc(1060, 200, 110, 0, 7); ctx.fill();
        // 云
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        for (const [x, y, r] of [[170,120,44],[250,135,58],[330,120,38],[640,80,40],[720,95,54],[560,90,32]]) {
          ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        }
        // 远山（两层视差感）
        ctx.fillStyle = '#5d8aa8';
        ctx.beginPath(); ctx.moveTo(0, 480);
        for (let x = 0; x <= 1280; x += 320) { ctx.lineTo(x + 160, 380); ctx.lineTo(x + 320, 480); }
        ctx.lineTo(1280, 720); ctx.lineTo(0, 720); ctx.fill();
        ctx.fillStyle = '#4a7a5f';
        ctx.beginPath(); ctx.moveTo(0, 560);
        for (let x = 0; x <= 1280; x += 256) { ctx.quadraticCurveTo(x + 128, 500, x + 256, 560); }
        ctx.lineTo(1280, 720); ctx.lineTo(0, 720); ctx.fill();
        // 草地
        ctx.fillStyle = '#69b06b';
        ctx.beginPath(); ctx.moveTo(0, 640);
        for (let x = 0; x <= 1280; x += 160) ctx.quadraticCurveTo(x + 80, 600, x + 160, 640);
        ctx.lineTo(1280, 720); ctx.lineTo(0, 720); ctx.fill();
      });

      // ===== 主角：怒鸭（青绿圆鸭，头顶呆毛）=====
      for (const [key, body] of [['duck_red', '#e8734a'], ['duck_teal', '#2a9d8f']]) {
        tex(s, key, 60, 60, ctx => {
          ctx.fillStyle = body; ctx.beginPath(); ctx.arc(30, 32, 25, 0, 7); ctx.fill();
          // 头顶呆毛（区别于 AB 光头圆鸟）
          ctx.strokeStyle = body; ctx.lineWidth = 5; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(26, 9); ctx.quadraticCurveTo(22, 0, 30, 3);
          ctx.moveTo(33, 8); ctx.quadraticCurveTo(34, 1, 40, 5); ctx.stroke();
          // 肚子
          ctx.fillStyle = 'rgba(255,244,214,.95)';
          ctx.beginPath(); ctx.ellipse(30, 44, 14, 10, 0, 0, 7); ctx.fill();
          eyes(ctx, 21, 26, 39, 7);
          angryBrows(ctx, 30, 17, 14, '#4a2510');
          duckBill(ctx, 32, 34, 11, 7);
          // 翅膀
          ctx.strokeStyle = body; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(8, 40); ctx.lineTo(0, 32); ctx.stroke();
          // 脚
          ctx.strokeStyle = '#f79d2a'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(24, 55); ctx.lineTo(22, 59); ctx.moveTo(37, 55); ctx.lineTo(39, 59); ctx.stroke();
        });
      }
      // 黄鸭（三角冲刺型， yellow = #ffd60a 太像 AB 黄鸟 → 改用琥珀金+菱形轮廓）
      tex(s, 'duck_bolt', 60, 60, ctx => {
        ctx.fillStyle = '#f4a52a';
        ctx.beginPath(); ctx.moveTo(4, 46); ctx.lineTo(52, 24); ctx.lineTo(36, 56); ctx.closePath(); ctx.fill();
        eyes(ctx, 30, 34, 40, 5.5);
        angryBrows(ctx, 36, 27, 9, '#5c3a08');
        duckBill(ctx, 44, 39, 8, 5);
      });
      // 蓝鸭（小圆，分裂数）
      tex(s, 'duck_split', 52, 52, ctx => {
        ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.arc(26, 27, 21, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(255,244,214,.95)';
        ctx.beginPath(); ctx.ellipse(26, 38, 11, 8, 0, 0, 7); ctx.fill();
        eyes(ctx, 18, 22, 34, 6);
        duckBill(ctx, 27, 29, 9, 6);
        ctx.strokeStyle = '#f79d2a'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(21, 46); ctx.lineTo(20, 50); ctx.moveTo(32, 46); ctx.lineTo(33, 50); ctx.stroke();
      });
      // 黑鸭（炸弹鸭，引线是鸭尾翘毛）
      tex(s, 'duck_bomb', 60, 60, ctx => {
        ctx.fillStyle = '#2b2d42'; ctx.beginPath(); ctx.arc(30, 32, 25, 0, 7); ctx.fill();
        ctx.fillStyle = '#8d99ae'; ctx.beginPath(); ctx.ellipse(30, 46, 13, 8, 0, 0, 7); ctx.fill();
        eyes(ctx, 22, 26, 38, 6.5);
        angryBrows(ctx, 30, 17, 14, '#000');
        duckBill(ctx, 32, 34, 10, 6.5);
        // 引线+火花
        ctx.strokeStyle = '#8d99ae'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(30, 8); ctx.quadraticCurveTo(34, 2, 40, 4); ctx.stroke();
        ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.arc(41, 4, 4, 0, 7); ctx.fill();
      });

      // ===== 反派：紫狐狸（尖耳长鼻，区别于绿猪）=====
      for (const [key, bruise] of [['fox', 0], ['fox_hurt', 1]]) {
        tex(s, key, 56, 56, ctx => {
          // 尖耳朵
          ctx.fillStyle = '#6d4fa3';
          ctx.beginPath(); ctx.moveTo(8, 22); ctx.lineTo(6, 2); ctx.lineTo(24, 12); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(48, 22); ctx.lineTo(50, 2); ctx.lineTo(32, 12); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#b890e8';
          ctx.beginPath(); ctx.moveTo(11, 18); ctx.lineTo(11, 8); ctx.lineTo(19, 13); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(45, 18); ctx.lineTo(45, 8); ctx.lineTo(37, 13); ctx.closePath(); ctx.fill();
          // 脸
          ctx.fillStyle = bruise ? '#7d5cb8' : '#6d4fa3';
          ctx.beginPath(); ctx.arc(28, 30, 23, 0, 7); ctx.fill();
          // 白色面颊
          ctx.fillStyle = '#efe4ff';
          ctx.beginPath(); ctx.ellipse(28, 40, 16, 11, 0, 0, 7); ctx.fill();
          if (bruise) { ctx.fillStyle = 'rgba(40,20,70,.5)'; ctx.beginPath(); ctx.arc(15, 22, 7, 0, 7); ctx.fill(); }
          eyes(ctx, 19, 25, 37, 6);
          if (!bruise) angryBrows(ctx, 28, 17, 13, '#2d1b4e');
          // 狐狸鼻尖嘴
          ctx.fillStyle = '#3c2a5e';
          ctx.beginPath(); ctx.moveTo(28, 30); ctx.lineTo(38, 36); ctx.lineTo(28, 42); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.arc(37.5, 36, 3, 0, 7); ctx.fill();
          if (bruise) { ctx.strokeStyle = '#111'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(28, 47, 5, .2, Math.PI - .2); ctx.stroke(); }
        });
      }

      // ===== 材质方块：木 / 石 / 冰 / TNT =====
      tex(s, 'wood', 56, 56, ctx => {
        ctx.fillStyle = '#c68b4f'; ctx.fillRect(0, 0, 56, 56);
        ctx.fillStyle = '#a06a35'; for (let y = 6; y < 56; y += 11) ctx.fillRect(0, y, 56, 3);
        ctx.strokeStyle = '#8a5427'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 52, 52);
      });
      tex(s, 'stone', 56, 56, ctx => {
        ctx.fillStyle = '#9aa0a6'; ctx.fillRect(0, 0, 56, 56);
        ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.arc(18, 18, 12, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.arc(38, 40, 14, 0, 7); ctx.fill();
        ctx.strokeStyle = '#6c757d'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 52, 52);
      });
      tex(s, 'ice', 56, 56, ctx => {
        ctx.fillStyle = 'rgba(173,232,244,.92)'; ctx.fillRect(0, 0, 56, 56);
        ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(8, 48); ctx.lineTo(48, 8); ctx.moveTo(30, 52); ctx.lineTo(52, 30); ctx.stroke();
        ctx.strokeStyle = '#7ec8e3'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 52, 52);
      });
      tex(s, 'tnt', 56, 56, ctx => {
        ctx.fillStyle = '#c1121f'; ctx.fillRect(0, 0, 56, 56);
        ctx.fillStyle = '#fff'; ctx.fillRect(4, 16, 48, 22);
        ctx.fillStyle = '#c1121f'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('TNT', 28, 34);
        ctx.strokeStyle = '#6a040f'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 52, 52);
      });
      // 弹弓支架（Y 型木叉）
      tex(s, 'fork', 24, 90, ctx => {
        ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 12; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(12, 88); ctx.lineTo(12, 40); ctx.moveTo(12, 40); ctx.lineTo(2, 8); ctx.moveTo(12, 40); ctx.lineTo(22, 8); ctx.stroke();
      });
}
