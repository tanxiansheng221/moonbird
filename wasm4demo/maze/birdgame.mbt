// 怒鸭大战

///|
pub const ANCHOR_X : Double = 60.0

///|
pub const ANCHOR_Y : Double = 130.0

///|
pub const DRAG_R : Double = 24.0

///|
pub const LAUNCH_K : Double = 14.0

///|
pub const LAUNCH_VMAX : Double = 380.0

///|
/// 总关数（M4：12 关）
pub const NUM_LEVELS : Int = 12

///|


///|
/// 回合阶段：瞄准 → 飞行 → 尘埃落定
pub(all) enum Phase {
  Aiming
  Flying
  Settling
}

///|
pub(all) struct Particle {
  mut x : Double
  mut y : Double
  mut vx : Double
  mut vy : Double
  mut life : Double
  mut col : UInt // wasm4 调色板索引 1..4
}

///|
/// 技能鸟：Red（无技能）/ Yellow（加速冲刺）/ Blue（三分裂）/ Black（爆炸）
pub(all) enum BirdType {
  Red
  Yellow
  Blue
  Black
}

///|
pub(all) struct Game {
  mut world : @core.World
  mut bird : @core.Entity?
  mut phase : Phase
  mut level : Int
  mut won : Bool
  mut drag_x : Double
  mut drag_y : Double
  mut dragging : Bool
  mut prev_mouse : @wasm4.Mouse
  mut prev_button1 : Bool
  mut score : Int
  mut bird_type : BirdType // 本回合鸟的技能类型
  mut skill_used : Bool // 技能每回合一次
  mut split_cooldown : Int // 蓝鸟分裂后的新鸟计步器
  mut particles : Array[Particle]
  mut cam_x : Double
  mut armed : Bool // 发射前不结算碰撞伤害（防开局自爆）

  clock : @core.Clock
}

///|
/// 状态机入口：载入指定关卡并重置回合状态（分数跨关累计）


///|
pub fn Game::new() -> Game {
  let g : Game = {
    world: @core.World::new(),
    bird: None,
    phase: Aiming,
    level: 1,
    won: false,
    drag_x: ANCHOR_X,
    drag_y: ANCHOR_Y,
    dragging: false,
    prev_mouse: @wasm4.Mouse::default(),
    prev_button1: false,
    score: 0,
    bird_type: Red,
    skill_used: false,
    split_cooldown: 0,
    particles: [],
    cam_x: 0.0,
    armed: false,
    clock: @core.Clock::new(max_steps=MAX_STEPS),
  }
  g.load_level()
  g.spawn_bird()
  g
}

///|
/// 关卡分发：清空世界并按当前关号重建布局（M4：12 关循环复用 3 套模板）
fn Game::load_level(self : Game) -> Unit {
  self.world = @core.World::new()
  self.particles = []
  self.armed = false
  self.add_ground()
  match self.level {
    1 => self.load_level1()
    2 => self.load_level2()
    3 => self.load_level3()
    4 => self.load_level4()
    5 => self.load_level5()
    6 => self.load_level6()
    7 => self.load_level7()
    8 => self.load_level8()
    9 => self.load_level9()
    10 => self.load_level10()
    11 => self.load_level11()
    _ => self.load_level12()
  }
}

///|
/// 状态机入口：载入指定关卡并重置回合状态（分数跨关累计）
fn Game::start_level(self : Game, lv : Int) -> Unit {
  self.level = lv
  self.won = false
  self.load_level()
  self.spawn_bird()
}

///|
fn Game::add_ground(self : Game) -> Unit {
  self.world.add(
    {
      px: 100.0, py: 155.0, vx: 0.0, vy: 0.0,
      kind: @core.GroundK, shape: @core.Static, mat: @core.Ground,
      hp: 1.0e9, asleep: false, sleep_t: 0.0, dead: false,
    },
  )
}

///|
fn Game::add_box(
  self : Game,
  px : Double,
  py : Double,
  w : Int,
  h : Int,
  mat : @core.Material,
) -> Unit {
  self.world.add(
    {
      px, py, vx: 0.0, vy: 0.0,
      kind: @core.BlockK, shape: @core.Box(w, h), mat,
      hp: @core.mat_hp(mat), asleep: false, sleep_t: 0.0, dead: false,
    },
  )
}

///|
fn Game::add_tnt(self : Game, px : Double, py : Double) -> Unit {
  self.world.add(
    {
      px, py, vx: 0.0, vy: 0.0,
      kind: @core.TntK, shape: @core.Box(10, 10), mat: @core.Tnt,
      hp: @core.mat_hp(@core.Tnt), asleep: false, sleep_t: 0.0, dead: false,
    },
  )
}

///|
fn Game::add_pig(self : Game, px : Double, py : Double) -> Unit {
  self.world.add(
    {
      px, py, vx: 0.0, vy: 0.0,
      kind: @core.PigK, shape: @core.Circle(6.0), mat: @core.Pig,
      hp: @core.mat_hp(@core.Pig), asleep: false, sleep_t: 0.0, dead: false,
    },
  )
}

///|


///|
/// 关卡 1：木塔 + 冰砖 + TNT（M1 原始布局）
fn Game::load_level1(self : Game) -> Unit {
  // 右侧石质基座 + 冰砖 + TNT
  self.add_box(150.0, 145.0, 8, 20, @core.Stone)
  self.add_box(130.0, 145.0, 8, 20, @core.Ice)
  self.add_tnt(168.0, 145.0)
  // 木方块塔（两层）
  self.add_box(138.0, 130.0, 16, 6, @core.Wood)
  self.add_box(162.0, 130.0, 16, 6, @core.Wood)
  self.add_box(150.0, 118.0, 16, 6, @core.Wood)
  // 猪（塔下）
  self.add_pig(150.0, 142.0)
}

///|
/// 关卡 2：冰堡 — 冰柱承重 + 木板顶 + TNT 芯，两只猪
fn Game::load_level2(self : Game) -> Unit {
  // 冰柱两根
  self.add_box(140.0, 145.0, 8, 20, @core.Ice)
  self.add_box(164.0, 145.0, 8, 20, @core.Ice)
  // TNT 芯（夹在冰柱中间）
  self.add_tnt(152.0, 145.0)
  // 木板顶
  self.add_box(152.0, 132.0, 36, 6, @core.Wood)
  // 上层小冰屋
  self.add_box(144.0, 122.0, 8, 12, @core.Ice)
  self.add_box(160.0, 122.0, 8, 12, @core.Ice)
  self.add_box(152.0, 114.0, 24, 5, @core.Wood)
  // 猪：屋内一只、屋顶一只
  self.add_pig(152.0, 147.0)
  self.add_pig(152.0, 106.0)
}

///|
/// 关卡 3：石塔 — 石柱三层 + 木梁 + 底部 TNT，猪在塔顶与塔后
fn Game::load_level3(self : Game) -> Unit {
  // 第一层：石柱 + TNT 底座
  self.add_box(142.0, 145.0, 8, 20, @core.Stone)
  self.add_tnt(152.0, 148.0)
  self.add_box(162.0, 145.0, 8, 20, @core.Stone)
  // 木梁
  self.add_box(152.0, 132.0, 40, 6, @core.Wood)
  // 第二层：冰柱（承重弱化）
  self.add_box(144.0, 121.0, 8, 16, @core.Ice)
  self.add_box(160.0, 121.0, 8, 16, @core.Ice)
  self.add_box(152.0, 110.0, 32, 5, @core.Wood)
  // 第三层：小石屋
  self.add_box(146.0, 102.0, 7, 9, @core.Stone)
  self.add_box(158.0, 102.0, 7, 9, @core.Stone)
  self.add_box(152.0, 94.0, 22, 5, @core.Wood)
  // 猪：塔顶一只、塔后一只
  self.add_pig(152.0, 86.0)
  self.add_pig(185.0, 147.0)
}

///|
/// 关 4（黄鸟关）：远处高塔，需加速冲刺够得着
fn Game::load_level4(self : Game) -> Unit {
  self.add_box(255.0, 145.0, 8, 20, @core.Wood)
  self.add_box(275.0, 145.0, 8, 20, @core.Wood)
  self.add_box(265.0, 132.0, 32, 6, @core.Wood)
  self.add_box(265.0, 122.0, 8, 14, @core.Ice)
  self.add_tnt(265.0, 147.0)
  self.add_pig(265.0, 112.0)
}

///|
/// 关 5（黑鸟关）：石头堡垒，需爆炸破墙
fn Game::load_level5(self : Game) -> Unit {
  self.add_box(200.0, 145.0, 8, 20, @core.Stone)
  self.add_box(212.0, 145.0, 8, 20, @core.Stone)
  self.add_box(206.0, 132.0, 24, 6, @core.Stone)
  self.add_pig(206.0, 147.0)
  self.add_box(250.0, 145.0, 8, 20, @core.Stone)
  self.add_box(262.0, 145.0, 8, 20, @core.Stone)
  self.add_box(256.0, 132.0, 24, 6, @core.Wood)
  self.add_tnt(256.0, 147.0)
  self.add_pig(256.0, 125.0)
}

///|
/// 关 6（蓝鸟关）：三只分散小猪，需分裂打击
fn Game::load_level6(self : Game) -> Unit {
  self.add_box(180.0, 147.0, 12, 12, @core.Ice)
  self.add_pig(180.0, 138.0)
  self.add_box(215.0, 147.0, 12, 12, @core.Ice)
  self.add_pig(215.0, 138.0)
  self.add_box(250.0, 147.0, 12, 12, @core.Ice)
  self.add_pig(250.0, 138.0)
}

///|
/// 关 7：双层木塔 + 护墙
fn Game::load_level7(self : Game) -> Unit {
  self.add_box(170.0, 145.0, 8, 20, @core.Stone)
  self.add_box(190.0, 145.0, 8, 20, @core.Stone)
  self.add_box(180.0, 130.0, 30, 6, @core.Wood)
  self.add_box(174.0, 120.0, 8, 14, @core.Wood)
  self.add_box(186.0, 120.0, 8, 14, @core.Wood)
  self.add_box(180.0, 110.0, 24, 5, @core.Wood)
  self.add_pig(180.0, 147.0)
  self.add_pig(180.0, 103.0)
}

///|
/// 关 8（蓝鸟关）：高低双堡，分裂上下开打
fn Game::load_level8(self : Game) -> Unit {
  self.add_box(190.0, 145.0, 8, 20, @core.Wood)
  self.add_box(206.0, 145.0, 8, 20, @core.Wood)
  self.add_box(198.0, 130.0, 28, 6, @core.Wood)
  self.add_pig(198.0, 147.0)
  self.add_box(250.0, 125.0, 8, 20, @core.Ice)
  self.add_box(266.0, 125.0, 8, 20, @core.Ice)
  self.add_box(258.0, 112.0, 24, 5, @core.Wood)
  self.add_pig(258.0, 105.0)
}

///|
/// 关 9（黄鸟关）：远距高空塔，需冲刺+抛物线
fn Game::load_level9(self : Game) -> Unit {
  self.add_box(270.0, 139.0, 8, 32, @core.Stone)
  self.add_box(286.0, 139.0, 8, 32, @core.Stone)
  self.add_box(278.0, 118.0, 30, 6, @core.Wood)
  self.add_box(278.0, 108.0, 8, 14, @core.Ice)
  self.add_pig(278.0, 97.0)
  self.add_pig(278.0, 146.0)
}

///|
/// 关 10（黑鸟关）：石塔群 + TNT 链
fn Game::load_level10(self : Game) -> Unit {
  self.add_box(180.0, 145.0, 8, 20, @core.Stone)
  self.add_tnt(190.0, 147.0)
  self.add_box(200.0, 145.0, 8, 20, @core.Stone)
  self.add_box(230.0, 145.0, 8, 20, @core.Stone)
  self.add_tnt(240.0, 147.0)
  self.add_box(250.0, 145.0, 8, 20, @core.Stone)
  self.add_box(215.0, 130.0, 70, 6, @core.Wood)
  self.add_pig(215.0, 122.0)
  self.add_pig(215.0, 147.0)
}

///|
/// 关 11（黄鸟关）：冰桥天险
fn Game::load_level11(self : Game) -> Unit {
  self.add_box(200.0, 145.0, 8, 20, @core.Stone)
  self.add_box(240.0, 145.0, 8, 20, @core.Stone)
  self.add_box(220.0, 132.0, 50, 6, @core.Ice)
  self.add_box(212.0, 120.0, 8, 18, @core.Ice)
  self.add_box(228.0, 120.0, 8, 18, @core.Ice)
  self.add_box(220.0, 108.0, 30, 5, @core.Wood)
  self.add_pig(220.0, 100.0)
  self.add_pig(220.0, 147.0)
  self.add_tnt(220.0, 146.0)
}

///|
/// 关 12（黑鸟关·终极关）：全石巨堡 + 双 TNT + 三猪
fn Game::load_level12(self : Game) -> Unit {
  self.add_box(190.0, 145.0, 8, 20, @core.Stone)
  self.add_box(202.0, 145.0, 8, 20, @core.Stone)
  self.add_tnt(196.0, 148.0)
  self.add_box(196.0, 132.0, 26, 6, @core.Stone)
  self.add_box(240.0, 145.0, 8, 20, @core.Stone)
  self.add_box(252.0, 145.0, 8, 20, @core.Stone)
  self.add_tnt(246.0, 148.0)
  self.add_box(246.0, 132.0, 26, 6, @core.Stone)
  self.add_box(220.0, 122.0, 80, 6, @core.Wood)
  self.add_box(212.0, 112.0, 8, 14, @core.Ice)
  self.add_box(228.0, 112.0, 8, 14, @core.Ice)
  self.add_box(220.0, 102.0, 26, 5, @core.Wood)
  self.add_pig(196.0, 124.0)
  self.add_pig(246.0, 124.0)
  self.add_pig(220.0, 94.0)
}

///|
/// 胜利判定：Settling 全场静止时检查，猪全灭 → 过关/通关
fn Game::check_level_clear(self : Game) -> Unit {
  let mut pigs = 0
  for e in self.world.entities {
    if e.kind is @core.PigK && !e.dead {
      pigs += 1
    }
  }
  if pigs == 0 {
    self.score += 1000
    if self.level >= NUM_LEVELS {
      self.won = true
    } else {
      self.level += 1
      self.load_level()
      self.spawn_bird()
      @wasm4.tone(
        (660, 880), @wasm4.ADSR::new(60, release=40),
        @wasm4.ADSRVolume::new(80),
        @wasm4.ToneFlag::new(),
      )
    }
  }
}

/// 每关鸟的类型：覆盖 4 种技能，前期简单后期技能关
fn bird_type_for_level(lv : Int) -> BirdType {
  match lv {
    4 => Yellow
    5 => Black
    6 => Blue
    8 => Blue
    9 => Yellow
    10 => Black
    11 => Yellow
    12 => Black
    _ => Red
  }
}

///|
fn Game::spawn_bird(self : Game) -> Unit {
  let bt = bird_type_for_level(self.level)
  self.bird_type = bt
  self.skill_used = false
  self.split_cooldown = 0
  let b : @core.Entity = {
    px: ANCHOR_X, py: ANCHOR_Y, vx: 0.0, vy: 0.0,
    kind: @core.BirdK, shape: @core.Circle(5.0), mat: @core.Bird,
    hp: 1.0e9, asleep: false, sleep_t: 0.0, dead: false,
  }
  self.world.add(b)
  self.bird = Some(b)
  self.drag_x = ANCHOR_X
  self.drag_y = ANCHOR_Y
  self.phase = Aiming
}

///|
/// 技能触发（X/2 键，飞行中一次）：黄鸟加速 / 蓝鸟三分裂 / 黑鸟爆炸
fn Game::use_skill(self : Game) -> Unit {
  if self.skill_used {
    return
  }
  self.skill_used = true
  match self.bird {
    Some(b) =>
      match self.bird_type {
        Red => ()
        Yellow => {
          // 沿当前速度方向加速到 1.6 倍（上限 520）
          let sp = (b.vx * b.vx + b.vy * b.vy).sqrt()
          if sp > 0.1 {
            let ns = (sp * 1.6).clamp(min=0.0, max=520.0)
            b.vx = b.vx / sp * ns
            b.vy = b.vy / sp * ns
            @wasm4.tone(
              (700, 1100), @wasm4.ADSR::new(40, release=30),
              @wasm4.ADSRVolume::new(75),
              @wasm4.ToneFlag::new(),
            )
          }
        }
        Blue => {
          // 三分裂：主鸟 + 上下 ±22° 副鸟，副鸟由 split_cooldown 延迟激活
          let sp = (b.vx * b.vx + b.vy * b.vy).sqrt()
          if sp > 0.1 {
            let ux = b.vx / sp
            let uy = b.vy / sp
            let c : Double = 0.927 // cos(22°)
            let s : Double = 0.375 // sin(22°)
            for k in [1, -1] {
              let sub : @core.Entity = {
                px: b.px, py: b.py, vx: 0.0, vy: 0.0,
                kind: @core.BirdK, shape: @core.Circle(4.0), mat: @core.Bird,
                hp: 1.0e9, asleep: true, sleep_t: 0.0, dead: false,
              }
              self.split_cooldown = 2 // 激活帧标记
              sub.asleep = false
              sub.px = b.px - ux * 10.0 * k.to_double()
              sub.py = b.py - uy * 10.0 * k.to_double()
              let spd = sp * 0.95
              sub.vx = (ux * c - uy * s * k.to_double()) * spd
              sub.vy = (uy * c + ux * s * k.to_double()) * spd
              self.world.add(sub)
            }
            @wasm4.tone(
              (900, 1300), @wasm4.ADSR::new(30, release=20),
              @wasm4.ADSRVolume::new(70),
              @wasm4.ToneFlag::new(),
            )
          }
        }
        Black => {
          // 原地爆炸：黑鸟自身消散
          b.dead = true
          self.apply_blast(b.px, b.py)
          self.phase = Settling
        }
      }
    None => ()
  }
}

///|
fn Game::input(self : Game) -> Unit {
  let m = @wasm4.get_mouse()
  match self.phase {
    Aiming => {
      if m.left {
        let dx = m.x.to_double() - ANCHOR_X
        let dy = m.y.to_double() - ANCHOR_Y
        let d = (dx * dx + dy * dy).sqrt()
        if d < DRAG_R + 8.0 || self.dragging {
          self.dragging = true
          // 拖拽位置限制在锚点半径 24px 圆内
          let cl = if d > DRAG_R {
            DRAG_R / d
          } else {
            1.0
          }
          self.drag_x = ANCHOR_X + dx * cl
          self.drag_y = ANCHOR_Y + dy * cl
        }
      } else if self.dragging {
        self.dragging = false
        self.launch()
      }
    }
    Flying => {
      // X/2 键：触发技能（黄加速 / 蓝三分裂 / 黑爆炸），每回合一次
      let pad = @wasm4.get_gamepad()
      if pad.button_2 {
        self.use_skill()
      }
      if pad.button_1 && !self.prev_button1 {
        self.phase = Settling
      }
      self.prev_button1 = pad.button_1
    }
    Settling => ()
  }
  self.prev_mouse = m
}

///|
fn Game::launch(self : Game) -> Unit {
  match self.bird {
    Some(b) => {
      let dx = ANCHOR_X - self.drag_x
      let dy = ANCHOR_Y - self.drag_y
      // v = k * (anchor - drag_pos)，上限 v_max
      let mut vx = dx * LAUNCH_K
      let mut vy = dy * LAUNCH_K
      let sp = (vx * vx + vy * vy).sqrt()
      if sp > LAUNCH_VMAX {
        vx = vx / sp * LAUNCH_VMAX
        vy = vy / sp * LAUNCH_VMAX
      }
      b.px = self.drag_x
      b.py = self.drag_y
      b.vx = vx
      b.vy = vy
      @core.Entity::wake(b)
      self.armed = true
      self.phase = Flying
      @wasm4.tone(
        (330, 220), @wasm4.ADSR::new(20, release=10),
        @wasm4.ADSRVolume::new(60),
        @wasm4.ToneFlag::new(),
      )
    }
    None => ()
  }
}

///|
pub const FRAME_DT : Double = 1.0 / 60.0

///|
pub const MAX_STEPS : Int = 3

///|
/// 爆炸：TNT 箱或黑鸟死亡时调用（含链式殉爆，深度防爆栈溢出）
fn Game::apply_blast(self : Game, ex : Double, ey : Double) -> Unit {
  let hits = self.world.explode(
    ex,
    ey,
    @core.TNT_RADIUS,
    @core.TNT_POWER,
    @core.TNT_DAMAGE,
  )
  self.spawn_particles(ex, ey, 20)
  @wasm4.tone(
    (90, 55), @wasm4.ADSR::new(120, release=60),
    @wasm4.ADSRVolume::new(100),
    @wasm4.ToneFlag::new(),
  )
  for h in hits {
    match h.target.kind {
      @core.PigK => {
        if h.target.hp <= 0.0 {
          h.target.dead = true
          self.score += 500
          self.spawn_particles_mat(h.target.px, h.target.py, 8, @core.Pig)
        }
      }
      @core.BlockK => {
        if h.target.hp <= 0.0 {
          h.target.dead = true
          self.score += 150
          self.spawn_particles_mat(h.target.px, h.target.py, 8, h.target.mat)
        }
      }
      @core.TntK => {
        if h.target.hp <= 0.0 && !h.target.dead {
          h.target.dead = true
          self.apply_blast(h.target.px, h.target.py)
        }
      }
      _ => ()
    }
  }
}

///|
/// 按材质发射对应颜色碎片
fn Game::spawn_particles_mat(
  self : Game,
  x : Double,
  y : Double,
  n : Int,
  mat : @core.Material,
) -> Unit {
  self.spawn_particles_col(x, y, n, mat_particle_col(mat))
}

///|
fn mat_particle_col(mat : @core.Material) -> UInt {
  match mat {
    @core.Wood => 4 // 棕色木屑
    @core.Ice => 1 // 白色冰渣
    @core.Stone => 2 // 碎石
    @core.Pig => 3 // 绿色猪碎
    _ => 2
  }
}

///|
/// 碎片粒子：位置发射 n 枚，随机抛射，限时消亡
fn Game::spawn_particles(self : Game, x : Double, y : Double, n : Int) -> Unit {
  self.spawn_particles_col(x, y, n, 2U)
}

///|
fn Game::spawn_particles_col(
  self : Game,
  x : Double,
  y : Double,
  n : Int,
  col : UInt,
) -> Unit {
  for _ in 0..<n {
    // 无三角函数：随机向量归一化得均匀方向
    let mut dx = @core.rand_range(-1.0, 1.0)
    let mut dy = @core.rand_range(-1.0, 1.0)
    let len = (dx * dx + dy * dy).sqrt()
    if len < 0.0001 {
      dx = 1.0
      dy = 0.0
    } else {
      dx = dx / len
      dy = dy / len
    }
    let sp = @core.rand_range(20.0, 90.0)
    self.particles.push(
      {
        x,
        y,
        vx: dx * sp,
        vy: dy * sp - 40.0,
        life: @core.rand_range(0.3, 0.8),
        col,
      },
    )
  }
}

///|
fn Game::fixed_update(self : Game) -> Unit {
  let damages = self.world.step(@core.DT)
  // armed 前只跑物理落位，不结算碰撞伤害（防开局/重开自爆）
  if self.armed {
    for d in damages {
    match d.target.kind {
      @core.PigK => {
        if d.target.hp <= 0.0 {
          d.target.dead = true
          self.score += 500
          self.spawn_particles_mat(d.target.px, d.target.py, 8, @core.Pig)
          @wasm4.tone(
            (520, 390), @wasm4.ADSR::new(40, release=30),
            @wasm4.ADSRVolume::new(80),
            @wasm4.ToneFlag::new(),
          )
        }
      }
      @core.BlockK => {
        if d.target.hp <= 0.0 {
          d.target.dead = true
          self.score += 150
          self.spawn_particles_mat(d.target.px, d.target.py, 8, d.target.mat)
          // 破坏音效：按材质区分音高（木中/石低/冰高）
          let f : (UInt, UInt) = match d.target.mat {
            @core.Stone => (160, 110)
            @core.Ice => (980, 720)
            _ => (340, 250)
          }
          @wasm4.tone(
            f, @wasm4.ADSR::new(30, release=20),
            @wasm4.ADSRVolume::new(55),
            @wasm4.ToneFlag::new(),
          )
        }
      }
      @core.TntK => {
        if d.target.hp <= 0.0 && !d.target.dead {
          d.target.dead = true
          self.apply_blast(d.target.px, d.target.py)
        }
      }
      _ => ()
    }
    }
  }
  // 粒子更新
  let mut i = 0
  while i < self.particles.length() {
    let p = self.particles[i]
    p.vy += @core.GRAVITY * @core.DT
    p.x += p.vx * @core.DT
    p.y += p.vy * @core.DT
    p.life -= @core.DT
    if p.life <= 0.0 {
      let _ = self.particles.remove(i)
    } else {
      i += 1
    }
  }
  // 清理死亡实体（鸟除外）
  self.world.entities.retain(fn (e) { !(e.dead && !(e.kind is @core.BirdK)) })
  // 回合推进
  match self.phase {
    Flying => {
      match self.bird {
        Some(b) => {
          let stopped = b.asleep ||
            (b.px < -20.0 || b.px > 340.0 || b.py > 200.0)
          if stopped {
            b.dead = true
            self.world.entities.retain(fn (e) { !(e.kind is @core.BirdK) })
            self.bird = None
            self.phase = Settling
          }
        }
        None => self.phase = Settling
      }
    }
    Settling => {
      // 全场静止（或无活动体）→ 重新装填
      let mut all_sleep = true
      for e in self.world.entities {
        if !(e.kind is @core.GroundK) && !e.asleep {
          all_sleep = false
          break
        }
      }
      if all_sleep {
        self.check_level_clear()
        // 未通关时重新装填（过关换关时 load_level + spawn_bird 已完成，鸟在 Aiming）
        if !self.won {
          let mut has_live_pig = false
          for e in self.world.entities {
            if e.kind is @core.PigK && !e.dead {
              has_live_pig = true
            }
          }
          if has_live_pig {
            self.spawn_bird()
          }
        }
      }
    }
    Aiming => ()
  }
}

///|
pub fn Game::run_steps(self : Game) -> Unit {
  // accumulator 固定步长：落后时最多追 MAX_STEPS 步防螺旋（见 core.Clock）
  let _ = self.clock.tick(FRAME_DT, fn() { self.fixed_update() })
}

///|
pub fn Game::update(self : Game) -> Unit {
  self.input()
  self.run_steps()
  self.update_camera()
}

///|
/// 镜头跟随：Flying 时平滑追踪鸟，X 轴限制在 [0, 80]（世界宽 400，视口 320）
fn Game::update_camera(self : Game) -> Unit {
  let target = match self.phase {
    Flying => {
      match self.bird {
        Some(b) => (b.px - 160.0).clamp(min=0.0, max=80.0)
        None => 0.0
      }
    }
    _ => 0.0
  }
  self.cam_x += (target - self.cam_x) * 0.15
  if self.cam_x < 0.5 {
    self.cam_x = 0.0
  }
}

///|
fn mat_draw_col(mat : @core.Material) -> UInt {
  match mat {
    @core.Wood => 4
    @core.Stone => 3
    @core.Ice => 1
    _ => 2
  }
}

///|
fn Game::draw(self : Game) -> Unit {
  @wasm4.set_palette(1, @wasm4.rgb(0xfbf7f3))
  @wasm4.set_palette(2, @wasm4.rgb(0xe0402a))
  @wasm4.set_palette(3, @wasm4.rgb(0x6ab04c))
  @wasm4.set_palette(4, @wasm4.rgb(0x8b5a2b))
  // 地面
  @wasm4.set_draw_colors(4, index=1)
  @wasm4.rect(0, 150, 320, 10)
  let cx = self.cam_x.to_int()
  // 方块
  for e in self.world.entities {
    if e.dead {
      continue
    }
    match e.shape {
      @core.Box(w, h) => {
        @wasm4.set_draw_colors(mat_draw_col(e.mat), index=1)
        @wasm4.rect(
          (e.px - w.to_double() / 2.0).to_int() - cx,
          (e.py - h.to_double() / 2.0).to_int(),
          w,
          h,
        )
      }
      @core.Circle(r) => {
        let ri = (r * 2.0).to_int()
        let sx = (e.px - r).to_int() - cx
        match e.kind {
          @core.PigK => {
            @wasm4.set_draw_colors(3, index=1)
            @wasm4.oval(sx, (e.py - r).to_int(), ri, ri)
          }
          @core.BirdK => {
            @wasm4.set_draw_colors(2, index=1)
            @wasm4.oval(sx, (e.py - r).to_int(), ri, ri)
          }
          _ => ()
        }
      }
      @core.Static => ()
    }
  }
  // 粒子（各自颜色）
  for p in self.particles {
    @wasm4.set_draw_colors(p.col, index=1)
    @wasm4.rect(p.x.to_int() - cx, p.y.to_int(), 2, 2)
  }
  // 弹弓
  @wasm4.set_draw_colors(4, index=1)
  @wasm4.line(ANCHOR_X.to_int() - 4, 150, ANCHOR_X.to_int(), ANCHOR_Y.to_int())
  @wasm4.line(ANCHOR_X.to_int() + 4, 150, ANCHOR_X.to_int(), ANCHOR_Y.to_int())
  match self.phase {
    Aiming => {
      // 皮筋 + 拖拽中的鸟
      let bx = if self.dragging { self.drag_x } else { ANCHOR_X }
      let by = if self.dragging { self.drag_y } else { ANCHOR_Y }
      @wasm4.line(
        ANCHOR_X.to_int() - 4,
        146,
        bx.to_int(),
        by.to_int(),
      )
      @wasm4.line(ANCHOR_X.to_int() + 4, 146, bx.to_int(), by.to_int())
      @wasm4.set_draw_colors(2, index=1)
      @wasm4.oval((bx - 5.0).to_int(), (by - 5.0).to_int(), 10, 10)
      // 轨迹预览（dt=1/30，12 点）
      let vx0 = (ANCHOR_X - bx) * LAUNCH_K
      let vy0 = (ANCHOR_Y - by) * LAUNCH_K
      let sp = (vx0 * vx0 + vy0 * vy0).sqrt()
      let sc = if sp > LAUNCH_VMAX {
        LAUNCH_VMAX / sp
      } else {
        1.0
      }
      let tvx = vx0 * sc
      let mut tvy = vy0 * sc
      let mut tx = bx
      let mut ty = by
      @wasm4.set_draw_colors(1, index=1)
      for _ in 0..<12 {
        tx += tvx / 30.0
        ty += tvy / 30.0
        tvy += @core.GRAVITY / 30.0
        @wasm4.oval(tx.to_int(), ty.to_int(), 2, 2)
      }
    }
    _ => ()
  }
  // 分数与关卡/通关状态
  @wasm4.set_draw_colors(1, index=1)
  @wasm4.text("SCORE \{self.score}", 4, 4)
  if self.won {
    @wasm4.text("LEVEL CLEAR! \{self.level}/{NUM_LEVELS}", 90, 70)
  } else {
    @wasm4.text("L\{self.level}", 4, 14)
  }
}
