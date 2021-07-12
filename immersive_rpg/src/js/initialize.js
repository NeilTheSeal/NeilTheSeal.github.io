const player = window.g.player;
const player_coord = player.coords;
const cam = player.camera;
window.terrain = [];

function normalize() {
  window.g.assets.models.man.normalize();
}

function initialize() {
  window.cnv = createCanvas(500, 500, WEBGL);
  cnv.id("main-canvas");
  normalize();
  perspective();
  window.cols = 20;
  for ( let i = 0; i < cols; i++ ) {
    terrain[i] = [];
    for ( let j = 0; j < cols; j++ ) {
      terrain[i].push(0);
    }
  }
}

module.exports = initialize;