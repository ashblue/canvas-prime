/*
Name: Math processing
Version: 1
Desc: Contains a library of pre-built math equations, very
useful for generating random numbers and simplifying other
complex logic.
*/

var cp = cp || {};

(function (cp) {
    cp.camera = {
        x: 10,
        y: 10,
        visibleOffset: 50,

        // Verifies the camera can see the item before drawing
        visibleTest: function (x, y, width, height) {
            // Return false if outside boundaries
            if (x + width < this.x || // is object left of camera x
                y + height < this.y || // is object above camera y
                x > this.x + cp.core.canvasWidth || // is object right of camera x
                y > this.y + cp.core.canvasHeight) { // is object below camera y
                return false;
            }

            return true;
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
        },

        // Sets and saves the translation through a standardized method, then clears Canvas drawing
        setViewport: function () {
            cp.ctx.save();
            cp.ctx.translate(-this.x, -this.y);
            cp.ctx.clearRect(this.x, this.y, cp.core.canvasWidth, cp.core.canvasHeight);
        },

        restoreViewport: function () {
            cp.ctx.restore();
        }
    };
}(cp));