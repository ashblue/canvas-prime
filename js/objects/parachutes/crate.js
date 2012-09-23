(function (cp) {
    var HUD = null;

    var SIZE = 46;

    var _spawnDelay = 3;

    cp.template.Crate = cp.template.Entity.extend({
        type: 'b',
        y: -SIZE,
        width: SIZE,
        height: SIZE,

        init: function () {
            this.x = cp.math.random(0, cp.core.canvasWidth - SIZE);


        },

        update: function () {
            this.y += 1;

            if (this.y > cp.core.canvasHeight) {
                this.kill();
            }
        },

        draw: function () {
            cp.ctx.fillStyle = '#000';
            cp.ctx.fillRect(this.x, this.y, this.width, this.height);
        },

        collide: function (object) {
            this.kill();

            // Increment score
            if (HUD) {
                HUD.setScore(1);
            } else {
                HUD = cp.game.entityGetVal('name', 'hud')[0];
                HUD.setScore(1);
            }
        }
    });

    cp.template.SpawnCrates = cp.template.Entity.extend({
        init: function () {
            this.spawnDelay = new cp.timer(_spawnDelay);
        },

        update: function () {
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