Setup Guide
=============

While Canvas Prime is ready to be used, it's not ready for production. Be warned that features will be added and removed before the final release.

1. Unpack the files to a directory on a server (required for on-demand JavaScript)
2. Create entities in 'js/objects' folder
3. Configure your setup.js
4. Configure your run.js
5. Run index.html in the root to see the magic happen

'While the below examples will help you with understanding the engine, please see the built in files for the latest documentation.'

# Entities

Each entity should have its own separate file in 'js/objects', these will be loaded by the game's built-in loader

## Example

    var Square = Entity.extend({
        type: 'a',
        xAdd: 5,
        yAdd: 5,
        width: 50,
        height: 40,
        color: '#000',
        update: function() {
            if (this.x + this.width > Game.width) { this.x = Game.width - this.width; this.xAdd = this.xAdd * -1; }
            else if (this.x < 0) { this.x = 0; this.xAdd = this.xAdd * -1; }
            if (this.y + this.height > Game.height) { this.y = Game.height - this.height; this.yAdd = Game.random(5) * -1; }
            else if (this.y < 0) { this.y = 0; this.yAdd = this.yAdd * -1; }
            
            this.x += this.xAdd;
            this.y += this.yAdd;
        },
        collide: function(object) {
            this.xAdd = this.xAdd * -1;
            this.yAdd = this.yAdd * -1;
        },
        draw: function() {
            Game.ctx.fillStyle = this.color;
            Game.ctx.fillRect(this.x,this.y,this.width,this.height);
        }
    });



# Setup.js

The setup file is where you can configure and overwrite your engine. It is ready to be used out of the box, but you may need to figure your object file names here.

## Example

    // You can tweak your engine through the init hook and add your own custom utilities here
    var MyEngine = Engine.extend({
        width: 400,
        height: 400,
        // Make sure to load objects dependant on another AFTER their parent object has been loaded
        objects: [
            'square',
            'square-evil',
            'key-test'
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


# Run.js

The run file is the objects that are run once the game has fully loaded. For example after creating and loading the setup objects you might run something like this.

## Example

    window.onload = function() {    
        Game.spawnEntity(Square, 200, 50);
        Game.spawnEntity(SquareEvil, 100, 100);
        Game.spawnEntity(SquareEvil, 150, 75);
        Game.spawnEntity(KeyTest, 0, 0);
    }