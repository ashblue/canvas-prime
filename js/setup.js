(function (cp) {
    /*------------
    Running The Game
    -----------*/
    console.log(cp);

    // List of scripts to load from js/objects
    cp.load.loadFiles = [
        'parachutes/building',
        'parachutes/crate'
    ];
    cp.debug.active = true;
    cp.debug.showCollisions = true;

    // init(width, height, run onLoad function)
    cp.core.init(700, 500, function () {
        // Create buildings
        cp.game.spawn('Building', 20);
        cp.game.spawn('Building', 165);
        cp.game.spawn('Building', 410);
        cp.game.spawn('Building', 555);

        // Create enemies
        cp.game.spawn('SpawnCrates');
    });
}(cp));