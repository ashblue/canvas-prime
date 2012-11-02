(function (cp) {
    /** @type {number} Declares sizes for different states of the buildings */
    var HEIGHT_DEFAULT = 140;
    var HEIGHT_DAMAGED = 96;
    var HEIGHT_VERY_DAMAGED = 68;

    /** @type {number} Tracks current number of existing buildings */
    var _buildingCount = 0;

    var _private = {
        /**
         * Retrieves the proper animation based upon remaining hp
         * @param {number} hp Current health of a building
         * @returns {string} Current animation name
         */
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

        /**
         * Determines the offset of the building based upo its current hp
         * @param {number} hp Current health of a building
         * @returns {number} New building y offset
         */
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

        /**
         * Determine height of the building based upon hp
         * @param {number} hp Current health of a building
         * @returns {number} New height
         */
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

        /**
         * Calculates y of a building based upon its current height (relative
         * to the Canvas viweport size)
         * @param {number} height Height of the building
         * @requires {number} Calculated height
         */
        getY: function (height) {
            return cp.core.canvasHeight - height;
        }
    };

    /** @type {class} Basic building element that the player must defend */
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

            // Determine wheterh the building should be destroyed or swap its animation
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

            // No buildings left? End the game
            if (_buildingCount === 0) {
                cp.game.entityGetVal('name', 'hud')[0].setText('Game Over');
                cp.input.unbind();
            }

            this._super();
        }
    });
}(cp));