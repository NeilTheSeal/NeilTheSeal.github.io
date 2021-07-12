/********************************************************/
/**************** Dependencies & Styling ****************/
/********************************************************/
window.jQuery = require('jquery');
window.$ = window.jQuery;
require("popper.js");
require("bootstrap");
require("./style/style.scss");
require("./js/add_font.js");

/********************************************************/
/**************** Declare global variables **************/
/********************************************************/

window.g = {
  cnv : null,
  assets : {
    models: {},
    textures: {},
  },
  player : {
    coords : {
      x : 0,
      y : 0,
      z : 0,
      player_theta : Math.PI / 2,
      ground : 0,
    },
    isJumping : false,
    jump_height : 8,
    velocity : {
      x : 0,
      y : 0,
      z : 0,
      max_velocity : 5,
      max_rotation_speed : 0.1,
    },
    camera : {
      x : 0,
      y : 0,
      z : 0,
      centerX : 0,
      centerY : 0,
      centerZ : 0,
      upX : 0,
      upY : 0,
      upZ : 0,
      camera : null,
      camera_theta : Math.PI / 2,
    }
  },
}

require("./js/sketch.js");