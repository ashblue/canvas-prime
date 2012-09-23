(function (cp) {
    /** @type {object} Reference to the existing Hud object in the loop */
    var HUD = null;

    /** @type {number} Size of each crate (width and height) */
    var SIZE = 46;

    /** @type {number} Delay in seconds between spawning each crate */
    var _spawnDelay = 3;

    /** @type {class} Basic default enemy */
    cp.template.Crate = cp.template.Entity.extend({
        type: 'b',
        y: -SIZE,
        width: SIZE,
        height: SIZE,
        offsetX: -24,
        offsetY: -60,

        init: function () {
            // Calcuate location
            this.x = cp.math.random(0, cp.core.canvasWidth - SIZE);

            // Setup animation
            this.animSheet = new cp.animate.sheet('crate.png', 90, 102);
            this.stillCrate = new cp.animate.cycle(this.animSheet, 1, [0]);
            this.animSet = this.stillCrate;
        },

        update: function () {
            this._super();

            // Push crate down the screen slowly
            this.y += 1;

            // Outside of the screen? Destroy the crate
            if (this.y > cp.core.canvasHeight + this.animSheet.frameH) {
                this.kill();
            }
        },

        collide: function (object) {
            this.kill();

            // Increment score and/or cache the HUD object
            if (HUD) {
                HUD.setScore(1);
            } else {
                HUD = cp.game.entityGetVal('name', 'hud')[0];
                HUD.setScore(1);
            }
        }
    });

    /** @type {class} Crate spawning object */
    cp.template.SpawnCrates = cp.template.Entity.extend({
        init: function () {
            // Delay between spawning crates
            this.spawnDelay = new cp.timer(_spawnDelay);
        },

        update: function () {
            // If delay has expired, spawn a crate and decrement delay time
            if (this.spawnDelay.expire()) {
                cp.game.spawn('Crate');

                _spawnDelay = _spawnDelay > 1 ?  _spawnDelay - 0.05 : 1;
                this.spawnDelay.set(_spawnDelay);
                this.spawnDelay.reset();
            }
        },

        // Emptied to prevent animation firing
        draw: function () {}
    });
}(cp));