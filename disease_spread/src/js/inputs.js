const betaSlider = document.getElementById("b-slider");
const betaValueLabel = document.getElementById("b-value");
const gammaSlider = document.getElementById("g-slider");
const gammaValueLabel = document.getElementById("g-value");
const initialPopSlider = document.getElementById("pi-slider");
const initialPopValueLabel = document.getElementById("pi-value");
const initiallyImmuneSlider = document.getElementById("ii-slider");
const initiallyImmuneValueLabel = document.getElementById("ii-value");

betaSlider.addEventListener("input", () => {
  const b = Number(betaSlider.value);
  globals.beta = b;
  betaValueLabel.innerHTML = b.toFixed(2);
  redraw();
});

gammaSlider.addEventListener("input", () => {
  const g = Number(gammaSlider.value);
  globals.gamma = g;
  gammaValueLabel.innerHTML = g.toFixed(2);
  redraw();
});

initialPopSlider.addEventListener("input", () => {
  const sliderValue = Number(initialPopSlider.value);
  let pi = 1 + Math.pow(10, sliderValue * 5);
  if (sliderValue === 0) {
    pi = 1;
  }
  globals.pi = pi / globals.pMax;
  const exp = Math.floor(Math.log10(pi));
  if (pi < 10) {
    initialPopValueLabel.innerHTML = pi.toFixed(0);
  } else {
    initialPopValueLabel.innerHTML =
      (Math.round(pi / 10 ** (exp - 1), 0.1) / 10).toFixed(1) + "e" + exp;
  }
  redraw();
});

initiallyImmuneSlider.addEventListener("input", () => {
  const sliderValue = Number(initiallyImmuneSlider.value);
  const ii = sliderValue * 1e8;
  globals.initiallyImmune = ii / globals.pMax;
  const exp = Math.floor(Math.log10(ii));
  if (ii < 10) {
    initiallyImmuneValueLabel.innerHTML = ii.toFixed(0);
  } else {
    initiallyImmuneValueLabel.innerHTML =
      (Math.round(ii / 10 ** (exp - 1), 0.1) / 10).toFixed(1) + "e" + exp;
  }
  redraw();
});
