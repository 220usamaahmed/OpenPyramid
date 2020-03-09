class OpenPyramid {
    
    /**
     * The constructor does 3 things:
     * 1. Initialzes the canvas element.
     * 2. Initialzes the DeepZoomImage object.
     * 3. Once the DeepZoomObject has been initialzed it adds the event handlers
     * 	  and calls the draw function.
     * 
     * @param {Dictionary} config The config settings for displaying the DZI
     */
    constructor(config) {
        this.config = config;

        // Initializing Canvas
        this.canvasHolder = document.getElementById(config.canvasHolderID);
        let canvas = document.createElement("canvas");
        canvas.width = this.canvasHolder.clientWidth;
        canvas.height = this.canvasHolder.clientHeight;
        this.canvasHolder.appendChild(canvas);
        this.c = canvas.getContext("2d");
        
        this.mouseDown = false;

        // Initializing DeepZoomImage
        DeepZoomImage.initialize(config.url, canvas.width, canvas.height).then(dzi => {
            this.dzi = dzi;

            let that = this;

            // Event handling for canvas
            canvas.addEventListener("wheel", function(event) {
                that.dzi.handleZoom(Math.round(event.deltaY / 100));
                that.draw();
                
                return false;
            }, false);

            canvas.addEventListener("mousedown", function(event) {
                that.translationStartX = event.clientX;
                that.translationStartY = event.clientY;
                that.mouseDown = true;
            });

            canvas.addEventListener("mouseup", function(event) {
                that.mouseDown = false;
            });

            canvas.addEventListener("mousemove", function(event) {
                if (that.mouseDown) {
                    let translationX = event.clientX - that.translationStartX;
                    let translationY = event.clientY - that.translationStartY;
                    
                    that.dzi.handleTranslation(translationX, translationY);
                    
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
     * @returns {Object} Canvas Holder Div
     */
    getCanvasHolder() {
        return this.canvasHolder;
    }

    /**
     * Translate based on pixel values on the canvas
     * 
     * @param {Number} dx The number of pixels to shift in the x-axis
     * @param {Number} dy The number of pixels to shift in the y-axis
     */
    translate(dx, dy) {
        this.dzi.handleTranslation(dx, dy);
        this.draw();
    }

    /**
     * @param {Number} dz The amout to zoom in. A value of 1 will zoom in one layer
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

}
