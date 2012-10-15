/**
 * Handles applying actions
 * @todo File name not accurate
 */
define(
    [
        'model/file',
        'model/forms'
    ],
    function (fileActionList, formActionList) {
        /** @type {array} Cache of all action menu items */
        var ACTIONS = null;

        var FORMS = null;

        var actions = {
            /**
             * @todo Create a private method to apply actions from a data-id
             */
            init: function () {
                // Combine all JSON objects
                // Reference: http://stackoverflow.com/questions/10384845/merge-two-json-objects-in-to-on-object
                var actionList = fileActionList;

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

                // Get all the form items
                FORMS = document.querySelectorAll('[data-form]');

                // Apply form submission logic
                for (i = FORMS.length; i--;) {
                    // Get the action type
                    currentAction = FORMS[i].dataset.form;

                    if (formActionList[currentAction]) {
                        FORMS[i].addEventListener('click', formActionList[currentAction]);
                    }
                }
            }
        };

        return actions;
    }
);