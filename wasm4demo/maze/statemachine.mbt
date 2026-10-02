// 怒鸭大战
// + disk 存档（关卡解锁 + 最高分，压缩到 8 字节，magic 校验）

///|
pub(all) enum AppState {
  Title // 标题画面
  LevelSelect // 关卡选择（解锁的关卡可选）
  Playing // 游戏进行中
  Paused // 暂停覆盖层
  GameClear // 通关画面
}

///|
/// 存档布局（12 字节 v2）：[0]=magic 'W' [1]=版本 [2]=已解锁关卡(1..3) [3..7]=最高分 LE u32 [8..11]=各关星级(1..3, 0=未评)
pub const SAVE_SIZE : Int = 12

///|
pub const SAVE_MAGIC : Int = 0x57 // 'W'

///|
pub const SAVE_VERSION : Int = 2

///|
pub(all) struct SaveData {
  mut unlocked : Int // 1..3 已解锁的最大关卡
  mut best : Int // 历史最高分
  stars : FixedArray[Int] // 各关星级 0..3（0=未评）
}

///|
pub fn SaveData::default() -> SaveData {
  { unlocked: 1, best: 0, stars: FixedArray::make(3, 0) }
}

///|
/// 序列化为 8 字节（固定布局，无浮点，可移植）
pub fn SaveData::encode(self : SaveData) -> FixedArray[Byte] {
  let b : FixedArray[Byte] = FixedArray::make(SAVE_SIZE, b'\x00')
  b[0] = SAVE_MAGIC.to_byte()
  b[1] = SAVE_VERSION.to_byte()
  b[2] = self.unlocked.clamp(min=1, max=3).to_byte()
  let best = self.best.clamp(min=0, max=0x7FFFFFFF)
  for i in 0..<4 {
    b[3 + i] = ((best >> (i * 8)) & 0xFF).to_byte()
  }
  for i in 0..<3 {
    b[8 + i] = self.stars[i].clamp(min=0, max=3).to_byte()
  }
  b
}

///|
/// 从字节解码；magic/版本不合法 → None（存档损坏时回默认值）
pub fn SaveData::decode(b : FixedArray[Byte], n : Int) -> SaveData? {
  if n < SAVE_SIZE {
    return None
  }
  if b[0].to_int() != SAVE_MAGIC {
    return None
  }
  let ver = b[1].to_int()
  if ver != 1 && ver != SAVE_VERSION {
    return None
  }
  let unlocked = b[2].to_int().clamp(min=1, max=3)
  let mut best = 0
  for i in 0..<4 {
    best = best | (b[3 + i].to_int() << (i * 8))
  }
  // v1 存档无星级 → 全 0；v2 读出并钳位
  let stars : FixedArray[Int] = FixedArray::make(3, 0)
  if ver >= 2 {
    for i in 0..<3 {
      stars[i] = b[8 + i].to_int().clamp(min=0, max=3)
    }
  }
  Some({ unlocked, best: best.clamp(min=0, max=0x7FFFFFFF), stars })
}

///|
/// 读存档：diskr 失败/数据损坏 → 默认（关卡 1 解锁，0 分）
pub fn load_save() -> SaveData {
  let buf : FixedArray[Byte] = FixedArray::make(SAVE_SIZE, b'\x00')
  let n = @wasm4.disk_read(buf, SAVE_SIZE.reinterpret_as_uint())
  match SaveData::decode(buf, n) {
    Some(d) => d
    None => SaveData::default()
  }
}

///|
/// 写存档（失败静默——存档是尽力而为的增强功能）
pub fn save_data(d : SaveData) -> Unit {
  let b = d.encode()
  let _ = @wasm4.disk_write(b, SAVE_SIZE.reinterpret_as_uint())
}

///|
pub(all) struct App {
  mut state : AppState
  mut save : SaveData
  mut sel : Int // 关卡选择光标 1..3
  mut prev_pad : @wasm4.GamePad
  game : Game
  mut pause_prev : AppState // 暂停前的状态（备用）
}

///|
pub fn App::new() -> App {
  let save = load_save()
  {
    state: Title,
    save,
    sel: 1,
    prev_pad: @wasm4.GamePad::default(),
    game: Game::new(),
    pause_prev: Title,
  }
}

///|
/// 边沿检测：本帧新按下的键
fn edge(cur : Bool, prev : Bool) -> Bool {
  cur && !prev
}

///|
fn App::pressed(
  self : App,
  cur : @wasm4.GamePad,
) -> (Bool, Bool, Bool, Bool, Bool, Bool) {
  let p = self.prev_pad
  (
    edge(cur.button_1, p.button_1),
    edge(cur.button_2, p.button_2),
    edge(cur.button_left, p.button_left),
    edge(cur.button_right, p.button_right),
    edge(cur.button_up, p.button_up),
    edge(cur.button_down, p.button_down),
  )
}

///|
/// 选择关卡并进入游戏（重置分数，载入指定关）
fn App::start_level(self : App, lv : Int) -> Unit {
  self.game.start_level(lv)
  self.state = Playing
  @wasm4.tone(
    (440, 660),
    @wasm4.ADSR::new(40, release=30),
    @wasm4.ADSRVolume::new(70),
    @wasm4.ToneFlag::new(),
  )
}

///|
fn App::unlock_level(self : App, lv : Int) -> Unit {
  if lv > self.save.unlocked {
    self.save.unlocked = lv.clamp(min=1, max=3)
    save_data(self.save)
  }
}

///|
/// 过关提交：更新解锁/最高分并存盘
pub fn App::commit_score(self : App) -> Unit {
  if self.game.score > self.save.best {
    self.save.best = self.game.score
  }
  self.unlock_level(self.game.level + 1)
  // 星级：按本关得分（含通关奖励 1000）评 1..3 星，取历史最优
  let stars = if self.game.score >= 2000 {
    3
  } else if self.game.score >= 1200 {
    2
  } else {
    1
  }
  let idx = (self.game.level - 1).clamp(min=0, max=2)
  if stars > self.save.stars[idx] {
    self.save.stars[idx] = stars
  }
  save_data(self.save)
}

///|
pub fn App::update(self : App) -> Unit {
  let pad = @wasm4.get_gamepad()
  let (p1, p2, pl, pr, _, _) = self.pressed(pad)
  self.prev_pad = pad
  match self.state {
    Title => {
      if p1 {
        self.state = LevelSelect
        self.sel = 1
        @wasm4.tone(
          (523, 784),
          @wasm4.ADSR::new(40, release=30),
          @wasm4.ADSRVolume::new(70),
          @wasm4.ToneFlag::new(),
        )
      }
    }
    LevelSelect => {
      if pl {
        self.sel = (self.sel - 2 + 3) % 3 + 1 // 1..3 循环
      }
      if pr {
        self.sel = self.sel % 3 + 1
      }
      // 只允许进入已解锁关卡
      if p1 {
        if self.sel <= self.save.unlocked {
          self.start_level(self.sel)
        } else {
          // 锁定反馈：低沉短音
          @wasm4.tone(
            (110, 82),
            @wasm4.ADSR::new(60, release=20),
            @wasm4.ADSRVolume::new(50),
            @wasm4.ToneFlag::new(),
          )
        }
      }
      if p2 {
        self.state = Title
      }
    }
    Playing => {
      if p2 {
        // START = 暂停
        self.state = Paused
        @wasm4.tone(
          (392, 392),
          @wasm4.ADSR::new(50, release=30),
          @wasm4.ADSRVolume::new(60),
          @wasm4.ToneFlag::new(),
        )
      } else if self.game.won {
        // 通关由游戏层上报（check_level_clear 置 won）
        self.commit_score()
        self.state = GameClear
      } else {
        self.game.update()
      }
    }
    Paused => {
      if p2 {
        self.state = Playing
        @wasm4.tone(
          (392, 523),
          @wasm4.ADSR::new(50, release=30),
          @wasm4.ADSRVolume::new(60),
          @wasm4.ToneFlag::new(),
        )
      } else if p1 {
        // X = 退回关卡选择
        self.state = LevelSelect
        self.sel = 1
      }
    }
    GameClear => {
      if p1 {
        self.state = LevelSelect
        self.sel = 1
      }
    }
  }
}

///|
pub fn App::draw(self : App) -> Unit {
  match self.state {
    Title => {
      @wasm4.set_draw_colors(2, index=1)
      @wasm4.text("ANGRY SLING", 88, 50)
      @wasm4.set_draw_colors(1, index=1)
      @wasm4.text("SLINGSHOT SIEGE", 82, 62)
      @wasm4.text("PRESS Z TO START", 84, 110)
      @wasm4.set_draw_colors(4, index=1)
      @wasm4.text("BEST \{self.save.best}", 116, 130)
    }
    LevelSelect => {
      @wasm4.set_draw_colors(1, index=1)
      @wasm4.text("SELECT LEVEL", 100, 40)
      for lv in 1..=3 {
        let x = 80 + (lv - 1) * 60
        let locked = lv > self.save.unlocked
        @wasm4.set_draw_colors(if locked { 4 } else { 1 }, index=1)
        @wasm4.rect(x, 80, 40, 40)
        @wasm4.set_draw_colors(2, index=1)
        @wasm4.text("\{lv}", x + 16, 96)
        if locked {
          @wasm4.text("X", x + 30, 80)
        }
        if self.sel == lv {
          @wasm4.set_draw_colors(3, index=1)
          @wasm4.rect(x - 2, 78, 44, 44)
        }
      }
      @wasm4.set_draw_colors(4, index=1)
      @wasm4.text("LEFT/RIGHT + Z   X:BACK", 60, 140)
    }
    Playing => self.game.draw()
    Paused => {
      self.game.draw()
      // 半透明覆盖层（深色描边框 + 文字）
      @wasm4.set_draw_colors(4, index=2)
      @wasm4.rect(80, 60, 160, 40)
      @wasm4.set_draw_colors(1, index=1)
      @wasm4.text("PAUSED", 132, 68)
      @wasm4.text("Z:RESUME X:QUIT", 92, 86)
    }
    GameClear => {
      self.game.draw()
      @wasm4.set_draw_colors(3, index=1)
      @wasm4.text("ALL LEVELS CLEAR!", 80, 60)
      @wasm4.set_draw_colors(1, index=1)
      @wasm4.text("SCORE \{self.game.score}", 100, 76)
      // 星级：用 * 表示已获星，- 表示未获
      let s = self.save.stars[(self.game.level - 1).clamp(min=0, max=2)]
      let mut star_txt = ""
      for i in 0..<3 {
        star_txt += if i < s { "*" } else { "-" }
      }
      @wasm4.text("STARS \{star_txt}", 116, 88)
      @wasm4.text("BEST \{self.save.best}", 100, 100)
      @wasm4.text("PRESS Z", 120, 116)
    }
  }
}
