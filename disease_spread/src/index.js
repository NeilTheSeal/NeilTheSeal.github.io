import "bootstrap/dist/css/bootstrap.min.css";
import "./js/p5.js";
import "./style/style.scss";

window.globals = {
  progress: 0,
  beta: 0.5,
  gamma: 0.1,
  initiallyImmune: 0,
  p: 1,
  tMax: 100,
  pMax: 3e8,
  totalInfected: 0,
};

globals.pi = 1 / globals.pMax;

import "./js/calculations.js";
import "./js/inputs.js";
import "./js/loop.js";

/*  TODO:
  - Add "total infected"
  - Add legend
*/
