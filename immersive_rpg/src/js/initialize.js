const player = window.g.player;
const player_coord = player.coords;
const cam = player.camera;

function normalize() {
  window.g.assets.models.man.normalize();
}

function initialize() {
  window.cnv = createCanvas(500, 500, WEBGL);
  cnv.id("main-canvas");
  normalize();
  perspective();
  world.generate_chunks();
}

module.exports = initialize;