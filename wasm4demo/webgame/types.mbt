// 怒鸭大战
// 版权说明：原创玩法命名（怒鸭/狐狸/金牌/鸭爆），不使用任何第三方商标角色。

///|
pub(all) enum Phase {
  Aiming
  Flying
  Settling
}

///|
pub(all) enum BirdType {
  Red
  Yellow
  Blue
  Black
}

///|
pub(all) struct Particle {
  mut x : Double
  mut y : Double
  mut vx : Double
  mut vy : Double
  mut life : Double
  mut col : Int // JS 端调色板索引 1..4
}

///|
pub(all) struct Game {
  mut world : @core.World
  mut bird : @core.Entity?
  mut phase : Phase
  mut level : Int
  mut won : Bool // 已通全部关卡
  mut drag_x : Double
  mut drag_y : Double
  mut dragging : Bool
  mut skip_req : Bool // JS 薄壳请求跳过本回合
  mut score : Int
  mut bird_type : BirdType // 本回合鸭的技能类型
  mut skill_used : Bool // 技能每回合一次
  mut particles : Array[Particle]
  mut cam_x : Double
  mut rng_state : UInt
  // 撞击手感：鸭低速爬行计时（秒）——撞碎后低速推挤直接退场，杜绝"推着走"
  mut crawl_t : Double
  // 撞击手感：鸭高速触体即自爆（爆风炸碎周围）
  mut bird_blasted : Bool
  // 事件队列（JS 薄壳一次性消费）：shot=弹射, blast=自爆, clear=过关, boom=碎块数
  mut ev_shot : Bool
  mut ev_blast : Bool
  mut ev_clear : Bool
  mut ev_boom : Int
  mut ev_impact : Int
  mut ev_score : Int
  // 画面震动强度 0..1
  mut shake : Double
  // Settling 阶段计时：堆叠接触的数值抖动可能让个别块长期不休眠，
  // 超过 SETTLE_TIMEOUT 秒后强制全场休眠并装填下一只鸭（防卡关兜底）
  mut settle_t : Double

  clock : @core.Clock
}

///|
pub const ANCHOR_X : Double = 180.0

///|
pub const ANCHOR_Y : Double = 390.0

///|
pub const DRAG_R : Double = 96.0

///|
/// Settling 超时兜底（秒）：超时后强制全场休眠并装填下一只鸭
pub const SETTLE_TIMEOUT : Double = 2.5

///|
pub const LAUNCH_K : Double = 26.0

///|
pub const LAUNCH_VMAX : Double = 900.0

///|
pub const NUM_LEVELS : Int = 12

///|
pub const GROUND_Y : Double = 465.0 // 地面世界 Y（屏幕世界坐标，Y 向下）

///|
pub const WORLD_W : Double = 1200.0 // 世界宽（镜头范围 0..WORLD_W-1280 若负则 0）

///|
pub fn bird_type_for_level(lv : Int) -> BirdType {
  match lv {
    4 => Yellow
    5 => Black
    6 => Blue
    8 => Blue
    9 => Yellow
    10 => Black
    12 => Black
    _ => Red
  }
}
