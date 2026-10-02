// 怒鸭大战
import Phaser from 'phaser';
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
