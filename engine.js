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
        //storage[0].draw();
        for (var i in storage) {
                storage[i].draw();
        }
}


/*---------
 Core game logic
---------*/
window.onload = function() { start(); }

var canvas = document.getElementById('canvas');
var ctx;
var storage = new Array();

function start() {
        if (canvas.getContext) {
                ctx = canvas.getContext('2d');
                init();
        }
}

function init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        for (var i in storage) {
                storage[i].init();
        }
        
        animate();
}

function animate() {
        requestAnimFrame( animate );
        draw();
}

function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        // get each entity update
        for (var i in storage) {
                storage[i].update();
        }
        
        // get each entity draw
        for (var i in storage) {
                storage[i].draw();
        }
}


/*-----------
 Entity Pallete
-----------*/
function Entity() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        
        // Could place an array constructor here
        storage.push(this); // Will need to manually remove killed entities since they stay in memory due to this method
}
Entity.prototype.init = function(x,y,width,height) { // 1 time setup container
        
}
Entity.prototype.update = function() { // Controls entity logic
        
}
Entity.prototype.draw = function() { // Output for literally drawing the item on Canvas
        
}
Entity.prototype.kill = function() {
        // Logic should remove "this" from storage array
}


/*------------
 Entity Objects
------------*/
var background = new Entity();
//var background = { width: canvas.width, height: canvas.height };
background.draw = function() {
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x,this.y,canvas.width,canvas.height);
}