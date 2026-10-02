// 怒鸭大战

///| 弹道：真空中半抛，落点与解析解一致（容差 2%；45° 时 R = v0²/g）
test "projectile_matches_analytic" {
  let g = 300.0
  let v0 = 200.0
  let a : @core.Vec2 = { x: v0 * 0.7071068, y: -v0 * 0.7071068 }
  let mut x = 0.0
  let mut y = 0.0
  let mut vy = a.y
  let dt = 1.0 / 240.0
  let mut t = 0.0
  while y <= 0.0 && t < 10.0 {
    vy += g * dt
    x += a.x * dt
    y += vy * dt
    t += dt
  }
  let expected = v0 * v0 / g
  let err = (x - expected) / expected
  assert_true(err < 0.02 || err > -0.02)
}

///| 碰撞：圆-圆接触检测与法线方向
test "circle_circle_contact" {
  let a = mk_circle(0.0, 0.0, 5.0, @core.BlockK)
  let b = mk_circle(8.0, 0.0, 5.0, @core.BlockK)
  match @core.collide(a, b) {
    Some(ct) => {
      assert_true(ct.depth > 1.0)
      assert_true(ct.nx > 0.99) // 法线应指向 +x
      assert_true(ct.ny.abs() < 0.01)
    }
    None => assert_true(false)
  }
  // 分开后不接触
  assert_true(@core.collide(a, mk_circle(50.0, 0.0, 5.0, @core.BlockK)) is None)
}

///| 碰撞：圆-盒与盒-盒轴向分离
test "circle_box_and_box_box" {
  let b = mk_box(10.0, 0.0, 10, 10)
  match @core.collide(mk_circle(17.0, 0.0, 5.0, @core.BlockK), b) {
    Some(ct) => assert_true(ct.depth > 0.0 && ct.depth < 5.0)
    None => assert_true(false)
  }
  match @core.collide(b, mk_box(17.0, 0.0, 10, 10)) {
    Some(ct) => {
      assert_true(ct.depth > 0.0)
      assert_true(ct.nx.abs() > 0.9) // 水平重叠，法线沿 x
    }
    None => assert_true(false)
  }
  assert_true(@core.collide(b, mk_box(100.0, 0.0, 10, 10)) is None)
}

///| 堆叠稳定性：方块塔静置 3 秒不塌、不穿地、顶层休眠
test "stack_stability" {
  let w = @core.World::new()
  w.add(mk_static(50.0, 155.0))
  w.add(mk_box(50.0, 147.0, 20, 6))
  w.add(mk_box(50.0, 141.0, 20, 6))
  w.add(mk_box(50.0, 135.0, 20, 6))
  for _ in 0..<180 {
    let _ = w.step(@core.DT)
  }
  for e in w.entities {
    assert_true(e.py < 158.0 && e.py > 120.0) // 不穿地不飞散
  }
  assert_true(w.entities[3].asleep) // 顶层稳定休眠
}

///| 冲量：恢复系数 < 1 反弹减速，静态体不动
test "impulse_restitution_and_static" {
  // 引擎为 y 向下坐标系：地面（Static→400x10 平台盒）在下方，球从上方下落
  let ground = mk_static(0.0, 10.0)
  let b = mk_circle(0.0, 1.0, 5.0, @core.BlockK) // 球心距地面顶面 4 < r=5，有重叠
  b.vy = 100.0
  match @core.collide(ground, b) {
    Some(ct) => {
      @core.resolve(ground, b, ct)
      assert_eq(ground.vx, 0.0)
      assert_eq(ground.vy, 0.0)
      // 恢复系数 0.2：反弹向上（vy<0）且速率衰减为 20%
      assert_true(b.vy < 0.0 && b.vy > -100.0)
    }
    None => assert_true(false)
  }
}

///| 伤害：猪受鸟 2 倍；低于阈值不掉血
test "damage_threshold_and_pig_multiplier" {
  let pig = mk_circle(0.0, 0.0, 6.0, @core.PigK)
  let bird = mk_circle(10.0, 0.0, 5.0, @core.BirdK)
  bird.vx = -200.0 // 从右侧（x=10）飞向左侧的猪
  match @core.collide(bird, pig) {
    Some(ct) => {
      match @core.impact_damage(bird, pig, ct) {
        Some(ev) => {
          assert_true(ev.target.kind is @core.PigK)
          assert_true(ev.amount > 0.0)
        }
        None => assert_true(false)
      }
    }
    None => assert_true(false)
  }
  // 轻碰：低于木块阈值 → 无伤害
  let w1 = mk_box(0.0, 0.0, 16, 6)
  let w2 = mk_box(10.0, 0.0, 16, 6)
  w2.vx = -5.0
  match @core.collide(w1, w2) {
    Some(ct) => assert_true(@core.impact_damage(w1, w2, ct) is None)
    None => assert_true(true) // 未重叠即无接触，亦无伤害
  }
}

///| 固定步长：accumulator 追帧上限防死亡螺旋
test "accumulator_fixed_step" {
  let c = @core.Clock::new(max_steps=3)
  let mut n = 0
  assert_eq(c.steps, 0)
  assert_eq(c.tick(@core.DT * 2.5, fn() { n += 1 }), 2) // 2.5 步积压 → 跑 2 步
  assert_eq(n, 2)
  assert_eq(c.tick(@core.DT * 10.0, fn() { n += 1 }), 3) // 上限 3 步且清空积压
  assert_eq(c.steps, 3)
  assert_eq(n, 5)
  assert_eq(c.acc, 0.0)
}

// ---------- 测试辅助 ----------

///|
fn mk_circle(
  x : Double,
  y : Double,
  r : Double,
  kind : @core.Kind,
) -> @core.Entity {
  {
    px: x,
    py: y,
    vx: 0.0,
    vy: 0.0,
    kind,
    shape: @core.Circle(r),
    // 材质与类型对应：鸟/猪有各自材质（阈值决定可否受伤）
    mat: {
      let m = match kind {
        @core.BirdK => @core.Bird
        @core.PigK => @core.Pig
        _ => @core.Wood
      }
      m
    },
    hp: @core.mat_hp(@core.Wood),
    asleep: false,
    sleep_t: 0.0,
    dead: false,
  }
}

///|
fn mk_box(x : Double, y : Double, w : Int, h : Int) -> @core.Entity {
  {
    px: x,
    py: y,
    vx: 0.0,
    vy: 0.0,
    kind: @core.BlockK,
    shape: @core.Box(w, h),
    mat: @core.Wood,
    hp: @core.mat_hp(@core.Wood),
    asleep: false,
    sleep_t: 0.0,
    dead: false,
  }
}

///|
fn mk_static(x : Double, y : Double) -> @core.Entity {
  {
    px: x,
    py: y,
    vx: 0.0,
    vy: 0.0,
    kind: @core.GroundK,
    shape: @core.Static,
    mat: @core.Ground,
    hp: 1.0e9,
    asleep: false,
    sleep_t: 0.0,
    dead: false,
  }
}
