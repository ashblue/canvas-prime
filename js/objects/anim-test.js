/* To-do:
 * Finish anim-sheet helper functions
 * Integrate necessary animTest components into default object
 */

var animTest = Entity.extend({
    width: 129,
    height: 68,
    
    // Must be a negative 1 to be detected easily, decreases logic
    animCur: {
        id: -1
    },
    animSet: {
        id: -1
    },
    
    x: 0,
    y: 100,
    
    init: function() {
        // Create and set an animation sheet
        var animSheet = new AnimSheet('character.png', 129, 68);
        var animRun = new Anim(animSheet, 100, [1, 2, 1, 2, 1, 2], {
            repeat: false,
            alpha: 1,
            offsetX: 100,
            offsetY: 50,
            flipX: true,
            flipY: false
            
        });
        this.animSet = animRun;
    },
    
    update: function() {
        this.animNew();

        //this.x += 5;
        
        if (! this.test) {
            this.order(0);
            this.test = true;
        }
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
    },
    
    interval: function() {
        var self = this;
        return requestInterval(function() {self.animSet.cycle();}, self.animSet.speed);
    },
    
    // Moves an item in storage, normally used to force an item to draw on top of others
    order: function(loc) {
        console.log(Game.storage);
        
        // Get index of this
        var index = Game.storage.indexOf(this);
        
        // Delete old location
        Game.storage.splice(index, 1);
        
        // Flip the placement for injection by reversing the array placement
        inject = Game.storage.length - loc;
        
        // Inject new location
        Game.storage.splice(inject, 0, this);
        
    },
    
    draw: function() {
        if (this.animCur.id != -1) {
            this.animSet.crop(this.x, this.y, this.width, this.height);
        }
    }
});