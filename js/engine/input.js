/*
Name: Input monitoring and library
Version: 1
Desc: Handles all keyboard input by storing results inside an array that can be
checked and cleared. This is the only design patter that allows multiple keys to
be checked at one time.

Note: Needs to be self contained keyboard events that are created and/or destroyed. Right now its
super jacked up because all the events fire to the same place. Should just let users setup their
own keyboard events with an object that can be destroyed or created.
*/

var cp = cp || {};

cp.input = {
    init: function() {
        // Creates keyboard monitoring
        window.addEventListener('keydown', this.store, true);
        window.addEventListener('keyup', this.remove, true);
        
        // Mouse logic only relative to the Canvas
        cp.core.canvas.addEventListener('mousemove', this.move, true);
        cp.core.canvas.addEventListener('mousedown', this.store, true);
        cp.core.canvas.addEventListener('mouseup', this.remove, true);
    },
    
    // Container for storing all current keys
    storage: {},
    
    // Only contains binded keys
    active: {},
    
    // Key items ready for deletion
    graveyard: [],
    
    // Returns a mouse or keyboard key depending upon the called event
    getKey: function(e) {
        // Keyboards don't have the mouse's button property, check for it
        // to verify a keyboard is firing
        if (e.button === undefined) {
            return e.keyCode;
            
        // Mouse input, get the clicked button
        } else {
            return e.button;
        }
    },
    
    // Stores the current key event in an array
    store: function(e) {
        var key = cp.input.getKey(e);
        
        // Get current status of existing keyCode (if present)
        var status = cp.input.storage[key];
        
        // Set as active only if the existing key is not already set
        if ( ! status ) {
            cp.input.storage[key] = 'active';
        }
    },
    
    // Marks the current key for deletion
    remove: function(e) {
        var key = cp.input.getKey(e);
        
        cp.input.storage[key] = 'remove';
    },
    
    // Monitors active keys and modifies them as necessary from each frame
    // Note: This loop could be better optimized
    monitor: function() {        
        // Loop through all keyboard objects and modify as necessary
        for ( var key in this.storage ) {
            // Cache active object value for comparison only, cannot be set
            var item = this.storage[key];
            
            // If the item has been recently pressed set it to the down state
            if (item === 'active') {
                this.storage[key] = 'down';
                
            // After down has been set for one frame, change it to pressed
            } else if (item === 'down') {
                this.storage[key] = 'pressed';
                
            // After up has been set, change the status to delete
            } else if (item === 'remove') {
                this.storage[key] = 'up';
                
            // After a full frame has passed, delete the item out of existence
            } else if (item === 'up') {
                delete this.storage[key];
            }
        }
    },
    
    // Binds a key with a corresponding tag/name that can be referenced
    bind: function(key, tag) {
        // Convert key name to keycode
        key = this.library[key];
        
        // Store key value for reference later
        this.active[tag] = key;
    },
    
    // Unbinds a specific key
    unbind: function(tag) {
        delete this.active[tag];
    },
    
    // Complete key binding obliteration
    unbindAll: function() {
        this.active = [];
    },
    
    // Detects if a key has been pressed for one frame
    down: function(tag) {
        // Test if key was pressed
        if (this.storage[this.active[tag]] === 'down') {
            return true;
        } else {
            return false;
        }
    },
    
    // Detects if a key has been released within the current frame
    up: function(tag) {
        // Test if key was pressed
        if (this.storage[this.active[tag]] === 'up') {
            return true;
        } else {
            return false;
        }
    },
    
    // Returns true for pressed and disregards press and release's frame based rules
    press: function(tag) {
        // Cache state of storage item
        var state = this.storage[this.active[tag]];
        
        // Return true if anything exceupt up is pressed to prevent logic overlap
        if (state &&
        state !== 'up') {
            return true;
        } else {
            return false;
        }
    },
    
    // Special function relative to the mouse
    move: function(e) {
        cp.input.mouse = {
            x: e.offsetX,
            y: e.offsetY
        }
    },
    
    // Archived library so you don't have to remember the keyboard event code
    library: {
        // Mouse
        'clickLeft': 0,
        'clickMiddle': 1,
        'clickRight': 2,
        
        // Primary
        'enter': 13,
        'tab': 9,
        'esc': 27,
        'space': 32,
        'backspace': 8,
        
        // Modifiers
        'shift': 16,
        'ctrl': 17,
        'alt': 18,
        'capsLock': 20,
        
        // Symbol keys (use at own risk outside of Mozilla and Chrome)
        ';': 59,
        '=': 61,
        ',': 188,
        '-': 109,
        '.': 190,
        '/': 191,
        '`': 192, // aka ~
        '[': 219,
        ']': 221,
        
        // Special keys
        'insert': 45,
        'delete': 46,
        'home': 36,
        'end': 35,
        'pageUp': 33,
        'pageDown': 34,
        
        // Arrows
        'arrowUp': 38,
        'arrowDown': 40,
        'arrowLeft': 37,
        'arrowRight': 39,
        
        // Numbers
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        
        // Num lock
        'num0': 96,
        'num1': 97,
        'num2': 98,
        'num3': 99,
        'num4': 100,
        'num5': 101,
        'num6': 102,
        'num7': 103,
        'num8': 104,
        'num9': 105,
        'num*': 106, 
        'num+': 107, 
        'num-': 108, 
        'numLock': 144,
        'num.': 110,
        'num/': 111,
        
        // Letters
        'a': 65,
        'b': 66,
        'c': 67,
        'd': 68,
        'e': 69,
        'f': 70,
        'g': 71,
        'h': 72,
        'i': 73,
        'j': 74,
        'k': 75,
        'l': 76,
        'm': 77,
        'n': 78,
        'o': 79,
        'p': 80,
        'q': 81,
        'r': 82,
        's': 83,
        't': 84,
        'u': 85,
        'v': 86,
        'w': 87,
        'x': 88,
        'y': 89,
        'z': 90,
        
        // F keys
        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123
    }
};