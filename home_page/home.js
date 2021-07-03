let cnv;
let number_of_snowflakes = 80;
let snowFlakes = [];

function setup() {
  cnv = createCanvas();
  windowResized();
  for( let i = 0; i < number_of_snowflakes; i++ ) {
    snowFlakes.push(new snowFlake());
  }
}

function draw() {
  background(0);
  snowFlakes.forEach(snowFlake => {
    snowFlake.advance();
    snowFlake.draw();
  })
}

function windowResized() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  cnv.resize(width, height);
}

function snowFlake() {
  this.radiusRange = [0.5, 10];
  this.speedLimits = [0.01, 1];
  this.color = color(255, 255, 255);
  this.radius = random(this.radiusRange[0], this.radiusRange[1]);
  this.fallingSpeed = map(this.radius, this.radiusRange[0], this.radiusRange[1], this.speedLimits[0], this.speedLimits[1]);
  this.x = random(0, width);
  this.y = random(0, height);
  this.advance = function() {
    this.y += this.fallingSpeed;
    if(this.y >= height) {
      this.y = 0;
      this.x = random(0, width);
      this.radius = random(2, 10);
      this.fallingSpeed = map(this.radius, this.radiusRange[0], this.radiusRange[1], this.speedLimits[0], this.speedLimits[1]);
    }
  };
  this.draw = function() {
    push();
      fill(this.color);
      noStroke();
      circle(this.x, this.y, this.radius);
    pop();
  }
}