// 怒鸭大战
// 复现 bug：第 3 关起弹弓上的鸭子不再刷新

///|
fn settle_probe(g : Game, max_steps : Int) -> Bool {
  // 模拟：把当前鸭标记 dead（等价于射出后死亡结算），然后步进直到重新装填
  for _ in 0..<max_steps {
    g.fixed_update()
  }
  g.phase is Aiming
}

///|
test "probe_all_levels_reload" {
  for lv in 1..<13 {
    let g = Game::new()
    g.load_level_n(lv)
    // 当前在 Aiming，有鸟在弹弓上；模拟发射后死亡结算 → 应重新装填

    // 直接让鸟死亡触发 Settling（等价低速坠地退场）
    match g.bird {
      Some(b) => {
        b.dead = true
        g.world.entities.retain(fn(e) { !(e.kind is @core.BirdK) })
        g.bird = None
        g.phase = Settling
      }
      None => assert_false(true)
    }
    let ok = settle_probe(g, 60 * 30) // 最多 30 秒模拟
    if !ok {
      // 找出未休眠实体，输出诊断
      for e in g.world.entities {
        if !(e.kind is @core.GroundK) && !e.asleep {
          let k = if e.kind is @core.BirdK { "bird" } else if e.kind is @core.PigK { "pig" } else if e.kind is @core.BlockK { "block" } else if e.kind is @core.TntK { "tnt" } else { "ground" }
          let sh = match e.shape { @core.Circle(r) => "circle(\{r})" ; @core.Box(w, h) => "box(\{w},\{h})" ; @core.Static => "static" }
          println("level \{lv} stuck: k=\{k} shape=\{sh} px=\{e.px} py=\{e.py} vx=\{e.vx} vy=\{e.vy} sleep_t=\{e.sleep_t}")
        }
      }
    }
    assert_true(ok)
  }
}
