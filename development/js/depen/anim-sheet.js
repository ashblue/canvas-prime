/*
Name: Animation Sheets and Controls
Version: .01
Desc: Allows users to create new animation sheets and control them.

Notes: To pre-load images, the script relies on the init

To-Do: Add logic for objects loading with Game.imgCount and Game.imgLoaded
*/
var AnimSheet = Class.extend({
    pathImgs: 'images/',
    
    init: function(file, animW, animH) {
        var self = this;
        
        // create url string
        this.url = this.pathImgs + file;
        
        // Set animation width and height
        this.animWidth = animW;
        this.animHeight = animH;
        
        // get image
        this.img = new Image();
        this.img.src = this.url;
        this.img.onload = function() {
            self.width = self.img.width;
            self.height = self.img.height;
            
            self.imgSlice();
        }
    },
    
    map: new Array(),
    imgSlice: function() {
        // count horizontal spaces
        var horizCount = Math.round(this.width / this.animWidth);
        
        // count vertical spaces
        var vertCount = Math.round(this.height / this.animHeight);
        
        // for each vertical space
        for (var height = 0; height < vertCount; height++) {
            // for each horizontal space setup x and y coordinates
            for (var slice = 0; slice < horizCount; slice++) {
                // Push a new x and y array item for the current sheet item
                this.map.push({
                    x: this.animWidth * slice,
                    y: this.animHeight * height
                });
            }
        }
    }
});

// Setup an animation that can be cached
var Anim = Class.extend({
    // Infinitely loop animation
    repeat: false,
    
    // Set alpha transparency
    alpha: 1,
    
    // Completely flip the axis
    flipX: false,
    flipY: false,
    
    // modify the returned image location, will make the image not line up with its container
    offsetX: 0,
    offsetY: 0,
    
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
    
    // a shortcut for quickly setting params via processing an object
    quickSet: function(params) {
        for (var par in params) {
            this[par] = params[par];
        }
    },
    
    current: 0,
    /*
     * Emergency fix NEEDED!
     * In order for cycle animations to work, a base set of time need to be composed.
     * This means two very important things. Update needs to be based upon a setinterval and draw
     * based on a requestAnimation frame.
     * 
     * Handeling the game in this manner makes sure that updates occur in
     *
     * Not doing things in this manner will make the entire game subjective to request animation frame's
     * speed. Which means your update logic may fire at an extremely low rate and make the game run
     * very slow. Since request animation frame fluctuates, it can make the game's speed extremely
     * volatile and inconsistent.
     *
     * Timers should be based upon real time, not requestAnimation frame.
    */
    
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
        Game.ctx.globalAlpha = this.alpha;
        
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
            canvasY = canvasY * vert - this.sheet.animHeight;
        } else {
            var vert = 1;
        }
        
        // Set scale initally
        Game.ctx.scale(horiz, vert);
        
        // Draw the image
        Game.ctx.drawImage(
            this.sheet.img, // img
            img.x, // crop x location
            img.y, // crop y location
            this.sheet.animWidth, // width of crop window
            this.sheet.animHeight, // height of crop window
            canvasX, // canvas x location
            canvasY,// canvas y location
            this.sheet.animWidth, // canvas width
            this.sheet.animHeight // canvas height
        );
        
        // Fix Set alpha, probably a better way to do this by including it in the core draw() object
        Game.ctx.globalAlpha = 1;
        Game.ctx.scale(horiz, vert);
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
    
    // Increments universal IDs placed on all objects, needs to be put into the core of the game engine.
    // Currently an ID incrementer already exists, need to be modified to take into account animation sheets too.
    id: function() {
        // remove this later by adding it to the game core
        if (! Game.idAsset)
            Game.idAsset = 0;
        
        // keep this
        this.id = Game.idAsset;
        Game.idAsset++;
    }
});