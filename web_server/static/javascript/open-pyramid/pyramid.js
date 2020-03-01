class Pyramid {

	constructor(DZIAttributes, windowWidth, windowHeight) {
		this.attributes = DZIAttributes;
		this.windowWidth = windowWidth;
		this.windowHeight = windowHeight;
		this.level0Layer = null;

		this.x = 0; // Top left
		this.y = 0; // Top Right
		this.z = 0; // Zoom Level

		this.initializeLayers();
	}

	initializeLayers() {
		this.layers = [];

		let width = this.attributes.width;
		let height = this.attributes.height;
		let tileSize = this.attributes.tileSize;
		let overlap = this.attributes.overlap;

		while (width > 1 || height > 1) {
			this.layers.push(new Layer(width, height, tileSize, overlap));

			if (width <= this.windowWidth && height <= this.windowHeight && this.level0Layer == null)
				this.level0Layer = this.layers.length - 1;

			width = ceil(width / 2);
			height = ceil(height / 2);
		}
		this.layers.push(new Layer(width, height, tileSize, overlap));
	}

	translate(dx, dy) {

	}

	zoom(dz) {

	}

	display() {

	}

}