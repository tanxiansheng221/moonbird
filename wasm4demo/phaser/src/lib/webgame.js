class $PanicError extends Error {}
function $panic() {
  throw new $PanicError();
}
function _M0TPB13StringBuilder(param0) {
  this.val = param0;
}
function _M0TPC16string10StringView(param0, param1, param2) {
  this.str = param0;
  this.start = param1;
  this.end = param2;
}
const _M0FPB19int__to__string__js = (x, radix) => {
  return x.toString(radix);
};
function $oob() {
  throw new Error("Index out of bounds");
}
const _M0MPB7JSArray4push = (arr, val) => { arr.push(val); };
const _M0MPB7JSArray11set__length = (arr, len) => { arr.length = len; };
const _M0MPB7JSArray6splice = (arr, idx, cnt) => arr.splice(idx, cnt);
function _M0DTPC16option6OptionGdE4None() {}
_M0DTPC16option6OptionGdE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGdE4None__ = new _M0DTPC16option6OptionGdE4None();
function _M0DTPC16option6OptionGdE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGdE4Some.prototype.$tag = 1;
function _M0TP28birdcore4core7Contact(param0, param1, param2) {
  this.nx = param0;
  this.ny = param1;
  this.depth = param2;
}
function _M0TPB8MutLocalGdE(param0) {
  this.val = param0;
}
function _M0TP28birdcore4core11DamageEvent(param0, param1) {
  this.target = param0;
  this.amount = param1;
}
function _M0TP28birdcore4core10BlastEvent(param0, param1) {
  this.target = param0;
  this.amount = param1;
}
function _M0TP28birdcore4core5Clock(param0, param1, param2) {
  this.acc = param0;
  this.steps = param1;
  this.max_steps = param2;
}
function _M0TPB8MutLocalGiE(param0) {
  this.val = param0;
}
function _M0TP28birdcore4core5World(param0) {
  this.entities = param0;
}
function _M0TP28birdcore4core6Entity(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  this.px = param0;
  this.py = param1;
  this.vx = param2;
  this.vy = param3;
  this.kind = param4;
  this.shape = param5;
  this.mat = param6;
  this.hp = param7;
  this.asleep = param8;
  this.sleep_t = param9;
  this.dead = param10;
}
function _M0DTP28birdcore4core5Shape6Circle(param0) {
  this._0 = param0;
}
_M0DTP28birdcore4core5Shape6Circle.prototype.$tag = 0;
function _M0DTP28birdcore4core5Shape3Box(param0, param1) {
  this._0 = param0;
  this._1 = param1;
}
_M0DTP28birdcore4core5Shape3Box.prototype.$tag = 1;
function _M0DTP28birdcore4core5Shape6Static() {}
_M0DTP28birdcore4core5Shape6Static.prototype.$tag = 2;
const _M0DTP28birdcore4core5Shape6Static__ = new _M0DTP28birdcore4core5Shape6Static();
function $f64_convert_i32_u(a) {
  return a < 0 ? a + 4294967296.0 : a + 0.0;
}
function _M0TP17webgame4Game(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14, param15) {
  this.world = param0;
  this.bird = param1;
  this.phase = param2;
  this.level = param3;
  this.won = param4;
  this.drag_x = param5;
  this.drag_y = param6;
  this.dragging = param7;
  this.skip_req = param8;
  this.score = param9;
  this.bird_type = param10;
  this.skill_used = param11;
  this.particles = param12;
  this.cam_x = param13;
  this.rng_state = param14;
  this.clock = param15;
}
function _M0TP17webgame8Particle(param0, param1, param2, param3, param4, param5) {
  this.x = param0;
  this.y = param1;
  this.vx = param2;
  this.vy = param3;
  this.life = param4;
  this.col = param5;
}
function _M0TPB8MutLocalGbE(param0) {
  this.val = param0;
}
const _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger = { method_0: _M0IPB13StringBuilderPB6Logger13write__string, method_1: _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE, method_2: _M0IPB13StringBuilderPB6Logger11write__view, method_3: _M0IPB13StringBuilderPB6Logger11write__char, method_4: _M0IP016_24default__implPB6Logger28write__string__interpolationGRPB13StringBuilderE, method_5: _M0IP016_24default__implPB6Logger5writeGRPB13StringBuilderE };
function _M0FPC15abort5abortGRP17webgame8ParticleE(msg) {
  return $panic();
}
function _M0MPB13StringBuilder13write__objectGiE(self, obj) {
  _M0IP016_24default__implPB4Show6outputGiE(obj, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
}
function _M0MPB13StringBuilder21StringBuilder_2einner(size_hint) {
  return new _M0TPB13StringBuilder("");
}
function _M0MPB13StringBuilder10to__string(self) {
  return self.val;
}
function _M0IPB13StringBuilderPB6Logger11write__char(self, ch) {
  self.val = `${self.val}${String.fromCodePoint(ch)}`;
}
function _M0IPB13StringBuilderPB6Logger13write__string(self, str) {
  self.val = `${self.val}${str}`;
}
function _M0MPC16uint166UInt1622is__leading__surrogate(self) {
  return self >= 55296 && self <= 56319;
}
function _M0MPC16uint166UInt1623is__trailing__surrogate(self) {
  return self >= 56320 && self <= 57343;
}
function _M0IP016_24default__implPB6Logger28write__string__interpolationGRPB13StringBuilderE(self, show) {
  show.method_table.method_0(show.self, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
}
function _M0IP016_24default__implPB6Logger5writeGRPB13StringBuilderE(self, show) {
  show.method_table.method_0(show.self, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
}
function _M0MPC16string6String21clamped__view_2einner(self, start, end) {
  const len = self.length;
  let lo = start < 0 ? 0 : start > len ? len : start;
  let hi;
  if (end === undefined) {
    hi = len;
  } else {
    const _Some = end;
    const _e = _Some;
    hi = _e < 0 ? 0 : _e > len ? len : _e;
  }
  if (lo > 0 && (lo < len && (_M0MPC16uint166UInt1623is__trailing__surrogate(self.charCodeAt(lo)) && _M0MPC16uint166UInt1622is__leading__surrogate(self.charCodeAt(lo - 1 | 0))))) {
    lo = lo + 1 | 0;
  }
  if (hi > 0 && (hi < len && (_M0MPC16uint166UInt1623is__trailing__surrogate(self.charCodeAt(hi)) && _M0MPC16uint166UInt1622is__leading__surrogate(self.charCodeAt(hi - 1 | 0))))) {
    hi = hi - 1 | 0;
  }
  return lo >= hi ? new _M0TPC16string10StringView(self, lo, lo) : new _M0TPC16string10StringView(self, lo, hi);
}
function _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE(self, value, start, len) {
  _M0IPB13StringBuilderPB6Logger11write__view(self, _M0MPC16string6String21clamped__view_2einner(value, start, start + len | 0));
}
function _M0IP016_24default__implPB4Show6outputGiE(self, logger) {
  logger.method_table.method_0(logger.self, _M0IPC13int3IntPB4Show10to__string(self));
}
function _M0MPC13int3Int18to__string_2einner(self, radix) {
  return _M0FPB19int__to__string__js(self, radix);
}
function _M0MPC16string10StringView9to__owned(self) {
  return self.str.substring(self.start, self.end);
}
function _M0IPB13StringBuilderPB6Logger11write__view(self, str) {
  self.val = `${self.val}${_M0MPC16string10StringView9to__owned(str)}`;
}
function _M0MPC15array5Array4pushGRP17webgame8ParticleE(self, value) {
  _M0MPB7JSArray4push(self, value);
}
function _M0IPC13int3IntPB4Show10to__string(self) {
  return _M0MPC13int3Int18to__string_2einner(self, 10);
}
function _M0MPC16double6Double7is__nan(self) {
  return self !== self;
}
function _M0MPC16double6Double3min(self, other) {
  return _M0MPC16double6Double7is__nan(self) ? other : _M0MPC16double6Double7is__nan(other) ? self : self < other ? self : other;
}
function _M0MPC16double6Double3max(self, other) {
  return _M0MPC16double6Double7is__nan(self) ? other : _M0MPC16double6Double7is__nan(other) ? self : self > other ? self : other;
}
function _M0MPC16double6Double5clamp(self, min, max) {
  return min <= max ? (self < min ? min : self > max ? max : self) : $panic();
}
function _M0MPC15array5Array28unsafe__truncate__to__lengthGRP28birdcore4core6EntityE(self, new_len) {
  _M0MPB7JSArray11set__length(self, new_len);
}
function _M0MPC15array5Array6removeGRP17webgame8ParticleE(self, index) {
  if (index >= 0 && index < self.length) {
    const value = index >>> 0 < self.length ? self[index] : $oob();
    _M0MPB7JSArray6splice(self, index, 1);
    return value;
  } else {
    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(60);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "index out of bounds: the len is from 0 to ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, self.length);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " but the index is ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, index);
    return _M0FPC15abort5abortGRP17webgame8ParticleE(_M0MPB13StringBuilder10to__string(_string_builder));
  }
}
function _M0MPC15array5Array2atGRP28birdcore4core6EntityE(self, index) {
  const len = self.length;
  return index >= 0 && index < len ? self[index] : $panic();
}
function _M0MPC15array5Array6retainGRP28birdcore4core6EntityE(self, f) {
  const len = self.length;
  const _bind = self.length;
  let write;
  let _tmp = 0;
  let _tmp$2 = 0;
  while (true) {
    const read = _tmp;
    const write$2 = _tmp$2;
    if (read < _bind) {
      const v = self[read];
      if (f(v)) {
        if (read !== write$2) {
          self[write$2] = v;
        }
        _tmp = read + 1 | 0;
        _tmp$2 = write$2 + 1 | 0;
        continue;
      }
      _tmp = read + 1 | 0;
      continue;
    } else {
      write = write$2;
      break;
    }
  }
  if (write !== len) {
    _M0MPC15array5Array28unsafe__truncate__to__lengthGRP28birdcore4core6EntityE(self, write);
    return;
  } else {
    return;
  }
}
function _M0FP28birdcore4core4dabs(v) {
  return v < 0 ? -v : v;
}
function _M0FP28birdcore4core12mat__density(m) {
  switch (m) {
    case 0: {
      return 1;
    }
    case 1: {
      return 0.6;
    }
    case 2: {
      return 2.5;
    }
    case 3: {
      return 0.8;
    }
    case 4: {
      return 1.2;
    }
    case 5: {
      return 0.9;
    }
    default: {
      return 100000;
    }
  }
}
function _M0FP28birdcore4core16mat__restitution(m) {
  switch (m) {
    case 0: {
      return 0.2;
    }
    case 1: {
      return 0.1;
    }
    case 2: {
      return 0.1;
    }
    case 3: {
      return 0.3;
    }
    case 4: {
      return 0.3;
    }
    case 5: {
      return 0.2;
    }
    default: {
      return 0.2;
    }
  }
}
function _M0FP28birdcore4core14mat__threshold(m) {
  switch (m) {
    case 0: {
      return 60;
    }
    case 1: {
      return 40;
    }
    case 2: {
      return 120;
    }
    case 3: {
      return 50;
    }
    case 4: {
      return 1000000000;
    }
    case 5: {
      return 30;
    }
    default: {
      return 1000000000;
    }
  }
}
function _M0FP28birdcore4core7mat__hp(m) {
  switch (m) {
    case 0: {
      return 100;
    }
    case 1: {
      return 50;
    }
    case 2: {
      return 250;
    }
    case 3: {
      return 120;
    }
    case 4: {
      return 1000000000;
    }
    case 5: {
      return 1;
    }
    default: {
      return 1000000000;
    }
  }
}
function _M0MP28birdcore4core6Entity4mass(e) {
  const _bind = e.kind;
  if (_bind === 4) {
    return 0;
  }
  const d = _M0FP28birdcore4core12mat__density(e.mat);
  let w;
  let h;
  _L: {
    let r;
    _L$2: {
      const _bind$2 = e.shape;
      switch (_bind$2.$tag) {
        case 0: {
          const _Circle = _bind$2;
          const _r = _Circle._0;
          r = _r;
          break _L$2;
        }
        case 1: {
          const _Box = _bind$2;
          const _w = _Box._0;
          const _h = _Box._1;
          w = _w;
          h = _h;
          break _L;
        }
        default: {
          return 0;
        }
      }
    }
    return d * r * r * 3.14159;
  }
  return d * (w + 0) * (h + 0);
}
function _M0MP28birdcore4core6Entity6radius(e) {
  let w;
  let h;
  _L: {
    const _bind = e.shape;
    switch (_bind.$tag) {
      case 0: {
        const _Circle = _bind;
        const _r = _Circle._0;
        return _r;
      }
      case 1: {
        const _Box = _bind;
        const _w = _Box._0;
        const _h = _Box._1;
        w = _w;
        h = _h;
        break _L;
      }
      default: {
        return 1000000000;
      }
    }
  }
  return 0.5 * Math.sqrt(((Math.imul(w, w) | 0) + (Math.imul(h, h) | 0) | 0) + 0);
}
function _M0MP28birdcore4core6Entity4wake(e) {
  e.asleep = false;
  e.sleep_t = 0;
}
function _M0MP28birdcore4core6Entity9inv__mass(e) {
  const m = _M0MP28birdcore4core6Entity4mass(e);
  return m <= 0 ? 0 : 1 / m;
}
function _M0MP28birdcore4core6Entity9integrate(e, dt) {
  if (e.asleep) {
    return undefined;
  }
  const _bind = e.shape;
  if (_bind.$tag === 2) {
    return undefined;
  }
  const _bind$2 = e.kind;
  if (_bind$2 === 4) {
    return undefined;
  }
  const sp0 = Math.sqrt(e.vx * e.vx + e.vy * e.vy);
  if (sp0 < 4) {
    e.sleep_t = e.sleep_t + dt;
    if (e.sleep_t > 1) {
      e.asleep = true;
      e.vx = 0;
      e.vy = 0;
    }
  } else {
    e.sleep_t = 0;
  }
  e.vy = e.vy + 300 * dt;
  const vmax = 380;
  const sp = Math.sqrt(e.vx * e.vx + e.vy * e.vy);
  if (sp > vmax) {
    e.vx = e.vx / sp * vmax;
    e.vy = e.vy / sp * vmax;
  }
  e.px = e.px + e.vx * dt;
  e.py = e.py + e.vy * dt;
}
function _M0FP28birdcore4core7as__box(e) {
  let w;
  let h;
  _L: {
    let r;
    _L$2: {
      const _bind = e.shape;
      switch (_bind.$tag) {
        case 0: {
          const _Circle = _bind;
          const _r = _Circle._0;
          r = _r;
          break _L$2;
        }
        case 1: {
          const _Box = _bind;
          const _w = _Box._0;
          const _h = _Box._1;
          w = _w;
          h = _h;
          break _L;
        }
        default: {
          return { _0: _M0DTPC16option6OptionGdE4None__, _1: 400, _2: 10 };
        }
      }
    }
    return { _0: new _M0DTPC16option6OptionGdE4Some(r), _1: 0, _2: 0 };
  }
  return { _0: _M0DTPC16option6OptionGdE4None__, _1: w, _2: h };
}
function _M0FP28birdcore4core8box__box(a, w1, h1, b, w2, h2) {
  const dx = b.px - a.px;
  const dy = b.py - a.py;
  const ox = ((w1 + w2 | 0) + 0) / 2 - _M0FP28birdcore4core4dabs(dx);
  const oy = ((h1 + h2 | 0) + 0) / 2 - _M0FP28birdcore4core4dabs(dy);
  return ox <= 0 || oy <= 0 ? undefined : ox < oy ? new _M0TP28birdcore4core7Contact(dx < 0 ? -1 : 1, 0, ox) : new _M0TP28birdcore4core7Contact(0, dy < 0 ? -1 : 1, oy);
}
function _M0FP28birdcore4core11circle__box(c, ra, bx, w, h, flip) {
  const hw = (w + 0) / 2;
  const hh = (h + 0) / 2;
  const rx = c.px - bx.px;
  const ry = c.py - bx.py;
  const cx = rx < -hw ? -hw : rx > hw ? hw : rx;
  const cy = ry < -hh ? -hh : ry > hh ? hh : ry;
  const dx = c.px - (bx.px + cx);
  const dy = c.py - (bx.py + cy);
  const d2 = dx * dx + dy * dy;
  if (d2 >= ra * ra) {
    return undefined;
  } else {
    const d = Math.sqrt(d2);
    let nx;
    let ny;
    let depth;
    _L: {
      if (d > 1e-009) {
        nx = dx / d;
        ny = dy / d;
        depth = ra - d;
        break _L;
      } else {
        const px = hw - _M0FP28birdcore4core4dabs(cx);
        const py = hh - _M0FP28birdcore4core4dabs(cy);
        if (px < py) {
          nx = cx < 0 ? -1 : 1;
          ny = 0;
          depth = ra + px;
          break _L;
        } else {
          nx = 0;
          ny = cy < 0 ? -1 : 1;
          depth = ra + py;
          break _L;
        }
      }
    }
    return flip ? new _M0TP28birdcore4core7Contact(-nx, -ny, depth) : new _M0TP28birdcore4core7Contact(nx, ny, depth);
  }
}
function _M0FP28birdcore4core7collide(a, b) {
  let ah;
  let ra;
  let aw;
  let bw;
  let rb;
  let bh;
  _L: {
    const _bind = _M0FP28birdcore4core7as__box(a);
    const _bind$2 = _M0FP28birdcore4core7as__box(b);
    if (_bind === undefined) {
      return undefined;
    } else {
      const _Some = _bind;
      const _x = _Some;
      const _ra = _x._0;
      const _aw = _x._1;
      const _ah = _x._2;
      if (_bind$2 === undefined) {
        return undefined;
      } else {
        const _Some$2 = _bind$2;
        const _x$2 = _Some$2;
        const _rb = _x$2._0;
        const _bw = _x$2._1;
        const _bh = _x$2._2;
        ah = _ah;
        ra = _ra;
        aw = _aw;
        bw = _bw;
        rb = _rb;
        bh = _bh;
        break _L;
      }
    }
  }
  let rb$2;
  _L$2: {
    let ra$2;
    _L$3: {
      let ra$3;
      let rb$3;
      _L$4: {
        if (ra.$tag === 1) {
          const _Some = ra;
          const _ra = _Some._0;
          if (rb.$tag === 1) {
            const _Some$2 = rb;
            const _rb = _Some$2._0;
            ra$3 = _ra;
            rb$3 = _rb;
            break _L$4;
          } else {
            ra$2 = _ra;
            break _L$3;
          }
        } else {
          if (rb.$tag === 1) {
            const _Some = rb;
            const _rb = _Some._0;
            rb$2 = _rb;
            break _L$2;
          } else {
            return _M0FP28birdcore4core8box__box(a, aw, ah, b, bw, bh);
          }
        }
      }
      const dx = b.px - a.px;
      const dy = b.py - a.py;
      const d = Math.sqrt(dx * dx + dy * dy);
      const rr = ra$3 + rb$3;
      if (d < rr) {
        const nx = d < 1e-009 ? 0 : dx / d;
        const ny = d < 1e-009 ? -1 : dy / d;
        return new _M0TP28birdcore4core7Contact(nx, ny, rr - d);
      } else {
        return undefined;
      }
    }
    return _M0FP28birdcore4core11circle__box(a, ra$2, b, bw, bh, false);
  }
  return _M0FP28birdcore4core11circle__box(b, rb$2, a, aw, ah, false);
}
function _M0FP28birdcore4core7resolve(a, b, ct) {
  const im1 = _M0MP28birdcore4core6Entity9inv__mass(a);
  const im2 = _M0MP28birdcore4core6Entity9inv__mass(b);
  const im_sum = im1 + im2;
  if (im_sum <= 0) {
    return undefined;
  }
  const vrx = b.vx - a.vx;
  const vry = b.vy - a.vy;
  const vn = vrx * ct.nx + vry * ct.ny;
  const corr = _M0MPC16double6Double3max(ct.depth - 0.5, 0) * 0.8 / im_sum;
  a.px = a.px - ct.nx * corr * im1;
  a.py = a.py - ct.ny * corr * im1;
  b.px = b.px + ct.nx * corr * im2;
  b.py = b.py + ct.ny * corr * im2;
  if (vn >= 0) {
    return undefined;
  }
  const e = _M0MPC16double6Double3min(_M0FP28birdcore4core16mat__restitution(a.mat), _M0FP28birdcore4core16mat__restitution(b.mat));
  const j = -(1 + e) * vn / im_sum;
  a.vx = a.vx - j * ct.nx * im1;
  a.vy = a.vy - j * ct.ny * im1;
  b.vx = b.vx + j * ct.nx * im2;
  b.vy = b.vy + j * ct.ny * im2;
  if (-vn > 50) {
    _M0MP28birdcore4core6Entity4wake(a);
    _M0MP28birdcore4core6Entity4wake(b);
    return;
  } else {
    return;
  }
}
function _M0FP28birdcore4core14impact__damage(a, b, ct) {
  const im1 = _M0MP28birdcore4core6Entity9inv__mass(a);
  const im2 = _M0MP28birdcore4core6Entity9inv__mass(b);
  if (im1 + im2 <= 0) {
    return undefined;
  }
  const vrx = b.vx - a.vx;
  const vry = b.vy - a.vy;
  const vn = -(vrx * ct.nx + vry * ct.ny);
  if (vn <= 0) {
    return undefined;
  }
  const m = _M0MPC16double6Double3min(_M0MP28birdcore4core6Entity4mass(a), _M0MP28birdcore4core6Entity4mass(b));
  const impact = vn * Math.sqrt(m);
  const apply = (t) => {
    const th = _M0FP28birdcore4core14mat__threshold(t.mat);
    if (impact > th) {
      const dmg = new _M0TPB8MutLocalGdE(impact - th);
      _L: {
        _L$2: {
          const _bind = t.kind;
          const _bind$2 = a.kind;
          const _bind$3 = b.kind;
          if (_bind === 1) {
            if (_bind$2 === 0) {
              break _L$2;
            } else {
              if (_bind$3 === 0) {
                break _L$2;
              }
            }
          }
          break _L;
        }
        dmg.val = dmg.val * 2;
      }
      return new _M0TP28birdcore4core11DamageEvent(t, dmg.val);
    } else {
      return undefined;
    }
  };
  const _bind = a.mat;
  if (_bind === 6) {
    const _bind$2 = b.mat;
    if (_bind$2 === 6) {
      return undefined;
    } else {
      return apply(b);
    }
  } else {
    let ev;
    _L: {
      const _bind$2 = apply(a);
      if (_bind$2 === undefined) {
        const _bind$3 = b.mat;
        if (_bind$3 === 6) {
          return undefined;
        } else {
          return apply(b);
        }
      } else {
        const _Some = _bind$2;
        const _ev = _Some;
        ev = _ev;
        break _L;
      }
    }
    return ev;
  }
}
function _M0MP28birdcore4core5World7explode(self, ex, ey, radius, power, damage) {
  const hits = [];
  const _bind = self.entities;
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const e = _bind[_];
      _L: {
        const _bind$3 = e.shape;
        if (_bind$3.$tag === 2) {
          break _L;
        }
        const dx = e.px - ex;
        const dy = e.py - ey;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d >= radius) {
          break _L;
        }
        const falloff = 1 - d / radius;
        const nx = d < 1e-006 ? 0 : dx / d;
        const ny = d < 1e-006 ? -1 : dy / d;
        _M0MP28birdcore4core6Entity4wake(e);
        const im = _M0MP28birdcore4core6Entity9inv__mass(e);
        if (im > 0) {
          const dv = power * falloff * im;
          e.vx = e.vx + nx * dv;
          e.vy = e.vy + ny * dv;
        }
        let _tmp$2;
        const _bind$4 = e.mat;
        let _tmp$3;
        if (_bind$4 === 6) {
          _tmp$3 = true;
        } else {
          _tmp$3 = false;
        }
        if (!_tmp$3) {
          _tmp$2 = !e.dead;
        } else {
          _tmp$2 = false;
        }
        if (_tmp$2) {
          _M0MPC15array5Array4pushGRP17webgame8ParticleE(hits, new _M0TP28birdcore4core10BlastEvent(e, damage * falloff));
        }
        break _L;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return hits;
}
function _M0MP28birdcore4core5Clock11new_2einner(_dt, max_steps) {
  return new _M0TP28birdcore4core5Clock(0, 0, max_steps);
}
function _M0MP28birdcore4core5Clock3new(_dt$46$opt, max_steps$46$opt) {
  let _dt;
  if (_dt$46$opt.$tag === 1) {
    const _Some = _dt$46$opt;
    _dt = _Some._0;
  } else {
    _dt = 0.016666666666666666;
  }
  let max_steps;
  if (max_steps$46$opt === undefined) {
    max_steps = 3;
  } else {
    const _Some = max_steps$46$opt;
    max_steps = _Some;
  }
  return _M0MP28birdcore4core5Clock11new_2einner(_dt, max_steps);
}
function _M0MP28birdcore4core5Clock4tick(self, frame_dt, step) {
  self.acc = self.acc + frame_dt;
  const n = new _M0TPB8MutLocalGiE(0);
  while (true) {
    if (self.acc >= 0.016666666666666666 && n.val < self.max_steps) {
      step();
      self.acc = self.acc - 0.016666666666666666;
      n.val = n.val + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  if (self.acc > 0.016666666666666666 * (self.max_steps + 0)) {
    self.acc = 0;
  }
  self.steps = n.val;
  return n.val;
}
function _M0MP28birdcore4core5World3new() {
  return new _M0TP28birdcore4core5World([]);
}
function _M0MP28birdcore4core5World3add(self, e) {
  _M0MPC15array5Array4pushGRP17webgame8ParticleE(self.entities, e);
}
function _M0MP28birdcore4core5World4step(self, dt) {
  const _bind = self.entities;
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const e = _bind[_];
      _M0MP28birdcore4core6Entity9integrate(e, dt);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const damages = [];
  const _bind$3 = 0;
  const _bind$4 = 2;
  let _tmp$2 = _bind$3;
  while (true) {
    const iter = _tmp$2;
    if (iter < _bind$4) {
      const n = self.entities.length;
      const _bind$5 = 0;
      let _tmp$3 = _bind$5;
      while (true) {
        const i = _tmp$3;
        if (i < n) {
          const _bind$6 = i + 1 | 0;
          let _tmp$4 = _bind$6;
          while (true) {
            const j = _tmp$4;
            if (j < n) {
              const a = _M0MPC15array5Array2atGRP28birdcore4core6EntityE(self.entities, i);
              const b = _M0MPC15array5Array2atGRP28birdcore4core6EntityE(self.entities, j);
              const dx = b.px - a.px;
              const dy = b.py - a.py;
              const rr = _M0MP28birdcore4core6Entity6radius(a) + _M0MP28birdcore4core6Entity6radius(b);
              if (dx * dx + dy * dy < rr * rr) {
                let ct;
                _L: {
                  _L$2: {
                    const _bind$7 = _M0FP28birdcore4core7collide(a, b);
                    if (_bind$7 === undefined) {
                    } else {
                      const _Some = _bind$7;
                      const _ct = _Some;
                      ct = _ct;
                      break _L$2;
                    }
                    break _L;
                  }
                  _M0FP28birdcore4core7resolve(a, b, ct);
                  let ev;
                  _L$3: {
                    _L$4: {
                      const _bind$7 = _M0FP28birdcore4core14impact__damage(a, b, ct);
                      if (_bind$7 === undefined) {
                      } else {
                        const _Some = _bind$7;
                        const _ev = _Some;
                        ev = _ev;
                        break _L$4;
                      }
                      break _L$3;
                    }
                    if (iter === 0) {
                      _M0MPC15array5Array4pushGRP17webgame8ParticleE(damages, ev);
                    }
                  }
                }
              }
              _tmp$4 = j + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          _tmp$3 = i + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp$2 = iter + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$5 = damages.length;
  let _tmp$3 = 0;
  while (true) {
    const _ = _tmp$3;
    if (_ < _bind$5) {
      const ev = damages[_];
      const t = ev.target;
      if (t.hp > 0) {
        t.hp = t.hp - ev.amount;
      }
      _tmp$3 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return damages;
}
function _M0FP17webgame22bird__type__for__level(lv) {
  switch (lv) {
    case 4: {
      return 1;
    }
    case 5: {
      return 3;
    }
    case 6: {
      return 2;
    }
    case 8: {
      return 2;
    }
    case 9: {
      return 1;
    }
    case 10: {
      return 3;
    }
    case 12: {
      return 3;
    }
    default: {
      return 0;
    }
  }
}
function _M0MP17webgame4Game11add__ground(self) {
  _M0MP28birdcore4core5World3add(self.world, new _M0TP28birdcore4core6Entity(600, 470, 0, 0, 4, _M0DTP28birdcore4core5Shape6Static__, 6, 1000000000, false, 0, false));
}
function _M0MP17webgame4Game8add__box(self, px, py, w, h, mat) {
  _M0MP28birdcore4core5World3add(self.world, new _M0TP28birdcore4core6Entity(px, py, 0, 0, 2, new _M0DTP28birdcore4core5Shape3Box(w, h), mat, _M0FP28birdcore4core7mat__hp(mat), false, 0, false));
}
function _M0MP17webgame4Game8add__tnt(self, px, py) {
  _M0MP28birdcore4core5World3add(self.world, new _M0TP28birdcore4core6Entity(px, py, 0, 0, 3, new _M0DTP28birdcore4core5Shape3Box(30, 30), 5, _M0FP28birdcore4core7mat__hp(5), false, 0, false));
}
function _M0MP17webgame4Game8add__pig(self, px, py) {
  _M0MP28birdcore4core5World3add(self.world, new _M0TP28birdcore4core6Entity(px, py, 0, 0, 1, new _M0DTP28birdcore4core5Shape6Circle(18), 3, _M0FP28birdcore4core7mat__hp(3), false, 0, false));
}
function _M0MP17webgame4Game12load__level1(self) {
  _M0MP17webgame4Game8add__box(self, 450, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 390, 435, 24, 60, 1);
  _M0MP17webgame4Game8add__tnt(self, 504, 435);
  _M0MP17webgame4Game8add__box(self, 414, 390, 48, 18, 0);
  _M0MP17webgame4Game8add__box(self, 486, 390, 48, 18, 0);
  _M0MP17webgame4Game8add__box(self, 450, 354, 48, 18, 0);
  _M0MP17webgame4Game8add__pig(self, 450, 426);
}
function _M0MP17webgame4Game13load__level10(self) {
  _M0MP17webgame4Game8add__box(self, 700, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 760, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__tnt(self, 730, 441);
  _M0MP17webgame4Game8add__box(self, 730, 396, 108, 18, 0);
  _M0MP17webgame4Game8add__box(self, 710, 366, 24, 42, 2);
  _M0MP17webgame4Game8add__box(self, 750, 366, 24, 42, 2);
  _M0MP17webgame4Game8add__box(self, 730, 336, 90, 15, 0);
  _M0MP17webgame4Game8add__pig(self, 730, 312);
  _M0MP17webgame4Game8add__pig(self, 830, 441);
}
function _M0MP17webgame4Game13load__level11(self) {
  _M0MP17webgame4Game8add__box(self, 680, 435, 24, 60, 1);
  _M0MP17webgame4Game8add__box(self, 760, 435, 24, 60, 1);
  _M0MP17webgame4Game8add__box(self, 720, 435, 24, 60, 1);
  _M0MP17webgame4Game8add__tnt(self, 720, 375);
  _M0MP17webgame4Game8add__box(self, 720, 336, 120, 18, 0);
  _M0MP17webgame4Game8add__pig(self, 680, 312);
  _M0MP17webgame4Game8add__pig(self, 760, 312);
  _M0MP17webgame4Game8add__box(self, 720, 285, 60, 24, 2);
}
function _M0MP17webgame4Game13load__level12(self) {
  _M0MP17webgame4Game8add__box(self, 700, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 756, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__tnt(self, 728, 441);
  _M0MP17webgame4Game8add__box(self, 728, 396, 104, 18, 2);
  _M0MP17webgame4Game8add__box(self, 706, 366, 24, 42, 2);
  _M0MP17webgame4Game8add__box(self, 750, 366, 24, 42, 2);
  _M0MP17webgame4Game8add__tnt(self, 728, 366);
  _M0MP17webgame4Game8add__box(self, 728, 327, 96, 18, 2);
  _M0MP17webgame4Game8add__pig(self, 728, 303);
  _M0MP17webgame4Game8add__pig(self, 728, 441);
  _M0MP17webgame4Game8add__pig(self, 830, 441);
}
function _M0MP17webgame4Game12load__level2(self) {
  _M0MP17webgame4Game8add__box(self, 420, 435, 24, 60, 1);
  _M0MP17webgame4Game8add__box(self, 492, 435, 24, 60, 1);
  _M0MP17webgame4Game8add__tnt(self, 456, 435);
  _M0MP17webgame4Game8add__box(self, 456, 396, 108, 18, 0);
  _M0MP17webgame4Game8add__box(self, 432, 366, 24, 36, 1);
  _M0MP17webgame4Game8add__box(self, 480, 366, 24, 36, 1);
  _M0MP17webgame4Game8add__box(self, 456, 342, 72, 15, 0);
  _M0MP17webgame4Game8add__pig(self, 456, 441);
  _M0MP17webgame4Game8add__pig(self, 456, 318);
}
function _M0MP17webgame4Game12load__level3(self) {
  _M0MP17webgame4Game8add__box(self, 426, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__tnt(self, 456, 444);
  _M0MP17webgame4Game8add__box(self, 486, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 456, 396, 120, 18, 0);
  _M0MP17webgame4Game8add__box(self, 432, 363, 24, 48, 1);
  _M0MP17webgame4Game8add__box(self, 480, 363, 24, 48, 1);
  _M0MP17webgame4Game8add__box(self, 456, 330, 96, 15, 0);
  _M0MP17webgame4Game8add__box(self, 438, 306, 21, 27, 2);
  _M0MP17webgame4Game8add__box(self, 474, 306, 21, 27, 2);
  _M0MP17webgame4Game8add__box(self, 456, 282, 66, 15, 0);
  _M0MP17webgame4Game8add__pig(self, 456, 258);
  _M0MP17webgame4Game8add__pig(self, 555, 441);
}
function _M0MP17webgame4Game12load__level4(self) {
  _M0MP17webgame4Game8add__box(self, 765, 435, 24, 60, 0);
  _M0MP17webgame4Game8add__box(self, 825, 435, 24, 60, 0);
  _M0MP17webgame4Game8add__box(self, 795, 396, 96, 18, 0);
  _M0MP17webgame4Game8add__box(self, 795, 366, 24, 42, 1);
  _M0MP17webgame4Game8add__tnt(self, 795, 441);
  _M0MP17webgame4Game8add__pig(self, 795, 336);
}
function _M0MP17webgame4Game12load__level5(self) {
  _M0MP17webgame4Game8add__box(self, 600, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 636, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 618, 396, 72, 18, 2);
  _M0MP17webgame4Game8add__pig(self, 618, 441);
  _M0MP17webgame4Game8add__box(self, 750, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 786, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 768, 396, 72, 18, 0);
  _M0MP17webgame4Game8add__tnt(self, 768, 441);
  _M0MP17webgame4Game8add__pig(self, 768, 375);
}
function _M0MP17webgame4Game12load__level6(self) {
  _M0MP17webgame4Game8add__box(self, 540, 441, 36, 36, 1);
  _M0MP17webgame4Game8add__pig(self, 540, 414);
  _M0MP17webgame4Game8add__box(self, 645, 441, 36, 36, 1);
  _M0MP17webgame4Game8add__pig(self, 645, 414);
  _M0MP17webgame4Game8add__box(self, 750, 441, 36, 36, 1);
  _M0MP17webgame4Game8add__pig(self, 750, 414);
}
function _M0MP17webgame4Game12load__level7(self) {
  _M0MP17webgame4Game8add__box(self, 510, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 570, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 540, 390, 90, 18, 0);
  _M0MP17webgame4Game8add__box(self, 522, 360, 24, 42, 0);
  _M0MP17webgame4Game8add__box(self, 558, 360, 24, 42, 0);
  _M0MP17webgame4Game8add__box(self, 540, 330, 72, 15, 0);
  _M0MP17webgame4Game8add__pig(self, 540, 441);
  _M0MP17webgame4Game8add__pig(self, 540, 309);
}
function _M0MP17webgame4Game12load__level8(self) {
  _M0MP17webgame4Game8add__box(self, 570, 435, 24, 60, 0);
  _M0MP17webgame4Game8add__box(self, 618, 435, 24, 60, 0);
  _M0MP17webgame4Game8add__box(self, 594, 390, 84, 18, 0);
  _M0MP17webgame4Game8add__pig(self, 594, 441);
  _M0MP17webgame4Game8add__box(self, 750, 375, 24, 60, 1);
  _M0MP17webgame4Game8add__box(self, 798, 375, 24, 60, 1);
  _M0MP17webgame4Game8add__box(self, 774, 327, 96, 15, 0);
  _M0MP17webgame4Game8add__pig(self, 774, 297);
  _M0MP17webgame4Game8add__tnt(self, 690, 441);
}
function _M0MP17webgame4Game12load__level9(self) {
  _M0MP17webgame4Game8add__box(self, 620, 435, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 620, 375, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 620, 315, 24, 60, 2);
  _M0MP17webgame4Game8add__box(self, 700, 435, 48, 60, 0);
  _M0MP17webgame4Game8add__box(self, 760, 435, 24, 60, 1);
  _M0MP17webgame4Game8add__tnt(self, 760, 375);
  _M0MP17webgame4Game8add__pig(self, 700, 375);
  _M0MP17webgame4Game8add__pig(self, 820, 441);
}
function _M0MP17webgame4Game11load__level(self) {
  _M0MP17webgame4Game11add__ground(self);
  const _bind = self.level;
  switch (_bind) {
    case 1: {
      _M0MP17webgame4Game12load__level1(self);
      return;
    }
    case 2: {
      _M0MP17webgame4Game12load__level2(self);
      return;
    }
    case 3: {
      _M0MP17webgame4Game12load__level3(self);
      return;
    }
    case 4: {
      _M0MP17webgame4Game12load__level4(self);
      return;
    }
    case 5: {
      _M0MP17webgame4Game12load__level5(self);
      return;
    }
    case 6: {
      _M0MP17webgame4Game12load__level6(self);
      return;
    }
    case 7: {
      _M0MP17webgame4Game12load__level7(self);
      return;
    }
    case 8: {
      _M0MP17webgame4Game12load__level8(self);
      return;
    }
    case 9: {
      _M0MP17webgame4Game12load__level9(self);
      return;
    }
    case 10: {
      _M0MP17webgame4Game13load__level10(self);
      return;
    }
    case 11: {
      _M0MP17webgame4Game13load__level11(self);
      return;
    }
    case 12: {
      _M0MP17webgame4Game13load__level12(self);
      return;
    }
    default: {
      _M0MP17webgame4Game12load__level1(self);
      return;
    }
  }
}
function _M0MP17webgame4Game9rand__u32(self) {
  const x = self.rng_state;
  const x2 = x ^ x << 13;
  const x3 = x2 ^ (x2 >>> 17 | 0);
  const x4 = x3 ^ x3 << 5;
  self.rng_state = x4;
  return x4;
}
function _M0MP17webgame4Game11rand__range(self, lo, hi) {
  return lo + $f64_convert_i32_u(_M0MP17webgame4Game9rand__u32(self)) / 4294967296 * (hi - lo);
}
function _M0MP17webgame4Game11spawn__bird(self) {
  _M0MPC15array5Array6retainGRP28birdcore4core6EntityE(self.world.entities, (e) => {
    const _bind = e.kind;
    let _tmp;
    if (_bind === 0) {
      _tmp = true;
    } else {
      _tmp = false;
    }
    return !_tmp;
  });
  self.bird = undefined;
  self.bird_type = _M0FP17webgame22bird__type__for__level(self.level);
  self.skill_used = false;
  self.skip_req = false;
  self.drag_x = 180;
  self.drag_y = 390;
  self.phase = 0;
  const b = new _M0TP28birdcore4core6Entity(180, 390, 0, 0, 0, new _M0DTP28birdcore4core5Shape6Circle(15), 4, 1000000000, true, 0, false);
  _M0MP28birdcore4core5World3add(self.world, b);
  self.bird = b;
}
function _M0MP17webgame4Game3new() {
  const g = new _M0TP17webgame4Game(_M0MP28birdcore4core5World3new(), undefined, 0, 1, false, 180, 390, false, false, 0, 0, false, [], 0, 625341585, _M0MP28birdcore4core5Clock3new(_M0DTPC16option6OptionGdE4None__, 3));
  _M0MP17webgame4Game11load__level(g);
  _M0MP17webgame4Game11spawn__bird(g);
  return g;
}
function _M0MP17webgame4Game6launch(self) {
  let b;
  _L: {
    const _bind = self.bird;
    if (_bind === undefined) {
      return;
    } else {
      const _Some = _bind;
      const _b = _Some;
      b = _b;
      break _L;
    }
  }
  const dx = 180 - self.drag_x;
  const dy = 390 - self.drag_y;
  const vx = new _M0TPB8MutLocalGdE(dx * 14);
  const vy = new _M0TPB8MutLocalGdE(dy * 14);
  const sp = Math.sqrt(vx.val * vx.val + vy.val * vy.val);
  if (sp > 380) {
    vx.val = vx.val / sp * 380;
    vy.val = vy.val / sp * 380;
  }
  b.px = self.drag_x;
  b.py = self.drag_y;
  b.vx = vx.val;
  b.vy = vy.val;
  _M0MP28birdcore4core6Entity4wake(b);
  self.phase = 1;
}
function _M0MP17webgame4Game7pointer(self, x, y, down) {
  const _bind = self.phase;
  let _tmp;
  if (_bind === 0) {
    _tmp = true;
  } else {
    _tmp = false;
  }
  if (!_tmp) {
    return undefined;
  }
  if (down) {
    const dx = x - 180;
    const dy = y - 390;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 96 || self.dragging) {
      self.dragging = true;
      const cl = d > 72 ? 72 / d : 1;
      self.drag_x = 180 + dx * cl;
      self.drag_y = 390 + dy * cl;
      return;
    } else {
      return;
    }
  } else {
    if (self.dragging) {
      self.dragging = false;
      _M0MP17webgame4Game6launch(self);
      return;
    } else {
      return;
    }
  }
}
function _M0MP17webgame4Game21spawn__particles__col(self, x, y, n, col) {
  const _bind = 0;
  let _tmp = _bind;
  while (true) {
    const _ = _tmp;
    if (_ < n) {
      const dx = new _M0TPB8MutLocalGdE(_M0MP17webgame4Game11rand__range(self, -1, 1));
      const dy = new _M0TPB8MutLocalGdE(_M0MP17webgame4Game11rand__range(self, -1, 1));
      const len = Math.sqrt(dx.val * dx.val + dy.val * dy.val);
      if (len < 0.0001) {
        dx.val = 1;
        dy.val = 0;
      } else {
        dx.val = dx.val / len;
        dy.val = dy.val / len;
      }
      const sp = _M0MP17webgame4Game11rand__range(self, 60, 270);
      _M0MPC15array5Array4pushGRP17webgame8ParticleE(self.particles, new _M0TP17webgame8Particle(x, y, dx.val * sp, dy.val * sp - 120, _M0MP17webgame4Game11rand__range(self, 0.3, 0.8), col));
      _tmp = _ + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0MP17webgame4Game16spawn__particles(self, x, y, n) {
  _M0MP17webgame4Game21spawn__particles__col(self, x, y, n, 2);
}
function _M0FP17webgame18mat__particle__col(mat) {
  switch (mat) {
    case 0: {
      return 4;
    }
    case 1: {
      return 1;
    }
    case 2: {
      return 2;
    }
    case 3: {
      return 3;
    }
    default: {
      return 2;
    }
  }
}
function _M0MP17webgame4Game21spawn__particles__mat(self, x, y, n, mat) {
  _M0MP17webgame4Game21spawn__particles__col(self, x, y, n, _M0FP17webgame18mat__particle__col(mat));
}
function _M0MP17webgame4Game12apply__blast(self, ex, ey) {
  const hits = _M0MP28birdcore4core5World7explode(self.world, ex, ey, 165, 260, 180);
  _M0MP17webgame4Game16spawn__particles(self, ex, ey, 20);
  const _bind = hits.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const h = hits[_];
      const _bind$2 = h.target.kind;
      switch (_bind$2) {
        case 1: {
          if (h.target.hp <= 0 && !h.target.dead) {
            h.target.dead = true;
            self.score = self.score + 500 | 0;
            _M0MP17webgame4Game21spawn__particles__mat(self, h.target.px, h.target.py, 8, 3);
          }
          break;
        }
        case 2: {
          if (h.target.hp <= 0 && !h.target.dead) {
            h.target.dead = true;
            self.score = self.score + 150 | 0;
            _M0MP17webgame4Game21spawn__particles__mat(self, h.target.px, h.target.py, 8, h.target.mat);
          }
          break;
        }
        case 3: {
          if (h.target.hp <= 0 && !h.target.dead) {
            h.target.dead = true;
            _M0MP17webgame4Game12apply__blast(self, h.target.px, h.target.py);
          }
          break;
        }
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0MP17webgame4Game10use__skill(self) {
  if (self.skill_used) {
    return undefined;
  }
  let b;
  _L: {
    const _bind = self.bird;
    if (_bind === undefined) {
      return;
    } else {
      const _Some = _bind;
      const _b = _Some;
      b = _b;
      break _L;
    }
  }
  const _bind = self.bird_type;
  switch (_bind) {
    case 0: {
      return;
    }
    case 1: {
      const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (sp > 0.1) {
        self.skill_used = true;
        const ns = _M0MPC16double6Double5clamp(sp * 1.6, 0, 520);
        b.vx = b.vx / sp * ns;
        b.vy = b.vy / sp * ns;
        _M0MP17webgame4Game21spawn__particles__col(self, b.px, b.py, 10, 1);
        return;
      } else {
        return;
      }
    }
    case 2: {
      const sp$2 = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (sp$2 > 0.1) {
        self.skill_used = true;
        const ux = b.vx / sp$2;
        const uy = b.vy / sp$2;
        const c = 0.927;
        const s = 0.375;
        const _bind$2 = [1, -1];
        const _bind$3 = _bind$2.length;
        let _tmp = 0;
        while (true) {
          const _ = _tmp;
          if (_ < _bind$3) {
            const k = _bind$2[_];
            const sub = new _M0TP28birdcore4core6Entity(b.px, b.py, 0, 0, 0, new _M0DTP28birdcore4core5Shape6Circle(12), 4, 1000000000, false, 0, false);
            sub.px = b.px - ux * 30 * (k + 0);
            sub.py = b.py - uy * 30 * (k + 0);
            const spd = sp$2 * 0.95;
            sub.vx = (ux * c - uy * s * (k + 0)) * spd;
            sub.vy = (uy * c + ux * s * (k + 0)) * spd;
            _M0MP28birdcore4core5World3add(self.world, sub);
            _tmp = _ + 1 | 0;
            continue;
          } else {
            return;
          }
        }
      } else {
        return;
      }
    }
    default: {
      self.skill_used = true;
      b.dead = true;
      _M0MP17webgame4Game12apply__blast(self, b.px, b.py);
      self.phase = 2;
      return;
    }
  }
}
function _M0MP17webgame4Game10skip__shot(self) {
  self.skip_req = true;
}
function _M0MP17webgame4Game19check__level__clear(self) {
  const pigs = new _M0TPB8MutLocalGiE(0);
  const _bind = self.world.entities;
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const e = _bind[_];
      const _bind$3 = e.kind;
      if (_bind$3 === 1) {
        if (!e.dead) {
          pigs.val = pigs.val + 1 | 0;
        }
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  if (pigs.val === 0) {
    self.score = self.score + 1000 | 0;
    if (self.level >= 12) {
      self.won = true;
      return;
    } else {
      self.level = self.level + 1 | 0;
      _M0MP17webgame4Game11load__level(self);
      _M0MP17webgame4Game11spawn__bird(self);
      return;
    }
  } else {
    return;
  }
}
function _M0MP17webgame4Game13fixed__update(self) {
  const damages = _M0MP28birdcore4core5World4step(self.world, 0.016666666666666666);
  const _bind = damages.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const d = damages[_];
      const _bind$2 = d.target.kind;
      switch (_bind$2) {
        case 1: {
          if (d.target.hp <= 0 && !d.target.dead) {
            d.target.dead = true;
            self.score = self.score + 500 | 0;
            _M0MP17webgame4Game21spawn__particles__mat(self, d.target.px, d.target.py, 8, 3);
          }
          break;
        }
        case 2: {
          if (d.target.hp <= 0 && !d.target.dead) {
            d.target.dead = true;
            self.score = self.score + 150 | 0;
            _M0MP17webgame4Game21spawn__particles__mat(self, d.target.px, d.target.py, 8, d.target.mat);
          }
          break;
        }
        case 3: {
          if (d.target.hp <= 0 && !d.target.dead) {
            d.target.dead = true;
            _M0MP17webgame4Game12apply__blast(self, d.target.px, d.target.py);
          }
          break;
        }
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const i = new _M0TPB8MutLocalGiE(0);
  while (true) {
    if (i.val < self.particles.length) {
      const p = _M0MPC15array5Array2atGRP28birdcore4core6EntityE(self.particles, i.val);
      p.vy = p.vy + 5;
      p.x = p.x + p.vx * 0.016666666666666666;
      p.y = p.y + p.vy * 0.016666666666666666;
      p.life = p.life - 0.016666666666666666;
      if (p.life <= 0) {
        _M0MPC15array5Array6removeGRP17webgame8ParticleE(self.particles, i.val);
      } else {
        i.val = i.val + 1 | 0;
      }
      continue;
    } else {
      break;
    }
  }
  _M0MPC15array5Array6retainGRP28birdcore4core6EntityE(self.world.entities, (e) => {
    let _tmp$2;
    if (e.dead) {
      const _bind$2 = e.kind;
      let _tmp$3;
      if (_bind$2 === 0) {
        _tmp$3 = true;
      } else {
        _tmp$3 = false;
      }
      _tmp$2 = !_tmp$3;
    } else {
      _tmp$2 = false;
    }
    return !_tmp$2;
  });
  const _bind$2 = self.phase;
  switch (_bind$2) {
    case 1: {
      let b;
      _L: {
        const _bind$3 = self.bird;
        if (_bind$3 === undefined) {
          self.phase = 2;
          return;
        } else {
          const _Some = _bind$3;
          const _b = _Some;
          b = _b;
          break _L;
        }
      }
      const stopped = b.asleep || (b.px < -60 || (b.px > 1260 || b.py > 720) || self.skip_req);
      if (stopped) {
        b.dead = true;
        _M0MPC15array5Array6retainGRP28birdcore4core6EntityE(self.world.entities, (e) => {
          const _bind$3 = e.kind;
          let _tmp$2;
          if (_bind$3 === 0) {
            _tmp$2 = true;
          } else {
            _tmp$2 = false;
          }
          return !_tmp$2;
        });
        self.bird = undefined;
        self.phase = 2;
        return;
      } else {
        return;
      }
    }
    case 2: {
      const all_sleep = new _M0TPB8MutLocalGbE(true);
      const _bind$3 = self.world.entities;
      const _bind$4 = _bind$3.length;
      let _tmp$2 = 0;
      while (true) {
        const _ = _tmp$2;
        if (_ < _bind$4) {
          const e = _bind$3[_];
          let _tmp$3;
          const _bind$5 = e.kind;
          let _tmp$4;
          if (_bind$5 === 4) {
            _tmp$4 = true;
          } else {
            _tmp$4 = false;
          }
          if (!_tmp$4) {
            _tmp$3 = !e.asleep;
          } else {
            _tmp$3 = false;
          }
          if (_tmp$3) {
            all_sleep.val = false;
            break;
          }
          _tmp$2 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      if (all_sleep.val) {
        _M0MP17webgame4Game19check__level__clear(self);
        if (!self.won) {
          const has_live_pig = new _M0TPB8MutLocalGbE(false);
          const _bind$5 = self.world.entities;
          const _bind$6 = _bind$5.length;
          let _tmp$3 = 0;
          while (true) {
            const _ = _tmp$3;
            if (_ < _bind$6) {
              const e = _bind$5[_];
              const _bind$7 = e.kind;
              if (_bind$7 === 1) {
                if (!e.dead) {
                  has_live_pig.val = true;
                }
              }
              _tmp$3 = _ + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          if (has_live_pig.val) {
            _M0MP17webgame4Game11spawn__bird(self);
            return;
          } else {
            return;
          }
        } else {
          return;
        }
      } else {
        return;
      }
    }
    default: {
      return;
    }
  }
}
function _M0MP17webgame4Game10run__steps(self) {
  _M0MP28birdcore4core5Clock4tick(self.clock, 0.016666666666666666, () => {
    _M0MP17webgame4Game13fixed__update(self);
  });
}
function _M0MP17webgame4Game14update__camera(self) {
  const _bind = self.phase;
  let target;
  if (_bind === 1) {
    let b;
    _L: {
      _L$2: {
        const _bind$2 = self.bird;
        if (_bind$2 === undefined) {
          target = 0;
        } else {
          const _Some = _bind$2;
          const _b = _Some;
          b = _b;
          break _L$2;
        }
        break _L;
      }
      target = _M0MPC16double6Double5clamp(b.px - 640, 0, 400);
    }
  } else {
    target = 0;
  }
  self.cam_x = self.cam_x + (target - self.cam_x) * 0.15;
  if (self.cam_x < 0.5) {
    self.cam_x = 0;
    return;
  } else {
    return;
  }
}
function _M0MP17webgame4Game6update(self) {
  _M0MP17webgame4Game10run__steps(self);
  _M0MP17webgame4Game14update__camera(self);
}
function _M0MP17webgame4Game10get__level(self) {
  return self.level;
}
function _M0MP17webgame4Game10get__score(self) {
  return self.score;
}
function _M0MP17webgame4Game8get__won(self) {
  return self.won;
}
function _M0MP17webgame4Game10get__phase(self) {
  const _bind = self.phase;
  switch (_bind) {
    case 0: {
      return 0;
    }
    case 1: {
      return 1;
    }
    default: {
      return 2;
    }
  }
}
function _M0MP17webgame4Game15get__bird__type(self) {
  const _bind = self.bird_type;
  switch (_bind) {
    case 0: {
      return 0;
    }
    case 1: {
      return 1;
    }
    case 2: {
      return 2;
    }
    default: {
      return 3;
    }
  }
}
function _M0MP17webgame4Game16get__skill__used(self) {
  return self.skill_used;
}
function _M0MP17webgame4Game13get__dragging(self) {
  return self.dragging;
}
function _M0MP17webgame4Game12get__drag__x(self) {
  return self.drag_x;
}
function _M0MP17webgame4Game12get__drag__y(self) {
  return self.drag_y;
}
function _M0MP17webgame4Game11get__cam__x(self) {
  return self.cam_x;
}
function _M0MP17webgame4Game20get__particle__count(self) {
  return self.particles.length;
}
function _M0MP17webgame4Game13get__particle(self, i) {
  const p = _M0MPC15array5Array2atGRP28birdcore4core6EntityE(self.particles, i);
  return { _0: p.x, _1: p.y, _2: p.col };
}
function _M0MP17webgame4Game16get__bird__count(self) {
  const n = new _M0TPB8MutLocalGiE(0);
  const _bind = self.world.entities;
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const e = _bind[_];
      const _bind$3 = e.kind;
      if (_bind$3 === 0) {
        if (!e.dead) {
          n.val = n.val + 1 | 0;
        }
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return n.val;
}
function _M0MP17webgame4Game18get__entity__count(self) {
  return self.world.entities.length;
}
function _M0MP17webgame4Game11get__entity(self, i) {
  const e = _M0MPC15array5Array2atGRP28birdcore4core6EntityE(self.world.entities, i);
  const _bind = e.kind;
  let kind;
  switch (_bind) {
    case 0: {
      kind = 0;
      break;
    }
    case 1: {
      kind = 1;
      break;
    }
    case 2: {
      kind = 2;
      break;
    }
    case 3: {
      kind = 3;
      break;
    }
    default: {
      kind = 4;
    }
  }
  const _bind$2 = e.mat;
  let mat;
  switch (_bind$2) {
    case 0: {
      mat = 1;
      break;
    }
    case 1: {
      mat = 2;
      break;
    }
    case 2: {
      mat = 3;
      break;
    }
    case 3: {
      mat = 4;
      break;
    }
    case 4: {
      mat = 0;
      break;
    }
    case 5: {
      mat = 5;
      break;
    }
    default: {
      mat = 6;
    }
  }
  let tag;
  let a;
  let b;
  _L: {
    let w;
    let h;
    _L$2: {
      let r;
      _L$3: {
        const _bind$3 = e.shape;
        switch (_bind$3.$tag) {
          case 0: {
            const _Circle = _bind$3;
            const _r = _Circle._0;
            r = _r;
            break _L$3;
          }
          case 1: {
            const _Box = _bind$3;
            const _w = _Box._0;
            const _h = _Box._1;
            w = _w;
            h = _h;
            break _L$2;
          }
          default: {
            tag = 2;
            a = 0;
            b = 0;
            break _L;
          }
        }
      }
      tag = 0;
      a = r;
      b = 0;
      break _L;
    }
    tag = 1;
    a = w + 0;
    b = h + 0;
    break _L;
  }
  return { _0: kind, _1: mat, _2: tag, _3: a, _4: b, _5: e.px, _6: e.py };
}
function _M0MP17webgame4Game11traj__point(self, k, bx, by) {
  const vx0 = (180 - bx) * 14;
  const vy0 = (390 - by) * 14;
  const sp = Math.sqrt(vx0 * vx0 + vy0 * vy0);
  const sc = sp > 380 ? 380 / sp : 1;
  const tvx = vx0 * sc;
  const tvy = new _M0TPB8MutLocalGdE(vy0 * sc);
  const tx = new _M0TPB8MutLocalGdE(bx);
  const ty = new _M0TPB8MutLocalGdE(by);
  const _bind = 0;
  let _tmp = _bind;
  while (true) {
    const _ = _tmp;
    if (_ < k) {
      tx.val = tx.val + tvx / 30;
      ty.val = ty.val + tvy.val / 30;
      tvy.val = tvy.val + 10;
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return { _0: tx.val, _1: ty.val };
}
function _M0FP17webgame14api__new__game() {
  return _M0MP17webgame4Game3new();
}
function _M0FP17webgame11api__update(g) {
  _M0MP17webgame4Game6update(g);
}
function _M0FP17webgame12api__pointer(g, x, y, down) {
  _M0MP17webgame4Game7pointer(g, x, y, down);
}
function _M0FP17webgame15api__use__skill(g) {
  _M0MP17webgame4Game10use__skill(g);
}
function _M0FP17webgame15api__skip__shot(g) {
  _M0MP17webgame4Game10skip__shot(g);
}
function _M0FP17webgame15api__get__level(g) {
  return _M0MP17webgame4Game10get__level(g);
}
function _M0FP17webgame15api__get__score(g) {
  return _M0MP17webgame4Game10get__score(g);
}
function _M0FP17webgame13api__get__won(g) {
  return _M0MP17webgame4Game8get__won(g);
}
function _M0FP17webgame15api__get__phase(g) {
  return _M0MP17webgame4Game10get__phase(g);
}
function _M0FP17webgame20api__get__bird__type(g) {
  return _M0MP17webgame4Game15get__bird__type(g);
}
function _M0FP17webgame21api__get__skill__used(g) {
  return _M0MP17webgame4Game16get__skill__used(g);
}
function _M0FP17webgame18api__get__dragging(g) {
  return _M0MP17webgame4Game13get__dragging(g);
}
function _M0FP17webgame17api__get__drag__x(g) {
  return _M0MP17webgame4Game12get__drag__x(g);
}
function _M0FP17webgame17api__get__drag__y(g) {
  return _M0MP17webgame4Game12get__drag__y(g);
}
function _M0FP17webgame16api__get__cam__x(g) {
  return _M0MP17webgame4Game11get__cam__x(g);
}
function _M0FP17webgame23api__get__entity__count(g) {
  return _M0MP17webgame4Game18get__entity__count(g);
}
function _M0FP17webgame16api__get__entity(g, i) {
  return _M0MP17webgame4Game11get__entity(g, i);
}
function _M0FP17webgame25api__get__particle__count(g) {
  return _M0MP17webgame4Game20get__particle__count(g);
}
function _M0FP17webgame18api__get__particle(g, i) {
  return _M0MP17webgame4Game13get__particle(g, i);
}
function _M0FP17webgame21api__get__bird__count(g) {
  return _M0MP17webgame4Game16get__bird__count(g);
}
function _M0FP17webgame16api__traj__point(g, k, bx, by) {
  return _M0MP17webgame4Game11traj__point(g, k, bx, by);
}
function _M0FP17webgame11api__consts() {
  return { _0: 12, _1: 180, _2: 390, _3: 465, _4: 1200, _5: 72 };
}
export { _M0FP17webgame14api__new__game as api_new_game, _M0FP17webgame11api__update as api_update, _M0FP17webgame12api__pointer as api_pointer, _M0FP17webgame15api__use__skill as api_use_skill, _M0FP17webgame15api__skip__shot as api_skip_shot, _M0FP17webgame15api__get__level as api_get_level, _M0FP17webgame15api__get__score as api_get_score, _M0FP17webgame13api__get__won as api_get_won, _M0FP17webgame15api__get__phase as api_get_phase, _M0FP17webgame20api__get__bird__type as api_get_bird_type, _M0FP17webgame21api__get__skill__used as api_get_skill_used, _M0FP17webgame18api__get__dragging as api_get_dragging, _M0FP17webgame17api__get__drag__x as api_get_drag_x, _M0FP17webgame17api__get__drag__y as api_get_drag_y, _M0FP17webgame16api__get__cam__x as api_get_cam_x, _M0FP17webgame23api__get__entity__count as api_get_entity_count, _M0FP17webgame16api__get__entity as api_get_entity, _M0FP17webgame25api__get__particle__count as api_get_particle_count, _M0FP17webgame18api__get__particle as api_get_particle, _M0FP17webgame21api__get__bird__count as api_get_bird_count, _M0FP17webgame16api__traj__point as api_traj_point, _M0FP17webgame11api__consts as api_consts }
//# sourceMappingURL=webgame.js.map
