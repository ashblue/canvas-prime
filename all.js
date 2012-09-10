// How to figure out what a user's computer can handle for frames with fallbacks
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
*/
// Inspired by base2 and Prototype

// Base for entitites
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    this.Class = function(){};
    
    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;
        
        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && 
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
                return function() {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);        
                    this._super = tmp;
                    
                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
        }

        // The dummy class constructor
        function Class() {}
        
        // Populate our constructed prototype object
        Class.prototype = prototype;
        
        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;
    
        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

// Base for assets (automatically fires init)
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    this.Asset = function(){};
    
    // Create a new Class that inherits from this class
    Asset.extend = function(prop) {
        var _super = this.prototype;
        
        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && 
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
                return function() {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);        
                    this._super = tmp;
                    
                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
        }

        // The dummy class constructor
        function Asset() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }
        
        // Populate our constructed prototype object
        Asset.prototype = prototype;
        
        // Enforce the constructor to be what we expect
        Asset.prototype.constructor = Asset;
    
        // And make this class extendable
        Asset.extend = arguments.callee;

        return Asset;
    };
})();/*
Name: Animation Sheets and Controls
Version: 1
Desc: Allows users to create new animation sheets and control them.

TODO:
- Rotate needs a paramter for point of angle from the passed object, defaults to the middle
  currently.
*/

var cp = cp || {};

(function (cp) {
    cp.animate = {
        map: null, // Creates an array to map out and store frames
        frameW: null, // Width of a single sprite frame (TODO: combine into frameSize object with frameH)
        frameH: null,
        width: null, // Total width of image sprite (TODO: Combine into size object w/ height)
        height: null,

        // Creates an animation sheet, should only be run in an objects init
        // due to the processing intensity.
        sheet: Asset.extend({
            init: function(file, frameW, frameH) {
                var self = this;

                // Set animation width and height
                this.frameW = frameW;
                this.frameH = frameH;

                // Create url string
                this.url = cp.load.imgUrl + file;

                // Force reset map to prevent prototypical inheritance bug of appending maps
                this.map = [];

                // Get image and create it
                this.img = new Image();
                this.img.src = this.url;
                this.img.onload = function() {
                    self.width = self.img.width;
                    self.height = self.img.height;

                    // Since everything has been loaded for the image, slice it
                    self.slice();
                };
            },

            // Slices the image up and stores it inside map
            // Slices horizontally first, then startes on a new line, just like a typewriter
            slice: function() {
                var countHorizontal = Math.round(this.width / this.frameW), // count horizontal spaces
                countVertical = Math.round(this.height / this.frameH); // count vertical spaces

                // for each vertical space
                for ( var height = 0; height < countVertical; height++ ) {
                    // for each horizontal space setup x and y coordinates
                    for ( var slice = 0; slice < countHorizontal; slice++ ) {
                        // Push a new x and y array object for the current frame
                        this.map.push({
                            x: this.frameW * slice,
                            y: this.frameH * height
                        });
                    }
                }
            }
        }),

        // Setup an animation sequence that can be cached
        cycle: Asset.extend({
            repeat: false, // Infinitely loop animation
            alpha: 1, // Set alpha transparency
            current: 0, // Current frame
            // Takes information relevant to the particular animation and an object
            // to quickly set various parameters
            init: function(sheet, interval, frames, repeat) {
                this.id = cp.core.idNew();

                // Stores the sheet used to create the frames
                this.sheet = sheet;

                // Converts and records the speed from seconds to milliseconds
                interval = cp.math.convert(interval, 1000, 0, true);
                this.speed = interval;

                // An array of frames to cycle through
                this.frames = frames;

                // Optional JSON object to set extra parameters such as repeat, offset, ect.
                this.repeat = repeat;
            },

            // Starts up the animation
            run: function() {
                var self = this;
                this.animRun = setInterval(
                    function() {self.cycle();},
                    self.speed);
            },

            cycle: function() {
                // Verify frames are still running
                if (this.current + 1 < this.frames.length) {
                    // Next animation
                    this.current++;
                } else if (this.repeat) { // repeat if set
                    this.current = 0;
                } else { // kill the entire animation
                    clearInterval(this.animRun);
                }
            },

            // return current animation
            get: function() {
                // get current animation
                var sheetLoc = this.frames[this.current];

                // Return the animation x and y coordinates for drawing
                return this.sheet.map[sheetLoc];
            },

            // Crops and returns a full image
            crop: function(obj) {
                // dump image x and y data fur current frame
                var img = this.get();

                // Set alpha
                cp.ctx.globalAlpha = obj.alpha;

                // Canvas location with offset
                this.canvasX = obj.x + obj.offset.x;
                this.canvasY = obj.y + obj.offset.y;

                // Runs rotation if rotate is set
                this.rotateStart(obj);

                // Runs flip image if a flip boolean is set
                this.flipStart(obj);

                // Draw the image
                if (img !== undefined) {
                    cp.ctx.drawImage(
                        this.sheet.img, // img
                        img.x, // crop x location
                        img.y, // crop y location
                        this.sheet.frameW, // width of crop window
                        this.sheet.frameH, // height of crop window
                        this.canvasX, // canvas x location
                        this.canvasY,// canvas y location
                        this.sheet.frameW, // canvas width
                        this.sheet.frameH // canvas height
                    );
                }

                cp.ctx.globalAlpha = 1;

                // Ends flip if set
                this.flipEnd(obj);

                // Ends rotation if set
                this.rotateEnd(obj);
            },

            // Note: Should take a point of rotation, currently sets it to the middle
            rotateStart: function(obj) {
                if (obj.angle) {
                    // Translate to the object's center (x + (width / 2), y + (height / 2)) and rotate it
                    cp.ctx.translate(
                        this.canvasX + (this.sheet.frameW / 2),
                        this.canvasY + (this.sheet.frameH / 2));

                    cp.ctx.rotate(Math.PI / 180 * obj.angle);

                    // Alter the drawImage with (x, y, width, height) (-width / 2, -height / 2, width, height)
                    this.canvasX = - this.sheet.frameW / 2;
                    this.canvasY = - this.sheet.frameH / 2;
                }
            },

            rotateEnd: function(obj) {
                if (obj.angle) {
                    // Reverse the angle
                    cp.ctx.rotate(- Math.PI / 180 * obj.angle);

                    // Reverse the tanslate
                    cp.ctx.translate(
                        (obj.x + obj.offset.x + (this.sheet.frameW / 2)) * -1,
                        (obj.y + obj.offset.y + (this.sheet.frameH / 2)) * -1);
                }
            },

            flipStart: function(obj) {
                if (obj.flip.x && obj.flip.y) {
                    // X coordinate must be reversed
                    this.canvasX = (this.canvasX * -1) - this.sheet.frameW;

                    // Reverse y and add difference in height
                    this.canvasY = (this.canvasY * -1) - this.sheet.frameH;

                    // Set scale initally
                    cp.ctx.scale(-1, -1);

                } else if (obj.flip.x) {
                    // X coordinate must be reversed
                    this.canvasX = (this.canvasX * -1) - this.sheet.frameW;

                    // Set scale initally
                    cp.ctx.scale(-1, 1);

                } else if (obj.flip.y) {
                    // Reverse y and add difference in height
                    this.canvasY = (this.canvasY * -1) - this.sheet.frameH;

                    // Set scale initally
                    cp.ctx.scale(1, -1);
                }
            },

            // Reverse flips the scale
            flipEnd: function(obj) {
                if (obj.flip.x && obj.flip.y) {
                    cp.ctx.scale(-1, -1);
                } else if (obj.flip.y) {
                    cp.ctx.scale(1, -1);
                } else if (obj.flip.x) {
                    cp.ctx.scale(-1, 1);
                }
            },

            // Restarts the animation for the first frame manually, plays if active
            reset: function() {
                if (this.active == true) {
                    // Clear interval to prevent conflicts
                    clearInterval(this.animRun);

                    // Start new interval
                    this.run();
                }

                // Set current frame to 0
                this.current = 0;
            }
        })
    };
}(cp));/**
 * Logic for controlling the game's camera.
 * @author Ash Blue
 */

var cp = cp || {};

(function (cp) {
    cp.camera = {
        /** @type {number} X position of the camera form the top left */
        x: 10,

        /** @type {number} Y position of the camera form the top left */
        y: 10,

        /**
         * Offset to clip visible items so you can better control what does
         * and doesn't get drawn.
         * @type {number} Number of pixels to offset the drawn items at each of
         * the four corners. Positive numbers will yeild a larger drawing area,
         * while a negative offset will shrink it.
         * @todo Not currently integrated yet.
         */
        visibleOffset: 50,

        //
        /**
         * Verifies the camera can see the item before drawing.
         * @param {number} x Current x coordinate of the tested object.
         * @param {number} y Current y coordinate of the tested object.
         * @param {number} width Current width of the tested object.
         * @param {number} height Current height of the tested object.
         * @returns {boolean} False if it isn't visible, true if it is.
         */
        visibleTest: function (x, y, width, height) {
            // Return false if outside boundaries
            if (x + width < this.x || // is object left of camera x
                y + height < this.y || // is object above camera y
                x > this.x + cp.core.canvasWidth || // is object right of camera x
                y > this.y + cp.core.canvasHeight) { // is object below camera y
                return false;
            }

            return true;
        },

        /**
         * Sets the current position of the camera outside of the camera object.
         * @param {number} x Position x of the camera from the top left.
         * @param {number} y Position y of the camrae form the top left.
         * @returns {self}
         */
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;

            return this;
        },

        /**
         * Sets and saves the translation through a standardized method, then
         * clears Canvas drawing area only in the current viewport.
         * @returns {undefined}
         */
        setViewport: function () {
            cp.ctx.save();
            cp.ctx.translate(-this.x, -this.y);
            cp.ctx.clearRect(this.x, this.y, cp.core.canvasWidth, cp.core.canvasHeight);

            return;
        },

        /**
         * Restores the viewport to the previous state.
         * @returns {undefined}
         */
        restoreViewport: function () {
            cp.ctx.restore();
            
            return;
        }
    };
}(cp));/*
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
}(cp));/*
Name: Debugging Controls
Version: 1.1
Desc: Allows you to display the current fps, total draw time, total update time,
collision processing time, system lag, total enties, total frame time, and more.

To-Do:
- Click debug area to pull up a graph of fps with a range
*/

var cp = cp || {};

(function (cp) {
    var _records = {
        fps: {
            title: 'FPS',
            color: '#0084FF',
            graph: true,
            min: 100,
            max: 0,
            result: 0
        },
        entity: {
            title: 'Entity#',
            color: '#00A220'
        },
        draw: {
            title: 'Draw',
            color: '#A568C4',
            measurement: 'ms',
            total: 0
        },
        update: {
            title: 'Update',
            color: '#A568C4',
            measurement: 'ms',
            total: 0
        },
        collisions: {
            title: 'Collisions',
            color: '#A568C4',
            measurement: 'ms',
            total: 0
        },
        other: {
            title: 'Other',
            color: '#A568C4',
            measurement: 'ms',
            total: 0
        },
        total: {
            title: 'Total',
            color: '#E06835',
            measurement: 'ms',
            graph: true,
            min: 100,
            max: 0,
            total: 0
        }
    },

    _generateHTML = function() {
        // Main body of debug div
        var el = _genEl('aside', { id: 'debug' });

        // Setup click listener for sections
        var sectionClick = function(e) {
            // Destroy all active states
            el.getElementsByClassName('active')[0].classList.remove('active');

            // Add correct active states
            if (this.nextSibling) {
                this.nextSibling.classList.add('active');
            } else {
                this.previousSibling.classList.add('active');
            }

            e.preventDefault();
        };

        // Generate stats
        var stats = _genEl('div', { id: 'debug-stats', className: 'debug-container active' });
        stats.addEventListener('click', sectionClick);
        el.appendChild(stats);

        var statsList = document.createElement('ul');
        statsList.className = 'debug-list';
        stats.appendChild(statsList);

        _genStats(statsList);

        document.body.appendChild(el);

        // Generate Graph
        var graph = _genEl('div', { id: 'debug-graph', className: 'debug-container' });
        graph.addEventListener('click', sectionClick);
        el.appendChild(graph);

        _generateGraphs(graph);
    },

    _genEl = function(create, data) {
        // return if no element is present
        if (typeof create !== 'string') {
            return console.error('First paramter must be a string to create an HTML element.');
        }

        // Create element
        var el = document.createElement(create);

        // Loop through and set all passed data
        for (var i in data) {
            el[i] = data[i];
        }

        return el;
    },

    _genStats = function(attachEls) {
        for (var name in _records) {
            var el = _genEl('li', {
                id: 'stat-' + _records[name].title.toLowerCase(),
                className: 'stat'
            });
            el.style.color = _records[name].color;

            // name
            var title = _genEl('span', { className: 'stat-name', innerHTML: _records[name].title + ': ' });
            el.appendChild(title);

            // total
            var total = _genEl('span', { className: 'stat-total', innerHTML: '0' });
            el.appendChild(total);

            if (_records[name].measurement !== undefined)
                el.appendChild(_genEl('small', {
                    innerHTML: _records[name].measurement }));


            // Cache DOM info for quick access later
            _records[name].dom = total;

            attachEls.appendChild(el);
        }
    },

    _generateGraphs = function(attachEls) {
        for (var name in _records) {
            // Exit early if no graph
            if (_records[name].graph !== true)
                continue;

            if (_records[name].measurement) {
                var measurement = _records[name].measurement;
            } else {
                var measurement = '';
            }

            // Container
            var el = _genEl('div', {
                className: 'graph',
                innerHTML: '<h3 style="color: ' + _records[name].color + '" class="graph-title">' + _records[name].title + ' <span id="value-' + name + '">0</span> <span class="graph-range">(<span id="min-' + name + '">0</span> - <span id="max-' + name + '">0</span>)</span> <small>' + measurement + '</small></h3><div id="graph-' + name + '" class="graph-data"></div>'
            });

            attachEls.appendChild(el);

            // Save DOM data for easy access later
            _records[name].domGraph = {
                value: document.getElementById('value-' + name),
                min: document.getElementById('min-' + name),
                max: document.getElementById('max-' + name),
                graph: document.getElementById('graph-' + name)
            };
        }
    };

    cp.debug = {
        active: false,
        // Total time passed
        past: 0,

        init: function() {
            // If debugging is not active kill all active functions to prevent unnecessary lag
            if (this.active === false) {
                this.start = this.end = this.recordStart = this.recordEnd = function() {
                    return;
                };
            } else {
                _generateHTML();
                // Millisecond starting value for Date.now()
                this.base = Date.now();
            }
        },

        // Creates a light weight time recording loop by calculating differnce
        // Speed variable is equal to the number of frames you want to capture and process time at
        // 60 is roughly equal to 1 second
        start: function() {
            this.past = Date.now() - this.base;

            // test if 1 second has passed
            if (this.past > 1000) {
                _records.entity.result = cp.core.storage.length;

                // Calculate results
                this.gatherResults();

                // Count another second
                this.base = Date.now();

                // Clear fps
                _records.fps.result = 0;
            }

            // Increment fps since 1 frame has passed
            _records.fps.result++;

            this.recordStart('total');
        },

        end: function() {
            this.recordEnd('total');
        },

        // Takes a snapshot of the current item
        recordStart: function(name) {
            // Begin recording
            _records[name].start = Date.now();
        },

        // Takes a snapshot of the current item and stores the result
        recordEnd: function(name) {
            // End recording
            _records[name].end = Date.now();

            // Increment the difference between recordings
            _records[name].total += _records[name].end - _records[name].start;
        },

        // Creates all of the debug data from the gathered records
        gatherResults: function() {
            // Loop through all records and store their results with a tag
            for (var name in _records) {
                // Process time information if necessary
                if (typeof _records[name].total === 'number') {
                    var time = _records[name].total;

                    _records[name].result = time;

                    // Clear total from records
                    _records[name].total = 0;
                }

                // Output other data
                if (name === 'total') {
                    var otherTotal = _records['total'].result - _records['draw'].result + _records['update'].result + _records['collisions'].result;
                    _records['other'].dom.innerHTML = otherTotal;
                }

                // Inject value
                _records[name].dom.innerHTML = _records[name].result;

                // Append graph data if present
                // TODO: Delete overflowing graph items
                if (_records[name].domGraph !== undefined) {
                    // Set total value
                    _records[name].domGraph.value.innerHTML = _records[name].result;

                    // Set max
                    if (_records[name].result > _records[name].max) {
                        _records[name].max = _records[name].domGraph.max.innerHTML = _records[name].result;
                    }

                    // Set min
                    if (_records[name].result < _records[name].min) {
                        _records[name].min = _records[name].domGraph.min.innerHTML = _records[name].result;
                    }

                    // Delete excess graph data
                    if (_records[name].domGraph.graph.childNodes.length >= 75) {
                        _records[name].domGraph.graph.removeChild(_records[name].domGraph.graph.firstChild);
                    }

                    // Append data to graph
                    var graphLine = _genEl('span', {
                        className: 'graph-line'
                    });
                    graphLine.style.backgroundColor = _records[name].color;

                    var height = Math.round(_records[name].result / 2);
                    graphLine.style.height = height + 'px';
                    graphLine.style.marginTop = 50 - height + 'px';

                    _records[name].domGraph.graph.appendChild(graphLine);
                }
            }
        }
    };
}(cp));/*
Name: Animation Sheets and Controls
Version: 1
Desc: Allows users to create new animation sheets and control them.

Notes: To pre-load images, the script relies on the init

To-Do: Add logic for objects loading with cp.imgCount and cp.imgLoaded
*/

var cp = cp || {};

(function (cp) {
    cp.game = {
        // TODO: Currently broken and needs a complete re-write, DO NOT USE!!!
        // Manually force sorts all items present on the screen based upon their zIndex
        sort: function(loc) {
            // Loop through storage
                // Get all elements with a zIndex
                // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort

            // Get index of this
            var index = cp.storage.indexOf(this);

            // Delete old location
            cp.storage.splice(index, 1);

            // Inject new location
            cp.storage.splice(loc, 0, this);
        },

        // You may get all entities by a contained value name.
        // Second parameters is a filter that will only retrieve the value
        // if it matches.
        entityGetVal: function(name, val) {
            // Setup stack for storage
            var stack = [];

            // Loop through objects and get matched value
            if (val !== undefined) { // Incase no val was passed
                for (var j in cp.core.storage) {
                    if (cp.core.storage[j][(name)] == val) stack.push(cp.core.storage[j]);
                }
            } else {
                for (var j in cp.core.storage) {
                    if (cp.core.storage[j][(name)]) stack.push(cp.core.storage[j]);
                }
            }

            // Return value or false
            if (stack.length > 0) {
                return stack;
            }
            else {
                return false;
            }
        },

        // Attach object relative to engine, not window
        spawn: function(name, x, y) {
            // Create the entity and temporarily store it for reference purposes
            var entity = new cp.template[name];

            // Apply the passed parameters to init
            if (arguments.length > 1 && entity.init) {
                // Remove name argument
                var args = [].slice.call(arguments, 1);
                // Fire the init with proper arguments
                entity.init.apply(entity, args);
            } else if (entity.init) {
                entity.init();
            }

            // Pushes your new variable into an array
            cp.core.storage.push(entity);
            entity.id = cp.core.idNew();

            // Push into type storage for quicker collision detection
            switch (entity.type) {
                case 'a':
                    cp.core.typeA.push(entity);
                    break;
                case 'b':
                    cp.core.typeB.push(entity);
                    break;
                default:
                    break;
            }

            cp.core.id += 1; // Increment the id so the next shape is a unique variable
        },

        // Test if two square objects are overlapping, game's default collision logic
        // TODO: Place in core.js
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
}(cp));/*
Name: Input monitoring and library
Version: 1
Desc: Handles all keyboard input by storing results inside an array that can be
checked and cleared. This is the only design patter that allows multiple keys to
be checked at one time.

Note: Needs to be self contained keyboard events that are created and/or destroyed. Right now its
super jacked up because all the events fire to the same place. Should just let users setup their
own keyboard events with an object that can be destroyed or created.
*/

var cp = cp || {};

(function (cp) {
    // Returns a mouse or keyboard key depending upon the called event
    var _getKey = function(e) {
        // Keyboards don't have the mouse's button property, check for it
        // to verify a keyboard is firing
        if (e.button === undefined) {
            return e.keyCode;

        // Mouse input, get the clicked button
        } else {
            return e.button;
        }
    },

    // Special function relative to the mouse
    _mouseMove = function(e) {
        cp.input.mouse.x = e.offsetX;
        cp.input.mouse.y = e.offsetY;
    },

    // Logic for when the mouse doesn't hover over the Canvas
    _mouseOut = function(e) {
        cp.input.mouse.x = null;
        cp.input.mouse.y = null;
    },

    // Marks the current key for deletion
    _remove = function(e) {
        var key = _getKey(e);
        _storage[key] = 'remove';
    },

    // Stores the current key event in an array and sets it to active
    _store = function(e) {
        var key = _getKey(e);

        // Get current status of existing keyCode (if present)
        var status = _storage[key];

        // Set as active only if the existing key is not already set
        if ( ! status ) {
            _storage[key] = 'active';
        }
    },

    // Archived library so you don't have to remember the keyboard event code
    _library = {
        // Mouse
        'clickLeft': 0,
        'clickMiddle': 1,
        'clickRight': 2,

        // Primary
        'enter': 13,
        'tab': 9,
        'esc': 27,
        'space': 32,
        'backspace': 8,

        // Modifiers
        'shift': 16,
        'ctrl': 17,
        'alt': 18,
        'capsLock': 20,

        // Symbol keys (use at own risk outside of Mozilla and Chrome)
        ';': 59,
        '=': 61,
        ',': 188,
        '-': 109,
        '.': 190,
        '/': 191,
        '`': 192, // aka ~
        '[': 219,
        ']': 221,

        // Special keys
        'insert': 45,
        'delete': 46,
        'home': 36,
        'end': 35,
        'pageUp': 33,
        'pageDown': 34,

        // Arrows
        'arrowUp': 38,
        'arrowDown': 40,
        'arrowLeft': 37,
        'arrowRight': 39,

        // Numbers
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,

        // Num lock
        'num0': 96,
        'num1': 97,
        'num2': 98,
        'num3': 99,
        'num4': 100,
        'num5': 101,
        'num6': 102,
        'num7': 103,
        'num8': 104,
        'num9': 105,
        'num*': 106,
        'num+': 107,
        'num-': 108,
        'numLock': 144,
        'num.': 110,
        'num/': 111,

        // Letters
        'a': 65,
        'b': 66,
        'c': 67,
        'd': 68,
        'e': 69,
        'f': 70,
        'g': 71,
        'h': 72,
        'i': 73,
        'j': 74,
        'k': 75,
        'l': 76,
        'm': 77,
        'n': 78,
        'o': 79,
        'p': 80,
        'q': 81,
        'r': 82,
        's': 83,
        't': 84,
        'u': 85,
        'v': 86,
        'w': 87,
        'x': 88,
        'y': 89,
        'z': 90,

        // F keys
        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123
    },

    _storage = {}, // Container for storing all pressed keys
    _active = {}; // Only contains binded keys

    cp.input = {
        mouse: {
            x: false,
            y: false
        },

        init: function() {
            // Creates keyboard monitoring
            window.addEventListener('keydown', _store, true);
            window.addEventListener('keyup', _remove, true);

            // Mouse logic only relative to the Canvas
            cp.ctx.canvas.addEventListener('mousemove', _mouseMove, true);
            cp.ctx.canvas.addEventListener('mouseout', _mouseOut, true);
            cp.ctx.canvas.addEventListener('mousedown', _store, true);
            cp.ctx.canvas.addEventListener('mouseup', _remove, true);
        },

        // TODO: This loop could be better optimized, verify down, press, and up all fire in order
        // Monitors active keys and modifies them as necessary from each frame
        // Be aware that in a console it looks like press occurs before down and up,
        // this is not true. In face, they are firing at the exact same time.
        monitor: function() {
            // Loop through all keyboard objects and modify as necessary
            for ( var key in _storage ) {
                // Cache active object value for comparison only, cannot be set
                var item = _storage[key];

                // If the item has been recently pressed set it to the down state
                if (item === 'active') {
                    _storage[key] = 'down';

                // After down has been set for one frame, change it to pressed
                } else if (item === 'down') {
                    _storage[key] = 'pressed';

                // After up has been set, change the status to delete
                } else if (item === 'remove') {
                    _storage[key] = 'up';

                // After a full frame has passed, delete the item out of existence
                } else if (item === 'up') {
                    delete _storage[key];
                }
            }
        },

        // Binds a key with a corresponding tag/name that can be referenced
        bind: function(key, tag) {
            // Convert key name to keycode
            key = _library[key];

            // Store key value for reference later
            _active[tag] = key;
        },

        // Unbinds a specific key or all keys if no tag param is passed
        unbind: function(tag) {
            if (tag !== undefined) {
                delete _active[tag];
            } else {
                _active = {};
            }
        },

        // Detects if a key has been pressed for one frame
        down: function(tag) {
            return _storage[_active[tag]] === 'down';
        },

        // Detects if a key has been released within the current frame
        up: function(tag) {
            return _storage[_active[tag]] === 'up';
        },

        // Returns true for pressed and disregards press and release's frame based rules
        press: function(tag) {
            // Cache state of storage item
            var state = _storage[_active[tag]];

            // Return true if anything exceupt up is pressed to prevent logic overlap
            if (state &&
            state !== 'up') {
                return true;
            } else {
                return false;
            }
        }
    };
}(cp));/*
Name: Load Assets
Version: 1
Desc: Controls all file loading mechanisms and draws the loading screen while waiting.

It should be noted that extra pre-caution should be taken to make sure that this file
is compatible with the framework's compiler. Extra variables will be injected during
compiling to circumvent XMLHTTP requests or completely remove certain loaders.
*/

var cp = cp || {};

(function (cp) {
    var _loopHold, // temporary dump location to hold the cp.core.loop while its temporarily replaced to show the load screen
    _loadProgress, // Shows the current load progress text
    _loadPercent, // Total percent of loaded assets

    //COMPILER_LOADING = null, // IMPORTANT: This variable is set to true by the compiler automatically, DO NOT CHANGE
    COMPILER_IMG = ["100.jpg","2000.jpg","500.jpg","880x420.jpg","character.png","decaf.png"], // Compiler script will replace null with a JSON string
    COMPILER_AUDIO = ["crash","nuclear-launch","ride-warning"], // Compiler script will replace null with a JSON string

    _htmlHead = document.getElementsByTagName('HEAD'),
    _fileCount = 0,
    _fileTotal = 0,
    _getFiles = function() {
        // Double check var objects is present with an array of file names to
        // load, or perform an emergency exit.
        if (typeof cp.load.loadFiles !== 'object') {
            console.error('Failure to load. No elements have been loaded into the engine. Please include an array of objects in cp.load.objects([\'example1\', \'example2\']) with corresponding files in js/objects');
            return false;
        }

        // Update total asset count
        cp.load.assetTotal = cp.load.loadFiles.length;

        // Store the total number of objects to loop through
        _fileTotal = cp.load.loadFiles.length;

        // Create all files
        _fileCreate();
    },
    _fileCreate = function() {
        // Setup script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = cp.load.fileUrl + cp.load.loadFiles[_fileCount] + '.js';

        // Declare onload rules
        script.onload = function() {
            // Increment counters here since the previous object is fully loaded
            _fileCount += 1;
            cp.load.assetCount += 1;

            // Test for completion and exit if so
            if (_fileCount >= _fileTotal) {
                return true;
            }

            // Refer back to this method upon completion
            _fileCreate();
        };

        // Insert new document
        _htmlHead[0].appendChild(script);
    },

    // Creates an XML HTTP request and fires a callback
    _createXmlHttp = function(url, callback) {
        // Prep XML HTTP request
        var loadXmlHttp = new XMLHttpRequest();
        loadXmlHttp.open('GET', url, true);
        loadXmlHttp.send();

        // When request is fully loaded
        loadXmlHttp.onreadystatechange = function() {
            if (loadXmlHttp.readyState === 4 && loadXmlHttp.status === 200) {
                callback(JSON.parse(loadXmlHttp.responseText));
            }
        };
    },

    _getImgs = function() {
        var callback = function(response) {
            // Prep data
            var images = response;

            // Increment number of game items
            cp.load.assetTotal += images.length;

            // Loop through all items
            // http://www.mennovanslooten.nl/blog/post/62
            var img; // container for creating new images in a loop
            for (var i = images.length; i--;) {
                img = new Image();
                img.src = cp.load.imgUrl + images[i];

                img.onload = (function(val) {
                    // returning a function forces the load into another scope
                    return function() {
                        cp.load.assetCount++;
                    }
                })(i);
            }
        };

        if (COMPILER_IMG === null) {
            _createXmlHttp('include/image-files.php', callback);
        } else {
            callback(COMPILER_IMG);
        }
    },

    // TODO: Add a url to retrieve audio
    _getAudio = function() {
        var callback = function(response) {
            // Unstringify data
            var sounds = response;

            cp.load.assetTotal += sounds.length;

            // Loop through all items
            for ( var s = sounds.length; s--; ) {
                // Create sound file from proper location
                var sound = new Audio(cp.audio.url + sounds[s] + cp.audio.type);

                // returning a function forces the load into another scope
                sound.addEventListener('canplaythrough', (function(val) {
                    cp.load.assetCount++;
                })(s));
            }
        };

        if (COMPILER_AUDIO === null) {
            _createXmlHttp('include/sound-files.php', callback);
        } else {
            callback(COMPILER_AUDIO);
        }

    };

    cp.load = {
        assetCount: 0, // Total number of successfully loaded assets
        assetTotal: 0, // Total number of assets to load
        loadFiles: null, // An array of file names to load, only loads files out of js->objects
        fileUrl: 'js/objects/', // Setup and information for loading file assets
        imgUrl: 'images/', // Default image loading location

        init: function() {
            if (!COMPILER_AUDIO || !COMPILER_IMG) {
                // Begin loading files
                _getFiles();
            }

            // Begin loading images (should fire draw when image files are added to total
            _getImgs();

            _getAudio();

            // temporarily replace loop
            _loopHold = cp.core.loop;
            cp.core.loop = this.loop;
        },

        // Logic for drawing and displaying loading screen
        // Must refer to cp.load to prevent reference errors since scope changes to cp.core temporarily
        loop: function() {
            // Create loading numbers string
            _loadProgress = cp.load.assetCount + ' / ' + cp.load.assetTotal;

            // Create loading bar information
            _loadPercent = (cp.load.assetCount / cp.load.assetTotal).toFixed(2);

            // Count loaded objects
            if (cp.load.assetCount === cp.load.assetTotal) {
                // turn off the animation and run the game
                cp.load.callback();

                // Check to see if debugging is active
                cp.debug.init();

                // Repair original loop
                cp.core.loop = _loopHold;
            }

            if (cp.load.assetCount > 0) {
                // Background
                cp.ctx.fillStyle = '#000';
                cp.ctx.fillRect(0, 0, cp.core.canvasWidth, cp.core.canvasHeight);

                // Loading text
                cp.ctx.fillStyle = '#fff';
                cp.ctx.font = '40px arial';
                cp.ctx.textAlign = 'center';
                cp.ctx.fillText('Loading...', cp.core.canvasWidth / 2, cp.core.canvasHeight / 2 - 50);

                // Asset count text
                cp.ctx.font = '20px arial';
                cp.ctx.fillText(_loadProgress, cp.core.canvasWidth / 2, cp.core.canvasHeight / 2 + 50);

                // Start loading bar background
                // TODO: These should not be generated every single time in the loop, make these _private variables
                var offset = 100,
                barX = offset / 2, // Note: might break due to self reference
                barY = cp.core.canvasHeight / 2 - 20,
                barWidth = cp.core.canvasWidth - offset,
                barHeight = 40;

                cp.ctx.fillStyle = '#fff';
                cp.ctx.fillRect(barX, barY, barWidth, barHeight);

                // Loading bar overlay (progress bar)
                offset = 5;
                barX = barX + offset;
                barY = barY + offset;
                barWidth = (barWidth - (offset * 2)) * _loadPercent;
                barHeight = barHeight - (offset * 2);

                cp.ctx.fillStyle = '#00aaff';
                cp.ctx.fillRect(barX, barY, barWidth, barHeight);
            }
        }
    };
}(cp));/*
Name: Math processing
Version: 1
Desc: Contains a library of pre-built math equations, very
useful for generating random numbers and simplifying other
complex logic.
*/

var cp = cp || {};

(function (cp) {
    cp.math = {
        // Random should only be run in the init for best practice
        random: function(max, min) {
            if (!min) min = 1;
            return Math.floor(Math.random() * (max - min + 1) + min);
        },

        // Returns a random positive or negative number
        randomPosNeg: function() {
            return Math.random() < 0.5 ? -1 : 1;
        },

        // Number converter
        // val = the number you wish to convert such as 5 (5 milliseconds)
        // base = the number to divide it by 1000 (conversion to a second)
        // round = how many numbers should it round up the returned result?
        // multiply = boolean that allows you to convert a number down instead of up
        // TODO: Round this way is slow, use Math.floor instead
        convert: function(val, base, round, multiply) {
            // Convert a number up
            if (multiply) {
                var total = val * base;
            // Convert down
            } else {
                var total = val / base;
            }

            return Math.round(total * Math.pow(10, round)) / Math.pow(10, round);
        }
    };
}(cp));/*
Name: Sound Library
Version: 1
Desc: A series of controls for creating music, sound effect, and anything audio
related for a game.

Note: That in iOS you can only fire one sound at a time,
there is no workaround for this other than prioritizing sounds.
*/

var cp = cp || {};

(function(cp) {
    // Searches for audio file support and sets it as necessary
    // Source: http://diveintohtml5.com/everything.html
    var _detect = function() {
        // Create a dummy audio placeholder
        var test = new Audio();

        // Check for ogg support
        if (test.canPlayType('audio/ogg; codecs="vorbis"')) {
            cp.audio.type = '.ogg';
        // Check for mp3 support
        } else if (test.canPlayType('audio/mpeg;')) {
            cp.audio.type = '.mp3';
        } else {
            console.error('This browser does not support .mp3 or .ogg, failed to setup game.');
        }
    };

    cp.audio = {
        url: 'audio/',
        init: function() {
            _detect();
        },

        // Creates a new sound object
        Sound: Asset.extend({
            // name - String of the base audio file name
            init: function(name) {
                this.el = new Audio(cp.audio.url + name + cp.audio.type);
            },

            // Get or return the current track's total play timelocation
            playTime: function(set) {
                if (set !== undefined && set === int)
                    this.el.currentTime = set;
                else
                    return this.el.currenttime;
            },

            // level - Number of 0 to 1
            volume: function(level) {
                this.el.volume = level;
            },

            play: function() {
                this.el.play();
            },

            stop: function() {
                this.el.pause();
            }
        }),

        // Handeling of game's music
        music: {
            /* playlist - an array of track names to load into the player
             * settings - JSON object that overrides defaults
             * - loop (bool): Restart the playlist after playing all tracks
             * - repeat (bool): Replay the same track after ending
             * - autoplay (bool); Automatically plays the next track
            */
            init: function(playlist, settings) {
                var self = this;

                this.loop = this.repeat = false;
                this.autoplay = true;
                this.count = 0; // Inital track start location and delay between tracks
                this.setDelay(2);

                // Override settings
                if (typeof settings === 'object') {
                    cp.core.quickSet(settings, this);
                }

                // Return an error if the playlist is not an array
                // Note: Current mode of detection is not bullet proof
                if (!(playlist instanceof Array)) {
                    return console.error('Playlist passed to cp.audio.music must be an array');
                } else {
                    // Cache the playlist
                    this.playlist = playlist;
                }

                // Load the first track
                this.setTrack();

                // Attach the event to play the next track
                this.el.addEventListener('ended', function() {
                    if (self.autoplay === false) return;

                    var callback = function() {
                        if (self.repeat) {
                            self.play();
                        } else {
                            self.next();
                        }
                    };

                    window.setTimeout(callback, self.delay);
                });
            },

            setDelay: function(seconds) {
                this.delay = cp.math.convert(seconds, 1000, 0, true);
            },

            setTrack: function() {
                if (this.el) {
                    this.el.src = cp.audio.url + this.playlist[this.count] + cp.audio.type;

                // Create audio track for the first time
                } else {
                    this.el = new Audio(cp.audio.url + this.playlist[this.count] + cp.audio.type);
                }
            },

            // Return the name of the current track
            getTrack: function() {
                var src = this.el.src;

                // Strip off the file type
                src = src.replace(cp.audio.type, '');

                // Return just the name and nothing else of the url
                var explode = src.split('/');
                return explode.pop();
            },

            // Fade effect
            /*
             end (int) = 0 to 1 volume lv
             duration (int) = Time in seconds for the fade to span over ex. 1.25
             stop (function) = Extra logic to execute upon completion
            */
            fade: function(volumeEnd, duration, stop) {
                var self = this;

                var volumeStart = this.el.volume;
                var volumeDifference = (volumeEnd - volumeStart).toFixed(1);

                var timer = new cp.timer(duration);

                var callback = function() {
                    if (!timer.expire()) {
                        // Find the percentage of the time passed
                        var timePast = (timer.past() / duration).toFixed(2);

                        // Multiply time passed by the difference to get a volume
                        var volume = Math.round(((volumeDifference * timePast) + volumeStart) * 1000) / 1000;

                        if (volume < 0)
                            self.el.volume = 0;
                        else if (volume > 1)
                            self.el.volume = 1;
                        else
                            self.el.volume = volume;
                    } else {
                        self.el.volume = volumeEnd;

                        if (stop !== undefined)
                            stop();

                        clearInterval(this.fading);
                    }
                }

                this.fading = window.setInterval(callback, 20);
            },

            /* Controls */
            // Play currently location or pass an optional index for the playlist array
            play: function(index) {
                // No index, play as normal
                if (index === undefined) {
                    this.el.play();

                // Otherwise load and play the new index
                } else {
                    this.count = index;
                    this.setTrack();
                    this.el.play();
                }
            },

            playRandom: function() {
                var index = cp.math.random(this.playlist.length, 0);
                this.play(index);
            },

            restart: function() {
                this.el.currentTime = 0;
                this.play();
            },

            stop: function() {
                this.el.pause();
                this.el.currentTime = 0;
            },

            pause: function() {
                this.el.pause();
            },

            // Play next track
            next: function() {
                 this.count++;

                // Verify the next counter doesn't exceed the array length
                if (this.count >= this.playlist.length) {
                    if (this.loop) {
                        this.count = 0;
                    // Exit early nothing to play
                    } else {
                        return;
                    }
                }

                // Load up the new src and play
                this.stop();
                this.play(this.count);
            },

            // Play previous track
            previous: function() {
                this.count--;

                // Verify the prev counter doesn't exceed the array length
                if (this.count < 0) {
                    if (this.loop) {
                        this.count = this.playlist.length - 1;
                    // Exit early, nothing to play
                    } else {
                        return;
                    }
                }

                // Load up the new src and play
                this.stop();
                this.play(this.count);
            },

            // Set volume 0 to 1
            volume: function(num) {
                this.el.volume = num;
            },

            // Add a new track to the end of the playlist
            // add (string) = Name of the file without the file type
            add: function(name) {
                this.playlist.push(name);
            },

            // Removes a track by array index
            remove: function(index) {
                this.playlist.splice(index, 1);
            }
        }
    };
}(cp));/*
Name: Local Storage API Access
Version: 1
Desc: Allows you to save, update, and change local storage data
on the fly.

Reference: https://developer.mozilla.org/en/DOM/Storage

Example usage:
- Save
  cp.storage.save('name', 'Joe');

- Remove
  cp.storage.remove('name');

- Get
  cp.storage.get('name');

TODO: Might want to consider providing some kind of system crash error in-case
the user has local storage disabled for some stupid reason.

TODO: Add a cached version of storage as JSON if its faster to access, example:
    storage: {},
    build: function() {
        // Reset current storage
        this.storage = {};

        // Start loop
        for (var i = sessionStorage.length; i--;){
            // Get the storage key
            var key = sessionStorage.key(i);

            // Get the result
            var result = this.get(key);

            // Dump gathered data into JSON object
            this.storage[key] = result;
        }
    }

*/

var cp = cp || {};

(function(cp) {
    var _support = function() {
        try {
            cp.storage.save('test', 'asdf');
            cp.storage.remove('test');
            return true;
        } catch(e) {
            return false;
        }
    };

    cp.storage = {
        init: function() {
            if (! _support) {
                return alert('Local storage is broken or disabled, please enable it to continue.');
            }
        },

        // Saves the passed parameter with a key or tag reference
        save: function(key, value) {
            // Set local storage data internally
            sessionStorage.setItem(key, value);
        },

        // Gets select data, should be using build to retrieve
        get: function(key) {
            var result = sessionStorage.getItem(key);

            return result;
        },

        // Removes the passed paramater
        remove: function(key) {
            // Set local data
            sessionStorage.removeItem(key);
        }
    };
}(cp));/*
Name: Entity creation and class storage
Version: 1
Desc: Allows users to create new entities with pre-built properties.
Also doubles as a storage container for new classes (prevents global
variable polution).

TODO: Is there a better way to handle setting and removing animations
*/

var cp = cp || {};

(function(cp) {
    // Contains all information relative to animations
    cp.template = {
        Entity: Class.extend({
            x: 0,
            y: 0,
            width: 0,
            height: 0,

            // Offsets the image from the hitbox
            offset: {
                x: 0,
                y: 0
            },

            flip: {
                x: false,
                y: false
            },

            // All elements get 1 hp by default
            hp: 1,

            // Collision detection type
            // friendly = a, enemy = b, passive = 0 (yes, its a zero and not the letter o)
            type: 0,

            // zIndex used to determine object order in the array
            zIndex: false,

            // placeholders to detect animation id change
            // Must be a -1 to be detected easily, decreases logic because there are no -1 ids ever
            animCur: {
                id: -1
            },
            animSet: {
                id: -1
            },

            // place code before each draw sequence here
            update: function() {
                this.animNew();

                // Call this._super() to continue drawing
            },

            draw: function() {
                // If an animation sheet has been set, it will fired here
                if (this.animCur.id != -1) {
                    this.animSet.crop(this);
                }

                // Output debug box
                if (cp.debug.showCollisions === true) {
                    cp.ctx.fillStyle = '#f00';
                    cp.ctx.globalAlpha = .7;
                    cp.ctx.fillRect(this.x, this.y, this.width, this.height);
                    cp.ctx.globalAlpha = 1;
                }

                // Call this._super() to continue drawing
            },

            // Passes back the collided object when a collision between two elements occurs
            collide: function(obj) {

            },

            kill: function() {
                // Push into the graveyard for removal post loop processing to
                // prevent referencing a non-existent objects.
                cp.core.graveyard.push(this);
            },

            // check if set animation has changed
            animNew: function() {
                if (this.animSet.id != this.animCur.id) {
                    // clear any running intervals to be sure they don't also fire
                    this.animCur.active = false;
                    clearInterval(this.animCur.animRun);

                    // Set animation to active
                    this.animSet.active = true;

                    // Start new interval
                    this.animSet.run();
                    this.animCur = this.animSet;
                }
            }
        })
    };
}(cp));/*
Name: Timers
Version: 1.3
Desc: Allows users to create a new timer object. Calculated in seconds up to 2 decimal places.
Example usage: new cp.timer(3.25);

TODO: Methods need to be renamed to better names
TODO: Capitalize Timer object name
TODO: Craete method to return different kinds of time such as total time passed, how long it expired, ect
TODO: Reset is currently inneficient, should be able to reset it to the inital state
TODO: Should be subjective to the delta value from req anim frame
*/

var cp = cp || {};

(function(cp) {
    cp.timer = Asset.extend({
        // Time is passed in seconds, not milliseconds
        init: function(time) {
            // Convert time and store it as milliseconds
            this.set(time);

            // Set the timer upon creation
            this.reset();
        },

        // Allows a user to force override the duration by bassing a number in seconds
        set: function(time) {
            // Convert time to milliseconds
            time = cp.math.convert(time, 1000, 0, true);

            // Force override duration
            return this.duration = time;
        },

        // Gets the total time passed and returns it in seconds
        past: function() {
            // Get the current time in milleseconds
            var time = this.compare();

            // Return time in seconds
            return cp.math.convert(time, 1000, 2);
        },

        // Returns the total time passed in milliseconds
        compare: function() {
            return Date.now() - this.start;
        },

        // Resets a timer to the current time
        reset: function() {
            return this.start = Date.now();
        },

        // Checks if a timer has expired
        expire: function() {
            // Check if duration has been passed
            if (this.compare() >= this.duration) {
                return true;
            } else {
                return false;
            }
        }
    });
}(cp));/*
 *A quick demo of working with animation sheets and what you can do
*/

cp.template.AnimTest = cp.template.Entity.extend({
    width: 10,
    height: 10,
    x: 100,
    y: 100,
    speed: 3,

    // Push it away from the current width and height box
    offset: {
        x: -18,
        y: -50
    },
    // Flip the axis
    flip: {
        x: true,
        y: false
    },
    // 0 to 360 degrees
    angle: 45,
    zIndex: 1,

    // Transparency
    alpha: .7,

    init: function() {
        // Create and set an animation sheet (image, frame width, frame height)
        var animSheet = new cp.animate.sheet('decaf.png', 50, 90);

        // Choose a particular animation sequence from the sheet
        // Anim(sheet, speed in seconds, frame order, repeat)
        this.animPop = new cp.animate.cycle(animSheet, 1, [0, 1, 2], true);

        // Not used, but multiple animations can be created like this
        this.animStand = new cp.animate.cycle(animSheet, 1, [0]);

        // Set the current animation, can also be changed in the update
        this.animSet = this.animPop;
    },

    update: function() {
        // Calls parent function and necessary animation update checks
        this._super();

        // Literally resets the entire animation and runs it, good for conditionally firing a set animation
        // animRun.reset();

        // Re-ordering items (similar to CSS z-indexing except it just changes the draw order)
        // cp.game.sort();

        // this.x += this.speed;
        // this.y += this.speed;
    },

    draw: function() {
        // Calls crop and display if a sheet was set
        this._super();
    }
});/*
 *A quick demo of working with animation sheets and what you can do
*/

cp.template.Image = cp.template.Entity.extend({
    width: 10,
    height: 10,
    x: 150,
    y: 150,
    
    init: function() {
        // Create and set an animation sheet (image, frame width, frame height)
        var animSheet = new cp.animate.sheet('100.jpg', 400, 100);
        
        // Not used, but multiple animations can be created like this
        this.animStand = new cp.animate.cycle(animSheet, 1, [0]);
        
        // Set the current animation, can also be changed in the update
        this.animSet = this.animStand;
    }
});/*
 * A quick demo of sound usage.
*/

cp.template.SoundTest = cp.template.Entity.extend({   
    init: function() {
        // Create a playlist and run it
        //cp.audio.music.init(['crash', 'nuclear-launch', 'ride-warning'], { 'loop': true });
        //cp.audio.music.play();
        
        this.sound = new cp.audio.Sound('ride-warning');
    },
    
    update: function() {
        if (this.test === undefined) {
            this.sound.play();
            this.test = 'string';
        } 
    }
});cp.template.KeyTest = cp.template.Entity.extend({
    init: function() {
        cp.input.bind('arrowUp', 'jump');
        cp.input.bind('arrowLeft', 'left');
    },
    update: function() {
        if (cp.input.down('jump')) {
            console.log('jump: down');
        }

        if (cp.input.down('left')) {
            console.log('left: down');
        }

        if (cp.input.up('jump')) {
            console.log('jump: up');
        }

        if (cp.input.up('left')) {
            console.log('left: up');
        }

        if (cp.input.press('jump')) {
            console.log('jump: press');
        }

        if (cp.input.press('left')) {
            console.log('left: press');
        }

        if (cp.input.mouse) {
            //console.log('Mouse X/Y: ' + cp.input.mouse.x + ' ' + cp.input.mouse.y);
        }
    }
});/*------------
Running The Game
-----------*/
console.log(cp);

// List of scripts to load from js/objects
// 
cp.load.loadFiles = ['camera-test'];
cp.debug.active = true;
cp.debug.showCollisions = true;

// init(width, height, run onLoad function)
cp.core.init(500, 500, function() {
    cp.game.spawn('Player');
    cp.game.spawn('Objects');
});