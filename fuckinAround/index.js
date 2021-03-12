let man, cnv, ground;

let loc = {
  x: -100,
  y: 0,
  z: 0,
  theta: 1.5,
}

let stuff = {
  isJumping: false,
  upSpeed: 0,
  cameraSettings: {isMoving: false, lastCoord: [0, 0]}
}

function preload() {
  man = loadModel("./man.obj");
  ground = loadImage("./ground.jpg");
};

function setup() {
  cnv = createCanvas(500, 500, WEBGL);
  const cnvElt = document.getElementsByTagName("canvas");
  cnvElt[0].addEventListener("contextmenu", function(e) {e.preventDefault()});
  man.normalize();
  camera(-300, -350, -500, 0, 0, 0, 0, 1, 0)
  perspective();
  cnv.mouseWheel(zoom);
};

function draw() {
  background(250);
  checkKeys();
  if ( stuff.isJumping ) {
    loc.y += stuff.upSpeed;
    stuff.upSpeed -= 0.981;
    if ( loc.y < 0 ) {
      stuff.isJumping = false;
      stuff.upSpeed = 0;
      loc.y = 0;
    }
  }
  push();
    rotateX(PI / 2);
    translate(0, 0, -100);
    texture(ground);
    noStroke();
    plane(1000, 1000);
  pop();
  push();
    pointLight(255, 255, 255, 1200, 1200, 0);
    pointLight(255, 255, 255, -1200, 0, -2000);
    pointLight(255, 255, 255, 1200, -200, 1200);
    ambientMaterial(50, 150, 250);
    noStroke();
    rotateZ(PI);
    translate(loc.x, loc.y, loc.z);
    rotateY(loc.theta);
    model(man);
  pop();
  if( mouseIsPressed && mouseY > 0 && mouseY < height && mouseX > 0 && mouseX < width ) {

    if( stuff.cameraSettings.isMoving ) {

      const deltaX = mouseX - stuff.cameraSettings.lastCoord[0];
      const deltaY = mouseY - stuff.cameraSettings.lastCoord[1];
      
      if( mouseButton === CENTER) {
        _renderer._curCamera.move(0, -deltaY / 2, 0);
      } else if ( mouseButton === LEFT ) {
        const coords = _renderer._curCamera._getLocalAxes();
        const xmag = Math.sqrt(coords.x[0] * coords.x[0] + coords.x[2] * coords.x[2]);
        if (xmag !== 0) {
          coords.x[0] /= xmag;
          coords.x[2] /= xmag;
        }
        const ymag = Math.sqrt(coords.y[0] * coords.y[0] + coords.y[2] * coords.y[2]);
        if (ymag !== 0) {
          coords.y[0] /= ymag;
          coords.y[2] /= ymag;
        }

        const sensitivityX = 1;
        const sensitivityY = 1;

        const dx = -1 * sensitivityX * (mouseX - pmouseX);
        const dz = -1 * sensitivityY * (mouseY - pmouseY);

        _renderer._curCamera.setPosition(
          _renderer._curCamera.eyeX + dx * coords.x[0] + dz * coords.z[0],
          _renderer._curCamera.eyeY,
          _renderer._curCamera.eyeZ + dx * coords.x[2] + dz * coords.z[2]
        );
      } else if ( mouseButton === RIGHT ) {
        const scaleFactorX = 0.005;
        const scaleFactorY = 0.003;
        _renderer._curCamera._orbit(- scaleFactorX * deltaX, scaleFactorY * deltaY, 0);
      }
    }
    stuff.cameraSettings.lastCoord = [mouseX, mouseY];
    stuff.cameraSettings.isMoving = true;
  } else {
    stuff.cameraSettings.isMoving = false;
  }
};

function checkKeys() {
  const speed = 5;
  const rotateSpeed = 0.1;
  if ( keyIsDown(37) ) { loc.theta -= rotateSpeed } // left
  if ( keyIsDown(38) ) { loc.z += speed * Math.cos(loc.theta); loc.x += speed * Math.sin(loc.theta); } // up
  if ( keyIsDown(39) ) { loc.theta += rotateSpeed } // right
  if ( keyIsDown(40) ) { loc.z -= speed * Math.cos(loc.theta); loc.x -= speed * Math.sin(loc.theta); } // down
  if ( keyIsDown(32) ) { jump() } // space
}

function jump() {
  stuff.isJumping = true;
  stuff.upSpeed = 10;
}

function zoom(event) {
    // zoom according to direction of mouseWheelDeltaY rather than value
    let sensitivityZoom = 0.05;
    let scaleFactor = height;
    if (event.deltaY > 0) {
      _renderer._curCamera._orbit(0, 0, sensitivityZoom * scaleFactor);
    } else {
      _renderer._curCamera._orbit(0, 0, -sensitivityZoom * scaleFactor);
    }
}