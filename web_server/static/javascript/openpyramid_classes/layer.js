/*
 * NOTE:
 * Moving in the negative direction the tiles are not removed properly
 * _____________________________________________________________________________
 */


class Layer {

	constructor(level, width, height, tileSize, overlap, canvasWidth, canvasHeight) {
		this.level = level;
		this.width = width;
		this.height = height;
		this.tileSize = tileSize;
		this.overlap = overlap;
		this.tileCountX = ceil(width / tileSize);
		this.tileCountY = ceil(height / tileSize);
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.rX = width / canvasWidth;
		this.rY = height / canvasHeight;
		this.images = {};
	}

	display(dx, dy) {
		let tileXIndex = (dx < 0) ? floor(-dx * this.rX / this.tileSize) : 0; 
		let x = (dx < 0) ? (dx * this.rX) % this.tileSize : dx * this.rX; // This might not be wrong

		let tilesOnDisplay = 0; // For Debugging

		while (tileXIndex < this.tileCountX && x < this.canvasWidth) {

			let tileYIndex = (dy < 0) ? floor(-dy * this.rY / this.tileSize) : 0; 
			let y = (dy < 0) ? (dy * this.rY) % this.tileSize : dy * this.rX; // This might not be wrong

			while (tileYIndex < this.tileCountY && y < this.canvasHeight) {

				this.displayDebugBoxes(x, y, tileXIndex, tileYIndex);
				this.displayTile(x, y,tileXIndex, tileYIndex);

				tilesOnDisplay++;

				y += this.tileSize;
				tileYIndex++;
			}
			x += this.tileSize;
			tileXIndex++;
		}

		console.log("Tiles on Display: " + tilesOnDisplay);
	}

	displayTile(x, y, tileXIndex, tileYIndex) {
		let url = "/slide/" + this.level + "/" + tileXIndex + "_" + tileYIndex + ".jpeg";
		if (url in this.images) image(this.images[url], x, y);
		else {
			let img = loadImage(url, img => {
				this.images[url] = img;
				image(img, x, y);
			});
		}
	}

	displayDebugBoxes(x, y, tileXIndex, tileYIndex) {
		noFill();
		stroke(24, 24, 60);
		strokeWeight(8);
		rect(x, y, this.tileSize, this.tileSize);
		noStroke();
		fill(0);
		textSize(32);
		text(tileXIndex + "_" + tileYIndex, x + 32, y + 32);
	}

}