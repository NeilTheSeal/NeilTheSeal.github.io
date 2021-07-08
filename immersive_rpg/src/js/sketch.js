// window.p5 = new require("./p5.js");

const preload = require("./preload.js");
const setup = require("./setup.js");
const draw = require("./draw.js");
const handle_inputs = require("./handle_inputs.js");

// const containerElement = document.getElementsByTagName("main")[0];

window.preload = function() {
  preload();
}

window.setup = function() {
  setup();
};

window.draw = function() {
  handle_inputs();
  draw();
};

// window.P5 = new p5(sketch, containerElement);

// function place_camera() {
//   cam.centerX = player_coord.x;
//   cam.centerY = player_coord.y;
//   cam.centerZ = player_coord.z;
//   camera(
//     player_coord.x,
//     player_coord.y,
//     player_coord.z,
//     player_coord.centerX,
//     player_coord.centerY,
//     player_coord.centerZ,
//     player_coord.upX,
//     player_coord.upY,
//     player_coord.upZ
//   )
// }