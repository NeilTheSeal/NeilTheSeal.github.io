function draw() {
  orbitControl();
  push();
    background(250);
    pointLight(255, 255, 255, 1200, 1200, 0);
    pointLight(255, 255, 255, -1200, 0, -2000);
    pointLight(255, 255, 255, 1200, -200, 1200);
    ambientMaterial(50, 150, 250);
    noStroke();
    rotateZ(PI);
    // translate(loc.x, loc.y, loc.z);
    rotateY(PI / 2);
    model(window.g.assets.models.man);
    // camera(
    //   window.g.player.camera.x,
    //   window.g.player.camera.y,
    //   window.g.player.camera.z,
    //   window.g.player.coord.x,
    //   window.g.player.coord.y,
    //   window.g.player.coord.z,
    //   window.g.player.camera.upX,
    //   window.g.player.camera.upY,
    //   window.g.player.camera.upZ
    // );
    // camera();
  pop();
}

module.exports = draw;