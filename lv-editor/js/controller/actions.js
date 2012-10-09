/**
 * Handles applying actions
 */
define(
    [
        'model/file'
    ],
    function (file) {
        /** @type {array} Cache of all action menu items */
        var ACTIONS = null;

        var actions = {
            init: function () {
                // Combine all JSON objects
                // Reference: http://stackoverflow.com/questions/10384845/merge-two-json-objects-in-to-on-object
                var actionList = file;

                // Get all of the action elements
                ACTIONS = document.querySelectorAll('[data-action]');

                // Apply actions
                var currentAction;
                for (var i = ACTIONS.length; i--;) {
                    // Get the action type
                    currentAction = ACTIONS[i].dataset.action;

                    if (actionList[currentAction]) {
                        ACTIONS[i].addEventListener('click', actionList[currentAction]);
                    }

                }
            }
        };

        return actions;
    }
);