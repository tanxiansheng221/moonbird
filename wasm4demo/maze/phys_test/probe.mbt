// 怒鸭大战

///|
fn mk_ent(
  x : Double,
  y : Double,
  vy0 : Double,
  kind : @core.Kind,
  shape : @core.Shape,
  mat : @core.Material,
) -> @core.Entity {
  {
    px: x,
    py: y,
    vx: 0.0,
    vy: vy0,
    kind,
    shape,
    mat,
    hp: @core.mat_hp(mat),
    asleep: false,
    sleep_t: 0.0,
    dead: false,
  }
}

///|
test "probe_normals" {
  let gr = mk_ent(0.0, 10.0, 0.0, @core.GroundK, @core.Static, @core.Ground)
  let ball = mk_ent(0.0, 1.0, 100.0, @core.BlockK, @core.Circle(5.0), @core.Wood)
  match @core.collide(gr, ball) {
    Some(ct) => println("gr-ball nx=\{ct.nx} ny=\{ct.ny} depth=\{ct.depth}")
    None => println("gr-ball: None")
  }
  match @core.collide(ball, gr) {
    Some(ct) => println("ball-gr nx=\{ct.nx} ny=\{ct.ny} depth=\{ct.depth}")
    None => println("ball-gr: None")
  }
  let b2 = mk_ent(0.0, 1.0, 100.0, @core.BlockK, @core.Circle(5.0), @core.Wood)
  match @core.collide(gr, b2) {
    Some(ct) => {
      @core.resolve(gr, b2, ct)
      println("after resolve vy=\{b2.vy} groundvy=\{gr.vy}")
    }
    None => println("resolve: None")
  }
  let w = @core.World::new()
  w.add(mk_ent(50.0, 155.0, 0.0, @core.GroundK, @core.Static, @core.Ground))
  for k in 0..<3 {
    w.add(
      mk_ent(50.0, 147.0 - k.to_double() * 6.0, 0.0, @core.BlockK, @core.Box(20, 6), @core.Wood),
    )
  }
  for _ in 0..<180 {
    let _ = w.step(@core.DT)
  }
  let sb = StringBuilder()
  for e in w.entities {
    sb.write_string("py=\{e.py} vy=\{e.vy} asleep=\{e.asleep}; ")
  }
  println(sb.to_string())
  assert_true(true)
}
