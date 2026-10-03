// 怒鸭大战
import * as Phaser from 'phaser';   // phaser.esm.js 只有命名导出（无 default）
import { buildTextures } from './art.js';
import { GameScene } from './game.js';

const W = 1280, H = 720;

new Phaser.Game({
  type: Phaser.AUTO,
  width: W,
  height: H,
  parent: 'game',
  backgroundColor: '#87ceeb',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [GameScene]
});
