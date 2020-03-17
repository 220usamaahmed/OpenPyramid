class OpenPyramid {
    
    /**
     * The constructor does 3 things:
     * 1. Initialzes the canvas element.
     * 2. Initialzes the DeepZoomImage object.
     * 3. Once the DeepZoomObject has been initialzed it initializes the addons, 
     *    adds the event handlers and calls the draw function.
     * 
     * @param {Dictionary} config The config settings for displaying the DZI
     */
    constructor(config) {
        this.config = config;

        // Initializing Canvas
        this.canvasHolder = document.getElementById(config.canvasHolderID);
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvasHolder.clientWidth;
        this.canvas.height = this.canvasHolder.clientHeight;
        this.canvasHolder.appendChild(this.canvas);
        this.c = this.canvas.getContext("2d");
        
        this.mouseDown = false;

        // Initializing DeepZoomImage
        DeepZoomImage.initialize(config.url, this.canvas.width, this.canvas.height).then(dzi => {
            this.dzi = dzi;

            // Initializing addons
            for (let i = 0; i < config.addons.length; i++) config.addons[i].initialize(this);

            let that = this;

            // Event handling for canvas
            this.canvas.addEventListener("wheel", function(event) {
                
                that.dzi.handleZoom(Math.round(event.deltaY / 100));
                
                for (let i = 0; i < config.addons.length; i++) config.addons[i].onZoom(event.deltaY / 100);
                that.draw();
                
                return false;
            }, false);

            this.canvas.addEventListener("mousedown", function(event) {
                that.translationStartX = event.clientX;
                that.translationStartY = event.clientY;
                that.mouseDown = true;
            });

            this.canvas.addEventListener("mouseup", function(event) {
                that.mouseDown = false;
            });

            this.canvas.addEventListener("mousemove", function(event) {
                if (that.mouseDown) {
                    let translationX = event.clientX - that.translationStartX;
                    let translationY = event.clientY - that.translationStartY;

                    that.dzi.handleTranslation(translationX, translationY);

                    for (let i = 0; i < config.addons.length; i++) config.addons[i].onTranslation(translationX, translationY);
                    
                    that.translationStartX = event.clientX;
                    that.translationStartY = event.clientY;

                    that.draw();
                }
            });

            this.draw();
        });
    }

    /**
     * Draws a frame using the dzi object.
     */
    draw() {
        this.c.clearRect(0, 0, innerWidth, innerHeight);
        this.dzi.display(this.c);
    }

    /**
     * Translate based on pixel values on the canvas
     * 
     * @param {Number} dx Pixels to shift in the x-axis
     * @param {Number} dy Pixels to shift in the y-axis
     */
    translate(dx, dy) {
        this.dzi.handleTranslation(dx, dy);
        this.draw();
    }

    /**
     * @param {Number} dz Amout to zoom in. A value of 1 will zoom in one layer
     * and and value of -1 will zoom out one layer.
     */
    zoom(dz) {
        this.dzi.handleZoom(-Math.round(dz));
        this.draw();
    }

    /**
     * Zooms in/out onto the largest layer that fits on the canvas and centers it.
     */
    resetZoomAndTranslation() {
        this.dzi.handleZoom(this.dzi.currentLayerIndex - this.dzi.largestFittingLayerIndex);
        this.dzi.centerLayers();
        this.draw();
    }

        /**
     * @returns {Object} Canvas Holder Div
     */
    getCanvasHolder() {
        return this.canvasHolder;
    }

    /**
     * @returns {Number} Number of layers in the DZI
     */
    getLayerCount() {
        return this.dzi.layers.length;
    }

    /**
     * @param {Number} level Level of zoom of which to return the layer
     * @returns {Object} Layer object
     */
    getLayer(level) {
        return this.dzi.layers[level];
    }

    /**
     * @returns {Number} Width of the layer currently displayed
     */
    getDisplayedLayerWidth() {
        return this.dzi.layers[this.dzi.currentLayerIndex].width;
    }

    /**
     * @returns {Number} Height of the layer currently displayed
     */
    getDisplayedLayerHeight() {
        return this.dzi.layers[this.dzi.currentLayerIndex].height;
    }

    /**
     * @returns {Number} Width of the canvas
     */
    getCanvasWidth() {
        return this.canvas.width;
    }

    /**
     * @returns {Number} Height of the canvas
     */
    getCanvasHeight() {
        return this.canvas.height;
    }

    /**
     * @returns {Number} X Coordinate at which the DZI begins on the canvas.
     */
    getDZICanvasX() {
        return this.dzi.getCanvasX();
    }

    /**
     * @returns {Number} Y Coordinate at which the DZI begins on the canvas
     */
    getDZICanvasY() {
        return this.dzi.getCanvasY();
    }

}
