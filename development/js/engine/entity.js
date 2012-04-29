/*
Name: Entity pallete
Version: 1
Desc: Allows users to create new entities with pre-built properties.
*/

var cp = cp || {};

// Contains all information relative to animations
cp.entity = Class.extend({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    
    // All elements get 1 hp by default
    hp: 1,
    
    // Collision detection type
    // friendly = a, enemy = b, passive = 0 (yes, its a zero and not the letter o)
    type: 0,
    
    // placeholders to detect animation id change
    // Must be a -1 to be detected easily, decreases logic because there are no -1 ids ever
    animCur: {
        id: -1
    },
    animSet: {
        id: -1
    },

    update: function() {
        this.animNew();
        
        // place code before each draw sequence here
    },
    collide: function(object) {
        // What happens when elements collide?
    },
    draw: function() {
        // If an animation sheet has been set, it will fired here
        if (this.animCur.id != -1) {
            this.animSet.crop(this.x, this.y, this.width, this.height);
        }
    },
    spawn: function(x,y) {
        if (x) this.x = x;
        if (y) this.y = y;

        return this;
    },
    kill: function() {
        Graveyard.push(this);
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
    
    // Moves an item in storage, normally used to force an item to draw on top of others
    // Might be better to give each object a z-index and take that into account when re-ordering via order
    order: function(loc) {        
        // Get index of this
        var index = cp.storage.indexOf(this);
        
        // Delete old location
        cp.storage.splice(index, 1);
        
        // Flip the placement for injection by reversing the array placement
        inject = cp.storage.length - loc;
        
        // Inject new location
        cp.storage.splice(inject, 0, this);
    }
});