/*
Name: Entity creation and class storage
Version: 1
Desc: Allows users to create new entities with pre-built properties.
Also doubles as a storage container for new classes (prevents global
variable polution).

TODO: Is there a better way to handle setting and removing animations
*/

var cp = cp || {};

(function(cp) {
    // Contains all information relative to animations
    cp.template = {
        Entity: Class.extend({
            x: 0,
            y: 0,
            width: 0,
            height: 0,

            // Offsets the image from the hitbox
            offsetX: 0,
            offsetY: 0,
            offset: {
                x: 0,
                y: 0
            },

            flip: {
                x: false,
                y: false
            },

            // All elements get 1 hp by default
            hp: 1,

            // Collision detection type
            // friendly = a, enemy = b, passive = 0 (yes, its a zero and not the letter o)
            type: 0,

            // zIndex used to determine object order in the array
            zIndex: false,

            // placeholders to detect animation id change
            // Must be a -1 to be detected easily, decreases logic because there are no -1 ids ever
            animCur: {
                id: -1
            },
            animSet: {
                id: -1
            },

            // place code before each draw sequence here
            update: function() {
                this.animNew();

                // Call this._super() to continue drawing
            },

            draw: function() {
                // If an animation sheet has been set, it will fired here
                if (this.animCur.id != -1) {
                    this.animSet.crop(this);
                }

                // Output debug box
                if (cp.debug.showCollisions === true) {
                    cp.ctx.fillStyle = '#f00';
                    cp.ctx.globalAlpha = .7;
                    cp.ctx.fillRect(this.x, this.y, this.width, this.height);
                    cp.ctx.globalAlpha = 1;
                }

                // Call this._super() to continue drawing
            },

            // Passes back the collided object when a collision between two elements occurs
            collide: function(obj) {

            },

            kill: function() {
                // Push into the graveyard for removal post loop processing to
                // prevent referencing a non-existent objects.
                cp.core.graveyard.push(this);
            },

            // check if set animation has changed
            animNew: function() {
                if (this.animSet.id != this.animCur.id) {
                    // clear any running intervals to be sure they don't also fire
                    this.animCur.active = false;
                    clearInterval(this.animCur.animRun);

                    // Set animation to active
                    this.animSet.active = true;

                    // Start new interval
                    this.animSet.run();
                    this.animCur = this.animSet;
                }
            }
        })
    };
}(cp));