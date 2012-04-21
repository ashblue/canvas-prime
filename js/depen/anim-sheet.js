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
    flip: false,
    repeat: false,
    
    // Should take a callback that can tweak settings such as opacity,
    // flip, ect
    init: function(sheet, interval, frames, callback) {
        this.id();
        
        // Store information for future usage
        this.sheet = sheet,
        this.speed = interval,
        this.frames = frames;
        
        // execute callback
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
        if (this.current < this.frames.length) {
            // Next animation
            this.current++;
        } else if (this.repeat) { // repeat if set
            this.current = 0;
        } else { // kill the entire animation, must be done outside of the cycle
            clearInterval(this.animRun);
            console.log('i have cleared');
        }
    },
    
    // return current animation
    get: function() {
        // get current animation
        var sheetLoc = this.frames[this.current];
        
        // Return the animations x and y coordinates for drawing
        return this.sheet.map[sheetLoc];
    },
    
    // Restarts the animation for the first frame
    reset: function() {
        
    },
    
    // Increments universal IDs placed on all objects, needs to be put into the core of the game engine
    id: function() {
        // remove this later
        if (! Game.idAsset)
            Game.idAsset = 0;
        
        // keep this
        this.id = Game.idAsset;
        Game.idAsset++;
    }
});