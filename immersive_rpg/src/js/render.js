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
  pointLight(255, 255, 255, 1200, 1200, 0);
  pointLight(255, 255, 255, -1200, 0, -2000);
  pointLight(255, 255, 255, 1200, -200, 1200);
}

function display_ground() {
  push();
  let xoff = 0;
  let yoff = 0;
  for ( let x = 0; x < cols; x++ ) {
    xoff = 0;
    for ( let y = 0; y < cols; y++ ) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
      xoff += 0.2;
    }
    yoff += 0.2;
  } 
  pop();

  let scl = 100;

  for ( let j = 0; j < terrain.length - 1; j++ ) {
    beginShape(TRIANGLE_STRIP);
    for ( let i = 0; i < terrain.length; i++ ) {
      vertex(i * scl, j * scl, terrain[i][j]);
      vertex(i * scl, (j + 1) * scl, terrain[i][j + 1])
    }
    endShape();
  }
}

function render() {
  ambient_lighting();
  display_ground();
  display_main_character();
}

module.exports = render;