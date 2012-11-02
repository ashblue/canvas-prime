(function (cp) {
    /** @type {number} Current score */
    var _score = 0;

    /** @type {string} Introduction message */
    var _textCurrent = 'Click to shoot, click again to explode';

    /** @type {number} Cached value of centered text */
    var _textCenterX = null;
    var _textCenterY = null;

    var _private = {
        /**
         * Binds DOM logic
         */
        bind: function () {
            cp.ctx.canvas.addEventListener('click', _events.clickCanvas);
        },

        /**
         * Unbinds all DOM logic
         */
        unbind: function () {
            cp.ctx.canvas.removeEventListener('click', _events.clickCanvas);
        }
    };

    var _events = {
        /**
         * Boots up the game on mouse click
         */
        clickCanvas: function () {
            // Create buildings
            cp.game.spawn('Building', 20);
            cp.game.spawn('Building', 165);
            cp.game.spawn('Building', 410);
            cp.game.spawn('Building', 555);

            // Create player
            cp.game.spawn('PlayerCannon');
            cp.game.spawn('PlayerTank');

            // Create enemies
            cp.game.spawn('SpawnCrates');

            // Add a cursor icon
            cp.ctx.canvas.style.cursor = 'crosshair';

            // Remove start screen residue
            _textCurrent = null;
            _private.unbind();
        }
    };

    cp.template.Hud = cp.template.Entity.extend({
        name: 'hud',

        init: function () {
            _private.bind();

            _textCenterX = cp.core.canvasWidth / 2;
            _textCenterY = cp.core.canvasHeight / 2;
        },

        draw: function () {
            // Draw background
            cp.ctx.fillStyle = '#29ABE2';
            cp.ctx.fillRect(0, 0, cp.core.canvasWidth, cp.core.canvasHeight);

            // Draw message text if available
            cp.ctx.fillStyle = '#111';
            if (_textCurrent) {
                cp.ctx.textAlign = 'center';
                cp.ctx.textBaseline = 'middle';
                cp.ctx.font = '40px helvetica, arial';
                cp.ctx.fillText(_textCurrent, _textCenterX, _textCenterY);
            }

            // Draw score text
            cp.ctx.textAlign = 'left';
            cp.ctx.textBaseline = 'top';
            cp.ctx.font = '12px helvetica, arial';
            cp.ctx.fillText('Score: ' + _score, 5, 5);
        },

        setText: function (text) {
            _textCurrent = text;
            return this;
        },

        setScore: function (points) {
            _score += 1;
            return this;
        }
    });

}(cp));