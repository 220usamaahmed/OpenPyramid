class Pyramid {

	constructor(DZIAttributes, windowWidth, windowHeight) {
		this.attributes = DZIAttributes;
		this.windowWidth = windowWidth;
		this.windowHeight = windowHeight;
		this.level0LayerIndex = null;

		this.windowDX = 0; // Top left
		this.windowDY = 0; // Top Right
		this.windowDZ = 0; // Zoom Level
		this.currentLayerIndex = null;

		this.initializeLayers();
	}

	initializeLayers() {
		this.layers = [];

		let width = this.attributes.width;
		let height = this.attributes.height;
		let tileSize = this.attributes.tileSize;
		let overlap = this.attributes.overlap;

		while (width > 1 || height > 1) {
			this.layers.push(new Layer(width, height, tileSize, overlap, windowWidth, windowHeight));

			if (width <= this.windowWidth && height <= this.windowHeight && this.level0LayerIndex == null)
				this.level0LayerIndex = this.layers.length;

			width = ceil(width / 2);
			height = ceil(height / 2);
		}
		this.layers.push(new Layer(width, height, tileSize, overlap, windowWidth, windowHeight));

		this.layers.reverse();
		this.level0LayerIndex = this.layers.length - this.level0LayerIndex;

		this.currentLayerIndex = this.level0LayerIndex;
		
		this.windowDX = (this.windowWidth - this.layers[this.currentLayerIndex].width) / 2;
		this.windowDY = (this.windowHeight - this.layers[this.currentLayerIndex].height) / 2;
	}

	translate(dx, dy) {

	}

	zoom(dz) {

	}

	display() {
		this.layers[this.currentLayerIndex].display(this.windowDX, this.windowDY, this.windowDZ)
	}

}