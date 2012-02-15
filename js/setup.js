/*------------
Running The Game 
-----------*/
// You can tweak your engine through the init hook and add your own custom utilities here
var MyEngine = Engine.extend({
    width: 400,
    height: 400,
    // Make sure to load objects dependant on another AFTER their parent object has been loaded
    objects: [
        'square',
        'square-evil',
        'key-test',
        'get-test'
    ]
});
  
// Create and activate your personal engine
var Game = new MyEngine();
Game.setup();
    
// Animation must be kept seperate due to a DOM error caused by self-reference in objects
function animate() {
    requestAnimFrame( animate );
    Game.draw();
}
animate();