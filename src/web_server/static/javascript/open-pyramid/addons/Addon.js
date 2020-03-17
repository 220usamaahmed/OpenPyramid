class Addon {

    /**
     * 
     * @param {Object} op OpenPyramid object
     */
    initialize(op) {
        this.op = op;
    }

    /**
     * 
     * @param {Number} dx Translation in x-axis
     * @param {Number} dy Translation in y-axis 
     */
    onTranslation(dx, dy) {}

    /**
     * 
     * @param {Number} dz Change in level of zoom 
     */
    onZoom(dz) {}
    
    // TODO: Add functions for mouse and keyboard events

}