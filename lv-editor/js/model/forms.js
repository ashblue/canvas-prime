define(
    ['controller/modal'],
    function (modal) {
        var NEW_LV_TITLE = '';

        var NEW_LV_TILE_PIXELS = '';

        var formSubmission = {
            createLevel: function (e) {
                e.preventDefault();

                // Clear out existing level data

                // Write the new level values to modal/level

                modal.hide();
            }
        };

        return formSubmission;
    }
);