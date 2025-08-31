window.g = {
  cnv: null,
  zoomSlider: document.getElementById("zoom-slider"),
  panXSlider: document.getElementById("pan-x"),
  panYSlider: document.getElementById("pan-y"),
  resetButton: document.getElementById("reset-button"),
  demoButton: document.getElementById("demo-button"),
  demoButton2: document.getElementById("demo-button-2"),
  graphicsArea: document.getElementById("graphics-area"),
  zoom: 0,
  defaultZoom: 0,
  X: -0.5,
  Y: 0,
  maxRange: [
    [-2.5, 1.5],
    [-2, 2],
  ],
  range: [
    [-1.5, 0.5],
    [-1, 1],
  ],
  FOV: 2,
  FOVMin: 1e-9,
  FOVMax: 10,
  max_iterations: 40,
  pixel_index: 0,
  is_panning: false,
  demo_x: -1.184993869372935,
  demo_y: -0.24737225061637308,
  demo_x_2: -0.7476360108797688,
  demo_y_2: -0.18476093770127774,
  in_demo_mode: false,
  palette: null,
  paletteSize: 1024,
  // WASM integration state
  wasm: {
    ready: false,
    mod: null,
    render: null,
    bufPtr: 0,
    bufBytes: 0,
  },
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
  // Build color palette LUT once
  window.g.palette = buildPalette(window.g.paletteSize | 0);
  // Try loading WASM module (non-blocking)
  initWasm();
  adjustZoom();
  pan();
  noLoop();
}

function draw() {
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
  const maxIterationFar = 80;
  const maxIterationZoomed = 320;
  let newIterations = map(
    newZoom,
    FOVMaxLog,
    FOVMinLog,
    maxIterationFar,
    maxIterationZoomed
  );
  // newIterations = map(Math.pow(newIterations, 0.75), Math.pow(maxIterationFar, 0.75), Math.pow(maxIterationZoomed, 0.75), maxIterationFar, maxIterationZoomed);
  newIterations = Math.ceil(newIterations);
  window.g.max_iterations = newIterations;
  if (newZoom < FOVMaxLog && newZoom > FOVMinLog) {
    window.g.zoom -= dZoom;
    window.g.FOV = Math.exp(window.g.zoom);
    const rangeXMin = window.g.X - window.g.FOV / 2;
    const rangeXMax = window.g.X + window.g.FOV / 2;
    const rangeYMin = window.g.Y - window.g.FOV / 2;
    const rangeYMax = window.g.Y + window.g.FOV / 2;
    window.g.range = [
      [rangeXMin, rangeXMax],
      [rangeYMin, rangeYMax],
    ];
  }

  redraw();
  updateLabels();
  if (window.g.is_panning) {
    window.setTimeout(adjustZoom, 16.66);
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

  if (incX > minX && incX < maxX && incY < maxY && incY > minY) {
    window.g.X = incX;
    window.g.Y = incY;
    window.g.range = [
      [window.g.X - window.g.FOV / 2, window.g.X + window.g.FOV / 2],
      [window.g.Y - window.g.FOV / 2, window.g.Y + window.g.FOV / 2],
    ];
  }
  redraw();
  updateLabels();
  if (window.g.is_panning) {
    window.setTimeout(pan, 16.66);
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

window.g.zoomSlider.addEventListener("mousedown", function () {
  window.g.is_panning = true;
  adjustZoom();
});
window.g.panXSlider.addEventListener("mousedown", function () {
  window.g.is_panning = true;
  pan();
});
window.g.panYSlider.addEventListener("mousedown", function () {
  window.g.is_panning = true;
  pan();
});

// These 2 functions are all necessary because FIREFOX IS TRASH AND DOESN'T REGISTER MOUSEUP EVENTLISTENERS

function mouseMoved() {
  if (!window.g.in_demo_mode) {
    try {
      if (!mouseIsPressed) {
        window.g.zoomSlider.value = "0";
        window.g.panXSlider.value = "0";
        window.g.panYSlider.value = "0";
        window.g.is_panning = false;
      }
    } catch (e) {}
  }
}

function mouseReleased() {
  if (!window.g.in_demo_mode) {
    try {
      if (!mouseIsPressed) {
        window.g.zoomSlider.value = "0";
        window.g.panXSlider.value = "0";
        window.g.panYSlider.value = "0";
        window.g.is_panning = false;
      }
    } catch (e) {}
  }
}

window.setInterval(() => {
  if (!window.g.in_demo_mode) {
    try {
      if (!mouseIsPressed) {
        window.g.zoomSlider.value = "0";
        window.g.panXSlider.value = "0";
        window.g.panYSlider.value = "0";
        window.g.is_panning = false;
      }
    } catch (e) {}
  }
}, 200);

window.g.resetButton.addEventListener("click", reset);

window.g.demoButton.addEventListener("click", function () {
  if (!window.g.in_demo_mode) {
    reset();
    window.g.range[0] = [window.g.X - window.g.FOV, window.g.X + window.g.FOV];
    window.g.range[1] = [window.g.Y - window.g.FOV, window.g.Y + window.g.FOV];
    window.g.in_demo_mode = true;
    let i = 0;
    const demoFunction = function () {
      if (window.g.FOV > window.g.FOVMin && window.g.in_demo_mode) {
        window.g.X += (window.g.demo_x_2 - window.g.X) / 10;
        window.g.Y += (window.g.demo_y_2 - window.g.Y) / 10;
        [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(
          (slider) => {
            slider.style.opacity = "0.25";
            slider.style.pointerEvents = "none";
          }
        );
        window.g.zoomSlider.value = "0.5";
        adjustZoom();
        i++;
        setTimeout(demoFunction, 1000 / 30);
      } else {
        [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(
          (slider) => {
            slider.style.opacity = "1";
            slider.style.pointerEvents = "auto";
          }
        );
      }
    };
    setTimeout(demoFunction, 0);
  }
});

window.g.demoButton2.addEventListener("click", function () {
  if (!window.g.in_demo_mode) {
    reset();
    window.g.range[0] = [window.g.X - window.g.FOV, window.g.X + window.g.FOV];
    window.g.range[1] = [window.g.Y - window.g.FOV, window.g.Y + window.g.FOV];
    window.g.in_demo_mode = true;
    let i = 0;
    const demoFunction = function () {
      if (window.g.FOV > window.g.FOVMin && window.g.in_demo_mode) {
        window.g.X += (window.g.demo_x - window.g.X) / 10;
        window.g.Y += (window.g.demo_y - window.g.Y) / 10;
        [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(
          (slider) => {
            slider.style.opacity = "0.25";
            slider.style.pointerEvents = "none";
          }
        );
        window.g.zoomSlider.value = "0.45";
        adjustZoom();
        i++;
        setTimeout(demoFunction, 1000 / 30);
      } else {
        [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(
          (slider) => {
            slider.style.opacity = "1";
            slider.style.pointerEvents = "auto";
          }
        );
      }
    };
    setTimeout(demoFunction, 0);
  }
});

function reset() {
  [window.g.zoomSlider, window.g.panXSlider, window.g.panYSlider].forEach(
    (slider) => {
      slider.style.opacity = "1";
      slider.style.pointerEvents = "auto";
    }
  );
  window.g.in_demo_mode = false;
  window.g.X = -0.5;
  window.g.Y = 0;
  window.g.range = [
    [-1.5, 0.5],
    [-1, 1],
  ];
  window.g.FOV = 2;
  window.g.zoom = window.g.defaultZoom;
  window.g.is_panning = false;
  pan();
  adjustZoom();
  update();
  redraw();
}

// Build a palette lookup table matching the existing polynomial gradient
function buildPalette(size) {
  const N = size | 0;
  const arr = new Uint8ClampedArray(N * 4);
  let o = 0;
  for (let i = 0; i < N; i++) {
    let color = i / (N - 1);
    if (color > 0.95) color = 1;
    const t = 1 - color;
    const c2 = color * color;
    const c3 = c2 * color;
    arr[o++] = (color * 255) | 0; // R
    arr[o++] = (9 * t * c3 * 255) | 0; // G
    arr[o++] = (15 * t * t * c2 * 255) | 0; // B
    arr[o++] = 255; // A
  }
  return arr;
}

function update() {
  // Local aliases to avoid repeated property lookups inside hot loops
  const W = width | 0;
  const H = height | 0;
  const maxIter = window.g.max_iterations | 0;
  const xMin = window.g.range[0][0];
  const xMax = window.g.range[0][1];
  const yMin = window.g.range[1][0];
  const yMax = window.g.range[1][1];
  const dx = (xMax - xMin) / W;
  const dy = (yMax - yMin) / H;
  const data = pixels; // Uint8ClampedArray from p5.js
  const palette = window.g.palette;
  const palSize = window.g.paletteSize | 0;

  // If WASM is ready, use it to fill the pixel buffer (RGBA)
  if (window.g.wasm && window.g.wasm.ready && window.g.wasm.render) {
    const needed = (W * H * 4) | 0;
    if (needed !== window.g.wasm.bufBytes) {
      // (Re)allocate buffer in WASM memory
      if (window.g.wasm.bufPtr) {
        try {
          window.g.wasm.mod._free(window.g.wasm.bufPtr);
        } catch (e) {
          console.error(e);
        }
      }
      const ptr = window.g.wasm.mod._malloc(needed);
      window.g.wasm.bufPtr = ptr;
      window.g.wasm.bufBytes = needed;
    }

    // Call WASM render(out, W, H, xMin, xMax, yMin, yMax, maxIter)
    window.g.wasm.render(
      window.g.wasm.bufPtr,
      W,
      H,
      xMin,
      xMax,
      yMin,
      yMax,
      maxIter
    );
    // Copy from HEAPU8 to pixels (guard in case HEAP views aren't exposed)
    const mod = window.g.wasm.mod;

    // Cache a HEAPU8 view; refresh if memory grows
    let heapU8 = window.g.wasm.heapU8 || null;

    if (mod.HEAPU8) {
      if (!heapU8 || heapU8.buffer !== mod.HEAPU8.buffer) {
        heapU8 = mod.HEAPU8;
        window.g.wasm.heapU8 = heapU8;
      }
    } else {
      const buf =
        (mod.wasmMemory && mod.wasmMemory.buffer) ||
        (mod.HEAP8 && mod.HEAP8.buffer) ||
        null;
      if (buf && (!heapU8 || heapU8.buffer !== buf)) {
        heapU8 = new Uint8Array(buf);
        window.g.wasm.heapU8 = heapU8;
      }
    }

    if (heapU8 && heapU8.subarray) {
      const view = heapU8.subarray(
        window.g.wasm.bufPtr,
        window.g.wasm.bufPtr + needed
      );
      data.set(view);
      return; // done
    }
    // If we couldn't access the heap, fall back to JS path below this block
  }
}

// Lazy-load the modularized Emscripten WASM module if present
function initWasm() {
  // Expect build outputs named mandelbrot_wasm.js/wasm in the same folder
  const jsUrl = new URL("mandelbrot_wasm.js", window.location.href).toString();
  // Create a script tag and attach onload
  const s = document.createElement("script");
  s.async = true;
  s.src = jsUrl;
  s.onload = () => {
    // The modularized factory should be available as Module or MandelModule; try both
    const factory = window.MandelModule || window.Module || null;
    if (!factory) return;
    try {
      factory()
        .then((mod) => {
          if (!mod.HEAPU8 && mod.wasmMemory)
            mod.HEAPU8 = new Uint8Array(mod.wasmMemory.buffer);

          window.g.wasm.mod = mod;
          // Expose the C function: render(uint8_t*, int, int, double, double, double, double, int)
          const render = mod.cwrap("render", null, [
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
          ]);
          window.g.wasm.render = render;
          // Mark ready only when memory views are exposed; otherwise wait for runtime init
          const hasHeap = !!(
            mod.HEAPU8 ||
            (mod.wasmMemory && mod.wasmMemory.buffer) ||
            (mod.HEAP8 && mod.HEAP8.buffer)
          );
          if (hasHeap) {
            window.g.wasm.ready = true;
            redraw();
          } else {
            const prev = mod.onRuntimeInitialized;
            mod.onRuntimeInitialized = function () {
              try {
                if (typeof prev === "function") prev();
              } catch (e) {}
              window.g.wasm.ready = true;
              redraw();
            };
          }
        })
        .catch(() => {});
    } catch (e) {
      // ignore; stay on JS path
    }
  };
  s.onerror = () => {
    // If file not present, silently ignore
  };
  document.head.appendChild(s);
}
