const DZI_URL = "http://127.0.0.1:5000/slide/dzi";

let pyramid = null;

function loadDZIXML(callback) {
	/*
	Makes a call to the server to recive DZI XML.
	Takes a callback to call when data has been received.
	Returns a dictionary of the DZI attributes.

	NOTE: There is no error handling done for the http
	request being made.
	*/

	let myXML = "";
	let request = new XMLHttpRequest();
	request.open("GET", DZI_URL, true);
	request.onreadystatechange = function(){
		if (request.readyState == 4) {
			if (request.status == 200 || request.status == 0) {
				myXML = request.responseXML;

				attributes = {
					"width": parseInt(myXML.getElementsByTagName("Image")[0].children[0].attributes[0].value),
					"height": parseInt(myXML.getElementsByTagName("Image")[0].children[0].attributes[1].value),
					"tileSize": parseInt(myXML.getElementsByTagName("Image")[0].attributes[1].value),
					"overlap": parseInt(myXML.getElementsByTagName("Image")[0].attributes[2].value),
					"format": myXML.getElementsByTagName("Image")[0].attributes[3].value,
				};

				callback(attributes);
			}
		}
	}
	request.send();

}

function initializeDZI(attributes) {
	pyramid = new Pyramid(attributes, width, height);
}

function setup() {
	createCanvas(1024, 800);
	loadDZIXML(initializeDZI);
}

function windowResized() {
	// resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(27, 27, 37);

	pyramid.display();
	noLoop();

}