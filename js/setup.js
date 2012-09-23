(function (cp) {
    /*------------
    Running The Game
    -----------*/
    console.log(cp);

    // List of scripts to load from js/objects
    cp.load.loadFiles = [
        'parachutes/player',
        'parachutes/building',
        'parachutes/crate',
        'parachutes/hud',
        'anim-test'
    ];
    cp.debug.active = true;
    cp.debug.showCollisions = true;

    // init(width, height, run onLoad function)
    cp.core.init(700, 500, function () {
        cp.game.spawn('Hud');
        //cp.game.spawn('AnimTest');
    });
}(cp));