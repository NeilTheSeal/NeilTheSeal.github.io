const { display_terrain } = require("./world_functions.js");

function display_main_character() {
  push();
    ambientMaterial(50, 150, 250);
    noStroke();
    translate(g.player.coords.x, g.player.coords.y, g.player.coords.z);
    rotateX(PI / 2);
    rotateY(g.player.coords.player_theta);
    translate(0, 100, 5);
    model(window.g.assets.models.man);
  pop();
}

function ambient_lighting() {
  background(250);
  ambientLight(50);
}

function render() {
  ambient_lighting();
  display_terrain();
  display_main_character();
}

module.exports = render;