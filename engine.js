/*
Name: Canvas Prime
Version: Alpha
Author: Ashton Blue
Author URL: http://twitter.com/#!/ashbluewd
*/

/*----------
 Core library
----------*/
// How to figure out what a user's computer can handle for frames with fallbacks
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       || 
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


/*----------
 Function library
----------*/
// Loops through objects
function storageGet(property) {
        for (var i in storage) {
                storage[i].draw();
        }
}

// Spawn an entity
var id = 0;
function spawnEntity(name,x,y) {
        window['id' + id] = eval(new name);
        window['id' + id].spawn(x,y);
        id += 1;
}

// Generate a random number from min to max
// Defaults to 1 for min
function random(max,min) {
        if (!min) min = 1;
        return Math.floor(Math.random() * (max - min) + min);
}


/*---------
 Core game logic
---------*/
var canvas;
var ctx;
var storage = new Array();

function Core(startValues) {
        this.width = 500;
        this.height = 500;
        this.id = 'canvas';
        
        if (!startValues) startValues = {};
        for (var i in startValues) {
                this[i] = startValues[i];
        }
        
        canvas = document.getElementById(this.id);
        
        this.start();
}
Core.prototype.start = function() {
        if (canvas.getContext) {
                ctx = canvas.getContext('2d');
                this.init();
        }
}
Core.prototype.init = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        
        animate();
}

function animate(current) {
        requestAnimFrame( animate );
        draw();
}

function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        // Update then draw each entity
        // Might need a seperate loop for update, but I don't think so
        for (var i in storage) {
                storage[i].update();
                storage[i].draw();
        }
}


/*-----------
 Entity Pallete
-----------*/
var Entity = Class.extend({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        
        init: function() {
                
        },
        update: function() {
                
        },
        draw: function() {
                
        },
        spawn: function(x,y) {
                if (x) this.x = x;
                if (y) this.y = y; 
                this.init();
                storage.push(this);
        },
        kill: function() {
                for (var i in storage) {
                        if(storage[i] == this) storage.splice(i,1);
                }
        }
});