/*
 *A quick demo of working with animation sheets and what you can do
*/

cp.template.AnimTest = cp.template.Entity.extend({
    width: 10,
    height: 10,
    x: 100,
    y: 100,
    speed: 3,
    offset: {
        x: -18,
        y: -50
    },
    flip: {
        x: true,
        y: false
    },
    angle: 45,
    zIndex: 1,
    
    alpha: .7,
    
    init: function() {
        // Create and set an animation sheet
        var animSheet = new cp.animate.sheet('decaf.png', 50, 90);
        
        // Choose a particular animation sequence from the sheet
        // Anim(sheet, speed in milli, frame order, opt params)
        this.animRun = new cp.animate.cycle(animSheet, .4, [0, 1, 2], true);
        
        // Not used, but multiple animations can be created like this
        this.animStand = new cp.animate.cycle(animSheet, 500, [11]);
        
        // Set the current animation, can also be changed in the update
        this.animSet = this.animRun;
    },
    
    update: function() {
        // Draws the actual hitbox of the object with a red box
        cp.ctx.fillStyle = '#f00';
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Calls parent function and necessary animation update checks
        this._super();

        // Literally resets the entire animation and runs it, good for conditionally firing a set animation
        // animRun.reset();
        
        // Re-ordering items (similar to CSS z-indexing except it just changes the draw order)
        cp.game.sort();
        
        this.x += this.speed;
        this.y += this.speed;
    },
    
    draw: function() {
        // Calls crop and display if a sheet was set
        this._super();
    }
});