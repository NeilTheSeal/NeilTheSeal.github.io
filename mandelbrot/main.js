const g = {
  cnv : null,
  zoomSlider : document.getElementById("zoom-slider"),
  // zoomLabel : document.getElementById("zoom-value"),
  panXSlider : document.getElementById("pan-x"),
  // panXLabel : document.getElementById("pan-x-value"),
  panYSlider : document.getElementById("pan-y"),
  // panYLabel : document.getElementById("pan-y-value"),
  graphicsArea : document.getElementById("graphics-area"),
  zoom : 0,
  X : -0.5,
  Y : 0,
  maxRange : [[-2.5, 1.5], [-2, 2]],
  range : [[-1.5, 0.5], [-1, 1]],
  FOV : 2,
  FOVMin : 1e-9,
  FOVMax : 4,
  max_iterations : 100,
  pixel_array : [],
  is_panning : false,
};

function setup() {
  g.cnv = createCanvas(600, 600);
  g.cnv.parent(g.graphicsArea);
  document.getElementsByTagName("main")[0].remove();
  for( let i = 0; i < width; i++ ) {
    g.pixel_array.push(new Array(height));
  }
  const FOVMaxLog = Math.log(g.FOVMax);
  const FOVMinLog = Math.log(g.FOVMin);
  const defaultZoom = Math.log(g.FOV);
  const sliderValue = map(defaultZoom, FOVMinLog, FOVMaxLog, 1, 0);
  g.zoom = Math.log(g.FOV);
  g.zoomSlider.value = `${sliderValue}`;
  background(255);
  pixelDensity(1);
  noLoop();
}

function draw() {
  calculate();
  loadPixels();
  let d = pixelDensity();
  let index = 0;
  for ( let i = 0; i < width; i++ ) {
    for ( let j = 0; j < height; j++ ) {
      for ( let m = 0; m < d; m++ ) {
        pixels[index]     = g.pixel_array[j][i][0];
        pixels[index + 1] = g.pixel_array[j][i][1];
        pixels[index + 2] = g.pixel_array[j][i][2];
        pixels[index + 3] = 255;
        index += 4;
      }
    }
  }
  updatePixels();
}

function adjustZoom() {
  const speed = 0.15;
  const value = Number(g.zoomSlider.value);
  const dZoom = value * speed;
  const newZoom = g.zoom - dZoom;
  const FOVMaxLog = Math.log(g.FOVMax);
  const FOVMinLog = Math.log(g.FOVMin);
  if( newZoom < FOVMaxLog && newZoom > FOVMinLog ) {
    g.zoom -= dZoom;
    g.FOV = Math.exp(g.zoom);
    const rangeXMin = g.X - g.FOV / 2;
    const rangeXMax = g.X + g.FOV / 2;
    const rangeYMin = g.Y - g.FOV / 2;
    const rangeYMax = g.Y + g.FOV / 2;
    g.range = [[rangeXMin, rangeXMax], [rangeYMin, rangeYMax]];
  }

  redraw();
  if(g.is_panning) {
    window.setTimeout(adjustZoom, 100);
  }
}

function pan() {
  const speed = 0.05;
  const panXValue = Number(g.panXSlider.value);
  const panYValue = Number(g.panYSlider.value);
  const dx = panXValue * speed * g.FOV;
  const dy = panYValue * speed * g.FOV;
  const incX = g.X + dx;
  const incY = g.Y + dy;
  const minX = g.maxRange[0][0] + g.FOV / 2;
  const maxX = g.maxRange[0][1] - g.FOV / 2;
  const minY = g.maxRange[1][0] + g.FOV / 2;
  const maxY = g.maxRange[1][1] - g.FOV / 2;

  if( incX > minX && incX < maxX && incY < maxY && incY > minY ) {
    g.X = incX;
    g.Y = incY;
    g.range =
    [
      [g.X - g.FOV / 2, g.X + g.FOV / 2],
      [g.Y - g.FOV / 2, g.Y + g.FOV / 2]
    ];
  }
  redraw();
  if(g.is_panning) {
    window.setTimeout(pan, 100);
  }
}

g.zoomSlider.addEventListener("mousedown", function() {g.is_panning = true; adjustZoom() });
g.panXSlider.addEventListener("mousedown", function() {g.is_panning = true; pan() });
g.panYSlider.addEventListener("mousedown", function() {g.is_panning = true; pan() });

[g.panXSlider, g.panYSlider, g.zoomSlider].forEach(slider => {
  slider.addEventListener("mouseup", function() {
    slider.value = "0";
    g.is_panning = false;
  })
})

let example = true;

function calculate() {
  for ( let i = 0; i < width; i++ ) {
    for ( let j = 0; j < height; j++ ) {
      let n = g.max_iterations;
      let cx = g.range[0][0] + (i / width) * (g.range[0][1] - g.range[0][0]);
      let cy = g.range[1][0] + (j / height) * (g.range[1][1] - g.range[1][0]);
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

      const color = Math.pow(n / g.max_iterations, 0.75) * 255;
      g.pixel_array[i][j] = [color, 127 + color / 2, 200 + 55 * (color / 255)];
      
    }
  }
}

