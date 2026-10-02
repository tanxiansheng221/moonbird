# MoonBird（怒鸭大战）

> 用 MoonBit 实现的弹弓物理射击游戏 —— 自研 2D 物理引擎 + 12 关 + 4 种技能鸟 + TNT 连环爆炸。

## 双形态

| 形态 | 目录 | 说明 |
|---|---|---|
| **浏览器版**（主） | [`wasm4demo/`](wasm4demo/) | MoonBit js target（游戏逻辑）+ Phaser（渲染薄壳），GitHub Pages 在线即玩 |
| WASM-4 原型 | `wasm4demo/maze/` | 160×160 幻想机，物理正确性验证平台 |

## 亮点

- **自研 2D 物理引擎** [`wasm4demo/birdcore/`](wasm4demo/birdcore/)：SAT 碰撞（圆/盒/静地面）、冲量解算、休眠系统、材质伤害、范围爆炸与链式殉爆——纯逻辑零平台依赖，可独立单测，可作为 MoonBit 2D 物理可复用产出
- **固定步长游戏循环**：accumulator 模式（`core.Clock`），掉帧防死亡螺旋
- **完整闭环**：状态机 / 星级存档 / 程序化音效 / 屏幕震动与粒子反馈
- **质量保障**：`moon test` 单测 + 12 关自动回归探针 + GitHub Actions（ci/deploy/pages）

## 快速开始

详见 [`wasm4demo/README.md`](wasm4demo/README.md)（构建 / 运行 / 测试 / 在线试玩）。

```cmd
cd wasm4demo
moon test -p webgame        :: 单测
cd phaser && npx serve .    :: 浏览器试玩（或访问 GitHub Pages）
```

## 文档

- [总体设计](docs/01-总体设计.md)（含实现演化说明）
- [物理引擎设计](docs/02-物理引擎设计.md)（含实机调参演化注记）
- [里程碑与验收对照](docs/03-里程碑与验收对照.md)
- [一页项目说明](docs/项目一页说明.md)

## 许可证

[MIT](LICENSE) · 玩法机制参考愤怒的小鸟，美术与代码全部原创，无 Rovio 素材。
