const canvasWidth = 1000;
const canvasHeight = 600;
const infectedColor = "rgb(255, 100, 100)";
const susceptibleColor = "rgb(0, 0, 255)";
const recoveredColor = "rgb(0, 205, 0)";

window.setup = function () {
  createCanvas(canvasWidth, canvasHeight);
  noLoop();
};

window.draw = function () {
  const data = calcAll();
  drawPlot(data);
  // adjustX(data);
};

// function adjustX(data) {
//   let acc = 0;
//   let maxT = globals.tMax;
//   data.infected.forEach((curr) => {
//     if (curr[1] > acc) {
//       acc = curr[1];
//     } else {
//       maxT = Math.min(maxT, curr[0]);
//     }
//   });

//   if (maxT === globals.tMax) {
//     globals.tMax += 100;
//   } else if (maxT < globals.tMax - 100) {
//     globals.tMax -= 100;
//   }
// }

function drawPlot(data) {
  background(250);
  const left = 140;
  const right = canvasWidth - 150;
  const top = 70;
  const bottom = canvasHeight - 80;

  const tMax = globals.tMax;
  const pMax = globals.pMax;

  drawData(data, left, right, top, bottom, tMax, pMax);
  drawAxes(left, right, top, bottom, tMax, pMax);
  drawLabel(top);
  drawLegend(data, left, right, top, bottom);
}

function drawAxes(left, right, top, bottom, tMax, pMax) {
  stroke(0);
  strokeWeight(2);
  textSize(16);
  line(left, top, left, bottom);
  line(left, bottom, right, bottom);

  const tStep = Math.round(tMax / 10);
  const pStep = Math.round(pMax / 10);

  for (let t = 0; t <= tMax; t += tStep) {
    push();

    const x = map(t, 0, tMax, left, right);
    line(x, bottom - 5, x, bottom + 5);

    noStroke();
    fill(0);
    textAlign(CENTER);

    text(t, x, bottom + 23);

    pop();
  }

  for (let p = 0; p <= pMax; p += pStep) {
    push();

    const y = map(p, 0, pMax, bottom, top);
    line(left - 5, y, left + 5, y);

    noStroke();
    fill(0);
    textAlign(RIGHT, CENTER);

    const number = (p / 1e6).toFixed(0) + "M";
    text(number, left - 15, y);

    pop();
  }

  push();
  textSize(20);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  translate(left - 90, (top + bottom) / 2);
  rotate(-HALF_PI);
  text("Number of people", 0, 0);
  pop();

  push();
  textSize(20);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  translate((left + right) / 2, bottom + 50);
  text("Number of days", 0, 0);
  pop();
}

function drawData(data, left, right, top, bottom, tMax, pMax) {
  const infected = data.infected;
  const susceptible = data.susceptible;
  const recovered = data.recovered;

  const step = Math.round(infected.length / 1000);
  strokeWeight(3);
  noFill();

  push();
  stroke(infectedColor);
  beginShape();
  for (let i = 0; i < infected.length; i += step) {
    const x = map(infected[i][0], 0, tMax, left, right);
    const y = map(infected[i][1] * pMax, 0, pMax, bottom, top);
    vertex(x, y);
  }
  endShape();
  pop();

  push();
  stroke(susceptibleColor);
  beginShape();
  for (let i = 0; i < susceptible.length; i += step) {
    const x = map(susceptible[i][0], 0, tMax, left, right);
    const y = map(susceptible[i][1] * pMax, 0, pMax, bottom, top);
    vertex(x, y);
  }
  endShape();
  pop();

  push();
  stroke(recoveredColor);
  beginShape();
  for (let i = 0; i < recovered.length; i += step) {
    const x = map(recovered[i][0], 0, tMax, left, right);
    const y = map(recovered[i][1] * pMax, 0, pMax, bottom, top);
    vertex(x, y);
  }
  endShape();
  pop();
}

function drawLabel(top) {
  push();
  noStroke();
  fill(0);
  textSize(20);
  textAlign(CENTER, BOTTOM);
  translate(canvasWidth / 2, top - 20);
  text(`Total infected: ${numberWithCommas(globals.totalInfected)}`, 0, 0);
  pop();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function drawLegend(data, left, right, top, bottom) {
  push();
  translate(right - 20, top - 60);
  stroke(0);
  strokeWeight(1);
  fill(255);
  rect(0, 0, 160, 100);
  textSize(18);
  strokeWeight(3);
  stroke(infectedColor);
  line(10, 20, 50, 20);
  noStroke();
  fill(infectedColor);
  textAlign(LEFT, CENTER);
  text("Infected", 60, 20);
  stroke(susceptibleColor);
  line(10, 50, 50, 50);
  noStroke();
  fill(susceptibleColor);
  text("Susceptible", 60, 50);
  stroke(recoveredColor);
  line(10, 80, 50, 80);
  noStroke();
  fill(recoveredColor);
  text("Recovered", 60, 80);
  pop();
}
