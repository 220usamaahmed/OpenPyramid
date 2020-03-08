/*
 * NOTE:
 * Eventually discard p5.js and setup a custom system in
 * the drawing only starts after the Pyramid.initialize()
 * promise has been resolved.
 * _____________________________________________________________________________
 

viewer = new OpenSeadragon({
        id: "view",
        tileSources: "{{ slide_url }}",
        prefixUrl: "{{ url_for('static', filename='images/') }}",
        showNavigator: true,
        showRotationControl: true,
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2,
        timeout: 120000,
    });

    viewer.initializeAnnotations();
    
    viewer.addHandler("open", function() {
        // To improve load times, ignore the lowest-resolution Deep Zoom
        // levels.  This is a hack: we can't configure the minLevel via
        // OpenSeadragon configuration options when the viewer is created
        // from DZI XML.
        viewer.source.minLevel = 8;
    });

    var mpp = parseFloat("{{ slide_mpp }}");
    viewer.scalebar({
        pixelsPerMeter: mpp ? (1e6 / mpp) : 0,
        xOffset: 10,
        yOffset: 10,
        barThickness: 3,
        color: '#555555',
        fontColor: '#333333',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    });
});



 */

class OpenPyramid {
	
	constructor(config) {
		// Initializing Canvas
		let canvas_holder = document.getElementById(config.canvasHolderID);
		let canvas = document.createElement("canvas");
		canvas.width = canvas_holder.clientWidth;
		canvas.height = canvas_holder.clientHeight;
		canvas_holder.appendChild(canvas);
		this.c = canvas.getContext("2d");
		this.mouseDown = false;

		// Initializing Pyramid
		Pyramid.initialize(config.url, canvas.width, canvas.height).then(pyramid => {
			this.pyramid = pyramid;

			// Hack
			let that = this;

			// Event handling for canvas
			canvas.addEventListener("wheel", function(event) {
				that.pyramid.handleZoom(event.deltaY / 100);
				that.draw();
				
				return false;
			}, false);

			canvas.addEventListener("mousedown", function(event) {
				that.translationStartX = event.clientX;
				that.translationStartY = event.clientY;
				that.mouseDown = true;

				return false;
			}, false);

			canvas.addEventListener("mouseup", function(event) {
				that.mouseDown = false;

				return false;
			}, false);

			canvas.addEventListener("mousemove", function(event) {
				if (that.mouseDown) {
					let translationX = event.clientX - that.translationStartX;
					let translationY = event.clientY - that.translationStartY;
					that.pyramid.handleTranslation(translationX, translationY);
					that.translationStartX = event.clientX;
					that.translationStartY = event.clientY;

					that.draw();
				}
			});

			this.draw();
		});


	}

	draw() {
		this.c.clearRect(0, 0, innerWidth, innerHeight);
		this.pyramid.display(this.c);
	}

}
