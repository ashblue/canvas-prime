define(
    [
        'controller/menu',
        'controller/actions'
    ],
    function (menu, actions) {
        // Create namespace
        var LV = {};

        // Setup the menu
        menu.init();

        // Apply actions
        actions.init();
    }
);