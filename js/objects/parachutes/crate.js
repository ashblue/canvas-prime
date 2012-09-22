(function (cp) {
    var SIZE = 46;

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
        }
    });

    cp.template.SpawnCrates = cp.template.Entity.extend({
        init: function () {
            this.spawnDelay = new cp.timer(1);
        },

        update: function () {
            if (this.spawnDelay.expire()) {
                cp.game.spawn('Crate');
                this.spawnDelay.reset();
            }
        },

        // Emptied to prevent animation firing
        draw: function () {}
    });
}(cp));