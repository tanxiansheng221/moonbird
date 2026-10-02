// 怒鸭大战
// 纯逻辑，不依赖平台 API；质点动力学 + 简化形状（详见 docs/02-物理引擎设计.md）

///|
pub(all) struct Vec2 {
  x : Double
  y : Double
}

///|
pub fn Vec2::add(a : Vec2, b : Vec2) -> Vec2 {
  { x: a.x + b.x, y: a.y + b.y }
}

///|
pub fn Vec2::sub(a : Vec2, b : Vec2) -> Vec2 {
  { x: a.x - b.x, y: a.y - b.y }
}

///|
pub fn Vec2::mul(a : Vec2, s : Double) -> Vec2 {
  { x: a.x * s, y: a.y * s }
}

///|
pub fn Vec2::dot(a : Vec2, b : Vec2) -> Double {
  a.x * b.x + a.y * b.y
}

///|
pub fn Vec2::len(a : Vec2) -> Double {
  (a.x * a.x + a.y * a.y).sqrt()
}

///|
fn dabs(v : Double) -> Double {
  if v < 0.0 { -v } else { v }
}

///|
pub fn Vec2::norm(a : Vec2) -> Vec2 {
  let l = Vec2::len(a)
  if l < 1.0e-9 {
    { x: 0.0, y: 0.0 }
  } else {
    { x: a.x / l, y: a.y / l }
  }
}

// ---------- 材质 ----------

///|
pub(all) enum Material {
  Wood
  Ice
  Stone
  Pig
  Bird
  Tnt
  Ground
}

///|
pub fn mat_density(m : Material) -> Double {
  match m {
    Wood => 1.0
    Ice => 0.6
    Stone => 2.5
    Pig => 0.8
    Bird => 1.2
    Tnt => 0.9
    Ground => 100000.0
  }
}

///|
pub fn mat_restitution(m : Material) -> Double {
  match m {
    Wood => 0.2
    Ice => 0.1
    Stone => 0.1
    Pig => 0.3
    Bird => 0.3
    Tnt => 0.2
    Ground => 0.2
  }
}

///|
pub fn mat_threshold(m : Material) -> Double {
  match m {
    // 撞击即碎：阈值大幅下调，高速鸭直接命中第一下就碎裂+得分
    Wood => 26.0
    Ice => 9.0
    Stone => 60.0
    Pig => 16.0
    Bird => 1.0e9
    Tnt => 8.0
    Ground => 1.0e9
  }
}

///|
pub fn mat_hp(m : Material) -> Double {
  match m {
    Wood => 100.0
    Ice => 50.0
    Stone => 250.0
    Pig => 120.0
    Bird => 1.0e9
    Tnt => 1.0
    Ground => 1.0e9
  }
}

// ---------- 实体 ----------

///|
pub(all) enum Shape {
  Circle(Double) // 半径
  Box(Int, Int) // 宽, 高
  Static // 不积分，只碰撞
}

///|
pub(all) enum Kind {
  BirdK
  PigK
  BlockK
  TntK
  GroundK
}

///|
pub(all) struct Entity {
  mut px : Double
  mut py : Double
  mut vx : Double
  mut vy : Double
  kind : Kind
  shape : Shape
  mat : Material
  mut hp : Double
  mut asleep : Bool
  mut sleep_t : Double
  mut dead : Bool
}

///|
pub fn Entity::mass(e : Entity) -> Double {
  if e.kind is GroundK {
    return 0.0
  }
  let d = mat_density(e.mat)
  match e.shape {
    Circle(r) => d * r * r * 3.14159
    Box(w, h) => d * w.to_double() * h.to_double()
    Static => 0.0
  }
}

///|
pub fn Entity::radius(e : Entity) -> Double {
  match e.shape {
    Circle(r) => r
    Box(w, h) => 0.5 * (w * w + h * h).to_double().sqrt()
    Static => 1.0e9
  }
}

///|
pub fn Entity::wake(e : Entity) -> Unit {
  e.asleep = false
  e.sleep_t = 0.0
}

///|
pub fn Entity::inv_mass(e : Entity) -> Double {
  let m = Entity::mass(e)
  if m <= 0.0 {
    0.0
  } else {
    1.0 / m
  }
}

///|
fn Entity::integrate(e : Entity, dt : Double) -> Unit {
  if e.asleep {
    return
  }
  match e.shape {
    Static => return
    _ => ()
  }
  if e.kind is GroundK {
    return
  }
  // 休眠判定（用加重力前的速度：静止堆叠体每帧先被重力加速再由碰撞清零，
  // 若在加重力之后判定，瞬时速度会反复越过阈值导致永不休眠）
  let sp0 = (e.vx * e.vx + e.vy * e.vy).sqrt()
  // 卡在缝隙里的堆叠体每帧被重力加速又被碰撞清零，残速会在阈值附近振荡：
  // 若振荡一越阈就清零 sleep_t，将永远睡不进去（表现为持续微跳）。
  // 处理：低速全额累积、中速抖动半额累积（仍会入睡），只有真正高速运动才清零。
  if sp0 < 4.0 {
    e.sleep_t += dt
  } else if sp0 < 40.0 {
    e.sleep_t += dt * 0.5
  } else {
    e.sleep_t = 0.0
  }
  if e.sleep_t > 1.0 {
    e.asleep = true
    e.vx = 0.0
    e.vy = 0.0
  }
  // 半隐式欧拉
  e.vy += GRAVITY * dt
  // 地面滚动/滑动摩擦：贴地的实体施加水平阻尼，撞碎后动能快速耗散而非爬行推挤
  if e.py > 430.0 && e.vx != 0.0 {
    e.vx -= e.vx * 2.8 * dt
  }
  // 速度上限防穿透
  let vmax = V_MAX
  let sp = (e.vx * e.vx + e.vy * e.vy).sqrt()
  if sp > vmax {
    e.vx = e.vx / sp * vmax
    e.vy = e.vy / sp * vmax
  }
  e.px += e.vx * dt
  e.py += e.vy * dt
}

// ---------- 世界常量 ----------

///|
pub const GRAVITY : Double = 300.0

///|
pub const V_MAX : Double = 700.0

///|
pub const DT : Double = 1.0 / 60.0

///|
pub const SLOP : Double = 0.5

// ---------- 碰撞（窄相） ----------

///|
pub(all) struct Contact {
  nx : Double // 法线（从 a 指向 b）
  ny : Double
  depth : Double // 重叠深度
}

///|
pub fn collide(a : Entity, b : Entity) -> Contact? {
  // Static 形状等效为大平台盒（地面板），参与碰撞但不积分
  match (as_box(a), as_box(b)) {
    (Some((ra, aw, ah)), Some((rb, bw, bh))) =>
      match (ra, rb) {
        (Some(ra), Some(rb)) => {
          let dx = b.px - a.px
          let dy = b.py - a.py
          let d = (dx * dx + dy * dy).sqrt()
          let rr = ra + rb
          if d < rr {
            let nx = if d < 1.0e-9 { 0.0 } else { dx / d }
            let ny = if d < 1.0e-9 { -1.0 } else { dy / d }
            Some({ nx, ny, depth: rr - d })
          } else {
            None
          }
        }
        (Some(ra), None) => circle_box(a, ra, b, bw, bh, false)
        // circle_box 返回的法线已指向圆心（即从盒 a 指向圆 b），无需翻转
        (None, Some(rb)) => circle_box(b, rb, a, aw, ah, false)
        (None, None) => box_box(a, aw, ah, b, bw, bh)
      }
    (None, _) => None
    (_, None) => None
  }
}

///|
fn as_box(e : Entity) -> (Double?, Int, Int)? {
  match e.shape {
    Circle(r) => Some((Some(r), 0, 0))
    Box(w, h) => Some((None, w, h))
    Static => Some((None, 1300, 10)) // 静态体视为大平台盒（地面板，中心 600 覆盖 -50..1250 全关卡）：参与碰撞但不积分
  }
}

///|
fn circle_box(
  c : Entity,
  ra : Double,
  bx : Entity,
  w : Int,
  h : Int,
  flip : Bool,
) -> Contact? {
  let hw = w.to_double() / 2.0
  let hh = h.to_double() / 2.0
  let rx = c.px - bx.px
  let ry = c.py - bx.py
  // 面接触特判：圆心位于盒面正上/正下/正侧方（投影落在面内）时，
  // 法线钳制到坐标轴、穿透按该轴解析式计算。
  // 否则平顶边缘的径向法线会随微小水平漂移逐帧翻轴（近垂直↔近水平），
  // 冲量方向来回切换形成稳态弹跳极限环（L11 右侧堆 bug 根因）。
  if ry <= -hh && dabs(rx) <= hw {
    let depth = ra + ry + hh
    return if depth > 0.0 { Some({ nx: 0.0, ny: -1.0, depth }) } else { None }
  }
  if ry >= hh && dabs(rx) <= hw {
    let depth = ra - ry + hh
    return if depth > 0.0 { Some({ nx: 0.0, ny: 1.0, depth }) } else { None }
  }
  if rx >= hw && dabs(ry) <= hh {
    let depth = ra - rx + hw
    return if depth > 0.0 { Some({ nx: 1.0, ny: 0.0, depth }) } else { None }
  }
  if rx <= -hw && dabs(ry) <= hh {
    let depth = ra + rx + hw
    return if depth > 0.0 { Some({ nx: -1.0, ny: 0.0, depth }) } else { None }
  }
  let cx = if rx < -hw { -hw } else if rx > hw { hw } else { rx }
  let cy = if ry < -hh { -hh } else if ry > hh { hh } else { ry }
  let dx = c.px - (bx.px + cx)
  let dy = c.py - (bx.py + cy)
  let d2 = dx * dx + dy * dy
  if d2 >= ra * ra {
    None
  } else {
    let d = d2.sqrt()
    let (nx, ny, depth) = if d > 1.0e-9 {
      (dx / d, dy / d, ra - d)
    } else {
      // 圆心在盒内：沿最浅轴推出。
      // 轴歧义守卫（与 box_box 同策略）：px≈py 时偏向 y 轴（堆叠方向），
      // 避免逐帧翻轴的法线抖动极限环——L11 堆顶石块坐在双猪头上，
      // 猪圆心嵌在石块底角内 px≈py，翻轴导致石块被反复弹起（振荡 300 帧不收敛）。
      let px = hw - dabs(cx)
      let py = hh - dabs(cy)
      if px < py - 0.5 {
        (if cx < 0.0 { -1.0 } else { 1.0 }, 0.0, ra + px)
      } else {
        (0.0, if cy < 0.0 { -1.0 } else { 1.0 }, ra + py)
      }
    }
    if flip {
      Some({ nx: -nx, ny: -ny, depth })
    } else {
      Some({ nx, ny, depth })
    }
  }
}

///|
fn box_box(
  a : Entity,
  w1 : Int,
  h1 : Int,
  b : Entity,
  w2 : Int,
  h2 : Int,
) -> Contact? {
  let dx = b.px - a.px
  let dy = b.py - a.py
  let ox = (w1 + w2).to_double() / 2.0 - dabs(dx)
  let oy = (h1 + h2).to_double() / 2.0 - dabs(dy)
  if ox <= 0.0 || oy <= 0.0 {
    None
  } else if ox < oy - 0.5 {
    // 法线从 a 指向 b。轴歧义守卫：只有横向明显更浅（差 > 0.5px）才走 x 轴，
    // ox≈oy 时一律偏向 y 轴（堆叠方向），避免逐帧翻轴的法线抖动极限环。
    Some({ nx: if dx < 0.0 { -1.0 } else { 1.0 }, ny: 0.0, depth: ox })
  } else {
    // dy = b.py - a.py；若 dy<0（b 在 a 上方）法线应指向上方 = -1（y 轴向下为正）
    Some({ nx: 0.0, ny: if dy < 0.0 { -1.0 } else { 1.0 }, depth: oy })
  }
}

// ---------- 冲量响应 + 分离 ----------

///|
pub fn resolve(a : Entity, b : Entity, ct : Contact) -> Unit {
  let im1 = Entity::inv_mass(a)
  let im2 = Entity::inv_mass(b)
  let im_sum = im1 + im2
  if im_sum <= 0.0 {
    return
  }
  let vrx = b.vx - a.vx
  let vry = b.vy - a.vy
  let vn = vrx * ct.nx + vry * ct.ny
  // 分离修正（80% 每步，slop 容差）。
  // 限幅：深穿透（圆嵌盒内 depth≈20px）时 80% 一步等于瞬移，会把接触对
  // 弹射出去再落回形成极限环（L11 堆顶振荡根因）——每步最多推 2px，
  // 多步渐进分离，位置修正不注入动能。
  let corr = ((ct.depth - SLOP).max(0.0) * 0.8).min(2.0) / im_sum
  a.px -= ct.nx * corr * im1
  a.py -= ct.ny * corr * im1
  b.px += ct.nx * corr * im2
  b.py += ct.ny * corr * im2
  if vn >= 0.0 {
    return
  }
  // 冲量
  // 弹性只在冲击速度足够大时生效：慢接触（堆叠体每帧被重力加的 ~5px/s）
  // 若带 restitution 会被弹回小的分离速度，法向速度永不清零，导致堆叠体
  // 永不休眠（sleep 阈值 sp<4 永不满足，第 3 关起 spawn_bird 不触发）。
  let e = if -vn < 50.0 {
    0.0
  } else {
    mat_restitution(a.mat).min(mat_restitution(b.mat))
  }
  let jn = -vn / im_sum
  let j = (1.0 + e) * jn
  a.vx -= j * ct.nx * im1
  a.vy -= j * ct.ny * im1
  b.vx += j * ct.nx * im2
  b.vy += j * ct.ny * im2
  // 切向摩擦：堆叠静置接触若无摩擦，横向弹出的滑移无阻尼，
  // 塔体持续蠕动/振荡不收敛。库仑钳制 |jt| <= mu * |jn|。
  let tx = -ct.ny
  let ty = ct.nx
  let vt = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty
  if dabs(vt) > 1.0e-6 {
    let mu = 0.45
    let mut jt = -vt / im_sum
    let max_f = mu * jn
    if jt > max_f {
      jt = max_f
    } else if jt < -max_f {
      jt = -max_f
    }
    a.vx -= jt * tx * im1
    a.vy -= jt * ty * im1
    b.vx += jt * tx * im2
    b.vy += jt * ty * im2
  }
  // 高速碰撞唤醒休眠体
  if -vn > 50.0 {
    Entity::wake(a)
    Entity::wake(b)
  }
}

// ---------- 伤害 ----------

///|
pub(all) struct DamageEvent {
  target : Entity
  amount : Double
}

///|
pub fn impact_damage(a : Entity, b : Entity, ct : Contact) -> DamageEvent? {
  let im1 = Entity::inv_mass(a)
  let im2 = Entity::inv_mass(b)
  if im1 + im2 <= 0.0 {
    return None
  }
  // 冲击强度 = 法线相对速度 * sqrt(较小质量)，直接与阈值比较
  let vrx = b.vx - a.vx
  let vry = b.vy - a.vy
  let vn = -(vrx * ct.nx + vry * ct.ny)
  if vn <= 0.0 {
    return None
  }
  let m = Entity::mass(a).min(Entity::mass(b))
  let impact = vn * m.sqrt()
  // 防堆叠自碎：非鸭子参与的碰撞要求相对法向速度足够大（静置接触不算撞击）
  // 防自碎铁律：只有鸭子参与的碰撞才结算撞击伤害。
  // 摆件落位自由落体 vn = √(2·g·h)，impact = vn·√m 轻易越过阈值——
  // 任何"速度守卫"都拦不住；碎裂得分只应由鸭撞/TNT 殉爆触发。
  if !(a.kind is BirdK) && !(b.kind is BirdK) {
    return None
  }
  let apply : (Entity) -> DamageEvent? = fn(t : Entity) -> DamageEvent? {
    let mut th = mat_threshold(t.mat)
    // 鸭子直接命中：阈值再减半 + 伤害 1.5 倍 → 撞上即碎
    if !(t.kind is BirdK) && (a.kind is BirdK || b.kind is BirdK) {
      th = th * 0.5
    }
    if impact > th {
      let mut dmg = (impact - th) * 1.5
      match (t.kind, a.kind, b.kind) {
        (PigK, BirdK, _) | (PigK, _, BirdK) => dmg = dmg * 2.0
        _ => ()
      }
      Some({ target: t, amount: dmg })
    } else {
      None
    }
  }
  // 两侧都可能受伤（Ground 不受伤）
  if a.mat is Ground {
    if b.mat is Ground {
      None
    } else {
      apply(b)
    }
  } else {
    match apply(a) {
      Some(ev) => Some(ev)
      None => if b.mat is Ground { None } else { apply(b) }
    }
  }
}

// ---------- 爆炸（M2：TNT / 黑鸟） ----------

///|
pub(all) struct BlastEvent {
  target : Entity
  amount : Double
}

///|
/// 径向爆炸：对半径内非静态体施加衰减冲量（1 - d/r），并对可受伤体扣血。
/// 返回受击事件（Ground 不受冲量也不受伤）。
pub fn World::explode(
  self : World,
  ex : Double,
  ey : Double,
  radius : Double,
  power : Double,
  damage : Double,
) -> Array[BlastEvent] {
  let hits : Array[BlastEvent] = []
  for e in self.entities {
    match e.shape {
      Static => continue
      _ => ()
    }
    let dx = e.px - ex
    let dy = e.py - ey
    let d = (dx * dx + dy * dy).sqrt()
    if d >= radius {
      continue
    }
    let falloff = 1.0 - d / radius
    // 冲量方向：由爆心向外；爆心正上方给主要向上推力
    let nx = if d < 1.0e-6 { 0.0 } else { dx / d }
    let ny = if d < 1.0e-6 { -1.0 } else { dy / d }
    Entity::wake(e)
    let im = Entity::inv_mass(e)
    if im > 0.0 {
      let dv = power * falloff * im
      e.vx += nx * dv
      e.vy += ny * dv
    }
    if !(e.mat is Ground) && !(e.dead) {
      hits.push({ target: e, amount: damage * falloff })
    }
  }
  hits
}

///|
let rng_state : Ref[UInt] = Ref(0x9E3779B9U)

///|
/// xorshift32 伪随机数 [0,1)
pub fn rand01() -> Double {
  let mut x = rng_state.val
  x = x ^ (x << 13)
  x = x ^ (x >> 17)
  x = x ^ (x << 5)
  rng_state.val = x
  x.to_double() / 4294967296.0
}

///|
/// [lo, hi) 区间伪随机数
pub fn rand_range(lo : Double, hi : Double) -> Double {
  lo + rand01() * (hi - lo)
}

///|
pub const TNT_RADIUS : Double = 55.0

///|
pub const TNT_POWER : Double = 260.0

///|
pub const TNT_DAMAGE : Double = 180.0

///|
/// 黑鸟自爆威力（半径略小，伤害略低）
pub const BOMB_RADIUS : Double = 48.0

///|
pub const BOMB_POWER : Double = 230.0

///|
pub const BOMB_DAMAGE : Double = 150.0

// ---------- 固定步长时钟（accumulator） ----------

///|
pub(all) struct Clock {
  mut acc : Double // 累加器
  mut steps : Int // 本帧实际执行步数
  max_steps : Int // 单帧最大追步数（防死亡螺旋）
}

///|
pub fn Clock::new(
  _dt~ : Double = DT, // 预留：可调步长（当前固定 DT）
  max_steps~ : Int = 3,
) -> Clock {
  { acc: 0.0, steps: 0, max_steps }
}

///|
/// 帧间隔计入累加器，落后时最多追 max_steps 步；积压过多则丢弃防螺旋。
/// 返回本帧执行的步数。
pub fn Clock::tick(self : Clock, frame_dt : Double, step : () -> Unit) -> Int {
  self.acc += frame_dt
  let mut n = 0
  while self.acc >= DT && n < self.max_steps {
    step()
    self.acc -= DT
    n += 1
  }
  if self.acc > DT * self.max_steps.to_double() {
    self.acc = 0.0
  }
  self.steps = n
  n
}

// ---------- 世界 ----------

///|
pub(all) struct World {
  entities : Array[Entity]
  mut grace : Double // 落位保护倒计时（秒）：期间双方休眠的碰撞不结算伤害，
  // 避免关卡初始摆放间隙的自由落体被误判为攻击（重开瞬间连锁爆碎 bug）
}

///|
pub fn World::new() -> World {
  { entities: [], grace: 1.5 }
}

///|
/// 加载/重开关卡后调用，重置落位保护窗口
pub fn World::start_grace(self : World) -> Unit {
  self.grace = 1.5
}

///|
pub fn World::add(self : World, e : Entity) -> Unit {
  self.entities.push(e)
}

///|
pub fn World::step(self : World, dt : Double) -> Array[DamageEvent] {
  // 落位保护倒计时
  if self.grace > 0.0 {
    self.grace -= dt
  }
  let grace_on = self.grace > 0.0
  // 积分
  for e in self.entities {
    Entity::integrate(e, dt)
  }
  // 碰撞解算 2 遍迭代（塔式堆叠稳定性）
  let damages : Array[DamageEvent] = []
  for iter in 0..<2 {
    let n = self.entities.length()
    for i in 0..<n {
      for j in (i + 1)..<n {
        let a = self.entities[i]
        let b = self.entities[j]
        // 落位保护期：不结算任何伤害（摆件落位自撞不送分），只做物理推挤；
        // 鸭子（唤醒态）不受此限制
        if grace_on && a.asleep && b.asleep {
          continue
        }
        // 宽相：外接圆粗判
        let dx = b.px - a.px
        let dy = b.py - a.py
        let rr = Entity::radius(a) + Entity::radius(b)
        if dx * dx + dy * dy < rr * rr {
          match collide(a, b) {
            Some(ct) => {
              // 伤害：只跳过“双方休眠”的接触（落位自撞不送分）。
              // 飞行的鸭是醒着的，不受落位保护影响——否则高速撞击发生在
              // grace 期内会被整段吞掉伤害，手感变成“推格子”而非“撞碎”。
              if !(a.asleep && b.asleep) {
                match impact_damage(a, b, ct) {
                  Some(ev) => {
                    if iter == 0 {
                      damages.push(ev)
                    }
                  }
                  None => ()
                }
              }
              resolve(a, b, ct)
            }
            None => ()
          }
        }
      }
    }
  }
  for ev in damages {
    let t = ev.target
    if t.hp > 0.0 {
      t.hp -= ev.amount
    }
  }
  damages
}
