(function (cp) {
    // Debugging tools
    //cp.debug.active = true;
    //cp.debug.showCollisions = true;

    // List of scripts to load relative to js/objects
    cp.load.loadFiles = [
        'parachutes/player',
        'parachutes/building',
        'parachutes/crate',
        'parachutes/hud',
        'anim-test'
    ];

    // Width, height, and game run logic
    cp.core.init(700, 500, function () {
        cp.game.spawn('Hud');
    });
}(cp));