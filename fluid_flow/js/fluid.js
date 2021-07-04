// Fluid cube class
function Fluid(opts) {
  this.size = opts.size;
  this.dt = opts.dt;
  this.diffusion = opts.diffusion;
  this.viscosity = opts.viscosity;

  this.source = new Array((this.size + 2) * (this.size + 2)).fill(0);
  this.density = new Array((this.size + 2) * (this.size + 2)).fill(0);
  this.density0 = new Array((this.size + 2) * (this.size + 2)).fill(0);

  this.Vx = new Array((this.size + 2) * (this.size + 2)).fill(0);
  this.Vy = new Array((this.size + 2) * (this.size + 2)).fill(0);

  this.Vx0 = new Array((this.size + 2) * (this.size + 2)).fill(0);
  this.Vy0 = new Array((this.size + 2) * (this.size + 2)).fill(0);

  this.index = function (x, y) {
    return x + y * (this.size + 2)
  }

  // step method
  this.step = function () {
    this.diffuse(0);
    this.density0 = JSON.parse(JSON.stringify(this.density));
    // this.advect(0);
    // this.density0 = JSON.parse(JSON.stringify(this.density));
  }

  // method to add density
  this.addDensity = function (x, y, amount) {
    let index = this.index(x, y);
    let radius = 20;
    let minX = Math.max(0, Math.min(x - radius, this.size));
    let maxX = Math.max(0, Math.min(x + radius, this.size));
    let minY = Math.max(0, Math.min(y - radius, this.size));
    let maxY = Math.max(0, Math.min(y + radius, this.size));
    for(let i = minX; i < maxX; i++) {
      for( let j = minY; j < maxY; j++ ) {
        const index = this.index(i, j);
        this.density0[index] += amount;
      }
    }
    this.density[index] += amount;
  }

  // method to add velocity
  this.addVelocity = function (x, y, amountX, amountY) {
    let index = this.index(x, y);
    this.Vx[index] += amountX;
    this.Vy[index] += amountY;
  }

  // function to render density
  this.renderDensity = function () {
    loadPixels();
    for (let i = 1; i <= this.size; i++) {
      for (let j = 1; j <= this.size; j++) {
        const index = 4 * (j * this.size + i);
        const black = this.density[this.index(i, j)];
        pixels[index] = black;
        pixels[index + 1] = black;
        pixels[index + 2] = black;
        pixels[index + 3] = 255;
      }
    }
    updatePixels();
  }

  // function to render velocity
  this.renderVelocity = function () {
    for (let i = 1; i <= this.size; i++) {
      for (let j = 1; j <= this.size; j++) {
        let x = i * rect_size;
        let y = j * rect_size;
        let vx = this.Vx[this.index(i, j)];
        let vy = this.Vy[this.index(i, j)];

        push();
        stroke(0);
        const v_mag = Math.sqrt(vx ** 2 + vy ** 2);
        if (v_mag > 0.1) {
          line(x, y, x + vx * rect_size, y + vy * rect_size);
        }
        pop();
      }
    }
  }

  this.diffuse = function (b) {
    let diffusion_rate = this.dt * this.diffusion * this.size * this.size;
    let iterations = 10;
    for (let n = 0; n < iterations; n++) {
      for (let i = 1; i <= this.size; i++) {
        for (let j = 1; j <= this.size; j++) {
          const left = this.density0[this.index(i - 1, j)];
          const right = this.density0[this.index(i + 1, j)];
          const top = this.density0[this.index(i, j - 1)];
          const bottom = this.density0[this.index(i, j + 1)];
          this.density[this.index(i, j)] = (this.density0[this.index(i, j)] + diffusion_rate * (top + left + right + bottom) ) / (1 + 4 * diffusion_rate);
        }
      }
      this.set_bnd(b)
    }
  }

  this.advect = function (b) {

    let dt0 = this.dt * this.size;

    for (let i = 1; i < this.size; i++) {
      for (let j = 1; j < this.size; j++) {
        let x = i - dt0 * this.Vx[this.index(i, j)];
        let y = j - dt0 * this.Vy[this.index(i, j)];
        if (x < 0.5) {
          x = 0.5
        }
        if (y < 0.5) {
          y = 0.5
        }
        if (x > this.size + 0.5) {
          x = this.size + 0.5
        }
        if (y > this.size + 0.5) {
          y = this.size + 0.5
        }
        const i0 = Math.round(x);
        const i1 = i0 + 1;
        const j0 = Math.round(y);
        const j1 = j0 + 1;
        const s1 = x - i0;
        const s0 = 1 - s1;
        const t1 = y - j0;
        const t0 = 1 - t1;
        this.density[this.index(i, j)] =
          s0 * (t0 * this.density0[this.index(i0, j0)]) +
          s1 * (t0 * this.density0[this.index(i1, j0)]) +
          t1 * this.density0[this.index(i0, j1)] +
          t1 * this.density0[this.index(i1, j1)];
      }
    }
    this.set_bnd(b)
  }

  this.set_bnd = function (b) {
    for (let i = 1; i <= this.size; i++) {
      if (b === 1) {
        this.density[this.index(0, i)] = -this.density[this.index(1, i)]
        this.density[this.index(this.size + 1, i)] = -this.density[this.index(this.size, i)]
        this.density[this.index(i, 0)] = this.density[this.index(i, 1)];
        this.density[this.index(i, this.size + 1)] = this.density[this.index(i, this.size)]
      } else {
        this.density[this.index(0, i)] = this.density[this.index(1, i)]
        this.density[this.index(this.size + 1, i)] = this.density[this.index(this.size, i)]
        this.density[this.index(i, 0)] = -this.density[this.index(i, 1)];
        this.density[this.index(i, this.size + 1)] = -this.density[this.index(i, this.size)]
      }
      this.density[this.index(0, 0)] = 0.5 * (this.density[this.index(1, 0)] + this.density[this.index(0, 1)]);
      this.density[this.index(0, this.size + 1)] = 0.5 * (this.density[this.index(1, this.size + 1)] + this.density[this.index(0, this.size)]);
      this.density[this.index(this.size + 1, 0)] = 0.5 * (this.density[this.index(this.size, 0)] + this.density[this.index(this.size + 1, 1)]);
      this.density[this.index(this.size + 1, this.size + 1)] = 0.5 * (this.density[this.index(this.size, this.size + 1)] + this.density[this.index(this.size + 1, this.size)]);
    }
  }

  this.project = function (velocX, velocY, p, div) {
    for (let j = 1; j < this.size - 1; j++) {
      for (let i = 1; i < this.size - 1; i++) {
        div[this.index(i, j)] =
          (-0.5 *
            (velocX[this.index(i + 1, j)] -
              velocX[this.index(i - 1, j)] +
              velocY[this.index(i, j + 1)] -
              velocY[this.index(i, j - 1)])) /
          this.size;
        p[this.index(i, j)] = 0;
      }
    }

    set_bnd(0, div);
    set_bnd(0, p);
    lin_solve(0, p, div, 1, 6);

    for (let j = 1; j < this.size - 1; j++) {
      for (let i = 1; i < this.size - 1; i++) {
        velocX[this.index(i, j)] -= 0.5 * (p[this.index(i + 1, j)] - p[this.index(i - 1, j)]) * this.size;
        velocY[this.index(i, j)] -= 0.5 * (p[this.index(i, j + 1)] - p[this.index(i, j - 1)]) * this.size;
      }
    }

    set_bnd("x", velocX);
    set_bnd("y", velocY);
  }

}