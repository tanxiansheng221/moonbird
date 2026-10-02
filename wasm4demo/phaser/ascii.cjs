const { PNG } = require('pngjs');
const fs = require('fs');
const png = PNG.sync.read(fs.readFileSync(process.argv[2] || 'shot_full_after.png'));
const w = png.width, h = png.height;
let out = '';
for (let y = 0; y < h; y += 20) {
  for (let x = 0; x < w; x += 20) {
    const i = (w * y + x) * 4;
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    out += (r > 200 && g > 150 && b < 100) ? 'O' : (r > 150 && g < 100 && b < 100) ? '#' : (g > 110 && r < 120) ? 'g' : (r < 60 && g < 60 && b < 90) ? '.' : ' ';
  }
  out += '\n';
}
console.log(out);
