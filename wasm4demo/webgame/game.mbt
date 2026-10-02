// 怒鸭大战
// 移植自 maze/birdgame.mbt：去掉 wasm4 音频/绘制/输入，改由 JS 薄壳轮询状态。

///|
fn Game::rand_u32(self : Game) -> UInt {
  let x = self.rng_state
  let x2 = x ^ (x << 13)
  let x3 = x2 ^ (x2 >> 17)
  let x4 = x3 ^ (x3 << 5)
  self.rng_state = x4
  x4
}

///|
fn Game::rand_range(self : Game, lo : Double, hi : Double) -> Double {
  lo + (self.rand_u32().to_double() / 4294967296.0) * (hi - lo)
}

///|
/// 状态机入口：载入指定关卡并重置回合状态（分数跨关累计）
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
    skip_req: false,
    score: 0,
    bird_type: Red,
    skill_used: false,
    particles: [],
    cam_x: 0.0,
    rng_state: 0x2545F491U,
    crawl_t: 0.0,
    bird_blasted: false,
    ev_shot: false,
    ev_blast: false,
    ev_clear: false,
    ev_boom: 0,
    ev_impact: 0,
    ev_score: 0,
    shake: 0.0,
    settle_t: 0.0,
    clock: @core.Clock::new(max_steps=3),
  }
  g.load_level()
  g.spawn_bird()
  g
}

///|
pub fn Game::spawn_bird(self : Game) -> Unit {
  self.world.entities.retain(fn(e) { !(e.kind is @core.BirdK) })
  self.bird = None
  self.bird_type = bird_type_for_level(self.level)
  self.skill_used = false
  self.skip_req = false
  self.drag_x = ANCHOR_X
  self.drag_y = ANCHOR_Y
  self.crawl_t = 0.0
  self.bird_blasted = false
  self.settle_t = 0.0
  self.phase = Aiming
  let b : @core.Entity = {
    px: ANCHOR_X, py: ANCHOR_Y, vx: 0.0, vy: 0.0,
    kind: @core.BirdK, shape: @core.Circle(15.0), mat: @core.Bird,
    hp: 1.0e9, asleep: true, sleep_t: 0.0, dead: false,
  }
  // Aiming 阶段保持休眠：否则 integrate 每帧加重力，鸭会从弹弓上直接坠落。
  // launch() 中 Entity::wake() 已负责唤醒。
  self.world.add(b)
  self.bird = Some(b)
}

///|
/// JS 薄壳注入拖拽（世界坐标）；down=按下, dragging 中持续更新, 松开时 down=false
pub fn Game::pointer(self : Game, x : Double, y : Double, down : Bool) -> Unit {
  if !(self.phase is Aiming) {
    return
  }
  if down {
    let dx = x - ANCHOR_X
    let dy = y - ANCHOR_Y
    let d = (dx * dx + dy * dy).sqrt()
    if d < DRAG_R + 24.0 || self.dragging {
      self.dragging = true
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

///|
/// 技能触发（JS 薄壳在飞行中按空格/X 调用，每回合一次）
pub fn Game::use_skill(self : Game) -> Unit {
  if self.skill_used {
    return
  }
  match self.bird {
    Some(b) =>
      match self.bird_type {
        Red => return
        Yellow => {
          let sp = (b.vx * b.vx + b.vy * b.vy).sqrt()
          if sp > 0.1 {
            self.skill_used = true
            let ns = (sp * 1.6).clamp(min=0.0, max=520.0)
            b.vx = b.vx / sp * ns
            b.vy = b.vy / sp * ns
            self.spawn_particles_col(b.px, b.py, 10, 1)
          }
        }
        Blue => {
          let sp = (b.vx * b.vx + b.vy * b.vy).sqrt()
          if sp > 0.1 {
            self.skill_used = true
            let ux = b.vx / sp
            let uy = b.vy / sp
            let c : Double = 0.927 // cos(22°)
            let s : Double = 0.375 // sin(22°)
            for k in [1, -1] {
              let sub : @core.Entity = {
                px: b.px, py: b.py, vx: 0.0, vy: 0.0,
                kind: @core.BirdK, shape: @core.Circle(12.0), mat: @core.Bird,
                hp: 1.0e9, asleep: false, sleep_t: 0.0, dead: false,
              }
              sub.px = b.px - ux * 30.0 * k.to_double()
              sub.py = b.py - uy * 30.0 * k.to_double()
              let spd = sp * 0.95
              sub.vx = (ux * c - uy * s * k.to_double()) * spd
              sub.vy = (uy * c + ux * s * k.to_double()) * spd
              self.world.add(sub)
            }
          }
        }
        Black => {
          self.skill_used = true
          b.dead = true
          self.apply_blast(b.px, b.py)
          self.phase = Settling
        }
      }
    None => ()
  }
}

///|
/// JS 薄壳请求跳过本回合（直接结算）
pub fn Game::skip_shot(self : Game) -> Unit {
  self.skip_req = true
}

///|
fn Game::launch(self : Game) -> Unit {
  match self.bird {
    Some(b) => {
      let dx = ANCHOR_X - self.drag_x
      let dy = ANCHOR_Y - self.drag_y
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
      self.phase = Flying
      self.ev_shot = true
    }
    None => ()
  }
}

///|
/// 爆炸：鸭爆箱或黑鸭触发（含链式殉爆）
fn Game::apply_blast(self : Game, ex : Double, ey : Double) -> Unit {
  let hits = self.world.explode(
    ex,
    ey,
    @core.TNT_RADIUS * 3.0,
    @core.TNT_POWER,
    @core.TNT_DAMAGE,
  )
  self.spawn_particles(ex, ey, 26)
  self.shake = 1.0
  self.ev_blast = true
  let blasts : Array[(Double, Double)] = []
  for h in hits {
    // 爆炸伤害在此统一结算（World::explode 只返回受击事件不扣血）
    if h.target.hp > 0.0 {
      h.target.hp -= h.amount
    }
    if h.target.hp <= 0.0 && !h.target.dead {
      h.target.dead = true
      match h.target.kind {
        @core.PigK => {
          self.score += 500
          self.ev_score += 1
          self.spawn_particles_mat(h.target.px, h.target.py, 8, @core.Pig)
        }
        @core.BlockK => {
          self.score += 150
          self.ev_score += 1
          self.spawn_particles_mat(h.target.px, h.target.py, 8, h.target.mat)
        }
        @core.TntK => blasts.push((h.target.px, h.target.py))
        _ => ()
      }
    }
  }
  // TNT 殉爆链（延迟到循环外防止边遍历边炸）
  for p in blasts {
    self.apply_blast(p.0, p.1)
  }
}

///|
fn mat_particle_col(mat : @core.Material) -> Int {
  match mat {
    @core.Wood => 4 // 棕色木屑
    @core.Ice => 1 // 白色冰渣
    @core.Stone => 2 // 碎石
    @core.Pig => 3 // 绿狐碎
    _ => 2
  }
}

///|
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
fn Game::spawn_particles(self : Game, x : Double, y : Double, n : Int) -> Unit {
  self.spawn_particles_col(x, y, n, 2)
}

///|
fn Game::spawn_particles_col(
  self : Game,
  x : Double,
  y : Double,
  n : Int,
  col : Int,
) -> Unit {
  for _ in 0..<n {
    let mut dx = self.rand_range(-1.0, 1.0)
    let mut dy = self.rand_range(-1.0, 1.0)
    let len = (dx * dx + dy * dy).sqrt()
    if len < 0.0001 {
      dx = 1.0
      dy = 0.0
    } else {
      dx = dx / len
      dy = dy / len
    }
    let sp = self.rand_range(60.0, 270.0)
    self.particles.push(
      {
        x,
        y,
        vx: dx * sp,
        vy: dy * sp - 120.0,
        life: self.rand_range(0.3, 0.8),
        col,
      },
    )
  }
}

///|
fn Game::fixed_update(self : Game) -> Unit {
  // 清理飞出世界的实体：坠落体永不休眠会卡死 Settling 结算
  for e in self.world.entities {
    if !(e.kind is @core.GroundK) &&
      !e.dead &&
      (e.py > 900.0 || e.px < -100.0 || e.px > 1400.0) {
      e.dead = true
      e.asleep = true
      e.vx = 0.0
      e.vy = 0.0
    }
  }
  let damages = self.world.step(@core.DT)
  // 撞击手感：飞行中的鸭高速接触到任何实体 → 立即自爆（爆风炸碎周围）
  match self.bird {
    Some(b) =>
      if self.phase is Flying && !self.bird_blasted {
        let sp = (b.vx * b.vx + b.vy * b.vy).sqrt()
        if sp > 110.0 {
          for e in self.world.entities {
            let rr = @core.Entity::radius(b) + @core.Entity::radius(e) + 2.0
            if !(e.kind is @core.GroundK) &&
              !(e.kind is @core.BirdK) &&
              !e.dead &&
              ((e.px - b.px) * (e.px - b.px) + (e.py - b.py) * (e.py - b.py)) <
              rr * rr {
              self.bird_blasted = true
              break
            }
          }
          if self.bird_blasted {
            b.dead = true
            self.ev_impact += 1
            self.apply_blast(b.px, b.py)
            self.bird = None
            self.world.entities.retain(fn(e) { !(e.kind is @core.BirdK) })
            self.phase = Settling
          }
        }
      }
    None => ()
  }
  // 撞击手感：飞行中的鸭速度低于爬行阈值时累计计时，超过 0.7s 强制退场——
  // 撞碎后剩余动能已释放，不再低速推挤方块走几百帧
  match self.bird {
    Some(b) =>
      if self.phase is Flying {
        let sp = (b.vx * b.vx + b.vy * b.vy).sqrt()
        if sp < 90.0 {
          self.crawl_t += @core.DT
        } else {
          self.crawl_t = 0.0
        }
      }
    None => ()
  }
  for d in damages {
    match d.target.kind {
      @core.PigK =>
        if d.target.hp <= 0.0 && !d.target.dead {
          d.target.dead = true
          self.score += 500
          self.ev_score += 1
          self.ev_boom += 1
          self.shake = (self.shake + 0.35).clamp(min=0.0, max=1.0)
          self.spawn_particles_mat(d.target.px, d.target.py, 8, @core.Pig)
        }
      @core.BlockK =>
        if d.target.hp <= 0.0 && !d.target.dead {
          d.target.dead = true
          self.score += 150
          self.ev_score += 1
          self.ev_boom += 1
          self.shake = (self.shake + 0.2).clamp(min=0.0, max=1.0)
          self.spawn_particles_mat(d.target.px, d.target.py, 8, d.target.mat)
        }
      @core.TntK =>
        if d.target.hp <= 0.0 && !d.target.dead {
          d.target.dead = true
          self.apply_blast(d.target.px, d.target.py)
        }
      _ => ()
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
  self.world.entities.retain(fn(e) { !(e.dead && !(e.kind is @core.BirdK)) })
  // 回合推进
  match self.phase {
    Flying => {
      match self.bird {
        Some(b) => {
          let stopped =
            b.asleep ||
            (b.px < -60.0 || b.px > 1260.0 || b.py > 720.0) ||
            self.skip_req ||
            self.crawl_t > 0.7
          if stopped {
            b.dead = true
            // 停止/出界死亡也结算动能：非主动跳过时释放一次爆炸（按剩余速度取强度）
            // —— 保证"鸭无论怎么死都有爆炸与得分反馈"，避免低速蹭塔白死
            if !self.skip_req {
              self.apply_blast(b.px, b.py)
              self.ev_impact += 1
            }
            self.world.entities.retain(fn(e) { !(e.kind is @core.BirdK) })
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
      // 兜底：堆叠接触的数值抖动可能让个别块长期不休眠，超时强制休眠并装填
      if !all_sleep {
        self.settle_t += FRAME_DT
        // 2.5s 即兜底（原 8s：爆炸后明明只剩微抖却要干等好几秒才装填）
        if self.settle_t > SETTLE_TIMEOUT {
          for e in self.world.entities {
            e.asleep = true
            e.vx = 0.0
            e.vy = 0.0
          }
          all_sleep = true
        }
      }
      if all_sleep {
        self.check_level_clear()
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
  // accumulator 固定步长：落后时最多追 3 步防螺旋
  let _ = self.clock.tick(FRAME_DT, fn() { self.fixed_update() })
}

///|
pub const FRAME_DT : Double = 1.0 / 60.0

///|
/// 镜头跟随：Flying 时平滑追踪主鸭，X 轴限制在 [0, 400]
fn Game::update_camera(self : Game) -> Unit {
  let target = match self.phase {
    Flying =>
      match self.bird {
        Some(b) => (b.px - 640.0).clamp(min=0.0, max=400.0)
        None => 0.0
      }
    _ => 0.0
  }
  self.cam_x += (target - self.cam_x) * 0.15
  if self.cam_x < 0.5 {
    self.cam_x = 0.0
  }
}

///|
pub fn Game::update(self : Game) -> Unit {
  self.run_steps()
  self.update_camera()
}

///|
fn Game::check_level_clear(self : Game) -> Unit {
  // 已通关/已过版：不再重复判定（否则 Settling 中 all_sleep 恒真，
  // 每帧 +1000 分 + shake + ev_clear → 画面永久抖动 + 刺耳噪音）
  if self.won {
    return
  }
  let mut pigs = 0
  for e in self.world.entities {
    if e.kind is @core.PigK && !e.dead {
      pigs += 1
    }
  }
  if pigs == 0 {
    self.score += 1000
    self.ev_clear = true
    self.ev_score += 1
    self.shake = (self.shake + 0.3).clamp(min=0.0, max=1.0)
    if self.level >= NUM_LEVELS {
      self.won = true
    } else {
      self.level += 1
      self.load_level()
      self.spawn_bird()
    }
  }
}

// ===== JS 薄壳轮询接口（渲染只读，不触碰逻辑）=====

///|
pub fn Game::get_level(self : Game) -> Int {
  self.level
}

///|
/// 直接跳到指定关卡（测试/调试用）：重置回合状态并装填布局
pub fn Game::load_level_n(self : Game, n : Int) -> Unit {
  self.level = n
  self.won = false
  self.load_level()
  self.spawn_bird()
}

///|
pub fn Game::get_score(self : Game) -> Int {
  self.score
}

///|
pub fn Game::get_won(self : Game) -> Bool {
  self.won
}

///|
/// 消费事件标志：一次性读取（读取后清零）。
/// 返回 (shot, blast, clear, boom_count)
pub fn Game::take_events(self : Game) -> (Bool, Bool, Bool, Int, Int, Int) {
  let r = (
    self.ev_shot,
    self.ev_blast,
    self.ev_clear,
    self.ev_boom,
    self.ev_impact,
    self.ev_score,
  )
  self.ev_shot = false
  self.ev_blast = false
  self.ev_clear = false
  self.ev_boom = 0
  self.ev_impact = 0
  self.ev_score = 0
  r
}

///|
/// 画面震动强度 0..1（每读一次衰减，供 JS 镜头抖动）
pub fn Game::get_shake(self : Game) -> Double {
  let s = self.shake
  self.shake = (s - 0.06).clamp(min=0.0, max=1.0)
  s
}

///|
pub fn Game::get_phase(self : Game) -> Int {
  match self.phase {
    Aiming => 0
    Flying => 1
    Settling => 2
  }
}

///|
pub fn Game::get_bird_type(self : Game) -> Int {
  match self.bird_type {
    Red => 0
    Yellow => 1
    Blue => 2
    Black => 3
  }
}

///|
pub fn Game::get_skill_used(self : Game) -> Bool {
  self.skill_used
}

///|
pub fn Game::get_dragging(self : Game) -> Bool {
  self.dragging
}

///|
pub fn Game::get_drag_x(self : Game) -> Double {
  self.drag_x
}

///|
pub fn Game::get_drag_y(self : Game) -> Double {
  self.drag_y
}

///|
pub fn Game::get_cam_x(self : Game) -> Double {
  self.cam_x
}

///|
pub fn Game::get_particle_count(self : Game) -> Int {
  self.particles.length()
}

///|
pub fn Game::get_particle(self : Game, i : Int) -> (Double, Double, Int) {
  let p = self.particles[i]
  (p.x, p.y, p.col)
}

///|
/// 返回非死亡鸟的数量（主鸟 + 蓝鸟分身）
pub fn Game::get_bird_count(self : Game) -> Int {
  let mut n = 0
  for e in self.world.entities {
    if e.kind is @core.BirdK && !e.dead {
      n += 1
    }
  }
  n
}

///|
/// 轮询世界实体：返回 (kind, mat, shape_tag, a, b, px, py)
/// kind: 0鸟 1狐 2方块 3鸭爆 4地面；shape_tag: 0圆(a=r) 1矩形(a=w,b=h) 2静态
pub fn Game::get_entity_count(self : Game) -> Int {
  self.world.entities.length()
}

///|
pub fn Game::get_entity(self : Game, i : Int) -> (Int, Int, Int, Double, Double, Double, Double) {
  let e = self.world.entities[i]
  let kind = match e.kind {
    @core.BirdK => 0
    @core.PigK => 1
    @core.BlockK => 2
    @core.TntK => 3
    @core.GroundK => 4
  }
  let mat = match e.mat {
    @core.Wood => 1
    @core.Ice => 2
    @core.Stone => 3
    @core.Pig => 4
    @core.Bird => 0
    @core.Tnt => 5
    @core.Ground => 6
  }
  let (tag, a, b) = match e.shape {
    @core.Circle(r) => (0, r, 0.0)
    @core.Box(w, h) => (1, w.to_double(), h.to_double())
    @core.Static => (2, 0.0, 0.0)
  }
  (kind, mat, tag, a, b, e.px, e.py)
}

///|
/// 轨迹预览点数（dt=1/30，12 点），由 JS 每帧调用取点绘制
pub fn Game::traj_point(_self : Game, k : Int, bx : Double, by : Double) -> (Double, Double) {
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
  for _ in 0..<k {
    tx += tvx / 30.0
    ty += tvy / 30.0
    tvy += @core.GRAVITY / 30.0
  }
  (tx, ty)
}
