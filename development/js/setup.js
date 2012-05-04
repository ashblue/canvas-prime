/*------------
Running The Game 
-----------*/
console.log(cp);

// List of scripts to load from js/objects
cp.load.objects = ['square', 'square-evil'];

// init(width, height, run onLoad function)
cp.core.init(500, 500, function() {
    cp.game.spawn('Square', 300, 50);
    cp.game.spawn('SquareEvil', 100, 100);
    cp.game.spawn('SquareEvil', 150, 75);
});