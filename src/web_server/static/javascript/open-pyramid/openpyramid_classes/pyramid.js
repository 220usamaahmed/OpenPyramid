/*
 * NOTE:
 * The initialize method needs error handling
 * _____________________________________________________________________________
 */

class Pyramid {

	static async initialize(DZI_URL, canvasWidth, canvasHeight) {
		let attributes_url = DZI_URL + "/dzi";
		return await fetch(attributes_url)
			.then(response => response.text())
			.then(xmlString => new DOMParser().parseFromString(xmlString, "text/xml"))
			.then(data => {
				let attributes = {
					"width": parseInt(data.getElementsByTagName("Image")[0].children[0].attributes[0].value),
					"height": parseInt(data.getElementsByTagName("Image")[0].children[0].attributes[1].value),
					"tileSize": parseInt(data.getElementsByTagName("Image")[0].attributes[1].value),
					"overlap": parseInt(data.getElementsByTagName("Image")[0].attributes[2].value),
					"format": data.getElementsByTagName("Image")[0].attributes[3].value,
				};

				return new Pyramid(attributes, canvasWidth, canvasHeight);

			});
	}

	constructor(DZI_attributes, canvasWidth, canvasHeight) {
		this.attributes = DZI_attributes;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.globalDX = 0;
		this.globalDY = 0;
		this.currentLayerIndex = 0;
		this.tileSize = DZI_attributes.tileSize;
		this.initializeLayers(canvasWidth, canvasHeight);
	}

	initializeLayers(canvasWidth, canvasHeight) {
		// Calculating layer dimensions
		let width = this.attributes.width;
		let height = this.attributes.height;
		let dimensions = [];
		while (width > 1 || height > 1) {
			dimensions.push([width, height]);
			width = Math.ceil(width / 2);
			height = Math.ceil(height / 2);
		}
		dimensions.push([width, height]);
		dimensions.reverse();

		// Initializing Layers
		let tileSize = this.attributes.tileSize;
		let overlap = this.attributes.overlap;

		this.layers = [];

		for (let i = 0; i < dimensions.length; i++) {
			// this.layers.push(new Layer(i, dimensions[i][0], dimensions[i][1], tileSize, overlap, canvasWidth, canvasHeight));		
		// for (let dimension in dimensions) {
			this.layers.push({
				width: dimensions[i][0],
				height: dimensions[i][1],
				tileCountX: Math.ceil(dimensions[i][0] / tileSize),
				tileCountY: Math.ceil(dimensions[i][1] / tileSize),
				rX: dimensions[i][0] / canvasWidth,
				rY: dimensions[i][1] / canvasHeight,
				images: {}
			});
			if (dimensions[i][0] <= canvasWidth && dimensions[i][1] <= canvasHeight) this.currentLayerIndex = i;
		}

		// Centering Layers
		this.globalDX = (canvasWidth - this.layers[this.currentLayerIndex].width) / (2 * this.layers[this.currentLayerIndex].rX);
		this.globalDY = (canvasHeight - this.layers[this.currentLayerIndex].height) / (2 * this.layers[this.currentLayerIndex].rY);
	}

	display(c) {
		// this.layers[this.currentLayerIndex].display(c, this.globalDX, this.globalDY);

		// Is this just reference to the object or creates new copy??
		let layer = this.layers[this.currentLayerIndex];

		let tileXIndex = (this.globalDX < 0) ? Math.floor(-this.globalDX * layer.rX / this.attributes.tileSize) : 0; 
		let x = (this.globalDX < 0) ? (this.globalDX * layer.rX) % this.attributes.tileSize : this.globalDX * layer.rX;

		while (tileXIndex < layer.tileCountX && x < this.canvasWidth) {

			
			let tileYIndex = (this.globalDY < 0) ? Math.floor(-this.globalDY * layer.rY / this.attributes.tileSize) : 0;
			let y = (this.globalDY < 0) ? (this.globalDY * layer.rY) % this.attributes.tileSize : this.globalDY * layer.rY;

			while (tileYIndex < layer.tileCountY && y < this.canvasHeight) {

				//

				let url = "/slide/" + this.currentLayerIndex + "/" + tileXIndex + "_" + tileYIndex + ".jpeg";
				if (url in layer.images) {
					if (layer.images[url] != null) c.drawImage(layer.images[url], x, y);
				}
				else {
					layer.images[url] = null;

					// This loadImage belongs to p5?

					let img = new Image();	
					img.src = url;

					// Hack
					let self = this;

					img.onload = function() {
						layer.images[url] = img;
						self.display(c);
					}

				}

				//

				y += this.tileSize;
				tileYIndex++;
			}
			x += this.tileSize;
			tileXIndex++;
		}
	}

	handleTranslation(dx, dy) {
		this.globalDX += dx / this.layers[this.currentLayerIndex].rX;
		this.globalDY += dy / this.layers[this.currentLayerIndex].rY;
	}

	handleZoom(dz) {
		let previousLayerWidth = this.layers[this.currentLayerIndex].width;
		let previousLayerHeight = this.layers[this.currentLayerIndex].height;
		let previousLayerRx = this.layers[this.currentLayerIndex].rX;
		let previousLayerRy = this.layers[this.currentLayerIndex].rY;

		this.currentLayerIndex -= dz;

		if (this.currentLayerIndex < 0) {
			this.currentLayerIndex = 0;
			return;
		} else if (this.currentLayerIndex >= this.layers.length) {
			this.currentLayerIndex = this.layers.length - 1;
			return;
		}
	
		this.globalDX += (previousLayerWidth - this.layers[this.currentLayerIndex].width) / (2 * (previousLayerRx - this.layers[this.currentLayerIndex].rX))**2;
		this.globalDY += (previousLayerHeight - this.layers[this.currentLayerIndex].height) / (2 * (previousLayerRy - this.layers[this.currentLayerIndex].rY))**2;

		console.log("Current Layer: " + this.currentLayerIndex + ": " + this.layers[this.currentLayerIndex].width + "x" + this.layers[this.currentLayerIndex].height);
	}
}