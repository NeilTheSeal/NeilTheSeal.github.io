const load_assets = require("./load_assets.js");
const initialize = require("./initialize.js");
const render = require("./render.js");
const handle_inputs = require("./handle_inputs.js");
const place_camera = require("./place_camera.js");
const move_character = require("./movement.js");

window.preload = function() {
  load_assets();
}

window.setup = function() {
  initialize();
  frameRate();
};

window.draw = function() {
  handle_inputs();
  move_character();
  place_camera();
  render();
};

function camera_angle_test() {
  if(typeof(window.g.i_val) == "undefined") {
    window.g.i_val = 0;
    window.g.direction = 1;
  }
  if( g.direction === 1 ) {
    g.i_val -= 1;
    if( g.i_val === -50 ) {
      g.direction *= -1;
    }
  } else {
    g.i_val += 1;
    if ( g.i_val === 50 ) {
      g.direction *= -1;
    }
  }
  const angle = Math.PI / 2 + (Math.PI / 2) * (g.i_val / 50);
  window.g.player.coords.player_theta = angle;
}