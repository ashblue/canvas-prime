/*
Name: Animation Sheets and Controls
Version: 1
Desc: Allows users to create new animation sheets and control them.

To-Do:
- Rotate needs a paramter for point of angle from the passed object, defaults to the middle
  currently.
*/

var cp = cp || {};

cp.animate = {
    // Creates an animation sheet, should only be run in an objects init
    // due to the processing intensity.
    sheet: Asset.extend({
        init: function(file, frameW, frameH) {
            var self = this;
            
            // Set animation width and height
            this.frameW = frameW;
            this.frameH = frameH;
                        
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
            var countHorizontal = (this.width / this.frameW).toFixed();
            
            // count vertical spaces
            var countVertical = (this.height / this.frameH).toFixed();
            
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
            
            //this.current = this.frames[0];
        },
        
        // Infinitely loop animation
        repeat: false,
        
        // Set alpha transparency
        alpha: 1,
        
        // Current frame
        current: 0,
        
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