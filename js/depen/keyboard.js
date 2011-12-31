/*
 --- Info ---
Name: Keyboard controller
Version: .2
Desc: Handles all keyboard input.
*/

var Input = {
    key: {
        press: '',
        up: '',
        push: '',
        set: true
    }
};
var Keyboard = Class.extend({
    input: {
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
    
    // Removes default keyboard shortcuts native to browser
    setup: function() {
        window.addEventListener('keydown', this.down, true);
        window.addEventListener('keyup', this.up, true);
    },
    
    // Window key monitoring
    down: function(event) {
        Input.key.down = event.which;
        if (Input.key.set == true) {
            Input.key.push = event.which;
            Input.key.set = false;
        }
    },
    up: function(event) {
        Input.key.up = event.which;
        Input.key.set = true;
    },
    
    // Test if a key is currently being held down
    monitor: function() {
        if (Input.key.down == Input.key.up) Input.key.down = Input.key.up = '';
        Input.key.push = '';
    },
    
    // Key true or false processing functions
    press: function(k) {
        if (Input.key.down == this.input[k])
            return true;
        else {
            return false;
        }
    },
    push: function(k) {
        if (Input.key.push == this.input[k])
            return true;
        else {
            return false;
        }
    }
});