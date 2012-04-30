/*
Name: Core functions for the engine
Version: 1
Desc: Contains basic information for the engine such as initialization, loops
*/

var cp = cp || {};

cp.core = {
    // Gather the canvas element for future use
    canvas: document.getElementById("canvas"),
    
    // Sets the screens width and height, method can be accessed at any time
    width: 500,
    height: 500,
    screen: function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    },
    
    // Storage arrays for searching and loop optimization
    storage: new Array(),
    typeA: new Array(), // Friendly storage
    typeB: new Array(), // Enemy storage
    
    // Runs a series of methods to get the game up and running
    init: function() {
        if (this.canvas.getContext) {
            // Set context as 2D and store drawing tools for easy use
            cp.ctx = this.canvas.getContext('2d');
            
            // Setup the Canvas viewing space
            this.screen(this.width, this.height);
            
            // Init animation
            this.animate();
            
            // Load everyting necessary
            cp.load.init();
            
            // Run any extra logic added by user
            this.initHook();
        }
        else {
            this.fail();
        }
    },
    // Place your response/logic here for users that can't load Canvas
    fail: function() {
        alert('Canvas has failed to load in your browser. Please download/run Google Chrome, then visit this page again using it.');
    },
    // Place your additional setup logic here us cp.core.iniHook = function() {}; in setup.js
    initHook: function() {
        
    },
    
    // Must be referenced via global object due to a self reference error
    animate: function() {
        requestAnimFrame( cp.core.animate );
        cp.core.draw();
    },
    
    // Drawing
    draw: function() {
        cp.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // When loading objects run the loading screen, else run the game
        // Note: Remove load to its own draw if possible and switch it out upon completion
        if (! cp.load.active) {
            // Loop through every object in storage via reverse loop for maximum performance.
            // Drawing in reverse also makes newly drawn items drawn on top instead of underneath everything
            for (var obj = this.storage.length; obj--;) {
                
                // Run update functions before drawing anything to prevent screen pops for recently spawned items
                this.storage[obj].update();
                
                // Keeping this before collision test prevents crash on Game.kill(object)
                this.storage[obj].draw(); 
                
                // Check for a collision on an a type storage item to save loop execution time
                if (this.storage[i].type === 'a') {
                    // Check all items in the b type array only since its an a type item
                    for (var en = this.typeB.length; en--;) {
                        // Test for overlap between the two
                        if (this.overlap(
                                this.storage[obj].x,
                                this.storage[obj].y,
                                this.storage[obj].width,
                                this.storage[obj].height,
                                this.typeB[en].x,
                                this.typeB[en].y,
                                this.typeB[en].width,
                                this.typeB[en].height)
                            ) {
                            
                            // If they have collided, run the collision logic for both entities
                            this.storage[obj].collide(this.typeB[en]);
                            this.typeB[en].collide(this.storage[obj]);
                        }
                    }
                }
            }
            
            // Clean out killed items
            cp.game.graveyardPurge();
        
        // Loading logic
        } else {
            cp.load.update();
            cp.load.draw();
        }
    },
    
    // Test if two square objects are overlapping, game's default collision logic
    overlap: function(x1,y1,width1,height1,x2,y2,width2,height2) {
        if ( x1 < x2 + width2 &&
            x1 + width1 > x2 &&
            y1 < y2 + width2 &&
            y1 + height1 > y2 ) {
            return true;
        } else {
            return false;
        }
    }
};