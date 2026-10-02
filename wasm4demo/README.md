# 怒鸭大战（MoonBird）

[![CI](https://github.com/tanxiansheng221/moonbird/actions/workflows/ci.yml/badge.svg)](https://github.com/tanxiansheng221/moonbird/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

100% MoonBit 编写的 WASM-4 平台弹弓物理游戏（愤怒的小鸟式玩法）。自研 2D 刚体物理引擎（birdcore），含 12 个关卡、4 种技能鸟、TNT 连环爆炸、粒子特效与本地存档。

> 玩法机制参考愤怒的小鸟类型；美术与代码全部原创，无 Rovio 任何素材，未使用其商标。

## 项目目标

1. 做一款完整可玩的弹弓物理游戏（固定步长游戏循环 + WASM-4 渲染）
2. 沉淀可复用产出：自研 2D 物理模块 `birdcore`、游戏循环模板、程序化像素渲染封装
3. 全程仅使用 MoonBit（赛事硬性红线），零外部素材，零第三方物理库

## 安装

依赖 [moon](https://www.moonbitlang.com/download/) 工具链（本项目使用 moon 0.1.20260920）与 [WASM-4](https://wasm4.org) 模拟器：

```bash
# 安装 moon（Windows/其他平台见官网）
curl -fsSL https://cli.moonbitlang.com/install/unix.sh | bash

# 安装 WASM-4 模拟器（Node.js）
npm i -g wasm4
```

## 构建

```bash
cd wasm4demo
moon build --target wasm-gc --release
# 产物：_build/wasm-gc/release/build/maze/maze.wasm
```

## 运行

```bash
wasm4 run _build/wasm-gc/release/build/maze/maze.wasm
```

按键：`鼠标左键` 拖拽发射 · `X` / `2` 技能 · `Enter` 开始/暂停

## 示例（复现最小可玩流程）

1. 启动后 Enter 进入关卡选择，选第 1 关
2. 按住鼠标左键在弹弓上向后拖拽，松手发射（拖拽时显示轨迹预览）
3. 命中木塔、消灭全部小猪即过关；≥1200 分 2★、≥2000 分 3★
4. 飞行中按 `X` 触发技能鸟（黄冲刺 1.6 倍 / 蓝三分裂 ±22° / 黑原地爆炸）
5. TNT 受冲击引爆并可链式殉爆；进度自动存入 WASM-4 disk（12 字节）

## 测试

```bash
cd wasm4demo
moon test --target wasm-gc   # 11 个测试全部通过
```

测试覆盖：弹道计算、碰撞响应、堆叠稳定性（600 帧真跑模拟）、破坏/爆炸/殉爆、存档读写与兼容、状态机流转。黑盒测不到包内私有函数，部分用例为同包白盒测试（`*_wbtest.mbt`）。CI（`.github/workflows/ci.yml`）在每次 push 时自动构建 + 用自建 Node 测试加载器（`test_runner.mjs`，注入 WASM-4 env 桩）跑全部测试产物 + 120 帧真跑冒烟。

## 项目结构

```
wasm4demo/
├── maze/            # 游戏层：关卡 / 状态机 / 渲染 / 输入
│   ├── birdgame.mbt     # 弹弓、技能鸟、12 关卡布局
│   ├── statemachine.mbt # Title/关卡选择/暂停状态机
│   └── core/            # 固定步长时钟（accumulator）
├── birdcore/        # 自研 2D 物理引擎独立包（Vec2/刚体/碰撞/材质/爆炸，可复用）
├── wasm4/           # WASM-4 MoonBit 绑定
├── test_runner.mjs  # Node 测试加载器（WASM-4 env 桩）
└── ../docs/         # 设计文档（仓库根 docs/）
```

## mooncakes 发布

`birdcore` 物理模块计划以独立包发布到 [mooncakes.io](https://mooncakes.io)（`moonbitcommunity/birdcore`），供其他 MoonBit 游戏复用。

## 团队

tanxiansheng221（独立开发）· 公开仓库 [tanxiansheng221/moonbird](https://github.com/tanxiansheng221/moonbird) · 里程碑与赛事验收对照见 [docs/03-里程碑与验收对照.md](../docs/03-里程碑与验收对照.md)

## 参考来源

- [WASM-4](https://wasm4.org) — 幻想机平台与 MoonBit 绑定
- [MoonBit](https://www.moonbitlang.com) — 语言与工具链
- 愤怒的小鸟类型玩法（仅玩法机制层面的类型参考）

## 许可证

[MIT License](LICENSE)
