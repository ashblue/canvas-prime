/*
 *A quick demo of working with animation sheets and what you can do
 * NOTE: Ninja flip is slightly offset because the animation sheet is screwed up, need to fix
*/

var animTest = Entity.extend({
    width: 129,
    height: 68,
    x: 0,
    y: 100,
    speed: 3,
    
    init: function() {
        // Create and set an animation sheet
        var animSheet = new AnimSheet('character.png', 129, 68);
        
        // Choose a particular animation sequence from the sheet
        // Anim(sheet, speed in milli, frame order, opt params)
        this.animRun = new Anim(animSheet, 150, [12, 13], {
            repeat: true,
            alpha: 1,
            offsetX: 0,
            offsetY: 0,
            flipX: false,
            flipY: false
        });
        
        // Not used, but multiple animations can be created like this
        this.animStand = new Anim(animSheet, 100, [11]);
        
        // Set the current animation, can also be changed in the update
        this.animSet = this.animRun;
    },
    
    update: function() {
        // Calls parent function and necessary animation update checks
        this._super();

        // Literally resets the entire animation and runs it, good for conditionally firing a set animation
        // animRun.reset();
        
        // Test for re-ordering items (similar to CSS z-indexing except it just changes the draw order)
        if (! this.test) {
            this.test = true;
            
            // Set to first item in draw order, current an issue with this firing in init, must be fired in
            // update until fixed.
            this.order(0);
        }
        
        // Makes ninja run back and forth for demo purposes
        if (this.x < 52) { // negative on canvas
            this.speed = 3;
            this.animRun.flipX = false;
            this.animRun.offsetX = -52;
        } else if (this.x > Game.width - 12) { // outside canvas bounds
            this.speed = -3;
            this.animRun.flipX = true;
            this.animRun.offsetX = 0;
        } else if (this.animRun.flipX == true &&
            this.x < 80) // slow when reaching left wall
            this.speed += .15;
        else if (this.animRun.flipX == false  &&
            this.x > Game.width - 40) { // slow when reaching right wall
            this.speed -= .15;
        }
        
        this.x += this.speed;
    },
    
    draw: function() {
        // Calls crop and display if a sheet was set
        this._super();
    }
});