// 怒鸭大战

///|
test "save_roundtrip" {
  let d : SaveData = { unlocked: 3, best: 12345, stars: FixedArray::make(3, 0) }
  d.stars[0] = 3
  d.stars[1] = 2
  let b = d.encode()
  assert_eq(b.length(), SAVE_SIZE)
  assert_eq(b[0].to_int(), SAVE_MAGIC)
  assert_eq(b[1].to_int(), SAVE_VERSION)
  guard SaveData::decode(b, SAVE_SIZE) is Some(d2) else { abort("decode") }
  assert_eq(d2.unlocked, 3)
  assert_eq(d2.best, 12345)
  assert_eq(d2.stars[0], 3)
  assert_eq(d2.stars[1], 2)
  assert_eq(d2.stars[2], 0)
  // 第 12 字节（索引 11）保留位必须为 0
  assert_eq(b[11].to_int(), 0)
}

///|
test "save_v1_compat" {
  // v1 布局（8 字节）升级：magic+版本 1+解锁+分数，星级默认全 0
  let b : FixedArray[Byte] = FixedArray::make(8, b'\x00')
  b[0] = b'\x57'
  b[1] = b'\x01'
  b[2] = b'\x02'
  b[3] = b'\x38' // 12345 = 0x3039 → 0x39,0x30,0,0
  b[4] = b'\x30'
  guard SaveData::decode(b, 8) is Some(d) else { abort("decode") }
  assert_eq(d.unlocked, 2)
  assert_eq(d.best, 12345)
  for i in 0..<3 {
    assert_eq(d.stars[i], 0)
  }
}

///|
test "save_corrupt_returns_default" {
  // 数据不足
  let b : FixedArray[Byte] = FixedArray::make(4, b'\x01')
  assert_true(SaveData::decode(b, 4) is None)
  // magic 错
  let b2 = SaveData::default().encode()
  b2[0] = b'\x00'
  assert_true(SaveData::decode(b2, SAVE_SIZE) is None)
  // 版本错
  let b3 = SaveData::default().encode()
  b3[1] = b'\x63'
  assert_true(SaveData::decode(b3, SAVE_SIZE) is None)
  // 合法但越界值 → 钳位
  let b4 = SaveData::default().encode()
  b4[2] = b'\x07'
  guard SaveData::decode(b4, SAVE_SIZE) is Some(d) else { abort("decode") }
  assert_eq(d.unlocked, 3)
  // 零值 → 钳位到 1
  b4[2] = b'\x00'
  guard SaveData::decode(b4, SAVE_SIZE) is Some(d2) else { abort("decode") }
  assert_eq(d2.unlocked, 1)
}

///|
test "clamp_and_range" {
  // unlocked 钳位 1..3
  let d : SaveData = { unlocked: 9, best: -5, stars: FixedArray::make(3, 0) }
  let b = d.encode()
  assert_eq(b[2].to_int(), 3)
  // best 为负时 encode 侧已钳位为 0
  guard SaveData::decode(b, SAVE_SIZE) is Some(d2) else { abort("decode") }
  assert_eq(d2.best, 0)
  // 星级越界钳位 0..3
  d.stars[0] = 7
  let b2 = d.encode()
  assert_eq(b2[8].to_int(), 3)
}

///|
test "stars_awarded_on_commit" {
  let app = App::new()
  app.game.level = 1
  app.game.score = 2500
  app.commit_score()
  assert_eq(app.save.stars[0], 3)
  // 低分仅 1 星，不覆盖历史 3 星
  app.game.score = 800
  app.commit_score()
  assert_eq(app.save.stars[0], 3)
  let app2 = App::new()
  app2.game.level = 2
  app2.game.score = 1300
  app2.commit_score()
  assert_eq(app2.save.stars[1], 2)
}

///|
test "unlock_and_commit" {
  let app = App::new()
  // 初始只解锁第 1 关（无磁盘环境下 disk_read 失败 → 默认存档）
  assert_eq(app.save.unlocked, 1)
  // 模拟过关：score 提交后解锁下一关
  app.game.level = 1
  app.game.score = 700
  app.commit_score()
  assert_eq(app.save.unlocked, 2)
  assert_eq(app.save.best, 700)
  // 再次提交（不重复解锁）
  app.game.score = 600
  app.commit_score()
  assert_eq(app.save.unlocked, 2)
  assert_eq(app.save.best, 700)
  // 通关第 3 关不越界
  app.game.level = 3
  app.game.score = 2000
  app.commit_score()
  assert_eq(app.save.unlocked, 3)
  assert_eq(app.save.best, 2000)
}

///|
test "start_level_resets" {
  let app = App::new()
  app.start_level(2)
  assert_true(app.state is Playing)
  assert_eq(app.game.level, 2)
  assert_true(app.game.phase is Aiming)
}
