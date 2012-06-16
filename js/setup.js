/*------------
Running The Game 
-----------*/
console.log(cp);

// List of scripts to load from js/objects
//cp.load.objects = ['square', 'square-evil', 'key-test'];
cp.load.objects = ['anim-test', 'image', 'sound-test'];
cp.debug.active = true;

// init(width, height, run onLoad function)
cp.core.init(500, 500, function() {
    cp.game.spawn('AnimTest');
    cp.game.spawn('Image');
    cp.game.spawn('SoundTest');
});