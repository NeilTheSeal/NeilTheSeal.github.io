/* ******************************** */
//	P5js
/* ******************************** */

let myWidth;
let myHeight;
let isTouchDevice = false;
let backColor = 50;

/* ******************************** */
// SETUP 

function setup() {

	myWidth = windowWidth;
	myHeight = 1200;
  
  // store the canvas in a pointer variable
	// now its methods can be accessed
	let myCanvas = createCanvas(myWidth, myHeight);
	
  // adding canvas as a child of a container
  myCanvas.parent('main-content-container');
	background(backColor);
	noStroke();
}

function windowResized() {
	myWidth = windowWidth;
	myHeight = 1200;
  resizeCanvas(myWidth, myHeight);
}

/* ******************************** */
//detect if it is a touch device
function touchStarted() {
	isTouchDevice = true;
}
function mousePressed() {
	isTouchDevice = false;
}
function mouseMoved() {
	isTouchDevice = false;
}

/* ******************************** */
// DRAW

function draw() {
 
  // let gridSize = myWidth/32; // shape size depends on width
  let gridSize = 50; // shape size absulute size
  let backOpacity = 35; // affects dot fade time
  background(backColor, backOpacity);

	for (let i = 0; i < myWidth; i+= gridSize) {
		for (let j = 0; j < myHeight; j += gridSize) {
			if(j != 0) {
				let myShape = new Shape(i,j, gridSize); 
				myShape.display(isTouchDevice);
			}
		}
	}
}

/* ******************************** */
// DOT CLASS

function Shape(i,j, gSize) {	
	const MIN_SIZE = 5; 
	const MAX_SIZE = gSize;
	
  this.dotX = i + MAX_SIZE/2; 
	this.dotY = j + MAX_SIZE/2;
	
	let distFromMouse = sqrt( sq(abs(this.dotX - mouseX)) + sq(abs(this.dotY - mouseY)) );
	let distFromTouch = sqrt( sq(abs(this.dotX - mouseX)) + sq(abs(this.dotY - mouseY)) );
	
	let dotSizeM = MIN_SIZE + (MAX_SIZE / (1 + (distFromMouse / gSize)) );
	let dotSizeT = MIN_SIZE + (MAX_SIZE / (1 + (distFromTouch / gSize)) );

	this.display = function (isTouch) {
      let dotCol = 235; // default dot color
      let dotColPress = 255; // dot color when click / tap
      let dist = gSize * 2; // dots under this distance from mouse will be displayed larger
    
      if (!isTouch) {
        if ( mouseIsPressed && distFromMouse < dist ) {
          fill(dotColPress);
          ellipse(this.dotX, this.dotY, dotSizeM, dotSizeM);
        } else if (distFromMouse < dist) {
          fill(dotCol);
				  ellipse(this.dotX, this.dotY, dotSizeM, dotSizeM);
        } else {
          fill(dotCol);
				  ellipse(this.dotX, this.dotY, MIN_SIZE, MIN_SIZE);
        }
      
      } else if (isTouch) {
        if ( touchIsDown && distFromTouch < dist ) {
				  fill(dotColPress);
				  ellipse(this.dotX, this.dotY, dotSizeT, dotSizeT);
        } else {
          fill(dotCol);
				  ellipse(this.dotX, this.dotY, dotSizeT, dotSizeT);
        } 
      }
   
	}
}