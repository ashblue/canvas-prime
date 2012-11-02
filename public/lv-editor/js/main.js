define(
    [
        'controller/menu',
        'controller/modal'
    ],
    function (menu, modal) {
        // Create namespace
        window.LV = {};

        // Setup the menu
        menu.init();

        // Apply actions
        modal.init();
    }
);