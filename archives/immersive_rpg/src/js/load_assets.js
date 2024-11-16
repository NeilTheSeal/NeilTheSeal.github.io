function preload() {
  g.assets.models.man = loadModel("./resources/models/man.obj");
  g.assets.textures.ground = loadImage("./resources/images/ground_tile_1.jpg");
}

module.exports = preload;