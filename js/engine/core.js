/*
Name: Core functions
Version: 1
Desc: Contains basic information for the engine such as initialization, loops, storage, ect.
*/

var cp = cp || {};

cp.core = {
    // Gather the canvas element for future use
    canvas: document.getElementById("canvas"),
    
    // Id counter for spawning elements
    id: 1,
    
    // Increments and sets a new ID
    idNew: function() {
        this.id++;
        return this.id;
    },
    
    // Sets the screens width and height, method can be accessed at any time
    width: 500,
    height: 500,
    screen: function(width, height) {
        // Check for a passed width and height
        if (width !== undefined ||
        height !== undefined) {
            this.width = width;
            this.height = height;
        }
        
        // Create the proper screen size
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    
    // Storage arrays for searching and loop optimization
    storage: new Array(),
    typeA: new Array(), // Friendly storage
    typeB: new Array(), // Enemy storage
    
    // Runs a series of methods to get the game up and running
    init: function(width, height, run) {
        if (this.canvas.getContext) {
            // Set context as 2D and store drawing tools for easy use
            cp.ctx = this.canvas.getContext('2d');
            
            // Setup the Canvas viewing space
            this.screen(width, height);
            
            // Start animation
            this.animate();
                        
            // Run logic upon completion of all loading
            if (run === undefined) {
                return console.log('Failure to load, no run logic given');
            }

            // Load everyting necessary with a run callback
            cp.load.callback = run;
            cp.load.init(run);
            
            // Run any extra logic added by user
            this.hookInit();
            
            // Check to see if debugging is active
            cp.debug.init();
            
            cp.audio.init();
            
            // Activate keyboard keys
            cp.input.init();
            
        } else {
            this.fail();
        }
    },
    
    // Place your response/logic here for users that can't load Canvas
    fail: function() {
        alert('Canvas has failed to load in your browser. Please download/run Google Chrome, then visit this page again using it.');
    },
    
    // Place your additional setup logic here us cp.core.hookInit = function() {}; in setup.js
    hookInit: function() {
        
    },
    
    // Must be referenced via global object due to a self reference error
    animate: function() {
        
        
        requestAnimFrame( cp.core.animate );
        cp.core.draw();
        
        
    },
    
    // Drawing
    draw: function() {
        cp.debug.start();
        // Clear out the canvas
        cp.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // When loading objects run the loading screen, else run the game
        // Note: Remove load to its own draw if possible and switch it out upon completion
        if (! cp.load.active) {
            // Loop through every object in storage via reverse loop for maximum performance.
            // Drawing in reverse also makes newly drawn items drawn on top instead of underneath everything
            for (var obj = 0; obj < this.storage.length; obj++) {
                
                // Run update functions before drawing anything to prevent screen pops for recently spawned items
                cp.debug.recordStart('update');
                this.storage[obj].update();
                cp.debug.recordEnd('update');
                
                // Keeping this before collision test prevents crash on Game.kill(object)
                cp.debug.recordStart('draw');
                this.storage[obj].draw();
                cp.debug.recordEnd('draw');
                
                // Check for a collision on an a type storage item to save loop execution time
                cp.debug.recordStart('collisions');
                if (this.storage[obj].type === 'a') {
                    // Check all items in the b type array only since its an a type item
                    for (var en = this.typeB.length; en--;) {
                        // Test for overlap between the two
                        if (cp.game.overlap(
                        this.storage[obj].x,
                        this.storage[obj].y,
                        this.storage[obj].width,
                        this.storage[obj].height,
                        this.typeB[en].x,
                        this.typeB[en].y,
                        this.typeB[en].width,
                        this.typeB[en].height)) {
                            // If they have collided, run the collision logic for both entities
                            this.storage[obj].collide(this.typeB[en]);
                            this.typeB[en].collide(this.storage[obj]);
                        }
                    }
                }
                cp.debug.recordEnd('collisions');
            }
            
            // Clean out killed items
            this.graveyardPurge();
            
            // Set key monitoring as appropriate
            cp.input.monitor();
        
        // Loading logic
        } else {
            cp.load.update();
            cp.load.draw();
        }
        
        cp.debug.end();
    },
    
    // Used to destroy entities when necessary instead of doing it during the loop and potentially blowing
    // everything up by accident.
    graveyard: [],
    
    // Permanently erases all graveyard items at the end of a loop
    graveyardPurge: function() {
        if (this.graveyard) {
            for (var obj = this.graveyard.length; obj--;) {
                this.remove(this.graveyard[obj]);
            }
            this.graveyard = [];
        }
    },
    
    // Cleans the killed object completely out of memory permanently
    remove: function(object) {
        // Remove from main storage
        for (var i = this.storage.length; i--;) {
            if (this.storage[i] == object)
                this.storage.splice(i,1);
        }
        
        // Remove from type storage
        switch (object.type) {
            case 'a':
                for (var i = this.typeA.length; i--;) {
                    if(this.typeA[i] == object)
                        this.typeA.splice(i,1);
                }
                break;
            case 'b':
                for (var i = this.typeB.length; i--;) {
                    if(this.typeB[i] == object)
                        this.typeB.splice(i,1);
                }
                break;
            default:
                break;
        }
        
        // Remove from main storage
        for (var i = this.storage.length; i--;) {
            if(this.storage[i] == object)
                this.storage.splice(i,1);
        }
        
        // Clean out of browser's memory permanently
        delete object;
    },
    
    // A shortcut for quickly setting params via processing an object
    quickSet: function(object, target) {
        for (var name in object) {
            target[name] = object[name];
        }
    },
};