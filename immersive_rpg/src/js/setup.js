const player = window.g.player;
const player_coord = player.coord;
const cam = player.camera;

function setup() {
  window.cnv = createCanvas(500, 500, WEBGL);
  cnv.id("main-canvas");
  window.g.assets.models.man.normalize();
  perspective();
  background(250);
}

module.exports = setup;