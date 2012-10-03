define(
    [
        'model/menu',
        'view/menu',
        'helpers/storage'
    ],
    function (MenuData, MenuBuild) {
        /** @type {object} Cached menu */
        var MENU = document.getElementById('menu');

        /** @type {object} Cached copy of recent menu items */
        var MENU_RECENT = null;

        var menu = {
            init: function () {
                // Build out the menu
                MENU.appendChild(MenuBuild(MenuData, 1));

                // Store Menu Recent

                // Output current recent menu
            },

            updateRecent: function () {

            }
        };

        return menu.init();
    }
);