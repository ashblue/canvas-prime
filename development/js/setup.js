/*------------
Running The Game 
-----------*/
// You can tweak your engine through the init hook and add your own custom utilities here
var MyEngine = Engine.extend({
    width: 400,
    height: 400,
    // Make sure to load objects dependant on another AFTER their parent object has been loaded
    objects: [
        'anim-test',
        'key-test',
        'get-test',
        'square',
        'square-evil'
    ]
});
  
// Create and activate your personal engine
var Game = new MyEngine(); // Your variable name must be Game
Game.setup();