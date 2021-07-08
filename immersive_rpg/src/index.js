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
    coord : {
      x : -100,
      y : 0,
      z : 0,
      theta : 1.5,
      isJumping : false,
      velocity : {
        x : 0,
        y : 0,
        z : 0,
      }
    },
    camera : {
      x : -300,
      y : -350,
      z : -500,
      centerX : 0,
      centerY : 0,
      centerZ : 0,
      upX : 0,
      upY : 0,
      upZ : 0,
      camera : null,
    }
  },
}

require("./js/sketch.js");