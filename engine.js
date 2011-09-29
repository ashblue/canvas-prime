/*
Name: Canvas Prime
Version: pre-alpha
Author: Ashton Blue
Author URL: http://twitter.com/#!/ashbluewd
*/

/*----------
 Function library
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

// Loops through functions
function storageGet(property) {
        for (var i in storage) {
                storage[i].draw();
        }
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
        
        for (var i in storage) {
                storage[i].init();
        }
        
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
function Entity(values) {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        
        // Use array to construct values
        if (!values) values = {};
        for (var i in values) {
                this[i] = values[i];
        }
        
        // Place new element into storage
        storage.push(this);
}
Entity.prototype.init = function() { // 1 time setup container

};
Entity.prototype.update = function() { // Controls entity logic
        
};
Entity.prototype.draw = function() { // Output for literally drawing the item on Canvas
        
};
Entity.prototype.kill = function() { // Remove "this" from storage array        
        for (var i in storage) {
                if(storage[i] == this)
                        storage.splice(i,1);
        }
};