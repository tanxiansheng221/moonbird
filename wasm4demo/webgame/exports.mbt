// 怒鸭大战
pub fn api_new_game() -> Game {
  Game::new()
}

pub fn api_update(g : Game) -> Unit {
  g.update()
}

pub fn api_pointer(g : Game, x : Double, y : Double, down : Bool) -> Unit {
  g.pointer(x, y, down)
}

pub fn api_use_skill(g : Game) -> Unit {
  g.use_skill()
}

pub fn api_skip_shot(g : Game) -> Unit {
  g.skip_shot()
}

pub fn api_get_level(g : Game) -> Int {
  g.get_level()
}

///|
pub fn api_load_level(g : Game, n : Int) -> Unit {
  g.load_level_n(n)
}

pub fn api_get_score(g : Game) -> Int {
  g.get_score()
}

pub fn api_get_won(g : Game) -> Bool {
  g.get_won()
}

pub fn api_take_events(g : Game) -> (Bool, Bool, Bool, Int, Int, Int) {
  g.take_events()
}

pub fn api_get_shake(g : Game) -> Double {
  g.get_shake()
}

pub fn api_get_phase(g : Game) -> Int {
  g.get_phase()
}

pub fn api_get_bird_type(g : Game) -> Int {
  g.get_bird_type()
}

pub fn api_get_skill_used(g : Game) -> Bool {
  g.get_skill_used()
}

pub fn api_get_dragging(g : Game) -> Bool {
  g.get_dragging()
}

pub fn api_get_drag_x(g : Game) -> Double {
  g.get_drag_x()
}

pub fn api_get_drag_y(g : Game) -> Double {
  g.get_drag_y()
}

pub fn api_get_cam_x(g : Game) -> Double {
  g.get_cam_x()
}

pub fn api_get_entity_count(g : Game) -> Int {
  g.get_entity_count()
}

pub fn api_get_entity(g : Game, i : Int) -> (Int, Int, Int, Double, Double, Double, Double) {
  g.get_entity(i)
}

pub fn api_get_particle_count(g : Game) -> Int {
  g.get_particle_count()
}

pub fn api_get_particle(g : Game, i : Int) -> (Double, Double, Int) {
  g.get_particle(i)
}

pub fn api_get_bird_count(g : Game) -> Int {
  g.get_bird_count()
}

pub fn api_traj_point(g : Game, k : Int, bx : Double, by : Double) -> (Double, Double) {
  g.traj_point(k, bx, by)
}

pub fn api_consts() -> (Int, Double, Double, Double, Double, Double) {
  (NUM_LEVELS, ANCHOR_X, ANCHOR_Y, GROUND_Y, WORLD_W, DRAG_R)
}

