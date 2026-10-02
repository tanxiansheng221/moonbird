// 怒鸭大战

///|
fn mk_ent2(
  x : Double,
  y : Double,
  kind : @core.Kind,
  shape : @core.Shape,
  mat : @core.Material,
) -> @core.Entity {
  {
    px: x,
    py: y,
    vx: 0.0,
    vy: 0.0,
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
test "probe_two" {
  // 复现 impulse_restitution_and_static
  let ground = mk_ent2(0.0, 10.0, @core.GroundK, @core.Static, @core.Ground)
  let b = mk_ent2(0.0, 0.0, @core.BlockK, @core.Circle(5.0), @core.Wood)
  b.vy = -100.0
  match @core.collide(ground, b) {
    Some(ct) => {
      println("g-b ny=\{ct.ny} depth=\{ct.depth}")
      @core.resolve(ground, b, ct)
      println("b.vy=\{b.vy} g.vy=\{ground.vy}")
    }
    None => println("g-b None")
  }
  // 复现 damage test
  let pig = mk_ent2(0.0, 0.0, @core.PigK, @core.Circle(6.0), @core.Pig)
  let bird = mk_ent2(10.0, 0.0, @core.BirdK, @core.Circle(5.0), @core.Bird)
  bird.vx = -200.0
  match @core.collide(bird, pig) {
    Some(ct) => {
      println("b-p nx=\{ct.nx} ny=\{ct.ny}")
      match @core.impact_damage(bird, pig, ct) {
        Some(ev) => println("dmg target=\{ev.target.px},\{ev.target.py} amount=\{ev.amount}")
        None => println("dmg None")
      }
    }
    None => println("b-p None")
  }
  assert_true(true)
}
