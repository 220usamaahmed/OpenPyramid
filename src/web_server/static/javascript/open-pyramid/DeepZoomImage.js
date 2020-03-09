class DeepZoomImage {

    /**
     * Uses the DZI_URL to fetch the attributes of the DZI in order to create
     * a new DeepZoomImage object and return it.
     * 
     * TODO: Error Handling for the request being made.
     * 
     * @param 	{String} 	DZI_URL 		The url where the DZI is placed.
     * @param 	{Number} 	canvasWidth 	The width of the canvas on which to display the DZI
     * @param 	{Number} 	canvasHeight 	The height of the canvas on which to display the DZI
     * @return 	{Promise} 					A promise which when resolved gives an DeepZoomImage object
     */
    static async initialize(DZI_URL, canvasWidth, canvasHeight) {
        let attributesURL = DZI_URL + "/dzi";
        return await fetch(attributesURL)
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

                return new DeepZoomImage(attributes, canvasWidth, canvasHeight);

            });
    }

    /**
     * @param {Dictionary} 	attributes		The attributes of the DZI
     * @param {Number} 		canvasWidth 	The width of the canvas on which to dispaly the DZI
     * @param {Number} 		canvasHeight 	The height of the canvas on which to display the DZI
     */
    constructor(attributes, canvasWidth, canvasHeight) {
        this.attributes = attributes;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.globalDX = 0;
        this.globalDY = 0;
        this.currentLayerIndex = 0;
        this.tileSize = attributes.tileSize;
        this.initializeLayers(canvasWidth, canvasHeight);
    }

    /**
     * Initialzes the layers of the DZI in an array. Each layer is a object
     * that contains the layer's attributes and a dictionary to cache tiles.
     */
    initializeLayers() {
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

        this.layers = [];

        for (let i = 0; i < dimensions.length; i++) {
            this.layers.push({
                width: dimensions[i][0],
                height: dimensions[i][1],
                tileCountX: Math.ceil(dimensions[i][0] / tileSize),
                tileCountY: Math.ceil(dimensions[i][1] / tileSize),
                rX: dimensions[i][0] / this.canvasWidth,
                rY: dimensions[i][1] / this.canvasHeight,
                images: {}
            });

            // Selecting the initial layer to display as the largest layer that fits in the canvas
            if (dimensions[i][0] <= this.canvasWidth && dimensions[i][1] <= this.canvasHeight) this.currentLayerIndex = i;
        }

        // Centering Layers
        this.globalDX = (this.canvasWidth - this.layers[this.currentLayerIndex].width) / (2 * this.layers[this.currentLayerIndex].rX);
        this.globalDY = (this.canvasHeight - this.layers[this.currentLayerIndex].height) / (2 * this.layers[this.currentLayerIndex].rY);
    }

    /**
     * Figures out which tiles need to be dispalyed based on zoom level and position.
     * If that tile is not in cache it requests it to be placed there and once the tile
     * has been loaded calls itself. If the image is in cache it displays it on the canvas.
     * @param {Canvas Context} c The 2D canvas context to draw on 
     */
    display(c) {
        let layer = this.layers[this.currentLayerIndex];

        // Where to start drawing on the x-axis and which tile to start with
        let x = (this.globalDX < 0) ? (this.globalDX * layer.rX) % this.attributes.tileSize : this.globalDX * layer.rX;
        let tileXIndex = (this.globalDX < 0) ? Math.floor(-this.globalDX * layer.rX / this.attributes.tileSize) : 0; 

        while (tileXIndex < layer.tileCountX && x < this.canvasWidth) {
            
            // Where to start drawing on the y-axis and which tile to start with
            let y = (this.globalDY < 0) ? (this.globalDY * layer.rY) % this.attributes.tileSize : this.globalDY * layer.rY;
            let tileYIndex = (this.globalDY < 0) ? Math.floor(-this.globalDY * layer.rY / this.attributes.tileSize) : 0;

            while (tileYIndex < layer.tileCountY && y < this.canvasHeight) {
                let url = "/slide/" + this.currentLayerIndex + "/" + tileXIndex + "_" + tileYIndex + ".jpeg";
                
                if (url in layer.images) {
                    if (layer.images[url] != null) c.drawImage(layer.images[url], x, y);
                }
                else {
                    layer.images[url] = null;

                    let img = new Image();	
                    img.src = url;

                    let self = this;

                    img.onload = function() {
                        layer.images[url] = img;
                        self.display(c);
                    }

                }

                y += this.tileSize;
                tileYIndex++;
            }
            x += this.tileSize;
            tileXIndex++;
        }
    }

    /**
     * Calculates how much the image has shifted based on which layer is in view
     * @param {Number} dx The amount of pixels shifted on the x-axis
     * @param {Number} dy The amount of pixels shifted on the y-axis 
     */
    handleTranslation(dx, dy) {
        this.globalDX += dx / this.layers[this.currentLayerIndex].rX;
        this.globalDY += dy / this.layers[this.currentLayerIndex].rY;
    }

    /**
     * Switches layer based on the zoom amount given and shifts the image such that
     * the content at the center of the canvas stays in place.
     * @param {Number} dz The amount zoomed 
     */
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