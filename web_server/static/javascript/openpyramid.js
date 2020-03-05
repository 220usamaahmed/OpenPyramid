/*
 * NOTE:
 * Eventually discard p5.js and setup a custom system in
 * the drawing only starts after the Pyramid.initialize()
 * promise has been resolved.
 * _____________________________________________________________________________
 */

const DEMO_DZI_URL = "http://127.0.0.1:5000/slide";
 
let pyramid = null;

function setup() {
	createCanvas(1024, 800);
	Pyramid.initialize(DEMO_DZI_URL, width, height).then(p => pyramid = p);
}

function draw() {
	background(27, 27, 37);
	if (pyramid != null) { 
		pyramid.display();

		noLoop();
	}
}

function mousePressed() {
	if (mouseButton == LEFT) {
		translationStartX = mouseX;
		translationStartY = mouseY;
	}

	return false;
}

function mouseDragged() {
	if (mouseButton == LEFT) {
		let translationX = mouseX - translationStartX;
		let translationY = mouseY - translationStartY;
		if (pyramid != null) pyramid.handleTranslation(translationX, translationY);
		translationStartX = mouseX;
		translationStartY = mouseY;
		redraw();
	}

	return false;
}

function mouseWheel(event) {
	if (pyramid != null) pyramid.handleZoom(event.delta / 100);
	redraw();

	return false;
}