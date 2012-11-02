/**
 * Logic for controlling the game's camera.
 * @author Ash Blue
 */

var cp = cp || {};

(function (cp) {
    cp.camera = {
        /** @type {number} X position of the camera form the top left */
        x: 0,

        /** @type {number} Y position of the camera form the top left */
        y: 0,

        /**
         * Offset to clip visible items so you can better control what does
         * and doesn't get drawn.
         * @type {number} Number of pixels to offset the drawn items at each of
         * the four corners. Positive numbers will yeild a larger drawing area,
         * while a negative offset will shrink it.
         * @todo Not currently integrated yet.
         */
        visibleOffset: 50,

        //
        /**
         * Verifies the camera can see the item before drawing.
         * @param {number} x Current x coordinate of the tested object.
         * @param {number} y Current y coordinate of the tested object.
         * @param {number} width Current width of the tested object.
         * @param {number} height Current height of the tested object.
         * @returns {boolean} False if it isn't visible, true if it is.
         */
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

        /**
         * Sets the current position of the camera outside of the camera object.
         * @param {number} x Position x of the camera from the top left.
         * @param {number} y Position y of the camrae form the top left.
         * @returns {self}
         */
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;

            return this;
        },

        /**
         * Sets and saves the translation through a standardized method, then
         * clears Canvas drawing area only in the current viewport.
         * @returns {undefined}
         */
        setViewport: function () {
            cp.ctx.save();
            cp.ctx.translate(-this.x, -this.y);
            cp.ctx.clearRect(this.x, this.y, cp.core.canvasWidth, cp.core.canvasHeight);

            return;
        },

        /**
         * Restores the viewport to the previous state.
         * @returns {undefined}
         */
        restoreViewport: function () {
            cp.ctx.restore();

            return;
        }
    };
}(cp));