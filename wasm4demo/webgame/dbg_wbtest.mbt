// 怒鸭大战
fn dbg_make(
  kind : @core.Kind,
  shape : @core.Shape,
  px : Double,
  py : Double,
  hp : Double
) -> @core.Entity {
  {
    px,
    py,
    vx: 0.0,
    vy: 0.0,
    kind,
    shape,
    mat: @core.Wood,
    hp,
    asleep: false,
    sleep_t: 0.0,
    dead: false,
  }
}

///|
test "dbg_stack" {
  let w = @core.World::new()
  // 静态地面
  w.add(dbg_make(@core.GroundK, @core.Box(2000, 60), 400.0, 460.0, 9999.0))
  // 单块先落定
  let lower = dbg_make(@core.BlockK, @core.Box(48, 18), 400.0, 380.0, 10.0)
  w.add(lower)
  for _ in 0..<120 {
    let _ = w.step(1.0 / 60.0)
  }
  println("lower settled: asleep=\{lower.asleep} py=\{lower.py} vy=\{lower.vy}")
  // 在其上方叠一块（相隔 1px）
  let upper = dbg_make(@core.BlockK, @core.Box(48, 18), 400.0, lower.py - 19.0, 10.0)
  w.add(upper)
  for i in 0..<300 {
    let _ = w.step(1.0 / 60.0)
    if i % 40 == 0 {
      println("t=\{i} upper asleep=\{upper.asleep} py=\{upper.py} vy=\{upper.vy} lower vy=\{lower.vy}")
    }
  }
  println("final: upper asleep=\{upper.asleep} py=\{upper.py} vy=\{upper.vy} lower asleep=\{lower.asleep}")
  assert_true(upper.asleep)
}
