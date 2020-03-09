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
        // Initializing Canvas
        let canvasHolder = document.getElementById(config.canvasHolderID);
        let canvas = document.createElement("canvas");
        canvas.width = canvasHolder.clientWidth;
        canvas.height = canvasHolder.clientHeight;
        canvasHolder.appendChild(canvas);
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

}
