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
    spawn: function(name, x, y) {        
        // Create the entity and temporarily store it for reference purposes
        var entity = new cp.template[name];
        
        cp.core.storage.push(entity.spawn(x, y)); // Pushes your new variable into an array and runs its spawn function
        entity.id = cp.core.id;
        
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