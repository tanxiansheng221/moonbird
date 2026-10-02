// 怒鸭大战
pub(all) struct Pt {
  mut x : Double
  mut y : Double
}

///|
pub(all) enum Kind {
  A
  B(Int)
}

///|
pub struct Holder {
  p : Pt
  mut k : Kind
  arr : Array[Double]
}

///|
pub fn make() -> Holder {
  { p: { x: 1.5, y: 2.5 }, k: B(7), arr: [1.0, 2.0] }
}

///|
pub fn bump(h : Holder, dx : Double) -> Unit {
  h.p.x += dx
  h.k = A
  h.arr.push(dx)
}
