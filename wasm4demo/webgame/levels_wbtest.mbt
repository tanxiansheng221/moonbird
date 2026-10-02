// 怒鸭大战

///|
fn kill_all_pigs(g : Game) -> Unit {
  for e in g.world.entities {
    if e.kind is @core.PigK {
      e.dead = true
    }
  }
}

///|
test "level_clear_advances" {
  let g = Game::new()
  // 第 1 关应装填了猪
  let mut pigs0 = 0
  for i in 0..<g.get_entity_count() {
    let (k, _, _, _, _, _, _) = g.get_entity(i)
    if k == 1 {
      pigs0 = pigs0 + 1
    }
  }
  assert_true(pigs0 > 0)
  assert_eq(g.get_level(), 1)
  kill_all_pigs(g)
  g.check_level_clear()
  assert_eq(g.get_level(), 2)
  assert_true(g.get_score() >= 1000)
  assert_false(g.get_won())
  // 逐关推进到第 12 关
  let mut lv = 2
  while lv < 12 {
    kill_all_pigs(g)
    g.check_level_clear()
    lv = lv + 1
    assert_eq(g.get_level(), lv)
  }
  assert_eq(g.get_level(), 12)
  // 第 12 关清场后应通关且 level 封顶不再递增
  kill_all_pigs(g)
  g.check_level_clear()
  assert_true(g.get_won())
  assert_eq(g.get_level(), 12)
}

///|
test "level12_loads_pigs" {
  let g = Game::new()
  let mut lv = 1
  while lv < 12 {
    kill_all_pigs(g)
    g.check_level_clear()
    lv = lv + 1
  }
  assert_eq(g.get_level(), 12)
  let mut pigs = 0
  for i in 0..<g.get_entity_count() {
    let (k, _, _, _, _, _, _) = g.get_entity(i)
    if k == 1 {
      pigs = pigs + 1
    }
  }
  assert_true(pigs > 0)
}
