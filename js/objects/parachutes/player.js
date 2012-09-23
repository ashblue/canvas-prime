(function (cp) {
    _axisBottomCenter = null;

    _firing = false;

    _private = {

    };

    cp.template.Player = cp.template.Entity.extend({
        width: 10,
        height: 68,

        init: function () {
            // Create and set animation
            var animSheet = new cp.animate.sheet('cannon.png', this.width, this.height);
            this.animCannon = new cp.animate.cycle(animSheet, 1, [0]);
            this.animSet = this.animCannon;

            // Determine player location
            this.x = (cp.core.canvasWidth - this.width) / 2;
            this.y = cp.core.canvasHeight - this.height;

            // Determine center axis
            _axisBottomCenter = {
                x: this.x + (this.width / 2),
                y: cp.core.canvasHeight
            };

            // Provide center axis for rotating image
            this.angleAxis = {
                x: _axisBottomCenter.x,
                y: _axisBottomCenter.y
            };

            // Bind ability to shoot
            cp.input.bind('clickLeft', 'fire');
        },

        update: function () {
            this._super();

            this.angle = -cp.math.radiansToDegrees(cp.math.angleBetweenPoints(_axisBottomCenter, cp.input.mouse)) + 90;

            if (cp.input.down('fire') && !_firing) {
                cp.game.spawn('Bullet', this.angle);
                _firing = true;
            }
        }
    });

    cp.template.Bullet = cp.template.Entity.extend({
        speed: 5,
        width: 5,
        height: 5,

        init: function (angle) {
            // Discover spawn location
            this.moveAngle = angle - 180;
            this.x = _axisBottomCenter.x;
            this.y = _axisBottomCenter.y;

            // Generate explosion delay
            this.delay = new cp.timer(.2);
        },

        update: function () {
            var newCoords = cp.math.movePointAtAngle(this, this.moveAngle, this.speed);
            this.x = newCoords.x;
            this.y = newCoords.y;

            if (this.x < 0 ||
            this.y < 0 ||
            this.x > cp.core.canvasWidth ||
            this.y > cp.core.canvasHeight) {
                this.kill();
            } else if (cp.input.down('fire') && this.delay.expire()) {
                this.collide();
            }
        },

        collide: function () {
            cp.game.spawn('Explosion', this.x, this.y);
            this.kill();
        },

        kill: function () {
            _firing = false;
            this._super();
        }
    });

    cp.template.Explosion = cp.template.Entity.extend({
        type: 'a',
        speed: 2,

        init: function (x, y) {
            this.x = x;
            this.y = y;

            // Lifespan of the explosion
            this.lifespan = new cp.timer(1.5);
        },

        update: function () {
            // expand from the center
            if (!this.lifespan.expire()) {
                this.x -= (this.speed / 2);
                this.y -= (this.speed / 2);
                this.width += this.speed;
                this.height += this.speed;
            } else {
                this.kill();
            }
        },

        draw: function () {
            cp.ctx.globalAlpha = 0.5;
            cp.ctx.fillStyle = '#f00';
            cp.ctx.fillRect(this.x, this.y, this.width, this.height);
            cp.ctx.globalAlpha = 1;
        },

        collide: function (obj) {
            obj.kill();
        }
    });
}(cp));