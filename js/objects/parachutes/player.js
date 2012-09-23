(function (cp) {
    var AXIS_BOTTOM_OFFSET_Y = 50;

    var CANNON_HEIGHT = 68;

    var _axisBottomCenter = null;

    var _firing = false;

    var _private = {

    };

    cp.template.PlayerTank = cp.template.Entity.extend({
        width: 86,
        height: CANNON_HEIGHT,

        init: function () {
            this.x = (cp.core.canvasWidth - this.width) / 2;
            this.y = cp.core.canvasHeight - this.height;

            var animSheet = new cp.animate.sheet('tank.png', this.width, this.height);
            this.animStill = new cp.animate.cycle(animSheet, 1, [0]);
            this.animSet = this.animStill;
        }
    });

    cp.template.PlayerCannon = cp.template.Entity.extend({
        width: 10,
        height: CANNON_HEIGHT,

        init: function () {
            // Create and set animation
            var animSheet = new cp.animate.sheet('cannon.png', this.width, this.height);
            this.animCannon = new cp.animate.cycle(animSheet, 1, [0]);
            this.animSet = this.animCannon;

            // Determine player location
            this.x = (cp.core.canvasWidth - this.width) / 2;
            this.y = cp.core.canvasHeight - this.height - AXIS_BOTTOM_OFFSET_Y;

            // Determine center axis
            _axisBottomCenter = {
                x: this.x + (this.width / 2),
                y: cp.core.canvasHeight - AXIS_BOTTOM_OFFSET_Y
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
        width: 10,
        height: 10,

        /**
         * @todo Put new coords into a private method shared by init and update
         */
        init: function (angle) {
            // Setup animation
            var animSheet = new cp.animate.sheet('bullet.png', this.width, this.height);
            this.animStill = new cp.animate.cycle(animSheet, 1, [0]);
            this.animSet = this.animStill;

            // Discover spawn location
            this.moveAngle = angle - 180;
            this.x = _axisBottomCenter.x;
            this.y = _axisBottomCenter.y;

            var newCoords = cp.math.movePointAtAngle(this, this.moveAngle, CANNON_HEIGHT);
            this.x = newCoords.x;
            this.y = newCoords.y;

            // Generate explosion delay
            this.delay = new cp.timer(0.1);
        },

        update: function () {
            this._super();

            var newCoords = cp.math.movePointAtAngle(this, this.moveAngle, this.speed);
            this.x = newCoords.x;
            this.y = newCoords.y;

            if (this.x < 0 || this.y < 0 || this.x > cp.core.canvasWidth || this.y > cp.core.canvasHeight) {
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
            cp.ctx.globalAlpha = 0.9;
            cp.ctx.fillStyle = '#c6b03c';
            cp.ctx.fillRect(this.x, this.y, this.width, this.height);
            cp.ctx.globalAlpha = 1;
        },

        collide: function (obj) {
            obj.kill();
        }
    });
}(cp));