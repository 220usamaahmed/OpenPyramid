class Toolbar {

    constructor(op) {
        
        this.toolbar = document.createElement("div");
        this.toolbar.classList.add("op-toolbar");

        this.addButton("/static/images/zoom_in-24px.svg", function() {
            op.zoom(1);
        });
        this.addButton("/static/images/zoom_out-24px.svg", function() {
            op.zoom(-1);
        });
        this.addButton("/static/images/zoom_out_map-24px.svg", function() {
            op.resetZoomAndTranslation();
        });

        op.getCanvasHolder().appendChild(this.toolbar);

    }

    /**
     * Adds a button to the toolbar
     * 
     * @param {String} icon_src Source of the icon to display on the button
     * @param {Function} onclick Callback function for onclick event
     */
    addButton(icon_src, onclick) {
        let btn = document.createElement("button");
        let btnIcon = document.createElement("img");
        btnIcon.src = icon_src;
        btn.appendChild(btnIcon);
        btn.onclick = onclick;
        this.toolbar.appendChild(btn);
    }

}