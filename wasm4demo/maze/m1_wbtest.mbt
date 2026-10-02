// 怒鸭大战
// 直接驱动 Game 状态机，物理/伤害/得分/音效全部走真实代码路径

///|
test "m1_launch_hits_and_kills_pig" {
  let g = Game::new()
  // 初始：猪活着、无得分、处于瞄准态
  let pig = g.world.entities[7]
  assert_true(pig.kind is @core.PigK && !pig.dead)
  assert_true(g.phase is Aiming)
  assert_eq(g.score, 0)
  // 满拉弹弓：拖到锚点左下 24px → 发射方向指向右上（塔与猪所在处）
  g.drag_x = ANCHOR_X - DRAG_R
  g.drag_y = ANCHOR_Y + DRAG_R
  g.launch()
  assert_true(g.phase is Flying)
  // 鸟已获得初速：指向右上（y 向下坐标系，vy<0）
  guard g.bird is Some(b) else { abort("no bird") }
  assert_true(b.vx > 0.0)
  assert_true(b.vy < 0.0)
  // 真跑 10 秒游戏循环（60fps × 600 帧，含 accumulator/镜头/粒子）
  for _ in 0..<600 {
    g.update()
  }
  // 验收：猪死亡 + 得分 >= 500
  assert_true(pig.dead)
  assert_true(g.score >= 500)
}
