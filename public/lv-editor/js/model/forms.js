define(
    [
        'controller/modal',
        'model/session'
    ],
    function (modal, session) {
        var NEW_LV_NAME = document.getElementById('new-level-name');

        var NEW_LV_TILE_PIXELS = document.getElementById('new-level-tile-size');

        var NEW_LV_TILE_HORIZONTAL = document.getElementById('new-level-tile-horizontal');

        var NEW_LV_TILE_VERTICAL = document.getElementById('new-level-tile-vertical');

        var formSubmission = {
            /**
             * @todo needs to clear out all of the existing editor area
             * @todo should validate data
             */
            createLevel: function (e) {
                e.preventDefault();

                // Clear out and update level data
                session
                    .reset()
                    .setValue('name', NEW_LV_NAME.value)
                    .setValue('tileSize', parseInt(NEW_LV_TILE_PIXELS.value, 10))
                    .setValue('tileCountHoriz', parseInt(NEW_LV_TILE_HORIZONTAL.value, 10))
                    .setValue('tileCountVert', parseInt(NEW_LV_TILE_VERTICAL.value, 10));

                modal.hide();

                return;
            },

            saveAsLevel: function () {

            }
        };

        return formSubmission;
    }
);