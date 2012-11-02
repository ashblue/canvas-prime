/*
Name: Animation Sheets and Controls
Version: 1
Desc: Allows users to create new animation sheets and control them.

Notes: To pre-load images, the script relies on the init

To-Do: Add logic for objects loading with cp.imgCount and cp.imgLoaded
*/

var cp = cp || {};

(function (cp) {
    cp.game = {
        // TODO: Currently broken and needs a complete re-write, DO NOT USE!!!
        // Manually force sorts all items present on the screen based upon their zIndex
        sort: function(loc) {
            // Loop through storage
                // Get all elements with a zIndex
                // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort

            // Get index of this
            var index = cp.storage.indexOf(this);

            // Delete old location
            cp.storage.splice(index, 1);

            // Inject new location
            cp.storage.splice(loc, 0, this);
        },

        // You may get all entities by a contained value name.
        // Second parameters is a filter that will only retrieve the value
        // if it matches.
        entityGetVal: function(name, val) {
            // Setup stack for storage
            var stack = [];

            // Loop through objects and get matched value
            if (val !== undefined) { // Incase no val was passed
                for (var j in cp.core.storage) {
                    if (cp.core.storage[j][(name)] == val) stack.push(cp.core.storage[j]);
                }
            } else {
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

            // Apply the passed parameters to init
            if (arguments.length > 1 && entity.init) {
                // Remove name argument
                var args = [].slice.call(arguments, 1);
                // Fire the init with proper arguments
                entity.init.apply(entity, args);
            } else if (entity.init) {
                entity.init();
            }

            // Pushes your new variable into an array
            cp.core.storage.push(entity);
            entity.id = cp.core.idNew();

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
        // TODO: Place in core.js
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
}(cp));