cp.template.Player = cp.template.Entity.extend({
    type: 'a',
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    color: 'red',

    init: function () {
        cp.input.bind('arrowLeft', 'left');
        cp.input.bind('arrowRight', 'right');
        cp.input.bind('arrowUp', 'up');
        cp.input.bind('arrowDown', 'down');

        this.x = (cp.core.canvasWidth - this.width) / 2;
        this.y = (cp.core.canvasHeight - this.height) / 2;
    },

    update: function () {
        if (cp.input.press('left')) {
            this.x -= 1;
        } else if (cp.input.press('right')) {
            this.x += 1;
        }

        if (cp.input.press('up')) {
            this.y -= 1;
        } else if (cp.input.press('down')) {
            this.y += 1;
        }

        cp.camera.setPosition(this.x - ((cp.core.canvasWidth - this.width) / 2), this.y - ((cp.core.canvasHeight - this.height) / 2));
    },

    draw: function () {
        cp.ctx.fillStyle = this.color;
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});

cp.template.Objects = cp.template.Entity.extend({
    storage: null,
    width: 8,
    height: 8,
    entityCount: 50,
    color: 'lightblue',

    init: function () {
        this.storage = [];

        var x, y;
        for (var i = this.entityCount; i--;) {
            x = cp.math.random(0, cp.core.canvasWidth);
            y = cp.math.random(0, cp.core.canvasHeight);
            this.storage.push(this.point(x, y));
        }
    },

    // Create an x and y point
    point: function (x, y) {
        return {
            x: x,
            y: y,
            text: x + ', ' + y
        };
    },

    draw: function () {
        // Draw all entities in storage
        for (var i = this.storage.length; i--;) {
            // Draw text
            cp.ctx.font = '10px Arial';
            cp.ctx.fillStyle = '#000';
            cp.ctx.fillText(this.storage[i].x + ', ' + this.storage[i].y, this.storage[i].x, this.storage[i].y - 5);

            // Draw shape
            cp.ctx.fillStyle = this.color;
            cp.ctx.fillRect(this.storage[i].x, this.storage[i].y, this.width, this.height);
        }
    }
});