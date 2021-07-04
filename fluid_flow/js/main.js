let fluid, cnv;

function setup() {
  let size = 300;
  cnv = createCanvas(size, size);
  cnv.id("main-canvas");
  pixelDensity(1);
  fluid = new Fluid({
    size: size,
    dt: 10,
    diffusion: 1,
    viscosity: 0.0001
  });
  frameRate(60);
  cnv.mouseClicked(() => {
    const s = fluid.size;
    const x = (mouseX / width) * s | 0;
    const y = (mouseY / height) * s | 0;
    fluid.addDensity(x, y, 255);
  })
}

function draw() {
  background(127);
  fluid.renderDensity();
  fluid.step();
}
