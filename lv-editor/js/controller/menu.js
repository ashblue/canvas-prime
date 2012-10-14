define(
    [
        'controller/actions',
        'model/menu',
        'view/menu'
    ],
    function (actions, MenuData, MenuBuild) {
        /** @type {object} Cached menu */
        var MENU = document.getElementById('menu');

        /** @type {array} Cache of all action menu items */
        var ACTIONS = document.querySelectorAll('[data-action]');

        /** @type {object} Cached copy of recent menu items */
        var MENU_RECENT = null;

        var menu = {
            init: function () {
                // Build out the menu
                MENU.appendChild(MenuBuild(MenuData, 1));

                // Apply actions
                actions.init();

                // Setup menu recent items

                // Output current recent menu
            },

            updateRecent: function () {

            }
        };

        return menu;
    }
);