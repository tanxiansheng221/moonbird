// 怒鸭大战
import Phaser from 'phaser';
import * as G from '../../_build/js/debug/build/webgame/webgame.js';

import { buildTextures } from './art.js';

const W = 1280, H = 720;

// MoonBit 元组导出为 {_0:..} 对象，归一化为数组
const T = t => (Array.isArray(t) ? t : Object.keys(t).sort((a, b) => +a.slice(1) - +b.slice(1)).map(k => t[k]));

// MoonBit 导出常量: (NUM_LEVELS, ANCHOR_X, ANCHOR_Y, GROUND_Y, WORLD_W, DRAG_R)
const [NUM_LEVELS, ANCHOR_X, ANCHOR_Y, GROUND_Y, WORLD_W, DRAG_R] = T(G.api_consts());

// MoonBit 实体 kind/mat -> 贴图键
const KIND_TEX = { 1: 'fox', 2: null, 3: 'tnt', 4: null };
const DUCK_TEX = ['duck_red', 'duck_teal', 'duck_bolt', 'duck_split', 'duck_bomb'];
const MAT_TEX = { 1: 'wood', 2: 'ice', 3: 'stone' };
// 粒子调色板（索引同 MoonBit col）
const PCOL = [0xffffff, 0xdff3ff, 0x9aa7b0, 0x8fd35a, 0xa9743f, 0xff8c42];

// WebAudio 合成音效（无外部资源）：弹射嗖声 / 爆炸轰鸣 / 过关小调
function makeAudio() {
  let ctx = null;
  const ac = () => (ctx ||= new (window.AudioContext || window.webkitAudioContext)());
  function env(node, t0, a, d, peak = 1) {
    const gn = ac().createGain();
    gn.gain.setValueAtTime(0, t0);
    gn.gain.linearRampToValueAtTime(peak, t0 + a);
    gn.gain.exponentialRampToValueAtTime(0.001, t0 + a + d);
    node.connect(gn).connect(ac().destination);
    return gn;
  }
  return {
    swoosh() {
      try {
        const t = ac().currentTime, o = ac().createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(300, t);
        o.frequency.exponentialRampToValueAtTime(900, t + .18);
        env(o, t, .01, .2, .18);
        o.start(t); o.stop(t + .25);
      } catch (e) { /* 音频不可用则静默 */ }
    },
    boom(vol = 1) {
      try {
        const t = ac().currentTime, len = .5;
        const buf = ac().createBuffer(1, ac().sampleRate * len, ac().sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2;
        const src = ac().createBufferSource(); src.buffer = buf;
        const f = ac().createBiquadFilter(); f.type = 'lowpass';
        f.frequency.setValueAtTime(900, t);
        f.frequency.exponentialRampToValueAtTime(90, t + len);
        src.connect(f);
        env(f, t, .005, len, .5 * vol);
        src.start(t);
      } catch (e) { /* 静默 */ }
    },
    thud() {
      try {
        const t = ac().currentTime, o = ac().createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(160, t);
        o.frequency.exponentialRampToValueAtTime(55, t + .12);
        env(o, t, .004, .14, .5);
        o.start(t); o.stop(t + .2);
      } catch (e) { /* 静默 */ }
    },
    ding() {
      try {
        const t = ac().currentTime, o = ac().createOscillator();
        o.type = 'square';
        o.frequency.setValueAtTime(1180, t);
        env(o, t, .002, .09, .12);
        o.start(t); o.stop(t + .12);
      } catch (e) { /* 静默 */ }
    },
    clear() {      try {
        const t = ac().currentTime;
        [523, 659, 784, 1047].forEach((fq, i) => {
          const o = ac().createOscillator();
          o.type = 'triangle'; o.frequency.value = fq;
          env(o, t + i * .12, .01, .3, .2);
          o.start(t + i * .12); o.stop(t + i * .12 + .35);
        });
      } catch (e) { /* 静默 */ }
    },
  };
}

export class GameScene extends Phaser.Scene {
  constructor() { super('game'); }

  create() {
    buildTextures(this);
    this.g = G.api_new_game();          // MoonBit 游戏状态（唯一逻辑源）
    this.sprites = new Map();           // 实体索引 -> Phaser 图像
    this.rings = [];                    // 爆炸扩散光圈 {x,y,t}
    this.ringsG = this.add.graphics().setDepth(7);
    this.audio = makeAudio();
    this.sky = this.add.image(0, 0, 'sky').setOrigin(0).setDepth(0);
    this.ground = this.add.rectangle(0, GROUND_Y + 20, WORLD_W, 100, 0x4a7a3a).setOrigin(0, 0.5).setDepth(1);
    this.fork = this.add.image(ANCHOR_X, ANCHOR_Y, 'fork').setDepth(4);
    this.bandBack = this.add.line(0, 0, 0, 0, 0, 0, 0x5a3a1e).setOrigin(0, .5).setDepth(3).setLineWidth(7);
    this.bandFront = this.add.line(0, 0, 0, 0, 0, 0, 0x6b4226).setOrigin(0, .5).setDepth(5).setLineWidth(7);
    this.trajDots = [];
    for (let i = 0; i < 12; i++) this.trajDots.push(this.add.circle(0, 0, 4, 0xffffff).setAlpha(.5).setDepth(2).setVisible(false));
    this.particlesG = this.add.graphics().setDepth(6);
    this.banner = this.add.text(W / 2, H / 2 - 60, '', { fontFamily: 'sans-serif', fontSize: '72px', color: '#ffd166', stroke: '#16213e', strokeThickness: 10 }).setOrigin(.5).setDepth(11).setVisible(false);
    this.buildHud();
    this.bindInput();
    // 调试出口（验收后可删）
    window.__dbg = this; window.__G = G; window.__g = () => this.g;
  }

  buildHud() {
    const s = this.add.text(24, 18, '', { fontFamily: 'sans-serif', fontSize: '26px', color: '#fff', stroke: '#16213e', strokeThickness: 5 }).setDepth(10);
    const tip = this.add.text(W - 24, 18, '拖拽弹弓发射 · 空格=技能 · S=跳过 · R=重开', { fontFamily: 'sans-serif', fontSize: '20px', color: '#e8f4ff', stroke: '#16213e', strokeThickness: 4 }).setOrigin(1, 0).setDepth(10);
    this.hud = s; this.hud2 = tip;
    const bw = 150, bh = 56;
    this.btn = this.add.container(W - bw - 24, H - bh - 24).setDepth(10);
    const bg = this.add.rectangle(0, 0, bw, bh, 0x16213e, .85).setStrokeStyle(3, 0xffd166).setInteractive({ useHandCursor: true });
    const tx = this.add.text(0, 0, '', { fontFamily: 'sans-serif', fontSize: '24px', color: '#ffd166' }).setOrigin(.5);
    bg.on('pointerdown', () => G.api_use_skill(this.g));
    this.btn.add([bg, tx]); this.btnText = tx;
  }

  bindInput() {
    this.input.on('pointerdown', p => { const w = this.toWorld(p); G.api_pointer(this.g, w.x, w.y, true); });
    this.input.on('pointermove', p => { if (G.api_get_dragging(this.g)) { const w = this.toWorld(p); G.api_pointer(this.g, w.x, w.y, true); } });
    this.input.on('pointerup', p => { const w = this.toWorld(p); G.api_pointer(this.g, w.x, w.y, false); });
    this.input.keyboard.on('keydown-SPACE', () => G.api_use_skill(this.g));
    this.input.keyboard.on('keydown-S', () => G.api_skip_shot(this.g));
    this.input.keyboard.on('keydown-R', () => this.restart());
    // 兜底：canvas 失焦时 Phaser 键盘监听可能收不到事件，window 级再挂一份（防止重复触发用标志位）
    this.keyLatch = {};
    window.addEventListener('keydown', e => {
      if (this.keyLatch[e.code]) return;
      this.keyLatch[e.code] = true;
      if (e.code === 'KeyR') this.restart();
      else if (e.code === 'KeyS') G.api_skip_shot(this.g);
      else if (e.code === 'Space') G.api_use_skill(this.g);
    });
    window.addEventListener('keyup', e => { this.keyLatch[e.code] = false; });
  }

  restart() {
    this.sprites.forEach(s => s.destroy());
    this.sprites.clear();
    this.prevBird = null;
    this.g = G.api_new_game();
  }

  toWorld(p) {
    return { x: p.worldX + this.camScroll, y: p.worldY };
  }

  update() {
    const g = this.g;
    G.api_update(g);
    this.camScroll = G.api_get_cam_x(g);
    this.cameras.main.scrollX = this.camScroll;
    this.syncEntities();
    this.syncBirdBands();
    this.syncTraj();
    this.syncParticles();
    this.syncFx();
    this.syncRings();
    this.syncEvents();
    this.syncHud();
  }

  // 消费 MoonBit 事件队列：音效 + 震屏 + 爆炸光圈 + 过关横幅
  syncEvents() {
    const g = this.g;
    const [shot, blast, clear, booms, impacts, pops] = T(G.api_take_events(g));
    if (shot) this.audio.swoosh();
    if (impacts > 0) this.audio.thud();
    const boomList = [];
    if (blast) boomList.push(this.lastBirdPos || { x: ANCHOR_X, y: ANCHOR_Y });
    // boom=碎块/狐的炸裂数：在最近爆心周围随机散布小型爆炸
    for (let i = 0; i < Math.min(booms, 4); i++) {
      const b = this.lastBirdPos || { x: 500, y: 420 };
      boomList.push({ x: b.x + (Math.random() - .5) * 180, y: b.y + (Math.random() - .5) * 140 });
    }
    boomList.forEach((p, i) => setTimeout(() => this.explodeFx(p.x, p.y, i === 0 && blast ? 1 : .55), i * 55));
    for (let i = 0; i < Math.min(pops, 8); i++) setTimeout(() => this.audio.ding(), 120 + i * 70);
    if (blast) this.audio.boom(1); else if (booms > 0) this.audio.boom(.5);
    const sh = G.api_get_shake(g);
    if (sh > 0.02) this.cameras.main.shake(90, sh * 0.006);
    if (clear) {
      const lv = G.api_get_level(g), won = G.api_get_won(g);
      this.audio.clear();
      this.banner.setText(won ? '🏆 全部通关！' : `第 ${lv - 1} 关通过！`).setVisible(true).setAlpha(1).setScale(.6);
      this.tweens.add({ targets: this.banner, scale: 1, duration: 260, ease: 'Back.Out' });
      this.tweens.add({ targets: this.banner, alpha: 0, delay: 1400, duration: 500, onComplete: () => this.banner.setVisible(false) });
    }
  }

  syncRings() {
    const gph = this.ringsG;
    gph.clear();
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.t += 1 / 60;
      if (r.t > 0.45) { this.rings.splice(i, 1); continue; }
      const k = r.t / 0.45;
      gph.lineStyle(8 * (1 - k), 0xff8c42, 1 - k);
      gph.strokeCircle(r.x, r.y, 30 + k * 190);
      gph.lineStyle(4 * (1 - k), 0xffd166, (1 - k) * .8);
      gph.strokeCircle(r.x, r.y, 12 + k * 140);
    }
  }

  // 爆炸闪光：光圈 + 放射火星 + 白闪（JS 端表现层，逻辑在 MoonBit）
  explodeFx(x, y, scale = 1) {
    this.rings.push({ x, y, t: 0 });
    // 放射火星粒子（纯表现，不参与逻辑）
    const fxG = this.add.graphics().setDepth(8);
    const parts = [];
    const n = Math.round(14 * scale);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = (140 + Math.random() * 320) * scale;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, r: 3 + Math.random() * 5 * scale, c: [0xffd166, 0xff8c42, 0xffffff][i % 3] });
    }
    let t = 0;
    const timer = this.time.addEvent({
      delay: 16, repeat: 22, callback: () => {
        t += 16;
        fxG.clear();
        const k = t / 368;
        for (const p of parts) {
          p.x += p.vx * .016; p.y += p.vy * .016; p.vy += 900 * .016;
          fxG.fillStyle(p.c, 1 - k);
          fxG.fillCircle(p.x, p.y, p.r * (1 - k * .6));
        }
        if (t >= 352) { fxG.destroy(); timer.remove(); }
      },
    });
    // 中心白闪
    const flash = this.add.circle(x, y, 46 * scale, 0xffffff, .9).setDepth(9);
    this.tweens.add({ targets: flash, alpha: 0, scale: 1.8, duration: 200, onComplete: () => flash.destroy() });
  }

  syncFx() {
    // 预留：每帧表现层同步钩子（当前粒子/光圈都在各自 sync 中处理）
  }

  syncEntities() {
    const g = this.g;
    const n = G.api_get_entity_count(g);
    const seen = new Set();
    for (let i = 0; i < n; i++) {
      const [kind, mat, tag, a, b, x, y] = T(G.api_get_entity(g, i));
      const key = i;
      seen.add(key);
      let sp = this.sprites.get(key);
      const texKey = kind === 0 ? (DUCK_TEX[G.api_get_bird_type(g)] || 'duck_red') : kind === 2 ? MAT_TEX[mat] : KIND_TEX[kind];
      if (!sp || sp.texture.key !== texKey) {
        if (sp) sp.destroy();
        if (texKey) sp = this.add.image(x, y, texKey).setDepth(kind === 1 || kind === 0 ? 3 : 2);
        else sp = null; // 地面由贴图表现
        if (sp) this.sprites.set(key, sp); else { this.sprites.delete(key); continue; }
      }
      sp.setPosition(x, y);
      if (tag === 1) { sp.setDisplaySize(a, b); sp.setRotation(0); }
      else if (kind === 0 && this.birdVel) sp.setRotation(Math.atan2(this.birdVel[1], this.birdVel[0]) * .3);
    }
    // 记录主鸭位置供爆炸光圈定位
    this.lastBirdPos = null;
    for (let i = 0; i < n; i++) {
      const [kind, , , , , x, y] = T(G.api_get_entity(g, i));
      if (kind === 0) { this.lastBirdPos = { x, y }; break; }
    }
    for (const [k, sp] of this.sprites) if (!seen.has(k)) { sp.destroy(); this.sprites.delete(k); }
    // 用前后帧位置差估算鸭速度供倾斜
    this.birdVel = null;
    for (let i = 0; i < n; i++) {
      const [kind] = T(G.api_get_entity(g, i));
      if (kind === 0) {
        const sp = this.sprites.get(i);
        if (sp) {
          if (this.prevBird) this.birdVel = [sp.x - this.prevBird[0], sp.y - this.prevBird[1]];
          this.prevBird = [sp.x, sp.y];
        }
        break;
      }
    }
  }

  syncBirdBands() {
    const g = this.g;
    const dragging = G.api_get_dragging(g);
    const dx = G.api_get_drag_x(g), dy = G.api_get_drag_y(g);
    const duck = [...this.sprites.values()].find(s => s.texture.key.startsWith('duck_'));
    if (dragging && duck) {
      duck.setPosition(dx, dy);
      this.bandBack.setTo(ANCHOR_X - 8, ANCHOR_Y - 26, dx, dy);
      this.bandFront.setTo(ANCHOR_X + 8, ANCHOR_Y + 6, dx, dy);
      this.bandBack.setVisible(true); this.bandFront.setVisible(true);
    } else {
      this.bandBack.setVisible(false); this.bandFront.setVisible(false);
    }
  }

  syncTraj() {
    const g = this.g;
    const dragging = G.api_get_dragging(g);
    const dx = G.api_get_drag_x(g), dy = G.api_get_drag_y(g);
    for (let i = 0; i < this.trajDots.length; i++) {
      const d = this.trajDots[i];
      if (!dragging) { d.setVisible(false); continue; }
      const [tx, ty] = T(G.api_traj_point(g, (i + 1) * 6, dx, dy));
      d.setVisible(true).setPosition(tx, ty);
    }
  }

  syncParticles() {
    const g = this.g;
    const gph = this.particlesG;
    gph.clear();
    const n = G.api_get_particle_count(g);
    for (let i = 0; i < n; i++) {
      const [x, y, col] = T(G.api_get_particle(g, i));
      gph.fillStyle(PCOL[col] || 0xffffff, 1);
      gph.fillCircle(x, y, 4);
    }
  }

  syncHud() {
    const g = this.g;
    const lv = G.api_get_level(g), sc = G.api_get_score(g), won = G.api_get_won(g);
    const phase = G.api_get_phase(g), bt = G.api_get_bird_type(g), used = G.api_get_skill_used(g);
    const names = ['红怒鸭', '闪冲鸭', '分身鸭', '轰爆鸭'];
    const skills = ['（无技能）', '空格·冲刺', '空格·分身', '空格·爆破'];
    this.hud.setText(`关卡 ${lv}/${NUM_LEVELS}   得分 ${sc}${won ? '   🏆 全部通关！' : ''}`);
    this.btnText.setText(used ? '已用' : skills[bt]);
    this.btn.setAlpha(phase === 1 && !used && bt > 0 ? 1 : .45);
  }
}
