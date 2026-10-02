// 怒鸭大战
// 用法: node22 test_runner.mjs <test.wasm>
import fs from 'node:fs';
import process from 'node:process';

const file = process.argv[2];
if (!file) {
  console.error('usage: node test_runner.mjs <test.wasm>');
  process.exit(2);
}

const wasm = fs.readFileSync(file);

// WASM-4 env 桩：内存 + 每个宿主函数的最小实现
const memory = new WebAssembly.Memory({ initial: 16, maximum: 256 });
const store8 = (off, v) => new Uint8Array(memory.buffer)[off] = v & 0xff;
const loadI32 = (off) => new Int32Array(memory.buffer)[off >> 2] | 0;
const storeI32 = (off, v) => new Int32Array(memory.buffer)[off >> 2] = v | 0;

// 常用地址（与 wasm4 绑定 memory map 一致）
const ADDR = { PALETTE: 0x4, DRAW_COLORS: 0x14, GAMEPADS: 0x16, MOUSE_X: 0x1a, MOUSE_Y: 0x1c, MOUSE_BUTTONS: 0x1e, SYSTEM_FLAGS: 0x1f, FRAMEBUFFER: 0xa0 };

const envStub = {
  memory,
  blit: (p, x, y, w, h, f) => {},
  blitSub: (p, x, y, w, h, sx, sy, st, f) => {},
  text: (p, x, y) => {
    const len = loadI32(p);
    let s = '';
    const u8 = new Uint8Array(memory.buffer);
    for (let i = 0; i < len; i++) s += String.fromCharCode(u8[p + 4 + i]);
    console.log('[text]', s, x, y);
  },
  tone: (freq, dur, vol, flags) => {},
  trace: (p) => {
    const len = loadI32(p);
    let s = '';
    const u8 = new Uint8Array(memory.buffer);
    for (let i = 0; i < len; i++) s += String.fromCharCode(u8[p + 4 + i]);
    console.log('[trace]', s);
  },
  diskr: (p, sz) => 0,
  diskw: (p, sz) => 0,
};

const mod = await WebAssembly.compile(wasm);
console.log('IMPORTS:');
for (const i of WebAssembly.Module.imports(mod)) console.log(' ', i.module + '.' + i.name, i.kind);

// spectest.print_char: moonbit 测试输出通道
const spectest = {
  print_char: (c) => process.stdout.write(String.fromCharCode(c)),
};

// exception：V8 内置 exception-handling tag
// Node 22 支持 WebAssembly.Exception / Tag
const exceptionTag = new WebAssembly.Tag({ parameters: [] });
const exceptionStub = {
  tag: exceptionTag,
  throw: () => { throw new WebAssembly.Exception(exceptionTag, []); },
};

// __moonbit_fs_unstable: moonrun 提供的虚文件系统，测试报告经由它输出
// begin_read_string / string_read_char / finish_read_string
// 约定：begin 返回一个 buffer 长度句柄，read_char 逐字符取，finish 结束
let fsBuf = '';
let fsPos = 0;
const fsStub = {
  begin_read_string: (p) => { fsBuf = loadStr(p); fsPos = 0; },
  string_read_char: () => fsPos < fsBuf.length ? fsBuf.charCodeAt(fsPos++) : -1,
  finish_read_string: () => {},
};

function loadStr(p) {
  const len = loadI32(p);
  let s = '';
  const u8 = new Uint8Array(memory.buffer);
  for (let i = 0; i < len; i++) s += String.fromCharCode(u8[p + 4 + i]);
  return s;
}

envStub.text = (p, x, y) => {
  console.log('[text]', loadStr(p), x, y);
};

envStub.trace = (p) => {
  console.log('[trace]', loadStr(p));
};

const nested = { exception: exceptionStub, spectest, __moonbit_fs_unstable: fsStub };
const imports = WebAssembly.Module.imports(mod).reduce((acc, i) => {
  if (i.module === 'env') {
    acc.env[i.name] = envStub[i.name] ?? (() => {});
  } else {
    acc[i.module] = acc[i.module] ?? {};
    acc[i.module][i.name] = (nested[i.module] ?? {})[i.name] ?? (() => {});
  }
  return acc;
}, { env: {} });

// 'env' 整体作为命名空间导入的情况
if (WebAssembly.Module.imports(mod).some((i) => i.module === 'env' && i.kind === 'module')) {
  imports.env = envStub;
}

const inst = await WebAssembly.instantiate(mod, imports);
console.log('instantiated OK');

// moonbit 测试驱动：_start 跑全部测试；失败经 exception.tag 抛出
// moonbit_test_driver_internal_execute(idx?) 按需执行单个测试
try {
  const ex = inst.exports;
  const startFn = ex._start ?? ex.start;
  if (typeof startFn === 'function') startFn();
  // 存在 update 导出则模拟若干帧，验证游戏循环不崩溃
  if (typeof ex.update === 'function') {
    const frames = Number(process.argv[3] ?? 120);
    for (let f = 0; f < frames; f++) ex.update();
    console.log(`[runner] update() x${frames} OK`);
  }
  console.log('ALL TESTS PASSED');
} catch (e) {
  if (e instanceof WebAssembly.Exception) {
    console.error('TEST FAILED (wasm exception)', e);
  } else {
    console.error('TEST FAILED:', e && e.message ? e.message : e);
  }
  console.error(e && e.stack ? e.stack : '');
  process.exit(1);
}
