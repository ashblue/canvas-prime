(function (cp) {
    /** @type {number} Offset of the player's cannon from the bottom of the screen */
    var AXIS_BOTTOM_OFFSET_Y = 50;

    /** @type {number} Height of a player's cannon */
    var CANNON_HEIGHT = 68;

    /** @type {object} Container for bottom axis center vertex coordinates */
    var _axisBottomCenter = null;

    /** @type {boolean} Is the player current firing? */
    var _firing = false;

    /** @type {class} Tank image of the player, does nothing other than sits there */
    cp.template.PlayerTank = cp.template.Entity.extend({
        width: 86,
        height: CANNON_HEIGHT,

        init: function () {
            // Determin location
            this.x = (cp.core.canvasWidth - this.width) / 2;
            this.y = cp.core.canvasHeight - this.height;

            // Create animation sheet
            var animSheet = new cp.animate.sheet('tank.png', this.width, this.height);
            this.animStill = new cp.animate.cycle(animSheet, 1, [0]);
            this.animSet = this.animStill;
        }
    });

    /** @type {class} Movable cannon that follows the mouse */
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

            // Calculate angle with an offset
            this.angle = -cp.math.radiansToDegrees(cp.math.angleBetweenPoints(_axisBottomCenter, cp.input.mouse)) + 90;

            // Only shoot if a bullet doesn't exist
            if (cp.input.down('fire') && !_firing) {
                cp.game.spawn('Bullet', this.angle);
                _firing = true;
            }
        }
    });

    /** @type {class} Basic bullet fired from the player's tank */
    cp.template.Bullet = cp.template.Entity.extend({
        speed: 5,
        width: 10,
        height: 10,

        init: function (angle) {
            // Setup animation
            var animSheet = new cp.animate.sheet('bullet.png', this.width, this.height);
            this.animStill = new cp.animate.cycle(animSheet, 1, [0]);
            this.animSet = this.animStill;

            // Discover spawn location
            this.moveAngle = angle - 180;
            this.x = _axisBottomCenter.x;
            this.y = _axisBottomCenter.y;

            // Determine spawn location
            var newCoords = cp.math.movePointAtAngle(this, this.moveAngle, CANNON_HEIGHT);
            this.x = newCoords.x;
            this.y = newCoords.y;

            // Generate explosion delay
            this.delay = new cp.timer(0.1);
        },

        update: function () {
            this._super();

            // Determine new location
            var newCoords = cp.math.movePointAtAngle(this, this.moveAngle, this.speed);
            this.x = newCoords.x;
            this.y = newCoords.y;

            // If outside of boundaries, kill the bullet
            if (this.x < 0 || this.y < 0 || this.x > cp.core.canvasWidth || this.y > cp.core.canvasHeight) {
                this.kill();
            } else if (cp.input.down('fire') && this.delay.expire()) {
                this.collide();
            }
        },

        collide: function () {
            // Trigger an explosion
            cp.game.spawn('Explosion', this.x, this.y);
            this.kill();
        },

        kill: function () {
            // Let the player shoot again when the bullet vanishes
            _firing = false;
            this._super();
        }
    });

    /** @type {class} Explosion triggered by a destroyed mortar shell */
    cp.template.Explosion = cp.template.Entity.extend({
        type: 'a',
        speed: 2,

        init: function (x, y) {
            // Determine location
            this.x = x;
            this.y = y;

            // Lifespan of the explosion
            this.lifespan = new cp.timer(1.5);
        },

        update: function () {
            // expand from the center if lifespan hasn't depleted
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
            // Kill any enemy object overlapped
            obj.kill();
        }
    });
}(cp));