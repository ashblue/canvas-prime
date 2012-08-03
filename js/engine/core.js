/*
Name: Core functions
Version: 1
Desc: Contains basic information for the engine such as initialization, loops, storage, ect.
*/

var cp = cp || {};

(function (cp) {
    // Declare private variables
    var _canvas = document.getElementById('canvas'), // Store Canvas element for later use
    _id = 0, // Id counter for spawning elements

    // Declare private functions
    // Sets the screens width and height, method can be accessed at any time
    _screen =  function (width, height) {
        // Check for a passed width and height
        if (typeof width === 'number' && typeof height === 'number') {
            cp.core.canvasWidth = width;
            cp.core.canvasHeight = height;
        }

        // Create the proper screen size
        _canvas.width = cp.core.canvasWidth;
        _canvas.height = cp.core.canvasHeight;
    },

    // Begin animation
    _animate = function () {
        requestAnimFrame( _animate );
        cp.core.loop();
    },

    // Permanently erases all graveyard items at the end of a loop
    _graveyardPurge = function() {
        if (cp.core.graveyard) {
            for (var obj = cp.core.graveyard.length; obj--;) {
                _remove(cp.core.graveyard[obj]);
            }
            cp.core.graveyard = [];
        }
    },

    // Cleans the killed object completely out of memory permanently
    _remove = function(object) {
        // Remove from main storage
        for (var i = cp.core.storage.length; i--;) {
            if (cp.core.storage[i] == object)
                cp.core.storage.splice(i,1);
        }

        // Remove from type storage
        switch (object.type) {
            case 'a':
                for (var i = cp.core.typeA.length; i--;) {
                    if(cp.core.typeA[i] == object)
                        cp.core.typeA.splice(i,1);
                }
                break;
            case 'b':
                for (var i = cp.core.typeB.length; i--;) {
                    if(cp.core.typeB[i] == object)
                        cp.core.typeB.splice(i,1);
                }
                break;
            default:
                break;
        }

        // Remove from main storage
        for (var i = cp.core.storage.length; i--;) {
            if(cp.core.storage[i] == object)
                cp.core.storage.splice(i,1);
        }

        // Clean out of browser's memory permanently
        delete object;
    };

    cp.core = {
        storage: [], // Storage for all
        typeA: [], // Friendly storage
        typeB: [], // Enemy storage
        canvasWidth: 500,
        canvasHeight: 500,

        // Runs a series of methods to get the game up and running
        init: function (width, height, run) {
            if (_canvas.getContext) {
                // Set context as 2D and store drawing tools for easy use
                cp.ctx = _canvas.getContext('2d');

                // Setup the Canvas viewing space
                _screen(width, height);

                // Start animation
                _animate();

                // Run logic upon completion of all loading
                if (run === undefined) {
                    return console.error('Failure to load, no run logic given');
                }

                cp.audio.init();

                // Load everyting necessary with a run callback
                cp.load.callback = run;
                cp.load.init(run);

                // Run any extra logic added by user
                this.hookInit();

                // Activate keyboard keys
                cp.input.init();

            } else {
                this.canvasFailed();
            }
        },

        // Increments and sets a new ID
        idNew: function () {
            _id += 1;
            return _id;
        },

        // Place your response/logic here for users that can't load Canvas
        canvasFailed: function() {
            alert('Canvas has failed to load in your browser. Please download/run Google Chrome, then visit this page again using it.');
        },

        // Place your additional setup logic here us cp.core.hookInit = function() {}; in setup.js
        hookInit: function() {},

        // Drawing
        loop: function() {
            cp.debug.start();

            cp.camera.setViewport();

            // Loop through every object in storage via reverse loop for maximum performance.
            // Drawing in reverse also makes newly drawn items drawn on top instead of underneath everything
            for (var obj = 0; obj < this.storage.length; obj++) {
                // Run update functions before drawing anything to prevent screen pops for recently spawned items
                cp.debug.recordStart('update');
                this.storage[obj].update();
                cp.debug.recordEnd('update');

                // Keeping this before collision test prevents crash on Game.kill(object)
                cp.debug.recordStart('draw');
                if (cp.camera.visibleTest()) {
                    this.storage[obj].draw();
                }
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

            cp.camera.restoreViewport();

            // Clean out killed items
            _graveyardPurge();

            // Set key monitoring as appropriate
            cp.input.monitor();

            cp.debug.end();
        },

        // Used to destroy entities when necessary instead of doing it during the loop and potentially blowing
        // everything up by accident.
        graveyard: [],

        // Note: Is this even used anywhere?
        // A shortcut for quickly setting params via processing an object
        quickSet: function(object, target) {
            for (var name in object) {
                target[name] = object[name];
            }
        }
    };
}(cp));