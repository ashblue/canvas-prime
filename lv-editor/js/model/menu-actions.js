define(
    [
        'helpers/ajax'
    ],
    function (ajax) {
        var SELF = null;

        var _private = {

        };

        var action = {
            init: function () {
                if (SELF !== null) {
                    return SELF;
                }

                SELF = this;

                return this;
            },

            saveLevel: function () {
                // Get the inputs
            }
        };

        return action.init();
    }
);