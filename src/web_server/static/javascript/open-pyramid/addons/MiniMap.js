class MiniMap extends Addon {

    initialize(op) {
        
        super.initialize(op);

        let level = 0;
        while (level + 1 < op.getLayerCount() 
            && op.getLayer(level + 1).tileCountX == 1 
            && op.getLayer(level + 1).tileCountY == 1)
            level++;

        this.minimap = document.createElement("div");
        this.minimap.classList.add("op-minimap");

        this.minimapImage = document.createElement("img");
        this.minimapImage.src = "/slide/" + level + "/0_0.jpeg";
        if (op.getLayer(level).width > op.getLayer(level).height) { 
            this.minimapImage.width = 196;
            this.minimapImage.height = 196 * op.getLayer(level).height / op.getLayer(level).width;
        }
        else this.minimapImage.height = 128;

        this.minimap.appendChild(this.minimapImage);

        this.viewerBox = document.createElement("div");
        this.viewerBox.classList.add("viewer-box");
        this.updateViewerBox();

        this.minimap.appendChild(this.viewerBox);

        op.getCanvasHolder().appendChild(this.minimap);

    }

    onTranslation(dx, dy) {
        this.updateViewerBox();
    }

    onZoom(dz) {
        this.updateViewerBox();
    }

    updateViewerBox() {
        // this.op.getDZICanvasX(), this.op.getDZICanvasY()

        let layerWidth = this.op.getDisplayedLayerWidth();
        let layerHeight = this.op.getDisplayedLayerHeight();
        let canvasWidth = this.op.getCanvasWidth();
        let canvasHeight = this.op.getCanvasHeight();

        let left = this.op.getDZICanvasX() > 0 ? 0 : -this.op.getDZICanvasX() * this.minimapImage.width / layerWidth;
        let top = this.op.getDZICanvasY() > 0 ? 0 : -this.op.getDZICanvasY() * this.minimapImage.height / layerHeight;
        let right = this.op.getDZICanvasX() + layerWidth;
        let bottom = this.op.getDZICanvasY() + layerHeight;
        
        let width = right < canvasWidth ? this.minimapImage.width : this.minimapImage.width - (right - canvasWidth) * this.minimapImage.width / layerWidth;
        let height = bottom < canvasHeight ? this.minimapImage.height : this.minimapImage.height - (bottom - canvasHeight) * this.minimapImage.height / layerHeight;
        
        this.viewerBox.style.left = left + "px";
        this.viewerBox.style.top = top + "px";
        this.viewerBox.style.width = (width - left - 4) + "px";
        this.viewerBox.style.height = (height - top - 4) + "px";

        // this.minimapImage.height is 0 for some reason????
        console.log(bottom, canvasHeight, height, this.minimapImage.height, this.viewerBox.style.height);

    }

}