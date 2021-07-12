function display_main_character() {
  push();
    ambientMaterial(50, 150, 250);
    noStroke();
    translate(g.player.coords.x, g.player.coords.y, g.player.coords.z);
    rotateZ(PI);
    rotateY(g.player.coords.player_theta);
    model(window.g.assets.models.man);
  pop();
}

function ambient_lighting() {
  background(250);
  pointLight(255, 255, 255, 1200, 1200, 0);
  pointLight(255, 255, 255, -1200, 0, -2000);
  pointLight(255, 255, 255, 1200, -200, 1200);
}

function display_ground() {
  push();
    rotateX(-1 * Math.PI / 2);
    translate(0, 0, 100);
    plane(100, 100);
  pop();
}

function render() {
  ambient_lighting();
  display_ground();
  display_main_character();
}

module.exports = render;