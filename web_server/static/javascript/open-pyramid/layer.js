class Layer {

	constructor(width, height, tileSize, overlap, windowWidth, windowHeight) {
		this.width = width;
		this.height = height;
		this.tileSize = tileSize;
		this.overlap = overlap;
		this.rX = width / windowWidth;
		this.rY = height / windowHeight;
		if (this.rX < 1) this.rX = 1;
		if (this.rY < 1) this.rY = 1;
	}

	display(x, y, z) {
		for (let i = x; i < this.width + x; i += this.tileSize) {
			for (let j = y; j < this.height + y; j += this.tileSize) {
				// this.debuggingLabel(i, j);
			
				// Hard coding layer here, each layer should know its level
				// console.log("/slide/tile/10/" + floor(i / this.tileSize) + "_" + floor(j / this.tileSize) + ".png");
				let img = loadImage("/slide/tile/10/" + floor(i / this.tileSize) + "_" + floor(j / this.tileSize) + ".png", img => {
					image(img, i, j);
				});
			}
		}
	}

	debuggingLabel(i, j) {
		noFill();
		strokeWeight(8);
		stroke(24, 24, 30);
		rect(i, j, this.tileSize, this.tileSize);
		fill(80, 80, 128);
		noStroke();
		textSize(32);
		text(floor(i / this.tileSize) + "_" + floor(j / this.tileSize), i + 8, j + 36);
	}

}