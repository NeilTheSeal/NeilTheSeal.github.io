window.g = {
  cnv : null,
  zoomSlider : document.getElementById("zoom-slider"),
  panXSlider : document.getElementById("pan-x"),
  panYSlider : document.getElementById("pan-y"),
  resetButton : document.getElementById("reset-button"),
  demoButton : document.getElementById("demo-button"),
  demoButton2 : document.getElementById("demo-button-2"),
  graphicsArea : document.getElementById("graphics-area"),
  zoom : 0,
  defaultZoom: 0,
  X : -0.5,
  Y : 0,
  maxRange : [[-2.5, 1.5], [-2, 2]],
  range : [[-1.5, 0.5], [-1, 1]],
  FOV : 2,
  FOVMin : 1e-9,
  FOVMax : 4,
  max_iterations : 40,
  pixel_index : 0,
  is_panning : false,
  demo_x : -1.184993869372935,
  demo_y : -0.24737225061637308,
  demo_x_2 : -0.7476360108797688,
  demo_y_2 : -0.18476093770127774,
  in_demo_mode : false
};

function setup() {
  window.g.cnv = createCanvas(600, 600);
  window.g.cnv.parent(window.g.graphicsArea);
  document.getElementsByTagName("main")[0].remove();
  const FOVMaxLog = Math.log(window.g.FOVMax);
  const FOVMinLog = Math.log(window.g.FOVMin);
  window.g.defaultZoom = Math.log(window.g.FOV);
  const sliderValue = map(window.g.defaultZoom, FOVMinLog, FOVMaxLog, 1, 0);
  window.g.zoom = Math.log(window.g.FOV);
  window.g.zoomSlider.value = `${sliderValue}`;
  background(255);
  pixelDensity(1);
  adjustZoom();
  pan();
  noLoop();
}

function draw() {
  window.g.pixel_index = 0;
  loadPixels();
  update();
  updatePixels();
}

function adjustZoom() {
  const speed = 0.15;
  const value = Number(window.g.zoomSlider.value);
  const dZoom = value * speed;
  const newZoom = window.g.zoom - dZoom;
  const FOVMaxLog = Math.log(window.g.FOVMax);
  const FOVMinLog = Math.log(window.g.FOVMin);
  const maxIterationFar = 40;
  const maxIterationZoomed = 350;
  let newIterations = map(newZoom, FOVMaxLog, FOVMinLog, maxIterationFar, maxIterationZoomed);
  // newIterations = map(Math.pow(newIterations, 0.75), Math.pow(maxIterationFar, 0.75), Math.pow(maxIterationZoomed, 0.75), maxIterationFar, maxIterationZoomed);
  newIterations = Math.ceil(newIterations);
  window.g.max_iterations = newIterations;
  if( newZoom < FOVMaxLog && newZoom > FOVMinLog ) {
    window.g.zoom -= dZoom;
    window.g.FOV = Math.exp(window.g.zoom);
    const rangeXMin = window.g.X - window.g.FOV / 2;
    const rangeXMax = window.g.X + window.g.FOV / 2;
    const rangeYMin = window.g.Y - window.g.FOV / 2;
    const rangeYMax = window.g.Y + window.g.FOV / 2;
    window.g.range = [[rangeXMin, rangeXMax], [rangeYMin, rangeYMax]];
  }

  redraw();
  updateLabels()
  if(window.g.is_panning) {
    window.setTimeout(adjustZoom, 100);
  }
}

function pan() {
  const speed = 0.05;
  const panXValue = Number(window.g.panXSlider.value);
  const panYValue = Number(window.g.panYSlider.value);
  const dx = panXValue * speed * window.g.FOV;
  const dy = panYValue * speed * window.g.FOV;
  const incX = window.g.X + dx;
  const incY = window.g.Y + dy;
  const minX = window.g.maxRange[0][0] + window.g.FOV / 2;
  const maxX = window.g.maxRange[0][1] - window.g.FOV / 2;
  const minY = window.g.maxRange[1][0] + window.g.FOV / 2;
  const maxY = window.g.maxRange[1][1] - window.g.FOV / 2;

  if( incX > minX && incX < maxX && incY < maxY && incY > minY ) {
    window.g.X = incX;
    window.g.Y = incY;
    window.g.range =
    [
      [window.g.X - window.g.FOV / 2, window.g.X + window.g.FOV / 2],
      [window.g.Y - window.g.FOV / 2, window.g.Y + window.g.FOV / 2]
    ];
  }
  redraw();
  updateLabels()
  if(window.g.is_panning) {
    window.setTimeout(pan, 100);
  }
}

function updateLabels() {
  const dspan = document.getElementById("d-span");
  const panX = document.getElementById("pan-x-value");
  const panY = document.getElementById("pan-y-value");
  const width = (window.g.range[0][1] - window.g.range[0][0]).toPrecision(3);
  dspan.innerHTML = width;
  panX.innerHTML = `${window.g.X.toFixed(3)}`;
  panY.innerHTML = `${(-1 * window.g.Y).toFixed(3)}`;
}

window.g.zoomSlider.addEventListener("mousedown", function() {window.g.is_panning = true; adjustZoom() });
window.g.panXSlider.addEventListener("mousedown", function() {window.g.is_panning = true; pan() });
window.g.panYSlider.addEventListener("mousedown", function() {window.g.is_panning = true; pan() });

// These 2 functions are all necessary because FIREFOX IS TRASH AND DOESN'T REGISTER MOUSEUP EVENTLISTENERS

function mouseMoved() {
  if(!window.g.in_demo_mode) {
    try{
      if(!mouseIsPressed) {
        window.g.zoomSlider.value = "0";
        window.g.panXSlider.value = "0";
        window.g.panYSlider.value = "0";
        window.g.is_panning = false;
      }
    } catch(e) {}
  }
};

function mouseReleased() {
  if(!window.g.in_demo_mode) {
    try{
      if(!mouseIsPressed) {
        window.g.zoomSlider.value = "0";
        window.g.panXSlider.value = "0";
        window.g.panYSlider.value = "0";
        window.g.is_panning = false;
      }
    } catch(e) {}
  }
};

window.setInterval(() => {
  if(!window.g.in_demo_mode) {
    try{
      if(!mouseIsPressed) {
        window.g.zoomSlider.value = "0";
        window.g.panXSlider.value = "0";
        window.g.panYSlider.value = "0";
        window.g.is_panning = false;
      }
    } catch(e) {}
  }
}, 200);

window.g.resetButton.addEventListener("click", reset);

window.g.demoButton.addEventListener("click", function() {
  if ( !window.g.in_demo_mode ) {
    reset();
    window.g.range[0] = [window.g.X - window.g.FOV, window.g.X + window.g.FOV];
    window.g.range[1] = [window.g.Y - window.g.FOV, window.g.Y + window.g.FOV];
    window.g.in_demo_mode = true;
    let i = 0;
    const demoFunction = function() {
      if( window.g.FOV > window.g.FOVMin && window.g.in_demo_mode ) {
        window.g.X += (window.g.demo_x - window.g.X) / 10;
        window.g.Y += (window.g.demo_y - window.g.Y) / 10;
        [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(slider => { slider.style.opacity = "0.25"; slider.style.pointerEvents = "none" } )
        window.g.zoomSlider.value = "0.45";
        adjustZoom();
        i++;
        setTimeout(demoFunction, 1000 / 30);
      } else {
        [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(slider => { slider.style.opacity = "1"; slider.style.pointerEvents = "auto" } )
      }
    };
    setTimeout(demoFunction, 0);
  }
});

window.g.demoButton2.addEventListener("click", function() {
  if ( !window.g.in_demo_mode ) {
    reset();
    window.g.range[0] = [window.g.X - window.g.FOV, window.g.X + window.g.FOV];
    window.g.range[1] = [window.g.Y - window.g.FOV, window.g.Y + window.g.FOV];
    window.g.in_demo_mode = true;
    let i = 0;
    const demoFunction = function() {
      if( window.g.FOV > window.g.FOVMin && window.g.in_demo_mode ) {
        window.g.X += (window.g.demo_x_2 - window.g.X) / 10;
        window.g.Y += (window.g.demo_y_2 - window.g.Y) / 10;
        [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(slider => { slider.style.opacity = "0.25"; slider.style.pointerEvents = "none" } )
        window.g.zoomSlider.value = "0.5";
        adjustZoom();
        i++;
        setTimeout(demoFunction, 1000 / 30);
      } else {
        [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(slider => { slider.style.opacity = "1"; slider.style.pointerEvents = "auto" } )
      }
    };
    setTimeout(demoFunction, 0);
  }
});

function reset() {
  [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(slider => { slider.style.opacity = "1"; slider.style.pointerEvents = "auto" } )
  window.g.in_demo_mode = false;
  window.g.X = -0.5;
  window.g.Y = 0;
  window.g.range = [[-1.5, 0.5], [-1, 1]];
  window.g.FOV = 2;
  window.g.zoom = window.g.defaultZoom;
  window.g.is_panning = false;
  pan();
  adjustZoom();
  update();
  redraw();
}

function update() {
  for ( let j = 0; j < width; j++ ) {
    for ( let i = 0; i < height; i++ ) {
      let n = window.g.max_iterations;
      const cx = window.g.range[0][0] + (i / width) * (window.g.range[0][1] - window.g.range[0][0]);
      const cy = window.g.range[1][0] + (j / height) * (window.g.range[1][1] - window.g.range[1][0]);
      let x = 0;
      let y = 0;
      let xx = 0;
      let yy = 0;
      let xy = 0;

      while( n-- && xx + yy <= 4 ) {
        xy = x * y;
        xx = x * x;
        yy = y * y;
        x = xx - yy + cx;
        y = xy + xy + cy;
        if( n <= 0 ) {break}
      }

      let color = n / g.max_iterations * 255;
      if(color > 240 ) { color = 255 }
      pixels[ window.g.pixel_index ]    = color | 0;
      pixels[ window.g.pixel_index + 1] = ( 127 + color / 2 ) | 0;
      pixels[ window.g.pixel_index + 2] = ( 200 + 55 * (color / 255)) | 0;
      pixels[ window.g.pixel_index + 3] = 255;

      window.g.pixel_index += 4;
    }
  }
}

