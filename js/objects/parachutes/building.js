(function (cp) {
    var _private = {
        shrinkBuilding: function (height) {
            return height - 20;
        },

        setHeight: function (height) {
            return cp.core.canvasHeight - height;
        }
    };

    cp.template.Building = cp.template.Entity.extend({
        type: 'a',
        width: 125,
        height: 140,
        hp: 3,

        init: function (x) {
            this.x = x;
            this.y = _private.setHeight(this.height);
        },

        draw: function () {
            cp.ctx.fillStyle = '#000';
            cp.ctx.fillRect(this.x, this.y, this.width, this.height);
        },

        collide: function (object) {
            this.hp -= 1;

            if (this.hp < 1) {
                this.kill();
            } else {
                this.height = _private.shrinkBuilding(this.height);
                this.y = _private.setHeight(this.height);
            }
        }
    });
}(cp));