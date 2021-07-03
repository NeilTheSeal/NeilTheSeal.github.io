let cnv;

function setup() {
  cnv = createCanvas(800, 800);
  const graphicsArea = document.getElementById("graphics-area");
  cnv.parent(graphicsArea);
  document.getElementsByTagName("main")[0].remove();
  noLoop();
}

function draw() {

}