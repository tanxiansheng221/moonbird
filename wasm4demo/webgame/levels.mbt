// 怒鸭大战

///|
fn Game::add_ground(self : Game) -> Unit {
  self.world.add(
    {
      px: 600.0, py: GROUND_Y + 5.0, vx: 0.0, vy: 0.0,
      kind: @core.GroundK, shape: @core.Static, mat: @core.Ground,
      hp: 1.0e9, asleep: false, sleep_t: 0.0, dead: false,
    },
  )
}

///|
fn Game::add_box(
  self : Game,
  px : Double,
  py : Double,
  w : Int,
  h : Int,
  mat : @core.Material,
) -> Unit {
  // 关卡整体后移：结构与狐狸远离弹弓，增加弹道空间
  self.world.add(
    {
      px: px + LEVEL_X_OFF, py, vx: 0.0, vy: 0.0,
      kind: @core.BlockK, shape: @core.Box(w, h), mat,
      hp: @core.mat_hp(mat), asleep: false, sleep_t: 0.0, dead: false,
    },
  )
}

///|
fn Game::add_tnt(self : Game, px : Double, py : Double) -> Unit {
  self.world.add(
    {
      px: px + LEVEL_X_OFF, py, vx: 0.0, vy: 0.0,
      kind: @core.TntK, shape: @core.Box(30, 30), mat: @core.Tnt,
      hp: @core.mat_hp(@core.Tnt), asleep: false, sleep_t: 0.0, dead: false,
    },
  )
}

///|
fn Game::add_pig(self : Game, px : Double, py : Double) -> Unit {
  self.world.add(
    {
      px: px + LEVEL_X_OFF, py, vx: 0.0, vy: 0.0,
      kind: @core.PigK, shape: @core.Circle(18.0), mat: @core.Pig,
      hp: @core.mat_hp(@core.Pig), asleep: false, sleep_t: 0.0, dead: false,
    },
  )
}

///|
// 关卡布局统一 X 偏移（WORLD_W=1260 内：最远实体 830+120=950 < 1260 安全）
pub const LEVEL_X_OFF : Double = 120.0

///|
fn Game::load_level(self : Game) -> Unit {
  self.add_ground()
  match self.level {
    1 => self.load_level1()
    2 => self.load_level2()
    3 => self.load_level3()
    4 => self.load_level4()
    5 => self.load_level5()
    6 => self.load_level6()
    7 => self.load_level7()
    8 => self.load_level8()
    9 => self.load_level9()
    10 => self.load_level10()
    11 => self.load_level11()
    12 => self.load_level12()
    _ => self.load_level1()
  }
}

///|
/// 关 1：木塔 + 冰砖 + 鸭爆（TNT）
fn Game::load_level1(self : Game) -> Unit {
  self.add_box(450.0, 435.0, 24, 60, @core.Stone)
  self.add_box(390.0, 435.0, 24, 60, @core.Ice)
  self.add_tnt(504.0, 435.0)
  self.add_box(414.0, 390.0, 48, 18, @core.Wood)
  self.add_box(486.0, 390.0, 48, 18, @core.Wood)
  self.add_box(450.0, 354.0, 48, 18, @core.Wood)
  self.add_pig(424.0, 441.0)
}

///|
/// 关 2：冰堡 — 冰柱承重 + 木板顶 + 鸭爆芯，双狐
fn Game::load_level2(self : Game) -> Unit {
  self.add_box(420.0, 435.0, 24, 60, @core.Ice)
  self.add_box(492.0, 435.0, 24, 60, @core.Ice)
  self.add_tnt(456.0, 435.0)
  self.add_box(456.0, 396.0, 108, 18, @core.Wood)
  self.add_box(432.0, 366.0, 24, 36, @core.Ice)
  self.add_box(480.0, 366.0, 24, 36, @core.Ice)
  self.add_box(456.0, 342.0, 72, 15, @core.Wood)
  self.add_pig(456.0, 441.0)
  self.add_pig(456.0, 315.0)
}

///|
/// 关 3：石塔 — 石柱三层 + 木梁 + 底部鸭爆
fn Game::load_level3(self : Game) -> Unit {
  self.add_box(426.0, 435.0, 24, 60, @core.Stone)
  self.add_tnt(456.0, 444.0)
  self.add_box(486.0, 435.0, 24, 60, @core.Stone)
  self.add_box(456.0, 396.0, 120, 18, @core.Wood)
  self.add_box(432.0, 363.0, 24, 48, @core.Ice)
  self.add_box(480.0, 363.0, 24, 48, @core.Ice)
  self.add_box(456.0, 330.0, 96, 15, @core.Wood)
  self.add_box(438.0, 306.0, 21, 27, @core.Stone)
  self.add_box(474.0, 306.0, 21, 27, @core.Stone)
  self.add_box(456.0, 282.0, 66, 15, @core.Wood)
  self.add_pig(456.0, 255.0)
  self.add_pig(555.0, 441.0)
}

///|
/// 关 4（黄鸭关）：远处高塔，需加速冲刺
fn Game::load_level4(self : Game) -> Unit {
  self.add_box(765.0, 435.0, 24, 60, @core.Wood)
  self.add_box(825.0, 435.0, 24, 60, @core.Wood)
  self.add_box(795.0, 396.0, 96, 18, @core.Wood)
  self.add_box(795.0, 366.0, 24, 42, @core.Ice)
  self.add_tnt(795.0, 441.0)
  self.add_pig(795.0, 326.0)
}

///|
/// 关 5（黑鸭关）：石头堡垒，需爆炸破墙
fn Game::load_level5(self : Game) -> Unit {
  self.add_box(600.0, 435.0, 24, 60, @core.Stone)
  self.add_box(636.0, 435.0, 24, 60, @core.Stone)
  self.add_box(618.0, 396.0, 72, 18, @core.Stone)
  self.add_pig(618.0, 441.0)
  self.add_box(750.0, 435.0, 24, 60, @core.Stone)
  self.add_box(786.0, 435.0, 24, 60, @core.Stone)
  self.add_box(768.0, 396.0, 72, 18, @core.Wood)
  self.add_tnt(710.0, 441.0)
  self.add_pig(768.0, 368.0)
}

///|
/// 关 6（蓝鸭关）：三只分散小狐，需分裂打击
fn Game::load_level6(self : Game) -> Unit {
  self.add_box(540.0, 441.0, 36, 36, @core.Ice)
  self.add_pig(540.0, 404.0)
  self.add_box(645.0, 441.0, 36, 36, @core.Ice)
  self.add_pig(645.0, 404.0)
  self.add_box(750.0, 441.0, 36, 36, @core.Ice)
  self.add_pig(750.0, 404.0)
}

///|
/// 关 7：双层木塔 + 护墙
fn Game::load_level7(self : Game) -> Unit {
  self.add_box(510.0, 435.0, 24, 60, @core.Stone)
  self.add_box(570.0, 435.0, 24, 60, @core.Stone)
  self.add_box(540.0, 390.0, 90, 18, @core.Wood)
  self.add_box(522.0, 360.0, 24, 42, @core.Wood)
  self.add_box(558.0, 360.0, 24, 42, @core.Wood)
  self.add_box(540.0, 330.0, 72, 15, @core.Wood)
  self.add_pig(540.0, 441.0)
  self.add_pig(540.0, 303.0)
}

///|
/// 关 8（蓝鸭关）：高低双堡，分裂上下开打
fn Game::load_level8(self : Game) -> Unit {
  self.add_box(570.0, 435.0, 24, 60, @core.Wood)
  self.add_box(618.0, 435.0, 24, 60, @core.Wood)
  self.add_box(594.0, 390.0, 84, 18, @core.Wood)
  self.add_pig(594.0, 441.0)
  self.add_box(750.0, 375.0, 24, 60, @core.Ice)
  self.add_box(798.0, 375.0, 24, 60, @core.Ice)
  self.add_box(774.0, 327.0, 96, 15, @core.Wood)
  self.add_pig(774.0, 300.0)
  self.add_tnt(690.0, 441.0)
}

///|
/// 关 9（黄鸭关）：铁壁走廊 — 高石墙后藏双狐
fn Game::load_level9(self : Game) -> Unit {
  self.add_box(620.0, 435.0, 24, 60, @core.Stone)
  self.add_box(620.0, 375.0, 24, 60, @core.Stone)
  self.add_box(620.0, 315.0, 24, 60, @core.Stone)
  self.add_box(700.0, 435.0, 48, 60, @core.Wood)
  self.add_box(760.0, 435.0, 24, 60, @core.Ice)
  self.add_tnt(760.0, 375.0)
  self.add_pig(700.0, 375.0)
  self.add_pig(820.0, 441.0)
}

///|
/// 关 10（黑鸭关）：金字塔石堡 — 顶层金鸭爆芯
fn Game::load_level10(self : Game) -> Unit {
  self.add_box(700.0, 435.0, 24, 60, @core.Stone)
  self.add_box(760.0, 435.0, 24, 60, @core.Stone)
  self.add_tnt(730.0, 441.0)
  self.add_box(730.0, 396.0, 108, 18, @core.Wood)
  self.add_box(710.0, 366.0, 24, 42, @core.Stone)
  self.add_box(750.0, 366.0, 24, 42, @core.Stone)
  self.add_box(730.0, 336.0, 90, 15, @core.Wood)
  self.add_pig(730.0, 309.0)
  self.add_pig(830.0, 441.0)
}

///|
/// 关 11（黄鸭关）：冰晶教堂 — 冰柱高塔 + 内藏鸭爆
fn Game::load_level11(self : Game) -> Unit {
  // 稳定三柱支撑结构（严禁悬空生成/独柱支点——会导致整塔左右倾侧跳动并震爆 TNT）：
  // 冰柱顶面 405 → 木板(半高9)中心 396 落座三柱 → 猪底 387/ TNT 底 387 落座木板
  self.add_box(680.0, 435.0, 24, 60, @core.Ice)
  self.add_box(760.0, 435.0, 24, 60, @core.Ice)
  self.add_box(720.0, 435.0, 24, 60, @core.Ice)
  self.add_box(720.0, 396.0, 120, 18, @core.Wood)
  self.add_tnt(720.0, 372.0)
  self.add_pig(676.0, 369.0)
  self.add_pig(764.0, 369.0)
  // 石块骑在双猪头顶（猪顶 351 → 石块半高 12 → 中心 339），左右对称不倾侧
  self.add_box(720.0, 339.0, 96, 24, @core.Stone)
}

///|
/// 关 12（黑鸭关终局）：终极石堡 + 双鸭爆 — 狐狸大王的堡垒
fn Game::load_level12(self : Game) -> Unit {
  self.add_box(700.0, 435.0, 24, 60, @core.Stone)
  self.add_box(756.0, 435.0, 24, 60, @core.Stone)
  self.add_tnt(728.0, 441.0)
  self.add_box(728.0, 396.0, 104, 18, @core.Stone)
  self.add_box(700.0, 366.0, 24, 42, @core.Stone)
  self.add_box(756.0, 366.0, 24, 42, @core.Stone)
  self.add_tnt(728.0, 366.0)
  self.add_box(728.0, 327.0, 96, 18, @core.Stone)
  self.add_pig(728.0, 298.0)
  self.add_pig(728.0, 441.0)
  self.add_pig(830.0, 441.0)
}
