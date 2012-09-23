(function (cp) {
    var _debug = false;

    var _score = 0;

    var _textCurrent = 'Click To Shoot';

    var _textCenterX = cp.core.canvasWidth / 2;

    var _textCenterY = cp.core.canvasHeight / 2;

    var _private = {
        bind: function () {
            cp.ctx.canvas.addEventListener('click', _events.clickCanvas);
        },

        unbind: function () {
            cp.ctx.canvas.removeEventListener('click', _events.clickCanvas);
        }
    };

    var _events = {
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

        init: function (x) {
            if (!_debug) {
                _private.bind();
            } else {
                _events.clickCanvas();
            }
        },

        draw: function () {
            // Draw background
            cp.ctx.fillStyle = '#29ABE2';
            cp.ctx.fillRect(0, 0, cp.core.canvasWidth, cp.core.canvasHeight);

            // Draw score text
            cp.ctx.fillStyle = '#111';
            cp.ctx.textAlign = 'left';
            cp.ctx.textBaseline = 'top';
            cp.ctx.font = '12px helvetica, arial';
            cp.ctx.fillText('Score: ' + _score, 5, 5);

            // Draw message text if available
            if (_textCurrent) {
                cp.ctx.textAlign = 'center';
                cp.ctx.textBaseline = 'top';
                cp.ctx.font = '40px helvetica, arial';
                cp.ctx.fillText(_textCurrent, _textCenterX, _textCenterY);
            }
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