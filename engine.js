/*
Name: Canvas Prime
Version: Alpha 0.2
Repository: https://github.com/ashblue/canvas-prime


--- Credits ---
Author: Ashton Blue
URL: http://blueashes.com
Twitter: http://twitter.com/#!/ashbluewd


--- To-Do ---
- Asset loading screen

- Timer creation / handeling

- Add image handler
-- Image loader w/ ...
-- Flip function for object images
-- Image animation handler

- Controller support
-- Keyboard keys
-- Mouse position
-- Mouse click and move
*/

/*----------
 Dependencies
----------*/
// How to figure out what a user's computer can handle for frames with fallbacks
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame   || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
    };
})();

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
*/
// Inspired by base2 and Prototype
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    this.Class = function(){};
    
    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;
        
        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && 
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
                return function() {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);        
                    this._super = tmp;
                    
                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }
        
        // Populate our constructed prototype object
        Class.prototype = prototype;
        
        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;
    
        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();


/*---------
 Core game logic
---------*/
var Engine = Class.extend({
    /* ----- Default Values -----*/
    canvas: document.getElementById("canvas"),
    width: 500,
    height: 500,
    storage: new Array(),
    id: 0,
    
    /* ----- Utilities -----*/
    spawnEntity: function(name, x, y) {
        // window[] allows you to process its contents and treat it as a variable
        // eval() will process its contents before the variable can grab it
        window['id' + this.id] = eval(new name);
        this.storage.push(window['id' + this.id].spawn(x, y)); // Pushes your new variable into an array and runs its spawn function
        this.id += 1; // Increment the id so the next shape is a unique variable
    },
    storageGet: function(name, array) {
        // Loop through all objects and retrieve them by var:name
        // If array = true
            // Return an array
            // Return a single object
        
        //for (var i in storage) {
        //    storage[i].draw();
        //}
    },
    random: function(max, min) {
        if (!min) min = 1;
        return Math.floor(Math.random() * (max - min) + min);
    },
    
    /* ----- Engine Setup -----*/
    setup: function() {
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.screen();
            
            this.init();
        }
        else {
            this.setupFail();
        }
    },
    setupFail: function() {
        // Place your response/logic here for users that can't load Canvas
        alert('Canvas has failed to load in your browser. Please download/run Google Chrome, then re-visit this URL.');
    },
    screen: function() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    init: function() {
        // Place your additional setup logic here
    },
    
    /* ----- Animation control -----*/
    draw: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Loop through every object in storage
        for (var i in this.storage) {            
            this.storage[i].update(); // Run update functions before drawing anything to prevent screen pops for recently spawned items
            this.storage[i].draw();
        }
    }
});


/*-----------
 Entity Pallete
-----------*/
var Entity = Class.extend({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        
        init: function() {
            // place extra setup code initiated before spawning here
        },
        update: function() {
            // place code before each draw sequence here
        },
        draw: function() {
            // Logic for drawing the object
        },
        spawn: function(x,y) {
                if (x) this.x = x;
                if (y) this.y = y; 
                this.init();
                return this;
        },
        kill: function() {
            for (var i in storage) {
                if(storage[i] == this) storage.splice(i,1);
            }
        }
});