function solveDiff(data) {
  const dt = globals.tMax / 10000;
  for (let t = dt; t < globals.tMax; t += dt) {
    const infected = data.infected[data.infected.length - 1][1];
    const susceptible = data.susceptible[data.susceptible.length - 1][1];
    const recovered = data.recovered[data.recovered.length - 1][1];

    const beta = globals.beta;
    const gamma = globals.gamma;

    const dSdt = -1 * beta * susceptible * infected;
    const dIdt = beta * susceptible * infected - gamma * infected;
    const dRdt = gamma * infected;

    const dS = dSdt * dt;
    const dI = dIdt * dt;
    const dR = dRdt * dt;

    const nextS = [t, susceptible + dS];
    const nextI = [t, infected + dI];
    const nextR = [t, recovered + dR];

    data.susceptible.push(nextS);
    data.infected.push(nextI);
    data.recovered.push(nextR);
  }
  globals.totalInfected =
    globals.pMax -
    Math.ceil(data.susceptible[data.infected.length - 1][1] * globals.pMax) -
    Math.round(globals.initiallyImmune * globals.pMax);
}

window.calcAll = function () {
  const data = {
    infected: [[0, globals.pi]],
    susceptible: [[0, globals.p - globals.pi - globals.initiallyImmune]],
    recovered: [[0, globals.initiallyImmune]],
  };

  solveDiff(data);

  return data;
};
