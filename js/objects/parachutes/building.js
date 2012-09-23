(function (cp) {
    var HEIGHT_DEFAULT = 140;
    var HEIGHT_DAMAGED = 96;
    var HEIGHT_VERY_DAMAGED = 68;

    var _buildingCount = 0;

    var _private = {
        getAnimation: function (hp) {
            switch (hp) {
            case 2:
                return 'animDamaged';
            case 1:
                return 'animVeryDamaged';
            default:
                return 'animStill';
            }
        },

        getOffsetY: function (hp) {
            switch (hp) {
            case 2:
                return HEIGHT_DEFAULT - HEIGHT_DAMAGED;
            case 1:
                return HEIGHT_DEFAULT - HEIGHT_VERY_DAMAGED;
            default:
                return 0;
            }
        },

        getHeight: function (hp) {
            switch (hp) {
            case 2:
                return HEIGHT_DAMAGED;
            case 1:
                return HEIGHT_VERY_DAMAGED;
            default:
                return HEIGHT_DEFAULT;
            }
        },

        getY: function (height) {
            return cp.core.canvasHeight - height;
        }
    };

    cp.template.Building = cp.template.Entity.extend({
        type: 'a',
        width: 124,
        height: HEIGHT_DEFAULT,
        hp: 3,

        init: function (x) {
            // Determine location
            this.x = x;
            this.y = _private.getY(this.height);

            // Increment the building count
            _buildingCount += 1;

            // Setup animation
            var animSheet = new cp.animate.sheet('building.png', this.width, this.height);
            this.animStill = new cp.animate.cycle(animSheet, 1, [0]);
            this.animDamaged = new cp.animate.cycle(animSheet, 0.2, [1, 2], true);
            this.animVeryDamaged = new cp.animate.cycle(animSheet, 0.2, [3, 4], true);
            this.animSet = this.animStill;
        },

        collide: function (object) {
            this.hp -= 1;

            if (this.hp < 1) {
                this.kill();
            } else {
                this.animSet = this[_private.getAnimation(this.hp)];
                this.height = _private.getHeight(this.hp);
                this.offsetY = -_private.getOffsetY(this.hp);
                this.y = _private.getY(this.height);
            }
        },

        kill: function () {
            _buildingCount -= 1;

            if (_buildingCount === 0) {
                cp.game.entityGetVal('name', 'hud')[0].setText('Game Over');
                cp.input.unbind();
            }

            this._super();
        }
    });
}(cp));