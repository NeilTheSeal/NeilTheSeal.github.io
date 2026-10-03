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
  FOVMin: 1e-12,
  FOVMax: 10,
  max_iterations: 40,
  pixel_index: 0,
  is_panning: false,
  demo_x: -1.4037830526255082,
  demo_y: 4.270064744241573e-10,
  demo_x_2: -0.7071436053479012,
  demo_y_2: -0.3515482784299051,
  in_demo_mode: false,
  palette: null,
  paletteSize: 1024,
  pinchSensitivity: 1.5, // >1 makes pinch zoom more sensitive
  // WASM integration state
  wasm: {
    ready: false,
    mod: null,
    render: null,
    bufPtr: 0,
    bufBytes: 0,
    // Cached views for zero-copy blit
    heapU8: null,
    clamped: null,
    imageData: null,
  },
  // 2D drawing context (p5 canvas under the hood)
  ctx: null,
};

function setup() {
  window.g.cnv = createCanvas(500, 500);
  window.g.cnv.parent(window.g.graphicsArea);
  // Get the raw 2D context once
  try {
    window.g.ctx = window.g.cnv.elt.getContext("2d");
  } catch (e) {}
  // Attach interactions for drag-to-pan and pinch/scroll zoom
  attachCanvasInteractions();
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
  if (
    window.g.wasm &&
    window.g.wasm.ready &&
    window.g.wasm.render &&
    window.g.ctx
  ) {
    update(); // will blit via putImageData
  } else {
    // Fallback (no-op for now since JS path is disabled)
  }
}

function adjustZoom() {
  const speed = 0.15;
  const value = Number(window.g.zoomSlider.value);
  const dZoom = value * speed;
  const newZoom = window.g.zoom - dZoom;
  const FOVMaxLog = Math.log(window.g.FOVMax);
  const FOVMinLog = Math.log(window.g.FOVMin);
  const maxIterationFar = 40;
  const maxIterationZoomed = 600;
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
  // const palette = window.g.palette; // kept for potential JS fallback
  // const palSize = window.g.paletteSize | 0;

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
      // Invalidate cached views; they'll be rebuilt below
      window.g.wasm.clamped = null;
      window.g.wasm.imageData = null;
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
    // Zero-copy view into WASM heap (guard in case HEAP views aren't exposed)
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

    if (heapU8 && heapU8.buffer) {
      // Build or reuse a Uint8ClampedArray view directly on the WASM heap
      if (
        !window.g.wasm.clamped ||
        window.g.wasm.clamped.buffer !== heapU8.buffer ||
        window.g.wasm.clamped.byteOffset !== window.g.wasm.bufPtr ||
        window.g.wasm.clamped.byteLength !== needed
      ) {
        try {
          window.g.wasm.clamped = new Uint8ClampedArray(
            heapU8.buffer,
            window.g.wasm.bufPtr,
            needed
          );
          window.g.wasm.imageData = new ImageData(window.g.wasm.clamped, W, H);
        } catch (e) {
          // If creating a clamped view fails (very old browsers), fall back to a copy path
          const view = heapU8.subarray(
            window.g.wasm.bufPtr,
            window.g.wasm.bufPtr + needed
          );
          window.g.wasm.clamped = new Uint8ClampedArray(view);
          window.g.wasm.imageData = new ImageData(window.g.wasm.clamped, W, H);
        }
      }

      // Blit to canvas without p5 pixel pipeline
      if (window.g.ctx && window.g.wasm.imageData) {
        window.g.ctx.putImageData(window.g.wasm.imageData, 0, 0);
        return;
      }
    }
  }
}

// ===== Interactions: drag-to-pan, wheel and pinch-to-zoom =====
function attachCanvasInteractions() {
  const canvas = window.g.cnv?.elt;
  if (!canvas) return;

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  // Mouse drag to pan
  canvas.addEventListener("mousedown", (e) => {
    dragging = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    // Only track when the pointer is over the canvas
    if (e.target !== canvas && e.buttons === 0) {
      dragging = false;
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - lastX;
    const dy = y - lastY;
    if (dx || dy) {
      applyPanDelta(dx, dy);
      lastX = x;
      lastY = y;
    }
  });
  window.addEventListener("mouseup", () => {
    dragging = false;
  });
  canvas.addEventListener("mouseleave", () => {
    dragging = false;
  });

  // Wheel/trackpad zoom around cursor
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Negative deltaY = zoom in; positive = out
      const sensitivity = 0.0052; // tune to taste
      const scale = Math.exp(-e.deltaY * sensitivity);
      applyZoomAt(scale, x, y);
    },
    { passive: false }
  );

  // Touch pinch and drag
  let pinchActive = false;
  let prevMidX = 0;
  let prevMidY = 0;
  let prevDist = 0;

  canvas.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        dragging = true;
        lastX = t.clientX - rect.left;
        lastY = t.clientY - rect.top;
      } else if (e.touches.length >= 2) {
        pinchActive = true;
        const rect = canvas.getBoundingClientRect();
        const x1 = e.touches[0].clientX - rect.left;
        const y1 = e.touches[0].clientY - rect.top;
        const x2 = e.touches[1].clientX - rect.left;
        const y2 = e.touches[1].clientY - rect.top;
        prevMidX = (x1 + x2) * 0.5;
        prevMidY = (y1 + y2) * 0.5;
        prevDist = Math.hypot(x2 - x1, y2 - y1) || 1;
      }
      e.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    (e) => {
      const rect = canvas.getBoundingClientRect();
      if (pinchActive && e.touches.length >= 2) {
        const x1 = e.touches[0].clientX - rect.left;
        const y1 = e.touches[0].clientY - rect.top;
        const x2 = e.touches[1].clientX - rect.left;
        const y2 = e.touches[1].clientY - rect.top;
        const midX = (x1 + x2) * 0.5;
        const midY = (y1 + y2) * 0.5;
        const dist = Math.hypot(x2 - x1, y2 - y1) || prevDist;
        // First apply pan by midpoint motion
        applyPanDelta(midX - prevMidX, midY - prevMidY);
        prevMidX = midX;
        prevMidY = midY;
        // Then apply incremental zoom around midpoint
        const raw = dist / prevDist;
        // Exaggerate the scale by sensitivity factor (>1 => more zoom per pinch delta)
        const scale = Math.pow(raw, window.g.pinchSensitivity || 1);
        if (scale && isFinite(scale) && scale !== 1) {
          applyZoomAt(scale, midX, midY);
          prevDist = dist;
        }
      } else if (dragging && e.touches.length === 1) {
        const t = e.touches[0];
        const x = t.clientX - rect.left;
        const y = t.clientY - rect.top;
        applyPanDelta(x - lastX, y - lastY);
        lastX = x;
        lastY = y;
      }
      e.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    (e) => {
      if (e.touches.length < 2) pinchActive = false;
      if (e.touches.length === 0) dragging = false;
      e.preventDefault();
    },
    { passive: false }
  );
}

function applyPanDelta(dxPixels, dyPixels) {
  const W = width | 0;
  const H = height | 0;
  const dX = (dxPixels * window.g.FOV) / W;
  const dY = (dyPixels * window.g.FOV) / H;
  // Dragging right should move content right => decrease center X
  window.g.X -= dX;
  // Dragging down should move content down => decrease world Y (invert canvas Y)
  window.g.Y -= dY;
  clampCenter();
  window.g.range = [
    [window.g.X - window.g.FOV / 2, window.g.X + window.g.FOV / 2],
    [window.g.Y - window.g.FOV / 2, window.g.Y + window.g.FOV / 2],
  ];
  redraw();
  updateLabels();
}

function applyZoomAt(scale, px, py) {
  // Compute new FOV with limits
  const oldFOV = window.g.FOV;
  let newFOV = oldFOV / scale; // scale>1 => zoom in
  newFOV = Math.max(window.g.FOVMin, Math.min(window.g.FOVMax, newFOV));
  if (newFOV === window.g.FOV) return;

  const W = width | 0;
  const H = height | 0;
  const xMin = window.g.range[0][0];
  const yMin = window.g.range[1][0];
  const dxOld = oldFOV / W;
  const dyOld = oldFOV / H;
  // World point under the cursor before zoom
  const wx = xMin + px * dxOld;
  const wy = yMin + py * dyOld;

  // New center that keeps (wx,wy) under the same screen pixel
  const dxNew = newFOV / W;
  const dyNew = newFOV / H;
  window.g.X = wx + (W * 0.5 - px) * dxNew;
  window.g.Y = wy + (H * 0.5 - py) * dyNew;
  clampCenter();
  window.g.FOV = newFOV;
  window.g.zoom = Math.log(window.g.FOV);
  // Match adjustZoom(): map zoom to iterations
  {
    const FOVMaxLog = Math.log(window.g.FOVMax);
    const FOVMinLog = Math.log(window.g.FOVMin);
    const maxIterationFar = 40;
    const maxIterationZoomed = 600;
    let newIterations = map(
      window.g.zoom,
      FOVMaxLog,
      FOVMinLog,
      maxIterationFar,
      maxIterationZoomed
    );
    window.g.max_iterations = Math.ceil(newIterations);
  }
  window.g.range = [
    [window.g.X - window.g.FOV / 2, window.g.X + window.g.FOV / 2],
    [window.g.Y - window.g.FOV / 2, window.g.Y + window.g.FOV / 2],
  ];
  redraw();
  updateLabels();
}

function clampCenter() {
  const half = window.g.FOV / 2;
  const minX = window.g.maxRange[0][0] + half;
  const maxX = window.g.maxRange[0][1] - half;
  const minY = window.g.maxRange[1][0] + half;
  const maxY = window.g.maxRange[1][1] - half;
  if (minX <= maxX) window.g.X = Math.max(minX, Math.min(maxX, window.g.X));
  if (minY <= maxY) window.g.Y = Math.max(minY, Math.min(maxY, window.g.Y));
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
