/*
Name: Animation Sheets and Controls
Version: 1
Desc: Allows users to create new animation sheets and control them.

Notes: To pre-load images, the script relies on the init

To-Do:
- It may be possible to cache an animation sheet and re-use it for
  other objects. Would save a lot of processing power.
  Not too sure how to do this though.
*/

var cp = cp || {};

cp.animate = {
    // Creates an animation sheet, should only be run in an objects init
    // due to the processing intensity.
    sheet: Class.extend({
        init: function(file, frameW, frameH) {
            var self = this;
            
            // Set animation width and height
            this.frame.width = frameW;
            this.frame.height = frameH;
                        
            // Create url string
            this.url = this.path + file;
            
            // Get image and create it
            this.img = new Image();
            this.img.src = this.url;
            this.img.onload = function() {
                self.width = self.img.width;
                self.height = self.img.height;
                
                // Since everything has been loaded for the image, slice it
                self.slice();
            }
        },
        
        // Path to images
        path: 'images/',
        
        // Create a frame variable to store various frame details
        frame: {},
        
        // Creates an array to map out and store frames
        map: [],
        
        // Slices the image up and stores it inside map
        // Slices horizontally first, then startes on a new line, just like a typewriter
        slice: function() {
            // count horizontal spaces
            var countHorizontal = (this.width / this.frame.width).toFixed();
            
            // count vertical spaces
            var countVertical = (this.height / this.frame.height).toFixed();
            
            // for each vertical space
            for ( var height = countVertical; height--; ) {
                // for each horizontal space setup x and y coordinates
                for ( var slice = countHorizontal; slice--; ) {
                    // Push a new x and y array object for the current frame
                    this.map.push({
                        x: this.frame.width * slice,
                        y: this.frame.height * height
                    });
                }
            }
        }
    }),

    // Setup an animation sequence that can be cached
    cycle: Class.extend({
        // Takes information relevant to the particular animation and an object
        // to quickly set various parameters
        init: function(sheet, interval, frames, obj) {
            this.id();
            
            // Store information for future usage
            this.sheet = sheet,
            this.speed = interval,
            this.frames = frames;
            this.quickSet(obj);
        },
        
        // Infinitely loop animation
        repeat: false,
        
        /* Note: alpha should be part of the sheet, its part of an entity */
        // Set alpha transparency
        alpha: 1,
        
        /* Note: currently broken */
        // Completely flip the axis
        flipX: false,
        flipY: false,
        
        // modify the returned image location, will make the image not line up with its container
        offsetX: 0,
        offsetY: 0,
        
        /* Note: should be part of the core and re-usable */
        // a shortcut for quickly setting params via processing an object
        quickSet: function(params) {
            for (var par in params) {
                this[par] = params[par];
            }
        },
        
        // Current frame
        current: 0,
        
        // Starts up the animation
        run: function() {
            var self = this;
            this.animRun = setInterval(function() {self.cycle();}, self.speed);
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
        crop: function(x, y, width, height) {
            // dump image x and y data fur current frame
            var img = this.get();
            
            // Set alpha
            cp.ctx.globalAlpha = this.alpha;
            
            // Canvas locations (setup for manipulation by flipping)
            var canvasX = x + this.offsetX;
            var canvasY = y + this.offsetY;
            
            // Flip image?
            // Note translate is intense, look for an alternative and prevent this from firing as much as possible
            if (this.flipX) {
                var horiz = -1;
                // X coordinate must be reversed
                canvasX = canvasX * horiz;
            } else {
                var horiz = 1;
            }
            
            if (this.flipY) {
                var vert = -1;
                // Reverse y and add difference in height
                canvasY = canvasY * vert - this.sheet.frame.height;
            } else {
                var vert = 1;
            }
            
            // Set scale initally
            cp.ctx.scale(horiz, vert);
            
            // Draw the image
            cp.ctx.drawImage(
                this.sheet.img, // img
                img.x, // crop x location
                img.y, // crop y location
                this.sheet.frame.width, // width of crop window
                this.sheet.frame.height, // height of crop window
                canvasX, // canvas x location
                canvasY,// canvas y location
                this.sheet.frame.width, // canvas width
                this.sheet.frame.height // canvas height
            );
            
            // Fix Set alpha, probably a better way to do this by including it in the core draw() object
            cp.ctx.globalAlpha = 1;
            cp.ctx.scale(horiz, vert);
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
        },
        
        /* Note: Remove this and set id in init() */
        // Increments universal IDs placed on all objects, needs to be put into the core of the game engine.
        // Currently an ID incrementer already exists, need to be modified to take into account animation sheets too.
        id: function() {
            // remove this later by adding it to the game core
            if (! cp.core.idAsset)
                cp.core.idAsset = 0;
            
            // keep this
            this.id = cp.core.idAsset;
            cp.core.idAsset++;
        }
    })
};