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

function getMethods(key,method) {
        for (var key in method) {
           if (method.hasOwnProperty(key)) {
             var obj = method[key];
             for (var prop in obj) {
               if (obj.hasOwnProperty(prop)) {
                 alert(prop + " = " + obj[prop]);
               }
             }
           }
        }
}


/*---------
 Core game logic
---------*/
window.onload = function() { start(); }

var canvas = document.getElementById('canvas');
var ctx;
function start() {
        if (canvas.getContext) {
                ctx = canvas.getContext('2d');
                init();
        }
}

function init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // get each entity init
        //background.init();
        getMethods(Entity,init);
        
        animate();
}

function animate() {
        requestAnimFrame( animate );
        draw();
}

function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        // get each entity update
        // get each entity draw
        background.draw();
}


/*-----------
 Entity Pallete
-----------*/
function Entity() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
}
Entity.prototype.init = function(x,y,width,height) { // 1 time setup container
        
}
Entity.prototype.update = function() { // Controls entity logic
        
}
Entity.prototype.draw = function() { // Output for literally drawing the item on Canvas
        
}


/*------------
 Entity Objects
------------*/
var background = new Entity();
background.init = function() {
        this.width = 500;
        this.height = 500;
}
background.draw = function() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0,this.width,this.height);
}