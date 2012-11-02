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

(function (cp) {
    // Returns a mouse or keyboard key depending upon the called event
    var _getKey = function(e) {
        // Keyboards don't have the mouse's button property, check for it
        // to verify a keyboard is firing
        if (e.button === undefined) {
            return e.keyCode;

        // Mouse input, get the clicked button
        } else {
            return e.button;
        }
    },

    // Special function relative to the mouse
    _mouseMove = function(e) {
        cp.input.mouse.x = e.offsetX;
        cp.input.mouse.y = e.offsetY;
    },

    // Logic for when the mouse doesn't hover over the Canvas
    _mouseOut = function(e) {
        cp.input.mouse.x = null;
        cp.input.mouse.y = null;
    },

    // Marks the current key for deletion
    _remove = function(e) {
        var key = _getKey(e);
        _storage[key] = 'remove';
    },

    // Stores the current key event in an array and sets it to active
    _store = function(e) {
        var key = _getKey(e);

        // Get current status of existing keyCode (if present)
        var status = _storage[key];

        // Set as active only if the existing key is not already set
        if ( ! status ) {
            _storage[key] = 'active';
        }
    },

    // Archived library so you don't have to remember the keyboard event code
    _library = {
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
    },

    _storage = {}, // Container for storing all pressed keys
    _active = {}; // Only contains binded keys

    cp.input = {
        mouse: {
            x: false,
            y: false
        },

        init: function() {
            // Creates keyboard monitoring
            window.addEventListener('keydown', _store, true);
            window.addEventListener('keyup', _remove, true);

            // Mouse logic only relative to the Canvas
            cp.ctx.canvas.addEventListener('mousemove', _mouseMove, true);
            cp.ctx.canvas.addEventListener('mouseout', _mouseOut, true);
            cp.ctx.canvas.addEventListener('mousedown', _store, true);
            cp.ctx.canvas.addEventListener('mouseup', _remove, true);
        },

        // TODO: This loop could be better optimized, verify down, press, and up all fire in order
        // Monitors active keys and modifies them as necessary from each frame
        // Be aware that in a console it looks like press occurs before down and up,
        // this is not true. In face, they are firing at the exact same time.
        monitor: function() {
            // Loop through all keyboard objects and modify as necessary
            for ( var key in _storage ) {
                // Cache active object value for comparison only, cannot be set
                var item = _storage[key];

                // If the item has been recently pressed set it to the down state
                if (item === 'active') {
                    _storage[key] = 'down';

                // After down has been set for one frame, change it to pressed
                } else if (item === 'down') {
                    _storage[key] = 'pressed';

                // After up has been set, change the status to delete
                } else if (item === 'remove') {
                    _storage[key] = 'up';

                // After a full frame has passed, delete the item out of existence
                } else if (item === 'up') {
                    delete _storage[key];
                }
            }
        },

        // Binds a key with a corresponding tag/name that can be referenced
        bind: function(key, tag) {
            // Convert key name to keycode
            key = _library[key];

            // Store key value for reference later
            _active[tag] = key;
        },

        // Unbinds a specific key or all keys if no tag param is passed
        unbind: function(tag) {
            if (tag !== undefined) {
                delete _active[tag];
            } else {
                _active = {};
            }
        },

        // Detects if a key has been pressed for one frame
        down: function(tag) {
            return _storage[_active[tag]] === 'down';
        },

        // Detects if a key has been released within the current frame
        up: function(tag) {
            return _storage[_active[tag]] === 'up';
        },

        // Returns true for pressed and disregards press and release's frame based rules
        press: function(tag) {
            // Cache state of storage item
            var state = _storage[_active[tag]];

            // Return true if anything exceupt up is pressed to prevent logic overlap
            if (state &&
            state !== 'up') {
                return true;
            } else {
                return false;
            }
        }
    };
}(cp));