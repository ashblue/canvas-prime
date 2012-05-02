/*
Name: Animation Sheets and Controls
Version: 1
Desc: Allows users to create new animation sheets and control them.

Notes: To pre-load images, the script relies on the init

To-Do: Add logic for objects loading with cp.imgCount and cp.imgLoaded
*/

var cp = cp || {};

cp.game = {
    // An incremental id counter added to each newly created asset (gives it a unique id)
    id: 1,
    
    // You may get all entities by a contained value name.
    // Second parameters is a filter that will only retrieve the value
    // if it matches.
    entityGetVal: function(name, val) {
        // Setup stack for storage
        var stack = new Array;
        
        // Loop through objects and get matched value
        if (typeof val != 'undefined') { // Incase no val was passed
            for (var j in cp.core.storage) {
                if (cp.core.storage[j][(name)] == val) stack.push(cp.core.storage[j]);
            }
        }
        else {
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
    spawnEntity: function(name, x, y) {
        // window[] allows you to process its contents and treat it as a variable
        window['id' + this.id] = (new name);
        this.storage.push(window['id' + this.id].spawn(x, y)); // Pushes your new variable into an array and runs its spawn function
        window['id' + this.id].id = this.id;
        
        // Push into type storage for quicker collision detection
        switch (window['id' + this.id].type) {
            case 'a':
                this.typeA.push(window['id' + this.id]);
                break;
            case 'b':
                this.typeB.push(window['id' + this.id]);
                break;
            default:
                break;
        }
        
        this.id += 1; // Increment the id so the next shape is a unique variable
    },
    // spawnEntity should look more like this
    /* var blah = Class.extend({
        init: function(val) {
            this.text = val;
        }
    });
    
    var game = {
        id: 5,
        storage: [],
        create: function() {
            var item = new blah('one');
            this.storage.push(item);
            
            var item = new blah('two');
            this.storage.push(item);
            
            return this.storage;
        }
    } */
    
    // Used to destroy entities when necessary instead of doing it during the loop and potentially blowing
    // everything up by accident.
    graveyard: [],
    // Permanently erases all graveyard items at the end of a loop
    graveyardPurge: function() {
        if (this.graveyard) {
            for (var obj in cp.game.graveyard) {
                this.kill(cp.game.graveyard[obj]);
            }
            this.graveyard = [];
        }
    },
    kill: function(object) {
        // Run extra kill logic for object
        object.kill();
        
        // Remove from main storage
        for (var i in this.storage) {
            if (this.storage[i] == object)
                this.storage.splice(i,1);
        }
        
        // Remove from type storage
        switch (object.type) {
            case 'a':
                for (var i in this.typeA) {
                    if(this.typeA[i] == object)
                        this.typeA.splice(i,1);
                }
                break;
            case 'b':
                for (var i in this.typeB) {
                    if(this.typeB[i] == object)
                        this.typeB.splice(i,1);
                }
                break;
            default:
                break;
        }
        
        // Remove from main storage
        for (var i in this.storage) {
            if(this.storage[i] == object)
                this.storage.splice(i,1);
        }
        
        // Clean out of browser's memory permanently
        delete window['id' + object.id];
    },
    
    // Test if two square objects are overlapping, game's default collision logic
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