/*------------
Running The Game
-----------*/
console.log(cp);

// List of scripts to load from js/objects
//cp.load.loadFiles = ['anim-test', 'image', 'sound-test', 'key-test'];
cp.load.loadFiles = ['camera-test'];
cp.debug.active = true;
cp.debug.showCollisions = true;

// init(width, height, run onLoad function)
cp.core.init(500, 500, function() {
    cp.game.spawn('Player');
    cp.game.spawn('Objects');
});